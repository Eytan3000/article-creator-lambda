import type { APIGatewayProxyHandler } from "aws-lambda";
import OpenAI from "openai";
import { createArticle } from "./create-article.js";

// const OPENAI_MODEL = "gpt-5.2-pro";
const OPENAI_MODEL = "gpt-4.1";

const MOCK_PROMPT =
  "Write a short article (2–3 paragraphs) about the benefits of automated content creation. Use markdown.";

export const handler: APIGatewayProxyHandler = async () => {
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

    const openai = new OpenAI({ apiKey });
    // data-snapshot-stub-start: const completion = await openai.chat.completions.create({
    /* eslint-disable */
    const completion = JSON.parse(
      (await import("fs")).readFileSync(
        "/Users/eytankrief/Dropbox/Coding/articles/article-creator-lambda/.snapshots/snapshots/handler_completion_2026-03-01T21-27-15-417Z.json",
        "utf8"
      )
    ).variables["completion"];
    /* eslint-enable */
    // data-snapshot-stub-end
    //   model: OPENAI_MODEL,
    //   messages: [{ role: "user", content: MOCK_PROMPT }],
    // });

    const content =
      completion.choices[0]?.message?.content?.trim() ??
      "No content generated.";
    const firstLine = content.split(/\n/)[0] ?? "Untitled Article";
    const title = firstLine.replace(/^#+\s*/, "").trim() || "Untitled Article";

    const created = await createArticle({
      title,
      bodyMarkdown: content,
      draft: true,
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
