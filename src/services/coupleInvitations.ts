import ApiService from './api'

export interface CoupleInvitation {
  id: string
  senderId: string
  receiverEmail: string
  receiverId?: string
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  expiresAt: string
  createdAt: string
  updatedAt: string
  sender?: {
    id: string
    name: string
    email: string
    photoURL?: string
  }
  receiver?: {
    id: string
    name: string
    email: string
    photoURL?: string
  }
}

export interface InvitationStats {
  totalSent: number
  totalReceived: number
  pendingSent: number
  pendingReceived: number
  acceptedCount: number
  rejectedCount: number
}

export interface CreateInvitationData {
  receiverEmail: string
  message?: string
}

class CoupleInvitationsService {
  private readonly baseUrl = '/couple-invitations'

  // Get received invitations
  async getReceivedInvitations(): Promise<CoupleInvitation[]> {
    return await ApiService.get<CoupleInvitation[]>(this.baseUrl)
  }

  // Get sent invitations
  async getSentInvitations(): Promise<CoupleInvitation[]> {
    return await ApiService.get<CoupleInvitation[]>(`${this.baseUrl}/sent`)
  }

  // Send invitation
  async sendInvitation(data: CreateInvitationData): Promise<CoupleInvitation> {
    return await ApiService.post<CoupleInvitation>(this.baseUrl, data)
  }

  // Accept invitation
  async acceptInvitation(invitationId: string): Promise<{ 
    invitation: CoupleInvitation
    couple: any 
  }> {
    return await ApiService.post<{ 
      invitation: CoupleInvitation
      couple: any 
    }>(`${this.baseUrl}/${invitationId}/accept`)
  }

  // Reject invitation
  async rejectInvitation(invitationId: string): Promise<CoupleInvitation> {
    return await ApiService.post<CoupleInvitation>(`${this.baseUrl}/${invitationId}/reject`)
  }

  // Get invitation details
  async getInvitation(invitationId: string): Promise<CoupleInvitation> {
    return await ApiService.get<CoupleInvitation>(`${this.baseUrl}/${invitationId}`)
  }

  // Cancel invitation (delete)
  async cancelInvitation(invitationId: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/${invitationId}/cancel`)
  }

  // Get invitation statistics
  async getStats(): Promise<InvitationStats> {
    return await ApiService.get<InvitationStats>(`${this.baseUrl}/stats`)
  }
}

export const coupleInvitationsService = new CoupleInvitationsService()