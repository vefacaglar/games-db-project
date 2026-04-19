import { UserGameStatus as Status } from './PlaytimeCategory.js';

export interface IUserGameLibrary {
  _id: string;
  user: string;
  game: string;
  status: Status;
  personalRating?: number;
  personalNotes?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserGameLibraryCreate {
  user: string;
  game: string;
  status: Status;
  personalRating?: number;
  personalNotes?: string;
}

export interface IUserGameLibraryUpdate {
  status?: Status;
  personalRating?: number;
  personalNotes?: string;
  startedAt?: Date;
  completedAt?: Date;
}