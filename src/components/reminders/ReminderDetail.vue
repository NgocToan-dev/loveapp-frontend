<template>
  <div class="reminder-detail">
    <!-- Header Section -->
    <div class="detail-header">
      <div class="reminder-type-badge">
        <span class="type-icon">{{ getReminderIcon(reminder.type) }}</span>
        <span class="type-text">{{ $t(`reminders.types.${reminder.type}`) }}</span>
      </div>
      
      <div class="status-badge" :class="statusClass">
        {{ $t(`reminders.status.${getStatus(reminder)}`) }}
      </div>
    </div>

    <!-- Main Content -->
    <div class="detail-content">
      <!-- Title -->
      <h1 class="reminder-title">{{ reminder.title }}</h1>
      
      <!-- Description -->
      <div v-if="reminder.description" class="reminder-description">
        <p>{{ reminder.description }}</p>
      </div>

      <!-- Key Information -->
      <div class="info-grid">
        <!-- Date & Time -->
        <div class="info-item">
          <div class="info-label">
            <CalendarIcon class="w-5 h-5" />
            {{ $t('reminders.detail.date_time') }}
          </div>
          <div class="info-value">
            {{ formatDateTime(reminder.reminderDate, reminder.reminderTime) }}
          </div>
          <div v-if="isUpcoming && !reminder.isCompleted" class="countdown">
            {{ formatCountdown(reminderDateTime) }}
          </div>
        </div>

        <!-- Recurring Information -->
        <div v-if="reminder.isRecurring" class="info-item">
          <div class="info-label">
            <RefreshIcon class="w-5 h-5" />
            {{ $t('reminders.detail.recurring') }}
          </div>
          <div class="info-value">
            {{ $t(`reminders.recurring.${reminder.recurringType}`) }}
          </div>
        </div>

        <!-- Creation Info -->
        <div class="info-item">
          <div class="info-label">
            <UserIcon class="w-5 h-5" />
            {{ $t('reminders.detail.created_by') }}
          </div>
          <div class="info-value">
            {{ reminder.createdBy || $t('common.unknown') }}
          </div>
        </div>

        <!-- Created Date -->
        <div class="info-item">
          <div class="info-label">
            <ClockIcon class="w-5 h-5" />
            {{ $t('reminders.detail.created_at') }}
          </div>
          <div class="info-value">
            {{ formatDate(reminder.createdAt, 'full') }}
          </div>
        </div>
      </div>

      <!-- Status-specific content -->
      <div v-if="isOverdue && !reminder.isCompleted" class="alert alert-warning">
        <WarningIcon class="w-5 h-5" />
        <div>
          <h4>{{ $t('reminders.detail.overdue_title') }}</h4>
          <p>{{ $t('reminders.detail.overdue_message') }}</p>
        </div>
      </div>

      <div v-if="reminder.isCompleted" class="alert alert-success">
        <CheckCircleIcon class="w-5 h-5" />
        <div>
          <h4>{{ $t('reminders.detail.completed_title') }}</h4>
          <p>{{ $t('reminders.detail.completed_message') }}</p>
        </div>
      </div>
    </div>

    <!-- Actions Section -->
    <div class="detail-actions">
      <div class="primary-actions">
        <Button
          @click="toggleComplete"
          :variant="reminder.isCompleted ? 'outline' : 'primary'"
          :loading="isUpdating"
        >
          <CheckIcon class="w-4 h-4 mr-2" />
          {{ reminder.isCompleted ? $t('reminders.mark_incomplete') : $t('reminders.mark_complete') }}
        </Button>

        <Button
          v-if="!reminder.isCompleted && !isOverdue"
          @click="showSnoozeModal = true"
          variant="outline"
        >
          <ClockIcon class="w-4 h-4 mr-2" />
          {{ $t('reminders.snooze') }}
        </Button>
      </div>

      <div class="secondary-actions">
        <Button
          @click="$emit('edit')"
          variant="outline"
        >
          <EditIcon class="w-4 h-4 mr-2" />
          {{ $t('common.actions.edit') }}
        </Button>

        <Button
          @click="$emit('share')"
          variant="outline"
        >
          <ShareIcon class="w-4 h-4 mr-2" />
          {{ $t('common.actions.share') }}
        </Button>

        <Button
          @click="showDeleteConfirm = true"
          variant="error"
        >
          <TrashIcon class="w-4 h-4 mr-2" />
          {{ $t('common.actions.delete') }}
        </Button>
      </div>
    </div>

    <!-- Snooze Modal -->
    <Modal v-model="showSnoozeModal" :title="$t('reminders.snooze_reminder')">
      <div class="snooze-content">
        <p class="snooze-description">{{ $t('reminders.snooze_description') }}</p>
        
        <div class="snooze-options">
          <h4>{{ $t('reminders.quick_snooze') }}</h4>
          <div class="snooze-buttons">
            <Button
              v-for="option in snoozeOptions"
              :key="option.value"
              @click="handleSnooze(option.value)"
              variant="outline"
              class="snooze-button"
            >
              {{ option.label }}
            </Button>
          </div>
        </div>

        <div class="custom-snooze">
          <h4>{{ $t('reminders.custom_snooze') }}</h4>
          <div class="snooze-form">
            <div class="form-group">
              <label>{{ $t('reminders.snooze_until_date') }}</label>
              <input
                v-model="customSnoozeDate"
                type="date"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('reminders.snooze_until_time') }}</label>
              <input
                v-model="customSnoozeTime"
                type="time"
                class="form-input"
              />
            </div>
            <Button
              @click="handleCustomSnooze"
              :disabled="!customSnoozeDate || !customSnoozeTime"
              variant="primary"
            >
              {{ $t('reminders.snooze') }}
            </Button>
          </div>
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
      @confirm="$emit('delete')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDateTime, formatDate, formatCountdown } from '@/utils/helpers'
import type { Reminder } from '@/types'

import Button from '@/components/common/Button.vue'
import Modal from '@/components/common/Modal.vue'
import BaseConfirmModal from '@/components/common/BaseConfirmModal.vue'

// Icons from Heroicons
import {
  CalendarIcon,
  ArrowPathIcon as RefreshIcon,
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon as WarningIcon,
  CheckCircleIcon,
  CheckIcon,
  PencilIcon as EditIcon,
  ShareIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

interface Props {
  reminder: Reminder
  isUpdating?: boolean
}

interface Emits {
  edit: []
  delete: []
  share: []
  'toggle-complete': []
  snooze: [snoozeUntil: string]
}

const props = withDefaults(defineProps<Props>(), {
  isUpdating: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

// State
const showSnoozeModal = ref(false)
const showDeleteConfirm = ref(false)
const customSnoozeDate = ref('')
const customSnoozeTime = ref('')

// Computed
const reminderDateTime = computed(() => {
  return new Date(props.reminder.reminderDate + 'T' + props.reminder.reminderTime)
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

const statusClass = computed(() => {
  if (props.reminder.isCompleted) return 'status-completed'
  if (isOverdue.value) return 'status-overdue'
  if (isUpcoming.value) return 'status-upcoming'
  return 'status-pending'
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

const getStatus = (reminder: Reminder) => {
  if (reminder.isCompleted) return 'completed'
  if (isOverdue.value) return 'overdue'
  if (isUpcoming.value) return 'upcoming'
  return 'pending'
}

const toggleComplete = () => {
  emit('toggle-complete')
}

const handleSnooze = (minutes: number) => {
  const snoozeUntil = new Date()
  snoozeUntil.setMinutes(snoozeUntil.getMinutes() + minutes)
  
  const snoozeDate = snoozeUntil.toISOString().split('T')[0]
  const snoozeTime = snoozeUntil.toTimeString().split(' ')[0].substring(0, 5)
  
  emit('snooze', `${snoozeDate}T${snoozeTime}`)
  showSnoozeModal.value = false
}

const handleCustomSnooze = () => {
  if (customSnoozeDate.value && customSnoozeTime.value) {
    emit('snooze', `${customSnoozeDate.value}T${customSnoozeTime.value}`)
    showSnoozeModal.value = false
    customSnoozeDate.value = ''
    customSnoozeTime.value = ''
  }
}
</script>

<style scoped>
.reminder-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.reminder-type-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
}

.type-icon {
  font-size: 1.25rem;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-overdue {
  background: #f8d7da;
  color: #721c24;
}

.status-upcoming {
  background: #d1ecf1;
  color: #0c5460;
}

.status-pending {
  background: #e2e3e5;
  color: #383d41;
}

.detail-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.reminder-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #2c3e50;
  line-height: 1.2;
}

.reminder-description {
  margin-bottom: 32px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.reminder-description p {
  margin: 0;
  color: #555;
  line-height: 1.6;
  font-size: 1.125rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.info-item {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1.125rem;
  color: #2c3e50;
  font-weight: 500;
}

.countdown {
  margin-top: 8px;
  color: #4caf50;
  font-weight: 600;
  font-size: 1rem;
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.alert-warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.alert-success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
}

.alert p {
  margin: 0;
  font-size: 0.875rem;
}

.detail-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.primary-actions,
.secondary-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.snooze-content {
  padding: 4px;
}

.snooze-description {
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.5;
}

.snooze-options {
  margin-bottom: 32px;
}

.snooze-options h4,
.custom-snooze h4 {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
}

.snooze-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.snooze-button {
  padding: 12px;
  justify-content: center;
}

.custom-snooze {
  border-top: 1px solid #e0e0e0;
  padding-top: 24px;
}

.snooze-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

@media (max-width: 768px) {
  .reminder-detail {
    padding: 16px;
  }

  .detail-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .detail-content {
    padding: 20px;
  }

  .reminder-title {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .detail-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .primary-actions,
  .secondary-actions {
    justify-content: center;
  }

  .snooze-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
