export interface IList {
  _id: string;
  name: string;
  user: string;
  games: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IListCreate {
  name: string;
  user: string;
  games?: string[];
}

export interface IListUpdate {
  name?: string;
  games?: string[];
}