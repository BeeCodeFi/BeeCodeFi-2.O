import { z } from "zod";

export const loopStageKeySchema = z.enum(["read", "practice", "quiz", "build"]);
export type LoopStageKey = z.infer<typeof loopStageKeySchema>;

export const loopStageStateSchema = z.enum(["locked", "available", "in_progress", "done"]);
export type LoopStageState = z.infer<typeof loopStageStateSchema>;

export const lessonSectionSummarySchema = z.object({
  id: z.string().uuid(),
  anchor: z.string(),
  orderIndex: z.number().int(),
  minDwellSeconds: z.number().int(),
});
export type LessonSectionSummary = z.infer<typeof lessonSectionSummarySchema>;

export const lessonStageStatesSchema = z.object({
  read: loopStageStateSchema,
  practice: loopStageStateSchema,
  quiz: loopStageStateSchema,
  build: loopStageStateSchema,
});
export type LessonStageStates = z.infer<typeof lessonStageStatesSchema>;

export const lessonSummarySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  orderIndex: z.number().int(),
  stages: lessonStageStatesSchema.nullable(),
});
export type LessonSummary = z.infer<typeof lessonSummarySchema>;

export const moduleSummarySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  orderIndex: z.number().int(),
  lessons: z.array(lessonSummarySchema),
});
export type ModuleSummary = z.infer<typeof moduleSummarySchema>;

export const courseSummarySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
});
export type CourseSummary = z.infer<typeof courseSummarySchema>;

export const courseDetailSchema = courseSummarySchema.extend({
  modules: z.array(moduleSummarySchema),
});
export type CourseDetail = z.infer<typeof courseDetailSchema>;

export const lessonQuizSummarySchema = z.object({
  id: z.string().uuid(),
  questionsServed: z.number().int(),
  passThreshold: z.number(),
});

export const lessonTaskSummarySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  briefCdnPath: z.string(),
  starterCodeCdnPath: z.string(),
  requiresUpload: z.boolean(),
});

export const lessonDetailSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  cdnPath: z.string(),
  estReadMinutes: z.number().int(),
  courseSlug: z.string(),
  moduleSlug: z.string(),
  sections: z.array(lessonSectionSummarySchema),
  quiz: lessonQuizSummarySchema.nullable(),
  task: lessonTaskSummarySchema.nullable(),
  stages: lessonStageStatesSchema.nullable(),
});
export type LessonDetail = z.infer<typeof lessonDetailSchema>;
