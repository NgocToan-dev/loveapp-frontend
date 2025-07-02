import type { IAuthor } from "./IAuthorEntity";
export class Author implements IAuthor {
  id: string = "";
  displayName: string = "";
  avatarUrl?: string = "";
}
