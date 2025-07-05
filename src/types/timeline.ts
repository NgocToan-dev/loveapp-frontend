export interface TimelineAuthor {
  _id: string
  displayName: string
  avatarUrl?: string
}

export interface TimelineItem {
  id: string
  type: 'memory' | 'reminder' | 'blog' | 'anniversary'
  title: string
  description?: string
  content?: string
  date: string
  imageUrl?: string
  tags?: string[]
  author?: TimelineAuthor
  isCompleted?: boolean
  likes?: number
  comments?: number
  metadata?: Record<string, any>
}

export interface TimelineQueryParams {
  page?: number
  limit?: number
  type?: 'all' | 'memories' | 'reminders' | 'blog' | 'anniversaries'
  dateFrom?: string
  dateTo?: string
  sortBy?: 'date' | 'likes' | 'views'
  sortOrder?: 'asc' | 'desc'
}

export interface TimelinePagination {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface TimelineResponse {
  items: TimelineItem[]
  pagination: TimelinePagination
}

export interface TimelineStats {
  stats: {
    totals: {
      memories: number
      reminders: number
      blogPosts: number
      completedReminders: number
    }
    recent: {
      memories: number
      reminders: number
      blogPosts: number
      totalActivity: number
    }
    completion: {
      reminderCompletionRate: number
    }
  }
}

// Helper interface for easier access to stats
export interface TimelineStatsFlat {
  totalMemories: number
  totalReminders: number
  totalBlogPosts: number
  totalAnniversaries: number
  recentActivityCount: number
  completedReminders: number
  reminderCompletionRate: number
}

// Filter types for timeline
export interface TimelineFilter {
  value: string
  label: string
  icon: string
  count?: number
}
