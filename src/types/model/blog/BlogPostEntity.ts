import { PrivacyEnum, StatusEnum } from "@/utils/enum"
import { Author } from "../author/AuthorEntity"
import type { IAuthor } from "../author/IAuthorEntity"
import type { IBlogPostEntity } from "./IBlogPostEntity" 
export class BlogPostEntity implements IBlogPostEntity {
  id: string = ""
  title: string = ""
  content: string = ""
  contentHtml: string = ""
  excerpt?: string 
  coverImage?: string
  coverImageUrl?: string
  author: IAuthor = new Author()
  tags: string[] = []
  privacy: PrivacyEnum = PrivacyEnum.public
  status: StatusEnum = StatusEnum.draft
  isLiked?: boolean
  likesCount: number = 0
  views: number = 0
  readingTime?: number
  createdAt: string = new Date().toISOString()
  updatedAt: string = new Date().toISOString()
  publishedAt?: string
  isPrivate?: boolean
  isPublished?: boolean
}
