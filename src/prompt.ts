export const USER_PROMPT = `You are writing a backend / DevOps technical article.

You MUST strictly follow the STYLE DNA rules below.

Return the output in this exact structure:

1.  Article (640--690 words)
2.  Image Markers embedded in the article
3.  Image Instructions section
4.  SEO Package
5.  LinkedIn Version

Do not omit sections.

------------------------------------------------------------------------

# STYLE DNA (MANDATORY)

## Voice

-   Calm
-   Structured
-   Clear
-   Slightly conversational
-   No hype
-   No corporate tone

## Structure (Required)

### Phase 1 --- Conceptual Framing

-   Start with a zoom-out question or idea.
-   Define the problem conceptually.
-   Use one simple analogy.

### Phase 2 --- Practical Breakdown

-   Clean sections
-   Bullet points or numbered steps
-   Technical clarity

### Phase 3 --- Professional Depth

-   Explain common beginner mistake
-   Explain what professionals do differently
-   Clarify trade-offs

### Phase 4 --- Reality Anchor

-   Production considerations
-   Budget / scale / maintenance
-   Pragmatic conclusion

------------------------------------------------------------------------

# WORD COUNT RULE

-   640--690 words (strict)
-   If below 640 → expand with a practical example
-   If above 690 → compress redundancies

------------------------------------------------------------------------

# IMAGE PROMPT

Each article must contain 1 image.
After the article, include a detailed prompt that will instruct the  generation model on how to create the hero image of the article. The prompt must provide the context of the article. Include in the prompt the goal of the image (what it demonstrates) and what must be visible in the frame.

Wrap the image prompt with "[IMAGE_PROMPT_START]" and "[IMAGE_PROMPT_END]" to ease parsing.
Add an alt text and a caption. 
Wrap the alt text with "[ALT_TEXT_START]" and "[ALT_TEXT_END]" to ease parsing.
Wrap the caption with "[CAPTION_START]" and "[CAPTION_END]" to ease parsing.

------------------------------------------------------------------------

# HARD RULES

Do NOT use: - "In today's world" - "Game-changing" - "Revolutionary" -
Generic fluff

Must include: - One analogy - One beginner mistake - One
production-level insight - Structured formatting

------------------------------------------------------------------------

# TOPIC INPUT FORMAT

TOPIC: User input

AUDIENCE: Backend engineers (1--5 years experience)

ADDITIONAL INSTRUCTIONS: 
1) Do not show the actual "Phase 1 ...", "Phase 2 ..." titles, instead, think of titles that will be appropriate to the content of each phase.
2) Add the expressions [ARTICLE_START] and [ARTICLE_END] before and after the actual article accordingly. This will be used for later parsing and separating the actual article from the other instructions.
3) The article should start with a body text, not a title (the title is the actual topic that is inserted to this prompt)
4) Style as a quote 1-2 essential phrases that are suitable for a quote styling. Put them at the first and last 1/3 of the actual article part.
5) Use day-to-day language that a non-native english speaker from Israel or from France would use
6) always add at the end of an article (before the [ARTICLE_END] expression):
 "-----
 Written by Eytan Krief, Backend Engineer."

------------------------------------------------------------------------

Generate the full structured output now.`;
