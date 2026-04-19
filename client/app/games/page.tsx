'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { gamesApi, platformApi } from '@/lib/endpoints';
import type { Game, Platform } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';

type Tab = 'main' | 'mainPlusExtra' | 'completionist';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('main');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadGames();
  }, [search, selectedPlatform]);

  const loadData = async () => {
    try {
      const [gamesRes, platformsRes] = await Promise.all([
        gamesApi.getAll(),
        platformApi.getAll()
      ]);
      setGames(gamesRes.data.games);
      setPlatforms(platformsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGames = async () => {
    try {
      setLoading(true);
      const res = await gamesApi.getAll({ 
        search: search || undefined,
        platform: selectedPlatform || undefined
      });
      setGames(res.data.games);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTime = (game: Game) => {
    switch (activeTab) {
      case 'mainPlusExtra': return game.averageMainPlusExtraTime;
      case 'completionist': return game.averageCompletionistTime;
      default: return game.averageMainTime;
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Games</h1>
        <div className="flex gap-2">
          <form onSubmit={(e) => { e.preventDefault(); loadGames(); }} className="flex gap-2">
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Platforms</option>
              {platforms.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('main')}
          className={`pb-2 px-4 ${activeTab === 'main' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
        >
          Main Story (avg)
        </button>
        <button
          onClick={() => setActiveTab('mainPlusExtra')}
          className={`pb-2 px-4 ${activeTab === 'mainPlusExtra' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
        >
          Main + Extras (avg)
        </button>
        <button
          onClick={() => setActiveTab('completionist')}
          className={`pb-2 px-4 ${activeTab === 'completionist' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
        >
          Completionist (avg)
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : games.length === 0 ? (
        <p className="text-gray-500">No games found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <Link key={game._id} href={`/games/${game._id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                {game.coverImage && (
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent>
                  <h2 className="text-xl font-semibold">{game.title}</h2>
                  <p className="text-gray-600 mt-1">{game.genre}</p>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{getTime(game) || 0}h</span>
                    <span>{game.totalRatings > 0 ? `${game.totalRatings} submissions` : 'No data'}</span>
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