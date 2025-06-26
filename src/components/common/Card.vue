<template>
  <div :class="cardClasses" @click="handleClick">
    <!-- Header Slot -->
    <div v-if="hasHeader" :class="headerClasses">
      <slot name="header">
        <div v-if="title || subtitle">
          <h3 v-if="title" :class="titleClasses">{{ title }}</h3>
          <p v-if="subtitle" :class="subtitleClasses">{{ subtitle }}</p>
        </div>
      </slot>
    </div>
    
    <!-- Image Slot -->
    <div v-if="hasImage" :class="imageClasses">
      <slot name="image" />
    </div>
    
    <!-- Content Slot -->
    <div :class="contentClasses">
      <slot />
    </div>
    
    <!-- Actions/Footer Slot -->
    <div v-if="hasFooter" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  variant?: 'default' | 'outlined' | 'elevated' | 'filled' | 'romantic' | 'spring'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  clickable?: boolean
  gradient?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  rounded: 'md',
  shadow: true,
  hover: false,
  clickable: false,
  gradient: false,
  bordered: true
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = useSlots()

const hasHeader = computed(() => !!(props.title || props.subtitle || slots.header))
const hasFooter = computed(() => !!slots.footer)
const hasImage = computed(() => !!slots.image)

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}

const cardClasses = computed(() => {
  const base = 'transition-all duration-300 ease-in-out overflow-hidden'
  
  // Variant styles
  const variants = {
    default: 'bg-white border-gray-200',
    outlined: 'bg-white border-2 border-primary-200 hover:border-primary-300',
    elevated: 'bg-white border-gray-100',
    filled: 'bg-gray-50 border-gray-200',
    romantic: 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200',
    spring: 'bg-gradient-to-br from-green-50 to-emerald-50 border-primary-200'
  }
  
  // Size padding
  const sizes = {
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8'
  }
  
  // Rounded styles
  const roundedStyles = {
    false: '',
    true: 'rounded-lg',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }
  
  // Shadow styles
  const shadowStyles = {
    false: '',
    true: 'shadow-sm',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }
  
  // Interactive styles
  const interactiveStyles = props.clickable 
    ? 'cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]'
    : ''
  
  const hoverStyles = props.hover && !props.clickable
    ? 'hover:shadow-lg hover:border-primary-300'
    : ''
  
  const borderStyles = props.bordered ? 'border' : ''
  
  const gradientStyles = props.gradient && props.variant === 'default'
    ? 'bg-gradient-to-br from-white to-gray-50'
    : ''
  
  return [
    base,
    variants[props.variant],
    sizes[props.size],
    roundedStyles[props.rounded as keyof typeof roundedStyles],
    shadowStyles[props.shadow as keyof typeof shadowStyles],
    borderStyles,
    interactiveStyles,
    hoverStyles,
    gradientStyles
  ].filter(Boolean).join(' ')
})

const headerClasses = computed(() => {
  const spacing = hasImage.value ? 'mb-0' : 'mb-4'
  const border = (slots.default || hasFooter.value) && !hasImage.value ? 'pb-4 border-b border-gray-100' : ''
  
  return [spacing, border].filter(Boolean).join(' ')
})

const imageClasses = computed(() => {
  const spacing = hasHeader.value ? 'mt-4' : ''
  const bottomSpacing = (slots.default || hasFooter.value) ? 'mb-4' : ''
  
  return [spacing, bottomSpacing, '-mx-5 -mt-5'].filter(Boolean).join(' ')
})

const titleClasses = computed(() => {
  const sizeClasses = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }
  
  const colorClasses = props.variant === 'romantic' 
    ? 'text-rose-900' 
    : props.variant === 'spring'
    ? 'text-primary-900'
    : 'text-gray-900'
  
  return `font-bold ${sizeClasses[props.size]} ${colorClasses}`
})

const subtitleClasses = computed(() => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  const colorClasses = props.variant === 'romantic' 
    ? 'text-rose-600' 
    : props.variant === 'spring'
    ? 'text-primary-600'
    : 'text-gray-600'
  
  return `${sizeClasses[props.size]} ${colorClasses} mt-1`
})

const contentClasses = computed(() => {
  const spacing = hasFooter.value ? 'mb-4' : ''
  return spacing
})

const footerClasses = computed(() => {
  return 'pt-4 border-t border-gray-100'
})
</script>
