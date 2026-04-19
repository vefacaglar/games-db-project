'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { gamesApi, platformApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
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
  coverImage: z.string().url().optional()
});

type GameFormData = z.infer<typeof gameSchema>;

export default function NewGamePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema)
  });

  useEffect(() => {
    platformApi.getAll().then(res => setPlatforms(res.data)).catch(console.error);
  }, []);

  if (!user) {
    router.push('/login');
    return null;
  }

  const onSubmit = async (data: GameFormData) => {
    try {
      await gamesApi.create({
        ...data,
        platforms: data.platforms || [],
      });
      router.push('/');
    } catch (error) {
      alert('Failed to create game');
    }
  };

  return (
    <div className="container-custom py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6">Add New Game</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Title *" {...register('title', { required: true })} error={errors.title?.message} />
            <Input label="Description" {...register('description')} />
            <Input label="Genre" {...register('genre')} />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {platforms.map(p => (
                  <label key={p._id} className="flex items-center gap-1">
                    <input type="checkbox" value={p._id} {...register('platforms')} />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

            <Input label="Cover Image URL (optional)" {...register('coverImage')} />
            
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Create Game
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}