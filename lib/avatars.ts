/**
 * Predefined avatar system
 * Avatars are identified by IDs, stored in user profile
 */

export type AvatarId = "avatar-1" | "avatar-2" | "avatar-3" | "avatar-4" | "avatar-5" | "avatar-6" | "avatar-7" | "avatar-8"

export const AVATARS: { id: AvatarId; emoji: string; name: string }[] = [
  { id: "avatar-1", emoji: "🌙", name: "Moon" },
  { id: "avatar-2", emoji: "🌟", name: "Star" },
  { id: "avatar-3", emoji: "🌊", name: "Wave" },
  { id: "avatar-4", emoji: "🌸", name: "Blossom" },
  { id: "avatar-5", emoji: "🍃", name: "Leaf" },
  { id: "avatar-6", emoji: "🦋", name: "Butterfly" },
  { id: "avatar-7", emoji: "🕊️", name: "Dove" },
  { id: "avatar-8", emoji: "🌿", name: "Sage" },
]

export const DEFAULT_AVATAR_ID: AvatarId = "avatar-1"

export function getAvatarById(id: AvatarId | null | undefined): { id: AvatarId; emoji: string; name: string } {
  const avatar = AVATARS.find((a) => a.id === id) || AVATARS.find((a) => a.id === DEFAULT_AVATAR_ID)!
  return avatar
}