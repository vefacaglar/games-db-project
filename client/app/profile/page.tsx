'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { listsApi, reviewsApi } from '@/lib/endpoints';
import type { List, Review } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [lists, setLists] = useState<List[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [listsRes, reviewsRes] = await Promise.all([
        listsApi.getMy(),
        reviewsApi.getMy(),
      ]);
      setLists(listsRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    try {
      await listsApi.create({ name: newListName });
      setNewListName('');
      loadData();
    } catch (error) {
      alert('Failed to create list');
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Delete this list?')) return;
    try {
      await listsApi.delete(listId);
      loadData();
    } catch (error) {
      alert('Failed to delete list');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user || loading) return <div className="container-custom py-8">Loading...</div>;

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <Button onClick={handleLogout} variant="secondary">
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">My Lists</h2>
          <Card>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="New list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <Button onClick={handleCreateList}>Add</Button>
              </div>
              {lists.length === 0 ? (
                <p className="text-gray-500">No lists yet.</p>
              ) : (
                <div className="space-y-2">
                  {lists.map((list) => (
                    <div key={list._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{list.name} ({list.games.length} games)</span>
                      <button
                        onClick={() => handleDeleteList(list._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">My Reviews</h2>
          <Card>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-2 bg-gray-50 rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">{review.game}</span>
                        <span>{review.rating}/5</span>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}