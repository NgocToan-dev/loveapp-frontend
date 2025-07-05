<template>
  <div 
    class="reminder-card group"
    :class="{ 
      'completed': reminder.isCompleted, 
      'overdue': !reminder.isCompleted && isOverdue,
      'upcoming': !reminder.isCompleted && isUpcoming 
    }"
    @click="handleCardClick"
  >
    <!-- Main Content -->
    <div class="reminder-content">
      <!-- Title and Description -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2 leading-tight"
            :class="reminder.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'">
          {{ reminder.title }}
        </h3>
        <p v-if="reminder.description" 
           class="text-sm leading-relaxed line-clamp-2"
           :class="reminder.isCompleted ? 'text-gray-400' : 'text-gray-600'">
          {{ reminder.description }}
        </p>
      </div>

      <!-- Status and Type Information -->
      <div class="flex items-center gap-2 mb-3 flex-wrap">
        <!-- Status Badge -->
        <span v-if="reminder.isCompleted" 
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon class="h-3 w-3 mr-1" />
          {{ $t('reminders.completed') }}
        </span>
        <span v-else-if="isOverdue" 
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <ExclamationTriangleIcon class="h-3 w-3 mr-1" />
          {{ $t('reminders.overdue') }}
        </span>
        <span v-else-if="isUpcoming"
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <ClockIcon class="h-3 w-3 mr-1" />
          {{ $t('reminders.upcoming') }}
        </span>
        <span v-else 
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <ClockIcon class="h-3 w-3 mr-1" />
          {{ $t('reminders.active') }}
        </span>
        
        <!-- Type Badge -->
        <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
          <span class="mr-1">{{ getReminderIcon(reminder.type) }}</span>
          {{ $t(`reminders.types.${reminder.type}`) }}
        </span>
        
        <!-- Recurring Badge -->
        <span v-if="reminder.isRecurring" 
              class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
          🔄 {{ $t(`reminders.recurring.${reminder.recurringType}`) }}
        </span>
      </div>

      <!-- Time Information -->
      <div class="space-y-2">
        <!-- Scheduled Time -->
        <div class="flex items-center text-sm text-gray-600">
          <CalendarIcon class="h-4 w-4 mr-2 text-gray-400" />
          <span>{{ formatDateTimeDisplay(reminderDateTime) }}</span>
        </div>
        
        <!-- Time Remaining / Status -->
        <div v-if="reminder.isCompleted" class="flex items-center text-sm text-green-600">
          <CheckCircleIcon class="h-4 w-4 mr-2" />
          <span class="font-medium">{{ $t('reminders.completed') }}</span>
        </div>
        <div v-else-if="isOverdue" class="flex items-center text-sm text-red-600">
          <ExclamationTriangleIcon class="h-4 w-4 mr-2" />
          <span class="font-medium">
            {{ $t('reminders.overdue_by') }} {{ formatTimeRemaining(reminderDateTime, true) }}
          </span>
        </div>
        <div v-else class="flex items-center text-sm text-blue-600">
          <ClockIcon class="h-4 w-4 mr-2" />
          <span class="font-medium">
            {{ $t('reminders.time_remaining') }}: {{ formatTimeRemaining(reminderDateTime) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="reminder-actions border-t border-gray-100 pt-3 mt-4">
      <div class="flex items-center justify-between gap-2">
        <!-- Primary Actions -->
        <div class="flex items-center gap-2">
          <Button
            v-if="!reminder.isCompleted"
            @click.stop="toggleComplete"
            variant="success"
            size="sm"
            class="bg-green-600 hover:bg-green-700 text-white"
            :disabled="isUpdating"
            v-tooltip="$t('reminders.mark_complete')"
          >
            <CheckCircleIcon class="h-4 w-4" />
          </Button>
          
          <Button
            v-if="reminder.isCompleted"
            @click.stop="toggleComplete"
            variant="outline"
            size="sm"
            class="border-gray-300 text-gray-700 hover:bg-gray-50"
            :disabled="isUpdating"
            v-tooltip="$t('reminders.mark_incomplete')"
          >
            <ArrowUturnLeftIcon class="h-4 w-4" />
          </Button>
          
          <Button
            v-if="!reminder.isCompleted && !isOverdue"
            @click.stop="showSnoozeDialog = true"
            variant="outline"
            size="sm"
            class="border-blue-300 text-blue-700 hover:bg-blue-50"
            v-tooltip="$t('reminders.snooze')"
          >
            <ClockIcon class="h-4 w-4" />
          </Button>
        </div>
        
        <!-- Secondary Actions -->
        <div class="flex items-center gap-1">
          <Button
            @click.stop="$emit('edit', reminder)"
            variant="ghost"
            size="sm"
            class="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            :disabled="reminder.isCompleted"
            :class="{ 'opacity-50 cursor-not-allowed': reminder.isCompleted }"
            v-tooltip="reminder.isCompleted ? $t('reminders.cannot_edit_completed') : $t('common.actions.edit')"
          >
            <PencilIcon class="h-4 w-4" />
          </Button>
          
          <Button
            @click.stop="showDeleteConfirm = true"
            variant="ghost"
            size="sm"
            class="text-red-600 hover:text-red-700 hover:bg-red-50"
            v-tooltip="$t('common.actions.delete')"
          >
            <TrashIcon class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Snooze Dialog -->
    <Modal v-model="showSnoozeDialog" :title="$t('reminders.snooze_reminder')">
      <div class="space-y-4">
        <p class="text-sm text-gray-600">{{ $t('reminders.snooze_description') }}</p>
        
        <!-- Quick Snooze Options -->
        <div class="grid grid-cols-2 gap-2">
          <Button
            v-for="option in snoozeOptions"
            :key="option.value"
            @click="handleSnooze(option.value)"
            variant="outline"
            class="text-sm"
          >
            {{ option.label }}
          </Button>
        </div>

        <!-- Custom Snooze -->
        <div class="border-t pt-4">
          <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('reminders.custom_snooze') }}</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">
                {{ $t('reminders.snooze_until_date') }}
              </label>
              <input
                v-model="customSnoozeDate"
                type="date"
                :min="new Date().toISOString().split('T')[0]"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">
                {{ $t('reminders.snooze_until_time') }}
              </label>
              <input
                v-model="customSnoozeTime"
                type="time"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div v-if="customSnoozeDate && customSnoozeTime && !isCustomSnoozeValid" class="mt-2">
            <p class="text-xs text-red-600">{{ $t('reminders.validation.date_future') }}</p>
          </div>
          <Button
            @click="handleCustomSnooze"
            :disabled="!isCustomSnoozeValid"
            class="w-full mt-3"
            :class="{ 'opacity-50 cursor-not-allowed': !isCustomSnoozeValid }"
          >
            {{ $t('reminders.snooze') }}
          </Button>
        </div>
      </div>
    </Modal>

    <!-- Delete Confirmation -->
    <BaseConfirmModal
      v-model="showDeleteConfirm"
      :title="$t('reminders.confirm_delete')"
      :message="$t('reminders.delete_warning')"
      :confirm-text="$t('common.actions.delete')"
      variant="danger"
      @confirm="$emit('delete', reminder.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Reminder } from '@/types'
import { formatDateTime, formatDate, formatCountdown } from '@/utils/helpers'
import Button from '@/components/common/Button.vue'
import Modal from '@/components/common/Modal.vue'
import BaseConfirmModal from '@/components/common/BaseConfirmModal.vue'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  ArrowUturnLeftIcon
} from '@heroicons/vue/24/outline'

interface Props {
  reminder: Reminder
  isUpdating?: boolean
}

interface Emits {
  edit: [reminder: Reminder]
  delete: [id: string]
  toggleComplete: [id: string]
  snooze: [id: string, snoozeUntil: string]
  click: [reminder: Reminder]
}

const props = withDefaults(defineProps<Props>(), {
  isUpdating: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

// State
const showSnoozeDialog = ref(false)
const showDeleteConfirm = ref(false)
const customSnoozeDate = ref('')
const customSnoozeTime = ref('')

// Computed
const reminderDateTime = computed(() => {
  // Use datetime directly from backend (primary source)
  return new Date(props.reminder.datetime)
})

const isOverdue = computed(() => {
  if (props.reminder.isCompleted) return false
  return reminderDateTime.value < new Date()
})

const isUpcoming = computed(() => {
  if (props.reminder.isCompleted) return false
  const now = new Date()
  const timeDiff = reminderDateTime.value.getTime() - now.getTime()
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24)
  return daysDiff <= 7 && daysDiff > 0
})

const snoozeOptions = computed(() => [
  { 
    value: 15, 
    label: t('reminders.snooze_options.15_minutes') 
  },
  { 
    value: 60, 
    label: t('reminders.snooze_options.1_hour') 
  },
  { 
    value: 240, 
    label: t('reminders.snooze_options.4_hours') 
  },
  { 
    value: 1440, 
    label: t('reminders.snooze_options.1_day') 
  }
])

const isCustomSnoozeValid = computed(() => {
  if (!customSnoozeDate.value || !customSnoozeTime.value) return false
  
  const snoozeDateTime = new Date(`${customSnoozeDate.value}T${customSnoozeTime.value}:00`)
  const now = new Date()
  
  return snoozeDateTime > now
})

// Methods
const getReminderIcon = (type: string) => {
  const icons = {
    anniversary: '💕',
    birthday: '🎂',
    date: '💝',
    custom: '⭐'
  }
  return icons[type as keyof typeof icons] || '⏰'
}

const handleCardClick = (event: Event) => {
  // Prevent card click when clicking on buttons
  const target = event.target as HTMLElement
  if (target.closest('button') || target.closest('.dropdown')) {
    return
  }
  
  // Click functionality disabled - no action on card click
  // emit('click', props.reminder)
}

const toggleComplete = () => {
  emit('toggleComplete', props.reminder.id)
}

const handleSnooze = (minutes: number) => {
  // Snooze from the original reminder time, not from current time
  const originalDateTime = new Date(props.reminder.datetime)
  const snoozeUntil = new Date(originalDateTime.getTime() + minutes * 60 * 1000)
  const now = new Date()
  
  // If the snoozed time is still in the past, snooze from current time instead
  const finalSnoozeTime = snoozeUntil <= now 
    ? new Date(now.getTime() + minutes * 60 * 1000)
    : snoozeUntil
  
  // Send full ISO string format
  emit('snooze', props.reminder.id, finalSnoozeTime.toISOString())
  showSnoozeDialog.value = false
}

const handleCustomSnooze = () => {
  if (customSnoozeDate.value && customSnoozeTime.value) {
    // Validate that snooze time is in the future
    const snoozeDateTime = new Date(`${customSnoozeDate.value}T${customSnoozeTime.value}:00`)
    const now = new Date()
    
    if (snoozeDateTime <= now) {
      // Could show an error message here, but for now just ignore invalid times
      return
    }
    
    // Send full ISO string format
    emit('snooze', props.reminder.id, snoozeDateTime.toISOString())
    showSnoozeDialog.value = false
    customSnoozeDate.value = ''
    customSnoozeTime.value = ''
  }
}

const formatDateTimeDisplay = (dateTime: Date) => {
  return dateTime.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const formatTimeRemaining = (dateTime: Date, isOverdue = false) => {
  const now = new Date()
  const diff = isOverdue ? now.getTime() - dateTime.getTime() : dateTime.getTime() - now.getTime()
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    return `${days} ${t('common.time.days')} ${hours > 0 ? `${hours} ${t('common.time.hours')}` : ''}`
  } else if (hours > 0) {
    return `${hours} ${t('common.time.hours')} ${minutes > 0 ? `${minutes} ${t('common.time.minutes')}` : ''}`
  } else {
    return `${minutes} ${t('common.time.minutes')}`
  }
}
</script>

<style scoped>
.reminder-card {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid rgb(229 231 235);
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.reminder-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-color: rgb(156 163 175);
}

.reminder-card.completed {
  background: rgb(249 250 251);
  border-color: rgb(229 231 235);
}

.reminder-card.completed .reminder-content h3 {
  text-decoration: line-through;
  color: rgb(107 114 128);
}

.reminder-card.overdue {
  border-color: rgb(254 202 202);
  background: rgb(254 242 242);
}

.reminder-card.upcoming {
  border-color: rgb(252 211 77);
  background: rgb(255 251 235);
}

.reminder-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .reminder-card {
    padding: 1rem;
  }
  
  .reminder-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .reminder-actions > div {
    width: 100%;
    justify-content: center;
  }
}
</style>
