export interface IGame {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IGameCreate {
  title: string;
  description?: string;
  genre?: string;
  platform?: string[];
  playTime: number;
  coverImage?: string;
  rating?: number;
}

export interface IGameUpdate {
  title?: string;
  description?: string;
  genre?: string;
  platform?: string[];
  playTime?: number;
  coverImage?: string;
  rating?: number;
}