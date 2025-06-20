<template>
  <div class="app-splash" :class="{ 'splash-hide': !visible }">
    <!-- Background Gradient -->
    <div class="splash-background">
      <!-- Floating Hearts Background -->
      <div class="hearts-layer">
        <div 
          v-for="n in 12" 
          :key="n"
          class="floating-heart"
          :style="getHeartStyle(n)"
        >
          💕
        </div>
      </div>

      <!-- Sparkle Elements -->
      <div class="sparkles-layer">
        <div 
          v-for="n in 8"
          :key="n"
          class="sparkle"
          :style="getSparkleStyle(n)"
        >
          ✨
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="splash-content">
      <!-- App Logo -->
      <div class="app-logo">
        <div class="logo-container">
          <div class="logo-heart heartBeat">
            <v-icon
              icon="mdi-heart"
              size="80"
              color="white"
              class="main-heart"
            />
            <div class="heart-rings">
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- App Name -->
      <div class="app-name slideInUp">
        <h1 class="app-title">LoveApp</h1>
        <p class="app-subtitle">Where Love Stories Begin</p>
      </div>

      <!-- Loading Progress -->
      <div class="loading-section slideInUp">
        <div class="progress-container">
          <div class="progress-track">
            <div 
              class="progress-fill"
              :style="{ width: `${progress}%` }"
            />
            <div class="progress-heart" :style="{ left: `calc(${progress}% - 10px)` }">
              ❤️
            </div>
          </div>
        </div>
        
        <div class="loading-text">
          <p class="loading-message magicalGlow">{{ loadingMessage }}</p>
          <p v-if="showPercentage" class="loading-percentage">{{ Math.round(progress) }}%</p>
        </div>
      </div>

      <!-- App Version -->
      <div v-if="showVersion" class="app-version fadeInDelay">
        <p class="version-text">Version {{ version }}</p>
      </div>
    </div>

    <!-- Bottom Branding -->
    <div class="splash-footer fadeInDelay">
      <p class="copyright-text">
        Made with 💖 by LoveApp Team
      </p>
      <div class="social-links">
        <v-btn
          icon
          variant="text"
          size="small"
          color="white"
          class="social-btn"
        >
          <v-icon>mdi-instagram</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          size="small"
          color="white"
          class="social-btn"
        >
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          size="small"
          color="white"
          class="social-btn"
        >
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  visible?: boolean
  progress?: number
  showPercentage?: boolean
  showVersion?: boolean
  version?: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  progress: 0,
  showPercentage: true,
  showVersion: true,
  version: '1.0.0',
  duration: 3000
})

const emit = defineEmits<{
  'complete': []
}>()

const currentMessageIndex = ref(0)

// Loading messages that rotate
const loadingMessages = [
  "Preparing your love story...",
  "Loading beautiful memories...",
  "Setting up romantic vibes...",
  "Creating magical moments...",
  "Almost ready for love...",
  "Welcome to your journey..."
]

const loadingMessage = computed(() => loadingMessages[currentMessageIndex.value])

// Generate random heart positions and delays
const getHeartStyle = (index: number) => {
  const leftPositions = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 10, 90]
  const animationDelays = [0, 0.5, 1, 1.5, 2, 2.5, 3, 0.8, 1.2, 1.8, 2.2, 2.8]
  
  return {
    left: `${leftPositions[index - 1] || 50}%`,
    animationDelay: `${animationDelays[index - 1] || 0}s`,
    animationDuration: `${4 + Math.random() * 2}s`
  }
}

// Generate sparkle positions
const getSparkleStyle = (index: number) => {
  const positions = [
    { left: '20%', top: '25%' },
    { left: '80%', top: '15%' },
    { left: '15%', top: '70%' },
    { left: '85%', top: '65%' },
    { left: '45%', top: '20%' },
    { left: '60%', top: '75%' },
    { left: '25%', top: '45%' },
    { left: '75%', top: '40%' }
  ]
  
  const pos = positions[index - 1] || { left: '50%', top: '50%' }
  
  return {
    ...pos,
    animationDelay: `${index * 0.3}s`,
    animationDuration: `${2 + Math.random()}s`
  }
}

// Auto-advance loading messages
let messageInterval: number | null = null

onMounted(() => {
  // Rotate loading messages
  messageInterval = setInterval(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % loadingMessages.length
  }, 800) as unknown as number

  // Auto-complete after duration if no progress is tracked
  if (props.progress === 0) {
    setTimeout(() => {
      emit('complete')
    }, props.duration)
  }
})

// Watch for progress completion
watch(() => props.progress, (newProgress) => {
  if (newProgress >= 100) {
    setTimeout(() => {
      emit('complete')
    }, 500) // Small delay to show 100%
  }
})

// Cleanup interval
watch(() => props.visible, (isVisible) => {
  if (!isVisible && messageInterval) {
    clearInterval(messageInterval)
    messageInterval = null
  }
})
</script>

<style scoped lang="scss">
.app-splash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    #ff6b6b 0%,
    #ff8e8e 25%,
    #ffa8a8 50%,
    #ffb3ba 75%,
    #ffc0cb 100%
  );
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: scale(1);

  &.splash-hide {
    opacity: 0;
    transform: scale(1.05);
    pointer-events: none;
  }

  .splash-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .hearts-layer {
      .floating-heart {
        position: absolute;
        font-size: 1.5rem;
        opacity: 0.2;
        animation: heartFloat 4s infinite ease-in-out;
      }
    }

    .sparkles-layer {
      .sparkle {
        position: absolute;
        font-size: 1rem;
        opacity: 0.6;
        animation: sparkleFloat 2s infinite ease-in-out;
      }
    }
  }

  .splash-content {
    position: relative;
    z-index: 10;
    text-align: center;
    color: white;

    .app-logo {
      margin-bottom: 2rem;

      .logo-container {
        position: relative;
        display: inline-block;

        .logo-heart {
          position: relative;
          z-index: 2;

          .main-heart {
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
          }

          .heart-rings {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            .ring {
              position: absolute;
              border: 2px solid rgba(255, 255, 255, 0.3);
              border-radius: 50%;
              animation: pulseRing 2s infinite ease-out;

              &.ring-1 {
                width: 100px;
                height: 100px;
                margin: -50px 0 0 -50px;
                animation-delay: 0s;
              }

              &.ring-2 {
                width: 140px;
                height: 140px;
                margin: -70px 0 0 -70px;
                animation-delay: 0.7s;
              }

              &.ring-3 {
                width: 180px;
                height: 180px;
                margin: -90px 0 0 -90px;
                animation-delay: 1.4s;
              }
            }
          }
        }
      }
    }

    .app-name {
      margin-bottom: 3rem;

      .app-title {
        font-size: 3rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        font-family: 'Dancing Script', cursive;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        letter-spacing: 2px;
      }

      .app-subtitle {
        font-size: 1.2rem;
        margin: 0;
        opacity: 0.9;
        font-weight: 300;
        letter-spacing: 1px;
      }
    }

    .loading-section {
      margin-bottom: 2rem;
      min-width: 280px;

      .progress-container {
        margin-bottom: 1rem;

        .progress-track {
          position: relative;
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          overflow: hidden;

          .progress-fill {
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.7) 100%
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
                rgba(255, 255, 255, 0.5) 50%,
                transparent 100%
              );
              animation: shimmer 1.5s infinite;
            }
          }

          .progress-heart {
            position: absolute;
            top: -8px;
            font-size: 1.2rem;
            transition: left 0.3s ease;
          }
        }
      }

      .loading-text {
        .loading-message {
          font-size: 1rem;
          margin: 0 0 0.5rem 0;
          opacity: 0.9;
          min-height: 1.5rem;
        }

        .loading-percentage {
          font-size: 0.875rem;
          margin: 0;
          opacity: 0.7;
          font-weight: 600;
        }
      }
    }

    .app-version {
      .version-text {
        font-size: 0.875rem;
        opacity: 0.7;
        margin: 0;
      }
    }
  }

  .splash-footer {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: white;

    .copyright-text {
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .social-links {
      display: flex;
      gap: 0.5rem;
      justify-content: center;

      .social-btn {
        opacity: 0.7;
        transition: all 0.3s ease;

        &:hover {
          opacity: 1;
          transform: translateY(-2px);
        }
      }
    }
  }
}

/* Animations */
@keyframes heartFloat {
  0%, 100% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10%, 90% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes sparkleFloat {
  0%, 100% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1) rotate(180deg);
    opacity: 0.6;
  }
}

@keyframes pulseRing {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.2);
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

/* Responsive */
@media (max-width: 600px) {
  .app-splash {
    .splash-content {
      padding: 0 1rem;

      .app-name {
        .app-title {
          font-size: 2.5rem;
        }

        .app-subtitle {
          font-size: 1rem;
        }
      }

      .loading-section {
        min-width: 250px;
      }
    }
  }
}

@media (max-height: 600px) {
  .app-splash {
    .splash-content {
      .app-logo {
        margin-bottom: 1rem;

        .logo-heart {
          .main-heart {
            font-size: 60px !important;
          }
        }
      }

      .app-name {
        margin-bottom: 1.5rem;
      }
    }

    .splash-footer {
      bottom: 1rem;
    }
  }
}
</style>
