import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({ region: "il-central-1" });

export interface ArticleFinishedPayload {
  url: string;
  articleId: string;
  title: string;
}

export async function notifyArticleFinished(
  topicArn: string,
  payload: ArticleFinishedPayload
): Promise<void> {
  try {
    await sns.send(
      new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(payload),
        Subject: "Article created",
      })
    );
  } catch (error) {
    console.error(error);
  }
}

export interface ArticleFailedPayload {
  reason: string;
}

export async function notifyArticleFailed(
  topicArn: string,
  payload: ArticleFailedPayload
): Promise<void> {
  try {
    await sns.send(
      new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify({
          ...payload,
          sqsTemplate: '{ "topic": "[ENTER TITLE HERE]" }',
        }),
        Subject: "Article creation failed",
      })
    );
  } catch (error) {
    console.error(error);
  }
}
