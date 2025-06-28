// User types
export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  avatar?: string
  dateOfBirth?: string
  phone?: string
  bio?: string
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

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
  dateOfBirth?: string
}

// Couple & Relationship types
export interface CoupleConnection {
  id: string
  user1Id: string
  user2Id: string
  user1: User
  user2: User
  relationshipStart: string
  status: 'pending' | 'connected' | 'disconnected'
  invitationCode?: string
  createdAt: string
  updatedAt: string
}

export interface CoupleInvitation {
  id: string
  fromUserId: string
  toEmail: string
  invitationCode: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  expiresAt: string
  createdAt: string
}

// Memory types
export interface Memory {
  id: string
  coupleId: string
  title: string
  content: string
  imageUrl?: string
  imagePublicId?: string
  location?: string
  date: string
  tags: string[]
  isPrivate: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  author: User
}

export interface CreateMemoryRequest {
  title: string
  content: string
  image?: File
  location?: string
  date: string
  tags: string[]
  isPrivate?: boolean
}

export interface UpdateMemoryRequest extends Partial<CreateMemoryRequest> {
  id: string
}

// Reminder types
export interface Reminder {
  id: string
  coupleId: string
  title: string
  description?: string
  reminderDate: string
  reminderTime: string
  type: 'anniversary' | 'birthday' | 'date' | 'custom'
  isRecurring: boolean
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  isCompleted: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateReminderRequest {
  title: string
  description?: string
  reminderDate: string
  reminderTime: string
  type: 'anniversary' | 'birthday' | 'date' | 'custom'
  isRecurring?: boolean
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export interface UpdateReminderRequest extends Partial<CreateReminderRequest> {
  id: string
  isCompleted?: boolean
}

// Blog types
export interface BlogPost {
  id: string
  title: string
  content: string
  contentHtml: string
  excerpt?: string
  coverImage?: string
  coverImageUrl?: string
  author: {
    id: string
    displayName: string
    avatarUrl?: string
  }
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
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {
  id: string
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
  totalViews: number
  totalLikes: number
  postsThisMonth: number
  popularTags: { tag: string; count: number }[]
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
export type ConnectionStatus = CoupleConnection['status']
export type ThemeMode = ThemeConfig['mode']
