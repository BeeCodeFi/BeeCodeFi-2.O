import { z } from "zod";
import { lessonStageStatesSchema } from "./content";

export const sectionReadInputSchema = z.object({
  sectionId: z.string().uuid(),
  dwellSeconds: z.number().int().min(0).max(24 * 60 * 60),
  maxScrollPct: z.number().min(0).max(100),
});
export type SectionReadInput = z.infer<typeof sectionReadInputSchema>;

export const sectionReadsRequestSchema = z.object({
  reads: z.array(sectionReadInputSchema).min(1).max(100),
});
export type SectionReadsRequest = z.infer<typeof sectionReadsRequestSchema>;

export const checkpointRequestSchema = z.object({
  lessonId: z.string().uuid(),
  questionId: z.string(),
  answer: z.string(),
});
export type CheckpointRequest = z.infer<typeof checkpointRequestSchema>;

export const lessonProgressGridItemSchema = z.object({
  lessonId: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  moduleSlug: z.string(),
  stages: lessonStageStatesSchema,
  completedAt: z.string().datetime().nullable(),
});
export type LessonProgressGridItem = z.infer<typeof lessonProgressGridItemSchema>;

export const courseProgressResponseSchema = z.object({
  courseSlug: z.string(),
  percentComplete: z.number().min(0).max(100),
  lessons: z.array(lessonProgressGridItemSchema),
});
export type CourseProgressResponse = z.infer<typeof courseProgressResponseSchema>;

export const progressSummaryResponseSchema = z.object({
  coursesStarted: z.number().int(),
  resume: z
    .object({
      courseSlug: z.string(),
      moduleSlug: z.string(),
      lessonSlug: z.string(),
      stage: z.enum(["read", "practice", "quiz", "build"]),
    })
    .nullable(),
});
export type ProgressSummaryResponse = z.infer<typeof progressSummaryResponseSchema>;
