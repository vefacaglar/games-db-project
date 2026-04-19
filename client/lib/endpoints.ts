import api from './api';
import type { User, Game, List, Review, Platform, AuthResponse, GamesResponse, GameFilters } from '@/types';

export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  getMe: () => api.get<User>('/auth/me'),

  updateMe: (data: Partial<User>) => api.put<User>('/auth/me', data),
};

export const platformApi = {
  getAll: () => api.get<Platform[]>('/platforms'),

  create: (data: { name: string; slug: string }) => api.post<Platform>('/platforms', data),

  delete: (id: string) => api.delete(`/platforms/${id}`),
};

export const gamesApi = {
  getAll: (filters?: GameFilters) =>
    api.get<GamesResponse>('/games', { params: filters }),

  getById: (id: string) => api.get<Game>(`/games/${id}`),

  create: (data: Partial<Game>) => api.post<Game>('/games', data),

  update: (id: string, data: Partial<Game>) => api.put<Game>(`/games/${id}`, data),

  delete: (id: string) => api.delete(`/games/${id}`),
};

export const listsApi = {
  getMy: () => api.get<List[]>('/lists'),

  getById: (id: string) => api.get<List>(`/lists/${id}`),

  create: (data: { name: string; games?: string[] }) => api.post<List>('/lists', data),

  update: (id: string, data: { name?: string; games?: string[] }) =>
    api.put<List>(`/lists/${id}`, data),

  delete: (id: string) => api.delete(`/lists/${id}`),

  addGame: (listId: string, gameId: string) =>
    api.post<List>(`/lists/${listId}/games`, { gameId }),

  removeGame: (listId: string, gameId: string) =>
    api.delete(`/lists/${listId}/games`, { data: { gameId } }),
};

export const reviewsApi = {
  getByGame: (gameId: string) => api.get<Review[]>(`/reviews/game/${gameId}`),

  getMy: () => api.get<Review[]>('/reviews/my'),

  create: (data: { game: string; rating: number; mainTime: number; mainPlusExtraTime?: number; completionistTime?: number; comment?: string }) =>
    api.post<Review>('/reviews', data),

  update: (id: string, data: { rating?: number; mainTime?: number; mainPlusExtraTime?: number; completionistTime?: number; comment?: string }) =>
    api.put<Review>(`/reviews/${id}`, data),

  delete: (id: string) => api.delete(`/reviews/${id}`),
};