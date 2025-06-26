<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
      <div class="flex flex-col items-center space-y-4">
        <!-- Loading Spinner -->
        <div class="relative">
          <div class="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          <div class="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin" style="animation-direction: reverse;"></div>
        </div>
        
        <!-- Loading Message -->
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('common.status.loading') }}
          </h3>
          <p v-if="message" class="text-gray-600 dark:text-gray-300 text-sm">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const message = computed(() => uiStore.loadingMessage)
</script>

<style scoped>
@keyframes pulse-heart {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.animate-pulse-heart {
  animation: pulse-heart 2s ease-in-out infinite;
}
</style>
