<template>
  <div>
    <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <div class="mb-4">
          <div class="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('common.status.error') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ errorMessage || $t('common.errors.unexpected') }}
          </p>
        </div>
        
        <div class="space-y-3">
          <button
            @click="retry"
            class="w-full px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
          >
            {{ $t('common.buttons.retry') }}
          </button>
          <button
            @click="goHome"
            class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
          >
            {{ $t('navigation.home') }}
          </button>
        </div>
        
        <!-- Debug info in development -->
        <details v-if="isDevelopment && errorDetails" class="mt-4 text-left">
          <summary class="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
            {{ $t('common.errors.details') }}
          </summary>
          <pre class="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-32">{{ errorDetails }}</pre>
        </details>
      </div>
    </div>
    
    <!-- Normal content when no error -->
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  error: [error: Error]
}>()

const router = useRouter()

const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')

const isDevelopment = computed(() => import.meta.env.DEV)

onErrorCaptured((error: Error) => {
  hasError.value = true
  errorMessage.value = error.message
  errorDetails.value = error.stack || ''
  
  // Emit error for global handling
  emit('error', error)
  
  // Log error for debugging
  console.error('ErrorBoundary caught error:', error)
  
  // Prevent error from propagating
  return false
})

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  
  // Force re-render by refreshing the page
  window.location.reload()
}

const goHome = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  router.push('/')
}
</script>
