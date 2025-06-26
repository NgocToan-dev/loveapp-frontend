<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in uiStore.toasts"
          :key="toast.id"
          :class="[
            'rounded-lg shadow-lg p-4 backdrop-blur-sm border border-opacity-20',
            getToastClasses(toast.type)
          ]"
        >
          <div class="flex items-start">
            <!-- Icon -->
            <div class="flex-shrink-0 mr-3">
              <component :is="getToastIcon(toast.type)" class="w-5 h-5" />
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold mb-1">
                {{ toast.title }}
              </h4>
              <p v-if="toast.message" class="text-sm opacity-90">
                {{ toast.message }}
              </p>
            </div>
            
            <!-- Action Button -->
            <button
              v-if="toast.action"
              @click="toast.action.handler"
              class="ml-3 text-xs font-medium underline hover:no-underline"
            >
              {{ toast.action.label }}
            </button>
            
            <!-- Close Button -->
            <button
              @click="uiStore.removeToast(toast.id)"
              class="ml-3 flex-shrink-0 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import type { Toast } from '@/stores/ui'

const uiStore = useUIStore()

const getToastClasses = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white border-green-400'
    case 'error':
      return 'bg-red-500 text-white border-red-400'
    case 'warning':
      return 'bg-yellow-500 text-white border-yellow-400'
    case 'info':
      return 'bg-blue-500 text-white border-blue-400'
    default:
      return 'bg-gray-500 text-white border-gray-400'
  }
}

const getToastIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'CheckCircleIcon'
    case 'error':
      return 'XCircleIcon'
    case 'warning':
      return 'ExclamationTriangleIcon'
    case 'info':
      return 'InformationCircleIcon'
    default:
      return 'InformationCircleIcon'
  }
}
</script>

<!-- Import Heroicons -->
<script lang="ts">
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

export { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon }
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
