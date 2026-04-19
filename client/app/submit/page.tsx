'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const gameIdFromUrl = searchParams.get('gameId');
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [gameSearchTerm, setGameSearchTerm] = useState('');
  const [gameSearchResults, setGameSearchResults] = useState<Game[]>([]);
  const [isSearchingGames, setIsSearchingGames] = useState(false);
  const [showGameDropdown, setShowGameDropdown] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  // Load platforms on mount
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    platformApi.getAll().then(res => setPlatforms(res.data));
  }, [user, router]);

  // Load game if gameId provided in URL
  useEffect(() => {
    if (gameIdFromUrl) {
      setLoadingGame(true);
      gamesApi.getById(gameIdFromUrl)
        .then(res => {
          setSelectedGame(res.data);
          setGameSearchTerm(res.data.title);
          setValue('game', res.data._id);
        })
        .catch(error => {
          console.error('Failed to load game:', error);
          // If game not found, fallback to search
          setSelectedGame(null);
          setGameSearchTerm('');
          setValue('game', '');
        })
        .finally(() => setLoadingGame(false));
    }
  }, [gameIdFromUrl, setValue]);

  // Search games with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (gameSearchTerm.length < 2) {
      setGameSearchResults([]);
      setShowGameDropdown(false);
      return;
    }

    setIsSearchingGames(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await gamesApi.getAll({ search: gameSearchTerm, limit: 20 });
        setGameSearchResults(res.data.games);
        setShowGameDropdown(true);
      } catch (error) {
        console.error('Failed to search games:', error);
      } finally {
        setIsSearchingGames(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [gameSearchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowGameDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                {gameIdFromUrl ? (
                  // Game selected from game detail page - show as fixed text
                  <div>
                    {loadingGame ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin h-6 w-6 border-2 border-primary-600 border-t-transparent rounded-full"></div>
                        <span className="ml-2 text-gray-500">Loading game...</span>
                      </div>
                    ) : selectedGame ? (
                      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
                        <div className="font-medium text-lg">{selectedGame.title}</div>
                        {selectedGame.genre && (
                          <div className="text-sm text-gray-500">{selectedGame.genre}</div>
                        )}
                      </div>
                    ) : (
                      <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                        Game not found. Please go back and select a different game.
                      </div>
                    )}
                  </div>
                ) : (
                  // No game ID - show search box
                  <div className="relative" ref={dropdownRef}>
                    <input
                      type="text"
                      value={gameSearchTerm}
                      onChange={(e) => {
                        setGameSearchTerm(e.target.value);
                        if (selectedGame) {
                          setSelectedGame(null);
                          setValue('game', '');
                        }
                      }}
                      onFocus={() => {
                        if (gameSearchTerm.length >= 2 && gameSearchResults.length > 0) {
                          setShowGameDropdown(true);
                        }
                      }}
                      placeholder="Search for a game..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      autoComplete="off"
                    />
                    {isSearchingGames && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    
                    {showGameDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity5 overflow-auto focus:outline-none">
                        {gameSearchResults.length === 0 ? (
                          <div className="px-4 py-2 text-gray-500">
                            {isSearchingGames ? 'Searching...' : 'No games found'}
                          </div>
                        ) : (
                          gameSearchResults.map((game) => (
                            <div
                              key={game._id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedGame(game);
                                setGameSearchTerm(game.title);
                                setValue('game', game._id);
                                setShowGameDropdown(false);
                              }}
                            >
                              <div className="font-medium">{game.title}</div>
                              {game.genre && (
                                <div className="text-sm text-gray-500">{game.genre}</div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
                <Controller
                  name="game"
                  control={control}
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />
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
                  type="text"
                  inputMode="decimal"
                  {...register('hours', {
                    required: 'Hours is required',
                    setValueAs: value => {
                      if (!value) return value;
                      return parseFloat(value.toString().replace(',', '.'));
                    },
                    validate: value => {
                      const num = parseFloat(value.toString().replace(',', '.'));
                      return !isNaN(num) && num >= 0.1 || 'Please enter a valid number greater than 0.1';
                    }
                  })}
                  error={errors.hours?.message}
                  placeholder="e.g., 12.5 or 12,5"
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