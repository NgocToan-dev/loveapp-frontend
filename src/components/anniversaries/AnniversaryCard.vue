<template>
  <v-card
    class="anniversary-card"
    rounded="xl"
    elevation="8"
    :class="getCardClass()"
    @click="$emit('open-anniversary', anniversary)"
  >
    <!-- Card Header with Countdown -->
    <div class="card-header">
      <div class="countdown-section">
        <div class="days-counter">
          <span class="days-number">{{ daysUntil }}</span>
          <span class="days-label">{{ daysUntil === 1 ? t('anniversaries.day') : t('anniversaries.days') }}</span>
        </div>
        <div class="countdown-status">
          <v-chip
            :color="getStatusColor()"
            variant="elevated"
            size="small"
            class="status-chip"
          >
            {{ getStatusText() }}
          </v-chip>
        </div>
      </div>
      
      <!-- Anniversary Icon -->
      <div class="anniversary-icon">
        <v-icon :color="getTypeColor()" size="32">
          {{ getTypeIcon() }}
        </v-icon>
      </div>
    </div>

    <!-- Card Content -->
    <v-card-text class="card-content">
      <h3 class="anniversary-title">{{ anniversary.title }}</h3>
      <p class="anniversary-description" v-if="anniversary.description">
        {{ anniversary.description }}
      </p>
      
      <!-- Date Information -->
      <div class="date-info">
        <div class="anniversary-date">
          <v-icon size="16" color="grey">mdi-calendar</v-icon>
          <span>{{ formatDate(anniversary.date) }}</span>
        </div>
        <div class="anniversary-type">
          <v-chip
            :color="getTypeColor()"
            variant="tonal"
            size="x-small"
          >
            {{ getTypeLabel() }}
          </v-chip>
        </div>
      </div>

      <!-- Recurring Indicator -->
      <div v-if="anniversary.isRecurring" class="recurring-indicator">
        <v-icon size="14" color="success">mdi-repeat</v-icon>
        <span class="recurring-text">{{ getRecurringText() }}</span>
      </div>
    </v-card-text>

    <!-- Card Actions -->
    <v-card-actions class="card-actions">
      <v-btn
        icon
        size="small"
        variant="text"
        @click.stop="$emit('edit-anniversary', anniversary)"
      >
        <v-icon size="18">mdi-pencil</v-icon>
      </v-btn>
      
      <v-btn
        icon
        size="small"
        variant="text"
        @click.stop="$emit('delete-anniversary', anniversary)"
      >
        <v-icon size="18">mdi-delete</v-icon>
      </v-btn>
      
      <v-spacer />
      
      <v-btn
        icon
        size="small"
        variant="text"
        @click.stop="$emit('celebrate', anniversary)"
        v-if="daysUntil <= 7"
      >
        <v-icon size="18" color="pink">mdi-party-popper</v-icon>
      </v-btn>
    </v-card-actions>

    <!-- Special Effects for Near Anniversaries -->
    <div v-if="daysUntil <= 3" class="celebration-effects">
      <div class="sparkle" v-for="n in 6" :key="n"></div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import type { Anniversary } from '@/types'

const { t } = useI18n()

// Props
interface Props {
  anniversary: Anniversary
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  'open-anniversary': [anniversary: Anniversary]
  'edit-anniversary': [anniversary: Anniversary]
  'delete-anniversary': [anniversary: Anniversary]
  'celebrate': [anniversary: Anniversary]
}>()

// Computed
const daysUntil = computed(() => {
  const today = dayjs()
  const anniversaryDate = dayjs(props.anniversary.date)
  
  // For recurring anniversaries, calculate next occurrence
  if (props.anniversary.isRecurring) {
    let nextDate = anniversaryDate.year(today.year())
    if (nextDate.isBefore(today)) {
      nextDate = nextDate.year(today.year() + 1)
    }
    return Math.max(0, nextDate.diff(today, 'day'))
  }
  
  return Math.max(0, anniversaryDate.diff(today, 'day'))
})

const getCardClass = () => {
  const classes = ['anniversary-card-base']
  
  if (daysUntil.value === 0) {
    classes.push('today')
  } else if (daysUntil.value <= 3) {
    classes.push('soon')
  } else if (daysUntil.value <= 7) {
    classes.push('upcoming')
  }
  
  classes.push(`type-${props.anniversary.type}`)
  
  return classes
}

const getStatusColor = () => {
  if (daysUntil.value === 0) return 'error'
  if (daysUntil.value <= 3) return 'warning'
  if (daysUntil.value <= 7) return 'orange'
  return 'info'
}

const getStatusText = () => {
  if (daysUntil.value === 0) return t('anniversaries.statusToday')
  if (daysUntil.value === 1) return t('anniversaries.statusTomorrow')
  if (daysUntil.value <= 3) return t('anniversaries.statusVerySoon')
  if (daysUntil.value <= 7) return t('anniversaries.statusThisWeek')
  if (daysUntil.value <= 30) return t('anniversaries.statusThisMonth')
  return t('anniversaries.statusUpcoming')
}

const getTypeColor = () => {
  const colors: Record<string, string> = {
    'relationship': 'red',
    'milestone': 'purple',
    'birthday': 'pink',
    'other': 'blue'
  }
  return colors[props.anniversary.type] || 'grey'
}

const getTypeIcon = () => {
  const icons: Record<string, string> = {
    'relationship': 'mdi-heart',
    'milestone': 'mdi-star',
    'birthday': 'mdi-cake',
    'other': 'mdi-calendar-heart'
  }
  return icons[props.anniversary.type] || 'mdi-calendar'
}

const getTypeLabel = () => {
  const labels: Record<string, string> = {
    'relationship': t('anniversaries.types.relationship'),
    'milestone': t('anniversaries.types.milestone'),
    'birthday': t('anniversaries.types.birthday'),
    'other': t('anniversaries.types.other')
  }
  return labels[props.anniversary.type] || t('anniversaries.anniversary')
}

const getRecurringText = () => {
  const frequency = props.anniversary.frequency || 'yearly'
  const labels: Record<string, string> = {
    'yearly': t('anniversaries.frequencies.yearly'),
    'monthly': t('anniversaries.frequencies.monthly')
  }
  return labels[frequency] || t('anniversaries.recurring')
}

const formatDate = (date: string | Date) => {
  return dayjs(date).format('MMM DD, YYYY')
}
</script>

<style scoped>
.anniversary-card {
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  overflow: hidden;
}

.anniversary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.anniversary-card.today {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(255, 193, 7, 0.1));
  border-color: rgba(244, 67, 54, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.anniversary-card.soon {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 193, 7, 0.1));
  border-color: rgba(255, 152, 0, 0.2);
}

.anniversary-card.upcoming {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(103, 58, 183, 0.1));
  border-color: rgba(33, 150, 243, 0.2);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 0;
}

.countdown-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.days-counter {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.days-number {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.days-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.status-chip {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
}

.anniversary-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-secondary), 0.1));
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
}

.card-content {
  padding: 16px !important;
}

.anniversary-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 8px;
  line-height: 1.3;
}

.anniversary-description {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.8);
  margin-bottom: 12px;
  line-height: 1.4;
}

.date-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.anniversary-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.recurring-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.recurring-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.card-actions {
  padding: 8px 16px 16px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.anniversary-card:hover .card-actions {
  opacity: 1;
}

/* Special Effects */
.celebration-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.sparkle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border-radius: 50%;
  animation: sparkle 2s ease-in-out infinite;
}

.sparkle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
.sparkle:nth-child(2) { top: 30%; right: 15%; animation-delay: 0.3s; }
.sparkle:nth-child(3) { top: 60%; left: 20%; animation-delay: 0.6s; }
.sparkle:nth-child(4) { top: 70%; right: 10%; animation-delay: 0.9s; }
.sparkle:nth-child(5) { top: 40%; left: 5%; animation-delay: 1.2s; }
.sparkle:nth-child(6) { top: 50%; right: 25%; animation-delay: 1.5s; }

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

/* Type-specific styling */
.type-relationship {
  border-left: 4px solid rgb(var(--v-theme-error));
}

.type-milestone {
  border-left: 4px solid rgb(var(--v-theme-purple));
}

.type-birthday {
  border-left: 4px solid rgb(var(--v-theme-pink));
}

.type-other {
  border-left: 4px solid rgb(var(--v-theme-info));
}

/* Responsive Design */
@media (max-width: 768px) {
  .days-number {
    font-size: 2rem;
  }
  
  .anniversary-title {
    font-size: 1.1rem;
  }
  
  .card-header {
    padding: 12px 12px 0;
  }
  
  .card-content {
    padding: 12px !important;
  }
}
</style>
