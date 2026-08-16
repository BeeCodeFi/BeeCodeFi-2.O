import { z } from "zod";

export const questionTypeSchema = z.enum(["mcq", "multi", "fill_blank", "fix_code", "order_steps"]);
export type QuestionType = z.infer<typeof questionTypeSchema>;

export const questionDifficultySchema = z.enum(["easy", "medium", "hard"]);
export type QuestionDifficulty = z.infer<typeof questionDifficultySchema>;

// What the client receives when starting an attempt — no answer key.
export const attemptQuestionSchema = z.object({
  id: z.string().uuid(),
  qtype: questionTypeSchema,
  difficulty: questionDifficultySchema,
  payloadCdnPath: z.string(),
});
export type AttemptQuestion = z.infer<typeof attemptQuestionSchema>;

export const startAttemptResponseSchema = z.object({
  attemptId: z.string().uuid(),
  attemptNo: z.number().int(),
  questions: z.array(attemptQuestionSchema),
});
export type StartAttemptResponse = z.infer<typeof startAttemptResponseSchema>;

export const submitAnswerSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.union([z.string(), z.array(z.string())]),
});
export type SubmitAnswer = z.infer<typeof submitAnswerSchema>;

export const submitAttemptRequestSchema = z.object({
  answers: z.array(submitAnswerSchema).min(1),
});
export type SubmitAttemptRequest = z.infer<typeof submitAttemptRequestSchema>;

export const attemptResultItemSchema = z.object({
  questionId: z.string().uuid(),
  correct: z.boolean(),
  explanationCdnPath: z.string().nullable(),
});
export type AttemptResultItem = z.infer<typeof attemptResultItemSchema>;

export const submitAttemptResponseSchema = z.object({
  score: z.number().min(0).max(1),
  passed: z.boolean(),
  results: z.array(attemptResultItemSchema),
});
export type SubmitAttemptResponse = z.infer<typeof submitAttemptResponseSchema>;

export const practicePoolResponseSchema = z.object({
  questions: z.array(attemptQuestionSchema),
});
export type PracticePoolResponse = z.infer<typeof practicePoolResponseSchema>;
