import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

const sqs = new SQSClient({});

export interface SqsMessagePayload {
  topic: string;
}

export interface FetchedSqsMessage {
  topic: string;
  receiptHandle: string;
}

/**
 * Receives a single message from the SQS queue and parses the body as { topic: string }.
 * Returns null if no message is available.
 */
export async function fetchMessageFromSqs(
  queueUrl: string
): Promise<FetchedSqsMessage | null> {
  const { Messages } = await sqs.send(
    new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 1,
    })
  );

  const message = Messages?.[0];
  if (!message?.Body || !message.ReceiptHandle) {
    return null;
  }

  const payload = JSON.parse(message.Body) as SqsMessagePayload;
  if (!payload.topic || typeof payload.topic !== "string") {
    throw new Error("SQS message body must contain a string 'topic' field");
  }

  return {
    topic: payload.topic,
    receiptHandle: message.ReceiptHandle,
  };
}

/**
 * Deletes a message from the queue after successful processing.
 */
export async function deleteSqsMessage(
  queueUrl: string,
  receiptHandle: string
): Promise<void> {
  await sqs.send(
    new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    })
  );
}
