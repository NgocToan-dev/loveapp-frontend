import { ref, onMounted, onUnmounted, computed } from 'vue'

interface PerformanceMetrics {
  fps: number
  memory: number
  loadTime: number
  renderTime: number
}

export function usePerformanceMonitor() {
  const metrics = ref<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    loadTime: 0,
    renderTime: 0
  })

  const isMonitoring = ref(false)
  let animationId: number | null = null
  let lastTime = 0
  let frameCount = 0

  // FPS Monitoring
  const measureFPS = (currentTime: number) => {
    frameCount++
    
    if (currentTime >= lastTime + 1000) {
      metrics.value.fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
      frameCount = 0
      lastTime = currentTime
    }

    if (isMonitoring.value) {
      animationId = requestAnimationFrame(measureFPS)
    }
  }

  // Memory Usage (if available)
  const measureMemory = () => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory
      metrics.value.memory = Math.round(memInfo.usedJSHeapSize / 1048576) // Convert to MB
    }
  }
  // Page Load Time
  const measureLoadTime = () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (perfData) {
      metrics.value.loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart)
    }
  }

  // Component Render Time
  const measureRenderTime = () => {
    const paintEntries = performance.getEntriesByType('paint')
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    if (fcp) {
      metrics.value.renderTime = Math.round(fcp.startTime)
    }
  }

  const startMonitoring = () => {
    isMonitoring.value = true
    lastTime = performance.now()
    animationId = requestAnimationFrame(measureFPS)
    
    // Measure other metrics
    measureMemory()
    measureLoadTime()
    measureRenderTime()

    // Update memory periodically
    const memoryInterval = setInterval(() => {
      if (isMonitoring.value) {
        measureMemory()
      } else {
        clearInterval(memoryInterval)
      }
    }, 2000)
  }

  const stopMonitoring = () => {
    isMonitoring.value = false
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  // Auto-start on mount, stop on unmount
  onMounted(() => {
    startMonitoring()
  })

  onUnmounted(() => {
    stopMonitoring()
  })

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring
  }
}

// Image Lazy Loading Utility
export function useLazyLoad() {
  const observer = ref<IntersectionObserver | null>(null)
  const loadedImages = ref(new Set<string>())

  const initObserver = () => {
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src
            
            if (src && !loadedImages.value.has(src)) {
              img.src = src
              img.classList.remove('lazy-loading')
              img.classList.add('lazy-loaded')
              loadedImages.value.add(src)
              observer.value?.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    )
  }

  const observeImage = (img: HTMLImageElement) => {
    if (!observer.value) initObserver()
    img.classList.add('lazy-loading')
    observer.value?.observe(img)
  }

  const unobserveImage = (img: HTMLImageElement) => {
    observer.value?.unobserve(img)
  }

  onMounted(() => {
    initObserver()
  })

  onUnmounted(() => {
    observer.value?.disconnect()
  })

  return {
    observeImage,
    unobserveImage,
    loadedImages
  }
}

// Virtual Scrolling for Large Lists
export function useVirtualScroll(itemHeight: number, visibleCount: number) {
  const scrollTop = ref(0)
  const containerHeight = ref(0)
  const totalItems = ref(0)

  const visibleItems = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    const end = Math.min(start + visibleCount, totalItems.value)
    return { start, end }
  })

  const totalHeight = computed(() => totalItems.value * itemHeight)

  const offsetY = computed(() => visibleItems.value.start * itemHeight)

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  return {
    scrollTop,
    containerHeight,
    totalItems,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  }
}

// Resource Preloader
export function useResourcePreloader() {
  const loadedResources = ref(new Set<string>())
  const loadingResources = ref(new Set<string>())
  const failedResources = ref(new Set<string>())

  const preloadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (loadedResources.value.has(src)) {
        resolve(new Image()) // Return dummy image if already loaded
        return
      }

      if (loadingResources.value.has(src)) {
        // Already loading, wait for it
        const checkLoading = () => {
          if (loadedResources.value.has(src)) {
            resolve(new Image())
          } else if (failedResources.value.has(src)) {
            reject(new Error(`Failed to load ${src}`))
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
        return
      }

      loadingResources.value.add(src)
      
      const img = new Image()
      img.onload = () => {
        loadingResources.value.delete(src)
        loadedResources.value.add(src)
        resolve(img)
      }
      img.onerror = () => {
        loadingResources.value.delete(src)
        failedResources.value.add(src)
        reject(new Error(`Failed to load ${src}`))
      }
      img.src = src
    })
  }

  const preloadFont = (fontFamily: string, fontWeight = '400'): Promise<void> => {
    return new Promise((resolve, reject) => {
      const font = new FontFace(fontFamily, `url('/fonts/${fontFamily}.woff2')`, {
        weight: fontWeight
      })

      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont)
        loadedResources.value.add(fontFamily)
        resolve()
      }).catch((error) => {
        failedResources.value.add(fontFamily)
        reject(error)
      })
    })
  }

  const preloadMultiple = async (resources: string[]) => {
    const promises = resources.map(resource => {
      if (resource.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        return preloadImage(resource)
      }
      return Promise.resolve()
    })

    try {
      await Promise.allSettled(promises)
    } catch (error) {
      console.warn('Some resources failed to preload:', error)
    }
  }

  return {
    loadedResources,
    loadingResources,
    failedResources,
    preloadImage,
    preloadFont,
    preloadMultiple
  }
}

// Component Memoization Helper
export function useMemoization<T>(fn: () => T, deps: any[]) {
  const cache = ref(new Map<string, any>())
  
  const memoizedValue = computed(() => {
    const key = JSON.stringify(deps)
    
    if (cache.value.has(key)) {
      return cache.value.get(key) as T
    }
    
    const result = fn()
    cache.value.set(key, result)
    
    // Limit cache size to prevent memory leaks
    if (cache.value.size > 100) {
      const firstKey = cache.value.keys().next().value
      if (firstKey) {
        cache.value.delete(firstKey)
      }
    }
    
    return result
  })

  const clearCache = () => {
    cache.value.clear()
  }

  return {
    memoizedValue,
    clearCache
  }
}

// Bundle Size Analyzer (Development Only)
export function useBundleAnalyzer() {
  const analyzeImports = () => {
    if (import.meta.env.MODE !== 'development') return

    const modules = performance.getEntriesByType('resource')
    const jsModules = modules.filter(entry => 
      entry.name.includes('.js') || entry.name.includes('.ts')
    )

    const analysis = jsModules.map(module => ({
      name: module.name,
      size: (module as any).transferSize || 0,
      loadTime: module.duration
    }))

    console.table(analysis.sort((a, b) => b.size - a.size))
  }

  return {
    analyzeImports
  }
}
