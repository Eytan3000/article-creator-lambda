import { createClient } from "@sanity/client";
import {
  markdownToPortableText,
  type PortableTextBlock,
} from "./markdown-to-portable-text.js";

const PROJECT_ID = process.env.SANITY_PROJECT_ID ?? "3scsmtvn";
const DATASET = process.env.SANITY_DATASET ?? "production";

export const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CreateArticleOptions {
  title: string;
  bodyMarkdown?: string;
  id?: string;
  /** If true, create as draft (ID prefixed with `drafts.`); review and publish in Studio. */
  draft?: boolean;
}

export async function createArticle(
  options: CreateArticleOptions
): Promise<{ _id: string; title: string }> {
  const { title, bodyMarkdown = "", id, draft = false } = options;
  const slug = slugify(title);
  const body: PortableTextBlock[] = markdownToPortableText(bodyMarkdown);
  const docId = id ?? `article-${slug}-${Date.now()}`;
  const documentId = draft ? `drafts.${docId}` : docId;

  const doc = {
    _id: documentId,
    _type: "article" as const,
    title,
    slug: { _type: "slug" as const, current: slug },
    body,
  };
  console.log("PROJECT_ID: ", PROJECT_ID); //removeEytan
  const result = await client.createOrReplace(doc);
  return { _id: result._id, title: result.title ?? title };
}
