<template>
  <div class="timeline-event-card" :class="[`priority-${event.priority}`, `type-${event.type}`]">
    <div class="event-header">
      <div class="event-type">
        <span class="event-icon">{{ getEventIcon() }}</span>
        <span class="event-type-text">{{ getEventTypeText() }}</span>
      </div>
      <div class="event-meta">
        <span v-if="event.isRecurring" class="recurring-badge" title="Sự kiện lặp lại">
          🔄
        </span>
        <div 
          class="priority-indicator"
          :style="{ backgroundColor: getPriorityColor() }"
          :title="`Độ ưu tiên: ${getPriorityText()}`"
        />
      </div>
    </div>
    
    <h3 class="event-title">{{ event.title }}</h3>
    
    <div class="event-date">
      <span class="date-main">{{ formatDate(event.date) }}</span>
      <span class="date-relative">{{ getTimeAgo(event.date) }}</span>
    </div>

    <p v-if="event.description" class="event-description">
      {{ event.description }}
    </p>    <div v-if="getLocationName(event.location)" class="event-location">
      📍 {{ getLocationName(event.location) }}
    </div>

    <div v-if="event.tags && event.tags.length > 0" class="event-tags">
      <span 
        v-for="tag in event.tags" 
        :key="tag" 
        class="tag"
        @click="$emit('tag-click', tag)"
      >
        #{{ tag }}
      </span>
    </div>
    
    <div v-if="event.images && event.images.length > 0" class="event-images-section">
      <button 
        class="toggle-images-btn"
        @click="showImages = !showImages"
      >
        {{ showImages ? 'Ẩn' : 'Xem' }} hình ảnh ({{ event.images.length }})
      </button>
      
      <div v-if="showImages" class="event-images">
        <img 
          v-for="(img, index) in event.images" 
          :key="index"
          :src="img" 
          :alt="`Memory ${index + 1}`"
          class="event-image"
          @click="$emit('image-click', img, index)"
        />
      </div>
    </div>
    
    <div class="event-actions">
      <v-btn
        size="small"
        variant="outlined"
        color="primary"
        @click="$emit('edit', event)"
      >
        <v-icon start>mdi-pencil</v-icon>
        Chỉnh sửa
      </v-btn>
      
      <v-btn
        size="small"
        variant="outlined"
        color="error"
        @click="handleDelete"
      >
        <v-icon start>mdi-delete</v-icon>
        Xóa
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TimelineEvent } from '@/types'

interface Props {
  event: TimelineEvent
}

interface Emits {
  (e: 'edit', event: TimelineEvent): void
  (e: 'delete', id: string): void
  (e: 'tag-click', tag: string): void
  (e: 'image-click', imageUrl: string, index: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showImages = ref(false)

const getEventIcon = () => {
  switch (props.event.type) {
    case 'memory': return '📸'
    case 'anniversary': return '💕'
    case 'milestone': return '🎯'
    default: return '📅'
  }
}

const getEventTypeText = () => {
  switch (props.event.type) {
    case 'memory': return 'Kỷ niệm'
    case 'anniversary': return 'Ngày kỷ niệm'
    case 'milestone': return 'Cột mốc'
    default: return 'Sự kiện'
  }
}

const getPriorityColor = () => {
  switch (props.event.priority) {
    case 'high': return '#ff4757'
    case 'medium': return '#ffa502'
    case 'low': return '#2ed573'
    default: return '#747d8c'
  }
}

const getPriorityText = () => {
  switch (props.event.priority) {
    case 'high': return 'Cao'
    case 'medium': return 'Trung bình'
    case 'low': return 'Thấp'
    default: return 'Không xác định'
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getLocationName = (location: string | { name: string } | undefined): string => {
  if (!location) return ''
  if (typeof location === 'string') return location
  return location.name || ''
}

const getTimeAgo = (date: Date) => {
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hôm nay'
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 0) return `Còn ${Math.abs(diffDays)} ngày`
  if (diffDays < 30) return `${diffDays} ngày trước`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`
  return `${Math.floor(diffDays / 365)} năm trước`
}

const handleDelete = () => {
  if (confirm('Bạn có chắc muốn xóa sự kiện này?')) {
    emit('delete', props.event.id)
  }
}
</script>

<style scoped>
.timeline-event-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;
  position: relative;
}

.timeline-event-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.timeline-event-card.priority-high {
  border-left: 4px solid #ff4757;
}

.timeline-event-card.priority-medium {
  border-left: 4px solid #ffa502;
}

.timeline-event-card.priority-low {
  border-left: 4px solid #2ed573;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.event-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-icon {
  font-size: 24px;
}

.event-type-text {
  background: #f1f3f4;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  color: #5f6368;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recurring-badge {
  font-size: 16px;
  opacity: 0.7;
}

.priority-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.event-title {
  margin: 0 0 12px 0;
  color: #1a73e8;
  font-size: 18px;
  font-weight: 600;
}

.event-date {
  margin-bottom: 12px;
}

.date-main {
  display: block;
  font-weight: 500;
  color: #3c4043;
}

.date-relative {
  font-size: 12px;
  color: #5f6368;
}

.event-description {
  color: #5f6368;
  line-height: 1.5;
  margin-bottom: 12px;
}

.event-location {
  color: #5f6368;
  font-size: 14px;
  margin-bottom: 12px;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tag {
  background: #e8f0fe;
  color: #1a73e8;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tag:hover {
  background: #d2e3fc;
}

.event-images-section {
  margin-bottom: 16px;
}

.toggle-images-btn {
  background: none;
  border: 1px solid #dadce0;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #1a73e8;
  transition: background-color 0.2s;
}

.toggle-images-btn:hover {
  background: #f8f9fa;
}

.event-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.event-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
}

.event-image:hover {
  transform: scale(1.05);
}

.event-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8eaed;
}

@media (max-width: 768px) {
  .timeline-event-card {
    padding: 16px;
  }
  
  .event-actions {
    flex-direction: column;
  }
  
  .event-images {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }
  
  .event-image {
    height: 60px;
  }
}
</style>
