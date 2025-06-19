<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <h1 class="text-h4 font-weight-bold text-orange">
              <v-icon icon="mdi-bell" class="mr-2"></v-icon>
              {{ $t('reminders.title') }}
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis">{{ $t('reminders.subtitle') }}</p>
          </div>
          <v-btn
            color="orange"
            prepend-icon="mdi-bell-plus"
            @click="createNewReminder"
          >
            {{ $t('reminders.create') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Reminders Statistics -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="orange" size="40" class="me-3">mdi-bell</v-icon>
              <div>
                <div class="text-h6">{{ stats.total }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('reminders.totalReminders') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="blue" size="40" class="me-3">mdi-clock-outline</v-icon>
              <div>
                <div class="text-h6">{{ stats.upcoming }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('reminders.upcoming') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="red" size="40" class="me-3">mdi-alert-circle</v-icon>
              <div>
                <div class="text-h6">{{ stats.overdue }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('reminders.overdue') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="green" size="40" class="me-3">mdi-check-circle</v-icon>
              <div>
                <div class="text-h6">{{ stats.completed }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('reminders.completed') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          :label="$t('reminders.search')"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="selectedPriority"
          :items="priorityOptions"
          :label="$t('reminders.priority')"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="selectedStatus"
          :items="statusOptions"
          :label="$t('reminders.status')"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          :label="$t('reminders.sortBy')"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn icon="mdi-view-grid" value="grid" />
          <v-btn icon="mdi-view-list" value="list" />
          <v-btn icon="mdi-timeline" value="timeline" />
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Reminders Grid View -->
    <v-row v-if="viewMode === 'grid'">
      <v-col
        v-for="reminder in filteredReminders"
        :key="reminder.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card hover @click="viewReminder(reminder)" class="reminder-card">
          <div 
            class="d-flex align-center justify-center reminder-header"
            :style="{ backgroundColor: getPriorityColor(reminder.priority) + '20' }"
          >
            <v-icon :color="getPriorityColor(reminder.priority)" size="48" class="my-4">
              {{ getStatusIcon(reminder) }}
            </v-icon>
          </div>

          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-2">
              <v-chip
                :color="getPriorityColor(reminder.priority)"
                size="small"
                variant="tonal"
              >
                {{ getPriorityLabel(reminder.priority) }}
              </v-chip>
              <v-chip 
                v-if="reminder.repeat" 
                color="purple" 
                size="small" 
                variant="tonal"
                prepend-icon="mdi-repeat"
              >
                {{ getRepeatLabel(reminder.repeat) }}
              </v-chip>
            </div>
            
            <div class="text-subtitle-1 font-weight-medium mb-1">
              {{ reminder.title }}
            </div>
            
            <div class="text-caption text-medium-emphasis mb-2">
              {{ formatDateTime(reminder.reminderDate) }}
              <span :class="getStatusClass(reminder)">
                ({{ getStatusText(reminder) }})
              </span>
            </div>
            
            <p v-if="reminder.description" class="text-body-2 reminder-description">
              {{ reminder.description }}
            </p>
          </v-card-text>

          <v-card-actions>
            <v-btn
              v-if="!reminder.isCompleted"
              icon="mdi-check"
              size="small"
              variant="text"
              color="success"
              @click.stop="completeReminder(reminder)"
            />
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click.stop="editReminder(reminder)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click.stop="deleteReminder(reminder)"
            />
            <v-spacer />
            <v-btn
              icon="mdi-share-variant"
              size="small"
              variant="text"
              @click.stop="shareReminder(reminder)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reminders List View -->
    <v-row v-if="viewMode === 'list'">
      <v-col cols="12">
        <v-card>
          <v-list>
            <v-list-item
              v-for="reminder in filteredReminders"
              :key="reminder.id"
              @click="viewReminder(reminder)"
            >
              <template #prepend>
                <v-avatar :color="getPriorityColor(reminder.priority)">
                  <v-icon>{{ getStatusIcon(reminder) }}</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>{{ reminder.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDateTime(reminder.reminderDate) }} • {{ getPriorityLabel(reminder.priority) }}
                <v-chip 
                  v-if="reminder.repeat" 
                  color="purple" 
                  size="x-small" 
                  variant="tonal" 
                  class="ml-2"
                >
                  {{ getRepeatLabel(reminder.repeat) }}
                </v-chip>
              </v-list-item-subtitle>

              <template #append>
                <div class="d-flex align-center">
                  <span :class="getStatusClass(reminder) + ' text-caption mr-2'">
                    {{ getStatusText(reminder) }}
                  </span>
                  <v-menu>
                    <template #activator="{ props }">
                      <v-btn
                        icon="mdi-dots-vertical"
                        size="small"
                        variant="text"
                        v-bind="props"
                        @click.stop
                      />
                    </template>
                    <v-list>
                      <v-list-item
                        v-if="!reminder.isCompleted"
                        prepend-icon="mdi-check"
                        :title="$t('reminders.markAsCompleted')"
                        @click="completeReminder(reminder)"
                      />
                      <v-list-item
                        prepend-icon="mdi-pencil"
                        :title="$t('common.edit')"
                        @click="editReminder(reminder)"
                      />
                      <v-list-item
                        prepend-icon="mdi-delete"
                        :title="$t('common.delete')"
                        @click="deleteReminder(reminder)"
                      />
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Timeline View -->
    <v-row v-if="viewMode === 'timeline'">
      <v-col cols="12">
        <v-timeline side="end">
          <v-timeline-item
            v-for="reminder in filteredReminders"
            :key="reminder.id"
            :dot-color="getPriorityColor(reminder.priority)"
            size="small"
          >
            <template #icon>
              <v-icon>{{ getStatusIcon(reminder) }}</v-icon>
            </template>

            <v-card @click="viewReminder(reminder)">
              <v-card-title class="text-h6">
                {{ reminder.title }}
              </v-card-title>
              <v-card-subtitle>
                {{ formatDateTime(reminder.reminderDate) }}
                <v-chip 
                  v-if="reminder.repeat" 
                  color="purple" 
                  size="small" 
                  variant="tonal" 
                  class="ml-2"
                >
                  {{ getRepeatLabel(reminder.repeat) }}
                </v-chip>
              </v-card-subtitle>
              <v-card-text v-if="reminder.description">
                {{ reminder.description }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-if="!loading && (!reminders || reminders.length === 0)">
      <v-col cols="12" class="text-center py-12">
        <v-icon size="120" color="grey-lighten-2">mdi-bell-outline</v-icon>
        <h3 class="text-h5 mt-4 mb-2">{{ $t('reminders.noReminders') }}</h3>
        <p class="text-body-1 text-medium-emphasis mb-4">{{ $t('reminders.noRemindersDescription') }}</p>
        <v-btn
          color="orange"
          prepend-icon="mdi-bell-plus"
          @click="createNewReminder"
        >
          {{ $t('reminders.createFirst') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="orange" size="64" />
        <p class="text-body-1 mt-4">{{ $t('reminders.loading') }}</p>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRemindersStore } from '@/stores/reminders'
import { useDialogsStore } from '@/stores/dialogs'
import type { Reminder, FirebaseTimestamp } from '@/types'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'

const { t } = useI18n()
const remindersStore = useRemindersStore()
const dialogsStore = useDialogsStore()

// Helper function to convert Firebase timestamp to Date
const convertToDate = (timestamp: FirebaseTimestamp | Date | string): Date => {
  if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
  }
  return new Date(timestamp)
}

// State
const createDialog = ref(false)
const editingReminder = ref<Reminder | null>(null)
const searchQuery = ref('')
const selectedPriority = ref('')
const selectedStatus = ref('')
const sortBy = ref('dueDateAsc')
const viewMode = ref('grid')

// Get data from store
const reminders = computed(() => remindersStore.reminders || [])
const loading = computed(() => remindersStore.isLoading)
const error = computed(() => remindersStore.error)
const stats = computed(() => remindersStore.stats || { total: 0, upcoming: 0, overdue: 0, completed: 0 })

// Form
const reminderForm = reactive({
  title: '',
  description: '',
  reminderDate: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  repeat: '' as '' | 'daily' | 'weekly' | 'monthly' | 'yearly'
})

// Options
const priorityOptions = [
  { title: t('reminders.priorities.low'), value: 'low' },
  { title: t('reminders.priorities.medium'), value: 'medium' },
  { title: t('reminders.priorities.high'), value: 'high' }
]

const statusOptions = [
  { title: t('reminders.statuses.pending'), value: 'pending' },
  { title: t('reminders.statuses.completed'), value: 'completed' },
  { title: t('reminders.statuses.overdue'), value: 'overdue' }
]

const repeatOptions = [
  { title: t('reminders.repeats.daily'), value: 'daily' },
  { title: t('reminders.repeats.weekly'), value: 'weekly' },
  { title: t('reminders.repeats.monthly'), value: 'monthly' },
  { title: t('reminders.repeats.yearly'), value: 'yearly' }
]

const sortOptions = [
  { title: t('reminders.sortOptions.dueDateAsc'), value: 'dueDateAsc' },
  { title: t('reminders.sortOptions.dueDateDesc'), value: 'dueDateDesc' },
  { title: t('reminders.sortOptions.priorityDesc'), value: 'priorityDesc' },
  { title: t('reminders.sortOptions.titleAsc'), value: 'titleAsc' },
  { title: t('reminders.sortOptions.createdDesc'), value: 'createdDesc' }
]

const filteredReminders = computed(() => {
  let filtered = [...(reminders.value || [])]

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(reminder =>
      reminder.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (reminder.description && reminder.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // Filter by priority
  if (selectedPriority.value) {
    filtered = filtered.filter(reminder => reminder.priority === selectedPriority.value)
  }

  // Filter by status
  if (selectedStatus.value) {
    if (selectedStatus.value === 'pending') {
      filtered = filtered.filter(reminder => !reminder.isCompleted && !isOverdue(reminder))
    } else if (selectedStatus.value === 'completed') {
      filtered = filtered.filter(reminder => reminder.isCompleted)
    } else if (selectedStatus.value === 'overdue') {
      filtered = filtered.filter(reminder => !reminder.isCompleted && isOverdue(reminder))
    }
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'dueDateAsc':
        return new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime()
      case 'dueDateDesc':
        return new Date(b.reminderDate).getTime() - new Date(a.reminderDate).getTime()
      case 'priorityDesc':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'titleAsc':
        return a.title.localeCompare(b.title)
      case 'createdDesc':
        return convertToDate(b.createdAt).getTime() - convertToDate(a.createdAt).getTime()
      default:
        return 0
    }
  })

  return filtered
})

// Validation rules
const rules = {
  required: (value: any) => !!value || t('validation.required')
}

// Methods
const loadReminders = async () => {
  try {
    await remindersStore.fetchReminders()
  } catch (error) {
    console.error('Failed to load reminders:', error)
  }
}

const createNewReminder = () => {
  // Use global dialog system for reminder form
  dialogsStore.openBaseDialog(
    'CreateReminderDialog',
    {},
    { maxWidth: '700', scrollable: true, persistent: true },
    {
      onConfirm: (newReminder) => {
        console.log('New reminder created:', newReminder)
        // Refresh reminders list
        loadReminders()
      }
    }
  )
}

const viewReminder = (reminder: Reminder) => {
  // TODO: Navigate to reminder detail view or show detailed modal
  console.log('View reminder:', reminder)
}

const editReminder = (reminder: Reminder) => {
  // Use global dialog system for editing reminders
  dialogsStore.openBaseDialog(
    'EditReminderDialog',
    { reminder },
    { maxWidth: '700', scrollable: true, persistent: true },
    {
      onConfirm: (updatedReminder) => {
        console.log('Reminder updated:', updatedReminder)
        // Refresh reminders list
        loadReminders()
      }
    }
  )
}

const deleteReminder = async (reminder: Reminder) => {
  dialogsStore.openConfirmDialog({
    title: t('reminders.confirmDeleteTitle') || 'Xác nhận xóa',
    message: t('reminders.confirmDelete', { title: reminder.title }) || `Bạn có chắc chắn muốn xóa reminder "${reminder.title}"?`,
    confirmText: t('common.delete') || 'Xóa',
    cancelText: t('common.cancel') || 'Hủy',
    onConfirm: async () => {
      try {
        await remindersStore.deleteReminder(reminder.id)
        
        dialogsStore.openAlertDialog({
          title: t('common.deleted') || 'Đã xóa!',
          message: t('reminders.deleteSuccess') || 'Reminder đã được xóa thành công!'
        })
      } catch (error) {
        console.error('Delete failed:', error)
        
        dialogsStore.openAlertDialog({
          title: t('common.error') || 'Lỗi!',
          message: t('reminders.deleteError') || 'Có lỗi xảy ra khi xóa reminder. Vui lòng thử lại.'
        })
      }
    }
  })
}

const completeReminder = async (reminder: Reminder) => {
  try {
    await remindersStore.completeReminder(reminder.id)
  } catch (error) {
    console.error('Complete failed:', error)
  }
}

const shareReminder = async (reminder: Reminder) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: reminder.title,
        text: reminder.description || '',
        url: window.location.href + '/reminders/' + reminder.id
      })
    }
  } catch (error) {
    console.error('Share failed:', error)
  }
}

const saveReminder = async () => {
  try {
    if (!reminderForm || !reminderForm.title?.trim() || !reminderForm.reminderDate) {
      return
    }

    const reminderData = {
      title: reminderForm.title.trim(),
      description: reminderForm.description?.trim() || '',
      reminderDate: new Date(reminderForm.reminderDate),
      priority: reminderForm.priority,
      repeat: reminderForm.repeat || undefined
    }

    if (editingReminder.value) {
      // Update existing reminder
      await remindersStore.updateReminder(editingReminder.value.id, reminderData)
    } else {
      // Create new reminder
      await remindersStore.createReminder(reminderData)
    }
    
    createDialog.value = false
    editingReminder.value = null
    // Reset form values without reassigning the object
    reminderForm.title = ''
    reminderForm.description = ''
    reminderForm.reminderDate = ''
    reminderForm.priority = 'medium'
    reminderForm.repeat = ''
  } catch (error) {
    console.error('Save failed:', error)
  }
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'green',
    'medium': 'orange',
    'high': 'red'
  }
  return colors[priority] || 'orange'
}

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    'low': t('reminders.priorities.low'),
    'medium': t('reminders.priorities.medium'),
    'high': t('reminders.priorities.high')
  }
  return labels[priority] || priority
}

const getRepeatLabel = (repeat: string) => {
  const labels: Record<string, string> = {
    'daily': t('reminders.repeats.daily'),
    'weekly': t('reminders.repeats.weekly'),
    'monthly': t('reminders.repeats.monthly'),
    'yearly': t('reminders.repeats.yearly')
  }
  return labels[repeat] || repeat
}

const getStatusIcon = (reminder: Reminder) => {
  if (reminder.isCompleted) return 'mdi-check-circle'
  if (isOverdue(reminder)) return 'mdi-alert-circle'
  return 'mdi-bell'
}

const getStatusText = (reminder: Reminder) => {
  if (reminder.isCompleted) return t('reminders.statuses.completed')
  if (isOverdue(reminder)) return t('reminders.statuses.overdue')
  return t('reminders.statuses.pending')
}

const getStatusClass = (reminder: Reminder) => {
  if (reminder.isCompleted) return 'text-success'
  if (isOverdue(reminder)) return 'text-error'
  return 'text-primary'
}

const isOverdue = (reminder: Reminder) => {
  if (!reminder.reminderDate) return false
  return !reminder.isCompleted && new Date(reminder.reminderDate) < new Date()
}

const formatDateTime = (date: string | Date) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

// Lifecycle
onMounted(async () => {
  await loadReminders()
})
</script>

<style lang="scss">
.text-orange {
  color: rgb(255, 152, 0) !important;
}

.reminder-card {
  transition: transform 0.2s;
}

.reminder-card:hover {
  transform: translateY(-2px);
}

.reminder-header {
  height: 120px;
}

.reminder-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* SweetAlert2 Custom Styles */
.swal2-popup-custom {
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

.swal2-title-custom {
  color: #2c3e50 !important;
  font-weight: 600 !important;
}

.swal2-confirm-custom {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%) !important;
  border: none !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  padding: 10px 24px !important;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3) !important;
  transition: all 0.3s ease !important;
}

.swal2-confirm-custom:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4) !important;
}

.swal2-cancel-custom {
  background: #f5f5f5 !important;
  color: #666 !important;
  border: 1px solid #ddd !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  padding: 10px 24px !important;
  transition: all 0.3s ease !important;
}

.swal2-cancel-custom:hover {
  background: #e0e0e0 !important;
  border-color: #bbb !important;
  transform: translateY(-1px) !important;
}

.swal2-icon.swal2-warning {
  border-color: #FF8A65 !important;
  color: #FF6B35 !important;
}

.swal2-icon.swal2-success {
  border-color: #4CAF50 !important;
  color: #4CAF50 !important;
}

.swal2-icon.swal2-error {
  border-color: #F44336 !important;
  color: #F44336 !important;
}
</style>