<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  outlined?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  rounded: true,
  outlined: false
})

const badgeClasses = computed(() => [
  'inline-flex items-center justify-center font-medium transition-colors',
  
  // Size classes
  {
    'px-2 py-1 text-xs': props.size === 'sm',
    'px-3 py-1.5 text-sm': props.size === 'md',
    'px-4 py-2 text-base': props.size === 'lg'
  },
  
  // Rounded classes
  {
    'rounded-full': props.rounded,
    'rounded-md': !props.rounded
  },
  
  // Variant classes - filled
  {
    'bg-pink-100 text-pink-800': props.variant === 'primary' && !props.outlined,
    'bg-gray-100 text-gray-800': props.variant === 'secondary' && !props.outlined,
    'bg-green-100 text-green-800': props.variant === 'success' && !props.outlined,
    'bg-yellow-100 text-yellow-800': props.variant === 'warning' && !props.outlined,
    'bg-red-100 text-red-800': props.variant === 'error' && !props.outlined,
    'bg-blue-100 text-blue-800': props.variant === 'info' && !props.outlined,
    'border border-gray-300 text-gray-700 bg-transparent': props.variant === 'outline'
  },
  
  // Variant classes - outlined
  {
    'border border-pink-300 text-pink-700 bg-transparent': props.variant === 'primary' && props.outlined,
    'border border-gray-300 text-gray-700 bg-transparent': props.variant === 'secondary' && props.outlined,
    'border border-green-300 text-green-700 bg-transparent': props.variant === 'success' && props.outlined,
    'border border-yellow-300 text-yellow-700 bg-transparent': props.variant === 'warning' && props.outlined,
    'border border-red-300 text-red-700 bg-transparent': props.variant === 'error' && props.outlined,
    'border border-blue-300 text-blue-700 bg-transparent': props.variant === 'info' && props.outlined
  }
])
</script>
