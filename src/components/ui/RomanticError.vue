<template>
  <div class="romantic-error" :class="[`error-${type}`, { 'fullscreen': fullscreen }]">
    <!-- Background Elements -->
    <div class="error-background">
      <div class="floating-element" v-for="n in 6" :key="n" :style="getElementStyle(n)">
        {{ getBackgroundIcon() }}
      </div>
    </div>

    <!-- Error Content -->
    <div class="error-content">
      <!-- Error Icon -->
      <div class="error-icon">
        <v-icon 
          :icon="errorIcon"
          :size="iconSize"
          :color="iconColor"
          :class="animationClass"
        />
      </div>

      <!-- Error Title -->
      <h2 class="error-title fadeInDelay">
        {{ errorTitle }}
      </h2>

      <!-- Error Message -->
      <p class="error-message fadeInDelay">
        {{ errorMessage }}
      </p>

      <!-- Error Details (if provided) -->
      <div v-if="details" class="error-details">
        <v-btn
          variant="text"
          size="small"
          @click="showDetails = !showDetails"
          class="details-toggle"
        >
          <v-icon :icon="showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'" start />
          {{ showDetails ? 'Hide Details' : 'Show Details' }}
        </v-btn>
        
        <v-expand-transition>
          <div v-show="showDetails" class="details-content">
            <pre class="error-code">{{ details }}</pre>
          </div>
        </v-expand-transition>
      </div>

      <!-- Action Buttons -->
      <div class="error-actions">
        <v-btn
          v-if="showRetry"
          :color="primaryColor"
          variant="elevated"
          size="large"
          @click="handleRetry"
          class="action-btn loveClick"
        >
          <v-icon icon="mdi-refresh" start />
          {{ retryText }}
        </v-btn>

        <v-btn
          v-if="showHome"
          variant="outlined"
          :color="primaryColor"
          size="large"
          @click="handleHome"
          class="action-btn ml-3"
        >
          <v-icon icon="mdi-home" start />
          {{ homeText }}
        </v-btn>

        <v-btn
          v-if="showSupport"
          variant="text"
          color="info"
          size="large"
          @click="handleSupport"
          class="action-btn ml-3"
        >
          <v-icon icon="mdi-help-circle" start />
          Get Help
        </v-btn>
      </div>

      <!-- Romantic Quote for Comfort -->
      <div v-if="showQuote" class="comfort-quote">
        <v-icon icon="mdi-format-quote-open" size="16" color="primary" class="quote-icon" />
        <p class="quote-text magicalGlow">{{ randomQuote }}</p>
        <v-icon icon="mdi-format-quote-close" size="16" color="primary" class="quote-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

type ErrorType = 'network' | 'notFound' | 'server' | 'permission' | 'validation' | 'unknown'

interface Props {
  type?: ErrorType
  title?: string
  message?: string
  details?: string
  fullscreen?: boolean
  showRetry?: boolean
  showHome?: boolean
  showSupport?: boolean
  showQuote?: boolean
  retryText?: string
  homeText?: string
  iconSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'unknown',
  fullscreen: false,
  showRetry: true,
  showHome: true,
  showSupport: false,
  showQuote: true,
  retryText: 'Try Again',
  homeText: 'Go Home',
  iconSize: 64
})

const emit = defineEmits<{
  'retry': []
  'home': []
  'support': []
}>()

const router = useRouter()
const showDetails = ref(false)

// Error configurations
const errorConfigs = {
  network: {
    icon: 'mdi-wifi-off',
    title: 'Connection Lost',
    message: 'Unable to connect to our servers. Please check your internet connection.',
    color: 'orange',
    animation: 'softWobble',
    background: '🌐'
  },
  notFound: {
    icon: 'mdi-heart-broken',
    title: 'Page Not Found',
    message: 'The page you\'re looking for seems to have disappeared into thin air.',
    color: 'pink',
    animation: 'heartBeat',
    background: '💔'
  },
  server: {
    icon: 'mdi-server-off',
    title: 'Server Error',
    message: 'Our servers are having a moment. We\'re working to fix this quickly.',
    color: 'red',
    animation: 'magicalGlow',
    background: '⚡'
  },
  permission: {
    icon: 'mdi-lock',
    title: 'Access Denied',
    message: 'You don\'t have permission to access this resource.',
    color: 'warning',
    animation: 'softWobble',
    background: '🔒'
  },
  validation: {
    icon: 'mdi-alert-circle',
    title: 'Invalid Data',
    message: 'The information provided is not valid. Please check and try again.',
    color: 'warning',
    animation: 'sparkle',
    background: '⚠️'
  },
  unknown: {
    icon: 'mdi-help-circle',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    color: 'grey',
    animation: 'fadeInDelay',
    background: '❓'
  }
}

// Comfort quotes for romantic touch
const comfortQuotes = [
  "Even in errors, love finds a way 💕",
  "Every mistake is a step toward perfection 🌹",
  "Love is patient, even with technology ✨",
  "Together we can overcome any challenge 💖",
  "Sometimes the best stories come from unexpected detours 🎵",
  "Love means never having to say 'Error 404' 💝"
]

const currentConfig = computed(() => errorConfigs[props.type])

const errorIcon = computed(() => props.title ? currentConfig.value.icon : currentConfig.value.icon)
const errorTitle = computed(() => props.title || currentConfig.value.title)
const errorMessage = computed(() => props.message || currentConfig.value.message)
const iconColor = computed(() => currentConfig.value.color)
const primaryColor = computed(() => currentConfig.value.color)
const animationClass = computed(() => currentConfig.value.animation)

const randomQuote = ref('')

const getBackgroundIcon = () => currentConfig.value.background

const getElementStyle = (index: number) => {
  const positions = [
    { left: '15%', top: '20%', animationDelay: '0s' },
    { left: '25%', top: '70%', animationDelay: '0.5s' },
    { left: '45%', top: '15%', animationDelay: '1s' },
    { left: '65%', top: '60%', animationDelay: '1.5s' },
    { left: '75%', top: '25%', animationDelay: '0.8s' },
    { left: '85%', top: '75%', animationDelay: '0.3s' }
  ]
  return positions[index - 1] || { left: '50%', top: '50%', animationDelay: '0s' }
}

const handleRetry = () => {
  emit('retry')
}

const handleHome = () => {
  emit('home')
  router.push('/dashboard')
}

const handleSupport = () => {
  emit('support')
  // Could open support dialog or navigate to help page
}

onMounted(() => {
  // Select random comfort quote
  randomQuote.value = comfortQuotes[Math.floor(Math.random() * comfortQuotes.length)]
})
</script>

<style scoped lang="scss">
.romantic-error {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
      135deg,
      rgba(255, 245, 245, 0.95) 0%,
      rgba(255, 235, 235, 0.95) 100%
    );
    backdrop-filter: blur(10px);
    z-index: 9999;
  }

  .error-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;

    .floating-element {
      position: absolute;
      font-size: 2rem;
      opacity: 0.1;
      animation: gentleFloat 6s infinite ease-in-out;
    }
  }

  .error-content {
    position: relative;
    z-index: 2;
    max-width: 500px;
    width: 100%;

    .error-icon {
      margin-bottom: 1.5rem;
    }

    .error-title {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: rgb(var(--v-theme-on-surface));
      font-family: 'Dancing Script', cursive;
    }

    .error-message {
      font-size: 1.1rem;
      color: rgb(var(--v-theme-on-surface-variant));
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .error-details {
      margin-bottom: 2rem;

      .details-toggle {
        margin-bottom: 1rem;
      }

      .details-content {
        .error-code {
          background: rgba(var(--v-theme-surface-variant), 0.3);
          border: 1px solid rgba(var(--v-theme-outline), 0.2);
          border-radius: 8px;
          padding: 1rem;
          font-size: 0.875rem;
          color: rgb(var(--v-theme-on-surface-variant));
          text-align: left;
          overflow-x: auto;
          white-space: pre-wrap;
        }
      }
    }

    .error-actions {
      margin-bottom: 2rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;

      .action-btn {
        border-radius: 25px;
        min-width: 120px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(var(--v-theme-primary-rgb), 0.2);
        }
      }
    }

    .comfort-quote {
      padding: 1.5rem;
      background: linear-gradient(
        135deg,
        rgba(var(--v-theme-primary-rgb), 0.05) 0%,
        rgba(var(--v-theme-secondary-rgb), 0.05) 100%
      );
      border-radius: 16px;
      border: 1px solid rgba(var(--v-theme-primary-rgb), 0.1);
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .quote-text {
        font-style: italic;
        color: rgb(var(--v-theme-primary));
        margin: 0;
        flex: 1;
      }

      .quote-icon {
        opacity: 0.6;
      }
    }
  }

  /* Error type specific styles */
  &.error-network {
    .error-content {
      .error-title {
        color: rgb(var(--v-theme-warning));
      }
    }
  }

  &.error-notFound {
    .error-content {
      .error-title {
        color: rgb(var(--v-theme-pink));
      }
    }
  }

  &.error-server {
    .error-content {
      .error-title {
        color: rgb(var(--v-theme-error));
      }
    }
  }
}

/* Animations */
@keyframes gentleFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(5deg);
  }
  66% {
    transform: translateY(5px) rotate(-3deg);
  }
}

/* Dark mode */
.v-theme--dark {
  .romantic-error {
    &.fullscreen {
      background: linear-gradient(
        135deg,
        rgba(30, 30, 30, 0.95) 0%,
        rgba(20, 20, 20, 0.95) 100%
      );
    }

    .error-content {
      .error-details {
        .details-content {
          .error-code {
            background: rgba(var(--v-theme-surface), 0.5);
          }
        }
      }
    }
  }
}

/* Responsive */
@media (max-width: 600px) {
  .romantic-error {
    padding: 1rem;

    .error-content {
      .error-title {
        font-size: 1.5rem;
      }

      .error-message {
        font-size: 1rem;
      }

      .error-actions {
        flex-direction: column;
        align-items: center;

        .action-btn {
          width: 100%;
          max-width: 200px;
        }
      }
    }
  }
}
</style>
