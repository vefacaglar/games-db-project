'use client';

import { useEffect, useState } from 'react';
import { gamesApi, platformApi } from '@/lib/endpoints';
import type { Game, Platform } from '@/types';
import { GameList } from '@/components/games/GameList';

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

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Games</h1>
        <p className="text-gray-600 mt-1">Browse our complete game database</p>
      </div>

      <GameList
        games={games}
        platforms={platforms}
        loading={loading}
        search={search}
        selectedPlatform={selectedPlatform}
        activeTab={activeTab}
        onSearchChange={setSearch}
        onPlatformChange={setSelectedPlatform}
        onTabChange={setActiveTab}
        emptyMessage="No games found"
        emptyDescription="Try adjusting your search or filters"
      />
    </div>
  );
}