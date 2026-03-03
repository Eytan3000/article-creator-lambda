import type { Handler } from "aws-lambda";
import { createArticle } from "./create-article";
import { USER_PROMPT } from "./prompt";
import OpenAI from "openai";

// const OPENAI_MODEL = "gpt-5.2-pro";
const OPENAI_MODEL = "gpt-4.1";

export interface LambdaResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

export const handler: Handler<unknown, LambdaResponse> = async (
  event: unknown
): Promise<LambdaResponse> => {
  const { topic } = event as { topic: string };
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
      completion.choices[0]?.message?.content?.trim() ??
      "No content generated.";

    const title = topic || "Untitled Article";

    const created = await createArticle({
      title,
      bodyMarkdown: content,
    });

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
