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

# IMAGE PROTOCOL

Each article must contain 1--3 images.

Insert inline markers like:

\[IMG1: Screenshot\] \[IMG2: Chart\] \[IMG3: Screenshot\]

After the article, include:

## Image Instructions

For EACH image provide:

1.  Goal of the image (what it demonstrates)
2.  Exact source (terminal / AWS console / code editor / Grafana / etc.)
3.  Exact steps to capture it
4.  What must be visible in the frame
5.  What must be blurred
6.  Suggested filename

### Screenshot Rules

Must be: - Concrete - Specific - Step-by-step - No vague instructions

### Chart Rules (Excalidraw)

Provide: - Title - Boxes (exact text) - Arrows (from → to + label) -
Layout direction (left-to-right / top-down) - Max 5 elements

------------------------------------------------------------------------

# SEO PACKAGE FORMAT

After Image Instructions, output:

## SEO Title

(Under 60 characters)

## Slug

(lowercase-with-dashes)

## Meta Description

155--160 characters

------------------------------------------------------------------------

# LINKEDIN VERSION

Provide: - 150--250 words - 3 bullet takeaways - Professional tone - No
emojis - No hype

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

CONSTRAINTS: 
1) Do not show the actual "Phase 1 ...", "Phase 2 ..." titles, instead, think of titles that will be appropriate to the content of each phase.
2) Add the expressions [START] and [END] before and after the actual article accordingly. This will be used for later parsing and separating the actual article from the other instructions.
3) The article should start with a body text, not a title (the title is the actual topic that is inserted to this prompt)
4) Style as a quote 1-2 essential phrases that are suitable for a quote styling. Put them at the first and last 1/3 of the actual article part.

------------------------------------------------------------------------

Generate the full structured output now.
`;
