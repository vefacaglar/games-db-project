'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { gamesApi, platformApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Platform } from '@/types';

const gameSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  genre: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  coverImage: z.string().url('Invalid URL').optional().or(z.literal(''))
});

type GameFormData = z.infer<typeof gameSchema>;

export default function NewGamePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema)
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    platformApi.getAll().then(res => setPlatforms(res.data)).catch(console.error);
  }, [user, router]);

  const onSubmit = async (data: GameFormData) => {
    setIsSubmittingForm(true);
    try {
      await gamesApi.create({
        ...data,
        platforms: data.platforms || [],
      });
      router.push('/games');
      router.refresh();
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game. Please try again.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Game</h1>
          <p className="text-gray-600 mt-1">Add a new game to our database</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Game Information</h2>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <Input 
                label="Title *" 
                {...register('title')} 
                error={errors.title?.message}
                placeholder="Enter game title"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  {...register('description')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={4}
                  placeholder="Enter game description..."
                />
              </div>

              <Input 
                label="Genre" 
                {...register('genre')} 
                error={errors.genre?.message}
                placeholder="e.g., RPG, Action, Adventure"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {platforms.map(p => (
                    <label key={p._id} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        value={p._id} 
                        {...register('platforms')} 
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Input 
                label="Cover Image URL" 
                {...register('coverImage')} 
                error={errors.coverImage?.message}
                placeholder="https://example.com/image.jpg"
                helperText="Enter a valid image URL (optional)"
              />
            </CardContent>

            <CardFooter className="border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center w-full">
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
                  Create Game
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}