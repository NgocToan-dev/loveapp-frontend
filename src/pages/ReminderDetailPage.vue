<template>
  <AppLayout>
    <div class="reminder-detail-page">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb">
        <RouterLink to="/reminders" class="breadcrumb-link">
          {{ $t('reminders.title') }}
        </RouterLink>
        <ChevronRightIcon class="w-4 h-4 text-gray-400" />
        <span class="breadcrumb-current">
          {{ reminder?.title || $t('reminders.detail.title') }}
        </span>
      </nav>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <LoadingSpinner size="lg" />
        <p>{{ $t('common.loading') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-content">
          <div class="error-icon">❌</div>
          <h2>{{ $t('common.error.title') }}</h2>
          <p>{{ error }}</p>
          <div class="error-actions">
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
      <div v-else-if="!reminder" class="not-found-container">
        <div class="not-found-content">
          <div class="not-found-icon">🔍</div>
          <h2>{{ $t('reminders.detail.not_found') }}</h2>
          <p>{{ $t('reminders.detail.not_found_message') }}</p>
          <Button @click="$router.push('/reminders')" variant="primary">
            {{ $t('reminders.detail.back_to_list') }}
          </Button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="header-content">
            <Button
              @click="$router.go(-1)"
              variant="ghost"
              size="sm"
              class="back-button"
            >
              <ArrowLeftIcon class="w-4 h-4 mr-2" />
              {{ $t('common.actions.back') }}
            </Button>
            
            <div class="header-badges">
              <Badge
                :label="$t(`reminders.types.${reminder.type}`)"
                variant="secondary"
              />
              <Badge
                :label="$t(`reminders.status.${getStatus(reminder)}`)"
                :variant="getStatusVariant(reminder)"
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
          :reminder="reminder"
          :is-updating="isUpdating"
          @edit="handleEdit"
          @delete="handleDelete"
          @share="handleShare"
          @toggle-complete="handleToggleComplete"
          @snooze="handleSnooze"
        />

        <!-- Related Reminders -->
        <div v-if="relatedReminders.length > 0" class="related-section">
          <h3 class="related-title">{{ $t('reminders.detail.related_reminders') }}</h3>
          <div class="related-grid">
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
          <p>{{ $t('reminders.share.description') }}</p>
          
          <div class="share-options">
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
            <label>{{ $t('common.share.share_text_label') }}</label>
            <textarea
              v-model="shareText"
              readonly
              class="share-textarea"
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
import { useUIStore } from '@/stores/ui'
import { formatDateTime } from '@/utils/helpers'
import type { Reminder } from '@/types'

import AppLayout from '@/components/layout/AppLayout.vue'
import ReminderDetail from '@/components/reminders/ReminderDetail.vue'
import ReminderCard from '@/components/reminders/ReminderCard.vue'
import CrudActions from '@/components/common/CrudActions.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import Modal from '@/components/common/Modal.vue'

// Icons
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import LinkIcon from '@/components/icons/LinkIcon.vue'
import ShareIcon from '@/components/icons/ShareIcon.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const uiStore = useUIStore()
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

// Alias for convenience
const reminder = selectedReminder

// State
const isUpdating = ref(false)
const showShareModal = ref(false)
const shareText = ref('')

// Computed
const reminderId = computed(() => route.params.id as string)

const canEdit = computed(() => {
  return !!isConnected.value && !!reminder && !reminder.isCompleted
})

const canDelete = computed(() => {
  return !!isConnected.value && !!reminder
})

const canShare = computed(() => {
  return !!reminder
})

const relatedReminders = computed(() => {
  if (!reminder || !reminders) return []
  
  return reminders
    .filter((r: Reminder) => 
      r.id !== reminder?.id && 
      (r.type === reminder?.type || 
       r.title.toLowerCase().includes(reminder?.title.toLowerCase().split(' ')[0] || ''))
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
  router.push(`/reminders/${reminderId.value}/edit`)
}

const handleDelete = async () => {
  if (!reminder) return
  
  try {
    await deleteReminder(reminder.id)
    showSuccess(t('reminders.delete.success'))
    router.push('/reminders')
  } catch (error) {
    showError(t('reminders.delete.error'))
  }
}

const handleShare = () => {
  if (!reminder) return
  
  shareText.value = `${reminder.title}\n${reminder.description || ''}\n${t('reminders.detail.date_time')}: ${formatDateTime(reminder.reminderDate, reminder.reminderTime)}`
  showShareModal.value = true
}

const handleToggleComplete = async () => {
  if (!reminder) return
  
  isUpdating.value = true
  try {
    if (reminder.isCompleted) {
      await markIncomplete(reminder.id)
      showSuccess(t('reminders.mark_incomplete.success'))
    } else {
      await markCompleted(reminder.id)
      showSuccess(t('reminders.mark_complete.success'))
    }
  } catch (error) {
    showError(t('reminders.toggle_complete.error'))
  } finally {
    isUpdating.value = false
  }
}

const handleSnooze = async (snoozeUntil: string) => {
  if (!reminder) return
  
  isUpdating.value = true
  try {
    const updateData = {
      id: reminder.id,
      reminderDate: snoozeUntil.split('T')[0],
      reminderTime: snoozeUntil.split('T')[1] || '09:00'
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
  const relatedReminder = reminders?.find((r: any) => r.id === id)
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
  try {
    const updateData = {
      id: id,
      reminderDate: snoozeUntil.split('T')[0],
      reminderTime: snoozeUntil.split('T')[1] || '09:00'
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
        title: reminder?.title,
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
    if (newId && newId !== reminder?.id) {
      await fetchReminder(newId as string)
    }
  }
)
</script>

<style scoped>
.reminder-detail-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: #4caf50;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-current {
  color: #666;
  font-weight: 500;
}

.loading-container,
.error-container,
.not-found-container {
  text-align: center;
  padding: 64px 24px;
}

.error-content,
.not-found-content {
  max-width: 400px;
  margin: 0 auto;
}

.error-icon,
.not-found-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.error-content h2,
.not-found-content h2 {
  font-size: 1.5rem;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.error-content p,
.not-found-content p {
  color: #666;
  margin: 0 0 24px 0;
  font-size: 1.125rem;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.content {
  margin-top: 8px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 16px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.back-button {
  align-self: flex-start;
}

.header-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.header-actions {
  flex-shrink: 0;
}

.related-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #e0e0e0;
}

.related-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: #2c3e50;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 16px;
}

.share-content {
  padding: 4px;
}

.share-content p {
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.5;
}

.share-options {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.share-button {
  flex: 1;
  justify-content: center;
  min-width: 140px;
}

.share-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.share-text label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.share-textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;
}

.share-textarea:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

@media (max-width: 768px) {
  .reminder-detail-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-badges {
    justify-content: center;
  }

  .header-actions {
    align-self: center;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .share-options {
    flex-direction: column;
  }

  .share-button {
    min-width: auto;
  }
}
</style>
