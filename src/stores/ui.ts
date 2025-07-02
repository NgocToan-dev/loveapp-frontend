import { defineStore } from 'pinia'

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

interface UIState {
  isSidebarOpen: boolean
  isMobileMenuOpen: boolean
  isLoading: boolean
  loadingMessage: string
  toasts: Toast[]
  modals: Modal[]
  theme: 'light'
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    isSidebarOpen: false,
    isMobileMenuOpen: false,
    isLoading: false,
    loadingMessage: '',
    toasts: [],
    modals: [],
    theme: 'light'
  }),

  getters: {
    hasActiveToasts: (state) => state.toasts.length > 0,
    hasActiveModals: (state) => state.modals.length > 0,
    activeModal: (state) => state.modals[state.modals.length - 1]
  },

  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },

    closeSidebar() {
      this.isSidebarOpen = false
    },

    openSidebar() {
      this.isSidebarOpen = true
    },

    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },

    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },

    setLoading(loading: boolean, message = '') {
      this.isLoading = loading
      this.loadingMessage = message
    },

    showToast(toast: Omit<Toast, 'id'>) {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const newToast: Toast = {
        id,
        duration: 5000,
        ...toast
      }
      
      this.toasts.push(newToast)
      
      // Auto remove toast after duration
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          this.removeToast(id)
        }, newToast.duration)
      }
      
      return id
    },

    removeToast(id: string) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    clearToasts() {
      this.toasts = []
    },

    showSuccessToast(title: string, message?: string) {
      return this.showToast({
        type: 'success',
        title,
        message
      })
    },

    showErrorToast(title: string, message?: string) {
      return this.showToast({
        type: 'error',
        title,
        message,
        duration: 7000 // Error toasts stay longer
      })
    },

    showWarningToast(title: string, message?: string) {
      return this.showToast({
        type: 'warning',
        title,
        message
      })
    },

    showInfoToast(title: string, message?: string) {
      return this.showToast({
        type: 'info',
        title,
        message
      })
    },

    openModal(modal: Omit<Modal, 'id'>) {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const newModal: Modal = {
        id,
        ...modal
      }
      
      this.modals.push(newModal)
      return id
    },

    closeModal(id?: string) {
      if (id) {
        const index = this.modals.findIndex(modal => modal.id === id)
        if (index > -1) {
          this.modals.splice(index, 1)
        }
      } else {
        // Close the top modal
        this.modals.pop()
      }
    },

    closeAllModals() {
      this.modals = []
    },

    // Override theme setter to always light and remove dark class
    setTheme() {
      this.theme = 'light'
      document.documentElement.classList.remove('dark')
    },

    // Initialize theme to light only, disable dark mode
    initializeTheme() {
      this.setTheme()
    },

    resetUI() {
      this.isSidebarOpen = false
      this.isMobileMenuOpen = false
      this.isLoading = false
      this.loadingMessage = ''
      this.clearToasts()
      this.closeAllModals()
    }
  }
})
