'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { gamesApi } from '@/lib/endpoints';
import type { Game } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async (searchTerm = '') => {
    try {
      setLoading(true);
      const res = await gamesApi.getAll({ search: searchTerm || undefined });
      setGames(res.data.games);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadGames(search);
  };

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Games</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Search
          </button>
        </form>
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
                    <span>{game.playTime}h</span>
                    <span>{game.rating}/10</span>
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