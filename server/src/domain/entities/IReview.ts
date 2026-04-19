import { PlaytimeCategory, PlaytimeSubmissionStatus } from './PlaytimeCategory.js';

export interface IPlaytimeSubmission {
  _id: string;
  gameId: string;
  userId?: string;
  category: PlaytimeCategory;
  platform?: string;
  storefront?: string;
  hours: number;
  notes?: string;
  status: PlaytimeSubmissionStatus;
  // New fields
  progressHours?: number;
  progressMinutes?: number;
  progressSeconds?: number;
  startDate?: Date;
  completionDate?: Date;
  libraryStatus?: string[]; // ['playing', 'completed', 'retired', etc.]
  singlePlayerNotes?: {
    mainStory?: string;
    mainPlusSides?: string;
    completionist?: string;
  };
  speedrunNotes?: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface IPlaytimeSubmissionCreate {
  gameId: string;
  userId?: string;
  category: PlaytimeCategory;
  platform?: string;
  storefront?: string;
  hours: number;
  notes?: string;
  progressHours?: number;
  progressMinutes?: number;
  progressSeconds?: number;
  startDate?: Date;
  completionDate?: Date;
  libraryStatus?: string[];
  singlePlayerNotes?: {
    mainStory?: string;
    main_plus_sides?: string;
    completionist?: string;
  };
  speedrunNotes?: string;
}

export interface IPlaytimeSubmissionUpdate {
  platform?: string;
  storefront?: string;
  hours?: number;
  notes?: string;
  progressHours?: number;
  progressMinutes?: number;
  progressSeconds?: number;
  startDate?: Date;
  completionDate?: Date;
  libraryStatus?: string[];
  singlePlayerNotes?: object;
  speedrunNotes?: string;
}