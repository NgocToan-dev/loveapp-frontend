<template>  <v-card 
    class="reminder-card cardLift loveClick slideInUp" 
    :class="{
      'reminder-completed': reminder.isCompleted,
      'reminder-overdue': isOverdue,
      'reminder-today': isToday,
      'mobile-optimized': isMobile
    }"
    elevation="0"
    @click="handleClick"
    ref="cardRef"
  >
    <!-- Reminder Header -->
    <div class="reminder-header">
      <div class="reminder-title-section">
        <div class="title-row">
          <v-checkbox
            :model-value="reminder.isCompleted"
            color="success"
            hide-details
            class="reminder-checkbox loveClick"
            @click.stop="toggleComplete"
          />
          <h3 class="reminder-title" :class="{ 'completed': reminder.isCompleted }">
            {{ reminder.title }}
          </h3>
        </div>
        
        <div class="reminder-meta">
          <div class="reminder-date" :class="{ 'overdue': isOverdue, 'today': isToday }">
            <v-icon size="14" :color="getDateColor()">{{ getDateIcon() }}</v-icon>
            <span>{{ formatDate() }}</span>
          </div>
          
          <v-chip
            size="small"
            :color="getPriorityColor()"
            variant="tonal"
            class="priority-chip sparkle"
          >
            {{ reminder.priority }}
          </v-chip>
        </div>
      </div>

      <!-- Reminder Actions -->
      <div class="reminder-actions">
        <v-btn
          icon
          variant="text"
          size="small"
          class="action-btn loveClick"
          @click.stop="$emit('edit', reminder)"
        >
          <v-icon color="primary" class="sparkle">mdi-pencil</v-icon>
        </v-btn>
        
        <v-btn
          icon
          variant="text"
          size="small"
          class="action-btn loveClick"
          @click.stop="$emit('delete', reminder)"
        >
          <v-icon color="error">mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Reminder Content -->
    <v-card-text class="reminder-content" v-if="reminder.description">
      <p class="reminder-description">
        {{ reminder.description }}
      </p>
    </v-card-text>

    <!-- Reminder Footer -->
    <div class="reminder-footer" v-if="reminder.repeat || timeUntil">
      <div class="reminder-info">
        <div class="info-item" v-if="reminder.repeat">
          <v-icon size="14" color="info">mdi-repeat</v-icon>
          <span>{{ reminder.repeat }}</span>
        </div>
        
        <div class="info-item" v-if="timeUntil && !reminder.isCompleted">
          <v-icon size="14" :color="getTimeColor()">mdi-clock</v-icon>
          <span>{{ timeUntil }}</span>
        </div>
      </div>
    </div>

    <!-- Completion Feedback -->
    <div class="completion-feedback" v-if="showCompletionHearts">
      <div class="heart heart-1 confettiFall">✅</div>
      <div class="heart heart-2 confettiFall">💕</div>
      <div class="heart heart-3 confettiFall">🎉</div>
    </div>

    <!-- Priority Glow -->
    <div class="priority-glow" v-if="reminder.priority === 'high' && !reminder.isCompleted"></div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTouch } from '@/composables/useTouch'
import type { SwipeDirection } from '@/composables/useTouch'
import { useBreakpoints } from '@/composables/useBreakpoints'
import type { Reminder } from '@/types'

interface Props {
  reminder: Reminder
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'click': [reminder: Reminder]
  'edit': [reminder: Reminder]
  'delete': [reminder: Reminder]
  'toggle-complete': [reminder: Reminder]
}>()

const { isMobile } = useBreakpoints()
const { setHandlers, bindToElement } = useTouch()
const cardRef = ref<HTMLElement>()
const showCompletionHearts = ref(false)

const handleClick = () => {
  emit('click', props.reminder)
}

const toggleComplete = () => {
  // Show completion celebration if completing
  if (!props.reminder.isCompleted) {
    showCompletionHearts.value = true
    setTimeout(() => {
      showCompletionHearts.value = false
    }, 2000)
  }
  
  emit('toggle-complete', props.reminder)
}

const reminderDate = computed(() => {
  let date: Date
  if (typeof props.reminder.reminderDate === 'string') {
    date = new Date(props.reminder.reminderDate)
  } else {
    date = new Date(props.reminder.reminderDate)
  }
  return date
})

const isOverdue = computed(() => {
  if (props.reminder.isCompleted) return false
  return reminderDate.value < new Date()
})

const isToday = computed(() => {
  const today = new Date()
  const remDate = reminderDate.value
  return (
    remDate.getDate() === today.getDate() &&
    remDate.getMonth() === today.getMonth() &&
    remDate.getFullYear() === today.getFullYear()
  )
})

const timeUntil = computed(() => {
  if (props.reminder.isCompleted) return null
  
  const now = new Date()
  const target = reminderDate.value
  const diff = target.getTime() - now.getTime()
  
  if (diff < 0) return 'Overdue'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}d`
  if (hours > 0) return `${hours}h`
  if (minutes > 0) return `${minutes}m`
  return 'Now'
})

const formatDate = () => {
  return reminderDate.value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDateColor = () => {
  if (isOverdue.value) return 'error'
  if (isToday.value) return 'warning'
  return 'primary'
}

const getDateIcon = () => {
  if (isOverdue.value) return 'mdi-alert'
  if (isToday.value) return 'mdi-calendar-today'
  return 'mdi-calendar'
}

const getTimeColor = () => {
  if (timeUntil.value === 'Overdue') return 'error'
  if (timeUntil.value === 'Now') return 'warning'
  return 'info'
}

const getPriorityColor = () => {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  }
  return colors[props.reminder.priority] || 'primary'
}

/* Touch and Swipe Handling */
onMounted(() => {
  if (cardRef.value && isMobile.value) {
    setHandlers({
      onTap: handleClick,
      onLongPress: () => emit('edit', props.reminder),
      onSwipe: (swipeData) => {
        if (swipeData.direction === 'left') {
          emit('edit', props.reminder)
        } else if (swipeData.direction === 'right') {
          toggleComplete()
        }
      },
    })
    bindToElement(cardRef.value)
  }
})

</script>

<style scoped>
.reminder-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(var(--primary-rgb), 0.08);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(10px);
}

.reminder-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(var(--primary-rgb), 0.12);
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 1);
}

.reminder-completed {
  opacity: 0.7;
  background: rgba(var(--success-rgb), 0.05) !important;
  border-color: rgba(var(--success-rgb), 0.2) !important;
}

.reminder-overdue {
  border-color: rgba(var(--error-rgb), 0.3) !important;
  background: rgba(var(--error-rgb), 0.02) !important;
}

.reminder-today {
  border-color: rgba(var(--warning-rgb), 0.3) !important;
  background: rgba(var(--warning-rgb), 0.02) !important;
}

/* Reminder Header */
.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  gap: 16px;
}

.reminder-title-section {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.reminder-checkbox {
  flex-shrink: 0;
  margin-top: -4px;
}

.reminder-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  word-break: break-word;
  transition: all 0.3s ease;
}

.reminder-title.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.reminder-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-left: 40px;
}

.reminder-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.reminder-date.overdue {
  color: var(--error-color);
}

.reminder-date.today {
  color: var(--warning-color);
}

.priority-chip {
  height: 20px;
  font-size: 0.7rem;
  text-transform: capitalize;
  transition: all 0.3s ease;
}

.priority-chip:hover {
  transform: scale(1.05);
}

/* Reminder Actions */
.reminder-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.reminder-card:hover .reminder-actions {
  opacity: 1;
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  background: rgba(var(--primary-rgb), 0.1) !important;
}

/* Reminder Content */
.reminder-content {
  padding: 0 20px 16px;
}

.reminder-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
  word-break: break-word;
}

/* Reminder Footer */
.reminder-footer {
  padding: 0 20px 20px;
}

.reminder-info {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Completion Feedback */
.completion-feedback {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
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
  left: 30%;
  animation-delay: 0s;
}

.heart-2 {
  top: 40%;
  right: 30%;
  animation-delay: 0.4s;
}

.heart-3 {
  top: 60%;
  left: 50%;
  animation-delay: 0.8s;
}

/* Priority Glow */
.priority-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, 
    rgba(var(--error-rgb), 0.1) 0%, 
    transparent 70%);
  pointer-events: none;
  animation: softPulse 3s ease-in-out infinite;
}

@keyframes softPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* Responsive */
@media (max-width: 768px) {
  .reminder-header {
    padding: 16px;
  }
  
  .reminder-content {
    padding: 0 16px 12px;
  }
  
  .reminder-footer {
    padding: 0 16px 16px;
  }
  
  .reminder-title {
    font-size: 1rem;
  }
  
  .reminder-description {
    font-size: 0.85rem;
  }
  
  .reminder-meta {
    gap: 6px;
  }
  
  .reminder-info {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .reminder-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .reminder-actions {
    opacity: 1;
    align-self: flex-end;
  }
  
  .reminder-meta {
    margin-left: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
