'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gamesApi, reviewsApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import type { Game, PlaytimeSubmission } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

type Tab = 'main' | 'mainPlusExtra' | 'completionist';

export default function GameDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<PlaytimeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('main');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      const res = await gamesApi.getById(id as string);
      setGame(res.data);
      const reviewsRes = await reviewsApi.getByGame(id as string);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Failed to load game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this game? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      await gamesApi.delete(id as string);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete game:', error);
      alert('Failed to delete game. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getTime = () => {
    if (!game) return 0;
    switch (activeTab) {
      case 'mainPlusExtra': return game.averageMainPlusExtraTime;
      case 'completionist': return game.averageCompletionistTime;
      default: return game.averageMainTime;
    }
  };

  const tabs = [
    { id: 'main', label: 'Main', hours: game?.averageMainTime || 0 },
    { id: 'mainPlusExtra', label: 'Main + Extra', hours: game?.averageMainPlusExtraTime || 0 },
    { id: 'completionist', label: 'Completionist', hours: game?.averageCompletionistTime || 0 },
  ] as const;

  if (loading) return <LoadingPage message="Loading game details..." />;
  if (!game) return (
    <EmptyState
      title="Game not found"
      description="The game you're looking for doesn't exist or has been removed."
      action={{
        label: 'Back to Games',
        onClick: () => router.push('/games')
      }}
    />
  );

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Header */}
          <div className="space-y-4">
            {game.coverImage && (
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={game.coverImage} 
                  alt={game.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{game.title}</h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {game.genre}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {game.averageRating > 0 ? `${game.averageRating}/5 (${game.totalRatings} ratings)` : 'No ratings'}
                  </span>
                </div>
              </div>
              
              {user && game.createdBy === user._id && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => router.push(`/games/${id}/edit`)}
                    variant="secondary"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={handleDelete} 
                    variant="danger"
                    size="sm"
                    isLoading={isDeleting}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Time Tabs */}
          <Card>
            <CardContent padding="md">
              <div className="border-b border-gray-200 mb-4">
                <nav className="flex space-x-8">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label} ({tab.hours}h)
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-gray-900">{getTime()}h</div>
                <p className="text-gray-600 mt-1">Average playtime</p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Description</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{game.description || 'No description available.'}</p>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Reviews</h2>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <EmptyState
                  title="No reviews yet"
                  description="Be the first to review this game!"
                />
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-gray-900">{review.user?.username || 'Anonymous'}</span>
                          <div className="flex items-center mt-1">
                            {review.rating ? [1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= (review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )) : null}
                          </div>
                        </div>
                        {review.rating && (
                          <span className="text-sm text-gray-500">{review.rating}/5</span>
                        )}
                      </div>
                      {review.notes && (
                        <p className="text-gray-600 mt-2">{review.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Game Info</h3>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Platforms</dt>
                  <dd className="mt-1 text-gray-900">
                    {game.platforms.length > 0 
                      ? game.platforms.map(p => p.name).join(', ')
                      : 'Not specified'
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Genre</dt>
                  <dd className="mt-1 text-gray-900">{game.genre}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Ratings</dt>
                  <dd className="mt-1 text-gray-900">{game.totalRatings}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/submit')}
                  className="w-full"
                >
                  Submit Playtime
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => router.push('/games')}
                  className="w-full"
                >
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}