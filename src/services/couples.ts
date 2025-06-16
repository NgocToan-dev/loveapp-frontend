import type { PaginationParams } from '@/types'
import ApiService from './api'

export interface Couple {
  id: string
  user1Id: string
  user2Id: string
  relationshipStartDate: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  updatedAt: string
  user1?: {
    id: string
    displayName: string
    email: string
    photoURL?: string
  }
  user2?: {
    id: string
    displayName: string
    email: string
    photoURL?: string
  }
}

export interface CoupleInvitation {
  id: string
  senderId: string
  receiverEmail: string
  receiverId?: string
  invitationCode: string
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  expiresAt: string
  createdAt: string
  updatedAt: string
  sender?: {
    id: string
    displayName: string
    email: string
    photoURL?: string
  }
}

export interface Partnership {
  id: string
  coupleId: string
  name: string
  description?: string
  type: 'relationship' | 'engagement' | 'marriage' | 'anniversary'
  startDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LoveDay {
  id: string
  coupleId: string
  title: string
  description?: string
  date: string
  type: 'anniversary' | 'first_date' | 'proposal' | 'wedding' | 'milestone' | 'other'
  isRecurring: boolean
  reminderDays?: number
  createdAt: string
  updatedAt: string
}

export interface CreateInvitationData {
  receiverEmail: string
  message?: string
}

export interface CreatePartnershipData {
  name: string
  description?: string
  type: 'relationship' | 'engagement' | 'marriage' | 'anniversary'
  startDate: string
}

export interface CreateLoveDayData {
  title: string
  description?: string
  date: string
  type: 'anniversary' | 'first_date' | 'proposal' | 'wedding' | 'milestone' | 'other'
  isRecurring: boolean
  reminderDays?: number
}

class CouplesService {
  private readonly baseUrl = '/couples'

  // Couple Management
  async getCurrentCouple(): Promise<Couple | null> {
    try {
      return await ApiService.get<Couple>(`${this.baseUrl}/current`)
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  async getCoupleById(id: string): Promise<Couple> {
    return await ApiService.get<Couple>(`${this.baseUrl}/${id}`)
  }

  async updateCouple(id: string, data: Partial<Couple>): Promise<Couple> {
    return await ApiService.put<Couple>(`${this.baseUrl}/${id}`, data)
  }

  // Couple Invitations
  async sendInvitation(data: CreateInvitationData): Promise<CoupleInvitation> {
    return await ApiService.post<CoupleInvitation>(`${this.baseUrl}/invitations`, data)
  }

  async getMyInvitations(): Promise<{
    sent: CoupleInvitation[]
    received: CoupleInvitation[]
  }> {
    return await ApiService.get<{
      sent: CoupleInvitation[]
      received: CoupleInvitation[]
    }>(`${this.baseUrl}/invitations/my`)
  }

  async acceptInvitation(invitationId: string): Promise<Couple> {
    return await ApiService.post<Couple>(`${this.baseUrl}/invitations/${invitationId}/accept`)
  }

  async rejectInvitation(invitationId: string): Promise<void> {
    return await ApiService.post<void>(`${this.baseUrl}/invitations/${invitationId}/reject`)
  }

  async joinByCode(invitationCode: string): Promise<Couple> {
    return await ApiService.post<Couple>(`${this.baseUrl}/join`, { invitationCode })
  }

  // Partnerships
  async getPartnerships(): Promise<Partnership[]> {
    return await ApiService.get<Partnership[]>(`${this.baseUrl}/partnerships`)
  }

  async createPartnership(data: CreatePartnershipData): Promise<Partnership> {
    return await ApiService.post<Partnership>(`${this.baseUrl}/partnerships`, data)
  }

  async updatePartnership(id: string, data: Partial<CreatePartnershipData>): Promise<Partnership> {
    return await ApiService.put<Partnership>(`${this.baseUrl}/partnerships/${id}`, data)
  }

  async deletePartnership(id: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/partnerships/${id}`)
  }

  // Love Days
  async getLoveDays(): Promise<LoveDay[]> {
    return await ApiService.get<LoveDay[]>(`${this.baseUrl}/love-days`)
  }

  async createLoveDay(data: CreateLoveDayData): Promise<LoveDay> {
    return await ApiService.post<LoveDay>(`${this.baseUrl}/love-days`, data)
  }

  async updateLoveDay(id: string, data: Partial<CreateLoveDayData>): Promise<LoveDay> {
    return await ApiService.put<LoveDay>(`${this.baseUrl}/love-days/${id}`, data)
  }

  async deleteLoveDay(id: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/love-days/${id}`)
  }

  async getUpcomingLoveDays(): Promise<LoveDay[]> {
    return await ApiService.get<LoveDay[]>(`${this.baseUrl}/love-days/upcoming`)
  }

  // Statistics
  async getCoupleStats(): Promise<{
    daysTogether: number
    memoriesCount: number
    notesCount: number
    loveDaysCount: number
  }> {
    return await ApiService.get<{
      daysTogether: number
      memoriesCount: number
      notesCount: number
      loveDaysCount: number
    }>(`${this.baseUrl}/stats`)
  }
}

export const couplesService = new CouplesService() 