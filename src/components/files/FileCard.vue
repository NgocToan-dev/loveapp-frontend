<template>
  <div class="file-card">
    <div class="file-preview">
      <!-- Image Preview -->
      <div v-if="isImage" class="image-preview">
        <v-img
          :src="thumbnailUrl"
          :alt="file.name"
          cover
          class="file-image"
          @error="handleImageError"
        />
        <div class="image-overlay">
          <v-btn
            icon
            size="small"
            variant="elevated"
            color="white"
            @click.stop="$emit('preview', file)"
          >
            <v-icon color="primary">mdi-eye</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- File Icon Preview -->
      <div v-else class="icon-preview">
        <div class="file-type-icon" :class="typeClass">
          <v-icon :color="typeColor" size="48">{{ typeIcon }}</v-icon>
        </div>
        <div class="file-format">{{ fileFormat }}</div>
      </div>
    </div>

    <div class="file-info">
      <h3 class="file-name" :title="file.name">{{ truncatedName }}</h3>
      
      <div class="file-meta">
        <span class="file-size">{{ formattedSize }}</span>
        <span class="file-date">{{ formattedDate }}</span>
      </div>

      <div class="file-category">
        <v-chip
          :color="categoryColor"
          size="small"
          variant="tonal"
          class="category-chip"
        >
          <v-icon start size="14">{{ categoryIcon }}</v-icon>
          {{ categoryLabel }}
        </v-chip>
      </div>
    </div>

    <div class="file-actions">
      <v-btn
        icon
        size="small"
        variant="text"
        @click.stop="$emit('download', file)"
        class="action-btn"
      >
        <v-icon size="18">mdi-download</v-icon>
      </v-btn>
      
      <v-btn
        icon
        size="small"
        variant="text"
        @click.stop="$emit('share', file)"
        class="action-btn"
      >
        <v-icon size="18">mdi-share-variant</v-icon>
      </v-btn>
      
      <v-btn
        icon
        size="small"
        variant="text"
        color="error"
        @click.stop="$emit('delete', file)"
        class="action-btn"
      >
        <v-icon size="18">mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

interface FileItem {
  id: string
  name?: string
  fileName?: string
  originalName?: string
  size?: number
  type?: string
  url?: string
  thumbnailUrl?: string
  uploadedAt?: string | Date
  createdAt?: string | Date
  metadata?: {
    mimeType?: string
    size?: number
  }
}

interface Props {
  file: FileItem
}

const props = defineProps<Props>()

defineEmits<{
  'preview': [file: FileItem]
  'download': [file: FileItem]
  'share': [file: FileItem]
  'delete': [file: FileItem]
}>()

// Computed properties
const isImage = computed(() => {
  const type = props.file.type || props.file.metadata?.mimeType || ''
  return type.startsWith('image/')
})

const thumbnailUrl = computed(() => {
  return props.file.thumbnailUrl || props.file.url || ''
})

const fileFormat = computed(() => {
  const type = props.file.type || props.file.metadata?.mimeType || ''
  return type.split('/')[1]?.toUpperCase() || 'FILE'
})

const truncatedName = computed(() => {
  const name = props.file.name || props.file.fileName || props.file.originalName || 'Untitled'
  return name.length > 20 ? name.substring(0, 17) + '...' : name
})

const formattedSize = computed(() => {
  const bytes = props.file.size || props.file.metadata?.size || 0
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
})

const formattedDate = computed(() => {
  const date = props.file.uploadedAt || props.file.createdAt || new Date()
  return dayjs(date).format('MMM DD')
})

const typeIcon = computed(() => {
  const type = props.file.type || props.file.metadata?.mimeType || ''
  
  if (type.startsWith('image/')) return 'mdi-image'
  if (type.startsWith('video/')) return 'mdi-video'
  if (type.startsWith('audio/')) return 'mdi-music'
  if (type.includes('pdf')) return 'mdi-file-pdf-box'
  if (type.includes('word')) return 'mdi-file-word-box'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'mdi-file-excel-box'
  if (type.includes('powerpoint') || type.includes('presentation')) return 'mdi-file-powerpoint-box'
  if (type.includes('zip') || type.includes('rar')) return 'mdi-folder-zip'
  if (type.includes('text')) return 'mdi-file-document'
  
  return 'mdi-file'
})

const typeColor = computed(() => {
  const type = props.file.type || props.file.metadata?.mimeType || ''
  
  if (type.startsWith('image/')) return 'success'
  if (type.startsWith('video/')) return 'info'
  if (type.startsWith('audio/')) return 'purple'
  if (type.includes('pdf')) return 'error'
  if (type.includes('word')) return 'primary'
  if (type.includes('excel')) return 'success'
  if (type.includes('powerpoint')) return 'warning'
  
  return 'grey'
})

const typeClass = computed(() => {
  const type = props.file.type || props.file.metadata?.mimeType || ''
  
  if (type.startsWith('image/')) return 'type-image'
  if (type.startsWith('video/')) return 'type-video'
  if (type.startsWith('audio/')) return 'type-audio'
  if (type.includes('pdf')) return 'type-pdf'
  
  return 'type-default'
})

const categoryIcon = computed(() => {
  const type = props.file.type || props.file.metadata?.mimeType || ''
  
  if (type.startsWith('image/')) return 'mdi-image-multiple'
  if (type.startsWith('video/')) return 'mdi-video-box'
  if (type.startsWith('audio/')) return 'mdi-music-box'
  if (type.includes('pdf')) return 'mdi-file-pdf-box'
  
  return 'mdi-file-multiple'
})

const categoryLabel = computed(() => {
  const type = props.file.type || props.file.metadata?.mimeType || ''
  
  if (type.startsWith('image/')) return 'Photo'
  if (type.startsWith('video/')) return 'Video'
  if (type.startsWith('audio/')) return 'Audio'
  if (type.includes('pdf')) return 'Document'
  
  return 'File'
})

const categoryColor = computed(() => {
  const type = props.file.type || props.file.metadata?.mimeType || ''
  
  if (type.startsWith('image/')) return 'success'
  if (type.startsWith('video/')) return 'info'
  if (type.startsWith('audio/')) return 'purple'
  if (type.includes('pdf')) return 'error'
  
  return 'grey'
})

const handleImageError = () => {
  console.warn('Failed to load image thumbnail for:', props.file.name)
}
</script>

<style scoped>
.file-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.file-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

/* File Preview */
.file-preview {
  margin-bottom: 16px;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 16/10;
  position: relative;
}

.image-preview {
  height: 100%;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.file-image {
  height: 100%;
  border-radius: 16px;
}

.image-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.file-card:hover .image-overlay {
  opacity: 1;
}

.icon-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.05) 0%, 
    rgba(var(--secondary-rgb), 0.05) 100%);
  border-radius: 16px;
}

.file-type-icon {
  background: rgba(255, 255, 255, 0.8);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.file-card:hover .file-type-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.type-image {
  background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
}

.type-video {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
}

.type-audio {
  background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%);
}

.type-pdf {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
}

.file-format {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* File Info */
.file-info {
  flex: 1;
  margin-bottom: 16px;
}

.file-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.3;
  word-break: break-word;
}

.file-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.file-size {
  font-weight: 500;
}

.file-date {
  opacity: 0.8;
}

.file-category {
  margin-bottom: 8px;
}

.category-chip {
  font-size: 0.75rem;
  font-weight: 500;
  height: 24px;
}

/* File Actions */
.file-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.file-card:hover .file-actions {
  opacity: 1;
}

.action-btn {
  border-radius: 50%;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  background: rgba(var(--primary-rgb), 0.1);
}

/* Responsive */
@media (max-width: 600px) {
  .file-card {
    padding: 16px;
  }
  
  .file-name {
    font-size: 0.9rem;
  }
  
  .file-meta {
    font-size: 0.7rem;
  }
  
  .file-type-icon {
    width: 60px;
    height: 60px;
  }
  
  .file-type-icon .v-icon {
    font-size: 32px !important;
  }
}
</style>
