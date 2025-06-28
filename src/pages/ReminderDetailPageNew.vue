<template>
  <AppLayout>
    <div class="reminder-detail-page">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb mb-6">
        <RouterLink to="/reminders" class="breadcrumb-link text-blue-600 hover:text-blue-800">
          {{ $t('reminders.title') }}
        </RouterLink>
        <ChevronRightIcon class="w-4 h-4 text-gray-400 mx-2" />
        <span class="breadcrumb-current text-gray-900">
          {{ currentReminder?.title || $t('reminders.detail.title') }}
        </span>
      </nav>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p class="mt-4 text-gray-600">{{ $t('common.loading') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-content bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="error-icon text-4xl mb-4">❌</div>
          <h2 class="text-xl font-semibold text-red-800 mb-2">{{ $t('common.error.title') }}</h2>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <div class="error-actions space-x-3">
            <Button @click="handleRetry" variant="primary">
              {{ $t('common.actions.retry') }}
            </Button>
            <Button @click="$router.go(-1)" variant="outline">
              {{ $t('common.actions.go_back') }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!currentReminder" class="not-found-container">
        <div class="not-found-content bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div class="not-found-icon text-4xl mb-4">🔍</div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ $t('reminders.detail.not_found') }}</h2>
          <p class="text-gray-600 mb-4">{{ $t('reminders.detail.not_found_message') }}</p>
          <Button @click="$router.push('/reminders')" variant="primary">
            {{ $t('reminders.detail.back_to_list') }}
          </Button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="content">
        <!-- Page Header -->
        <div class="page-header flex justify-between items-start mb-6">
          <div class="header-content flex items-center space-x-4">
            <Button
              @click="$router.go(-1)"
              variant="ghost"
              size="sm"
              class="back-button"
            >
              <ArrowLeftIcon class="w-4 h-4 mr-2" />
              {{ $t('common.actions.back') }}
            </Button>
            
            <div class="header-badges flex space-x-2">
              <Badge
                :label="$t(`reminders.types.${currentReminder.type}`)"
                variant="secondary"
              />
              <Badge
                :label="$t(`reminders.status.${getStatus(currentReminder)}`)"
                :variant="getStatusVariant(currentReminder)"
              />
            </div>
          </div>

          <div class="header-actions">
            <CrudActions
              :can-edit="canEdit"
              :can-delete="canDelete"
              :can-share="canShare"
              :is-loading="isUpdating"
              @edit="handleEdit"
              @delete="handleDelete"
              @share="handleShare"
            />
          </div>
        </div>

        <!-- Reminder Detail Component -->
        <ReminderDetail
          :reminder="currentReminder"
          :is-updating="isUpdating"
          @edit="handleEdit"
          @delete="handleDelete"
          @share="handleShare"
          @toggle-complete="handleToggleComplete"
          @snooze="handleSnooze"
        />

        <!-- Related Reminders -->
        <div v-if="relatedReminders.length > 0" class="related-section mt-8">
          <h3 class="related-title text-lg font-semibold mb-4">{{ $t('reminders.detail.related_reminders') }}</h3>
          <div class="related-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReminderCard
              v-for="relatedReminder in relatedReminders"
              :key="relatedReminder.id"
              :reminder="relatedReminder"
              @edit="handleEditRelated"
              @delete="handleDeleteRelated"
              @toggle-complete="handleToggleCompleteRelated"
              @snooze="handleSnoozeRelated"
            />
          </div>
        </div>
      </div>

      <!-- Share Modal -->
      <Modal v-model="showShareModal" :title="$t('reminders.share.title')">
        <div class="share-content">
          <p class="mb-4">{{ $t('reminders.share.description') }}</p>
          
          <div class="share-options flex space-x-3 mb-4">
            <Button
              @click="handleCopyLink"
              variant="outline"
              class="share-button"
            >
              <LinkIcon class="w-4 h-4 mr-2" />
              {{ $t('common.share.copy_link') }}
            </Button>
            
            <Button
              @click="handleShareText"
              variant="outline"
              class="share-button"
            >
              <ShareIcon class="w-4 h-4 mr-2" />
              {{ $t('common.share.share_text') }}
            </Button>
          </div>
          
          <div class="share-text">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('common.share.share_text_label') }}
            </label>
            <textarea
              v-model="shareText"
              readonly
              class="w-full p-3 border border-gray-300 rounded-md"
              rows="4"
              @click="($event.target as HTMLTextAreaElement)?.select()"
            />
          </div>
        </div>
      </Modal>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useReminders } from '@/composables/useReminders'
import { useCouple } from '@/composables/useCouple'
import { useNotifications } from '@/composables/useNotifications'
import { formatDateTime } from '@/utils/helpers'
import type { Reminder, UpdateReminderRequest } from '@/types'

import AppLayout from '@/components/layout/AppLayout.vue'
import ReminderDetail from '@/components/reminders/ReminderDetail.vue'
import ReminderCard from '@/components/reminders/ReminderCard.vue'
import CrudActions from '@/components/common/CrudActions.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import Modal from '@/components/common/Modal.vue'

// Icons
import { ChevronRightIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'
import LinkIcon from '@/components/icons/LinkIcon.vue'
import ShareIcon from '@/components/icons/ShareIcon.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { isConnected } = useCouple()
const { showSuccess, showError } = useNotifications()

const {
  reminders,
  selectedReminder,
  isLoading,
  error,
  fetchReminder,
  updateReminder,
  deleteReminder,
  markCompleted,
  markIncomplete,
  clearError
} = useReminders()

// State
const isUpdating = ref(false)
const showShareModal = ref(false)
const shareText = ref('')

// Computed
const reminderId = computed(() => route.params.id as string)
const currentReminder = computed(() => selectedReminder)

const canEdit = computed(() => {
  return !!(isConnected.value && currentReminder.value && !currentReminder.value.isCompleted)
})

const canDelete = computed(() => {
  return !!(isConnected.value && currentReminder.value)
})

const canShare = computed(() => {
  return currentReminder.value !== null
})

const relatedReminders = computed(() => {
  if (!currentReminder.value || !reminders) return []
  
  return reminders
    .filter((r: Reminder) => 
      r.id !== currentReminder.value?.id && 
      (r.type === currentReminder.value?.type || 
       r.title.toLowerCase().includes(currentReminder.value?.title.toLowerCase().split(' ')[0] || ''))
    )
    .slice(0, 3)
})

// Methods
const getStatus = (reminder: Reminder) => {
  if (reminder.isCompleted) return 'completed'
  const reminderDateTime = new Date(reminder.reminderDate + 'T' + reminder.reminderTime)
  if (reminderDateTime < new Date()) return 'overdue'
  const timeDiff = reminderDateTime.getTime() - new Date().getTime()
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24)
  if (daysDiff <= 7 && daysDiff > 0) return 'upcoming'
  return 'pending'
}

const getStatusVariant = (reminder: Reminder) => {
  const status = getStatus(reminder)
  switch (status) {
    case 'completed': return 'success'
    case 'overdue': return 'error'
    case 'upcoming': return 'warning'
    default: return 'secondary'
  }
}

const handleRetry = async () => {
  clearError()
  await fetchReminder(reminderId.value)
}

const handleEdit = () => {
  if (!currentReminder.value) return
  router.push(`/reminders/${currentReminder.value.id}/edit`)
}

const handleDelete = async () => {
  if (!currentReminder.value) return
  
  try {
    await deleteReminder(currentReminder.value.id)
    showSuccess(t('reminders.delete.success'))
    router.push('/reminders')
  } catch (error) {
    showError(t('reminders.delete.error'))
  }
}

const handleShare = () => {
  if (!currentReminder.value) return
  
  shareText.value = `${currentReminder.value.title}\n${currentReminder.value.description || ''}\n${t('reminders.detail.date_time')}: ${formatDateTime(currentReminder.value.reminderDate, currentReminder.value.reminderTime)}`
  showShareModal.value = true
}

const handleToggleComplete = async () => {
  if (!currentReminder.value) return
  
  isUpdating.value = true
  try {
    if (currentReminder.value.isCompleted) {
      await markIncomplete(currentReminder.value.id)
      showSuccess(t('reminders.mark_incomplete.success'))
    } else {
      await markCompleted(currentReminder.value.id)
      showSuccess(t('reminders.mark_complete.success'))
    }
  } catch (error) {
    showError(t('reminders.toggle_complete.error'))
  } finally {
    isUpdating.value = false
  }
}

const handleSnooze = async (snoozeUntil: string) => {
  if (!currentReminder.value) return
  
  isUpdating.value = true
  try {
    const updateData: UpdateReminderRequest = {
      id: currentReminder.value.id,
      reminderDate: snoozeUntil.split('T')[0],
      reminderTime: snoozeUntil.split('T')[1]?.substring(0, 5) || '09:00'
    }
    
    await updateReminder(updateData)
    showSuccess(t('reminders.snooze.success'))
  } catch (error) {
    showError(t('reminders.snooze.error'))
  } finally {
    isUpdating.value = false
  }
}

// Related reminders handlers
const handleEditRelated = (relatedReminder: Reminder) => {
  router.push(`/reminders/${relatedReminder.id}/edit`)
}

const handleDeleteRelated = async (id: string) => {
  try {
    await deleteReminder(id)
    showSuccess(t('reminders.delete.success'))
  } catch (error) {
    showError(t('reminders.delete.error'))
  }
}

const handleToggleCompleteRelated = async (id: string) => {
  const relatedReminder = reminders?.find((r: Reminder) => r.id === id)
  if (!relatedReminder) return
  
  try {
    if (relatedReminder.isCompleted) {
      await markIncomplete(id)
    } else {
      await markCompleted(id)
    }
    showSuccess(t('reminders.toggle_complete.success'))
  } catch (error) {
    showError(t('reminders.toggle_complete.error'))
  }
}

const handleSnoozeRelated = async (id: string, snoozeUntil: string) => {
  const relatedReminder = reminders?.find((r: Reminder) => r.id === id)
  if (!relatedReminder) return
  
  try {
    const newDate = new Date(snoozeUntil)
    
    const updateData: UpdateReminderRequest = {
      id,
      reminderDate: newDate.toISOString().split('T')[0],
      reminderTime: newDate.toTimeString().split(' ')[0].substring(0, 5)
    }
    
    await updateReminder(updateData)
    showSuccess(t('reminders.snooze.success'))
  } catch (error) {
    showError(t('reminders.snooze.error'))
  }
}

// Share handlers
const handleCopyLink = async () => {
  try {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    showSuccess(t('common.share.link_copied'))
  } catch (error) {
    showError(t('common.share.copy_failed'))
  }
}

const handleShareText = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: currentReminder.value?.title,
        text: shareText.value,
        url: window.location.href
      })
    } else {
      await navigator.clipboard.writeText(shareText.value)
      showSuccess(t('common.share.text_copied'))
    }
  } catch (error) {
    showError(t('common.share.share_failed'))
  }
}

// Lifecycle
onMounted(async () => {
  if (reminderId.value) {
    await fetchReminder(reminderId.value)
  }
})

// Watch for route changes
watch(
  () => route.params.id,
  async (newId) => {
    if (newId && newId !== currentReminder.value?.id) {
      await fetchReminder(newId as string)
    }
  }
)
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  font-weight: 500;
  text-decoration: none;
}

.breadcrumb-current {
  font-weight: 600;
}

.loading-container,
.error-container,
.not-found-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.related-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
}

.share-content textarea {
  resize: none;
  font-family: monospace;
  font-size: 0.875rem;
}
</style>
