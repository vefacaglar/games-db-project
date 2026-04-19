import { z } from 'zod';

export const createListSchema = z.object({
  name: z.string().min(1).max(100),
  games: z.array(z.string()).optional()
});

export const updateListSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  games: z.array(z.string()).optional()
});

export const addGameToListSchema = z.object({
  gameId: z.string()
});

export type CreateListDTO = z.infer<typeof createListSchema>;
export type UpdateListDTO = z.infer<typeof updateListSchema>;
export type AddGameToListDTO = z.infer<typeof addGameToListSchema>;