import type { IUserEntity } from "./IUserEntity";

export class UserEntity implements IUserEntity {
  _id: string = "";
  id?: string; // Support backend response
  email: string = "";
  displayName: string = "";
  profilePicture?: string;
  username?: string = "";
  bio?: string = "";
  firstName?: string = "";
  lastName?: string = "";
  avatarUrl?: string = "";
  dateOfBirth?: string = "";
  phone?: string = "";
  coupleId?: string = "";
  isEmailVerified?: boolean = false;
  createdAt: string = "";
  updatedAt?: string = "";

  constructor(data?: IUserEntity) {
    Object.assign(this, data);
  }
}
