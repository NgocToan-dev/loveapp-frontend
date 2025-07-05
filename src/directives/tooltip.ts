import type { Directive, DirectiveBinding } from 'vue'

interface TooltipOptions {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  theme?: 'dark' | 'light'
  disabled?: boolean
}

interface TooltipElement extends HTMLElement {
  _tooltip?: {
    element?: HTMLElement
    content: string
    placement: string
    timer?: number
    showTimer?: number
  }
}

// Create tooltip element
function createTooltip(content: string, placement: string = 'top', theme: string = 'dark'): HTMLElement {
  const tooltip = document.createElement('div')
  tooltip.className = `v-tooltip v-tooltip-${theme} v-tooltip-${placement}`
  tooltip.textContent = content
  tooltip.setAttribute('role', 'tooltip')
  
  // Add arrow
  const arrow = document.createElement('div')
  arrow.className = `v-tooltip-arrow v-tooltip-arrow-${placement}`
  tooltip.appendChild(arrow)
  
  document.body.appendChild(tooltip)
  return tooltip
}

// Position tooltip
function positionTooltip(element: HTMLElement, tooltip: HTMLElement, placement: string) {
  const rect = element.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  
  let top = 0
  let left = 0
  
  switch (placement) {
    case 'top':
      top = rect.top + scrollTop - tooltipRect.height - 8
      left = rect.left + scrollLeft + (rect.width - tooltipRect.width) / 2
      break
    case 'bottom':
      top = rect.bottom + scrollTop + 8
      left = rect.left + scrollLeft + (rect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = rect.top + scrollTop + (rect.height - tooltipRect.height) / 2
      left = rect.left + scrollLeft - tooltipRect.width - 8
      break
    case 'right':
      top = rect.top + scrollTop + (rect.height - tooltipRect.height) / 2
      left = rect.right + scrollLeft + 8
      break
  }
  
  // Keep tooltip within viewport
  const margin = 8
  if (left < margin) {
    left = margin
  } else if (left + tooltipRect.width > window.innerWidth - margin) {
    left = window.innerWidth - tooltipRect.width - margin
  }
  
  if (top < margin) {
    top = margin
  } else if (top + tooltipRect.height > window.innerHeight + scrollTop - margin) {
    top = window.innerHeight + scrollTop - tooltipRect.height - margin
  }
  
  tooltip.style.top = `${top}px`
  tooltip.style.left = `${left}px`
}

// Show tooltip
function showTooltip(el: TooltipElement, options: TooltipOptions) {
  if (options.disabled || !options.content) return
  
  // Clear any existing show timer
  if (el._tooltip?.showTimer) {
    clearTimeout(el._tooltip.showTimer)
  }
  
  el._tooltip!.showTimer = window.setTimeout(() => {
    const tooltip = createTooltip(options.content, options.placement, options.theme)
    el._tooltip!.element = tooltip
    
    // Position tooltip
    positionTooltip(el, tooltip, options.placement || 'top')
    
    // Show with animation
    requestAnimationFrame(() => {
      tooltip.classList.add('v-tooltip-show')
    })
  }, options.delay || 100)
}

// Hide tooltip
function hideTooltip(el: TooltipElement) {
  // Clear show timer
  if (el._tooltip?.showTimer) {
    clearTimeout(el._tooltip.showTimer)
    el._tooltip.showTimer = undefined
  }
  
  if (el._tooltip?.element) {
    const tooltip = el._tooltip.element
    tooltip.classList.remove('v-tooltip-show')
    
    // Remove after animation
    el._tooltip.timer = window.setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip)
      }
      if (el._tooltip) {
        el._tooltip.element = undefined
      }
    }, 150)
  }
}

// Parse directive value
function parseOptions(binding: DirectiveBinding): TooltipOptions {
  if (typeof binding.value === 'string') {
    return { content: binding.value }
  }
  
  if (typeof binding.value === 'object' && binding.value !== null) {
    return {
      content: binding.value.content || '',
      placement: binding.value.placement || 'top',
      delay: binding.value.delay || 100,
      theme: binding.value.theme || 'dark',
      disabled: binding.value.disabled || false
    }
  }
  
  return { content: '' }
}

export const vTooltip: Directive<TooltipElement, string | TooltipOptions> = {
  mounted(el: TooltipElement, binding: DirectiveBinding) {
    const options = parseOptions(binding)
    
    el._tooltip = {
      element: undefined as any,
      content: options.content,
      placement: options.placement || 'top'
    }
    
    const showHandler = () => showTooltip(el, options)
    const hideHandler = () => hideTooltip(el)
    
    el.addEventListener('mouseenter', showHandler)
    el.addEventListener('mouseleave', hideHandler)
    el.addEventListener('focus', showHandler)
    el.addEventListener('blur', hideHandler)
    
    // Store handlers for cleanup
    ;(el as any)._tooltipHandlers = { showHandler, hideHandler }
  },
  
  updated(el: TooltipElement, binding: DirectiveBinding) {
    const options = parseOptions(binding)
    
    if (el._tooltip) {
      el._tooltip.content = options.content
      el._tooltip.placement = options.placement || 'top'
    }
    
    // If currently showing, update content
    if (el._tooltip?.element) {
      el._tooltip.element.textContent = options.content
    }
  },
  
  unmounted(el: TooltipElement) {
    hideTooltip(el)
    
    const handlers = (el as any)._tooltipHandlers
    if (handlers) {
      el.removeEventListener('mouseenter', handlers.showHandler)
      el.removeEventListener('mouseleave', handlers.hideHandler)
      el.removeEventListener('focus', handlers.showHandler)
      el.removeEventListener('blur', handlers.hideHandler)
    }
    
    if (el._tooltip?.timer) {
      clearTimeout(el._tooltip.timer)
    }
    if (el._tooltip?.showTimer) {
      clearTimeout(el._tooltip.showTimer)
    }
    
    delete el._tooltip
    delete (el as any)._tooltipHandlers
  }
}

export default vTooltip
