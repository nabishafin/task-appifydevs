import type { PromptCategoryMeta, PromptTemplate } from "@/types/prompts";

export const PROMPT_CATEGORIES: PromptCategoryMeta[] = [
  { id: "writing", label: "Writing", description: "Draft, edit and polish text" },
  { id: "coding", label: "Coding", description: "Review, explain and refactor code" },
  { id: "research", label: "Research", description: "Summarize and synthesize sources" },
  { id: "business", label: "Business", description: "Plans, emails and strategy" },
  { id: "productivity", label: "Productivity", description: "Organize work and decisions" },
  { id: "creative", label: "Creative Work", description: "Ideas, stories and naming" },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "tighten-draft",
    title: "Tighten a draft",
    description: "Cut filler, fix flow and keep your voice intact.",
    category: "writing",
    prompt:
      "Edit the following text to be clearer and about 30% shorter. Keep my tone and any technical terms. Return the edited version, then a short list of the main changes.\n\n{{text}}",
    surfaces: ["app", "extension"],
    uses: 12840,
  },
  {
    id: "tone-shift",
    title: "Change the tone",
    description: "Rewrite text for a different audience or mood.",
    category: "writing",
    prompt:
      "Rewrite this for {{audience}} in a {{tone}} tone. Keep every fact, remove jargon they would not know.\n\n{{text}}",
    surfaces: ["app", "extension"],
    uses: 9120,
  },
  {
    id: "blog-outline",
    title: "Blog post outline",
    description: "Turn a topic into a structured, skimmable outline.",
    category: "writing",
    prompt:
      "Create a blog post outline about {{topic}} for {{audience}}. Include a working title, a one-line hook, 5–7 H2 sections with 2 bullet points each, and a closing call to action.",
    surfaces: ["app"],
    uses: 7310,
  },
  {
    id: "code-review",
    title: "Review my code",
    description: "Find bugs, risky patterns and readability issues.",
    category: "coding",
    prompt:
      "Review this {{language}} code like a senior engineer. List bugs first, then performance and readability issues. For each, show the fix.\n\n{{code}}",
    surfaces: ["app", "extension"],
    uses: 15230,
  },
  {
    id: "explain-code",
    title: "Explain this code",
    description: "Understand unfamiliar code line by line.",
    category: "coding",
    prompt:
      "Explain what this code does, step by step, for someone who knows programming but not this codebase. Point out anything surprising.\n\n{{code}}",
    surfaces: ["app", "extension"],
    uses: 11020,
  },
  {
    id: "write-tests",
    title: "Write unit tests",
    description: "Generate focused tests with edge cases covered.",
    category: "coding",
    prompt:
      "Write unit tests for the following function using {{framework}}. Cover the happy path, edge cases and error handling. Keep each test small and well named.\n\n{{code}}",
    surfaces: ["app"],
    uses: 6480,
  },
  {
    id: "regex-helper",
    title: "Build a regex",
    description: "Describe a pattern in plain words, get a tested regex.",
    category: "coding",
    prompt:
      "Write a regular expression that matches {{description}}. Explain each part and give three matching and three non-matching examples.",
    surfaces: ["app"],
    uses: 3920,
  },
  {
    id: "summarize-article",
    title: "Summarize an article",
    description: "Key points, evidence and open questions in seconds.",
    category: "research",
    prompt:
      "Summarize this article in 5 bullet points, then list the strongest piece of evidence and one question the author leaves unanswered.\n\n{{text}}",
    surfaces: ["app", "extension"],
    uses: 18760,
  },
  {
    id: "compare-sources",
    title: "Compare two sources",
    description: "See where two sources agree, differ and conflict.",
    category: "research",
    prompt:
      "Compare these two sources. Show a table of claims where they agree, where they differ, and where evidence is missing.\n\nSource A:\n{{sourceA}}\n\nSource B:\n{{sourceB}}",
    surfaces: ["app"],
    uses: 4210,
  },
  {
    id: "literature-scan",
    title: "Research brief",
    description: "A structured starting point for any new topic.",
    category: "research",
    prompt:
      "Give me a research brief on {{topic}}: key concepts, main schools of thought, 5 influential sources to read first, and common misconceptions.",
    surfaces: ["app"],
    uses: 5630,
  },
  {
    id: "cold-email",
    title: "Cold outreach email",
    description: "Short, specific emails that earn a reply.",
    category: "business",
    prompt:
      "Write a cold email to {{recipient}} at {{company}} about {{offer}}. Under 120 words, one clear ask, no clichés. Give two subject line options.",
    surfaces: ["app", "extension"],
    uses: 8840,
  },
  {
    id: "meeting-notes",
    title: "Meeting notes to actions",
    description: "Turn messy notes into decisions and owners.",
    category: "business",
    prompt:
      "Turn these meeting notes into: 1) decisions made, 2) action items with owner and due date, 3) open questions. Keep it scannable.\n\n{{notes}}",
    surfaces: ["app", "extension"],
    uses: 10390,
  },
  {
    id: "swot",
    title: "SWOT analysis",
    description: "A balanced view of any product, team or idea.",
    category: "business",
    prompt:
      "Create a SWOT analysis for {{subject}}. Be specific and back each point with a short reason. End with the single most important next step.",
    surfaces: ["app"],
    uses: 4870,
  },
  {
    id: "daily-plan",
    title: "Plan my day",
    description: "Prioritize tasks around your energy and deadlines.",
    category: "productivity",
    prompt:
      "Here are my tasks for today: {{tasks}}. I have {{hours}} hours of focus time. Build a realistic schedule, flag what to drop, and suggest one quick win to start.",
    surfaces: ["app"],
    uses: 7650,
  },
  {
    id: "decision-matrix",
    title: "Decision matrix",
    description: "Weigh options against the criteria that matter.",
    category: "productivity",
    prompt:
      "Help me decide between {{options}}. Propose 4–5 weighted criteria, score each option in a table, and explain the result in two sentences.",
    surfaces: ["app"],
    uses: 3380,
  },
  {
    id: "reply-thread",
    title: "Reply to this thread",
    description: "Draft a clear reply to an email or message thread.",
    category: "productivity",
    prompt:
      "Draft a reply to this thread. Acknowledge the main point, answer every question asked, and propose a next step. Match the formality of the thread.\n\n{{thread}}",
    surfaces: ["extension"],
    uses: 9960,
  },
  {
    id: "page-faq",
    title: "Page to FAQ",
    description: "Turn any long page into quick questions and answers.",
    category: "productivity",
    prompt:
      "Turn the current page into 6 frequently asked questions with short, accurate answers based only on the page content.",
    surfaces: ["extension"],
    uses: 2940,
  },
  {
    id: "brainstorm",
    title: "Brainstorm ideas",
    description: "Wide-ranging ideas, grouped and ranked.",
    category: "creative",
    prompt:
      "Brainstorm 15 ideas for {{goal}}. Group them into themes, mark the 3 most promising, and explain why in one line each.",
    surfaces: ["app"],
    uses: 6720,
  },
  {
    id: "name-generator",
    title: "Name a product",
    description: "Memorable names with available-sounding domains.",
    category: "creative",
    prompt:
      "Suggest 12 names for {{product}}. Mix descriptive, abstract and compound styles. For each, add a one-line rationale and a possible .com variant.",
    surfaces: ["app"],
    uses: 4150,
  },
  {
    id: "social-post",
    title: "Social post from a page",
    description: "Share what you are reading in your own voice.",
    category: "creative",
    prompt:
      "Write a short LinkedIn post sharing the key insight from this page. Add a personal takeaway and end with a question for readers. No hashtags spam.",
    surfaces: ["extension"],
    uses: 5210,
  },
];

export function getPromptTemplate(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((template) => template.id === id);
}
