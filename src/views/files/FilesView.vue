<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFilesStore } from '@/stores/files'
import FilesService from '@/services/files'
import dayjs from 'dayjs'

const { t } = useI18n()
const filesStore = useFilesStore()

// Local state
const uploadDialog = ref(false)

// Computed from store
const {
  files,
  filteredFiles,
  fileStats,
  isLoading,
  uploadProgress,
  isUploading,
  searchQuery,
  selectedType,
  sortBy
} = filesStore

// File type options
const fileTypes = [
  { title: t('files.allTypes'), value: '' },
  { title: t('files.images'), value: 'image' },
  { title: t('files.videos'), value: 'video' },
  { title: t('files.audio'), value: 'audio' },
  { title: t('files.documents'), value: 'document' },
]

const sortOptions = [
  { title: t('files.newestFirst'), value: 'date-desc' },
  { title: t('files.oldestFirst'), value: 'date-asc' },
  { title: t('files.nameAZ'), value: 'name-asc' },
  { title: t('files.nameZA'), value: 'name-desc' },
  { title: t('files.largestFirst'), value: 'size-desc' },
  { title: t('files.smallestFirst'), value: 'size-asc' },
]

// Methods
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const selectedFiles = Array.from(target.files)
    uploadFiles(selectedFiles)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files) {
    const droppedFiles = Array.from(event.dataTransfer.files)
    uploadFiles(droppedFiles)
  }
}

const uploadFiles = async (filesToUpload: File[]) => {
  try {
    await filesStore.uploadFiles(filesToUpload)
    uploadDialog.value = false
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const viewFile = (file: any) => {
  window.open(file.url, '_blank')
}

const downloadFile = async (file: any) => {
  try {
    await filesStore.downloadFile(file.id, file.name)
  } catch (error) {
    console.error('Download failed:', error)
  }
}

const shareFile = async (file: any) => {
  try {
    const shareUrl = await filesStore.shareFile(file.id)
    if (navigator.share) {
      await navigator.share({
        title: file.name,
        url: shareUrl
      })
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      // You might want to show a toast notification here
    }
  } catch (error) {
    console.error('Share failed:', error)
  }
}

const deleteFile = async (file: any) => {
  if (confirm(t('files.confirmDelete', { name: file.name }))) {
    try {
      await filesStore.deleteFile(file.id)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }
}

const isImage = (type: string) => {
  // Since we can't access static methods from instance, we'll implement locally
  return type.startsWith('image/')
}
const getFileTypeIcon = (type: string) => {
  if (type.startsWith('image/')) return 'mdi-image'
  if (type.startsWith('video/')) return 'mdi-video'
  if (type.startsWith('audio/')) return 'mdi-music'
  if (type.includes('pdf')) return 'mdi-file-pdf-box'
  if (type.includes('word')) return 'mdi-file-word-box'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'mdi-file-excel-box'
  if (type.includes('powerpoint') || type.includes('presentation')) return 'mdi-file-powerpoint-box'
  if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return 'mdi-folder-zip'
  if (type.includes('text')) return 'mdi-file-document'
  return 'mdi-file'
}
const getFileTypeColor = (type: string) => {
  if (type.startsWith('image/')) return 'success'
  if (type.startsWith('video/')) return 'info'
  if (type.startsWith('audio/')) return 'purple'
  if (type.includes('pdf')) return 'error'
  if (type.includes('word')) return 'primary'
  if (type.includes('excel')) return 'success'
  if (type.includes('powerpoint')) return 'warning'
  return 'grey'
}
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
const formatDate = (date: Date) => dayjs(date).format('DD/MM/YYYY')

// File input ref
const fileInputRef = ref<HTMLInputElement>()

const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

// Lifecycle
onMounted(() => {
  filesStore.initialize()
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <h1 class="text-h4 font-weight-bold">{{ $t('files.title') }}</h1>
            <p class="text-subtitle-1 text-medium-emphasis">{{ $t('files.subtitle') }}</p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-upload"
            @click="uploadDialog = true"
          >
            {{ $t('files.upload') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- File Statistics -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="primary" size="40" class="me-3">mdi-file-multiple</v-icon>
              <div>
                <div class="text-h6">{{ fileStats.totalFiles }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('files.totalFiles') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="success" size="40" class="me-3">mdi-image-multiple</v-icon>
              <div>
                <div class="text-h6">{{ fileStats.imageFiles }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('files.images') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="info" size="40" class="me-3">mdi-video-multiple</v-icon>
              <div>
                <div class="text-h6">{{ fileStats.videoFiles }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('files.videos') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="warning" size="40" class="me-3">mdi-harddisk</v-icon>
              <div>
                <div class="text-h6">{{ formatFileSize(fileStats.totalSize) }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('files.totalSize') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- File Filters -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          :label="$t('files.search')"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedType"
          :items="fileTypes"
          :label="$t('files.filterByType')"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          :label="$t('files.sortBy')"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>

    <!-- Files Grid -->
    <v-row>
      <v-col
        v-for="file in filteredFiles"
        :key="file.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card hover @click="viewFile(file)">
          <div class="file-preview">
            <v-img
              v-if="isImage(file.type)"
              :src="file.thumbnailUrl || file.url"
              height="200"
              cover
            />
            <div
              v-else
              class="d-flex align-center justify-center"
              style="height: 200px; background-color: #f5f5f5;"
            >
              <v-icon :color="getFileTypeColor(file.type)" size="80">
                {{ getFileTypeIcon(file.type) }}
              </v-icon>
            </div>
          </div>
          
          <v-card-text>
            <div class="text-subtitle-2 font-weight-medium mb-1">
              {{ file.name }}
            </div>
            <div class="text-caption text-medium-emphasis mb-2">
              {{ formatFileSize(file.size) }} • {{ formatDate(file.uploadedAt) }}
            </div>
            <v-chip
              :color="getFileTypeColor(file.type)"
              size="small"
              variant="tonal"
            >
              {{ file.type.split('/')[0] }}
            </v-chip>
          </v-card-text>

          <v-card-actions>
            <v-btn
              icon="mdi-download"
              size="small"
              variant="text"
              @click.stop="downloadFile(file)"
            />
            <v-btn
              icon="mdi-share-variant"
              size="small"
              variant="text"
              @click.stop="shareFile(file)"
            />
            <v-spacer />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click.stop="deleteFile(file)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-if="files.length === 0 && !isLoading">
      <v-col cols="12" class="text-center py-12">
        <v-icon size="120" color="grey-lighten-2">mdi-file-outline</v-icon>
        <h3 class="text-h5 mt-4 mb-2">{{ $t('files.noFiles') }}</h3>
        <p class="text-body-1 text-medium-emphasis mb-4">{{ $t('files.noFilesDescription') }}</p>
        <v-btn
          color="primary"
          prepend-icon="mdi-upload"
          @click="uploadDialog = true"
        >
          {{ $t('files.uploadFirst') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="isLoading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="text-body-1 mt-4">{{ $t('files.loading') }}</p>
      </v-col>
    </v-row>

    <!-- Upload Dialog -->
    <v-dialog v-model="uploadDialog" max-width="600">
      <v-card>
        <v-card-title>{{ $t('files.uploadFiles') }}</v-card-title>
        <v-card-text>
          <div class="upload-area" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
            <v-icon size="80" color="grey-lighten-2">mdi-cloud-upload</v-icon>
            <h3 class="mt-4 mb-2">{{ $t('files.dragAndDrop') }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">{{ $t('files.orClickToSelect') }}</p>
            <v-btn color="primary" @click="triggerFileSelect">
              {{ $t('files.selectFiles') }}
            </v-btn>
            <input
              ref="fileInputRef"
              type="file"
              multiple
              style="display: none"
              @change="handleFileSelect"
            />
          </div>
          
          <!-- Upload Progress -->
          <div v-if="uploadProgress.length > 0" class="mt-4">
            <h4 class="mb-2">{{ $t('files.uploadProgress') }}</h4>
            <div v-for="progress in uploadProgress" :key="progress.name" class="mb-2">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2">{{ progress.name }}</span>
                <span class="text-caption">{{ progress.progress }}%</span>
              </div>
              <v-progress-linear :model-value="progress.progress" height="4" />
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="uploadDialog = false">{{ $t('common.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #1976d2;
}

.file-preview {
  position: relative;
  overflow: hidden;
}
</style>