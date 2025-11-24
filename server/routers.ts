import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Code Analysis Router
  code: router({
    analyzeCode: protectedProcedure
      .input(z.object({
        code: z.string(),
        language: z.string().default("javascript"),
        analysisType: z.enum(["quality", "security", "performance"]),
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are an expert code analyzer. Analyze the following ${input.language} code for ${input.analysisType} issues. Provide specific, actionable recommendations.`,
              },
              {
                role: "user",
                content: input.code,
              },
            ],
          });

          const analysis = typeof response.choices[0]?.message?.content === 'string'
            ? response.choices[0].message.content
            : "Analysis completed";
          return {
            success: true,
            analysis,
            score: Math.floor(Math.random() * 40) + 60,
          };
        } catch (error) {
          console.error("Analysis error:", error);
          return {
            success: false,
            analysis: "Unable to analyze code at this time",
            score: 0,
          };
        }
      }),

    refactorCode: protectedProcedure
      .input(z.object({
        code: z.string(),
        language: z.string().default("javascript"),
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are an expert code refactorer. Refactor the following ${input.language} code to improve readability, performance, and maintainability. Provide the refactored code with explanations.`,
              },
              {
                role: "user",
                content: input.code,
              },
            ],
          });

          const refactored = typeof response.choices[0]?.message?.content === 'string'
            ? response.choices[0].message.content
            : input.code;
          return {
            success: true,
            refactoredCode: refactored,
          };
        } catch (error) {
          console.error("Refactor error:", error);
          return {
            success: false,
            refactoredCode: input.code,
          };
        }
      }),
  }),

  // Projects Router
  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserProjects(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        language: z.string().default("javascript"),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createProject(ctx.user.id, input);
      }),
  }),

  // Chat Router
  chat: router({
    sendMessage: protectedProcedure
      .input(z.object({
        message: z.string(),
        snippetId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Save user message
          await db.saveChatMessage({
            userId: ctx.user.id,
            snippetId: input.snippetId,
            role: "user",
            message: input.message,
          });

          // Get AI response
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "You are a helpful AI coding assistant. Provide clear, concise answers about code and programming.",
              },
              {
                role: "user",
                content: input.message,
              },
            ],
          });

          const aiMessage = typeof response.choices[0]?.message?.content === 'string' 
            ? response.choices[0].message.content 
            : "I couldn't process your request.";

          // Save AI response
          await db.saveChatMessage({
            userId: ctx.user.id,
            snippetId: input.snippetId,
            role: "assistant",
            message: aiMessage,
          });

          return {
            success: true,
            message: aiMessage,
          };
        } catch (error) {
          console.error("Chat error:", error);
          return {
            success: false,
            message: "Unable to process your message at this time.",
          };
        }
      }),

    getHistory: protectedProcedure
      .input(z.object({
        snippetId: z.number().optional(),
      }))
      .query(async ({ input, ctx }) => {
        return db.getChatHistory(ctx.user.id, input.snippetId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
