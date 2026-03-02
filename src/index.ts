import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import OpenAI from "openai";
import { createArticle } from "./create-article.js";
import { USER_PROMPT } from "./prompt.js";

// const OPENAI_MODEL = "gpt-5.2-pro";
const OPENAI_MODEL = "gpt-4.1";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const topic = (event.queryStringParameters?.topic as string) ?? "";
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

    // const completion = await openai.chat.completions.create({
    //   model: OPENAI_MODEL,
    //   messages: [
    //     { role: "user", content: USER_PROMPT },
    //     { role: "user", content: `TOPIC: ${topic}` },
    //   ],
    // });

    // data-snapshot-stub-start: const content =
    /* eslint-disable */
    const content = JSON.parse(
      (await import("fs")).readFileSync(
        "/Users/eytankrief/Dropbox/Coding/articles/article-creator-lambda/.snapshots/snapshots/handler_content_2026-03-02T13-34-39-231Z.json",
        "utf8"
      )
    ).variables["content"];
    /* eslint-enable */
    // data-snapshot-stub-end
    // completion.choices[0]?.message?.content?.trim() ?? "No content generated.";

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
    console.error("Article creator error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
