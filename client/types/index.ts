export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Platform {
  _id: string;
  name: string;
  slug: string;
}

export interface PlatformInfo {
  _id: string;
  name: string;
  slug: string;
}

export interface Game {
  _id: string;
  title: string;
  description?: string;
  genre?: string;
  platforms: PlatformInfo[];
  coverImage?: string;
  averageRating: number;
  totalRatings: number;
  averageMainTime: number;
  averageMainPlusExtraTime: number;
  averageCompletionistTime: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaytimeEstimate {
  category: string;
  averageHours: number;
  medianHours: number;
  minHours: number;
  maxHours: number;
  submissionCount: number;
  confidence: 'low' | 'medium' | 'high';
}

export type PlaytimeCategory = 'main_story' | 'main_plus_sides' | 'completionist' | 'casual' | 'dropped';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type UserGameStatus = 'wishlist' | 'backlog' | 'playing' | 'completed' | 'retired' | 'dropped';

export interface PlaytimeSubmission {
  _id: string;
  gameId: string;
  userId?: string;
  user?: {
    _id: string;
    username: string;
  };
  category: PlaytimeCategory;
  platform?: string;
  hours: number;
  notes?: string;
  rating?: number;
  comment?: string;
  status: SubmissionStatus;
  createdAt: string;
  reviewedAt?: string;
}

export interface UserLibraryEntry {
  _id: string;
  user: string;
  game: Game;
  status: UserGameStatus;
  personalRating?: number;
  personalNotes?: string;
  startedAt?: string;
  completedAt?: string;
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

export interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  game: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}