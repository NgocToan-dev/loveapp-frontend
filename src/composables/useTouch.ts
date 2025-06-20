import { ref, onMounted, onUnmounted } from 'vue'

interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null
  distance: number
  duration: number
}

export function useTouch(element?: HTMLElement) {
  const startTouch = ref<TouchPoint | null>(null)
  const endTouch = ref<TouchPoint | null>(null)
  const isLongPress = ref(false)
  const isSwiping = ref(false)

  // Touch thresholds
  const SWIPE_THRESHOLD = 50 // minimum distance for swipe
  const LONG_PRESS_DURATION = 500 // milliseconds
  const MAX_TAP_DURATION = 200 // milliseconds

  let longPressTimer: number | null = null
  let targetElement: HTMLElement | null = null

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    startTouch.value = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }
    endTouch.value = null
    isLongPress.value = false
    isSwiping.value = false

    // Start long press timer
    longPressTimer = setTimeout(() => {
      isLongPress.value = true
      onLongPress?.()
    }, LONG_PRESS_DURATION)
  }

  const handleTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0]
    endTouch.value = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }

    // Cancel long press if finger moves
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }

    // Check if swiping
    if (startTouch.value && endTouch.value) {
      const deltaX = Math.abs(endTouch.value.x - startTouch.value.x)
      const deltaY = Math.abs(endTouch.value.y - startTouch.value.y)
      
      if (deltaX > 10 || deltaY > 10) {
        isSwiping.value = true
      }
    }
  }

  const handleTouchEnd = (event: TouchEvent) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }

    if (!startTouch.value) return

    const touch = event.changedTouches[0]
    endTouch.value = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }

    const duration = endTouch.value.timestamp - startTouch.value.timestamp

    // Handle different gestures
    if (!isLongPress.value && !isSwiping.value && duration < MAX_TAP_DURATION) {
      // Quick tap
      onTap?.()
    } else if (isSwiping.value) {
      // Swipe gesture
      const swipe = calculateSwipe()
      if (swipe.direction) {
        onSwipe?.(swipe)
      }
    }

    // Reset
    startTouch.value = null
    endTouch.value = null
    isSwiping.value = false
    isLongPress.value = false
  }

  const calculateSwipe = (): SwipeDirection => {
    if (!startTouch.value || !endTouch.value) {
      return { direction: null, distance: 0, duration: 0 }
    }

    const deltaX = endTouch.value.x - startTouch.value.x
    const deltaY = endTouch.value.y - startTouch.value.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const duration = endTouch.value.timestamp - startTouch.value.timestamp

    if (distance < SWIPE_THRESHOLD) {
      return { direction: null, distance, duration }
    }

    // Determine primary direction
    let direction: 'left' | 'right' | 'up' | 'down'
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left'
    } else {
      direction = deltaY > 0 ? 'down' : 'up'
    }

    return { direction, distance, duration }
  }

  // Event handlers (to be set by consumer)
  let onTap: (() => void) | undefined
  let onLongPress: (() => void) | undefined
  let onSwipe: ((swipe: SwipeDirection) => void) | undefined

  const setHandlers = (handlers: {
    onTap?: () => void
    onLongPress?: () => void
    onSwipe?: (swipe: SwipeDirection) => void
  }) => {
    onTap = handlers.onTap
    onLongPress = handlers.onLongPress
    onSwipe = handlers.onSwipe
  }

  const bindToElement = (el: HTMLElement) => {
    targetElement = el
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  const unbindFromElement = () => {
    if (targetElement) {
      targetElement.removeEventListener('touchstart', handleTouchStart)
      targetElement.removeEventListener('touchmove', handleTouchMove)
      targetElement.removeEventListener('touchend', handleTouchEnd)
      targetElement = null
    }
  }

  onMounted(() => {
    if (element) {
      bindToElement(element)
    }
  })

  onUnmounted(() => {
    unbindFromElement()
    if (longPressTimer) {
      clearTimeout(longPressTimer)
    }
  })

  return {
    startTouch,
    endTouch,
    isLongPress,
    isSwiping,
    setHandlers,
    bindToElement,
    unbindFromElement,
    calculateSwipe
  }
}
