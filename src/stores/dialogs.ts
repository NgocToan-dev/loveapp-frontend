import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { TimelineEvent } from '@/types'

export interface DialogConfig {
  id: string
  component: string
  props?: Record<string, any>
  options?: {
    persistent?: boolean
    maxWidth?: string
    fullscreen?: boolean
    scrollable?: boolean
  }
  onConfirm?: (data?: any) => void
  onCancel?: () => void
}

export const useDialogsStore = defineStore('dialogs', () => {
  // State
  const dialogs = ref<DialogConfig[]>([])
  const isLoading = ref(false)

  // Actions
  const openDialog = (config: Omit<DialogConfig, 'id'>) => {
    const id = `dialog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const dialog: DialogConfig = {
      id,
      ...config,
      options: {
        persistent: false,
        maxWidth: '600',
        scrollable: true,
        ...config.options
      }
    }
    dialogs.value.push(dialog)
    return id
  }

  const closeDialog = (id: string) => {
    const index = dialogs.value.findIndex(d => d.id === id)
    if (index !== -1) {
      dialogs.value.splice(index, 1)
    }
  }

  const closeAllDialogs = () => {
    dialogs.value.length = 0
  }

  const getDialog = (id: string) => {
    return dialogs.value.find(d => d.id === id)
  }
  // Specific dialog helpers
  const openTimelineEventForm = (event?: TimelineEvent) => {
    return openDialog({
      component: 'TimelineEventForm',
      props: { event },
      options: {
        maxWidth: '600',
        persistent: true
      },
      onConfirm: async (data) => {
        // Handle form submission - you can customize this or pass callback
        console.log('Timeline event form submitted:', data)
        
        // Here you would normally call the timelineEvents store to save
        // But to avoid circular dependency, we'll emit an event or use a callback
        if (event) {
          // Update existing event
          // await timelineEventsStore.updateEvent(event.id, data)
        } else {
          // Create new event
          // await timelineEventsStore.addEvent(data)
        }
      }
    })
  }

  const openInvitationsDialog = () => {
    return openDialog({
      component: 'InvitationsDialog',
      options: {
        maxWidth: '800',
        scrollable: true
      }
    })
  }

  const openCouplePreferencesDialog = () => {
    return openDialog({
      component: 'CouplePreferencesDialog',
      options: {
        maxWidth: '600',
        scrollable: true
      }
    })
  }

  const openConfirmDialog = (options: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
  }) => {
    return openDialog({
      component: 'ConfirmDialog',
      props: {
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Xác nhận',
        cancelText: options.cancelText || 'Hủy'
      },
      options: {
        maxWidth: '400'
      },
      onConfirm: options.onConfirm,
      onCancel: options.onCancel
    })
  }

  const openAlertDialog = (options: {
    title: string
    message: string
    buttonText?: string
    onClose?: () => void
  }) => {
    return openDialog({
      component: 'AlertDialog',
      props: {
        title: options.title,
        message: options.message,
        buttonText: options.buttonText || 'OK'
      },
      options: {
        maxWidth: '400'
      },
      onConfirm: options.onClose
    })
  }

  return {
    // State
    dialogs,
    isLoading,
    
    // Actions
    openDialog,
    closeDialog,
    closeAllDialogs,
    getDialog,
    
    // Specific helpers
    openTimelineEventForm,
    openInvitationsDialog,
    openCouplePreferencesDialog,
    openConfirmDialog,
    openAlertDialog
  }
})
