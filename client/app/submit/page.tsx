'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { gamesApi, submissionApi, platformApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Game, Platform } from '@/types';

const storefrontOptions = [
  'Steam', 'Epic Games Store', 'GOG', 'Origin', 'Ubisoft Connect', 
  'Xbox', 'PlayStation', 'Nintendo', 'Other'
];

const submissionSchema = z.object({
  game: z.string().min(1, 'Please select a game'),
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
  
  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      progressHours: 0,
      progressMinutes: 0,
      progressSeconds: 0,
      libraryStatus: []
    }
  });

  const watchedLibraryStatus = watch('libraryStatus') || [];

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

    if (gameSearchTerm.length < 2 || gameIdFromUrl) {
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
  }, [gameSearchTerm, gameIdFromUrl]);

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

  // Timer functions
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAddTimerTime = () => {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    
    const currentHours = watch('progressHours') || 0;
    const currentMinutes = watch('progressMinutes') || 0;
    const currentSeconds = watch('progressSeconds') || 0;
    
    // Add timer to current progress
    let totalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds + timerSeconds;
    
    const newHours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const newMinutes = Math.floor(totalSeconds / 60);
    const newSeconds = totalSeconds % 60;
    
    setValue('progressHours', newHours);
    setValue('progressMinutes', newMinutes);
    setValue('progressSeconds', newSeconds);
    
    // Reset timer
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  const handleResetTimer = () => {
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  const handleLibraryStatusChange = (status: string, checked: boolean) => {
    const current = watchedLibraryStatus || [];
    if (checked) {
      setValue('libraryStatus', [...current, status]);
    } else {
      setValue('libraryStatus', current.filter(s => s !== status));
    }
  };

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmittingForm(true);
    try {
      // Convert progress to hours for submission
      const progressHours = (data.progressHours || 0) + 
                           (data.progressMinutes || 0) / 60 + 
                           (data.progressSeconds || 0) / 3600;
      
      const submissionData = {
        ...data,
        hours: progressHours > 0 ? progressHours : data.hours,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        completionDate: data.completionDate ? new Date(data.completionDate) : undefined,
      };
      
      await submissionApi.create(submissionData);
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit Playtime</h1>
          <p className="text-gray-600 mt-1">Share your gaming experience with the community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Timer */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Community Stats</h2>
              </CardHeader>
              <CardContent>
                {selectedGame ? (
                  <div className="flex gap-4">
                    {selectedGame.coverImage && (
                      <img 
                        src={selectedGame.coverImage} 
                        alt={selectedGame.title}
                        className="w-24 h-32 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{selectedGame.title}</h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <p><span className="text-yellow-600">Main Story:</span> {selectedGame.averageMainTime} Hours</p>
                        <p><span className="text-yellow-600">Main + Sides:</span> {selectedGame.averageMainPlusExtraTime} Hours</p>
                        <p><span className="text-yellow-600">Completionist:</span> {selectedGame.averageCompletionistTime} Hours</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Select a game to see stats</p>
                )}
              </CardContent>
            </Card>

            {/* Progress Timer */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Progress Timer</h2>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-mono text-center mb-4">
                  {formatTime(timerSeconds)}
                </div>
                <div className="flex justify-center gap-2">
                  <Button 
                    onClick={() => setTimerRunning(!timerRunning)}
                    variant={timerRunning ? 'secondary' : 'primary'}
                    size="sm"
                  >
                    {timerRunning ? 'Pause' : 'Start'}
                  </Button>
                  <Button 
                    onClick={handleAddTimerTime}
                    variant="primary"
                    size="sm"
                    disabled={timerSeconds === 0}
                  >
                    Add
                  </Button>
                  <Button 
                    onClick={handleResetTimer}
                    variant="secondary"
                    size="sm"
                    disabled={timerSeconds === 0}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add Manual Time */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Add Manual Time</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 text-center">HHH</label>
                    <Input
                      type="number"
                      {...register('progressHours', { valueAsNumber: true })}
                      className="text-center"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 text-center">MM</label>
                    <Input
                      type="number"
                      {...register('progressMinutes', { valueAsNumber: true })}
                      className="text-center"
                      min="0"
                      max="59"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 text-center">SS</label>
                    <Input
                      type="number"
                      {...register('progressSeconds', { valueAsNumber: true })}
                      className="text-center"
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Game Selection */}
                  {!gameIdFromUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Game *</label>
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
                    </div>
                  )}

                  {/* Custom Title (read-only) */}
                  {selectedGame && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Title</label>
                      <input
                        type="text"
                        value={selectedGame.title}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
                      />
                    </div>
                  )}

                  {/* Platform and Storefront */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                      <select 
                        {...register('platform')} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select Platform</option>
                        {platforms.map(p => (
                          <option key={p._id} value={p.slug}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Storefront</label>
                      <select 
                        {...register('storefront')} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select Storefront</option>
                        {storefrontOptions.map(store => (
                          <option key={store} value={store.toLowerCase()}>{store}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Add to List */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add to List *</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {['playing', 'backlog', 'wishlist', 'completed', 'retired'].map(status => (
                        <label key={status} className="flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={watchedLibraryStatus.includes(status)}
                            onChange={(e) => handleLibraryStatusChange(status, e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Completion Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Completion Type *</label>
                    <select 
                      {...register('category')} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="main_story">Main Story</option>
                      <option value="main_plus_sides">Main + Sides</option>
                      <option value="completionist">Completionist</option>
                      <option value="casual">Casual</option>
                      <option value="dropped">Dropped</option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        {...register('startDate')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Completion Date</label>
                      <input
                        type="date"
                        {...register('completionDate')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* Single-Player Times */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Single-Player Times</label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Main Story (No Optional Content)</label>
                        <textarea
                          {...register('singlePlayerNotes.mainStory')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={2}
                          placeholder="Notes about main story playthrough..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Main + Sides</label>
                        <textarea
                          {...register('singlePlayerNotes.main_plus_sides')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={2}
                          placeholder="Notes about main + sides playthrough..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Completionist</label>
                        <textarea
                          {...register('singlePlayerNotes.completionist')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={2}
                          placeholder="Notes about completionist playthrough..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Speedrun Times */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Speedrun Times</label>
                    <textarea
                      {...register('speedrunNotes')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                      placeholder="Any speedrun times or notes..."
                    />
                  </div>

                  {/* General Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">General Notes</label>
                    <textarea
                      {...register('notes')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                      placeholder="Any additional notes about your playthrough..."
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t">
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
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}