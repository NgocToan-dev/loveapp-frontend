import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  couplesService,
  type CoupleProfile,
  type Partner,
  type CoupleStats,
  type CoupleStatus,
  type CouplePreferences,
  type UpdateCoupleProfileData
} from '@/services/couples'
import { coupleInvitationsService, type CoupleInvitation } from '@/services/coupleInvitations'

export const useCouplesStore = defineStore('couples', () => {
  // State
  const coupleProfile = ref<CoupleProfile | null>(null)
  const partner = ref<Partner | null>(null)
  const coupleStats = ref<CoupleStats | null>(null)
  const coupleStatus = ref<CoupleStatus | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Invitation state
  const pendingReceivedInvitations = ref<CoupleInvitation[]>([])
  const pendingSentInvitations = ref<CoupleInvitation[]>([])
  const currentCouple = ref<CoupleProfile | null>(null)

  // Getters
  const isConnected = computed(() => coupleStatus.value?.isConnected ?? false)
  
  const daysTogether = computed(() => {
    if (!coupleProfile.value?.relationshipStartDate) return 0
    const startDate = new Date(coupleProfile.value.relationshipStartDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })

  const hasPartner = computed(() => partner.value !== null)

  const preferences = computed(() => coupleProfile.value?.preferences || null)

  // Actions
  const fetchProfile = async () => {
    try {
      isLoading.value = true
      error.value = null
      coupleProfile.value = await couplesService.getProfile()
    } catch (err: any) {
      if (err.response?.status === 404) {
        // No couple profile exists yet
        coupleProfile.value = null
      } else {
        error.value = err.message || 'Failed to fetch couple profile'
        console.error('Error fetching couple profile:', err)
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (data: UpdateCoupleProfileData) => {
    try {
      isLoading.value = true
      error.value = null
      coupleProfile.value = await couplesService.updateProfile(data)
      return coupleProfile.value
    } catch (err: any) {
      error.value = err.message || 'Failed to update couple profile'
      console.error('Error updating couple profile:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchPartner = async () => {
    try {
      isLoading.value = true
      error.value = null
      partner.value = await couplesService.getPartner()
    } catch (err: any) {
      if (err.response?.status === 404) {
        // No partner connected
        partner.value = null
      } else {
        error.value = err.message || 'Failed to fetch partner information'
        console.error('Error fetching partner:', err)
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchStats = async () => {
    try {
      isLoading.value = true
      error.value = null
      coupleStats.value = await couplesService.getStats()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch couple stats'
      console.error('Error fetching couple stats:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchStatus = async () => {
    try {
      isLoading.value = true
      error.value = null
      coupleStatus.value = await couplesService.getStatus()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch couple status'
      console.error('Error fetching couple status:', err)
    } finally {
      isLoading.value = false
    }
  }

  const disconnect = async () => {
    try {
      isLoading.value = true
      error.value = null
      const result = await couplesService.disconnect()
      
      // Update local state
      coupleStatus.value = { isConnected: false, status: 'inactive' }
      partner.value = null
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Failed to disconnect from partner'
      console.error('Error disconnecting:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const reconnect = async () => {
    try {
      isLoading.value = true
      error.value = null
      const result = await couplesService.reconnect()
      
      // Refresh data after reconnection
      await Promise.all([
        fetchStatus(),
        fetchPartner(),
        fetchProfile()
      ])
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Failed to reconnect with partner'
      console.error('Error reconnecting:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updatePreferences = async (preferences: Partial<CouplePreferences>) => {
    try {
      isLoading.value = true
      error.value = null
      coupleProfile.value = await couplesService.updatePreferences(preferences)
      return coupleProfile.value
    } catch (err: any) {
      error.value = err.message || 'Failed to update preferences'
      console.error('Error updating preferences:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchAll = async () => {
    try {
      isLoading.value = true
      error.value = null
      await Promise.all([
        fetchProfile(),
        fetchPartner(),
        fetchStats(),
        fetchStatus()
      ])
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch couple data'
      console.error('Error fetching all couple data:', err)
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    coupleProfile.value = null
    partner.value = null
    coupleStats.value = null
    coupleStatus.value = null
    error.value = null
    isLoading.value = false
  }

  // Invitation actions
  const fetchReceivedInvitations = async () => {
    try {
      isLoading.value = true
      error.value = null
      pendingReceivedInvitations.value = await coupleInvitationsService.getReceivedInvitations()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch received invitations'
      console.error('Error fetching received invitations:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchSentInvitations = async () => {
    try {
      isLoading.value = true
      error.value = null
      pendingSentInvitations.value = await coupleInvitationsService.getSentInvitations()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch sent invitations'
      console.error('Error fetching sent invitations:', err)
    } finally {
      isLoading.value = false
    }
  }

  const sendInvitation = async (data: { email: string; message?: string }) => {
    try {
      isLoading.value = true
      error.value = null
      const invitation = await coupleInvitationsService.sendInvitation({
        receiverEmail: data.email,
        message: data.message
      })
      pendingSentInvitations.value.push(invitation)
      return invitation
    } catch (err: any) {
      error.value = err.message || 'Failed to send invitation'
      console.error('Error sending invitation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const acceptInvitation = async (invitationId: string) => {
    try {
      isLoading.value = true
      error.value = null
      const result = await coupleInvitationsService.acceptInvitation(invitationId)
      currentCouple.value = result.couple
      // Remove from pending invitations
      pendingReceivedInvitations.value = pendingReceivedInvitations.value.filter(
        inv => inv.id !== invitationId
      )
      // Refresh profile and status
      await Promise.all([
        fetchProfile(),
        fetchStatus()
      ])
      return result
    } catch (err: any) {
      error.value = err.message || 'Failed to accept invitation'
      console.error('Error accepting invitation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const rejectInvitation = async (invitationId: string) => {
    try {
      isLoading.value = true
      error.value = null
      await coupleInvitationsService.rejectInvitation(invitationId)
      // Remove from pending invitations
      pendingReceivedInvitations.value = pendingReceivedInvitations.value.filter(invite => invite.id !== invitationId)
    } catch (err: any) {
      error.value = err.message || 'Failed to reject invitation'
      console.error('Error rejecting invitation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Additional methods needed for CoupleConnection component
  const joinByCode = async (code: string) => {
    try {
      isLoading.value = true
      error.value = null
      // TODO: Implement join by code functionality
      console.log('Joining with code:', code)
    } catch (err: any) {
      error.value = err.message || 'Failed to join by code'
      console.error('Error joining by code:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchCurrentCouple = async () => {
    try {
      isLoading.value = true
      error.value = null
      currentCouple.value = await couplesService.getProfile()
    } catch (err: any) {
      if (err.response?.status === 404) {
        currentCouple.value = null
      } else {
        error.value = err.message || 'Failed to fetch current couple'
        console.error('Error fetching current couple:', err)
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchInvitations = async () => {
    try {
      isLoading.value = true
      error.value = null
      const [received, sent] = await Promise.all([
        coupleInvitationsService.getReceivedInvitations(),
        coupleInvitationsService.getSentInvitations()
      ])
      pendingReceivedInvitations.value = received.filter(inv => inv.status === 'pending')
      pendingSentInvitations.value = sent.filter(inv => inv.status === 'pending')
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch invitations'
      console.error('Error fetching invitations:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    coupleProfile,
    partner,
    coupleStats,
    coupleStatus,
    isLoading,
    error,
    pendingReceivedInvitations,
    pendingSentInvitations,
    currentCouple,

    // Getters
    isConnected,
    daysTogether,
    hasPartner,
    preferences,

    // Actions
    fetchProfile,
    updateProfile,
    fetchPartner,
    fetchStats,
    fetchStatus,
    disconnect,
    reconnect,
    updatePreferences,
    fetchAll,
    clearError,
    reset,
    // Invitation actions
    fetchReceivedInvitations,
    fetchSentInvitations,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    joinByCode,
    fetchCurrentCouple,
    fetchInvitations
  }
})