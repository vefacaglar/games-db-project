'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gamesApi, reviewsApi, listsApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import type { Game, Review, List } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type Tab = 'main' | 'mainPlusExtra' | 'completionist';

export default function GameDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('main');

  useEffect(() => {
    if (id) loadGame();
  }, [id]);

  useEffect(() => {
    if (token) loadLists();
  }, [token]);

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

  const loadLists = async () => {
    try {
      const res = await listsApi.getMy();
      setLists(res.data);
    } catch (error) {
      console.error('Failed to load lists:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this game?')) return;
    try {
      await gamesApi.delete(id as string);
      router.push('/');
    } catch (error) {
      alert('Failed to delete game');
    }
  };

  const handleAddToList = async (listId: string) => {
    try {
      await listsApi.addGame(listId, id as string);
      alert('Game added to list!');
    } catch (error) {
      alert('Failed to add game');
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

  if (loading) return <div className="container-custom py-8">Loading...</div>;
  if (!game) return <div className="container-custom py-8">Game not found</div>;

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {game.coverImage && (
            <img src={game.coverImage} alt={game.title} className="w-full rounded-lg mb-6" />
          )}
          <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
          
          <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 bg-gray-200 rounded-full">{game.genre}</span>
            <span className="px-3 py-1 bg-gray-200 rounded-full">
              {game.averageRating > 0 ? `${game.averageRating}/5 (${game.totalRatings})` : 'No ratings'}
            </span>
          </div>

          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('main')}
              className={`pb-2 px-4 ${activeTab === 'main' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
            >
              Main ({game.averageMainTime || 0}h)
            </button>
            <button
              onClick={() => setActiveTab('mainPlusExtra')}
              className={`pb-2 px-4 ${activeTab === 'mainPlusExtra' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
            >
              Main + Extra ({game.averageMainPlusExtraTime || 0}h)
            </button>
            <button
              onClick={() => setActiveTab('completionist')}
              className={`pb-2 px-4 ${activeTab === 'completionist' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
            >
              Completionist ({game.averageCompletionistTime || 0}h)
            </button>
          </div>

          <p className="text-gray-700 mb-6">{game.description}</p>

          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review._id}>
                  <CardContent>
                    <div className="flex justify-between">
                      <span className="font-medium">{review.user.username}</span>
                      <span>{review.rating}/5</span>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardContent>
              <h3 className="font-semibold mb-4">Info</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Platforms:</span> {game.platforms.join(', ')}</p>
              </div>
            </CardContent>
            {user && (
              <CardFooter>
                <div className="space-y-2">
                  {lists.map((list) => (
                    <button
                      key={list._id}
                      onClick={() => handleAddToList(list._id)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded"
                    >
                      + {list.name}
                    </button>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>

          {user && game.createdBy === user._id && (
            <div className="mt-4 space-y-2">
              <Button onClick={() => router.push(`/games/${id}/edit`)} className="w-full">
                Edit
              </Button>
              <Button onClick={handleDelete} variant="danger" className="w-full">
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}