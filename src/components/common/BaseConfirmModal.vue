<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="handleBackdropClick"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ title || $t('common.confirm.title') }}
              </h3>
              <button
                v-if="!persistent"
                @click="close"
                class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <!-- Content -->
            <div class="mb-6">
              <p class="text-gray-600 dark:text-gray-300">
                {{ message || $t('common.confirm.message') }}
              </p>
            </div>
            
            <!-- Actions -->
            <div class="flex space-x-3 justify-end">
              <button
                v-if="!persistent"
                @click="close"
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                {{ cancelText || $t('common.buttons.cancel') }}
              </button>
              <button
                @click="confirm"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  variant === 'danger' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                ]"
              >
                {{ confirmText || $t('common.buttons.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  persistent: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  close: []
}>()

const handleBackdropClick = () => {
  if (!props.persistent) {
    close()
  }
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const confirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
