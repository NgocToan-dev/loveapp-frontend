import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
}

export interface Modal {
  id: string
  component: string
  props?: Record<string, any>
  persistent?: boolean
}

export const useUIStore = defineStore('ui', () => {
  // State
  const isSidebarOpen = ref(false)
  const isMobileMenuOpen = ref(false)
  const isLoading = ref(false)
  const loadingMessage = ref('')
  const toasts = ref<Toast[]>([])
  const modals = ref<Modal[]>([])
  const theme = ref<'light' | 'dark' | 'auto'>('light')

  // Getters
  const hasActiveToasts = computed(() => toasts.value.length > 0)
  const hasActiveModals = computed(() => modals.value.length > 0)
  const activeModal = computed(() => modals.value[modals.value.length - 1])

  // Actions
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  const openSidebar = () => {
    isSidebarOpen.value = true
  }

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  const setLoading = (loading: boolean, message = '') => {
    isLoading.value = loading
    loadingMessage.value = message
  }

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    }
    
    toasts.value.push(newToast)
    
    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
    
    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearToasts = () => {
    toasts.value = []
  }

  const showSuccessToast = (title: string, message?: string) => {
    return showToast({
      type: 'success',
      title,
      message
    })
  }

  const showErrorToast = (title: string, message?: string) => {
    return showToast({
      type: 'error',
      title,
      message,
      duration: 7000 // Error toasts stay longer
    })
  }

  const showWarningToast = (title: string, message?: string) => {
    return showToast({
      type: 'warning',
      title,
      message
    })
  }

  const showInfoToast = (title: string, message?: string) => {
    return showToast({
      type: 'info',
      title,
      message
    })
  }

  const openModal = (modal: Omit<Modal, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newModal: Modal = {
      id,
      ...modal
    }
    
    modals.value.push(newModal)
    return id
  }

  const closeModal = (id?: string) => {
    if (id) {
      const index = modals.value.findIndex(modal => modal.id === id)
      if (index > -1) {
        modals.value.splice(index, 1)
      }
    } else {
      // Close the top modal
      modals.value.pop()
    }
  }

  const closeAllModals = () => {
    modals.value = []
  }

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    theme.value = newTheme
    localStorage.setItem('loveapp_theme', newTheme)
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // Auto mode - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const initializeTheme = () => {
    const storedTheme = localStorage.getItem('loveapp_theme') as 'light' | 'dark' | 'auto' | null
    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      // Default to auto mode
      setTheme('auto')
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (theme.value === 'auto') {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    })
  }

  const resetUI = () => {
    isSidebarOpen.value = false
    isMobileMenuOpen.value = false
    isLoading.value = false
    loadingMessage.value = ''
    clearToasts()
    closeAllModals()
  }

  return {
    // State
    isSidebarOpen,
    isMobileMenuOpen,
    isLoading,
    loadingMessage,
    toasts,
    modals,
    theme,
    
    // Getters
    hasActiveToasts,
    hasActiveModals,
    activeModal,
    
    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    setLoading,
    showToast,
    removeToast,
    clearToasts,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    openModal,
    closeModal,
    closeAllModals,
    setTheme,
    initializeTheme,
    resetUI
  }
})
