<template>
  <v-card
    class="countdown-widget"
    rounded="xl"
    elevation="12"
    :class="getWidgetClass()"
  >
    <div class="countdown-background">
      <div class="floating-hearts">
        <div class="heart" v-for="n in 8" :key="n"></div>
      </div>
    </div>
    
    <v-card-text class="countdown-content">
      <!-- Title Section -->
      <div class="countdown-header">
        <h2 class="countdown-title">{{ nextAnniversary?.title || 'Next Anniversary' }}</h2>
        <p class="countdown-subtitle" v-if="nextAnniversary?.description">
          {{ nextAnniversary.description }}
        </p>
      </div>

      <!-- Main Countdown Display -->
      <div class="countdown-display">
        <div class="time-unit" v-if="timeLeft.days > 0">
          <div class="time-number">{{ timeLeft.days }}</div>
          <div class="time-label">{{ timeLeft.days === 1 ? 'Day' : 'Days' }}</div>
        </div>
        
        <div class="time-unit" v-if="timeLeft.days > 0 || timeLeft.hours > 0">
          <div class="time-number">{{ timeLeft.hours.toString().padStart(2, '0') }}</div>
          <div class="time-label">{{ timeLeft.hours === 1 ? 'Hour' : 'Hours' }}</div>
        </div>
        
        <div class="time-unit" v-if="timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0">
          <div class="time-number">{{ timeLeft.minutes.toString().padStart(2, '0') }}</div>
          <div class="time-label">{{ timeLeft.minutes === 1 ? 'Minute' : 'Minutes' }}</div>
        </div>
        
        <div class="time-unit">
          <div class="time-number">{{ timeLeft.seconds.toString().padStart(2, '0') }}</div>
          <div class="time-label">{{ timeLeft.seconds === 1 ? 'Second' : 'Seconds' }}</div>
        </div>
      </div>

      <!-- Anniversary Date -->
      <div class="anniversary-info">
        <div class="anniversary-date">
          <v-icon size="20" color="white">mdi-calendar-heart</v-icon>
          <span>{{ formatAnniversaryDate() }}</span>
        </div>
        
        <v-chip
          :color="getTypeColor()"
          variant="elevated"
          size="small"
          class="type-chip"
        >
          {{ getTypeLabel() }}
        </v-chip>
      </div>

      <!-- Special Message for Today -->
      <div v-if="isToday" class="celebration-message">
        <v-icon size="32" color="yellow" class="celebration-icon">mdi-party-popper</v-icon>
        <h3 class="celebration-text">Happy Anniversary!</h3>
        <p class="celebration-subtitle">🎉 Today is your special day! 🎉</p>
      </div>

      <!-- Action Buttons -->
      <div class="countdown-actions">
        <v-btn
          color="white"
          variant="elevated"
          rounded
          @click="$emit('celebrate')"
          v-if="isToday || timeLeft.days <= 3"
        >
          <v-icon start>mdi-party-popper</v-icon>
          Celebrate
        </v-btn>
        
        <v-btn
          color="white"
          variant="outlined"
          rounded
          @click="$emit('view-all')"
        >
          <v-icon start>mdi-calendar-multiple</v-icon>
          View All
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import type { Anniversary } from '@/types'

// Props
interface Props {
  anniversaries: Anniversary[]
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  'celebrate': []
  'view-all': []
}>()

// State
const currentTime = ref(dayjs())
let timeInterval: number | null = null

// Computed
const nextAnniversary = computed(() => {
  if (!props.anniversaries.length) return null
  
  const today = dayjs()
  const sortedAnniversaries = [...props.anniversaries]
    .map(anniversary => {
      let nextDate = dayjs(anniversary.date)
      
      // For recurring anniversaries, find next occurrence
      if (anniversary.isRecurring) {
        nextDate = nextDate.year(today.year())
        if (nextDate.isBefore(today, 'day')) {
          nextDate = nextDate.year(today.year() + 1)
        }
      }
      
      return {
        ...anniversary,
        nextDate,
        daysUntil: Math.max(0, nextDate.diff(today, 'day'))
      }
    })
    .sort((a, b) => a.nextDate.diff(b.nextDate))
  
  return sortedAnniversaries[0] || null
})

const timeLeft = computed(() => {
  if (!nextAnniversary.value) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  const now = currentTime.value
  const target = nextAnniversary.value.nextDate
  const diff = target.diff(now)
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  return { days, hours, minutes, seconds }
})

const isToday = computed(() => {
  if (!nextAnniversary.value) return false
  return timeLeft.value.days === 0 && timeLeft.value.hours === 0 && timeLeft.value.minutes === 0
})

const getWidgetClass = () => {
  const classes = ['countdown-widget-base']
  
  if (isToday.value) {
    classes.push('today-celebration')
  } else if (timeLeft.value.days <= 3) {
    classes.push('very-soon')
  } else if (timeLeft.value.days <= 7) {
    classes.push('soon')
  }
  
  return classes
}

const getTypeColor = () => {
  if (!nextAnniversary.value) return 'grey'
  
  const colors: Record<string, string> = {
    'relationship': 'red',
    'milestone': 'purple',
    'birthday': 'pink',
    'other': 'blue'
  }
  return colors[nextAnniversary.value.type] || 'grey'
}

const getTypeLabel = () => {
  if (!nextAnniversary.value) return ''
  
  const labels: Record<string, string> = {
    'relationship': 'Relationship',
    'milestone': 'Milestone',
    'birthday': 'Birthday',
    'other': 'Other'
  }
  return labels[nextAnniversary.value.type] || 'Anniversary'
}

const formatAnniversaryDate = () => {
  if (!nextAnniversary.value) return ''
  return nextAnniversary.value.nextDate.format('MMMM DD, YYYY')
}

// Lifecycle
onMounted(() => {
  // Update every second
  timeInterval = setInterval(() => {
    currentTime.value = dayjs()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.countdown-widget {
  position: relative;
  background: linear-gradient(135deg, 
    rgb(var(--v-theme-primary)) 0%, 
    rgb(var(--v-theme-secondary)) 50%, 
    rgb(var(--v-theme-tertiary)) 100%);
  color: white;
  overflow: hidden;
  min-height: 300px;
}

.countdown-widget.today-celebration {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%);
  animation: celebration-glow 2s ease-in-out infinite alternate;
}

.countdown-widget.very-soon {
  background: linear-gradient(135deg, #FF8A65 0%, #FFB74D 50%, #FFCC02 100%);
}

.countdown-widget.soon {
  background: linear-gradient(135deg, #42A5F5 0%, #66BB6A 50%, #AB47BC 100%);
}

@keyframes celebration-glow {
  0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
}

.countdown-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-hearts {
  position: absolute;
  width: 100%;
  height: 100%;
}

.heart {
  position: absolute;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.2);
  animation: float-heart 8s ease-in-out infinite;
}

.heart::before {
  content: '♥';
}

.heart:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.heart:nth-child(2) { top: 20%; right: 15%; animation-delay: 1s; }
.heart:nth-child(3) { top: 50%; left: 5%; animation-delay: 2s; }
.heart:nth-child(4) { top: 70%; right: 20%; animation-delay: 3s; }
.heart:nth-child(5) { top: 80%; left: 25%; animation-delay: 4s; }
.heart:nth-child(6) { top: 30%; right: 5%; animation-delay: 5s; }
.heart:nth-child(7) { top: 60%; left: 15%; animation-delay: 6s; }
.heart:nth-child(8) { top: 40%; right: 30%; animation-delay: 7s; }

@keyframes float-heart {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1); 
    opacity: 0.2; 
  }
  25% { 
    transform: translateY(-15px) rotate(5deg) scale(1.1); 
    opacity: 0.4; 
  }
  50% { 
    transform: translateY(-10px) rotate(-5deg) scale(0.9); 
    opacity: 0.3; 
  }
  75% { 
    transform: translateY(-20px) rotate(3deg) scale(1.05); 
    opacity: 0.35; 
  }
}

.countdown-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 24px !important;
  min-height: 300px;
  justify-content: space-between;
}

.countdown-header {
  margin-bottom: 24px;
}

.countdown-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.countdown-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  opacity: 0.9;
}

.countdown-display {
  display: flex;
  gap: 16px;
  margin: 24px 0;
  flex-wrap: wrap;
  justify-content: center;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
}

.time-number {
  font-family: 'Montserrat', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.time-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 8px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.anniversary-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.anniversary-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
}

.type-chip {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
}

.celebration-message {
  text-align: center;
  margin: 20px 0;
  animation: celebration-bounce 1s ease-in-out infinite alternate;
}

.celebration-icon {
  margin-bottom: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.celebration-text {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.celebration-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  opacity: 0.9;
}

@keyframes celebration-bounce {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-5px); }
}

.countdown-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.countdown-actions .v-btn {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .countdown-title {
    font-size: 1.8rem;
  }
  
  .time-number {
    font-size: 2.2rem;
    padding: 6px 10px;
  }
  
  .time-label {
    font-size: 0.8rem;
  }
  
  .countdown-display {
    gap: 12px;
  }
  
  .time-unit {
    min-width: 60px;
  }
  
  .countdown-content {
    padding: 24px 16px !important;
  }
}

@media (max-width: 480px) {
  .countdown-title {
    font-size: 1.5rem;
  }
  
  .time-number {
    font-size: 1.8rem;
    padding: 4px 8px;
  }
  
  .countdown-display {
    gap: 8px;
  }
  
  .time-unit {
    min-width: 50px;
  }
}
</style>
