import type { ICoupleConnection } from "..";
import { UserEntity } from "./user/UserEntity";

export class CoupleConnection implements ICoupleConnection {
  id: string = "";
  _id?: string; // For backend response compatibility
  user1Id: string = ""; // Can be populated or just ID
  user2Id: string = ""; // Can be populated or just ID
  user1?: UserEntity = new UserEntity(); // Separate populated fields
  user2?: UserEntity = new UserEntity(); // Separate populated fields
  relationshipTitle?: string;
  relationshipStart?: string;
  status: 'pending' | 'accepted' | 'connected' | 'disconnected' | 'declined' = 'pending';
  requestedBy?: UserEntity | string;
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