<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" />
      </TransitionChild>

      <!-- Modal container -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel :class="modalClasses">
              <!-- Header -->
              <div v-if="hasHeader" :class="headerClasses">
                <slot name="header">
                  <div class="flex items-start justify-between">
                    <div>
                      <DialogTitle v-if="title" as="h3" :class="titleClasses">
                        {{ title }}
                      </DialogTitle>
                      <DialogDescription v-if="description" :class="descriptionClasses">
                        {{ description }}
                      </DialogDescription>
                    </div>
                    <button
                      v-if="showCloseButton"
                      type="button"
                      :class="closeButtonClasses"
                      @click="handleClose"
                    >
                      <span class="sr-only">{{ $t('common.buttons.close') }}</span>
                      <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </slot>
              </div>

              <!-- Content -->
              <div :class="contentClasses">
                <slot />
              </div>

              <!-- Footer -->
              <div v-if="hasFooter" :class="footerClasses">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen?: boolean
  title?: string
  description?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  variant?: 'default' | 'romantic' | 'spring' | 'success' | 'warning' | 'error'
  rounded?: boolean
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  preventBodyScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  size: 'md',
  variant: 'default',
  rounded: true,
  showCloseButton: true,
  closeOnBackdrop: true,
  preventBodyScroll: true
})

const emit = defineEmits<{
  close: []
  open: []
}>()

const { t } = useI18n()
const slots = useSlots()

const hasHeader = computed(() => !!(props.title || props.description || slots.header))
const hasFooter = computed(() => !!slots.footer)

const handleClose = () => {
  if (props.closeOnBackdrop) {
    emit('close')
  }
}

const modalClasses = computed(() => {
  const base = 'relative transform overflow-hidden text-left align-middle shadow-xl transition-all'
  
  const sizes = {
    xs: 'w-full max-w-xs',
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-xl',
    '2xl': 'w-full max-w-2xl',
    '3xl': 'w-full max-w-3xl',
    full: 'w-full max-w-none h-full'
  }
  
  const variants = {
    default: 'bg-white',
    romantic: 'bg-gradient-to-br from-rose-50 to-pink-50',
    spring: 'bg-gradient-to-br from-green-50 to-emerald-50',
    success: 'bg-gradient-to-br from-emerald-50 to-green-50',
    warning: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    error: 'bg-gradient-to-br from-red-50 to-rose-50'
  }
  
  const roundedClass = props.rounded ? 'rounded-2xl' : ''
  
  return [
    base,
    sizes[props.size],
    variants[props.variant],
    roundedClass
  ].filter(Boolean).join(' ')
})

const headerClasses = computed(() => {
  const base = 'px-6 pt-6'
  const spacing = slots.default || hasFooter.value ? 'pb-4' : 'pb-6'
  const border = slots.default ? 'border-b border-gray-100' : ''
  
  return [base, spacing, border].filter(Boolean).join(' ')
})

const titleClasses = computed(() => {
  const colorClasses = {
    default: 'text-gray-900',
    romantic: 'text-rose-900',
    spring: 'text-primary-900',
    success: 'text-emerald-900',
    warning: 'text-amber-900',
    error: 'text-red-900'
  }
  
  return `text-lg font-bold leading-6 ${colorClasses[props.variant]}`
})

const descriptionClasses = computed(() => {
  const colorClasses = {
    default: 'text-gray-600',
    romantic: 'text-rose-600',
    spring: 'text-primary-600',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600'
  }
  
  return `mt-2 text-sm ${colorClasses[props.variant]}`
})

const closeButtonClasses = computed(() => {
  const base = 'rounded-md p-1 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const colorClasses = {
    default: 'text-gray-400 hover:text-gray-500 focus:ring-gray-500',
    romantic: 'text-rose-400 hover:text-rose-500 focus:ring-rose-500',
    spring: 'text-primary-400 hover:text-primary-500 focus:ring-primary-500',
    success: 'text-emerald-400 hover:text-emerald-500 focus:ring-emerald-500',
    warning: 'text-amber-400 hover:text-amber-500 focus:ring-amber-500',
    error: 'text-red-400 hover:text-red-500 focus:ring-red-500'
  }
  
  return `${base} ${colorClasses[props.variant]}`
})

const contentClasses = computed(() => {
  const base = 'px-6'
  const spacing = hasHeader.value ? (hasFooter.value ? 'py-4' : 'pb-6') : (hasFooter.value ? 'pt-6 pb-4' : 'py-6')
  
  return [base, spacing].filter(Boolean).join(' ')
})

const footerClasses = computed(() => {
  return 'px-6 pb-6 pt-4 border-t border-gray-100'
})
</script>
