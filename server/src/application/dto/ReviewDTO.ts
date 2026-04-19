import { z } from 'zod';

export const createSubmissionSchema = z.object({
  game: z.string().min(1, 'Game is required'),
  category: z.enum(['main_story', 'main_plus_sides', 'completionist', 'casual', 'dropped']),
  platform: z.string().optional(),
  hours: z.number().min(0.1, 'Hours must be greater than 0'),
  notes: z.string().optional()
});

export const updateSubmissionSchema = z.object({
  platform: z.string().optional(),
  hours: z.number().min(0.1).optional(),
  notes: z.string().optional()
});

export type CreateSubmissionDTO = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionDTO = z.infer<typeof updateSubmissionSchema>;