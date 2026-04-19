'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { libraryApi } from '@/lib/endpoints';
import { useAuth } from '@/context/AuthContext';
import type { UserLibraryEntry, UserGameStatus } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';
import { EmptyState, EmptyLibraryIcon } from '@/components/ui/EmptyState';

type Tab = UserGameStatus | 'all';

const statusLabels: Record<UserGameStatus, string> = {
  wishlist: 'Wishlist',
  backlog: 'Backlog',
  playing: 'Playing',
  completed: 'Completed',
  dropped: 'Dropped'
};

const statusColors: Record<UserGameStatus, string> = {
  wishlist: 'bg-gray-100 text-gray-800',
  backlog: 'bg-yellow-100 text-yellow-800',
  playing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  dropped: 'bg-red-100 text-red-800',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [entries, setEntries] = useState<UserLibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('all');

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
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleRemove = async (gameId: string) => {
    if (!confirm('Are you sure you want to remove this game from your library?')) return;
    try {
      await libraryApi.remove(gameId);
      loadLibrary();
    } catch (error) {
      console.error('Failed to remove game:', error);
      alert('Failed to remove game. Please try again.');
    }
  };

  if (!user) return null;

  const tabs: Tab[] = ['all', 'wishlist', 'backlog', 'playing', 'completed', 'dropped'];

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
          <p className="text-gray-600 mt-1">Track and manage your gaming collection</p>
        </div>
        <Button onClick={() => router.push('/submit')}>
          + Submit Playtime
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 overflow-x-auto pb-px">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'all' ? 'All' : statusLabels[tab as UserGameStatus]}
              {tab !== 'all' && entries.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {entries.filter(e => e.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingPage message="Loading your library..." />
      ) : entries.length === 0 ? (
        <EmptyState
          title="Your library is empty"
          description="Start building your gaming collection by browsing games and adding them to your library."
          icon={<EmptyLibraryIcon />}
          action={{
            label: 'Browse Games',
            onClick: () => router.push('/games')
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {entries.map(entry => {
            const game = entry.game as any;
            const gameTitle = typeof game === 'object' ? game.title : 'Unknown Game';
            const gameId = typeof game === 'object' ? game._id : entry.game;
            
            return (
              <Card key={entry._id} hoverable>
                <CardContent padding="md">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg line-clamp-1">{gameTitle}</h3>
                    <select
                      value={entry.status}
                      onChange={(e) => handleStatusChange(entry._id, e.target.value as UserGameStatus)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="wishlist">Wishlist</option>
                      <option value="backlog">Backlog</option>
                      <option value="playing">Playing</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[entry.status]}`}>
                      {statusLabels[entry.status]}
                    </span>
                    <button
                      onClick={() => handleRemove(gameId)}
                      className="text-sm text-gray-500 hover:text-danger-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Admin Section */}
      {user.role === 'admin' && (
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">Admin Actions</h2>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/admin/submissions')}>
              Review Submissions
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}