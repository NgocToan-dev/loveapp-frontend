import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useCoupleStore } from '@/stores/couple'
import type { User } from '@/types'

export function useCouple() {
  const { t } = useI18n()
  const userStore = useUserStore()
  const coupleStore = useCoupleStore()

  // Computed - Enhanced partner computed that uses user context
  const partner = computed(() => {
    if (!coupleStore.coupleConnection || !coupleStore.isConnected) return null
    
    const currentUserId = userStore.user?._id || userStore.user?.id
    if (!currentUserId) return null
    
    // Handle case where user1Id/user2Id are populated User objects
    const user1 = typeof coupleStore.coupleConnection.user1Id === 'object' 
      ? coupleStore.coupleConnection.user1Id 
      : coupleStore.coupleConnection.user1
    const user2 = typeof coupleStore.coupleConnection.user2Id === 'object' 
      ? coupleStore.coupleConnection.user2Id 
      : coupleStore.coupleConnection.user2
    
    if (!user1 || !user2) return null
    
    const user1Id = user1._id || user1.id
    const user2Id = user2._id || user2.id
    
    // Return the partner (not the current user)
    if (currentUserId === user1Id) {
      return user2
    } else if (currentUserId === user2Id) {
      return user1
    }
    
    return null
  })

  // Enhanced computed properties that use the store
  const relationshipDuration = computed(() => {
    if (!coupleStore.coupleConnection?.anniversaryDate && !coupleStore.coupleConnection?.createdAt) return null
    
    // Use anniversaryDate if available, otherwise use createdAt
    const startDate = coupleStore.coupleConnection.anniversaryDate || coupleStore.coupleConnection.createdAt
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
    if (!coupleStore.coupleConnection?.anniversaryDate && !coupleStore.coupleConnection?.createdAt) return null
    
    // Use anniversaryDate if available, otherwise use createdAt
    const startDate = coupleStore.coupleConnection.anniversaryDate || coupleStore.coupleConnection.createdAt
    const start = new Date(startDate)
    const now = new Date()
    const currentYear = now.getFullYear()
    
    let anniversary = new Date(currentYear, start.getMonth(), start.getDate())
    
    if (anniversary < now) {
      anniversary = new Date(currentYear + 1, start.getMonth(), start.getDate())
    }
    
    return anniversary
  })

  // Wrapper methods that add i18n support
  const fetchCoupleConnection = async (force = false) => {
    try {
      return await coupleStore.fetchCoupleConnection(force)
    } catch (err: any) {
      coupleStore.error = err.response?.data?.message || t('couple.errors.fetch_failed')
      throw err
    }
  }

  const sendInvitation = async (email: string) => {
    try {
      const result = await coupleStore.sendInvitation(email)
      coupleStore.successMessage = t('couple.messages.invitation_sent')
      return result
    } catch (err: any) {
      coupleStore.error = err.response?.data?.message || t('couple.errors.send_invitation_failed')
      throw err
    }
  }

  const acceptInvitation = async (coupleId: string) => {
    try {
      const result = await coupleStore.acceptInvitation(coupleId)
      coupleStore.successMessage = t('couple.messages.invitation_accepted')
      return result
    } catch (err: any) {
      coupleStore.error = err.response?.data?.message || t('couple.errors.accept_invitation_failed')
      throw err
    }
  }

  const rejectInvitation = async (coupleId: string) => {
    try {
      await coupleStore.rejectInvitation(coupleId)
      coupleStore.successMessage = t('couple.messages.invitation_rejected')
    } catch (err: any) {
      coupleStore.error = err.response?.data?.message || t('couple.errors.reject_invitation_failed')
      throw err
    }
  }

  const fetchPendingInvitations = async (force = false) => {
    try {
      return await coupleStore.fetchPendingInvitations(force)
    } catch (err: any) {
      coupleStore.error = err.response?.data?.message || t('couple.errors.fetch_invitations_failed')
      throw err
    }
  }

  const disconnectCouple = async () => {
    try {
      await coupleStore.disconnectCouple()
      coupleStore.successMessage = t('couple.messages.disconnected')
    } catch (err: any) {
      coupleStore.error = err.response?.data?.message || t('couple.errors.disconnect_failed')
      throw err
    }
  }

  const updateRelationshipStart = async (date: string) => {
    try {
      const result = await coupleStore.updateRelationshipStart(date)
      coupleStore.successMessage = t('couple.messages.date_updated')
      return result
    } catch (err: any) {
      coupleStore.error = err.response?.data?.message || t('couple.errors.update_date_failed')
      throw err
    }
  }

  const searchUserByEmail = async (email: string) => {
    try {
      return await coupleStore.searchUserByEmail(email)
    } catch (err: any) {
      coupleStore.error = err.response?.data?.message || t('couple.errors.search_user_failed')
      throw err
    }
  }

  const generateInvitationCode = async () => {
    try {
      return await coupleStore.generateInvitationCode()
    } catch (err: any) {
      coupleStore.error = err.response?.data?.message || t('couple.errors.generate_code_failed')
      throw err
    }
  }

  const formatRelationshipDuration = () => {
    if (!relationshipDuration.value) return ''
    
    const { years, months, remainingDays } = relationshipDuration.value
    
    if (years > 0) {
      return t('couple.duration.years_months_days', { years, months, days: remainingDays })
    } else if (months > 0) {
      return t('couple.duration.months_days', { months, days: remainingDays })
    } else {
      return t('couple.duration.days', { days: remainingDays })
    }
  }

  const getDaysUntilAnniversary = () => {
    if (!nextAnniversary.value) return 0
    
    const now = new Date()
    const diffTime = nextAnniversary.value.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return {
    // State from store
    coupleConnection: coupleStore.coupleConnection,
    pendingInvitations: coupleStore.pendingInvitations,
    isLoading: coupleStore.isLoading,
    isSendingInvitation: coupleStore.isSendingInvitation,
    isAcceptingInvitation: coupleStore.isAcceptingInvitation,
    error: coupleStore.error,
    successMessage: coupleStore.successMessage,
    
    // Computed (enhanced with user context)
    isConnected: coupleStore.isConnected,
    isPending: coupleStore.isPending,
    partner,
    relationshipDuration,
    nextAnniversary,
    
    // Methods (with i18n support)
    fetchCoupleConnection,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    fetchPendingInvitations,
    disconnectCouple,
    updateRelationshipStart,
    searchUserByEmail,
    generateInvitationCode,
    clearError: coupleStore.clearError,
    clearSuccess: coupleStore.clearSuccess,
    formatRelationshipDuration,
    getDaysUntilAnniversary,
    
    // Store methods
    initializeCoupleData: coupleStore.initializeCoupleData
  }
}
