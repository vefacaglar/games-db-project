export interface IReview {
  _id: string;
  user: string;
  game: string;
  rating: number;
  mainTime: number;
  mainPlusExtraTime?: number;
  completionistTime?: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewCreate {
  user: string;
  game: string;
  rating: number;
  mainTime: number;
  mainPlusExtraTime?: number;
  completionistTime?: number;
  comment?: string;
}

export interface IReviewUpdate {
  rating?: number;
  mainTime?: number;
  mainPlusExtraTime?: number;
  completionistTime?: number;
  comment?: string;
}