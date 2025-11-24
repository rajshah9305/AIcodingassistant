import { z } from "zod";
import { router, publicProcedure } from "./trpc";
import { groq, GROQ_MODEL } from "./openai";
import { observable } from "@trpc/server/observable";

export const appRouter = router({
  analyzeCode: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Code is required"),
        language: z.string().default("javascript"),
      })
    )
    .mutation(async ({ input }) => {
      const prompt = `You are an expert code analyzer. Analyze this ${input.language} code and provide:
1. Complexity score (0-100)
2. Security score (0-100)
3. Performance score (0-100)
4. List of specific issues with severity (CRITICAL, WARN, INFO)

Provide response in JSON format:
{
  "complexity": number,
  "security": number,
  "performance": number,
  "issues": [{"type": "CRITICAL|WARN|INFO", "text": "description"}]
}

Code:
${input.code}`;

      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_completion_tokens: 2048,
      });

      const content = completion.choices[0].message.content || "{}";
      
      try {
        const parsed = JSON.parse(content);
        return {
          complexity: parsed.complexity || 50,
          security: parsed.security || 50,
          performance: parsed.performance || 50,
          issues: parsed.issues || [],
        };
      } catch {
        return {
          complexity: 50,
          security: 50,
          performance: 50,
          issues: [{ type: "INFO", text: content }],
        };
      }
    }),

  refactorCode: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Code is required"),
        language: z.string().default("javascript"),
        strategy: z.enum(["CLEAN", "PERFORMANCE", "SECURE"]).default("CLEAN"),
      })
    )
    .subscription(({ input }) => {
      return observable<{ chunk: string; done: boolean }>((emit) => {
        const strategies = {
          CLEAN: "Focus on code cleanliness, readability, and maintainability. Remove code smells.",
          PERFORMANCE: "Optimize for performance. Improve algorithms, reduce complexity, eliminate bottlenecks.",
          SECURE: "Enhance security. Fix vulnerabilities, add input validation, follow security best practices.",
        };

        const prompt = `Refactor this ${input.language} code. Strategy: ${strategies[input.strategy]}

Provide ONLY the refactored code with inline comments explaining changes. No explanations outside the code.

Original code:
${input.code}`;

        (async () => {
          try {
            const stream = await groq.chat.completions.create({
              model: GROQ_MODEL,
              messages: [{ role: "user", content: prompt }],
              temperature: 0.5,
              max_completion_tokens: 4096,
              stream: true,
            });

            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || "";
              if (content) {
                emit.next({ chunk: content, done: false });
              }
            }
            emit.next({ chunk: "", done: true });
            emit.complete();
          } catch (error) {
            emit.error(error);
          }
        })();
      });
    }),



  generateCode: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1, "Prompt is required"),
        language: z.string().default("javascript"),
      })
    )
    .subscription(({ input }) => {
      return observable<{ chunk: string; done: boolean }>((emit) => {
        const systemPrompt = `You are an expert ${input.language} developer. Generate clean, production-ready code based on requirements. Include helpful comments.

Requirement: ${input.prompt}`;

        (async () => {
          try {
            const stream = await groq.chat.completions.create({
              model: GROQ_MODEL,
              messages: [{ role: "user", content: systemPrompt }],
              temperature: 0.7,
              max_completion_tokens: 4096,
              stream: true,
            });

            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || "";
              if (content) {
                emit.next({ chunk: content, done: false });
              }
            }
            emit.next({ chunk: "", done: true });
            emit.complete();
          } catch (error) {
            emit.error(error);
          }
        })();
      });
    }),

  chat: publicProcedure
    .input(
      z.object({
        message: z.string().min(1, "Message is required"),
        history: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          )
          .default([]),
      })
    )
    .subscription(({ input }) => {
      return observable<{ chunk: string; done: boolean }>((emit) => {
        const messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
          {
            role: "system",
            content: "You are an expert AI coding assistant. Help with code analysis, debugging, architecture, and best practices. Be concise and practical.",
          },
          ...input.history,
          { role: "user", content: input.message },
        ];

        (async () => {
          try {
            const stream = await groq.chat.completions.create({
              model: GROQ_MODEL,
              messages,
              temperature: 0.7,
              max_completion_tokens: 2048,
              stream: true,
            });

            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || "";
              if (content) {
                emit.next({ chunk: content, done: false });
              }
            }
            emit.next({ chunk: "", done: true });
            emit.complete();
          } catch (error) {
            emit.error(error);
          }
        })();
      });
    }),
});

export type AppRouter = typeof appRouter;
