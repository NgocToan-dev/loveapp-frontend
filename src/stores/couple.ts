import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { coupleService } from '@/services/couple'
import type { CoupleConnection, CoupleInvitation, User } from '@/types'

export const useCoupleStore = defineStore('couple', () => {
  // State
  const coupleConnection = ref<CoupleConnection | null>(null)
  const pendingInvitations = ref<CoupleInvitation[]>([])
  const isLoading = ref(false)
  const isSendingInvitation = ref(false)
  const isAcceptingInvitation = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const isInitialized = ref(false) // Track if we've already fetched connection

  // Computed
  const isConnected = computed(() => 
    coupleConnection.value?.status === 'accepted'
  )
  
  const isPending = computed(() => 
    coupleConnection.value?.status === 'pending'
  )

  const partner = computed(() => {
    if (!coupleConnection.value || !isConnected.value) return null
    
    // Get current user ID from user store - using dynamic import to avoid circular dependency
    const userStore = () => import('@/stores/user').then(m => m.useUserStore())
    
    // For now, we'll handle this in the component/composable where user context is available
    // This computed will be enhanced when used with user context
    return null
  })

  const relationshipDuration = computed(() => {
    if (!coupleConnection.value?.anniversaryDate && !coupleConnection.value?.createdAt) return null
    
    // Use anniversaryDate if available, otherwise use createdAt
    const startDate = coupleConnection.value.anniversaryDate || coupleConnection.value.createdAt
    const start = new Date(startDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return {
      days: diffDays,
      years: Math.floor(diffDays / 365),
      months: Math.floor((diffDays % 365) / 30),
      remainingDays: diffDays % 30
    }
  })

  const nextAnniversary = computed(() => {
    if (!coupleConnection.value?.anniversaryDate && !coupleConnection.value?.createdAt) return null
    
    // Use anniversaryDate if available, otherwise use createdAt
    const startDate = coupleConnection.value.anniversaryDate || coupleConnection.value.createdAt
    const start = new Date(startDate)
    const now = new Date()
    const currentYear = now.getFullYear()
    
    let anniversary = new Date(currentYear, start.getMonth(), start.getDate())
    
    if (anniversary < now) {
      anniversary = new Date(currentYear + 1, start.getMonth(), start.getDate())
    }
    
    return anniversary
  })

  // Actions
  const fetchCoupleConnection = async (force = false) => {
    // If already initialized and not forcing, skip fetch
    if (isInitialized.value && !force) {
      return coupleConnection.value
    }

    // Prevent multiple simultaneous requests
    if (isLoading.value) return coupleConnection.value
    
    isLoading.value = true
    error.value = null
    
    try {
      coupleConnection.value = await coupleService.getCoupleConnection()
      isInitialized.value = true
      return coupleConnection.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch couple connection'
      console.error('Error fetching couple connection:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const sendInvitation = async (email: string) => {
    isSendingInvitation.value = true
    error.value = null
    successMessage.value = null
    
    try {
      const result = await coupleService.sendInvitation(email)
      // If we get a couple connection back, it means the connection was established
      coupleConnection.value = result
      successMessage.value = 'Connection successful!'
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to send invitation'
      throw err
    } finally {
      isSendingInvitation.value = false
    }
  }

  const acceptInvitation = async (coupleId: string) => {
    isAcceptingInvitation.value = true
    error.value = null
    successMessage.value = null
    
    try {
      const result = await coupleService.acceptInvitation(coupleId)
      coupleConnection.value = result
      
      // Remove from pending invitations
      pendingInvitations.value = pendingInvitations.value.filter(
        inv => (inv._id || inv.id) !== coupleId
      )
      
      // Set success message
      successMessage.value = 'Connection successful!'
      
      return coupleConnection.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to accept invitation'
      throw err
    } finally {
      isAcceptingInvitation.value = false
    }
  }

  const rejectInvitation = async (coupleId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await coupleService.rejectInvitation(coupleId)
      
      // Remove from pending invitations
      pendingInvitations.value = pendingInvitations.value.filter(
        inv => (inv._id || inv.id) !== coupleId
      )
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to reject invitation'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchPendingInvitations = async (force = false) => {
    // If already have invitations and not forcing, skip fetch unless empty
    if (pendingInvitations.value.length > 0 && !force) {
      return pendingInvitations.value
    }

    isLoading.value = true
    error.value = null
    
    try {
      pendingInvitations.value = await coupleService.getPendingInvitations()
      return pendingInvitations.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load invitations'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateRelationshipStart = async (date: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await coupleService.updateRelationshipStart(date)
      coupleConnection.value = result
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update date'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const searchUserByEmail = async (email: string) => {
    try {
      return await coupleService.searchUserByEmail(email)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search user'
      throw err
    }
  }

  const generateInvitationCode = async () => {
    try {
      return await coupleService.generateInvitationCode()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to generate invitation code'
      throw err
    }
  }

  // Initialize connection data - to be called once when app starts
  const initializeCoupleData = async () => {
    try {
      await Promise.all([
        fetchCoupleConnection(),
        fetchPendingInvitations()
      ])
    } catch (error) {
      console.error('Failed to initialize couple data:', error)
    }
  }

  const setCoupleConnection = (connection: CoupleConnection | null) => {
    coupleConnection.value = connection
  }

  const clearError = () => {
    error.value = null
  }

  const clearSuccess = () => {
    successMessage.value = null
  }

  const disconnectCouple = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      await coupleService.disconnectCouple()
      coupleConnection.value = null
      isInitialized.value = false // Reset initialization flag
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to disconnect couple'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Utility methods
  const formatRelationshipDuration = () => {
    if (!relationshipDuration.value) return ''
    
    const { years, months, remainingDays } = relationshipDuration.value
    
    if (years > 0) {
      return `${years} năm ${months} tháng ${remainingDays} ngày`
    } else if (months > 0) {
      return `${months} tháng ${remainingDays} ngày`
    } else {
      return `${remainingDays} ngày`
    }
  }

  const getDaysUntilAnniversary = () => {
    if (!nextAnniversary.value) return 0
    
    const now = new Date()
    const diffTime = nextAnniversary.value.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Reset store state
  const $reset = () => {
    coupleConnection.value = null
    pendingInvitations.value = []
    isLoading.value = false
    isSendingInvitation.value = false
    isAcceptingInvitation.value = false
    error.value = null
    successMessage.value = null
    isInitialized.value = false
  }

  return {
    // State
    coupleConnection,
    pendingInvitations,
    isLoading,
    isSendingInvitation,
    isAcceptingInvitation,
    error,
    successMessage,
    isInitialized,
    
    // Computed
    isConnected,
    isPending,
    partner,
    relationshipDuration,
    nextAnniversary,
    
    // Actions
    fetchCoupleConnection,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    fetchPendingInvitations,
    updateRelationshipStart,
    searchUserByEmail,
    generateInvitationCode,
    initializeCoupleData,
    setCoupleConnection,
    clearError,
    clearSuccess,
    disconnectCouple,
    formatRelationshipDuration,
    getDaysUntilAnniversary,
    $reset
  }
})
