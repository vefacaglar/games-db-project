'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { gamesApi, submissionApi, platformApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Game, Platform } from '@/types';

const submissionSchema = z.object({
  game: z.string().min(1, 'Please select a game'),
  category: z.enum(['main_story', 'main_plus_sides', 'completionist', 'casual', 'dropped']),
  platform: z.string().optional(),
  hours: z.number().min(0.1, 'Hours must be greater than 0'),
  notes: z.string().optional()
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

export default function SubmitPlaytimePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    Promise.all([
      gamesApi.getAll({ limit: 100 }),
      platformApi.getAll()
    ]).then(([gamesRes, platformsRes]) => {
      setGames(gamesRes.data.games);
      setPlatforms(platformsRes.data);
    });
  }, [user]);

  const onSubmit = async (data: SubmissionFormData) => {
    try {
      await submissionApi.create(data);
      alert('Playtime submitted! It will be visible after admin approval.');
      router.push('/');
    } catch (error) {
      alert('Failed to submit playtime');
    }
  };

  if (!user) return null;

  return (
    <div className="container-custom py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6">Submit Playtime</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Game *</label>
              <select {...register('game')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select a game</option>
                {games.map(g => (
                  <option key={g._id} value={g._id}>{g.title}</option>
                ))}
              </select>
              {errors.game && <p className="text-red-500 text-sm">{errors.game.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Completion Type *</label>
              <select {...register('category')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="main_story">Main Story</option>
                <option value="main_plus_sides">Main + Side Content</option>
                <option value="completionist">Completionist</option>
                <option value="casual">Casual</option>
                <option value="dropped">Dropped</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform (optional)</label>
              <select {...register('platform')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Any/N/A</option>
                {platforms.map(p => (
                  <option key={p._id} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Hours *"
              type="number"
              step="0.5"
              {...register('hours', { valueAsNumber: true })}
              error={errors.hours?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                {...register('notes')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Optional notes about your experience"
              />
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}