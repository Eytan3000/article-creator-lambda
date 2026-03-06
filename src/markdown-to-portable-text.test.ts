import { describe, expect, it } from "vitest";
import { markdownToPortableText } from "./markdown-to-portable-text";

describe("markdownToPortableText", () => {
  it("replaces em dash with spaced hyphen", () => {
    const blocks = markdownToPortableText("Hello—world");
    expect(blocks[0].children[0].text).toBe("Hello - world");
  });
});
