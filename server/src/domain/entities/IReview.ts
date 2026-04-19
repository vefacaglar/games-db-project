import { PlaytimeCategory, PlaytimeSubmissionStatus } from './PlaytimeCategory.js';

export interface IPlaytimeSubmission {
  _id: string;
  gameId: string;
  userId?: string;
  category: PlaytimeCategory;
  platform?: string;
  hours: number;
  notes?: string;
  status: PlaytimeSubmissionStatus;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface IPlaytimeSubmissionCreate {
  gameId: string;
  userId?: string;
  category: PlaytimeCategory;
  platform?: string;
  hours: number;
  notes?: string;
}

export interface IPlaytimeSubmissionUpdate {
  platform?: string;
  hours?: number;
  notes?: string;
}