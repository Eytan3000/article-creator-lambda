import type { Handler } from "aws-lambda";
import { createArticle, client, slugify } from "./create-article";
import { USER_PROMPT } from "./prompt";
import { fetchMessageFromSqs, deleteSqsMessage } from "./fetch-sqs-message";
import OpenAI from "openai";

// const OPENAI_MODEL = "gpt-5.2-pro";
const OPENAI_MODEL = "gpt-4.1";
const IMAGE_MODEL = "gpt-image-1.5";

export interface LambdaResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

export const handler: Handler<
  unknown,
  LambdaResponse
> = async (): Promise<LambdaResponse> => {
  const queueUrl = process.env.SQS_QUEUE_URL;
  console.log("queueUrl", queueUrl);
  if (!queueUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SQS_QUEUE_URL is not set" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const message = await fetchMessageFromSqs(queueUrl);
  console.log("message: ", message); //removeEytan
  if (!message) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "No message in queue" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const { topic, receiptHandle } = message;
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OPENAI_API_KEY is not set" }),
        headers: { "Content-Type": "application/json" },
      };
    }
    if (!process.env.SANITY_API_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "SANITY_API_TOKEN is not set" }),
        headers: { "Content-Type": "application/json" },
      };
    }
    if (!topic || topic.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "topic is required" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const openai = new OpenAI({ apiKey });
    console.info("Getting content...");

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "user", content: USER_PROMPT },
        { role: "user", content: `TOPIC: ${topic}` },
      ],
    });

    const content =
      completion.choices[0]?.message?.content ?? "No content generated.";

    const title = topic || "Untitled Article";
    const article =
      content.match(/\[ARTICLE_START\](.*?)\[ARTICLE_END\]/s)?.[1]?.trim() ??
      "No article content generated.";
    const imagePrompt =
      content
        .match(/\[IMAGE_PROMPT_START\](.*?)\[IMAGE_PROMPT_END\]/s)?.[1]
        ?.trim() ?? "No image prompt generated.";

    const imageAltText =
      content.match(/\[ALT_TEXT_START\](.*?)\[ALT_TEXT_END\]/s)?.[1]?.trim() ??
      "No alt text generated.";
    const imageCaption =
      content.match(/\[CAPTION_START\](.*?)\[CAPTION_END\]/s)?.[1]?.trim() ??
      "No caption generated.";

    const imageResult = await openai.images.generate({
      model: IMAGE_MODEL,
      prompt: imagePrompt,
    });

    const b64 = imageResult.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error("No image data returned from OpenAI");
    }
    const buffer = Buffer.from(b64, "base64");
    const slug = slugify(title);
    const asset = await client.assets.upload("image", buffer, {
      contentType: "image/png",
      filename: `hero-${slug}.png`,
    });

    const created = await createArticle({
      title,
      bodyMarkdown: article,
      heroImageAssetId: asset._id,
      heroImageAlt: imageAltText,
      heroImageCaption: imageCaption,
    });

    await deleteSqsMessage(queueUrl, receiptHandle);

    return {
      statusCode: 200,
      body: JSON.stringify({
        articleId: created._id,
        title: created.title,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
