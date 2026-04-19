'use client';

import Link from 'next/link';
import type { Game, Platform } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState, EmptyGamesIcon } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/Loading';

interface GameListProps {
  games: Game[];
  platforms?: Platform[];
  loading?: boolean;
  search?: string;
  selectedPlatform?: string;
  activeTab?: 'main' | 'mainPlusExtra' | 'completionist';
  onSearchChange?: (value: string) => void;
  onPlatformChange?: (value: string) => void;
  onTabChange?: (tab: 'main' | 'mainPlusExtra' | 'completionist') => void;
  emptyMessage?: string;
  emptyDescription?: string;
  showTabs?: boolean;
  showFilters?: boolean;
}

export function GameList({
  games,
  platforms = [],
  loading = false,
  search = '',
  selectedPlatform = '',
  activeTab = 'main',
  onSearchChange,
  onPlatformChange,
  onTabChange,
  emptyMessage = 'No games found',
  emptyDescription = 'Try adjusting your search or filters',
  showTabs = true,
  showFilters = true,
}: GameListProps) {
  const getTime = (game: Game) => {
    switch (activeTab) {
      case 'mainPlusExtra': return game.averageMainPlusExtraTime;
      case 'completionist': return game.averageCompletionistTime;
      default: return game.averageMainTime;
    }
  };

  const tabs = [
    { id: 'main', label: 'Main Story' },
    { id: 'mainPlusExtra', label: 'Main + Extras' },
    { id: 'completionist', label: 'Completionist' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedPlatform}
              onChange={(e) => onPlatformChange?.(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Platforms</option>
              {platforms.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Tabs */}
      {showTabs && (
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : games.length === 0 ? (
        <EmptyState
          title={emptyMessage}
          description={emptyDescription}
          icon={<EmptyGamesIcon />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <Link key={game._id} href={`/games/${game._id}`}>
              <Card hoverable className="h-full">
                {game.coverImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <CardContent padding="md">
                  <h3 className="font-semibold text-lg line-clamp-1">{game.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-1">{game.genre}</p>
                  <div className="flex justify-between mt-3 text-sm">
                    <span className="text-gray-700 font-medium">{getTime(game) || 0}h</span>
                    <span className="text-gray-500">
                      {game.totalRatings > 0 ? `${game.totalRatings} submissions` : 'No data'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}