<template>
  <v-card 
    v-if="showMonitor && isDevelopment" 
    class="performance-monitor"
    :class="{ 'monitor-minimal': minimal }"
    elevation="4"
  >
    <v-card-title v-if="!minimal" class="monitor-header">
      <v-icon icon="mdi-speedometer" class="mr-2" />
      Performance Monitor
      <v-spacer />
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        @click="$emit('close')"
      />
    </v-card-title>

    <v-card-text class="monitor-content" :class="{ 'pa-2': minimal }">
      <!-- FPS Counter -->
      <div class="metric-item">
        <div class="metric-label">
          <v-icon icon="mdi-play-speed" size="16" class="mr-1" />
          FPS
        </div>
        <div class="metric-value" :class="getFPSClass(metrics.fps)">
          {{ metrics.fps }}
        </div>
      </div>

      <!-- Memory Usage -->
      <div class="metric-item" v-if="metrics.memory > 0">
        <div class="metric-label">
          <v-icon icon="mdi-memory" size="16" class="mr-1" />
          Memory
        </div>
        <div class="metric-value" :class="getMemoryClass(metrics.memory)">
          {{ metrics.memory }}MB
        </div>
      </div>

      <!-- Load Time -->
      <div class="metric-item" v-if="metrics.loadTime > 0">
        <div class="metric-label">
          <v-icon icon="mdi-timer" size="16" class="mr-1" />
          Load
        </div>
        <div class="metric-value" :class="getLoadTimeClass(metrics.loadTime)">
          {{ metrics.loadTime }}ms
        </div>
      </div>

      <!-- Render Time -->
      <div class="metric-item" v-if="metrics.renderTime > 0">
        <div class="metric-label">
          <v-icon icon="mdi-brush" size="16" class="mr-1" />
          Render
        </div>
        <div class="metric-value" :class="getRenderTimeClass(metrics.renderTime)">
          {{ metrics.renderTime }}ms
        </div>
      </div>

      <!-- Network Status -->
      <div class="metric-item">
        <div class="metric-label">
          <v-icon :icon="networkIcon" size="16" class="mr-1" />
          Network
        </div>
        <div class="metric-value" :class="getNetworkClass()">
          {{ networkType }}
        </div>
      </div>

      <!-- Battery Status (if available) -->
      <div class="metric-item" v-if="batteryLevel !== null">
        <div class="metric-label">
          <v-icon :icon="batteryIcon" size="16" class="mr-1" />
          Battery
        </div>
        <div class="metric-value" :class="getBatteryClass()">
          {{ Math.round(batteryLevel * 100) }}%
        </div>
      </div>

      <!-- Toggle Controls -->
      <div v-if="!minimal" class="monitor-controls">
        <v-divider class="my-2" />
        <div class="d-flex align-center gap-2">
          <v-switch
            v-model="isMonitoring"
            label="Monitor"
            density="compact"
            hide-details
            @update:model-value="toggleMonitoring"
          />
          <v-btn
            size="small"
            variant="text"
            @click="resetMetrics"
          >
            Reset
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <!-- Floating Mini Monitor -->
  <div 
    v-else-if="showMonitor && minimal" 
    class="mini-monitor"
    @click="$emit('expand')"
  >
    <div class="mini-fps" :class="getFPSClass(metrics.fps)">
      {{ metrics.fps }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePerformanceMonitor } from '@/composables/usePerformance'

interface Props {
  showMonitor?: boolean
  minimal?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const props = withDefaults(defineProps<Props>(), {
  showMonitor: false,
  minimal: false,
  position: 'bottom-right'
})

const emit = defineEmits<{
  'close': []
  'expand': []
}>()

const { metrics, isMonitoring, startMonitoring, stopMonitoring } = usePerformanceMonitor()

// Development check
const isDevelopment = computed(() => import.meta.env.MODE === 'development')

// Network monitoring
const networkType = ref('Unknown')
const networkIcon = ref('mdi-wifi')

// Battery monitoring
const batteryLevel = ref<number | null>(null)
const batteryCharging = ref(false)

const batteryIcon = computed(() => {
  if (batteryLevel.value === null) return 'mdi-battery-unknown'
  
  const level = batteryLevel.value * 100
  if (batteryCharging.value) return 'mdi-battery-charging'
  
  if (level > 80) return 'mdi-battery'
  if (level > 60) return 'mdi-battery-80'
  if (level > 40) return 'mdi-battery-60'
  if (level > 20) return 'mdi-battery-40'
  if (level > 10) return 'mdi-battery-20'
  return 'mdi-battery-outline'
})

// Performance thresholds and color classes
const getFPSClass = (fps: number) => {
  if (fps >= 55) return 'metric-excellent'
  if (fps >= 45) return 'metric-good'
  if (fps >= 30) return 'metric-warning'
  return 'metric-poor'
}

const getMemoryClass = (memory: number) => {
  if (memory < 50) return 'metric-excellent'
  if (memory < 100) return 'metric-good'
  if (memory < 200) return 'metric-warning'
  return 'metric-poor'
}

const getLoadTimeClass = (loadTime: number) => {
  if (loadTime < 1000) return 'metric-excellent'
  if (loadTime < 2000) return 'metric-good'
  if (loadTime < 5000) return 'metric-warning'
  return 'metric-poor'
}

const getRenderTimeClass = (renderTime: number) => {
  if (renderTime < 100) return 'metric-excellent'
  if (renderTime < 300) return 'metric-good'
  if (renderTime < 1000) return 'metric-warning'
  return 'metric-poor'
}

const getNetworkClass = () => {
  if (networkType.value.includes('4g') || networkType.value.includes('wifi')) return 'metric-excellent'
  if (networkType.value.includes('3g')) return 'metric-good'
  if (networkType.value.includes('2g')) return 'metric-warning'
  return 'metric-poor'
}

const getBatteryClass = () => {
  if (batteryLevel.value === null) return 'metric-unknown'
  const level = batteryLevel.value * 100
  if (level > 50) return 'metric-excellent'
  if (level > 20) return 'metric-good'
  if (level > 10) return 'metric-warning'
  return 'metric-poor'
}

// Methods
const toggleMonitoring = (enabled: boolean | null) => {
  if (enabled) {
    startMonitoring()
  } else {
    stopMonitoring()
  }
}

const resetMetrics = () => {
  // Reset metrics by restarting monitoring
  stopMonitoring()
  setTimeout(() => {
    startMonitoring()
  }, 100)
}

// Initialize network and battery monitoring
const initDeviceMonitoring = async () => {
  // Network monitoring
  if ('connection' in navigator) {
    const connection = (navigator as any).connection
    networkType.value = connection.effectiveType || 'Unknown'
    
    const updateNetworkType = () => {
      networkType.value = connection.effectiveType || 'Unknown'
      networkIcon.value = connection.type === 'wifi' ? 'mdi-wifi' : 'mdi-signal-cellular-3'
    }
    
    connection.addEventListener('change', updateNetworkType)
  }

  // Battery monitoring
  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery()
      batteryLevel.value = battery.level
      batteryCharging.value = battery.charging
      
      const updateBattery = () => {
        batteryLevel.value = battery.level
        batteryCharging.value = battery.charging
      }
      
      battery.addEventListener('levelchange', updateBattery)
      battery.addEventListener('chargingchange', updateBattery)
    } catch (error) {
      console.warn('Battery API not available:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  if (isDevelopment.value && props.showMonitor) {
    initDeviceMonitoring()
    startMonitoring()
  }
})

onUnmounted(() => {
  stopMonitoring()
})

// Watch for showMonitor changes
watch(() => props.showMonitor, (show) => {
  if (show && isDevelopment.value) {
    startMonitoring()
  } else {
    stopMonitoring()
  }
})
</script>

<style scoped lang="scss">
.performance-monitor {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 220px;
  max-width: 280px;
  z-index: 9000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);

  &.monitor-minimal {
    min-width: 180px;
  }

  .monitor-header {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 8px 16px;
    background: rgba(var(--v-theme-primary), 0.1);
  }

  .monitor-content {
    padding: 12px 16px;

    .metric-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .metric-label {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        color: rgb(var(--v-theme-on-surface-variant));
        font-weight: 500;
      }

      .metric-value {
        font-size: 0.875rem;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 4px;
        min-width: 50px;
        text-align: center;

        &.metric-excellent {
          background: rgba(76, 175, 80, 0.1);
          color: #4CAF50;
        }

        &.metric-good {
          background: rgba(255, 193, 7, 0.1);
          color: #FFC107;
        }

        &.metric-warning {
          background: rgba(255, 152, 0, 0.1);
          color: #FF9800;
        }

        &.metric-poor {
          background: rgba(244, 67, 54, 0.1);
          color: #F44336;
        }

        &.metric-unknown {
          background: rgba(158, 158, 158, 0.1);
          color: #9E9E9E;
        }
      }
    }

    .monitor-controls {
      .v-switch {
        transform: scale(0.8);
      }
    }
  }
}

.mini-monitor {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.9);
  }

  .mini-fps {
    color: white;
    font-size: 0.875rem;
    font-weight: 600;

    &.metric-excellent {
      color: #4CAF50;
    }

    &.metric-good {
      color: #FFC107;
    }

    &.metric-warning {
      color: #FF9800;
    }

    &.metric-poor {
      color: #F44336;
    }
  }
}

/* Dark mode */
.v-theme--dark {
  .performance-monitor {
    background: rgba(30, 30, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* Position variants */
.performance-monitor.position-top-left {
  top: 20px;
  left: 20px;
  right: auto;
}

.performance-monitor.position-top-right {
  top: 20px;
  right: 20px;
}

.performance-monitor.position-bottom-left {
  bottom: 20px;
  left: 20px;
  top: auto;
  right: auto;
}

.performance-monitor.position-bottom-right {
  bottom: 20px;
  right: 20px;
  top: auto;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .performance-monitor {
    position: relative;
    top: 0;
    right: 0;
    width: 100%;
    max-width: none;
    margin-bottom: 1rem;
  }

  .mini-monitor {
    bottom: 80px; // Above bottom navigation
  }
}
</style>
