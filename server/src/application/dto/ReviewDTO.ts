import { z } from 'zod';

export const createSubmissionSchema = z.object({
  game: z.string().min(1, 'Game is required'),
  category: z.enum(['main_story', 'main_plus_sides', 'completionist', 'casual', 'dropped']),
  platform: z.string().optional(),
  storefront: z.string().optional(),
  hours: z.number().min(0.1, 'Hours must be greater than 0'),
  notes: z.string().optional(),
  progressHours: z.number().min(0).optional(),
  progressMinutes: z.number().min(0).max(59).optional(),
  progressSeconds: z.number().min(0).max(59).optional(),
  startDate: z.string().optional(),
  completionDate: z.string().optional(),
  libraryStatus: z.array(z.string()).optional(),
  singlePlayerNotes: z.object({
    mainStory: z.string().optional(),
    main_plus_sides: z.string().optional(),
    completionist: z.string().optional()
  }).optional(),
  speedrunNotes: z.string().optional()
});

export const updateSubmissionSchema = z.object({
  platform: z.string().optional(),
  storefront: z.string().optional(),
  hours: z.number().min(0.1).optional(),
  notes: z.string().optional(),
  progressHours: z.number().min(0).optional(),
  progressMinutes: z.number().min(0).max(59).optional(),
  progressSeconds: z.number().min(0).max(59).optional(),
  startDate: z.string().optional(),
  completionDate: z.string().optional(),
  libraryStatus: z.array(z.string()).optional(),
  singlePlayerNotes: z.object({
    mainStory: z.string().optional(),
    main_plus_sides: z.string().optional(),
    completionist: z.string().optional()
  }).optional(),
  speedrunNotes: z.string().optional()
});

export type CreateSubmissionDTO = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionDTO = z.infer<typeof updateSubmissionSchema>;