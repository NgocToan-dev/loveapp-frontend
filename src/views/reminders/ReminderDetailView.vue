<template>
  <div class="reminder-detail-view">
    <v-container fluid class="pa-0">
      <!-- Loading State -->
      <div v-if="isLoading" class="d-flex justify-center align-center pa-8">
        <v-progress-circular indeterminate color="primary" size="48" />
      </div>

      <!-- Error State -->
      <div v-else-if="error && formType === 'view'" class="d-flex flex-column justify-center align-center pa-8">
        <v-icon icon="mdi-alert-circle" size="48" color="error" class="mb-4" />
        <h3 class="text-h6 mb-2">{{ t('common.error') }}</h3>
        <p class="text-body-2 text-center">{{ error }}</p>
        <v-btn
          variant="outlined"
          color="primary"
          @click="fetchReminder"
          class="mt-4"
        >
          {{ t('common.retry') }}
        </v-btn>
      </div>

      <!-- Form Mode (Create/Edit) -->
      <div v-if="formType === 'create' || formType === 'edit'" class="reminder-form">
        <!-- Header -->
        <div class="detail-header">
          <div class="header-background">
            <div class="header-overlay"></div>
          </div>
          <div class="header-content">
            <v-container>
              <div class="d-flex align-center mb-4">
                <v-btn
                  icon
                  variant="text"
                  @click="goBack"
                  class="mr-2"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <div class="flex-grow-1">
                  <h1 class="text-h4 font-weight-bold">
                    {{ formType === 'create' ? t('reminders.create') : t('reminders.edit') }}
                  </h1>
                </div>
                <div class="d-flex align-center">
                  <v-btn
                    variant="text"
                    color="error"
                    @click="goBack"
                  >
                    {{ t('common.cancel') }}
                  </v-btn>
                </div>
              </div>
            </v-container>
          </div>
        </div>

        <!-- Form Content -->
        <v-container class="py-8">
          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <v-card rounded="xl" elevation="0" class="reminder-form-card">
                <v-card-text class="pa-6">
                  <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="formData.title"
                          :label="t('reminders.form.title')"
                          :rules="titleRules"
                          variant="outlined"
                          rounded="xl"
                          required
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="formData.description"
                          :label="t('reminders.form.description')"
                          variant="outlined"
                          rounded="xl"
                          rows="3"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.reminderDate"
                          :label="t('reminders.form.date')"
                          type="datetime-local"
                          variant="outlined"
                          rounded="xl"
                          :rules="dateRules"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="formData.repeat"
                          :items="repeatOptions"
                          :label="t('reminders.form.repeat')"
                          variant="outlined"
                          rounded="xl"
                          clearable
                        />
                      </v-col>
                      <v-col cols="12">
                        <div class="mb-3">
                          <label class="text-body-2 font-weight-medium text-medium-emphasis">
                            {{ t('reminders.form.priority') }}
                          </label>
                        </div>
                        <v-chip-group v-model="formData.priority" mandatory variant="tonal">
                          <v-chip
                            v-for="opt in priorityOptions"
                            :key="opt.value"
                            :value="opt.value"
                            :color="opt.color"
                            class="ma-1"
                          >
                            <v-icon start size="16">{{ opt.icon }}</v-icon>
                            {{ opt.label }}
                          </v-chip>
                        </v-chip-group>
                      </v-col>
                      <v-col cols="12" v-if="formType === 'edit'">
                        <v-switch 
                          v-model="formData.isCompleted" 
                          :label="t('reminders.form.completed')" 
                          color="success" 
                        />
                      </v-col>
                    </v-row>

                    <v-row class="mt-4">
                      <v-col cols="12">
                        <div class="d-flex justify-end ga-3">
                          <v-btn
                            variant="outlined"
                            rounded="xl"
                            size="large"
                            @click="goBack"
                          >
                            {{ t('common.cancel') }}
                          </v-btn>
                          <v-btn
                            color="primary"
                            rounded="xl"
                            size="large"
                            :loading="isSubmitting"
                            :disabled="!formValid"
                            @click="handleSubmit"
                          >
                            <v-icon start>{{ formType === 'create' ? 'mdi-plus' : 'mdi-content-save' }}</v-icon>
                            {{ formType === 'create' ? t('reminders.create') : t('reminders.update') }}
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- View Mode -->
      <div v-else-if="reminder && formType === 'view'" class="reminder-detail">
        <!-- Header -->
        <div class="detail-header">
          <div class="header-background">
            <div class="header-overlay"></div>
          </div>
          <div class="header-content">
            <v-container>
              <div class="d-flex align-center mb-4">
                <v-btn
                  icon
                  variant="text"
                  @click="goBack"
                  class="mr-2"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <div class="flex-grow-1">
                  <div class="d-flex align-center">
                    <v-chip
                      :color="getStatusColor(reminder)"
                      variant="flat"
                      size="small"
                      class="mr-2"
                    >
                      <v-icon :icon="getPriorityIcon(reminder.priority)" start size="small" />
                      {{ reminder.priority }}
                    </v-chip>
                    <v-chip
                      :color="reminder.isCompleted ? 'success' : 'default'"
                      variant="outlined"
                      size="small"
                    >
                      {{ reminder.isCompleted ? t('reminders.completed') : getStatusText(reminder) }}
                    </v-chip>
                  </div>
                </div>
                <div class="d-flex align-center">
                  <v-btn
                    icon
                    variant="text"
                    @click="editReminder"
                    class="mr-2"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    @click="deleteReminder"
                    color="error"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>

              <h1 class="text-h4 font-weight-bold mb-2">{{ reminder.title }}</h1>
              <p v-if="reminder.description" class="text-h6 mb-4 text-medium-emphasis">
                {{ reminder.description }}
              </p>
            </v-container>
          </div>
        </div>

        <!-- Main Content -->
        <v-container class="py-8">
          <v-row>
            <!-- Primary Content -->
            <v-col cols="12" md="8">
              <v-card rounded="xl" elevation="0" class="mb-6">
                <v-card-title class="pb-2">
                  <v-icon icon="mdi-information" class="mr-2" />
                  {{ t('reminders.details') }}
                </v-card-title>
                <v-card-text>
                  <div class="reminder-details">
                    <div class="detail-item mb-4">
                      <div class="detail-label">{{ t('reminders.reminderDate') }}</div>
                      <div class="detail-value">
                        <v-icon icon="mdi-calendar" class="mr-2" />
                        {{ formatDate(reminder.reminderDate) }}
                      </div>
                    </div>

                    <div class="detail-item mb-4">
                      <div class="detail-label">{{ t('reminders.reminderTime') }}</div>
                      <div class="detail-value">
                        <v-icon icon="mdi-clock" class="mr-2" />
                        {{ formatTime(reminder.reminderDate) }}
                      </div>
                    </div>

                    <div class="detail-item mb-4">
                      <div class="detail-label">{{ t('reminders.priority') }}</div>
                      <div class="detail-value">
                        <v-icon :icon="getPriorityIcon(reminder.priority)" class="mr-2" />
                        {{ reminder.priority }}
                      </div>
                    </div>

                    <div v-if="reminder.isCompleted" class="detail-item mb-4">
                      <div class="detail-label">{{ t('reminders.completedAt') }}</div>
                      <div class="detail-value">
                        <v-icon icon="mdi-check-circle" class="mr-2" color="success" />
                        {{ reminder.completedAt ? formatDate(reminder.completedAt) : t('common.unknown') }}
                      </div>
                    </div>

                    <div class="detail-item mb-4">
                      <div class="detail-label">{{ t('reminders.createdAt') }}</div>
                      <div class="detail-value">
                        <v-icon icon="mdi-calendar-plus" class="mr-2" />
                        {{ formatDate(reminder.createdAt) }}
                      </div>
                    </div>

                    <div class="detail-item">
                      <div class="detail-label">{{ t('reminders.updatedAt') }}</div>
                      <div class="detail-value">
                        <v-icon icon="mdi-calendar-edit" class="mr-2" />
                        {{ formatDate(reminder.updatedAt) }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Sidebar -->
            <v-col cols="12" md="4">
              <!-- Quick Actions -->
              <v-card rounded="xl" elevation="0" class="mb-6">
                <v-card-title class="pb-2">
                  <v-icon icon="mdi-flash" class="mr-2" />
                  {{ t('common.quickActions') }}
                </v-card-title>
                <v-card-text>
                  <div class="d-flex flex-column ga-2">
                    <v-btn
                      variant="outlined"
                      color="primary"
                      @click="editReminder"
                      block
                    >
                      <v-icon icon="mdi-pencil" start />
                      {{ t('common.edit') }}
                    </v-btn>
                    
                    <v-btn
                      :variant="reminder.isCompleted ? 'outlined' : 'flat'"
                      :color="reminder.isCompleted ? 'default' : 'success'"
                      @click="toggleComplete"
                      block
                    >
                      <v-icon :icon="reminder.isCompleted ? 'mdi-refresh' : 'mdi-check'" start />
                      {{ reminder.isCompleted ? t('reminders.markIncomplete') : t('reminders.markComplete') }}
                    </v-btn>
                    
                    <v-btn
                      variant="outlined"
                      color="error"
                      @click="deleteReminder"
                      block
                    >
                      <v-icon icon="mdi-delete" start />
                      {{ t('common.delete') }}
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Status Card -->
              <v-card rounded="xl" elevation="0" class="mb-6">
                <v-card-title class="pb-2">
                  <v-icon icon="mdi-information-variant" class="mr-2" />
                  {{ t('reminders.status') }}
                </v-card-title>
                <v-card-text>
                  <div class="status-indicator d-flex align-center mb-2">
                    <v-icon
                      :icon="reminder.isCompleted ? 'mdi-check-circle' : 'mdi-clock'"
                      :color="reminder.isCompleted ? 'success' : getStatusColor(reminder)"
                      class="mr-2"
                    />
                    <span class="font-weight-medium">{{ getStatusText(reminder) }}</span>
                  </div>
                  <p class="text-caption text-medium-emphasis">
                    {{ getStatusDescription(reminder) }}
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useRemindersStore } from '@/stores/reminders'
import { useDialogsStore } from '@/stores/dialogs'
import type { Reminder } from '@/types'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const remindersStore = useRemindersStore()
const dialogsStore = useDialogsStore()

// Determine form type based on route
const formType = ref<'view' | 'edit' | 'create'>('view')

// State for view mode
const reminder = ref<Reminder | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// State for form mode
const formRef = ref()
const formValid = ref(false)
const isSubmitting = ref(false)
const formData = ref<Partial<Reminder>>({
  title: '',
  description: '',
  reminderDate: '',
  priority: 'medium',
  repeat: undefined,
  isCompleted: false
})

// Form validation rules
const titleRules = [
  (v: string) => !!v || t('validation.required')
]

const dateRules = [
  (v: string) => !!v || t('validation.required')
]

// Form options
const priorityOptions = computed(() => [
  { value: 'low', label: t('reminders.priority.low'), icon: 'mdi-arrow-down', color: 'success' },
  { value: 'medium', label: t('reminders.priority.medium'), icon: 'mdi-minus', color: 'warning' },
  { value: 'high', label: t('reminders.priority.high'), icon: 'mdi-arrow-up', color: 'error' }
])

const repeatOptions = computed(() => [
  { title: t('reminders.repeat.none'), value: undefined },
  { title: t('reminders.repeat.daily'), value: 'daily' },
  { title: t('reminders.repeat.weekly'), value: 'weekly' },
  { title: t('reminders.repeat.monthly'), value: 'monthly' },
  { title: t('reminders.repeat.yearly'), value: 'yearly' }
])

// Determine form type on route change
const determineFormType = () => {
  const routeName = route.name as string
  const isCreate = routeName === 'create-reminder' || route.path === '/reminders/create'
  const isEdit = routeName === 'edit-reminder' || route.path.includes('/edit')
  
  if (isCreate) {
    formType.value = 'create'
    isLoading.value = false
    // Initialize form with default values for create
    formData.value = {
      title: '',
      description: '',
      reminderDate: '',
      priority: 'medium',
      repeat: undefined,
      isCompleted: false
    }
  } else if (isEdit) {
    formType.value = 'edit'
  } else {
    formType.value = 'view'
  }
}

// Initialize form data for edit mode
const initializeFormData = (reminderData: Reminder) => {
  formData.value = {
    title: reminderData.title,
    description: reminderData.description,
    reminderDate: reminderData.reminderDate ? new Date(reminderData.reminderDate).toISOString().slice(0, 16) : '',
    priority: reminderData.priority,
    repeat: reminderData.repeat,
    isCompleted: reminderData.isCompleted || false
  }
}

const fetchReminder = async () => {
  if (formType.value === 'create') return
  
  try {
    isLoading.value = true
    error.value = null
    const id = route.params.id as string
    
    const fetchedReminder = await remindersStore.fetchReminderById(id)
    if (fetchedReminder) {
      reminder.value = fetchedReminder
      
      // If in edit mode, initialize form data
      if (formType.value === 'edit') {
        initializeFormData(fetchedReminder)
      }
    } else {
      error.value = t('reminders.notFound')
    }
  } catch (err) {
    console.error('Failed to fetch reminder:', err)
    error.value = t('reminders.fetchError')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/reminders')
}

const editReminder = () => {
  if (reminder.value) {
    formType.value = 'edit'
    initializeFormData(reminder.value)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  try {
    isSubmitting.value = true
    
    if (formType.value === 'create') {
      // Create new reminder
      const newReminder = await remindersStore.createReminder({
        ...formData.value,
        reminderDate: new Date(formData.value.reminderDate!),
      } as Reminder)
      
      // Redirect to view mode of created reminder
      router.push({ name: 'reminder-detail', params: { id: newReminder.id } })
    } else if (formType.value === 'edit' && reminder.value) {
      // Update existing reminder
      const updatedReminder = await remindersStore.updateReminder(reminder.value.id, {
        ...formData.value,
        reminderDate: formData.value.reminderDate ? new Date(formData.value.reminderDate) : undefined,
      })
      
      // Update local reminder and switch back to view mode
      reminder.value = updatedReminder
      formType.value = 'view'
    }
  } catch (error) {
    console.error('Failed to save reminder:', error)
  } finally {
    isSubmitting.value = false
  }
}

const deleteReminder = async () => {
  if (!reminder.value) return

  try {
    const confirmed = await dialogsStore.openConfirmDialog({
      title: t('reminders.confirmDeleteTitle'),
      message: t('reminders.confirmDelete', { title: reminder.value.title }),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
    })

    if (confirmed) {
      await remindersStore.deleteReminder(reminder.value.id)
      router.push('/reminders')
    }
  } catch (error) {
    console.error('Failed to delete reminder:', error)
  }
}

const toggleComplete = async () => {
  if (!reminder.value) return

  try {
    if (!reminder.value.isCompleted) {
      // Mark as complete
      const updatedReminder = await remindersStore.completeReminder(reminder.value.id)
      reminder.value = updatedReminder
    } else {
      // Mark as incomplete using uncompleteReminder
      const updatedReminder = await remindersStore.uncompleteReminder(reminder.value.id)
      reminder.value = updatedReminder
    }
  } catch (error) {
    console.error('Failed to toggle reminder completion:', error)
  }
}

const formatDate = (date: string | Date | { _seconds: number; _nanoseconds: number }) => {
  if (!date) return ''
  
  let dateObj: Date
  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    // Firestore timestamp
    dateObj = new Date(date._seconds * 1000)
  }
  
  return dateObj.toLocaleDateString()
}

const formatTime = (date: string | Date | { _seconds: number; _nanoseconds: number }) => {
  if (!date) return ''
  
  let dateObj: Date
  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    // Firestore timestamp
    dateObj = new Date(date._seconds * 1000)
  }
  
  return dateObj.toLocaleTimeString()
}

const getPriorityIcon = (priority: string) => {
  const icons: Record<string, string> = {
    high: 'mdi-chevron-triple-up',
    medium: 'mdi-chevron-double-up',
    low: 'mdi-chevron-up',
  }
  return icons[priority] || 'mdi-bell'
}

const getStatusColor = (reminder: Reminder) => {
  if (reminder.isCompleted) return 'success'

  const now = new Date()
  const reminderDate = new Date(reminder.reminderDate)

  if (reminderDate < now) return 'warning' // overdue

  const timeDiff = reminderDate.getTime() - now.getTime()
  const daysDiff = timeDiff / (1000 * 3600 * 24)

  if (daysDiff <= 1) return 'error' // due soon
  if (daysDiff <= 7) return 'orange' // due this week

  return 'info' // upcoming
}

const getStatusText = (reminder: Reminder) => {
  if (reminder.isCompleted) return t('reminders.completed')

  const now = new Date()
  const reminderDate = new Date(reminder.reminderDate)

  if (reminderDate < now) return t('reminders.overdue')

  const timeDiff = reminderDate.getTime() - now.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (daysDiff <= 1) return t('reminders.dueSoon')
  if (daysDiff <= 7) return t('reminders.dueThisWeek')

  return t('reminders.upcoming')
}

const getStatusDescription = (reminder: Reminder) => {
  if (reminder.isCompleted) {
    return t('reminders.statusCompleted')
  }

  const now = new Date()
  const reminderDate = new Date(reminder.reminderDate)

  if (reminderDate < now) {
    return t('reminders.statusOverdue')
  }

  const timeDiff = reminderDate.getTime() - now.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (daysDiff <= 1) return t('reminders.statusDueSoon')
  if (daysDiff <= 7) return t('reminders.statusDueThisWeek')

  return t('reminders.statusUpcoming')
}

// Watch for route changes
watch(() => route.path, () => {
  determineFormType()
  if (formType.value !== 'create') {
    fetchReminder()
  }
}, { immediate: true })

onMounted(() => {
  determineFormType()
  if (formType.value !== 'create') {
    fetchReminder()
  }
})
</script>

<style scoped>
.reminder-detail-view {
  min-height: 100vh;
}

.detail-header {
  position: relative;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: white;
  padding: 2rem 0;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/api/placeholder/1200/400') center/cover;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.header-content {
  position: relative;
  z-index: 1;
}

.reminder-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface));
}

.status-indicator {
  font-size: 1.1rem;
}

.reminder-form-card {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline-variant));
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .detail-header {
    padding: 1rem 0;
  }
  
  .detail-item {
    gap: 0.25rem;
  }
  
  .detail-label {
    font-size: 0.75rem;
  }
  
  .detail-value {
    font-size: 0.875rem;
  }
}
</style>
