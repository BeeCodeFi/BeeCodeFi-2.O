import { z } from "zod";

export const editorCodeSchema = z.object({
  html: z.string().max(50_000).default(""),
  css: z.string().max(50_000).default(""),
  js: z.string().max(50_000).default(""),
});
export type EditorCode = z.infer<typeof editorCodeSchema>;

export const putSnapshotRequestSchema = z.object({
  code: editorCodeSchema,
  isManual: z.boolean().default(false),
});
export type PutSnapshotRequest = z.infer<typeof putSnapshotRequestSchema>;

export const snapshotResponseSchema = z.object({
  code: editorCodeSchema,
  starterCode: editorCodeSchema,
  savedAt: z.string().datetime().nullable(),
  isStarter: z.boolean(),
});
export type SnapshotResponse = z.infer<typeof snapshotResponseSchema>;
