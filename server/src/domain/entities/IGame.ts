export interface IGame {
  _id: string;
  title: string;
  description?: string;
  genre?: string;
  platforms: string[];
  coverImage?: string;
  averageRating: number;
  totalRatings: number;
  averageMainTime: number;
  averageMainPlusExtraTime: number;
  averageCompletionistTime: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGameCreate {
  title: string;
  description?: string;
  genre?: string;
  platforms?: string[];
  coverImage?: string;
}

export interface IGameUpdate {
  title?: string;
  description?: string;
  genre?: string;
  platforms?: string[];
  coverImage?: string;
}