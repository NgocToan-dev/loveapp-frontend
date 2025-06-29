import type { ICoupleConnection, IUser } from "..";
import { User } from "./User";

export class CoupleConnection implements ICoupleConnection {
  id: string = "";
  _id?: string; // For backend response compatibility
  user1Id: IUser = new User(); // Can be populated or just ID
  user2Id: IUser = new User(); // Can be populated or just ID
  user1?: IUser = new User(); // Separate populated fields
  user2?: IUser; // Separate populated fields
  relationshipTitle?: string;
  relationshipStart?: string;
  status: 'pending' | 'accepted' | 'connected' | 'disconnected' | 'declined' = 'pending';
  requestedBy?: IUser | string;
  isActive: boolean = false;
  invitationCode?: string;
  requestedAt?: string;
  connectedAt?: string;
  anniversaryDate?: string;
  coupleNickname?: string;
  createdAt: string = "";
  updatedAt: string = "";

  constructor(data?: Partial<ICoupleConnection>) {
    Object.assign(this, data);
  }
}