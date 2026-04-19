export interface IReview {
  _id: string;
  user: string;
  game: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewCreate {
  user: string;
  game: string;
  rating: number;
  comment?: string;
}

export interface IReviewUpdate {
  rating?: number;
  comment?: string;
}