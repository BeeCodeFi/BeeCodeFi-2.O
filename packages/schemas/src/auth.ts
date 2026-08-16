import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(80),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const userSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "bee", "system"]).default("system"),
  editorPrefs: z.record(z.string(), z.unknown()).default({}),
  dailyGoalMinutes: z.number().int().positive().max(1440).default(30),
});
export type UserSettings = z.infer<typeof userSettingsSchema>;

export const userRoleSchema = z.enum(["learner", "author", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const meResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string(),
  avatarUrl: z.string().url().nullable(),
  role: userRoleSchema,
  emailVerified: z.boolean(),
  settings: userSettingsSchema,
  github: z
    .object({
      connected: z.boolean(),
      login: z.string().nullable(),
    })
    .optional(),
});
export type MeResponse = z.infer<typeof meResponseSchema>;
