<template>
  <v-card 
    class="love-quote-widget cardLift"
    elevation="0"
    :height="height"
  >
    <v-card-text class="quote-content pa-6 d-flex flex-column justify-center text-center">
      <!-- Quote Icon -->
      <div class="quote-header mb-4">
        <div class="quote-icon-wrapper magicalGlow">
          <v-icon 
            class="quote-icon sparkle"
            size="32" 
            color="primary"
          >
            mdi-format-quote-open
          </v-icon>
        </div>
        <h3 class="quote-title text-h6 font-weight-bold">Daily Love Quote</h3>
      </div>

      <!-- Quote Text -->
      <div class="quote-text-wrapper slideInUp mb-4">
        <transition name="fade" mode="out-in">
          <p 
            :key="currentQuote.id"
            class="quote-text font-script mb-3"
          >
            "{{ currentQuote.text }}"
          </p>
        </transition>
        
        <p class="quote-author text-body-2 text-medium-emphasis">
          — {{ currentQuote.author }}
        </p>
      </div>

      <!-- Category Badge -->
      <div class="mb-4">
        <v-chip 
          :color="chipColor"
          variant="tonal"
          size="small"
          rounded="lg"
          class="font-weight-medium"
        >
          <v-icon start size="16">{{ currentQuote.icon }}</v-icon>
          {{ currentQuote.category }}
        </v-chip>
      </div>

      <!-- Action Buttons -->
      <div class="quote-actions slideInUp" style="animation-delay: 0.2s;">
        <v-btn
          variant="text"
          size="small"
          rounded="lg"
          :color="buttonColor"
          class="refresh-btn loveClick mr-2"
          @click="refreshQuote"
          :loading="isRefreshing"
        >
          <v-icon start size="20">mdi-refresh</v-icon>
          New Quote
        </v-btn>
        
        <v-btn
          variant="text"
          size="small"
          rounded="lg"
          :color="buttonColor"
          class="share-btn loveClick"
          @click="shareQuote"
        >
          <v-icon start size="20">mdi-heart</v-icon>
          Love This
        </v-btn>
      </div>

      <!-- Floating Hearts -->
      <div class="floating-hearts" v-if="showHearts">
        <div class="heart heart-1 confettiFall">💕</div>
        <div class="heart heart-2 confettiFall">💖</div>
        <div class="heart heart-3 confettiFall">💝</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'

// Props
interface Props {
  height?: string | number
  autoRefresh?: boolean
  refreshInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 280,
  autoRefresh: true,
  refreshInterval: 60000 // 1 minute
})

// Emits
defineEmits<{
  quoteChanged: [quote: LoveQuote]
  quoteLiked: [quote: LoveQuote]
}>()

// Types
interface LoveQuote {
  id: number
  text: string
  author: string
  category: string
  icon: string
}

// Vuetify theme
const theme = useTheme()

// Refs
const currentQuoteIndex = ref(0)
const showHearts = ref(false)
const autoRefreshTimer = ref<number | null>(null)
const isRefreshing = ref(false)

// Love Quotes Database
const loveQuotes: LoveQuote[] = [
  {
    id: 1,
    text: "Tình yêu không chỉ là nhìn vào nhau, mà là cùng nhau nhìn về một hướng",
    author: "Antoine de Saint-Exupéry",
    category: "Tình yêu",
    icon: "mdi-heart"
  },
  {
    id: 2,
    text: "Trong tình yêu, điều quan trọng không phải là hạnh phúc mà là sự tin tưởng",
    author: "Trích dẫn",
    category: "Tin tưởng",
    icon: "mdi-handshake"
  },
  {
    id: 3,
    text: "Yêu nhau không phải là nhìn vào mắt nhau, mà là cùng nhau nhìn về phía trước",
    author: "Khuyết danh",
    category: "Tương lai",
    icon: "mdi-road-variant"
  },
  {
    id: 4,
    text: "Tình yêu chân thật không bao giờ có kết thúc",
    author: "Khuyết danh",
    category: "Vĩnh cửu",
    icon: "mdi-infinity"
  },
  {
    id: 5,
    text: "Mỗi ngày yêu em là một ngày hạnh phúc nhất của anh",
    author: "Lời yêu thương",
    category: "Hạnh phúc",
    icon: "mdi-emoticon-happy"
  },
  {
    id: 6,
    text: "Em là ánh sáng trong đêm tối, là niềm vui trong buồn phiền",
    author: "Thơ tình",
    category: "Ánh sáng",
    icon: "mdi-lightbulb"
  },
  {
    id: 7,
    text: "Tình yêu là khi sự hiện diện của ai đó mang lại sự yên bình cho bạn",
    author: "Khuyết danh",
    category: "Yên bình",
    icon: "mdi-peace"
  },
  {
    id: 8,
    text: "Yêu thương là nghệ thuật tạo ra hạnh phúc cho người khác",
    author: "Trích dẫn",
    category: "Nghệ thuật",
    icon: "mdi-palette"
  },
  {
    id: 9,
    text: "Trong tình yêu, hai trái tim đập chung một nhịp",
    author: "Lời tình",
    category: "Đồng điệu",
    icon: "mdi-music-note"
  },
  {
    id: 10,
    text: "Tình yêu là món quà đẹp nhất mà cuộc sống ban tặng",
    author: "Khuyết danh",
    category: "Món quà",
    icon: "mdi-gift"
  }
]

// Computed
const currentQuote = computed(() => loveQuotes[currentQuoteIndex.value])

const iconColor = computed(() => {
  return theme.current.value.colors.primary
})

const chipColor = computed(() => {
  return theme.current.value.colors.secondary
})

const buttonColor = computed(() => {
  return theme.current.value.colors.primary
})

// Methods
const refreshQuote = async () => {
  isRefreshing.value = true
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let newIndex
  do {
    newIndex = Math.floor(Math.random() * loveQuotes.length)
  } while (newIndex === currentQuoteIndex.value && loveQuotes.length > 1)
  
  currentQuoteIndex.value = newIndex
  isRefreshing.value = false
}

const shareQuote = () => {
  showHearts.value = true
  setTimeout(() => {
    showHearts.value = false
  }, 2000)
  
  // Emit liked event
  // emit('quoteLiked', currentQuote.value)
}

const getRandomQuote = () => {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  return dayOfYear % loveQuotes.length
}

const startAutoRefresh = () => {
  if (props.autoRefresh) {
    autoRefreshTimer.value = setInterval(() => {
      refreshQuote()
    }, props.refreshInterval)
  }
}

const stopAutoRefresh = () => {
  if (autoRefreshTimer.value) {
    clearInterval(autoRefreshTimer.value)
    autoRefreshTimer.value = null
  }
}

// Lifecycle
onMounted(() => {
  // Set quote based on day of year for consistency
  currentQuoteIndex.value = getRandomQuote()
  
  // Start auto refresh if enabled
  startAutoRefresh()
})
</script>

<style scoped>
.love-quote-widget {
  transition: all 0.3s ease;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border: 1px solid rgba(var(--primary-rgb), 0.1);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.quote-content {
  padding: 32px 28px;
  position: relative;
}

/* Quote Header */
.quote-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.quote-icon-wrapper {
  width: 56px;
  height: 56px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.3);
}

.quote-icon {
  color: white !important;
}

.quote-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* Quote Text */
.quote-text-wrapper {
  margin-bottom: 28px;
}

.quote-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-primary);
  font-style: italic;
  margin-bottom: 12px;
  font-weight: 500;
}

.quote-author {
  font-size: 0.95rem;
  color: var(--text-secondary);
  text-align: right;
  margin: 0;
  font-weight: 600;
}

/* Quote Actions */
.quote-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.refresh-btn,
.share-btn {
  text-transform: none;
  font-weight: 600;
  border-radius: 16px;
  padding: 8px 20px;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(var(--primary-rgb), 0.1) !important;
}

.share-btn:hover {
  background: rgba(var(--secondary-rgb), 0.1) !important;
}

/* Floating Hearts */
.floating-hearts {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.heart {
  position: absolute;
  font-size: 20px;
  opacity: 0.8;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}

.heart-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.heart-2 {
  top: 30%;
  right: 20%;
  animation-delay: 0.3s;
}

.heart-3 {
  top: 60%;
  left: 50%;
  animation-delay: 0.6s;
}

/* Card Hover Effect */
.love-card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.15);
}

/* Animations */
.animate-gentle-pulse {
  animation: gentlePulse 3s ease-in-out infinite;
}

.animate-romantic-fade-in {
  animation: romanticFadeIn 0.8s ease-out;
}

.animate-heart-float {
  animation: heartFloatSmall 1.5s ease-out;
}

/* Transition for quote change */
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Keyframes */
@keyframes gentlePulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes romanticFadeIn {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heartFloatSmall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-30px) rotate(360deg);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .quote-content {
    padding: 24px 20px;
  }
  
  .quote-header {
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .quote-icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .quote-title {
    font-size: 1.125rem;
  }
  
  .quote-text {
    font-size: 1rem;
  }
  
  .quote-actions {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}

/* Dark mode adjustments */
.v-theme--dark .love-quote-widget {
  background: linear-gradient(145deg, rgba(30, 30, 30, 0.9), rgba(40, 40, 40, 0.9));
}
</style>
