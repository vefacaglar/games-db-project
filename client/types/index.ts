export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  _id: string;
  title: string;
  description?: string;
  genre?: string;
  platform: string[];
  playTime: number;
  coverImage?: string;
  rating: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  _id: string;
  name: string;
  user: string;
  games: Game[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: { _id: string; username: string };
  game: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GameFilters {
  genre?: string;
  platform?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GamesResponse {
  games: Game[];
  total: number;
}