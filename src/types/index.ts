// User types

import type { IUserEntity } from "./model/user/IUserEntity"

// Export aliases for backwards compatibility
export type IUser = IUserEntity
export type User = IUserEntity
export type CoupleConnection = ICoupleConnection
export type { IUserEntity }


export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  username: string
  displayName?: string
  dateOfBirth?: string
}

// Couple & Relationship types
export interface ICoupleConnection {
  id: string
  _id?: string // For backend response compatibility
  user1Id: string // Can be populated or just ID
  user2Id: string // Can be populated or just ID
  user1?: IUserEntity // Separate populated fields
  user2?: IUserEntity // Separate populated fields
  relationshipTitle?: string
  relationshipStart?: string
  status: 'pending' | 'accepted' | 'connected' | 'disconnected' | 'declined'
  requestedBy?: IUserEntity | string
  isActive: boolean
  invitationCode?: string
  requestedAt?: string
  connectedAt?: string
  anniversaryDate?: string
  coupleNickname?: string
  createdAt: string
  updatedAt: string
}

export interface CoupleInvitation {
  _id: string
  id?: string // For frontend compatibility
  user1Id: string
  user2Id: string  
  status: 'pending' | 'accepted' | 'declined'
  requestedBy: string
  relationshipTitle: string
  isActive: boolean
  requestedAt: string
  connectedAt?: string
  createdAt: string
  updatedAt: string
}

// Memory types
export interface Memory {
  id: string
  _id?: string // For backend compatibility
  coupleId: string
  title: string
  description: string
  content: string
  imageUrl?: string
  imagePublicId?: string
  images?: string[] // For frontend compatibility
  location?: string
  date: string
  tags?: string[] // Made optional to match API response
  mood?: 'happy' | 'love' | 'excited' | 'romantic' | 'nostalgic' | 'grateful'
  isPrivate: boolean
  isFavorite?: boolean // For frontend state
  createdBy: string
  createdAt: string
  updatedAt: string
  author: IUserEntity
  userId?: string // For API response compatibility
}

export interface CreateMemoryRequest {
  title: string
  description: string
  content?: string
  images?: string[] // Array of image URLs instead of File objects
  location?: string
  date: string
  tags?: string[] // Made optional
  mood?: 'happy' | 'love' | 'excited' | 'romantic' | 'nostalgic' | 'grateful'
  isPrivate?: boolean
}

export interface UpdateMemoryRequest extends Partial<CreateMemoryRequest> {
  id: string
  isFavorite?: boolean
  images?: string[] // Array of image URLs instead of File objects
}

// Reminder types
export interface Reminder {
  id: string
  _id?: string // Backend MongoDB ID
  userId?: {
    _id: string
    displayName: string
    avatarUrl: string
  }
  coupleId: string
  title: string
  description?: string
  datetime: string // Only datetime field needed
  // Computed frontend fields (derived from datetime)
  reminderDate: string
  reminderTime: string
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  type: 'anniversary' | 'birthday' | 'date' | 'custom'
  isRecurring: boolean
  recurringType?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  isCompleted: boolean
  notified: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateReminderRequest {
  title: string
  description?: string
  datetime: string // Only send datetime to backend
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  type: 'anniversary' | 'birthday' | 'date' | 'custom'
}

export interface UpdateReminderRequest extends Partial<CreateReminderRequest> {
  id: string
  isCompleted?: boolean
}

export interface CreateBlogPostRequest {
  title: string
  content: string
  contentHtml: string
  excerpt?: string
  coverImage?: File
  coverImageUrl?: string
  tags?: string[]
  privacy?: 'private' | 'couple' | 'public'
  status?: 'draft' | 'published'
  isPrivate?: boolean
  isPublished?: boolean
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {
  id: string
  isPublished?: boolean
  publishedAt?: string
}

export interface BlogPostFilters {
  search?: string
  tags?: string[]
  privacy?: 'all' | 'private' | 'couple' | 'public'
  status?: 'all' | 'draft' | 'published'
  author?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'latest' | 'oldest' | 'popular' | 'views'
}

export interface BlogPostStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalLikes: number
  totalComments: number
  avgLikesPerPost: number
  avgCommentsPerPost: number
  popularTags?: { tag: string; count: number }[]
}

export interface BlogComment {
  id: string
  postId: string
  author: {
    id: string
    displayName: string
    avatarUrl?: string
  }
  content: string
  parentId?: string
  replies?: BlogComment[]
  likesCount: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBlogCommentRequest {
  postId: string
  content: string
  parentId?: string
}

// Timeline types
export interface TimelineEvent {
  id: string
  coupleId: string
  type: 'memory' | 'reminder' | 'anniversary' | 'milestone'
  title: string
  description?: string
  date: string
  imageUrl?: string
  relatedId?: string // ID of related memory, reminder, etc.
  createdAt: string
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: 'reminder' | 'anniversary' | 'couple_request' | 'memory_shared' | 'system'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  relatedId?: string
  createdAt: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T = any> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'tel' | 'date' | 'textarea' | 'select' | 'file'
  value: any
  placeholder?: string
  required?: boolean
  validation?: ValidationRule[]
  options?: SelectOption[]
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern'
  value?: any
  message: string
}

export interface SelectOption {
  label: string
  value: any
}

// UI State types
export interface LoadingState {
  isLoading: boolean
  message?: string
}

export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  actions?: ToastAction[]
}

export interface ToastAction {
  label: string
  action: () => void
}

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

// Settings types
export interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    reminders: boolean
    anniversaries: boolean
    memories: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'couple_only'
    memoriesVisibility: 'public' | 'private' | 'couple_only'
    allowSearchByEmail: boolean
  }
  theme: ThemeConfig
  language: 'en' | 'vi'
}

// File upload types
export interface FileUploadResponse {
  url: string
  publicId: string
  size: number
  format: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// Search types
export interface SearchFilters {
  query?: string
  type?: 'memory' | 'reminder' | 'blog'
  dateFrom?: string
  dateTo?: string
  tags?: string[]
  isPrivate?: boolean
}

export interface SearchResult<T = any> {
  id: string
  type: 'memory' | 'reminder' | 'blog'
  title: string
  excerpt?: string
  imageUrl?: string
  date: string
  relevanceScore: number
  data: T
}

// Statistics types
export interface CoupleStatistics {
  daysTogether: number
  memoriesCount: number
  remindersCount: number
  photosUploaded: number
  averageMemoriesPerMonth: number
  nextAnniversary: string
  specialDatesThisMonth: number
}

// Export commonly used unions
export type NotificationType = Notification['type']
export type ReminderType = Reminder['type']
export type MemoryType = 'text' | 'photo' | 'video'
export type ConnectionStatus = ICoupleConnection['status']
export type ThemeMode = ThemeConfig['mode']

// Export timeline types
export type {
  TimelineAuthor,
  TimelineItem,
  TimelineQueryParams,
  TimelinePagination,
  TimelineResponse,
  TimelineStats,
  TimelineStatsFlat,
  TimelineFilter
} from './timeline'
