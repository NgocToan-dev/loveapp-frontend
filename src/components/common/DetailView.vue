<template>
  <div class="detail-view">
    <!-- Header với actions -->
    <div class="detail-header">
      <div class="detail-title">
        <Button
          v-if="showBackButton"
          @click="$emit('back')"
          variant="ghost"
          size="sm"
          class="back-button"
        >
          <ArrowLeftIcon class="w-4 h-4" />
        </Button>
        
        <div class="title-content">
          <h1 class="title">{{ title }}</h1>
          <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <div class="detail-actions">
        <CrudActions
          :can-edit="canEdit"
          :can-delete="canDelete"
          :can-share="canShare"
          :can-favorite="canFavorite"
          :is-favorite="isFavorite"
          :is-loading="isLoading"
          @edit="$emit('edit')"
          @delete="showDeleteConfirm = true"
          @share="$emit('share')"
          @favorite="$emit('favorite')"
        />
      </div>
    </div>

    <!-- Content Area -->
    <div class="detail-content">
      <div v-if="isLoading" class="loading-state">
        <LoadingSpinner size="lg" />
        <p>{{ $t('common.loading') }}</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">❌</div>
        <h3>{{ $t('common.error.title') }}</h3>
        <p>{{ error }}</p>
        <Button @click="$emit('retry')" variant="outline">
          {{ $t('common.actions.retry') }}
        </Button>
      </div>

      <div v-else-if="!data" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>{{ $t('common.empty.not_found') }}</h3>
        <p>{{ $t('common.empty.not_found_description') }}</p>
      </div>

      <div v-else class="detail-data">
        <slot :data="data" />
      </div>
    </div>

    <!-- Meta Information -->
    <div v-if="data && showMeta" class="detail-meta">
      <div class="meta-item">
        <span class="meta-label">{{ $t('common.meta.created') }}:</span>
        <span class="meta-value">{{ formatDate(data.createdAt, 'full') }}</span>
      </div>
      
      <div v-if="data.updatedAt" class="meta-item">
        <span class="meta-label">{{ $t('common.meta.updated') }}:</span>
        <span class="meta-value">{{ formatDate(data.updatedAt, 'full') }}</span>
      </div>
      
      <div v-if="hasAuthor(data)" class="meta-item">
        <span class="meta-label">{{ $t('common.meta.author') }}:</span>
        <span class="meta-value">{{ getAuthorName(data) }}</span>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseConfirmModal
      v-model="showDeleteConfirm"
      :title="$t('common.confirm.delete_title')"
      :message="deleteConfirmMessage"
      :confirm-text="$t('common.actions.delete')"
      variant="danger"
      @confirm="$emit('delete')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/utils/helpers'
import Button from '@/components/common/Button.vue'
import CrudActions from '@/components/common/CrudActions.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import BaseConfirmModal from '@/components/common/BaseConfirmModal.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import type { Memory, Reminder, IUser } from '@/types'
import type { BlogPostEntity } from '@/types/model/blog/BlogPostEntity'

interface Props {
  data?: Memory | Reminder | BlogPostEntity | null
  title: string
  subtitle?: string
  entity: 'memory' | 'reminder' | 'blog'
  isLoading?: boolean
  error?: string | null
  canEdit?: boolean
  canDelete?: boolean
  canShare?: boolean
  canFavorite?: boolean
  isFavorite?: boolean
  showBackButton?: boolean
  showMeta?: boolean
}

interface Emits {
  back: []
  edit: []
  delete: []
  share: []
  favorite: []
  retry: []
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null,
  canEdit: true,
  canDelete: true,
  canShare: true,
  canFavorite: true,
  isFavorite: false,
  showBackButton: true,
  showMeta: true
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

// State
const showDeleteConfirm = ref(false)

// Computed
const deleteConfirmMessage = computed(() => {
  const entityKey = props.entity
  return t(`${entityKey}.delete.confirm_message`)
})

// Methods
const hasAuthor = (data: any): boolean => {
  return !!(data?.author?.displayName || data?.createdBy)
}

const getAuthorName = (data: any): string => {
  if (data.author?.displayName) {
    return data.author.displayName
  }
  if (data.createdBy) {
    return data.createdBy
  }
  return t('common.meta.unknown_author')
}
</script>

<style scoped>
.detail-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 16px;
}

.detail-title {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.back-button {
  margin-top: 4px;
}

.title-content {
  flex: 1;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #2c3e50;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.125rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.detail-actions {
  flex-shrink: 0;
}

.detail-content {
  margin-bottom: 32px;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.loading-state p,
.error-state p,
.empty-state p {
  margin: 16px 0 0 0;
  color: #666;
  font-size: 1.125rem;
}

.error-state h3,
.empty-state h3 {
  font-size: 1.5rem;
  margin: 16px 0 8px 0;
  color: #2c3e50;
}

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.detail-data {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-meta {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
}

.meta-label {
  font-weight: 500;
  color: #666;
  font-size: 0.875rem;
}

.meta-value {
  color: #2c3e50;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .detail-view {
    padding: 16px;
  }

  .detail-header {
    flex-direction: column;
    align-items: stretch;
  }

  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .detail-data {
    padding: 16px;
  }

  .meta-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
