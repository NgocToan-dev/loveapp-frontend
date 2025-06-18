import ApiService from './api'

// Core couple interfaces based on actual API endpoints
export interface CoupleProfile {
  id: string
  user1Id: string
  user2Id: string
  relationshipStartDate: string
  status: 'active' | 'inactive' | 'pending'
  preferences?: CouplePreferences
  createdAt: string
  updatedAt: string
}

export interface Partner {
  id: string
  name: string
  displayName?: string
  email: string
  photoURL?: string
  isEmailVerified: boolean
  lastLoginAt?: string
  createdAt: string
}

export interface CoupleStats {
  daysTogether: number
  memoriesCount: number
  notesCount: number
  filesCount: number
  anniversariesCount: number
  remindersCount: number
}

export interface CoupleStatus {
  isConnected: boolean
  connectionDate?: string
  status: 'active' | 'inactive' | 'pending'
  partnerId?: string
}

export interface CouplePreferences {
  timezone?: string
  notifications: {
    email: boolean
    push: boolean
    anniversaries: boolean
    reminders: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    shareMemories: boolean
    shareNotes: boolean
  }
  theme?: string
  language?: string
}

export interface UpdateCoupleProfileData {
  relationshipStartDate?: string
  preferences?: Partial<CouplePreferences>
}

export interface LoveDay {
  id: string
  title: string
  date: string
  type: 'anniversary' | 'first_date' | 'proposal' | 'wedding' | 'milestone' | 'other'
  description?: string
  isRecurring?: boolean
  reminderEnabled?: boolean
  reminderDays?: number
  createdAt: string
  updatedAt: string
}

class CouplesService {
  private readonly baseUrl = '/couple'

  // Get couple profile
  async getProfile(): Promise<CoupleProfile> {
    return await ApiService.get<CoupleProfile>(`${this.baseUrl}/profile`)
  }

  // Update couple profile
  async updateProfile(data: UpdateCoupleProfileData): Promise<CoupleProfile> {
    return await ApiService.put<CoupleProfile>(`${this.baseUrl}/profile`, data)
  }

  // Get partner information
  async getPartner(): Promise<Partner> {
    return await ApiService.get<Partner>(`${this.baseUrl}/partner`)
  }

  // Get couple statistics
  async getStats(): Promise<CoupleStats> {
    return await ApiService.get<CoupleStats>(`${this.baseUrl}/stats`)
  }

  // Get couple connection status
  async getStatus(): Promise<CoupleStatus> {
    return await ApiService.get<CoupleStatus>(`${this.baseUrl}/status`)
  }

  // Disconnect from partner
  async disconnect(): Promise<{ success: boolean; message: string }> {
    return await ApiService.post<{ success: boolean; message: string }>(`${this.baseUrl}/disconnect`)
  }

  // Reconnect with partner
  async reconnect(): Promise<{ success: boolean; message: string }> {
    return await ApiService.post<{ success: boolean; message: string }>(`${this.baseUrl}/reconnect`)
  }

  // Update couple preferences
  async updatePreferences(preferences: Partial<CouplePreferences>): Promise<CoupleProfile> {
    return await ApiService.put<CoupleProfile>(`${this.baseUrl}/preferences`, preferences)
  }
}

export const couplesService = new CouplesService()