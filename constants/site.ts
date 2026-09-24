export const siteConfig = {
  name: "EchoGPT",
  tagline: "Every leading AI model. One calm workspace.",
  description:
    "EchoGPT brings GPT, Claude, Gemini, Mistral, DeepSeek and Llama into one fast workspace and a Chrome sidebar, so you can compare answers, reuse prompts and stay in flow.",
  email: "hello@echogpt.live",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://echogpt-redesign.vercel.app",
  links: {
    app: "/app",
    extension: "/extension",
    chromeStore: "https://chromewebstore.google.com/detail/echogpt-multi-ai-chat-sid/negimdcamohmoheiifgecbjgjepkcfhj",
    liveProduct: "https://echogpt.live/",
    github: "https://github.com",
    x: "https://x.com",
    linkedin: "https://www.linkedin.com",
    discord: "https://discord.com",
  },
} as const;
