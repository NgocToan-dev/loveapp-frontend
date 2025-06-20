<template>
  <v-card 
    class="anniversary-countdown love-card-hover"
    rounded="xl"
    elevation="2"
    :height="height"
  >
    <v-card-text class="pa-6 d-flex flex-column justify-center">
      <!-- Header -->
      <div class="countdown-header text-center mb-4">
        <div class="anniversary-icon-container mb-3">
          <v-icon 
            size="48" 
            :color="iconColor"
            class="anniversary-icon animate-gentle-pulse"
          >
            mdi-calendar-heart
          </v-icon>
        </div>
        
        <h3 class="countdown-title font-heading text-h6 mb-2">
          {{ nextAnniversary.title }}
        </h3>
        
        <p class="countdown-subtitle text-body-2 text-medium-emphasis">
          {{ nextAnniversary.date }}
        </p>
      </div>

      <!-- Countdown Display -->
      <div class="countdown-display mb-4">
        <v-row no-gutters justify="center">
          <v-col cols="3" class="text-center">
            <div class="countdown-item">
              <div class="countdown-number font-heading text-h4" :style="{ color: numberColor }">
                {{ timeLeft.days }}
              </div>
              <div class="countdown-label text-caption text-medium-emphasis">
                Ngày
              </div>
            </div>
          </v-col>
          
          <v-col cols="3" class="text-center">
            <div class="countdown-item">
              <div class="countdown-number font-heading text-h4" :style="{ color: numberColor }">
                {{ timeLeft.hours }}
              </div>
              <div class="countdown-label text-caption text-medium-emphasis">
                Giờ
              </div>
            </div>
          </v-col>
          
          <v-col cols="3" class="text-center">
            <div class="countdown-item">
              <div class="countdown-number font-heading text-h4" :style="{ color: numberColor }">
                {{ timeLeft.minutes }}
              </div>
              <div class="countdown-label text-caption text-medium-emphasis">
                Phút
              </div>
            </div>
          </v-col>
          
          <v-col cols="3" class="text-center">
            <div class="countdown-item">
              <div class="countdown-number font-heading text-h4" :style="{ color: numberColor }">
                {{ timeLeft.seconds }}
              </div>
              <div class="countdown-label text-caption text-medium-emphasis">
                Giây
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Progress Bar -->
      <div class="countdown-progress mb-4">
        <v-progress-linear
          :model-value="progressPercentage"
          :color="progressColor"
          rounded
          height="8"
          class="mb-2"
        />
        <p class="text-center text-caption text-medium-emphasis">
          {{ progressText }}
        </p>
      </div>

      <!-- Actions -->
      <div class="countdown-actions text-center">
        <v-btn
          :color="buttonColor"
          variant="tonal"
          rounded="lg"
          size="small"
          class="mr-2"
          @click="viewAllAnniversaries"
        >
          <v-icon start size="18">mdi-calendar-multiple</v-icon>
          Tất cả kỷ niệm
        </v-btn>
        
        <v-btn
          :color="buttonColor"
          variant="outlined"
          rounded="lg"
          size="small"
          @click="createReminder"
        >
          <v-icon start size="18">mdi-bell-plus</v-icon>
          Nhắc nhở
        </v-btn>
      </div>

      <!-- Special Effect for Close Dates -->
      <div v-if="isCloseToAnniversary" class="special-effects">
        <div class="sparkle-container">
          <v-icon 
            v-for="n in 8" 
            :key="n"
            size="12" 
            color="amber" 
            class="sparkle animate-sparkle"
            :style="{ 
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDelay: `${n * 0.2}s`
            }"
          >
            mdi-star-four-points
          </v-icon>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTheme } from 'vuetify'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

// Props
interface Props {
  height?: string | number
  anniversaryDate?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 320,
  anniversaryDate: '2024-02-14' // Default Valentine's Day
})

// Emits
defineEmits<{
  viewAnniversaries: []
  createReminder: [anniversary: Anniversary]
}>()

// Types
interface Anniversary {
  title: string
  date: string
  originalDate: string
  type: 'monthly' | 'yearly' | 'custom'
}

interface TimeLeft {
  days: string
  hours: string
  minutes: string
  seconds: string
}

// Vuetify theme
const theme = useTheme()

// Refs
const currentTime = ref(dayjs())
const updateTimer = ref<number | null>(null)

// Computed
const iconColor = computed(() => theme.current.value.colors.primary)
const numberColor = computed(() => theme.current.value.colors.primary)
const progressColor = computed(() => theme.current.value.colors.secondary)
const buttonColor = computed(() => theme.current.value.colors.primary)

const nextAnniversary = computed((): Anniversary => {
  const now = dayjs()
  const originalDate = dayjs(props.anniversaryDate)
  
  // Calculate next monthly anniversary
  let nextMonth = now.date(originalDate.date())
  if (nextMonth.isBefore(now)) {
    nextMonth = nextMonth.add(1, 'month')
  }
  
  // Calculate next yearly anniversary
  let nextYear = now.year(now.year()).month(originalDate.month()).date(originalDate.date())
  if (nextYear.isBefore(now)) {
    nextYear = nextYear.add(1, 'year')
  }
  
  // Choose the closer one
  const monthDiff = nextMonth.diff(now)
  const yearDiff = nextYear.diff(now)
  
  if (monthDiff < yearDiff) {
    const monthsCount = now.diff(originalDate, 'month') + 1
    return {
      title: `${monthsCount} tháng yêu nhau`,
      date: nextMonth.format('DD/MM/YYYY'),
      originalDate: props.anniversaryDate,
      type: 'monthly'
    }
  } else {
    const yearsCount = now.diff(originalDate, 'year') + 1
    return {
      title: `${yearsCount} năm yêu nhau`,
      date: nextYear.format('DD/MM/YYYY'),
      originalDate: props.anniversaryDate,
      type: 'yearly'
    }
  }
})

const timeLeft = computed((): TimeLeft => {
  const now = currentTime.value
  const target = dayjs(nextAnniversary.value.date, 'DD/MM/YYYY')
  const diff = target.diff(now)
  
  if (diff <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00'
    }
  }
  
  const duration = dayjs.duration(diff)
  
  return {
    days: String(Math.floor(duration.asDays())).padStart(2, '0'),
    hours: String(duration.hours()).padStart(2, '0'),
    minutes: String(duration.minutes()).padStart(2, '0'),
    seconds: String(duration.seconds()).padStart(2, '0')
  }
})

const progressPercentage = computed(() => {
  const now = currentTime.value
  const target = dayjs(nextAnniversary.value.date, 'DD/MM/YYYY')
  const start = nextAnniversary.value.type === 'monthly' 
    ? now.subtract(1, 'month').date(dayjs(props.anniversaryDate).date())
    : now.subtract(1, 'year').month(dayjs(props.anniversaryDate).month()).date(dayjs(props.anniversaryDate).date())
  
  const total = target.diff(start)
  const elapsed = now.diff(start)
  
  return Math.min(Math.max((elapsed / total) * 100, 0), 100)
})

const progressText = computed(() => {
  const percentage = Math.round(progressPercentage.value)
  return `${percentage}% đã trôi qua từ kỷ niệm trước`
})

const isCloseToAnniversary = computed(() => {
  const days = parseInt(timeLeft.value.days)
  return days <= 7
})

// Methods
const updateCurrentTime = () => {
  currentTime.value = dayjs()
}

const viewAllAnniversaries = () => {
  // emit('viewAnniversaries')
}

const createReminder = () => {
  // emit('createReminder', nextAnniversary.value)
}

// Lifecycle
onMounted(() => {
  // Update every second
  updateTimer.value = window.setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (updateTimer.value) {
    clearInterval(updateTimer.value)
  }
})
</script>

<style scoped>
.anniversary-countdown {
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
}

.anniversary-icon-container {
  position: relative;
}

.anniversary-icon {
  opacity: 0.8;
}

.countdown-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.countdown-subtitle {
  font-weight: 500;
}

.countdown-display {
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 16px;
  padding: 16px 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.countdown-item {
  padding: 8px 4px;
}

.countdown-number {
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.countdown-label {
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.countdown-progress {
  padding: 0 8px;
}

.countdown-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.special-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.sparkle {
  position: absolute;
}

/* Card Hover Effect */
.love-card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.15);
}

/* Animations */
.animate-gentle-pulse {
  animation: gentlePulse 2s ease-in-out infinite;
}

.animate-sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

/* Keyframes */
@keyframes gentlePulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .countdown-number {
    font-size: 1.5rem !important;
  }
  
  .countdown-label {
    font-size: 0.7rem;
  }
  
  .countdown-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .countdown-actions .v-btn {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }
}

/* Close to anniversary styling */
.anniversary-countdown.close-anniversary {
  animation: gentleGlow 3s ease-in-out infinite;
}

@keyframes gentleGlow {
  0%, 100% {
    box-shadow: 0 4px 8px rgba(var(--v-theme-primary), 0.2);
  }
  50% {
    box-shadow: 0 8px 16px rgba(var(--v-theme-primary), 0.4);
  }
}

/* Dark mode adjustments */
.v-theme--dark .anniversary-countdown {
  background: linear-gradient(145deg, rgba(30, 30, 30, 0.95), rgba(40, 40, 40, 0.95));
}

.v-theme--dark .countdown-display {
  background: rgba(var(--v-theme-primary), 0.1);
  border-color: rgba(var(--v-theme-primary), 0.2);
}
</style>
