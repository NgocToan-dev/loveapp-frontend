import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { coupleService } from '@/services/couple'
import type { CoupleConnection, CoupleInvitation, User } from '@/types'

export function useCouple() {
  const { t } = useI18n()
  
  // State
  const coupleConnection = ref<CoupleConnection | null>(null)
  const pendingInvitations = ref<CoupleInvitation[]>([])
  const isLoading = ref(false)
  const isSendingInvitation = ref(false)
  const isAcceptingInvitation = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isConnected = computed(() => 
    coupleConnection.value?.status === 'connected'
  )
  
  const isPending = computed(() => 
    coupleConnection.value?.status === 'pending'
  )
  
  const partner = computed(() => {
    if (!coupleConnection.value || !isConnected.value) return null
    
    // Assuming we have access to current user ID somehow
    const currentUserId = coupleConnection.value.user1Id // This would come from auth
    return currentUserId === coupleConnection.value.user1Id 
      ? coupleConnection.value.user2 
      : coupleConnection.value.user1
  })

  const relationshipDuration = computed(() => {
    if (!coupleConnection.value?.relationshipStart) return null
    
    const start = new Date(coupleConnection.value.relationshipStart)
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
    if (!coupleConnection.value?.relationshipStart) return null
    
    const start = new Date(coupleConnection.value.relationshipStart)
    const now = new Date()
    const currentYear = now.getFullYear()
    
    let anniversary = new Date(currentYear, start.getMonth(), start.getDate())
    
    if (anniversary < now) {
      anniversary = new Date(currentYear + 1, start.getMonth(), start.getDate())
    }
    
    return anniversary
  })

  // Methods
  const fetchCoupleConnection = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      coupleConnection.value = await coupleService.getCoupleConnection()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('couple.errors.fetch_failed')
    } finally {
      isLoading.value = false
    }
  }

  const sendInvitation = async (email: string) => {
    isSendingInvitation.value = true
    error.value = null
    
    try {
      const invitation = await coupleService.sendInvitation(email)
      pendingInvitations.value.push(invitation)
      return invitation
    } catch (err: any) {
      error.value = err.response?.data?.message || t('couple.errors.send_invitation_failed')
      throw err
    } finally {
      isSendingInvitation.value = false
    }
  }

  const acceptInvitation = async (invitationCode: string) => {
    isAcceptingInvitation.value = true
    error.value = null
    
    try {
      coupleConnection.value = await coupleService.acceptInvitation(invitationCode)
      
      // Remove from pending invitations
      pendingInvitations.value = pendingInvitations.value.filter(
        inv => inv.invitationCode !== invitationCode
      )
      
      return coupleConnection.value
    } catch (err: any) {
      error.value = err.response?.data?.message || t('couple.errors.accept_invitation_failed')
      throw err
    } finally {
      isAcceptingInvitation.value = false
    }
  }

  const rejectInvitation = async (invitationCode: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await coupleService.rejectInvitation(invitationCode)
      
      // Remove from pending invitations
      pendingInvitations.value = pendingInvitations.value.filter(
        inv => inv.invitationCode !== invitationCode
      )
    } catch (err: any) {
      error.value = err.response?.data?.message || t('couple.errors.reject_invitation_failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchPendingInvitations = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      pendingInvitations.value = await coupleService.getPendingInvitations()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('couple.errors.fetch_invitations_failed')
    } finally {
      isLoading.value = false
    }
  }

  const disconnectCouple = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      await coupleService.disconnectCouple()
      coupleConnection.value = null
    } catch (err: any) {
      error.value = err.response?.data?.message || t('couple.errors.disconnect_failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateRelationshipStart = async (date: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      coupleConnection.value = await coupleService.updateRelationshipStart(date)
    } catch (err: any) {
      error.value = err.response?.data?.message || t('couple.errors.update_date_failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const searchUserByEmail = async (email: string): Promise<User | null> => {
    error.value = null
    
    try {
      return await coupleService.searchUserByEmail(email)
    } catch (err: any) {
      error.value = err.response?.data?.message || t('couple.errors.search_user_failed')
      return null
    }
  }

  const generateInvitationCode = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await coupleService.generateInvitationCode()
      return result.invitationCode
    } catch (err: any) {
      error.value = err.response?.data?.message || t('couple.errors.generate_code_failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
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
    // State
    coupleConnection: computed(() => coupleConnection.value),
    pendingInvitations: computed(() => pendingInvitations.value),
    isLoading: computed(() => isLoading.value),
    isSendingInvitation: computed(() => isSendingInvitation.value),
    isAcceptingInvitation: computed(() => isAcceptingInvitation.value),
    error: computed(() => error.value),
    
    // Computed
    isConnected,
    isPending,
    partner,
    relationshipDuration,
    nextAnniversary,
    
    // Methods
    fetchCoupleConnection,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    fetchPendingInvitations,
    disconnectCouple,
    updateRelationshipStart,
    searchUserByEmail,
    generateInvitationCode,
    clearError,
    formatRelationshipDuration,
    getDaysUntilAnniversary
  }
}
