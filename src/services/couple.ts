import api from './api'
import type { CoupleConnection, CoupleInvitation, User } from '@/types'

export const coupleService = {
  // Get current couple connection
  async getCoupleConnection(): Promise<CoupleConnection | null> {
    try {
      const response = await api.get('/couple/connection')
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  // Send couple invitation
  async sendInvitation(email: string): Promise<CoupleInvitation> {
    const response = await api.post('/couple/invite', { email })
    return response.data
  },

  // Accept couple invitation
  async acceptInvitation(invitationCode: string): Promise<CoupleConnection> {
    const response = await api.post('/couple/accept', { invitationCode })
    return response.data
  },

  // Reject couple invitation
  async rejectInvitation(invitationCode: string): Promise<void> {
    await api.post('/couple/reject', { invitationCode })
  },

  // Get pending invitations
  async getPendingInvitations(): Promise<CoupleInvitation[]> {
    try {
      const response = await api.get('/couple/invitations')
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  // Disconnect from couple
  async disconnectCouple(): Promise<void> {
    await api.delete('/couple/connection')
  },

  // Update relationship start date
  async updateRelationshipStart(date: string): Promise<CoupleConnection> {
    const response = await api.put('/couple/relationship-start', { date })
    return response.data
  },

  // Get couple statistics
  async getCoupleStatistics(): Promise<any> {
    const response = await api.get('/couple/statistics')
    return response.data
  },

  // Search for users by email (for invitations)
  async searchUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await api.get(`/users/search?email=${encodeURIComponent(email)}`)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  // Generate new invitation code
  async generateInvitationCode(): Promise<{ invitationCode: string }> {
    const response = await api.post('/couple/generate-code')
    return response.data
  }
}
