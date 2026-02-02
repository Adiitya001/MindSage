// Input validation schemas using Zod

import { z } from "zod"

export const preferredModeSchema = z.enum(["gita", "quran", "bible", "none"])

export const updateUserPreferencesSchema = z.object({
  preferredMode: preferredModeSchema.optional(),
  name: z.string().min(1).max(100).optional(),
  avatarId: z.enum(["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5", "avatar-6", "avatar-7", "avatar-8"]).optional(),
})

export const createTherapistSchema = z.object({
  name: z.string().min(1).max(200),
  bio: z.string().min(10).max(2000),
  credentials: z.array(z.string().min(1).max(100)).min(1),
  specialties: z.array(z.string().min(1).max(100)).min(1),
  approach: z.string().min(10).max(1000),
  languages: z.array(z.string().min(1).max(50)).min(1),
  profileImage: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
})

export const updateTherapistSchema = createTherapistSchema.partial()

export const createCommunityPostSchema = z.object({
  title: z.string().min(1).max(200).optional().nullable(),
  content: z.string().min(10).max(5000),
  tag: z.string().min(1).max(50),
  isAnonymous: z.boolean().optional().default(false),
})

export const reactionTypeSchema = z.enum(["resonated"])

export const createReactionSchema = z.object({
  type: reactionTypeSchema,
})
