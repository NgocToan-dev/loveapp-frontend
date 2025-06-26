<template>
  <div 
    class="reminder-card"
    :class="{ 
      completed: reminder.isCompleted, 
      overdue: isOverdue,
      upcoming: isUpcoming 
    }"
  >
    <!-- Reminder Header -->
    <div class="reminder-header">
      <div class="reminder-type-icon">
        {{ getReminderIcon(reminder.type) }}
      </div>
      
      <div class="reminder-info">
        <h3 class="reminder-title">{{ reminder.title }}</h3>
        <p v-if="reminder.description" class="reminder-description">
          {{ reminder.description }}
        </p>
      </div>

      <div class="reminder-actions">
        <Button
          @click="toggleComplete"
          :variant="reminder.isCompleted ? 'outline' : 'primary'"
          size="small"
          :loading="isUpdating"
        >
          {{ reminder.isCompleted ? $t('reminders.mark_incomplete') : $t('reminders.mark_complete') }}
        </Button>
        
        <Dropdown>
          <template #trigger>
            <Button variant="ghost" size="small" class="more-actions">
              ⋯
            </Button>
          </template>
          
          <DropdownItem @click="$emit('edit', reminder)">
            {{ $t('common.actions.edit') }}
          </DropdownItem>
          
          <DropdownItem 
            v-if="!reminder.isCompleted && !isOverdue"
            @click="showSnoozeDialog = true"
          >
            {{ $t('reminders.snooze') }}
          </DropdownItem>
          
          <DropdownItem @click="showDeleteConfirm = true" class="danger">
            {{ $t('common.actions.delete') }}
          </DropdownItem>
        </Dropdown>
      </div>
    </div>

    <!-- Reminder Details -->
    <div class="reminder-details">
      <div class="detail-item">
        <span class="detail-icon">📅</span>
        <span class="detail-text">
          {{ formatDateTime(reminder.reminderDate, reminder.reminderTime) }}
        </span>
      </div>

      <div v-if="reminder.isRecurring" class="detail-item">
        <span class="detail-icon">🔄</span>
        <span class="detail-text">
          {{ $t(`reminders.recurring.${reminder.recurringType}`) }}
        </span>
      </div>

      <div v-if="isUpcoming && !reminder.isCompleted" class="detail-item countdown">
        <span class="detail-icon">⏰</span>
        <span class="detail-text countdown-text">
          {{ formatCountdown(reminderDateTime) }}
        </span>
      </div>

      <div v-if="isOverdue && !reminder.isCompleted" class="detail-item overdue">
        <span class="detail-icon">⚠️</span>
        <span class="detail-text">
          {{ $t('reminders.overdue') }}
        </span>
      </div>
    </div>

    <!-- Reminder Footer -->
    <div class="reminder-footer">
      <div class="reminder-meta">
        <span class="created-by">
          {{ $t('reminders.created_by') }}: {{ reminder.author?.firstName || 'Unknown' }}
        </span>
        <span class="created-date">
          {{ formatDate(reminder.createdAt, 'relative') }}
        </span>
      </div>

      <div v-if="reminder.type !== 'custom'" class="reminder-type-badge">
        {{ $t(`reminders.types.${reminder.type}`) }}
      </div>
    </div>

    <!-- Snooze Dialog -->
    <Modal v-model="showSnoozeDialog" :title="$t('reminders.snooze_reminder')">
      <div class="snooze-options">
        <p>{{ $t('reminders.snooze_description') }}</p>
        
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

        <div class="custom-snooze">
          <h4>{{ $t('reminders.custom_snooze') }}</h4>
          <div class="snooze-form">
            <Input
              v-model="customSnoozeDate"
              type="date"
              :label="$t('reminders.snooze_until_date')"
            />
            <Input
              v-model="customSnoozeTime"
              type="time"
              :label="$t('reminders.snooze_until_time')"
            />
            <Button
              @click="handleCustomSnooze"
              :disabled="!customSnoozeDate || !customSnoozeTime"
            >
              {{ $t('reminders.snooze') }}
            </Button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Delete Confirmation -->
    <ConfirmModal
      v-model="showDeleteConfirm"
      :title="$t('reminders.confirm_delete')"
      :message="$t('reminders.delete_warning')"
      confirmText="common.actions.delete"
      confirmVariant="danger"
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
import Dropdown from '@/components/common/Dropdown.vue'
import DropdownItem from '@/components/common/DropdownItem.vue'
import Modal from '@/components/common/Modal.vue'
import Input from '@/components/common/Input.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

interface Props {
  reminder: Reminder
  isUpdating?: boolean
}

interface Emits {
  edit: [reminder: Reminder]
  delete: [id: string]
  toggleComplete: [id: string]
  snooze: [id: string, snoozeUntil: string]
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

const toggleComplete = () => {
  emit('toggleComplete', props.reminder.id)
}

const handleSnooze = (minutes: number) => {
  const snoozeUntil = new Date()
  snoozeUntil.setMinutes(snoozeUntil.getMinutes() + minutes)
  
  const snoozeDate = snoozeUntil.toISOString().split('T')[0]
  const snoozeTime = snoozeUntil.toTimeString().split(' ')[0].substring(0, 5)
  
  emit('snooze', props.reminder.id, `${snoozeDate}T${snoozeTime}`)
  showSnoozeDialog.value = false
}

const handleCustomSnooze = () => {
  if (customSnoozeDate.value && customSnoozeTime.value) {
    emit('snooze', props.reminder.id, `${customSnoozeDate.value}T${customSnoozeTime.value}`)
    showSnoozeDialog.value = false
    customSnoozeDate.value = ''
    customSnoozeTime.value = ''
  }
}
</script>

<style scoped>
.reminder-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.completed {
    opacity: 0.7;
    background: #f8f9fa;
    
    .reminder-title {
      text-decoration: line-through;
      color: #666;
    }
  }

  &.overdue {
    border-left: 4px solid #f44336;
    background: #fff5f5;
  }

  &.upcoming {
    border-left: 4px solid #4caf50;
    background: #f8fff8;
  }
}

.reminder-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.reminder-type-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
  flex-shrink: 0;
}

.reminder-info {
  flex: 1;
}

.reminder-title {
  margin: 0 0 4px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
}

.reminder-description {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
}

.reminder-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.more-actions {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.reminder-details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }

  &.countdown {
    color: #4caf50;
    font-weight: 500;
  }

  &.overdue {
    color: #f44336;
    font-weight: 500;
  }
}

.detail-icon {
  font-size: 0.875rem;
  width: 16px;
  text-align: center;
}

.detail-text {
  font-size: 0.875rem;
}

.countdown-text {
  font-weight: 600;
}

.reminder-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.reminder-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.75rem;
  color: #888;
}

.reminder-type-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.snooze-options {
  p {
    margin: 0 0 16px 0;
    color: #666;
  }
}

.snooze-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.snooze-button {
  padding: 12px;
}

.custom-snooze {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;

  h4 {
    margin: 0 0 12px 0;
    font-size: 1rem;
  }
}

.snooze-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 768px) {
  .reminder-header {
    flex-direction: column;
    align-items: stretch;
  }

  .reminder-actions {
    justify-content: flex-end;
    margin-top: 12px;
  }

  .reminder-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .snooze-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
