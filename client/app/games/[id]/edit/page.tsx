'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { gamesApi, platformApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Game, Platform } from '@/types';

const gameSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  genre: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
  mainTime: z.number().min(0),
  mainPlusExtraTime: z.number().min(0),
  completionistTime: z.number().min(0),
});

type GameFormData = z.infer<typeof gameSchema>;

export default function EditGamePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema),
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [id, user]);

  const loadData = async () => {
    try {
      const [gameRes, platformsRes] = await Promise.all([
        gamesApi.getById(id as string),
        platformApi.getAll()
      ]);
      setGame(gameRes.data);
      setPlatforms(platformsRes.data);
    } catch (error) {
      alert('Game not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: GameFormData) => {
    try {
      await gamesApi.update(id as string, data);
      router.push(`/games/${id}`);
    } catch (error) {
      alert('Failed to update game');
    }
  };

  if (loading || !game) return <div className="container-custom py-8">Loading...</div>;

  return (
    <div className="container-custom py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6">Edit Game</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Title *" {...register('title')} defaultValue={game.title} />
            <Input label="Description" {...register('description')} defaultValue={game.description || ''} />
            <Input label="Genre" {...register('genre')} defaultValue={game.genre || ''} />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {platforms.map(p => (
                  <label key={p._id} className="flex items-center gap-1">
                    <input 
                      type="checkbox" 
                      value={p._id} 
                      {...register('platforms')}
                      defaultChecked={game.platforms.includes(p._id)}
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

            <Input label="Cover Image URL" {...register('coverImage')} defaultValue={game.coverImage || ''} />
            
            <div className="grid grid-cols-3 gap-4">
              <Input label="Main Time (h)" type="number" {...register('mainTime', { valueAsNumber: true })} defaultValue={game.mainTime} />
              <Input label="Main + Extra (h)" type="number" {...register('mainPlusExtraTime', { valueAsNumber: true })} defaultValue={game.mainPlusExtraTime} />
              <Input label="Completionist (h)" type="number" {...register('completionistTime', { valueAsNumber: true })} defaultValue={game.completionistTime} />
            </div>
            
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}