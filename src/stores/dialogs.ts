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

  // Base dialog function - main focus
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

  // Base dialog opener with common patterns
  const openBaseDialog = (
    component: string,
    props?: Record<string, any>,
    options?: {
      maxWidth?: string
      persistent?: boolean
      scrollable?: boolean
      fullscreen?: boolean
    },
    callbacks?: {
      onConfirm?: (data?: any) => void
      onCancel?: () => void
    }
  ) => {
    return openDialog({
      component,
      props: props || {},
      options: {
        maxWidth: '600',
        persistent: false,
        scrollable: true,
        ...options
      },
      onConfirm: callbacks?.onConfirm,
      onCancel: callbacks?.onCancel
    })
  }

  const closeAllDialogs = () => {
    dialogs.value.length = 0
  }

  const getDialog = (id: string) => {
    return dialogs.value.find(d => d.id === id)
  }

  // Essential dialog helpers - keep only basic ones
  const openConfirmDialog = (options: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
  }) => {
    return openBaseDialog(
      'ConfirmDialog',
      {
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Xác nhận',
        cancelText: options.cancelText || 'Hủy'
      },
      { maxWidth: '400' },
      {
        onConfirm: options.onConfirm,
        onCancel: options.onCancel
      }
    )
  }

  const openAlertDialog = (options: {
    title: string
    message: string
    buttonText?: string
    onClose?: () => void
  }) => {
    return openBaseDialog(
      'AlertDialog',
      {
        title: options.title,
        message: options.message,
        buttonText: options.buttonText || 'OK'
      },
      { maxWidth: '400' },
      { onConfirm: options.onClose }
    )
  }

  return {
    // State
    dialogs,
    isLoading,
    
    // Base Actions
    openDialog,
    openBaseDialog,
    closeDialog,
    closeAllDialogs,
    getDialog,
    
    // Essential helpers only
    openConfirmDialog,
    openAlertDialog
  }
})
