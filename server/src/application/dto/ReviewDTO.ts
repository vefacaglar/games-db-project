import { z } from 'zod';

export const createReviewSchema = z.object({
  game: z.string(),
  rating: z.number().min(1).max(5),
  mainTime: z.number().min(0),
  mainPlusExtraTime: z.number().min(0).optional(),
  completionistTime: z.number().min(0).optional(),
  comment: z.string().optional()
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  mainTime: z.number().min(0).optional(),
  mainPlusExtraTime: z.number().min(0).optional(),
  completionistTime: z.number().min(0).optional(),
  comment: z.string().optional()
});

export type CreateReviewDTO = z.infer<typeof createReviewSchema>;
export type UpdateReviewDTO = z.infer<typeof updateReviewSchema>;