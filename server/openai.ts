import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY environment variable is required. Get one at https://console.groq.com");
}

export const groq = new Groq({
  apiKey,
});

export const GROQ_MODEL = "openai/gpt-oss-120b";
