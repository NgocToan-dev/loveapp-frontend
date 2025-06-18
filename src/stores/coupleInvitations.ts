import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  coupleInvitationsService,
  type CoupleInvitation,
  type InvitationStats,
  type CreateInvitationData
} from '@/services/coupleInvitations'

export const useCoupleInvitationsStore = defineStore('coupleInvitations', () => {
  // State
  const receivedInvitations = ref<CoupleInvitation[]>([])
  const sentInvitations = ref<CoupleInvitation[]>([])
  const stats = ref<InvitationStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const pendingReceivedInvitations = computed(() =>
    receivedInvitations.value.filter(inv => inv.status === 'pending')
  )

  const pendingSentInvitations = computed(() =>
    sentInvitations.value.filter(inv => inv.status === 'pending')
  )

  const acceptedInvitations = computed(() =>
    [...receivedInvitations.value, ...sentInvitations.value].filter(inv => inv.status === 'accepted')
  )

  const rejectedInvitations = computed(() =>
    [...receivedInvitations.value, ...sentInvitations.value].filter(inv => inv.status === 'rejected')
  )

  const totalPendingCount = computed(() =>
    pendingReceivedInvitations.value.length + pendingSentInvitations.value.length
  )

  // Actions
  const fetchReceivedInvitations = async () => {
    try {
      isLoading.value = true
      error.value = null
      receivedInvitations.value = await coupleInvitationsService.getReceivedInvitations()
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
      sentInvitations.value = await coupleInvitationsService.getSentInvitations()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch sent invitations'
      console.error('Error fetching sent invitations:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchAllInvitations = async () => {
    try {
      isLoading.value = true
      error.value = null
      await Promise.all([
        fetchReceivedInvitations(),
        fetchSentInvitations()
      ])
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch invitations'
      console.error('Error fetching all invitations:', err)
    } finally {
      isLoading.value = false
    }
  }

  const sendInvitation = async (data: CreateInvitationData) => {
    try {
      isLoading.value = true
      error.value = null
      const invitation = await coupleInvitationsService.sendInvitation(data)
      sentInvitations.value.unshift(invitation)
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
      
      // Update the invitation status locally
      const invitation = receivedInvitations.value.find(inv => inv.id === invitationId)
      if (invitation) {
        invitation.status = 'accepted'
      }
      
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
      const invitation = await coupleInvitationsService.rejectInvitation(invitationId)
      
      // Update the invitation status locally
      const localInvitation = receivedInvitations.value.find(inv => inv.id === invitationId)
      if (localInvitation) {
        localInvitation.status = 'rejected'
      }
      
      return invitation
    } catch (err: any) {
      error.value = err.message || 'Failed to reject invitation'
      console.error('Error rejecting invitation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const cancelInvitation = async (invitationId: string) => {
    try {
      isLoading.value = true
      error.value = null
      await coupleInvitationsService.cancelInvitation(invitationId)
      
      // Remove from sent invitations
      sentInvitations.value = sentInvitations.value.filter(inv => inv.id !== invitationId)
    } catch (err: any) {
      error.value = err.message || 'Failed to cancel invitation'
      console.error('Error canceling invitation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchInvitationById = async (invitationId: string) => {
    try {
      isLoading.value = true
      error.value = null
      return await coupleInvitationsService.getInvitation(invitationId)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch invitation details'
      console.error('Error fetching invitation details:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchStats = async () => {
    try {
      isLoading.value = true
      error.value = null
      stats.value = await coupleInvitationsService.getStats()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch invitation stats'
      console.error('Error fetching invitation stats:', err)
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    receivedInvitations.value = []
    sentInvitations.value = []
    stats.value = null
    error.value = null
    isLoading.value = false
  }

  return {
    // State
    receivedInvitations,
    sentInvitations,
    stats,
    isLoading,
    error,

    // Getters
    pendingReceivedInvitations,
    pendingSentInvitations,
    acceptedInvitations,
    rejectedInvitations,
    totalPendingCount,

    // Actions
    fetchReceivedInvitations,
    fetchSentInvitations,
    fetchAllInvitations,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    cancelInvitation,
    fetchInvitationById,
    fetchStats,
    clearError,
    reset
  }
})