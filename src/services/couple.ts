import api from './api'
import type { CoupleConnection, CoupleInvitation, User } from '@/types'

// Helper function to format date for API
const formatDateForApi = (dateString: string): string => {
  // If already in ISO format, return as is
  if (dateString.includes('T')) {
    return dateString
  }

  // Convert YYYY-MM-DD to ISO datetime
  const date = new Date(`${dateString}T00:00:00.000Z`)
  return date.toISOString()
}

export const coupleService = {
  // Get current couple connection
  async getCoupleConnection(): Promise<CoupleConnection | null> {
    try {
      const response = await api.get('/couple/connection')
      return response.data.couple || response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  // Send couple invitation
  async sendInvitation(email: string, anniversaryDate?: string): Promise<CoupleConnection> {
    const requestData: any = { partnerEmail: email }
    if (anniversaryDate) {
      requestData.anniversaryDate = formatDateForApi(anniversaryDate)
    }
    const response = await api.post('/couple/connect', requestData)
    return response.data.couple
  },

  // Accept couple invitation
  async acceptInvitation(coupleId: string): Promise<CoupleConnection> {
    const response = await api.post('/couple/respond', { coupleId, action: 'accept' })
    return response.data.couple || response.data
  },

  // Reject couple invitation
  async rejectInvitation(coupleId: string): Promise<void> {
    await api.post('/couple/respond', { coupleId, action: 'decline' })
  },

  // Get pending invitations
  async getPendingInvitations(): Promise<CoupleInvitation[]> {
    try {
      const response = await api.get('/couple/invitations')
      // Backend returns { requests: [...] } but we need just the array
      return response.data.requests || response.data || []
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },

  // Disconnect from couple
  async disconnectCouple(): Promise<void> {
    await api.delete('/couple/disconnect')
  },

  // Update couple relationship
  async updateCouple(data: {
    relationshipTitle?: string
    coupleNickname?: string
    anniversaryDate?: string
  }): Promise<CoupleConnection> {
    // Convert date to ISO format if provided
    const updateData = { ...data }
    if (updateData.anniversaryDate) {
      updateData.anniversaryDate = formatDateForApi(updateData.anniversaryDate)
    }
    const response = await api.put('/couple/update', updateData)
    return response.data.couple || response.data
  },

  // Update relationship start date
  async updateRelationshipStart(date: string): Promise<CoupleConnection> {
    // Convert date string to ISO datetime format for backend validation
    const isoDate = formatDateForApi(date)
    const response = await api.put('/couple/update', { anniversaryDate: isoDate })
    return response.data.couple || response.data
  },

  // Search user by email
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

  // Generate invitation code
  async generateInvitationCode(): Promise<{ invitationCode: string }> {
    const response = await api.post('/couple/generate-code')
    return response.data
  }
}
