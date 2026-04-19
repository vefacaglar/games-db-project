import api from './api';
import type { User, Game, Platform, PlaytimeSubmission, UserLibraryEntry, AuthResponse, GamesResponse, GameFilters, PlaytimeCategory } from '@/types';

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

export const submissionApi = {
  getByGame: (gameId: string) =>
    api.get<PlaytimeSubmission[]>(`/reviews/game/${gameId}`),

  getMy: () =>
    api.get<PlaytimeSubmission[]>('/reviews/my'),

  getPending: () =>
    api.get<PlaytimeSubmission[]>('/reviews/pending'),

  create: (data: { game: string; category: PlaytimeCategory; platform?: string; hours: number; notes?: string }) =>
    api.post<PlaytimeSubmission>('/reviews', data),

  update: (id: string, data: { platform?: string; hours?: number; notes?: string }) =>
    api.put<PlaytimeSubmission>(`/reviews/${id}`, data),

  delete: (id: string) => api.delete(`/reviews/${id}`),

  approve: (id: string) =>
    api.post<PlaytimeSubmission>(`/reviews/${id}/approve`),

  reject: (id: string) =>
    api.post<PlaytimeSubmission>(`/reviews/${id}/reject`),
};

export const libraryApi = {
  getMy: (status?: string) =>
    api.get<UserLibraryEntry[]>('/library', { params: status ? { status } : undefined }),

  add: (data: { game: string; status: string }) =>
    api.post<UserLibraryEntry>('/library', data),

  update: (id: string, data: { status?: string; personalRating?: number; personalNotes?: string }) =>
    api.patch<UserLibraryEntry>(`/library/${id}`, data),

  remove: (gameId: string) =>
    api.delete(`/library/game/${gameId}`),
};

export const reviewsApi = submissionApi;