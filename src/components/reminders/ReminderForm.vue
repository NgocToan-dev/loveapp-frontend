<template>
  <div class="reminder-form relative">
    <div
      v-if="!isConnected"
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
    >
      <p class="text-red-500 font-medium">{{ $t('reminders.errors.no_couple') }}</p>
    </div>
    <form @submit.prevent="handleSubmit">
      <!-- Title Field -->
      <div class="form-group mt-4">
        <Input
          v-model="form.title"
          :label="$t('reminders.form.title')"
          :placeholder="$t('reminders.form.title_placeholder')"
          required
          :errorMessage="errors.title"
          @blur="validateField('title')"
        />
      </div>

      <!-- Description Field -->
      <div class="form-group">
        <Input
          v-model="form.description"
          type="textarea"
          :label="$t('reminders.form.description')"
          :placeholder="$t('reminders.form.description_placeholder')"
          :rows="3"
        />
      </div>

      <!-- Type Selection -->
      <div class="form-group">
        <label class="form-label">{{ $t('reminders.form.type') }}</label>
        <div class="type-selector">
          <Button
            v-for="type in reminderTypes"
            :key="type.value"
            :variant="form.type === type.value ? 'primary' : 'outline'"
            @click="form.type = type.value"
            class="type-button"
            type="button"
          >
            <span class="type-icon">{{ type.icon }}</span>
            {{ type.label }}
          </Button>
        </div>
      </div>

      <!-- Date and Time -->
      <div class="form-row">
        <div class="form-group">
          <Input
            v-model="form.reminderDate"
            type="date"
            :label="$t('reminders.form.date')"
            required
            :errorMessage="errors.reminderDate"
            @blur="validateField('reminderDate')"
          />
        </div>
        
        <div class="form-group">
          <Input
            v-model="form.reminderTime"
            type="time"
            :label="$t('reminders.form.time')"
            required
            :errorMessage="errors.reminderTime"
            @blur="validateField('reminderTime')"
          />
        </div>
      </div>

      <!-- Recurring Options -->
      <div class="form-group">
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="form.isRecurring"
              type="checkbox"
              class="checkbox-input"
            />
            <span class="checkbox-text">{{ $t('reminders.form.is_recurring') }}</span>
          </label>
        </div>

        <div v-if="form.isRecurring" class="recurring-options">
          <label class="form-label">{{ $t('reminders.form.recurring_type') }}</label>
          <div class="recurring-selector">
            <Button
              v-for="type in recurringTypes"
              :key="type.value"
              :variant="form.recurringType === type.value ? 'primary' : 'outline'"
              @click="form.recurringType = type.value"
              class="recurring-button"
              type="button"
              size="sm"
            >
              {{ type.label }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <Button
          @click="$emit('cancel')"
          variant="outline"
          type="button"
        >
          {{ $t('common.buttons.cancel') }}
        </Button>
        
        <Button
          type="submit"
          :loading="isSubmitting"
          :disabled="!isFormValid"
        >
          {{ isEditing ? $t('common.buttons.save') : $t('common.buttons.create') }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CreateReminderRequest, UpdateReminderRequest, Reminder } from '@/types'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import { useCouple } from '@/composables/useCouple'

// Local form interface for UI fields
interface LocalFormData {
  id?: string
  title: string
  description?: string
  reminderDate: string  // UI field
  reminderTime: string  // UI field
  type: Reminder['type']
  isRecurring: boolean  // UI field
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly' // UI field
}

interface Props {
  reminder?: Reminder
  isSubmitting?: boolean
}

interface Emits {
  submit: [data: CreateReminderRequest | UpdateReminderRequest]
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const { isConnected } = useCouple()

// Form state - using local interface for UI
const form = ref<LocalFormData>({
  title: '',
  description: '',
  reminderDate: '',
  reminderTime: '',
  type: 'custom',
  isRecurring: false,
  recurringType: undefined
})

const errors = ref<Record<string, string>>({})

// Computed
const isEditing = computed(() => !!props.reminder)

const reminderTypes = computed(() => [
  { value: 'anniversary' as const, label: t('reminders.types.anniversary'), icon: '💕' },
  { value: 'birthday' as const, label: t('reminders.types.birthday'), icon: '🎂' },
  { value: 'date' as const, label: t('reminders.types.date'), icon: '💝' },
  { value: 'custom' as const, label: t('reminders.types.custom'), icon: '⭐' }
])

const recurringTypes = computed(() => [
  { value: 'daily' as const, label: t('reminders.recurring.daily') },
  { value: 'weekly' as const, label: t('reminders.recurring.weekly') },
  { value: 'monthly' as const, label: t('reminders.recurring.monthly') },
  { value: 'yearly' as const, label: t('reminders.recurring.yearly') }
])

const isFormValid = computed(() => {
  return form.value.title.trim() && 
         form.value.reminderDate && 
         form.value.reminderTime &&
         Object.keys(errors.value).length === 0
})

// Methods
const validateField = (field: string) => {
  errors.value = { ...errors.value }
  delete errors.value[field]

  switch (field) {
    case 'title':
      if (!form.value.title.trim()) {
        errors.value.title = t('common.validation.required')
      }
      break
    case 'reminderDate':
      if (!form.value.reminderDate) {
        errors.value.reminderDate = t('common.validation.required')
      } else {
        // Khi sửa reminder, cho phép giữ nguyên ngày hiện tại hoặc quá khứ
        // Chỉ validate cho reminder mới
        if (!isEditing.value) {
          const selectedDate = new Date(form.value.reminderDate)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          if (selectedDate < today) {
            errors.value.reminderDate = t('reminders.validation.date_future')
          }
        }
      }
      break
    case 'reminderTime':
      if (!form.value.reminderTime) {
        errors.value.reminderTime = t('common.validation.required')
      }
      break
  }
}

const validateForm = () => {
  validateField('title')
  validateField('reminderDate')
  validateField('reminderTime')
}

const handleSubmit = () => {
  validateForm()
  
  if (isFormValid.value) {
    const data: any = { ...form.value }
    
    // Remove id if it's a create request
    if (!isEditing.value) {
      delete data.id
    }

    // Combine reminderDate and reminderTime into datetime field for backend
    if (data.reminderDate && data.reminderTime) {
      const datetime = new Date(`${data.reminderDate}T${data.reminderTime}`)
      data.datetime = datetime.toISOString()
    }

    // Map frontend fields to backend fields
    if (data.isRecurring && data.recurringType) {
      data.repeat = data.recurringType
    } else {
      data.repeat = 'none'
    }

    emit('submit', data as CreateReminderRequest | UpdateReminderRequest)
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    reminderDate: '',
    reminderTime: '',
    type: 'custom',
    isRecurring: false,
    recurringType: undefined
  }
  errors.value = {}
}

// Watchers
watch(() => props.reminder, (newReminder) => {
  if (newReminder) {
    // Extract date and time from datetime field for UI
    const datetime = new Date(newReminder.datetime)
    const dateStr = datetime.toISOString().split('T')[0]
    const timeStr = datetime.toTimeString().substring(0, 5)
    
    form.value = {
      id: newReminder.id,
      title: newReminder.title,
      description: newReminder.description || '',
      reminderDate: dateStr,
      reminderTime: timeStr,
      type: newReminder.type,
      isRecurring: newReminder.isRecurring,
      recurringType: newReminder.recurringType && newReminder.recurringType !== 'none' 
        ? newReminder.recurringType as 'daily' | 'weekly' | 'monthly' | 'yearly' 
        : undefined
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Set default date to today if creating new reminder
onMounted(() => {
  if (!isEditing.value && !form.value.reminderDate) {
    const today = new Date()
    form.value.reminderDate = today.toISOString().split('T')[0]
  }
})
</script>

<style scoped>
.reminder-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.type-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.type-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  min-height: 60px;

  .type-icon {
    font-size: 1.2rem;
  }
}

.checkbox-group {
  margin-bottom: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: #4caf50;
}

.checkbox-text {
  color: #2c3e50;
}

.recurring-options {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.recurring-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.recurring-button {
  padding: 8px 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .reminder-form {
    max-width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .type-selector {
    grid-template-columns: 1fr;
  }
  
  .recurring-selector {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
