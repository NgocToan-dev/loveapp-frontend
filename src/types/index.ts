// Base types for the application

export interface User {
  id: string
  email: string
  name: string
  displayName?: string
  photoURL?: string
  isEmailVerified: boolean
  emailVerified?: boolean // Keep for backward compatibility
  role: string
  createdAt: string | Date
  updatedAt: string | Date
  lastLoginAt?: string | Date
  bio?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  preferences?: UserPreferences
}

export interface UserPreferences {
  language: 'en' | 'vi'
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  notifications: {
    email: {
      enabled: boolean
      reminders: boolean
      anniversaries: boolean
    }
    push: {
      enabled: boolean
      reminders: boolean
    }
  }
}

export interface Memory {
  id: string
  title: string
  description: string
  memoryDate: string
  location?: string
  tags: string[]
  isPrivate: boolean
  isFavorite: boolean
  isShared: boolean
  files: FileItem[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  isPrivate: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Reminder {
  id: string
  title: string
  description?: string
  reminderDate: Date
  priority: 'low' | 'medium' | 'high'
  repeat?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  isCompleted: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Anniversary {
  id: string
  title: string
  description?: string
  date: string
  type: 'relationship' | 'milestone' | 'birthday' | 'other'
  isRecurring: boolean
  frequency?: 'yearly' | 'monthly'
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    tokens: AuthTokens
    isNewUser: boolean
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface FileItem {
  id: string
  userId: string
  fileName: string
  originalName: string
  tags: string[]
  category: string
  bucketName: string
  objectName: string
  checksum: string
  metadata: {
    size: number
    mimeType: string
  }
  processing: {
    status: string
    thumbnailGenerated: boolean
    compressionApplied: boolean
    virusScanned: boolean
  }
  versions: unknown[]
  currentVersion: number
  shares: unknown[]
  isPublic: boolean
  usage: {
    downloadCount: number
    viewCount: number
    shareCount: number
    totalBandwidthUsed: number
    popularityScore: number
  }
  backups: unknown[]
  createdAt: string | Date
  updatedAt: string | Date
  
  // Computed properties for backward compatibility
  name?: string
  size?: number
  type?: string
  url?: string
  thumbnailUrl?: string
  uploadedBy?: string
  uploadedAt?: Date
  lastModified?: Date
  description?: string
}

export interface FileUploadProgress {
  name: string
  progress: number
  loaded: number
  total: number
  status?: 'uploading' | 'completed' | 'error' | 'cancelled'
  error?: string
  fileId?: string
}

export interface FilesState {
  files: FileItem[]
  uploadProgress: FileUploadProgress[]
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalFiles: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface UploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  generateThumbnail?: boolean
  tags?: string[]
  description?: string
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'vi' | 'en'
  notifications: {
    email: boolean
    push: boolean
    fileUploads: boolean
    systemUpdates: boolean
  }
  privacy: {
    publicProfile: boolean
    showEmail: boolean
  }
}

export interface DashboardStats {
  totalFiles: number
  totalSize: number
  recentUploads: number
  storageUsed: number
  storageLimit: number
}

// API Error types
export interface ApiError {
  code: string
  message: string
  details?: unknown
}


// MinIO specific types
export interface MinIOConfig {
  endpoint: string
  accessKey: string
  secretKey: string
  bucket: string
  region?: string
  useSSL?: boolean
}

// Route types
export interface RouteConfig {
  path: string
  name: string
  component: unknown
  meta?: {
    requiresAuth?: boolean
    title?: string
    description?: string
  }
}

// Form validation types
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: unknown) => boolean | string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'file' | 'textarea' | 'select'
  rules?: ValidationRule[]
  options?: { value: unknown; label: string }[]
  placeholder?: string
  hint?: string
}

// Theme types
export interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  error: string
  warning: string
  info: string
  success: string
  background: string
  surface: string
}