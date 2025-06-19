<template>
  <v-card max-width="700" rounded="xl">
    <v-card-title class="text-h5 font-weight-bold pa-6">
      <v-icon color="warning" class="mr-2">mdi-bell-plus</v-icon>
      {{ $t('reminders.createNew') || 'Create New Reminder' }}
    </v-card-title>    <v-card-text class="pa-6">
      <!-- Error Alert -->
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-4"
        closable
        @click:close="errorMessage = ''"
      >
        {{ errorMessage }}
      </v-alert>

      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit" :disabled="isLoading">
        <!-- Title Section -->
        <v-card variant="outlined" class="mb-4">
          <v-card-subtitle class="text-overline font-weight-bold pb-0">
            <v-icon size="small" class="mr-1">mdi-format-title</v-icon>
            REMINDER DETAILS
          </v-card-subtitle>
          <v-card-text class="pt-2">
            <v-text-field
              v-model="formData.title"
              :label="$t('reminders.title') || 'What do you want to be reminded about?'"
              :rules="titleRules"
              variant="solo-filled"
              density="comfortable"
              required
              counter="100"
              maxlength="100"
              hide-details="auto"
            ></v-text-field>
          </v-card-text>
        </v-card>

        <!-- Date & Priority Section -->
        <v-card variant="outlined" class="mb-4">
          <v-card-subtitle class="text-overline font-weight-bold pb-0">
            <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
            TIMING & IMPORTANCE
          </v-card-subtitle>
          <v-card-text class="pt-2">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.reminderDate"
                  :label="$t('reminders.date') || 'When should we remind you?'"
                  :rules="dateRules"
                  variant="solo-filled"
                  density="comfortable"
                  prepend-inner-icon="mdi-calendar"
                  type="datetime-local"
                  required
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="text-subtitle-2 text-medium-emphasis mb-2">
                  <v-icon size="small" class="mr-1">mdi-flag</v-icon>
                  Priority Level
                </div>
                <v-chip-group
                  v-model="formData.priority"
                  selected-class="text-warning"
                  mandatory
                  variant="elevated"
                >
                  <v-chip
                    v-for="option in priorityOptions"
                    :key="option.value"
                    :value="option.value"
                    :color="option.value === 'high' ? 'error' : option.value === 'medium' ? 'warning' : 'success'"
                    variant="outlined"
                    size="small"
                  >
                    <v-icon start :icon="getPriorityIcon(option.value)"></v-icon>
                    {{ option.title }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Additional Options Section -->
        <v-card variant="outlined" class="mb-4">
          <v-card-subtitle class="text-overline font-weight-bold pb-0">
            <v-icon size="small" class="mr-1">mdi-cog</v-icon>
            ADDITIONAL OPTIONS
          </v-card-subtitle>
          <v-card-text class="pt-2">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.repeat"
                  :items="repeatOptions"
                  :label="$t('reminders.repeat') || 'Repeat this reminder'"
                  variant="solo-filled"
                  density="comfortable"
                  prepend-inner-icon="mdi-repeat"
                  clearable
                  hide-details="auto"
                  attach
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="formData.description"
                  :label="$t('reminders.description') || 'Add a note (optional)'"
                  variant="solo-filled"
                  density="comfortable"
                  rows="2"
                  counter
                  no-resize
                  hide-details="auto"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
    </v-card-text>

    <v-card-actions class="pa-6">
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        @click="$emit('cancel')"
      >
        {{ $t('common.cancel') || 'Cancel' }}
      </v-btn>
      <v-btn
        color="warning"
        variant="elevated"
        :loading="isLoading"
        :disabled="!valid"
        @click="handleSubmit"
        prepend-icon="mdi-bell"
      >
        {{ $t('reminders.save') || 'Save Reminder' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRemindersStore } from '@/stores/reminders'

const { t } = useI18n()
const remindersStore = useRemindersStore()

// Form references
const form = ref()
const valid = ref(false)

// Helper function to format date for datetime-local input
const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Reactive data
const formData = ref({
  title: '',
  description: '',
  reminderDate: formatDateTimeLocal(new Date()), // Default to current date/time in correct format
  priority: 'medium' as 'low' | 'medium' | 'high',
  repeat: '' as '' | 'daily' | 'weekly' | 'monthly' | 'yearly'
})

const isLoading = ref(false)
const errorMessage = ref('')

// Computed
const priorityOptions = computed(() => [
  { title: 'Low', value: 'low' },
  { title: 'Medium', value: 'medium' },
  { title: 'High', value: 'high' }
])

const repeatOptions = computed(() => [
  { title: 'Daily', value: 'daily' },
  { title: 'Weekly', value: 'weekly' },
  { title: 'Monthly', value: 'monthly' },
  { title: 'Yearly', value: 'yearly' }
])

// Validation rules
const titleRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required',
  (v: string) => (v && v.length <= 100) || t('validation.maxLength', { max: 100 }) || 'Maximum 100 characters'
]

const dateRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required',
  (v: string) => {
    if (!v) return true
    const selectedDate = new Date(v)
    const now = new Date()
    return selectedDate >= now || t('validation.futureDate') || 'Reminder date must be in the future'
  }
]

const priorityRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required'
]

// Helper functions
const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'mdi-flag'
    case 'medium':
      return 'mdi-flag-outline'
    case 'low':
      return 'mdi-flag-variant'
    default:
      return 'mdi-flag-outline'
  }
}

// Events
const emit = defineEmits<{
  confirm: [data: any]
  cancel: []
}>()

// Methods
const handleSubmit = async () => {
  if (!valid.value) return

  try {
    isLoading.value = true
      // Create reminder using store
    const newReminder = await remindersStore.createReminder({
      title: formData.value.title,
      description: formData.value.description,
      reminderDate: new Date(formData.value.reminderDate), // Convert string to Date
      priority: formData.value.priority,
      repeat: formData.value.repeat || undefined
    })
    
    // Emit success with the created reminder
    emit('confirm', newReminder)
  } catch (error) {
    console.error('Error creating reminder:', error)
    // Could show error toast here
  } finally {
    isLoading.value = false
  }
}
</script>
