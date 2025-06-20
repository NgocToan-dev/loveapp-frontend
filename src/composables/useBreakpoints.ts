import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Breakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
}

export function useBreakpoints() {
  const windowWidth = ref(0)
  const windowHeight = ref(0)

  // Define breakpoints (matching Vuetify defaults)
  const breakpoints: Breakpoints = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  }

  // Computed properties for each breakpoint
  const xs = computed(() => windowWidth.value >= breakpoints.xs && windowWidth.value < breakpoints.sm)
  const sm = computed(() => windowWidth.value >= breakpoints.sm && windowWidth.value < breakpoints.md)
  const md = computed(() => windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg)
  const lg = computed(() => windowWidth.value >= breakpoints.lg && windowWidth.value < breakpoints.xl)
  const xl = computed(() => windowWidth.value >= breakpoints.xl)

  // Convenience computed properties
  const mobile = computed(() => windowWidth.value < breakpoints.md) // xs + sm
  const tablet = computed(() => windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg) // md
  const desktop = computed(() => windowWidth.value >= breakpoints.lg) // lg + xl
  const touch = computed(() => windowWidth.value < breakpoints.lg) // xs + sm + md

  // Greater than breakpoint
  const smAndUp = computed(() => windowWidth.value >= breakpoints.sm)
  const mdAndUp = computed(() => windowWidth.value >= breakpoints.md)
  const lgAndUp = computed(() => windowWidth.value >= breakpoints.lg)

  // Less than breakpoint
  const smAndDown = computed(() => windowWidth.value < breakpoints.md)
  const mdAndDown = computed(() => windowWidth.value < breakpoints.lg)
  const lgAndDown = computed(() => windowWidth.value < breakpoints.xl)

  // Current breakpoint name
  const current = computed(() => {
    if (xl.value) return 'xl'
    if (lg.value) return 'lg'
    if (md.value) return 'md'
    if (sm.value) return 'sm'
    return 'xs'
  })

  // Update window dimensions
  const updateSize = () => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  // Device detection
  const isMobile = computed(() => {
    const userAgent = navigator.userAgent || ''
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  })

  const isTablet = computed(() => {
    const userAgent = navigator.userAgent || ''
    return /iPad|Android(?!.*Mobile)/i.test(userAgent) && windowWidth.value >= breakpoints.md
  })

  const isDesktop = computed(() => {
    return !isMobile.value && !isTablet.value
  })

  // Touch device detection
  const isTouchDevice = computed(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })

  // Orientation
  const orientation = computed(() => {
    return windowWidth.value > windowHeight.value ? 'landscape' : 'portrait'
  })

  // Safe area support (for devices with notches)
  const safeAreaTop = ref(0)
  const safeAreaBottom = ref(0)

  const updateSafeArea = () => {
    const computedStyle = getComputedStyle(document.documentElement)
    safeAreaTop.value = parseInt(computedStyle.getPropertyValue('--sat') || '0')
    safeAreaBottom.value = parseInt(computedStyle.getPropertyValue('--sab') || '0')
  }

  onMounted(() => {
    updateSize()
    updateSafeArea()
    window.addEventListener('resize', updateSize)
    window.addEventListener('orientationchange', () => {
      setTimeout(updateSize, 100) // Delay to ensure orientation change is complete
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
  })

  return {
    // Window dimensions
    windowWidth,
    windowHeight,
    
    // Breakpoint booleans
    xs,
    sm,
    md,
    lg,
    xl,
    
    // Convenience booleans
    mobile,
    tablet,
    desktop,
    touch,
    
    // Range booleans
    smAndUp,
    mdAndUp,
    lgAndUp,
    smAndDown,
    mdAndDown,
    lgAndDown,
    
    // Current breakpoint
    current,
    
    // Device detection
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    
    // Orientation
    orientation,
    
    // Safe area
    safeAreaTop,
    safeAreaBottom,
    
    // Raw breakpoints
    breakpoints
  }
}
