import { z } from "zod";

export const submissionMethodSchema = z.enum(["upload", "onsite_editor", "github"]);
export type SubmissionMethod = z.infer<typeof submissionMethodSchema>;

export const submissionStatusSchema = z.enum(["submitted", "auto_checked", "passed", "needs_rework"]);
export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;

export const onsiteEditorSubmissionRequestSchema = z.object({
  method: z.literal("onsite_editor"),
  code: z.object({
    html: z.string().max(50_000),
    css: z.string().max(50_000).default(""),
    js: z.string().max(50_000).default(""),
  }),
});
export type OnsiteEditorSubmissionRequest = z.infer<typeof onsiteEditorSubmissionRequestSchema>;

export const autoCheckIssueSchema = z.object({
  code: z.string(),
  message: z.string(),
});
export type AutoCheckIssue = z.infer<typeof autoCheckIssueSchema>;

export const autoCheckReportSchema = z.object({
  passed: z.boolean(),
  issues: z.array(autoCheckIssueSchema),
});
export type AutoCheckReport = z.infer<typeof autoCheckReportSchema>;

export const taskDetailSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  briefCdnPath: z.string(),
  starterCodeCdnPath: z.string(),
  requiresUpload: z.boolean(),
  latestSubmission: z
    .object({
      id: z.string().uuid(),
      method: submissionMethodSchema,
      status: submissionStatusSchema,
      autoCheckReport: autoCheckReportSchema.nullable(),
      submittedAt: z.string().datetime(),
    })
    .nullable(),
});
export type TaskDetail = z.infer<typeof taskDetailSchema>;

export const submissionResponseSchema = z.object({
  id: z.string().uuid(),
  status: submissionStatusSchema,
  autoCheckReport: autoCheckReportSchema.nullable(),
});
export type SubmissionResponse = z.infer<typeof submissionResponseSchema>;
