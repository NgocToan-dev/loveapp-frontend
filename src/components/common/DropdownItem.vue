<template>
  <MenuItem v-slot="{ active, close }" :disabled="disabled">
    <component
      :is="componentTag"
      :class="itemClasses(active)"
      @click="handleClick($event, close)"
      :href="href"
      :to="to"
      :disabled="disabled"
    >
      <!-- Leading Icon -->
      <span v-if="hasLeadingIcon" :class="iconClasses">
        <slot name="icon">
          <component 
            v-if="icon" 
            :is="icon" 
            class="h-4 w-4" 
          />
        </slot>
      </span>
      
      <!-- Content -->
      <div :class="contentClasses">
        <div :class="titleClasses">
          <slot />
        </div>
        <div v-if="description" :class="descriptionClasses">
          {{ description }}
        </div>
      </div>
      
      <!-- Trailing Content -->
      <span v-if="hasTrailingContent" :class="trailingClasses">
        <slot name="trailing">
          <!-- Badge -->
          <span v-if="badge" :class="badgeClasses">
            {{ badge }}
          </span>
          <!-- Keyboard Shortcut -->
          <span v-if="shortcut" :class="shortcutClasses">
            {{ shortcut }}
          </span>
          <!-- Trailing Icon -->
          <component 
            v-if="trailingIcon" 
            :is="trailingIcon" 
            class="h-4 w-4" 
          />
        </slot>
      </span>
    </component>
  </MenuItem>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { MenuItem } from '@headlessui/vue'

interface Props {
  href?: string
  to?: string | object
  icon?: any
  trailingIcon?: any
  description?: string
  badge?: string | number
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  variant?: 'default' | 'romantic' | 'spring' | 'warning' | 'success'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  danger: false,
  variant: 'default',
  size: 'md'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = useSlots()

// Computed component tag
const componentTag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return 'router-link'
  return 'button'
})

// Check for slots
const hasLeadingIcon = computed(() => !!(props.icon || slots.icon))
const hasTrailingContent = computed(() => !!(
  props.badge || 
  props.shortcut || 
  props.trailingIcon || 
  slots.trailing
))

// Event handler
const handleClick = (event: MouseEvent, close: () => void) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  
  emit('click', event)
  
  // Close dropdown unless it's a link that will navigate
  if (!props.href && !props.to) {
    close()
  }
}

// Item classes
const itemClasses = (active: boolean) => {
  const base = 'group flex items-center w-full px-4 py-2 text-left transition-colors duration-150'
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  }
  
  // State classes
  let stateClasses = ''
  if (props.disabled) {
    stateClasses = 'opacity-50 cursor-not-allowed'
  } else if (props.danger) {
    stateClasses = active 
      ? 'bg-red-100 text-red-900' 
      : 'text-red-700 hover:bg-red-50'
  } else {
    // Variant-based colors
    const variantClasses = {
      default: active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50',
      romantic: active ? 'bg-rose-100 text-rose-900' : 'text-rose-700 hover:bg-rose-50',
      spring: active ? 'bg-primary-100 text-primary-900' : 'text-primary-700 hover:bg-primary-50',
      warning: active ? 'bg-amber-100 text-amber-900' : 'text-amber-700 hover:bg-amber-50',
      success: active ? 'bg-emerald-100 text-emerald-900' : 'text-emerald-700 hover:bg-emerald-50'
    }
    stateClasses = variantClasses[props.variant]
  }
  
  return [
    base,
    sizeClasses[props.size],
    stateClasses
  ].filter(Boolean).join(' ')
}

// Icon classes
const iconClasses = computed(() => {
  const base = 'flex-shrink-0 mr-3'
  
  const colorClasses = props.danger 
    ? 'text-red-500' 
    : {
        default: 'text-gray-400 group-hover:text-gray-500',
        romantic: 'text-rose-400 group-hover:text-rose-500',
        spring: 'text-primary-400 group-hover:text-primary-500',
        warning: 'text-amber-400 group-hover:text-amber-500',
        success: 'text-emerald-400 group-hover:text-emerald-500'
      }[props.variant]
  
  return `${base} ${colorClasses}`
})

// Content classes
const contentClasses = computed(() => {
  return 'flex-1 min-w-0'
})

// Title classes
const titleClasses = computed(() => {
  return 'truncate font-medium'
})

// Description classes
const descriptionClasses = computed(() => {
  const base = 'truncate text-sm mt-0.5'
  
  const colorClasses = props.danger 
    ? 'text-red-500' 
    : {
        default: 'text-gray-500',
        romantic: 'text-rose-500',
        spring: 'text-primary-500',
        warning: 'text-amber-500',
        success: 'text-emerald-500'
      }[props.variant]
  
  return `${base} ${colorClasses}`
})

// Trailing content classes
const trailingClasses = computed(() => {
  return 'flex-shrink-0 ml-3 flex items-center space-x-2'
})

// Badge classes
const badgeClasses = computed(() => {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium'
  
  const colorClasses = props.danger 
    ? 'bg-red-100 text-red-800' 
    : {
        default: 'bg-gray-100 text-gray-800',
        romantic: 'bg-rose-100 text-rose-800',
        spring: 'bg-primary-100 text-primary-800',
        warning: 'bg-amber-100 text-amber-800',
        success: 'bg-emerald-100 text-emerald-800'
      }[props.variant]
  
  return `${base} ${colorClasses}`
})

// Shortcut classes
const shortcutClasses = computed(() => {
  return 'text-xs text-gray-400 font-mono'
})
</script>
