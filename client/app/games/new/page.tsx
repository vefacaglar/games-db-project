'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { gamesApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const gameSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  genre: z.string().optional(),
  platform: z.string().optional(),
  playTime: z.number().min(0),
  coverImage: z.string().url().optional(),
  rating: z.number().min(0).max(10).optional(),
});

type GameFormData = z.infer<typeof gameSchema>;

export default function NewGamePage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema),
  });

  if (!user) {
    router.push('/login');
    return null;
  }

  const onSubmit = async (data: GameFormData) => {
    try {
      const platformArray = data.platform?.split(',').map(p => p.trim()) || [];
      await gamesApi.create({
        ...data,
        platform: platformArray,
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
            <Input label="Platforms (comma separated)" placeholder="PC, PS5, Xbox" {...register('platform')} />
            <Input label="Play Time (hours)" type="number" {...register('playTime', { valueAsNumber: true })} />
            <Input label="Cover Image URL" {...register('coverImage')} />
            <Input label="Rating (0-10)" type="number" step="0.1" {...register('rating', { valueAsNumber: true })} />
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Create Game
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}