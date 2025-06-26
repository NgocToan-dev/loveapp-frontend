<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="uiStore.hasActiveModals" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        @click.self="handleBackdropClick"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
          <component 
            :is="modalComponent" 
            v-bind="modalProps"
            @close="closeModal"
            @confirm="handleConfirm"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

const modalComponent = computed(() => {
  const modal = uiStore.activeModal
  if (!modal) return null
  
  // Dynamic component loading based on modal type
  switch (modal.component) {
    case 'ConfirmDialog':
      return defineAsyncComponent(() => import('./ConfirmDialog.vue'))
    case 'ImagePreview':
      return defineAsyncComponent(() => import('./ImagePreview.vue'))
    default:
      return defineAsyncComponent(() => import('./ConfirmDialog.vue'))
  }
})

const modalProps = computed(() => {
  return uiStore.activeModal?.props || {}
})

const handleBackdropClick = () => {
  const modal = uiStore.activeModal
  if (modal && !modal.persistent) {
    closeModal()
  }
}

const closeModal = () => {
  uiStore.closeModal()
}

const handleConfirm = (data?: unknown) => {
  const modal = uiStore.activeModal
  if (modal?.props?.onConfirm) {
    modal.props.onConfirm(data)
  }
  closeModal()
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
