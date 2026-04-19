import { z } from 'zod';

export const createGameSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  genre: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
  mainTime: z.number().min(0),
  mainPlusExtraTime: z.number().min(0),
  completionistTime: z.number().min(0)
});

export const updateGameSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  genre: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
  mainTime: z.number().min(0).optional(),
  mainPlusExtraTime: z.number().min(0).optional(),
  completionistTime: z.number().min(0).optional()
});

export const gameFiltersSchema = z.object({
  genre: z.string().optional(),
  platform: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional()
});

export type CreateGameDTO = z.infer<typeof createGameSchema>;
export type UpdateGameDTO = z.infer<typeof updateGameSchema>;
export type GameFiltersDTO = z.infer<typeof gameFiltersSchema>;