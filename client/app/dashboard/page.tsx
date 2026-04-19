'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { libraryApi, gamesApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import type { UserLibraryEntry, UserGameStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type Tab = UserGameStatus | 'all';

const statusLabels: Record<UserGameStatus, string> = {
  wishlist: 'Wishlist',
  backlog: 'Backlog',
  playing: 'Playing',
  completed: 'Completed',
  dropped: 'Dropped'
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [entries, setEntries] = useState<UserLibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadLibrary();
  }, [user, activeTab]);

  const loadLibrary = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'all' ? undefined : activeTab;
      const res = await libraryApi.getMy(status);
      setEntries(res.data);
    } catch (error) {
      console.error('Failed to load library:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (entryId: string, newStatus: UserGameStatus) => {
    try {
      await libraryApi.update(entryId, { status: newStatus });
      loadLibrary();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleRemove = async (gameId: string) => {
    if (!confirm('Remove from library?')) return;
    try {
      await libraryApi.remove(gameId);
      loadLibrary();
    } catch (error) {
      alert('Failed to remove');
    }
  };

  if (!user) return null;

  const tabs: Tab[] = ['all', 'wishlist', 'backlog', 'playing', 'completed', 'dropped'];

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Library</h1>
        <Button onClick={() => router.push('/submit')}>
          + Submit Playtime
        </Button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 ${activeTab === tab ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
          >
            {tab === 'all' ? 'All' : statusLabels[tab as UserGameStatus]}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your library is empty.</p>
          <Button onClick={() => router.push('/games')}>Browse Games</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(entry => (
            <Card key={entry._id}>
              <CardContent>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{(entry.game as any).title || entry.game}</h3>
                  <select
                    value={entry.status}
                    onChange={(e) => handleStatusChange(entry._id, e.target.value as UserGameStatus)}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    <option value="wishlist">Wishlist</option>
                    <option value="backlog">Backlog</option>
                    <option value="playing">Playing</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  entry.status === 'completed' ? 'bg-green-100 text-green-800' :
                  entry.status === 'playing' ? 'bg-blue-100 text-blue-800' :
                  entry.status === 'backlog' ? 'bg-yellow-100 text-yellow-800' :
                  entry.status === 'dropped' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {statusLabels[entry.status]}
                </span>
                <button
                  onClick={() => handleRemove((entry.game as any)._id)}
                  className="text-red-500 text-sm mt-2 block"
                >
                  Remove
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {user.role === 'admin' && (
        <div className="mt-8 pt-8 border-t">
          <Button onClick={() => router.push('/admin/submissions')}>
            Review Submissions
          </Button>
        </div>
      )}
    </div>
  );
}