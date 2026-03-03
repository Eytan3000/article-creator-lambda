import { createClient } from "@sanity/client";
import {
  markdownToPortableText,
  type PortableTextBlock,
} from "./markdown-to-portable-text.js";

const PROJECT_ID = "3scsmtvn";
const DATASET = "production";

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
  /** Sanity asset _id of the hero image (from client.assets.upload). */
  heroImageAssetId?: string;
  /** Alt text for the hero image (accessibility). */
  heroImageAlt?: string;
  /** Caption for the hero image. */
  heroImageCaption?: string;
}

export async function createArticle(
  options: CreateArticleOptions
): Promise<{ _id: string; title: string }> {
  const { title, bodyMarkdown = "", id, heroImageAssetId, heroImageAlt, heroImageCaption } = options;
  const slug = slugify(title);
  const body: PortableTextBlock[] = markdownToPortableText(bodyMarkdown);
  const docId = id ?? `article-${slug}-${Date.now()}`;

  const doc = {
    _id: docId,
    _type: "event" as const,
    title: `[Draft] ${title}`,
    slug: { _type: "slug" as const, current: slug },
    body,
    ...(heroImageAssetId && {
      mainImage: {
        _type: "image" as const,
        asset: { _type: "reference" as const, _ref: heroImageAssetId },
        ...(heroImageAlt && { alt: heroImageAlt }),
        ...(heroImageCaption && { caption: heroImageCaption }),
      },
    }),
  };

  const result = await client.createOrReplace(doc);
  return { _id: result._id, title: result.title ?? title };
}
