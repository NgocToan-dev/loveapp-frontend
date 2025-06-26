<template>
  <div :class="containerClasses" @click="handleClick">
    <!-- Image -->
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt"
      :class="imageClasses"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    
    <!-- Initials -->
    <div v-else-if="initials" :class="initialsClasses">
      {{ displayInitials }}
    </div>
    
    <!-- Icon Placeholder -->
    <div v-else :class="placeholderClasses">
      <slot name="icon">
        <UserIcon :class="iconClasses" />
      </slot>
    </div>
    
    <!-- Status Indicator -->
    <div v-if="status" :class="statusClasses">
      <div :class="statusDotClasses"></div>
    </div>
    
    <!-- Badge/Notification -->
    <div v-if="badge" :class="badgeClasses">
      {{ badge }}
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" :class="loadingClasses">
      <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserIcon } from '@heroicons/vue/24/solid'

interface Props {
  src?: string
  alt?: string
  name?: string
  initials?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  variant?: 'circular' | 'rounded' | 'square'
  theme?: 'default' | 'romantic' | 'spring' | 'colorful'
  status?: 'online' | 'offline' | 'away' | 'busy' | 'dnd'
  badge?: string | number
  clickable?: boolean
  loading?: boolean
  bordered?: boolean
  shadow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Avatar',
  size: 'md',
  variant: 'circular',
  theme: 'default',
  clickable: false,
  loading: false,
  bordered: false,
  shadow: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  imageLoad: []
  imageError: []
}>()

const imageError = ref(false)
const imageLoaded = ref(false)

// Generate initials from name
const displayInitials = computed(() => {
  if (props.initials) return props.initials.slice(0, 2).toUpperCase()
  if (props.name) {
    return props.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }
  return ''
})

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl'
  }
  return sizes[props.size]
})

// Variant classes
const shapeClasses = computed(() => {
  const shapes = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none'
  }
  return shapes[props.variant]
})

// Theme colors for initials/placeholder
const themeClasses = computed(() => {
  if (props.src && !imageError.value) return ''
  
  const themes = {
    default: 'bg-gray-100 text-gray-600',
    romantic: 'bg-gradient-to-br from-rose-400 to-pink-500 text-white',
    spring: 'bg-gradient-to-br from-primary-400 to-emerald-500 text-white',
    colorful: generateColorfulTheme()
  }
  return themes[props.theme]
})

// Generate colorful theme based on name/initials
const generateColorfulTheme = () => {
  const colors = [
    'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
    'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
    'bg-gradient-to-br from-green-400 to-green-600 text-white',
    'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white',
    'bg-gradient-to-br from-red-400 to-red-600 text-white',
    'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white',
    'bg-gradient-to-br from-pink-400 to-pink-600 text-white',
    'bg-gradient-to-br from-teal-400 to-teal-600 text-white'
  ]
  
  const seed = props.name || props.initials || ''
  const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
}

// Container classes
const containerClasses = computed(() => {
  const base = 'relative inline-flex items-center justify-center overflow-hidden font-medium transition-all duration-200'
  const interactive = props.clickable ? 'cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' : ''
  const border = props.bordered ? 'ring-2 ring-white' : ''
  const shadow = props.shadow ? 'shadow-lg' : ''
  
  return [
    base,
    sizeClasses.value,
    shapeClasses.value,
    themeClasses.value,
    interactive,
    border,
    shadow
  ].filter(Boolean).join(' ')
})

// Image classes
const imageClasses = computed(() => {
  return `w-full h-full object-cover ${shapeClasses.value}`
})

// Initials classes
const initialsClasses = computed(() => {
  return 'w-full h-full flex items-center justify-center font-semibold select-none'
})

// Placeholder classes
const placeholderClasses = computed(() => {
  return 'w-full h-full flex items-center justify-center'
})

// Icon classes
const iconClasses = computed(() => {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-12 h-12'
  }
  return iconSizes[props.size]
})

// Status indicator classes
const statusClasses = computed(() => {
  const statusSizes = {
    xs: 'w-2 h-2 -top-0.5 -right-0.5',
    sm: 'w-2.5 h-2.5 -top-0.5 -right-0.5',
    md: 'w-3 h-3 -top-1 -right-1',
    lg: 'w-3.5 h-3.5 -top-1 -right-1',
    xl: 'w-4 h-4 -top-1.5 -right-1.5',
    '2xl': 'w-5 h-5 -top-2 -right-2',
    '3xl': 'w-6 h-6 -top-2 -right-2'
  }
  
  return `absolute flex items-center justify-center ${statusSizes[props.size]} ${shapeClasses.value} bg-white ring-2 ring-white`
})

const statusDotClasses = computed(() => {
  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400',
    dnd: 'bg-red-400'
  }
  
  return `w-full h-full ${shapeClasses.value} ${statusColors[props.status || 'offline']}`
})

// Badge classes
const badgeClasses = computed(() => {
  const badgeSizes = {
    xs: 'text-xs px-1 min-w-[16px] h-4 -top-1 -right-1',
    sm: 'text-xs px-1.5 min-w-[18px] h-4 -top-1 -right-1',
    md: 'text-xs px-1.5 min-w-[20px] h-5 -top-1.5 -right-1.5',
    lg: 'text-sm px-2 min-w-[22px] h-5 -top-1.5 -right-1.5',
    xl: 'text-sm px-2 min-w-[24px] h-6 -top-2 -right-2',
    '2xl': 'text-sm px-2.5 min-w-[26px] h-6 -top-2 -right-2',
    '3xl': 'text-base px-3 min-w-[28px] h-7 -top-2.5 -right-2.5'
  }
  
  return `absolute flex items-center justify-center rounded-full bg-red-500 text-white font-semibold ${badgeSizes[props.size]}`
})

// Loading overlay
const loadingClasses = computed(() => {
  return 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full'
})

// Event handlers
const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}

const handleImageError = () => {
  imageError.value = true
  emit('imageError')
}

const handleImageLoad = () => {
  imageLoaded.value = true
  emit('imageLoad')
}
</script>
