import type { IAuthor } from "../author/IAuthorEntity"

export interface IBlogPostEntity {
  id: string
  title: string
  content: string
  contentHtml: string
  excerpt?: string
  coverImage?: string
  coverImageUrl?: string
  author: IAuthor
  tags: string[]
  privacy: 'private' | 'couple' | 'public'
  status: 'draft' | 'published'
  isLiked?: boolean
  likesCount: number
  views: number
  readingTime?: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
  isPrivate?: boolean
  isPublished?: boolean
}