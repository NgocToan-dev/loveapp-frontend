<template>
  <div class="w-full min-h-screen transition-colors duration-300" :class="themeClasses">
    <!-- Error Boundary -->
    <ErrorBoundary @error="handleGlobalError">
      <!-- Header -->
      <Header class="sticky top-0 z-50" />
      
      <!-- Main Content -->
      <main class="w-full pb-20 md:pb-0">
        <slot />
      </main>
      
      <!-- Theme Toggle -->
      <ThemeToggle class="fixed bottom-20 right-4 z-40 md:bottom-4" />
      
      <!-- Notifications -->
      <NotificationToast />
      
      <!-- PWA Install Prompt -->
      <InstallPrompt
        :show-prompt="showInstallPrompt"
        @install="installPWA"
        @dismiss="dismissInstall"
      />
      
      <!-- Offline Indicator -->
      <OfflineIndicator />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import Header from '@/components/layout/Header.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import NotificationToast from '@/components/common/NotificationToast.vue'
import InstallPrompt from '@/components/common/InstallPrompt.vue'
import OfflineIndicator from '@/components/common/OfflineIndicator.vue'
import { useThemeStore } from '@/stores/theme'
import { useUIStore } from '@/stores/ui'
import { usePWA } from '@/composables/usePWA'

const themeStore = useThemeStore()
const uiStore = useUIStore()

// PWA functionality
const { showInstallPrompt, installPWA, dismissInstall, initPWA, cleanup } = usePWA()

const themeClasses = computed(() => [
  themeStore.currentTheme,
  'font-sans antialiased'
])

function handleGlobalError(err: Error) {
  uiStore.showErrorToast('Error', err.message)
}

// Lifecycle
onMounted(() => {
  initPWA()
})

onUnmounted(() => {
  cleanup()
})
</script>
