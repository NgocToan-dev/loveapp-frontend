import { ref, computed } from 'vue'

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const usePWA = () => {
  const isOnline = ref(navigator.onLine)
  const isInstallable = ref(false)
  const isInstalled = ref(false)
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const showInstallPrompt = ref(false)

  // Check if PWA is installed
  const checkInstalled = () => {
    // Check for standalone mode (iOS Safari)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    
    // Check for Android Chrome
    const isAndroidChrome = window.navigator.userAgent.includes('Chrome') && 
                           (window as any).navigator.standalone !== undefined
    
    isInstalled.value = isStandalone || isAndroidChrome || (window as any).navigator.standalone
  }

  // Online/offline status
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  // Listen for install prompt
  const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
    e.preventDefault()
    deferredPrompt.value = e
    isInstallable.value = true
  }

  // Show install prompt
  const showInstallDialog = () => {
    showInstallPrompt.value = true
  }

  // Install PWA
  const installPWA = async () => {
    if (!deferredPrompt.value) return

    try {
      await deferredPrompt.value.prompt()
      const choiceResult = await deferredPrompt.value.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        isInstalled.value = true
        isInstallable.value = false
        showInstallPrompt.value = false
      }
      
      deferredPrompt.value = null
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  // Dismiss install prompt
  const dismissInstall = () => {
    showInstallPrompt.value = false
    deferredPrompt.value = null
    isInstallable.value = false
  }

  // Get install instructions based on device
  const getInstallInstructions = computed(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return {
        icon: '📱',
        title: 'Cài đặt ứng dụng trên iOS',
        steps: [
          'Nhấn vào biểu tượng chia sẻ ở dưới cùng',
          'Chọn "Thêm vào Màn hình chính"',
          'Nhấn "Thêm" để hoàn tất'
        ]
      }
    } else if (userAgent.includes('android')) {
      return {
        icon: '📱',
        title: 'Cài đặt ứng dụng trên Android',
        steps: [
          'Nhấn vào menu 3 chấm ở góc trên bên phải',
          'Chọn "Thêm vào màn hình chính"',
          'Nhấn "Thêm" để hoàn tất'
        ]
      }
    } else {
      return {
        icon: '💻',
        title: 'Cài đặt ứng dụng trên máy tính',
        steps: [
          'Nhấn vào biểu tượng cài đặt trong thanh địa chỉ',
          'Chọn "Cài đặt"',
          'Ứng dụng sẽ được thêm vào desktop'
        ]
      }
    }
  })

  // Check for service worker support
  const isServiceWorkerSupported = 'serviceWorker' in navigator
  
  const registerServiceWorker = async () => {
    if (!isServiceWorkerSupported) return

    try {
      // TODO: Enable service worker when PWA plugin is configured
      // const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registration disabled in development')
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  // Initialize PWA
  const initPWA = () => {
    checkInstalled()
    
    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any)
    
    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      isInstallable.value = false
      showInstallPrompt.value = false
    })

    // Register service worker
    registerServiceWorker()
  }

  // Cleanup
  const cleanup = () => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any)
  }

  return {
    isOnline,
    isInstallable,
    isInstalled,
    showInstallPrompt,
    installPWA,
    dismissInstall,
    showInstallDialog,
    getInstallInstructions,
    isServiceWorkerSupported,
    initPWA,
    cleanup
  }
}
