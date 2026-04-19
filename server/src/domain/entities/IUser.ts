export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface IUserUpdate {
  username?: string;
  email?: string;
  password?: string;
}

export type UserRole = 'user' | 'admin';