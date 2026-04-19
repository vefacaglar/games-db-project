'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { gamesApi, submissionApi, platformApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
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
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
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
    setIsSubmittingForm(true);
    try {
      await submissionApi.create(data);
      alert('Playtime submitted! It will be visible after admin approval.');
      reset();
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to submit playtime:', error);
      alert('Failed to submit playtime. Please try again.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit Playtime</h1>
          <p className="text-gray-600 mt-1">Share your gaming experience with the community</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Game Details</h2>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Game *</label>
                <select 
                  {...register('game')} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a game</option>
                  {games.map(g => (
                    <option key={g._id} value={g._id}>{g.title}</option>
                  ))}
                </select>
                {errors.game && (
                  <p className="mt-1 text-sm text-danger-600">{errors.game.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Completion Type *</label>
                  <select 
                    {...register('category')} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="main_story">Main Story</option>
                    <option value="main_plus_sides">Main + Side Content</option>
                    <option value="completionist">Completionist</option>
                    <option value="casual">Casual</option>
                    <option value="dropped">Dropped</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-danger-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform (optional)</label>
                  <select 
                    {...register('platform')} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Any/N/A</option>
                    {platforms.map(p => (
                      <option key={p._id} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Input
                  label="Hours *"
                  type="number"
                  step="0.5"
                  min="0.1"
                  {...register('hours', { valueAsNumber: true })}
                  error={errors.hours?.message}
                  placeholder="e.g., 12.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                <textarea
                  {...register('notes')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={4}
                  placeholder="Share your experience, tips, or any other thoughts about the game..."
                />
              </div>
            </CardContent>

            <CardFooter className="border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
                <p className="text-sm text-gray-600">
                  Your submission will be reviewed by an admin before being published.
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    isLoading={isSubmitting || isSubmittingForm}
                  >
                    Submit Playtime
                  </Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}