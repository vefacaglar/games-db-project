export interface IPlatform {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlatformCreate {
  name: string;
  slug: string;
}