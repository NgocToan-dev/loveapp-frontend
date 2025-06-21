<template>
  <v-container fluid max-width="1200">
    <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="file">
      <!-- Header with actions -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center">
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            class="mr-3"
            @click="goBack"
          ></v-btn>
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">
              <v-icon :icon="getFileIcon(file.metadata?.mimeType || '')" class="mr-2"></v-icon>
              {{ file.fileName || file.originalName }}
            </h1>
            <p class="text-body-2 text-medium-emphasis">
              {{ formatFileSize(file.metadata?.size || 0) }} • 
              {{ formatDate(file.createdAt) }}
              <v-chip
                v-if="file.category"
                :color="getCategoryColor(file.category)"
                variant="tonal"
                size="small"
                class="ml-2"
              >
                {{ getCategoryLabel(file.category) }}
              </v-chip>
            </p>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="d-flex gap-2">
          <v-btn
            icon="mdi-download"
            color="primary"
            variant="text"
            @click="downloadFile"
          ></v-btn>
          
          <v-btn
            v-if="file.isPublic"
            icon="mdi-share-variant"
            color="blue"
            variant="text"
            @click="shareFile"
          ></v-btn>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                v-bind="props"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item @click="editMetadata">
                <template v-slot:prepend>
                  <v-icon icon="mdi-pencil"></v-icon>
                </template>
                <v-list-item-title>{{ $t('files.editMetadata') || 'Edit Metadata' }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="togglePublic">
                <template v-slot:prepend>
                  <v-icon :icon="file.isPublic ? 'mdi-lock' : 'mdi-share'"></v-icon>
                </template>
                <v-list-item-title>
                  {{ file.isPublic ? ($t('files.makePrivate') || 'Make Private') : ($t('files.makePublic') || 'Make Public') }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteFile" class="text-error">
                <template v-slot:prepend>
                  <v-icon icon="mdi-delete" color="error"></v-icon>
                </template>
                <v-list-item-title>{{ $t('common.delete') || 'Delete' }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <!-- File content -->
      <v-row>
        <v-col cols="12" lg="8">
          <!-- File preview card -->
          <v-card class="mb-4">
            <v-card-text class="pa-6">
              <!-- Image preview -->
              <div v-if="isImage" class="text-center">
                <v-img
                  :src="file.url"
                  :alt="file.fileName || file.originalName"
                  max-height="600"
                  contain
                  class="mx-auto"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </div>

              <!-- Video preview -->
              <div v-else-if="isVideo" class="text-center">
                <video
                  :src="file.url"
                  controls
                  style="max-width: 100%; max-height: 600px;"
                  class="mx-auto"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <!-- Audio preview -->
              <div v-else-if="isAudio" class="text-center">
                <audio :src="file.url" controls class="w-100">
                  Your browser does not support the audio tag.
                </audio>
              </div>

              <!-- PDF preview -->
              <div v-else-if="isPDF" class="text-center">
                <iframe
                  :src="file.url"
                  style="width: 100%; height: 600px; border: 1px solid #ddd;"
                >
                  <p>{{ $t('files.pdfNotSupported') || 'Your browser does not support PDFs.' }}</p>
                  <a :href="file.url" target="_blank">{{ $t('files.downloadPDF') || 'Download PDF' }}</a>
                </iframe>
              </div>

              <!-- Generic file preview -->
              <div v-else class="text-center pa-8">
                <v-icon :icon="getFileIcon(file.metadata?.mimeType || '')" size="96" color="grey" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">{{ file.fileName || file.originalName }}</h3>
                <p class="text-body-1 text-medium-emphasis mb-4">
                  {{ $t('files.previewNotAvailable') || 'Preview not available for this file type' }}
                </p>
                <v-btn
                  color="primary"
                  variant="elevated"
                  prepend-icon="mdi-download"
                  @click="downloadFile"
                >
                  {{ $t('files.download') || 'Download' }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Description -->
          <v-card v-if="file.description" class="mb-4">
            <v-card-title class="text-h6">
              <v-icon icon="mdi-text" class="mr-2"></v-icon>
              {{ $t('files.description') || 'Description' }}
            </v-card-title>
            <v-card-text>
              <div class="text-body-1" style="white-space: pre-wrap; line-height: 1.6;">
                {{ file.description }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" lg="4">
          <!-- File info card -->
          <v-card class="mb-4">
            <v-card-title class="text-h6">
              <v-icon icon="mdi-information" class="mr-2"></v-icon>
              {{ $t('files.details') || 'File Details' }}
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-file"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.fileName') || 'File Name' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ file.fileName || file.originalName }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-file-outline"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.originalName') || 'Original Name' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ file.originalName }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-weight"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.size') || 'Size' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatFileSize(file.metadata?.size || 0) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-file-code"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.type') || 'Type' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ file.metadata?.mimeType || 'Unknown' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-folder"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.category') || 'Category' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ getCategoryLabel(file.category) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-shield-account"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.visibility') || 'Visibility' }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ file.isPublic ? ($t('files.public') || 'Public') : ($t('files.private') || 'Private') }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-clock"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.uploadedAt') || 'Uploaded' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDateTime(file.createdAt) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="file.updatedAt !== file.createdAt">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-update"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.updatedAt') || 'Updated' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDateTime(file.updatedAt) }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Tags -->
          <v-card v-if="file.tags && file.tags.length > 0" class="mb-4">
            <v-card-title class="text-h6">
              <v-icon icon="mdi-tag-multiple" class="mr-2"></v-icon>
              {{ $t('files.tags') || 'Tags' }}
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="tag in file.tags"
                  :key="tag"
                  color="primary"
                  variant="outlined"
                  size="small"
                >
                  #{{ tag }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- Usage stats -->
          <v-card>
            <v-card-title class="text-h6">
              <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
              {{ $t('files.usage') || 'Usage Stats' }}
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-download"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.downloads') || 'Downloads' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ file.usage?.downloadCount || 0 }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-eye"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.views') || 'Views' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ file.usage?.viewCount || 0 }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-share"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('files.shares') || 'Shares' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ file.usage?.shareCount || 0 }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Not found -->
    <div v-else class="text-center pa-8">
      <v-icon icon="mdi-file-remove" size="64" color="grey" class="mb-4"></v-icon>
      <h2 class="text-h5 mb-2">{{ $t('files.notFound') || 'File Not Found' }}</h2>
      <p class="text-body-1 text-medium-emphasis mb-4">
        {{ $t('files.notFoundDescription') || 'The file you are looking for does not exist or has been deleted.' }}
      </p>
      <v-btn color="primary" @click="goBack">
        {{ $t('common.goBack') || 'Go Back' }}
      </v-btn>
    </div>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          {{ $t('files.confirmDelete') || 'Delete File' }}
        </v-card-title>
        <v-card-text>
          {{ $t('files.deleteWarning') || 'Are you sure you want to delete this file? This action cannot be undone.' }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">
            {{ $t('common.cancel') || 'Cancel' }}
          </v-btn>
          <v-btn
            color="error"
            @click="confirmDelete"
            :loading="actionLoading"
          >
            {{ $t('common.delete') || 'Delete' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>    <!-- Edit metadata dialog -->
    <EditFileMetadataDialog
      v-model="editDialog"
      :file="file"
      @file-updated="onFileUpdated"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFilesStore } from '@/stores/files'
import EditFileMetadataDialog from '../../components/files/EditFileMetadataDialog.vue'
import type { FileItem } from '@/types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const filesStore = useFilesStore()

const loading = ref(true)
const actionLoading = ref(false)
const deleteDialog = ref(false)
const editDialog = ref(false)
const file = ref<FileItem | null>(null)

const isImage = computed(() => {
  return file.value?.metadata?.mimeType?.startsWith('image/') || file.value?.type?.startsWith('image/')
})

const isVideo = computed(() => {
  return file.value?.metadata?.mimeType?.startsWith('video/') || file.value?.type?.startsWith('video/')
})

const isAudio = computed(() => {
  return file.value?.metadata?.mimeType?.startsWith('audio/') || file.value?.type?.startsWith('audio/')
})

const isPDF = computed(() => {
  return file.value?.metadata?.mimeType?.includes('pdf') || file.value?.type?.includes('pdf')
})

const loadFile = async () => {
  loading.value = true
  try {
    const fileId = route.params.id as string
    let foundFile = filesStore.files.find(f => f.id === fileId)
    
    if (!foundFile) {
      await filesStore.fetchFiles()
      foundFile = filesStore.files.find(f => f.id === fileId)
    }
      if (foundFile) {
      file.value = foundFile
      // TODO: Implement view count tracking if needed
    } else {
      file.value = null
    }
  } catch (error) {
    console.error('Error loading file:', error)
    file.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getCategoryLabel = (category: string) => {
  const categories: Record<string, string> = {
    'images': 'Hình ảnh',
    'documents': 'Tài liệu',
    'videos': 'Video',
    'audio': 'Âm thanh',
    'archives': 'Lưu trữ',
    'other': 'Khác'
  }
  return categories[category] || category
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'images': 'green',
    'documents': 'blue',
    'videos': 'red',
    'audio': 'purple',
    'archives': 'orange',
    'other': 'grey'
  }
  return colors[category] || 'grey'
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'mdi-image'
  if (mimeType.startsWith('video/')) return 'mdi-video'
  if (mimeType.startsWith('audio/')) return 'mdi-music'
  if (mimeType.includes('pdf')) return 'mdi-file-pdf'
  if (mimeType.includes('doc')) return 'mdi-file-word'
  if (mimeType.includes('sheet')) return 'mdi-file-excel'
  if (mimeType.includes('presentation')) return 'mdi-file-powerpoint'
  if (mimeType.includes('zip') || mimeType.includes('rar')) return 'mdi-archive'
  return 'mdi-file'
}

const downloadFile = () => {
  if (file.value?.url) {
    window.open(file.value.url, '_blank')
    // TODO: Implement download count tracking if needed
  }
}

const shareFile = () => {
  if (file.value?.url) {
    navigator.clipboard.writeText(file.value.url)
    // Show success message
    console.log('File URL copied to clipboard')
    // TODO: Implement share count tracking if needed
  }
}

const editMetadata = () => {
  editDialog.value = true
}

const togglePublic = async () => {
  if (!file.value) return
  
  actionLoading.value = true
  try {
    // TODO: Implement visibility toggle when API supports it
    console.log('Toggle public visibility for file:', file.value.id)
    // For now, just update local state
    file.value.isPublic = !file.value.isPublic
  } catch (error) {
    console.error('Error toggling file visibility:', error)
  } finally {
    actionLoading.value = false
  }
}

const deleteFile = () => {
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!file.value) return
  
  actionLoading.value = true
  try {
    await filesStore.deleteFile(file.value.id)
    router.push('/files')
  } catch (error) {
    console.error('Error deleting file:', error)
  } finally {
    actionLoading.value = false
    deleteDialog.value = false
  }
}

const onFileUpdated = (updatedFile: FileItem) => {
  file.value = updatedFile
  editDialog.value = false
}

const goBack = () => {
  router.push('/files')
}

onMounted(() => {
  loadFile()
})
</script>

<style scoped>
iframe {
  border-radius: 8px;
}

video, audio {
  border-radius: 8px;
}
</style>
