<template>
  <div class="romantic-loading" :class="{ 'fullscreen': fullscreen }">
    <!-- Background Hearts -->
    <div class="hearts-background">
      <div class="floating-heart" v-for="n in 8" :key="n" :style="getHeartStyle(n)">
        💕
      </div>
    </div>

    <!-- Main Loading Content -->
    <div class="loading-content">
      <!-- Love Logo -->
      <div class="love-logo">
        <v-icon 
          icon="mdi-heart"
          :size="size === 'large' ? 64 : size === 'medium' ? 48 : 32"
          :color="logoColor"
          class="heartBeat"
        />
      </div>

      <!-- Loading Message -->
      <div class="loading-message">
        <h3 v-if="showTitle" class="loading-title fadeInDelay">
          {{ title || 'Loading Your Love Story...' }}
        </h3>
        <p v-if="message" class="loading-subtitle fadeInDelay">
          {{ message }}
        </p>
      </div>

      <!-- Progress Indicator -->
      <div v-if="showProgress" class="progress-section">
        <!-- Love Progress Bar -->
        <div class="love-progress-container">
          <div class="progress-track">
            <div 
              class="progress-fill"
              :style="{ width: `${progress}%` }"
            />
            <div class="progress-heart" :style="{ left: `${progress}%` }">
              ❤️
            </div>
          </div>
        </div>
        
        <!-- Progress Text -->
        <div v-if="showPercentage" class="progress-text">
          {{ Math.round(progress) }}%
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-else class="spinner-section">
        <v-progress-circular
          :size="size === 'large' ? 48 : size === 'medium' ? 36 : 24"
          :width="3"
          :color="spinnerColor"
          indeterminate
          class="romantic-spinner"
        />
      </div>

      <!-- Loading Tips -->
      <div v-if="showTips" class="loading-tips">
        <p class="tip-text magicalGlow">
          💡 {{ currentTip }}
        </p>
      </div>
    </div>

    <!-- Overlay for fullscreen -->
    <div v-if="fullscreen" class="loading-overlay" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTheme } from 'vuetify'

interface Props {
  size?: 'small' | 'medium' | 'large'
  title?: string
  message?: string
  progress?: number
  showProgress?: boolean
  showPercentage?: boolean
  showTitle?: boolean
  showTips?: boolean
  fullscreen?: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  progress: 0,
  showProgress: false,
  showPercentage: true,
  showTitle: true,
  showTips: false,
  fullscreen: false,
  color: 'primary'
})

const theme = useTheme()
const currentTipIndex = ref(0)

// Love-themed loading tips
const loadingTips = [
  "💕 Love is in the details...",
  "🌹 Creating beautiful memories...",
  "💖 Preparing your romantic experience...",
  "✨ Sprinkling some magic...",
  "🎵 Setting the perfect mood...",
  "💝 Almost ready for you...",
  "🌟 Making everything perfect...",
  "💞 Loading with love..."
]

const currentTip = computed(() => loadingTips[currentTipIndex.value])

const logoColor = computed(() => 
  props.color === 'primary' ? theme.current.value.colors.primary : props.color
)

const spinnerColor = computed(() => 
  props.color === 'primary' ? 'primary' : props.color
)

// Generate random heart positions
const getHeartStyle = (index: number) => {
  const positions = [
    { left: '10%', animationDelay: '0s' },
    { left: '20%', animationDelay: '0.5s' },
    { left: '30%', animationDelay: '1s' },
    { left: '40%', animationDelay: '1.5s' },
    { left: '50%', animationDelay: '0.8s' },
    { left: '60%', animationDelay: '0.3s' },
    { left: '70%', animationDelay: '1.2s' },
    { left: '80%', animationDelay: '0.7s' }
  ]
  return positions[index - 1] || { left: '50%', animationDelay: '0s' }
}

// Rotate tips if enabled
let tipInterval: number | null = null

onMounted(() => {
  if (props.showTips) {
    tipInterval = setInterval(() => {
      currentTipIndex.value = (currentTipIndex.value + 1) % loadingTips.length
    }, 3000) as unknown as number
  }
})

onUnmounted(() => {
  if (tipInterval) {
    clearInterval(tipInterval)
  }
})
</script>

<style scoped lang="scss">
.romantic-loading {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
      135deg,
      rgba(255, 192, 203, 0.1) 0%,
      rgba(255, 182, 193, 0.1) 100%
    );
    z-index: 9999;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    z-index: -1;
  }

  .hearts-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;

    .floating-heart {
      position: absolute;
      font-size: 1.5rem;
      opacity: 0.3;
      animation: floatUp 4s infinite ease-in-out;
      z-index: 1;
    }
  }

  .loading-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 400px;

    .love-logo {
      margin-bottom: 1.5rem;
    }

    .loading-message {
      margin-bottom: 2rem;

      .loading-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: rgb(var(--v-theme-primary));
        margin-bottom: 0.5rem;
        font-family: 'Dancing Script', cursive;
      }

      .loading-subtitle {
        font-size: 1rem;
        color: rgb(var(--v-theme-on-surface-variant));
        opacity: 0.8;
      }
    }

    .progress-section {
      margin-bottom: 1.5rem;

      .love-progress-container {
        margin-bottom: 1rem;

        .progress-track {
          position: relative;
          width: 100%;
          height: 8px;
          background: rgba(var(--v-theme-primary), 0.1);
          border-radius: 20px;
          overflow: hidden;

          .progress-fill {
            height: 100%;
            background: linear-gradient(
              90deg,
              rgb(var(--v-theme-primary)) 0%,
              rgb(var(--v-theme-secondary)) 100%
            );
            border-radius: 20px;
            transition: width 0.3s ease;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              width: 20px;
              height: 100%;
              background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.4) 50%,
                transparent 100%
              );
              animation: shimmer 2s infinite;
            }
          }

          .progress-heart {
            position: absolute;
            top: -6px;
            transform: translateX(-50%);
            font-size: 1.2rem;
            transition: left 0.3s ease;
            animation: bounce 1s infinite;
          }
        }
      }

      .progress-text {
        font-size: 0.9rem;
        font-weight: 600;
        color: rgb(var(--v-theme-primary));
      }
    }

    .spinner-section {
      margin-bottom: 1.5rem;

      .romantic-spinner {
        filter: drop-shadow(0 0 10px rgba(var(--v-theme-primary-rgb), 0.3));
      }
    }

    .loading-tips {
      .tip-text {
        font-size: 0.875rem;
        color: rgb(var(--v-theme-on-surface-variant));
        font-style: italic;
        margin: 0;
        opacity: 0.8;
      }
    }
  }
}

/* Animations */
@keyframes floatUp {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-20px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-4px);
  }
}

/* Dark mode */
.v-theme--dark {
  .romantic-loading {
    &.fullscreen {
      background: linear-gradient(
        135deg,
        rgba(30, 30, 30, 0.95) 0%,
        rgba(20, 20, 20, 0.95) 100%
      );
    }

    .loading-overlay {
      background: rgba(30, 30, 30, 0.9);
    }
  }
}

/* Responsive */
@media (max-width: 600px) {
  .romantic-loading {
    padding: 1rem;

    .loading-content {
      .loading-message {
        .loading-title {
          font-size: 1.25rem;
        }

        .loading-subtitle {
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style>
