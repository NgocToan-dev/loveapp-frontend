<template>
  <div :class="containerClasses">
    <!-- Spinner Animation -->
    <div :class="spinnerContainerClasses">
      <!-- Default Spinner -->
      <div v-if="variant === 'spinner'" :class="spinnerClasses">
        <div class="animate-spin rounded-full border-t-transparent" :class="[sizeClasses, borderClasses]"></div>
      </div>
      
      <!-- Pulse Animation -->
      <div v-else-if="variant === 'pulse'" :class="pulseClasses">
        <div class="animate-pulse rounded-full" :class="[sizeClasses, backgroundClasses]"></div>
      </div>
      
      <!-- Bounce Animation -->
      <div v-else-if="variant === 'bounce'" :class="bounceContainerClasses">
        <div 
          v-for="i in 3" 
          :key="i"
          class="animate-bounce rounded-full"
          :class="[bounceClasses, backgroundClasses]"
          :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
        ></div>
      </div>
      
      <!-- Hearts Animation (Romantic Theme) -->
      <div v-else-if="variant === 'hearts'" :class="heartsContainerClasses">
        <div 
          v-for="i in 3" 
          :key="i"
          class="animate-pulse"
          :class="heartClasses"
          :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
        >
          ❤️
        </div>
      </div>
      
      <!-- Spring Leaves Animation -->
      <div v-else-if="variant === 'leaves'" :class="leavesContainerClasses">
        <div 
          v-for="i in 4" 
          :key="i"
          class="animate-spin"
          :class="leafClasses"
          :style="{ 
            animationDelay: `${(i - 1) * 0.15}s`,
            animationDuration: '2s'
          }"
        >
          🍃
        </div>
      </div>
      
      <!-- Custom Slot -->
      <slot v-else name="custom" />
    </div>
    
    <!-- Loading Text -->
    <p v-if="text" :class="textClasses">
      {{ text }}
    </p>
    
    <!-- Progress Bar -->
    <div v-if="showProgress" :class="progressContainerClasses">
      <div 
        :class="progressBarClasses"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'spinner' | 'pulse' | 'bounce' | 'hearts' | 'leaves' | 'custom'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  theme?: 'default' | 'romantic' | 'spring' | 'primary' | 'secondary' | 'white'
  text?: string
  fullScreen?: boolean
  overlay?: boolean
  centered?: boolean
  showProgress?: boolean
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'spinner',
  size: 'md',
  theme: 'primary',
  fullScreen: false,
  overlay: false,
  centered: false,
  showProgress: false,
  progress: 0
})

// Container classes
const containerClasses = computed(() => {
  const base = 'flex flex-col items-center justify-center'
  const fullScreen = props.fullScreen ? 'fixed inset-0 z-50' : ''
  const overlay = props.fullScreen && props.overlay ? 'bg-white/80 backdrop-blur-sm' : ''
  const background = props.fullScreen && !props.overlay ? 'bg-white' : ''
  const padding = props.fullScreen ? 'p-4' : ''
  const spacing = props.text || props.showProgress ? 'gap-3' : ''
  const centered = props.centered && !props.fullScreen ? 'min-h-[200px]' : ''
  
  return [base, fullScreen, overlay, background, padding, spacing, centered].filter(Boolean).join(' ')
})

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  }
  return sizes[props.size]
})

// Theme-based colors
const themeColors = computed(() => {
  const themes = {
    default: {
      border: 'border-gray-300 border-t-gray-600',
      background: 'bg-gray-600',
      text: 'text-gray-600',
      progress: 'bg-gray-600'
    },
    primary: {
      border: 'border-primary-200 border-t-primary-500',
      background: 'bg-primary-500',
      text: 'text-primary-600',
      progress: 'bg-primary-500'
    },
    romantic: {
      border: 'border-rose-200 border-t-rose-500',
      background: 'bg-rose-500',
      text: 'text-rose-600',
      progress: 'bg-gradient-to-r from-rose-400 to-pink-500'
    },
    spring: {
      border: 'border-emerald-200 border-t-emerald-500',
      background: 'bg-emerald-500',
      text: 'text-emerald-600',
      progress: 'bg-gradient-to-r from-green-400 to-emerald-500'
    },
    secondary: {
      border: 'border-gray-300 border-t-gray-500',
      background: 'bg-gray-500',
      text: 'text-gray-500',
      progress: 'bg-gray-500'
    },
    white: {
      border: 'border-white/30 border-t-white',
      background: 'bg-white',
      text: 'text-white',
      progress: 'bg-white'
    }
  }
  return themes[props.theme]
})

// Spinner container
const spinnerContainerClasses = computed(() => {
  return 'relative flex items-center justify-center'
})

// Default spinner
const spinnerClasses = computed(() => {
  return 'relative flex items-center justify-center'
})

const borderClasses = computed(() => {
  return `border-4 ${themeColors.value.border}`
})

const backgroundClasses = computed(() => {
  return themeColors.value.background
})

// Pulse animation
const pulseClasses = computed(() => {
  return 'relative flex items-center justify-center'
})

// Bounce animation
const bounceContainerClasses = computed(() => {
  return 'flex items-center justify-center space-x-1'
})

const bounceClasses = computed(() => {
  const bounceSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6'
  }
  return bounceSizes[props.size]
})

// Hearts animation
const heartsContainerClasses = computed(() => {
  return 'flex items-center justify-center space-x-1'
})

const heartClasses = computed(() => {
  const heartSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl'
  }
  return heartSizes[props.size]
})

// Leaves animation
const leavesContainerClasses = computed(() => {
  return 'grid grid-cols-2 gap-1'
})

const leafClasses = computed(() => {
  const leafSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl'
  }
  return leafSizes[props.size]
})

// Text classes
const textClasses = computed(() => {
  const base = 'font-medium'
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  }
  
  return `${base} ${textSizes[props.size]} ${themeColors.value.text}`
})

// Progress bar
const progressContainerClasses = computed(() => {
  return 'w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden'
})

const progressBarClasses = computed(() => {
  const base = 'h-full transition-all duration-300 ease-out rounded-full'
  return `${base} ${themeColors.value.progress}`
})
</script>
