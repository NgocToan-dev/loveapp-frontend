<template>  <div
    class="upload-zone loveClick"
    :class="{
      'upload-zone--dragging': isDragging,
      'upload-zone--uploading': isUploading
    }"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @click="triggerFileSelect"
  >
    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept="*/*"
      @change="handleFileSelect"
      style="display: none"
    />    <!-- Upload Icon & Animation -->
    <div class="upload-icon slideInUp">
      <div v-if="isUploading" class="uploading-animation magicalGlow">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="4"
        />
      </div>
      <div v-else class="upload-cloud">
        <v-icon size="64" color="primary" class="cloud-icon floatingHeart">
          mdi-cloud-upload
        </v-icon>
        <div class="upload-arrow">
          <v-icon size="24" color="primary" class="heartBeat">mdi-arrow-up</v-icon>
        </div>
      </div>
    </div>

    <!-- Upload Text -->
    <div class="upload-content slideInUp" style="animation-delay: 0.2s;">
      <h3 class="upload-title">
        {{ isUploading ? 'Uploading files...' : 'Upload your files' }}
      </h3>
        <p class="upload-subtitle" v-if="!isUploading">
        Drag and drop files here or click to browse
      </p>
      
      <div v-if="isUploading && progressValue > 0" class="upload-progress">
        <v-progress-linear
          :model-value="progressValue"
          color="primary"
          height="4"
          rounded
          class="mb-2"
        />
        <span class="progress-text">{{ Math.round(progressValue) }}% complete</span>
      </div>
    </div>    <!-- File Types -->
    <div v-if="!isUploading" class="supported-types slideInUp" style="animation-delay: 0.4s;">
      <div class="type-item loveClick sparkle">
        <v-icon size="20" color="success">mdi-image</v-icon>
        <span>Images</span>
      </div>
      <div class="type-item loveClick sparkle">
        <v-icon size="20" color="info">mdi-video</v-icon>
        <span>Videos</span>
      </div>
      <div class="type-item loveClick sparkle">
        <v-icon size="20" color="purple">mdi-music</v-icon>
        <span>Audio</span>
      </div>
      <div class="type-item loveClick sparkle">
        <v-icon size="20" color="error">mdi-file-document</v-icon>
        <span>Documents</span>
      </div>
    </div>

    <!-- Upload Button -->
    <div v-if="!isUploading" class="upload-actions slideInUp" style="animation-delay: 0.6s;">
      <v-btn
        color="primary"
        size="large"
        rounded
        @click.stop="triggerFileSelect"
        class="upload-btn loveClick cardLift"
      >
        <v-icon start>mdi-plus</v-icon>
        Choose Files
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  isUploading?: boolean
  uploadProgress?: number | any[]
}

const props = defineProps<Props>()

// Computed to get a single progress value
const progressValue = computed(() => {
  if (typeof props.uploadProgress === 'number') {
    return props.uploadProgress
  }
  if (Array.isArray(props.uploadProgress) && props.uploadProgress.length > 0) {
    // Calculate average progress from array
    const total = props.uploadProgress.reduce((sum, item) => sum + (item.progress || 0), 0)
    return total / props.uploadProgress.length
  }
  return 0
})


// State
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement>()

// Methods
const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const files = Array.from(target.files)
    emit('files-selected', files)
    // Reset input to allow selecting same file again
    target.value = ''
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  if (event.dataTransfer?.files) {
    const files = Array.from(event.dataTransfer.files)
    emit('files-selected', files)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  // Only set to false if leaving the entire upload zone
  const target = event.currentTarget as HTMLElement
  const relatedTarget = event.relatedTarget as HTMLElement
  
  if (!target?.contains(relatedTarget)) {
    isDragging.value = false
  }
}

// Use emit function
const emit = defineEmits<{
  'files-selected': [files: File[]]
}>()
</script>

<style scoped>
.upload-zone {
  border: 2px dashed rgba(var(--primary-rgb), 0.3);
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.02) 0%, 
    rgba(var(--secondary-rgb), 0.02) 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.upload-zone::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f8f9fa' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z'/%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.upload-zone:hover,
.upload-zone--dragging {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.05) 0%, 
    rgba(var(--secondary-rgb), 0.05) 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 32px rgba(var(--primary-rgb), 0.15);
}

.upload-zone--uploading {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.08) 0%, 
    rgba(var(--secondary-rgb), 0.08) 100%);
  cursor: not-allowed;
}

/* Upload Icon */
.upload-icon {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.upload-cloud {
  position: relative;
  display: inline-block;
}

.cloud-icon {
  animation: floatingHeart 3s ease-in-out infinite;
}

.upload-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: heartBeat 2s ease-in-out infinite;
}

.uploading-animation {
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}

/* Upload Content */
.upload-content {
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.upload-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.upload-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  opacity: 0.8;
}

.upload-progress {
  margin-top: 16px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Supported Types */
.supported-types {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.3s ease;
}

.type-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

/* Upload Actions */
.upload-actions {
  position: relative;
  z-index: 1;
}

.upload-btn {
  background: var(--primary-gradient) !important;
  color: white !important;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.3);
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(var(--primary-rgb), 0.4);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes bounce {
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  50% { transform: translate(-50%, -50%) translateY(-5px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Responsive */
@media (max-width: 768px) {
  .upload-zone {
    padding: 40px 24px;
  }
  
  .upload-title {
    font-size: 1.25rem;
  }
  
  .upload-subtitle {
    font-size: 0.9rem;
  }
  
  .supported-types {
    gap: 16px;
  }
  
  .type-item {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .supported-types {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .type-item {
    width: auto;
    justify-content: center;
  }
}
</style>
