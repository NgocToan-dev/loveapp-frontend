import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  couplesService, 
  type Couple, 
  type CoupleInvitation, 
  type Partnership, 
  type LoveDay,
  type CreateInvitationData,
  type CreatePartnershipData,
  type CreateLoveDayData
} from '@/services/couples'

export const useCouplesStore = defineStore('couples', () => {
  // State
  const currentCouple = ref<Couple | null>(null)
  const invitations = ref<{
    sent: CoupleInvitation[]
    received: CoupleInvitation[]
  }>({ sent: [], received: [] })
  const partnerships = ref<Partnership[]>([])
  const loveDays = ref<LoveDay[]>([])
  const coupleStats = ref<{
    daysTogether: number
    memoriesCount: number
    notesCount: number
    loveDaysCount: number
  } | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isConnected = computed(() => currentCouple.value !== null)
  const partner = computed(() => {
    if (!currentCouple.value) return null
    // Assuming current user is stored somewhere, this would need to be adapted
    return currentCouple.value.user1 || currentCouple.value.user2
  })
  
  const pendingReceivedInvitations = computed(() => 
    invitations.value.received.filter(inv => inv.status === 'pending')
  )
  
  const pendingSentInvitations = computed(() =>
    invitations.value.sent.filter(inv => inv.status === 'pending')
  )

  const upcomingLoveDays = computed(() => {
    const today = new Date()
    const upcoming = loveDays.value.filter(day => {
      const dayDate = new Date(day.date)
      return dayDate >= today
    })
    return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  const activePartnerships = computed(() =>
    partnerships.value.filter(p => p.isActive)
  )

  // Actions
  const fetchCurrentCouple = async () => {
    try {
      isLoading.value = true
      error.value = null
      currentCouple.value = await couplesService.getCurrentCouple()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch couple information'
      console.error('Error fetching current couple:', err)
    } finally {
      isLoading.value = false
    }
  }

  const sendInvitation = async (data: CreateInvitationData) => {
    try {
      isLoading.value = true
      error.value = null
      const invitation = await couplesService.sendInvitation(data)
      invitations.value.sent.unshift(invitation)
      return invitation
    } catch (err: any) {
      error.value = err.message || 'Failed to send invitation'
      console.error('Error sending invitation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchInvitations = async () => {
    try {
      isLoading.value = true
      error.value = null
      invitations.value = await couplesService.getMyInvitations()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch invitations'
      console.error('Error fetching invitations:', err)
    } finally {
      isLoading.value = false
    }
  }

  const acceptInvitation = async (invitationId: string) => {
    try {
      isLoading.value = true
      error.value = null
      const couple = await couplesService.acceptInvitation(invitationId)
      currentCouple.value = couple
      
      // Update invitation status
      const invitation = invitations.value.received.find(inv => inv.id === invitationId)
      if (invitation) {
        invitation.status = 'accepted'
      }
      
      return couple
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
      await couplesService.rejectInvitation(invitationId)
      
      // Update invitation status
      const invitation = invitations.value.received.find(inv => inv.id === invitationId)
      if (invitation) {
        invitation.status = 'rejected'
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to reject invitation'
      console.error('Error rejecting invitation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const joinByCode = async (invitationCode: string) => {
    try {
      isLoading.value = true
      error.value = null
      const couple = await couplesService.joinByCode(invitationCode)
      currentCouple.value = couple
      return couple
    } catch (err: any) {
      error.value = err.message || 'Failed to join by code'
      console.error('Error joining by code:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchPartnerships = async () => {
    try {
      isLoading.value = true
      error.value = null
      partnerships.value = await couplesService.getPartnerships()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch partnerships'
      console.error('Error fetching partnerships:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createPartnership = async (data: CreatePartnershipData) => {
    try {
      isLoading.value = true
      error.value = null
      const partnership = await couplesService.createPartnership(data)
      partnerships.value.unshift(partnership)
      return partnership
    } catch (err: any) {
      error.value = err.message || 'Failed to create partnership'
      console.error('Error creating partnership:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updatePartnership = async (id: string, data: Partial<CreatePartnershipData>) => {
    try {
      isLoading.value = true
      error.value = null
      const partnership = await couplesService.updatePartnership(id, data)
      const index = partnerships.value.findIndex(p => p.id === id)
      if (index !== -1) {
        partnerships.value[index] = partnership
      }
      return partnership
    } catch (err: any) {
      error.value = err.message || 'Failed to update partnership'
      console.error('Error updating partnership:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deletePartnership = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      await couplesService.deletePartnership(id)
      partnerships.value = partnerships.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete partnership'
      console.error('Error deleting partnership:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchLoveDays = async () => {
    try {
      isLoading.value = true
      error.value = null
      loveDays.value = await couplesService.getLoveDays()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch love days'
      console.error('Error fetching love days:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createLoveDay = async (data: CreateLoveDayData) => {
    try {
      isLoading.value = true
      error.value = null
      const loveDay = await couplesService.createLoveDay(data)
      loveDays.value.unshift(loveDay)
      return loveDay
    } catch (err: any) {
      error.value = err.message || 'Failed to create love day'
      console.error('Error creating love day:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateLoveDay = async (id: string, data: Partial<CreateLoveDayData>) => {
    try {
      isLoading.value = true
      error.value = null
      const loveDay = await couplesService.updateLoveDay(id, data)
      const index = loveDays.value.findIndex(ld => ld.id === id)
      if (index !== -1) {
        loveDays.value[index] = loveDay
      }
      return loveDay
    } catch (err: any) {
      error.value = err.message || 'Failed to update love day'
      console.error('Error updating love day:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteLoveDay = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      await couplesService.deleteLoveDay(id)
      loveDays.value = loveDays.value.filter(ld => ld.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete love day'
      console.error('Error deleting love day:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchCoupleStats = async () => {
    try {
      isLoading.value = true
      error.value = null
      coupleStats.value = await couplesService.getCoupleStats()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch couple stats'
      console.error('Error fetching couple stats:', err)
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    currentCouple,
    invitations,
    partnerships,
    loveDays,
    coupleStats,
    isLoading,
    error,

    // Getters
    isConnected,
    partner,
    pendingReceivedInvitations,
    pendingSentInvitations,
    upcomingLoveDays,
    activePartnerships,

    // Actions
    fetchCurrentCouple,
    sendInvitation,
    fetchInvitations,
    acceptInvitation,
    rejectInvitation,
    joinByCode,
    fetchPartnerships,
    createPartnership,
    updatePartnership,
    deletePartnership,
    fetchLoveDays,
    createLoveDay,
    updateLoveDay,
    deleteLoveDay,
    fetchCoupleStats,
    clearError
  }
}) 