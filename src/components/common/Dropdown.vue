<template>
  <Menu as="div" :class="containerClasses" v-slot="{ open }">
    <!-- Top-positioned label -->
    <div v-if="label && labelPosition === 'top'" class="mb-1 text-sm font-medium text-gray-700">
      {{ label }}
    </div>

    <!-- Trigger Button -->
    <MenuButton :class="triggerClasses" class="mr-2" :disabled="disabled">
      <div class="flex items-center justify-between w-full">
        <slot name="trigger" :open="open">
          <span :class="labelClasses">{{ label || placeholder }}</span>
        </slot>
        <ChevronDownIcon
          v-if="showIconDropdown"
          :class="chevronClasses"
          :style="{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }"
        />
      </div>
    </MenuButton>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems :class="menuClasses">
        <!-- Header Slot -->
        <div v-if="$slots.header" :class="headerClasses">
          <slot name="header" />
        </div>

        <!-- Menu Items -->
        <div :class="itemsContainerClasses">
          <slot :close="closeMenu" />
        </div>

        <!-- Footer Slot -->
        <div v-if="$slots.footer" :class="footerClasses">
          <slot name="footer" />
        </div>
      </MenuItems>
    </Transition>
  </Menu>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface Props {
  /** Custom icon component to display before label in trigger */
  icon?: any
  label?: string
  placeholder?: string
  /** Show label above the dropdown (top) or inline in trigger (inline) */
  labelPosition?: 'inline' | 'top'
  position?: 'left' | 'right' | 'center'
  align?: 'top' | 'bottom'
  width?: 'auto' | 'full' | 'trigger' | string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'romantic' | 'spring' | 'outline' | 'ghost'
  disabled?: boolean
  rounded?: boolean
  shadow?: boolean
  showIconDropdown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  labelPosition: 'top',
  placeholder: 'Select option',
  position: 'left',
  align: 'bottom',
  width: 'auto',
  size: 'md',
  variant: 'default',
  disabled: false,
  rounded: true,
  shadow: true,
  showIconDropdown: true
})

const emit = defineEmits<{
  open: []
  close: []
}>()

const slots = useSlots()

const closeMenu = () => {
  emit('close')
}

// Container classes
const containerClasses = computed(() => {
  return 'relative inline-block text-left'
})

// Trigger button classes
const triggerClasses = computed(() => {
  const base = 'inline-flex w-full justify-between items-center px-4 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    outline: 'bg-white border-2 border-primary-300 text-primary-700 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'bg-transparent border-transparent text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
    romantic: 'bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-rose-800 hover:from-rose-100 hover:to-pink-100 focus:ring-rose-500',
    spring: 'bg-gradient-to-r from-green-50 to-emerald-50 border border-primary-200 text-primary-800 hover:from-green-100 hover:to-emerald-100 focus:ring-primary-500'
  }
  
  // Shape classes
  const shapeClasses = props.rounded ? 'rounded-lg' : 'rounded-none'
  
  // Disabled classes
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  return [
    base,
    sizeClasses[props.size],
    variantClasses[props.variant],
    shapeClasses,
    disabledClasses
  ].filter(Boolean).join(' ')
})

// Label classes
const labelClasses = computed(() => {
  const base = 'block truncate'
  const color = props.label ? '' : 'text-gray-500'
  return [base, color].filter(Boolean).join(' ')
})

// Chevron icon classes
const chevronClasses = computed(() => {
  const base = 'h-5 w-5 transition-transform duration-200'
  
  const colorClasses = {
    default: 'text-gray-400',
    outline: 'text-primary-500',
    ghost: 'text-gray-500',
    romantic: 'text-rose-500',
    spring: 'text-primary-500'
  }
  
  return `${base} ${colorClasses[props.variant]}`
})

// Menu panel classes
const menuClasses = computed(() => {
  const base = 'absolute z-10 mt-1 origin-top-right divide-y divide-gray-100 overflow-hidden bg-white focus:outline-none'
  
  // Position classes
  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  }
  
  // Alignment classes
  const alignClasses = {
    top: 'bottom-full mb-1 mt-0',
    bottom: 'top-full mt-1'
  }
  
  // Width classes
  const widthClasses = typeof props.width === 'string' && !['auto', 'full', 'trigger'].includes(props.width)
    ? props.width
    : {
        auto: 'min-w-[200px]',
        full: 'w-full',
        trigger: 'w-full'
      }[props.width as 'auto' | 'full' | 'trigger']
  
  // Shape and shadow
  const shapeClasses = props.rounded ? 'rounded-lg' : 'rounded-none'
  const shadowClasses = props.shadow ? 'shadow-lg ring-1 ring-black ring-opacity-5' : 'border border-gray-200'
  
  return [
    base,
    positionClasses[props.position],
    alignClasses[props.align],
    widthClasses,
    shapeClasses,
    shadowClasses
  ].filter(Boolean).join(' ')
})

// Header classes
const headerClasses = computed(() => {
  return 'px-4 py-3 border-b border-gray-100 bg-gray-50'
})

// Items container classes
const itemsContainerClasses = computed(() => {
  return 'py-1'
})

// Footer classes
const footerClasses = computed(() => {
  return 'px-4 py-3 border-t border-gray-100 bg-gray-50'
})
</script>
