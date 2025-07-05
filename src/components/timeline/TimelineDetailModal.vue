<template>
  <div class="timeline-detail-modal">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <span class="type-icon">{{ getTypeIcon(item.type) }}</span>
            <div>
              <h3>{{ item.title }}</h3>
              <span class="type-label">{{ $t(`timeline.types.${item.type}`) }}</span>
            </div>
          </div>
          <button @click="$emit('close')" class="close-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="item-meta">
            <div class="date-info">
              <span class="date">{{ formatDate(item.date) }}</span>
              <span class="relative-date">{{ formatDate(item.date, 'relative') }}</span>
            </div>
            
            <div v-if="item.author" class="author-info">
              <img 
                v-if="item.author.avatarUrl" 
                :src="item.author.avatarUrl" 
                :alt="item.author.displayName"
                class="author-avatar"
              />
              <span>{{ item.author.displayName }}</span>
            </div>
          </div>

          <div v-if="item.imageUrl" class="item-image">
            <img :src="item.imageUrl" :alt="item.title" />
          </div>

          <div v-if="item.description || item.content" class="item-content">
            <div v-if="item.type === 'blog' && item.content" v-html="item.content"></div>
            <p v-else>{{ item.description }}</p>
          </div>

          <!-- Reminder specific content -->
          <div v-if="item.type === 'reminder'" class="reminder-details">
            <div class="status-indicator">
              <div :class="['status-dot', item.isCompleted ? 'completed' : 'pending']"></div>
              <span>{{ item.isCompleted ? $t('reminders.status.completed') : $t('reminders.status.pending') }}</span>
            </div>
            
            <div v-if="item.metadata" class="reminder-meta">
              <div v-if="item.metadata.reminderTime" class="reminder-time">
                <span class="label">{{ $t('reminders.time') }}:</span>
                <span>{{ item.metadata.reminderTime }}</span>
              </div>
              <div v-if="item.metadata.type" class="reminder-type">
                <span class="label">{{ $t('reminders.type') }}:</span>
                <span>{{ $t(`reminders.types.${item.metadata.type}`) }}</span>
              </div>
            </div>
          </div>

          <!-- Blog specific content -->
          <div v-if="item.type === 'blog'" class="blog-details">
            <div class="blog-stats">
              <div class="stat">
                <span class="icon">❤️</span>
                <span>{{ item.likes || 0 }}</span>
              </div>
              <div class="stat">
                <span class="icon">💬</span>
                <span>{{ item.comments || 0 }}</span>
              </div>
              <div v-if="item.metadata?.views" class="stat">
                <span class="icon">👁</span>
                <span>{{ item.metadata.views }}</span>
              </div>
            </div>
            
            <div v-if="item.tags && item.tags.length" class="blog-tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Memory specific content -->
          <div v-if="item.type === 'memory' && item.metadata" class="memory-details">
            <div v-if="item.metadata.location" class="memory-location">
              <span class="label">{{ $t('memories.location') }}:</span>
              <span>{{ item.metadata.location }}</span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <Button @click="$emit('close')" variant="outline">
            {{ $t('common.buttons.close') }}
          </Button>
          <Button @click="handleViewFull" variant="primary">
            {{ $t('timeline.actions.view') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formatDate } from '@/utils/helpers'
import type { TimelineItem } from '@/types'
import Button from '@/components/common/Button.vue'

interface Props {
  item: TimelineItem
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const { t } = useI18n()

const getTypeIcon = (type: string): string => {
  const icons = {
    memory: '📸',
    reminder: '⏰',
    blog: '📝',
    anniversary: '💕'
  }
  return icons[type as keyof typeof icons] || '✨'
}

const handleViewFull = () => {
  switch (props.item.type) {
    case 'memory':
      router.push(`/memories/${props.item.id}`)
      break
    case 'reminder':
      router.push(`/reminders/${props.item.id}`)
      break
    case 'blog':
      router.push(`/blog/${props.item.id}`)
      break
  }
  emit('close')
}
</script>

<style scoped>
.timeline-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  z-index: 1001;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
}

.modal-title h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.type-label {
  font-size: 14px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #e0e0e0;
}

.modal-body {
  padding: 0 24px;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date {
  font-weight: 500;
  color: #333;
}

.relative-date {
  font-size: 14px;
  color: #666;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.item-image {
  margin-bottom: 20px;
}

.item-image img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.item-content {
  margin-bottom: 20px;
  line-height: 1.6;
  color: #333;
}

.reminder-details,
.blog-details,
.memory-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.completed {
  background: #4caf50;
}

.status-dot.pending {
  background: #ff9800;
}

.reminder-meta,
.memory-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-time,
.reminder-type,
.memory-location {
  display: flex;
  gap: 8px;
}

.label {
  font-weight: 500;
  color: #666;
}

.blog-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.stat .icon {
  font-size: 16px;
}

.blog-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e0e0e0;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .timeline-detail-modal {
    padding: 10px;
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 16px 16px 0 16px;
  }
  
  .modal-body {
    padding: 0 16px;
  }
  
  .modal-actions {
    padding: 16px;
    flex-direction: column;
  }
  
  .item-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .blog-stats {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
