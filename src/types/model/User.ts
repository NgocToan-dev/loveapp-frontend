import type { IUser } from "..";

export class User implements IUser {
  _id: string = "";
  id?: string; // Support backend response
  email: string = "";
  displayName: string = "";
  profilePicture?: string;
  bio?: string;
  createdAt: string = "";
  updatedAt: string = "";

  constructor(data?: Partial<IUser>) {
    Object.assign(this, data);
  }
}
