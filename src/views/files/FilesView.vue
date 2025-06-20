<template>
  <ResponsiveContainer>
    <div class="files-view">
      <!-- Hero Section -->
      <section class="hero-section">
        <v-container>
          <div class="hero-content">
            <div class="hero-text">
              <h1 class="hero-title">
                <v-icon icon="mdi-folder-heart" size="40" class="hero-icon" />
                Our Memory Collection
              </h1>
              <p class="hero-subtitle">
                Preserve and organize all your precious moments and memories
              </p>
            </div>
            
            <div class="hero-actions">
              <v-btn
                color="primary"
                size="large"
                rounded
                @click="showUploadZone = true"
                class="upload-btn"
              >
                <v-icon icon="mdi-cloud-upload" start />
                Upload Files
              </v-btn>
            </div>
          </div>
        </v-container>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <v-container>
          <v-row>
            <v-col cols="6" md="3">
              <v-card rounded="xl" elevation="2" class="stat-card">
                <v-card-text class="text-center">
                  <div class="stat-icon">
                    <v-icon icon="mdi-file-multiple" size="32" color="primary" />
                  </div>
                  <div class="stat-number">{{ fileStats.totalFiles }}</div>
                  <div class="stat-label">Total Files</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card rounded="xl" elevation="2" class="stat-card">
                <v-card-text class="text-center">
                  <div class="stat-icon">
                    <v-icon icon="mdi-image-multiple" size="32" color="success" />
                  </div>
                  <div class="stat-number">{{ fileStats.imageFiles }}</div>
                  <div class="stat-label">Photos</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card rounded="xl" elevation="2" class="stat-card">
                <v-card-text class="text-center">
                  <div class="stat-icon">
                    <v-icon icon="mdi-video-box" size="32" color="info" />
                  </div>
                  <div class="stat-number">{{ fileStats.videoFiles }}</div>
                  <div class="stat-label">Videos</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card rounded="xl" elevation="2" class="stat-card">
                <v-card-text class="text-center">
                  <div class="stat-icon">
                    <v-icon icon="mdi-harddisk" size="32" color="warning" />
                  </div>
                  <div class="stat-number">{{ formatFileSize(fileStats.totalSize) }}</div>
                  <div class="stat-label">Storage Used</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Upload Zone Modal -->
      <v-dialog v-model="showUploadZone" max-width="600" persistent>
        <v-card rounded="xl">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>Upload Files</span>
            <v-btn icon variant="text" @click="showUploadZone = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <FileUploadZone
              :is-uploading="isUploading"
              :upload-progress="uploadProgress"
              @files-selected="handleFilesSelected"
            />
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Controls Section -->
      <section class="controls-section">
        <v-container>
          <div class="controls-header">
            <h2 class="section-title">File Gallery</h2>
            
            <div class="view-controls">
              <v-btn-toggle v-model="viewMode" mandatory class="view-toggle">
                <v-btn value="grid" variant="outlined">
                  <v-icon icon="mdi-grid" />
                </v-btn>
                <v-btn value="list" variant="outlined">
                  <v-icon icon="mdi-view-list" />
                </v-btn>
              </v-btn-toggle>
            </div>
          </div>
          
          <v-row class="mt-4">
            <v-col cols="12" md="5">
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search files..."
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
                rounded
                class="search-field"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedType"
                :items="fileTypeOptions"
                label="Filter by type"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
                class="type-select"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Sort by"
                variant="outlined"
                density="comfortable"
                hide-details
                class="sort-select"
              />
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- File Categories -->
      <section v-if="!searchQuery && !selectedType" class="categories-section">
        <v-container>
          <div class="categories-grid">
            <div
              v-for="category in categories"
              :key="category.type"
              class="category-card"
              @click="selectCategory(category.type)"
            >
              <div class="category-icon" :class="category.class">
                <v-icon :color="category.color" size="32">{{ category.icon }}</v-icon>
              </div>
              <h3 class="category-title">{{ category.title }}</h3>
              <p class="category-count">{{ category.count }} files</p>
            </div>
          </div>
        </v-container>
      </section>

      <!-- Content Area -->
      <section class="content-section">
        <v-container>
          <!-- Loading State -->
          <div v-if="isLoading" class="loading-container">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              width="4"
            />
            <p class="loading-text">Loading your files...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredFiles.length === 0" class="empty-state">
            <div class="empty-icon">
              <v-icon icon="mdi-folder-open" size="120" color="grey-lighten-2" />
            </div>
            <h3 class="empty-title">No files found</h3>
            <p class="empty-subtitle">
              Upload your first file to start building your memory collection!
            </p>
            <v-btn
              color="primary"
              size="large"
              rounded
              @click="showUploadZone = true"
            >
              <v-icon icon="mdi-plus" start />
              Upload Your First File
            </v-btn>
          </div>

          <!-- Files Grid View -->
          <div v-else-if="viewMode === 'grid'" class="files-grid">
            <v-row>
              <v-col
                v-for="file in filteredFiles"
                :key="file.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <FileCard
                  :file="file"
                  @preview="handlePreviewFile"
                  @download="handleDownloadFile"
                  @share="handleShareFile"
                  @delete="handleDeleteFile"
                />
              </v-col>
            </v-row>
          </div>

          <!-- Files List View -->
          <div v-else class="files-list">
            <v-card rounded="xl" elevation="2">
              <v-list>
                <v-list-item
                  v-for="file in filteredFiles"
                  :key="file.id"
                  class="file-list-item"
                  @click="handlePreviewFile(file)"
                >
                  <template #prepend>
                    <v-avatar size="40" class="file-avatar">
                      <v-img
                        v-if="isImageFile(file)"
                        :src="getFileThumbnail(file)"
                        cover
                      />
                      <v-icon
                        v-else
                        :color="getFileTypeColor(file)"
                      >
                        {{ getFileTypeIcon(file) }}
                      </v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="file-list-title">
                    {{ getFileName(file) }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle class="file-list-subtitle">
                    <div class="d-flex align-center gap-2">
                      <span>{{ formatFileSize(getFileSize(file)) }}</span>
                      <span>•</span>
                      <span>{{ formatDate(getFileDate(file)) }}</span>
                      <v-chip
                        size="x-small"
                        :color="getFileTypeColor(file)"
                        variant="tonal"
                      >
                        {{ getFileCategory(file) }}
                      </v-chip>
                    </div>
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="list-actions">
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click.stop="handleDownloadFile(file)"
                      >
                        <v-icon size="16">mdi-download</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click.stop="handleShareFile(file)"
                      >
                        <v-icon size="16">mdi-share-variant</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        color="error"
                        @click.stop="handleDeleteFile(file)"
                      >
                        <v-icon size="16">mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </div>
        </v-container>
      </section>
    </div>
  </ResponsiveContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useFilesStore } from '@/stores/files'
import { useDialogsStore } from '@/stores/dialogs'
import dayjs from 'dayjs'
import FileCard from '@/components/files/FileCard.vue'
import FileUploadZone from '@/components/files/FileUploadZone.vue'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer.vue'

const filesStore = useFilesStore()
const dialogsStore = useDialogsStore()

// State
const searchQuery = ref('')
const selectedType = ref('')
const sortBy = ref('date-desc')
const viewMode = ref<'grid' | 'list'>('grid')
const showUploadZone = ref(false)

// Computed
const files = computed(() => filesStore.files)
const filteredFiles = computed(() => filesStore.filteredFiles)
const fileStats = computed(() => filesStore.fileStats)
const isLoading = computed(() => filesStore.isLoading)
const isUploading = computed(() => filesStore.isUploading)
const uploadProgress = computed(() => filesStore.uploadProgress)

const fileTypeOptions = [
  { title: 'All Files', value: '' },
  { title: 'Photos', value: 'image' },
  { title: 'Videos', value: 'video' },
  { title: 'Audio', value: 'audio' },
  { title: 'Documents', value: 'document' }
]

const sortOptions = [
  { title: 'Newest first', value: 'date-desc' },
  { title: 'Oldest first', value: 'date-asc' },
  { title: 'Name A-Z', value: 'name-asc' },
  { title: 'Name Z-A', value: 'name-desc' },
  { title: 'Largest first', value: 'size-desc' },
  { title: 'Smallest first', value: 'size-asc' }
]

const categories = computed(() => [
  {
    type: 'image',
    title: 'Photos',
    icon: 'mdi-image-multiple',
    color: 'success',
    class: 'category-photos',
    count: fileStats.value.imageFiles
  },
  {
    type: 'video',
    title: 'Videos', 
    icon: 'mdi-video-box',
    color: 'info',
    class: 'category-videos',
    count: fileStats.value.videoFiles
  },
  {
    type: 'audio',
    title: 'Audio',
    icon: 'mdi-music-box',
    color: 'purple',
    class: 'category-audio',
    count: fileStats.value.audioFiles || 0
  },
  {
    type: 'document',
    title: 'Documents',
    icon: 'mdi-file-multiple',
    color: 'orange',
    class: 'category-documents',
    count: fileStats.value.documentFiles || 0
  }
])

// Watch for filter changes
watch([searchQuery, selectedType, sortBy], () => {
  filesStore.setSearchQuery(searchQuery.value)
  filesStore.setSelectedType(selectedType.value)
  filesStore.setSortBy(sortBy.value)
})

// Methods
const loadFiles = async () => {
  try {
    await filesStore.initialize()
  } catch (error) {
    console.error('Failed to load files:', error)
  }
}

const selectCategory = (type: string) => {
  selectedType.value = type
}

const handleFilesSelected = async (selectedFiles: File[]) => {
  try {
    await filesStore.uploadFiles(selectedFiles)
    showUploadZone.value = false
  } catch (error) {
    console.error('Upload failed:', error)
    dialogsStore.openAlertDialog({
      title: 'Upload Failed',
      message: 'Failed to upload files. Please try again.'
    })
  }
}

const handlePreviewFile = (file: any) => {
  // Implementation for file preview
  console.log('Preview file:', file)
}

const handleDownloadFile = async (file: any) => {
  try {
    const fileName = getFileName(file)
    await filesStore.downloadFile(file.id, fileName)
  } catch (error) {
    console.error('Download failed:', error)
    dialogsStore.openAlertDialog({
      title: 'Download Failed',
      message: 'Failed to download file. Please try again.'
    })
  }
}

const handleShareFile = async (file: any) => {
  try {
    const shareUrl = await filesStore.shareFile(file.id)
    const fileName = getFileName(file)
    
    if (navigator.share) {
      await navigator.share({
        title: fileName,
        url: shareUrl
      })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      dialogsStore.openAlertDialog({
        title: 'Share Link Copied',
        message: 'The share link has been copied to your clipboard!'
      })
    }
  } catch (error) {
    console.error('Share failed:', error)
    dialogsStore.openAlertDialog({
      title: 'Share Failed',
      message: 'Failed to generate share link. Please try again.'
    })
  }
}

const handleDeleteFile = (file: any) => {
  const fileName = getFileName(file)
  
  dialogsStore.openConfirmDialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${fileName}"?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: async () => {
      try {
        await filesStore.deleteFile(file.id)
        
        dialogsStore.openAlertDialog({
          title: 'Deleted!',
          message: 'File has been deleted successfully!'
        })
      } catch (error) {
        console.error('Delete failed:', error)
        
        dialogsStore.openAlertDialog({
          title: 'Error!',
          message: 'Failed to delete file. Please try again.'
        })
      }
    }
  })
}

// Utility functions
const getFileName = (file: any) => {
  return file.name || file.fileName || file.originalName || 'Untitled'
}

const getFileSize = (file: any) => {
  return file.size || file.metadata?.size || 0
}

const getFileType = (file: any) => {
  return file.type || file.metadata?.mimeType || 'unknown'
}

const getFileDate = (file: any) => {
  return file.uploadedAt || file.createdAt || new Date()
}

const getFileThumbnail = (file: any) => {
  return file.thumbnailUrl || file.url || ''
}

const isImageFile = (file: any) => {
  const type = getFileType(file)
  return type.startsWith('image/')
}

const getFileTypeIcon = (file: any) => {
  const type = getFileType(file)
  
  if (type.startsWith('image/')) return 'mdi-image'
  if (type.startsWith('video/')) return 'mdi-video'
  if (type.startsWith('audio/')) return 'mdi-music'
  if (type.includes('pdf')) return 'mdi-file-pdf-box'
  if (type.includes('word')) return 'mdi-file-word-box'
  if (type.includes('excel')) return 'mdi-file-excel-box'
  if (type.includes('powerpoint')) return 'mdi-file-powerpoint-box'
  
  return 'mdi-file'
}

const getFileTypeColor = (file: any) => {
  const type = getFileType(file)
  
  if (type.startsWith('image/')) return 'success'
  if (type.startsWith('video/')) return 'info'
  if (type.startsWith('audio/')) return 'purple'
  if (type.includes('pdf')) return 'error'
  if (type.includes('word')) return 'primary'
  
  return 'grey'
}

const getFileCategory = (file: any) => {
  const type = getFileType(file)
  
  if (type.startsWith('image/')) return 'Photo'
  if (type.startsWith('video/')) return 'Video'
  if (type.startsWith('audio/')) return 'Audio'
  
  return 'Document'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (date: string | Date) => {
  return dayjs(date).format('MMM DD, YYYY')
}

// Initialize
onMounted(() => {
  loadFiles()
})
</script>

<style scoped>
.files-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #fefefe 0%, #f8f6f3 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-gradient));
  color: white;
  padding: 80px 0 60px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  line-height: 1.2;
}

.hero-icon {
  color: rgba(255, 255, 255, 0.9);
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
}

.upload-btn {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 255, 255, 0.2);
}

/* Stats Section */
.stats-section {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  margin-top: -30px;
  position: relative;
  z-index: 2;
}

.stat-card {
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  margin-bottom: 12px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Controls Section */
.controls-section {
  padding: 40px 0;
}

.controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.view-toggle {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
}

:deep(.search-field .v-field) {
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

/* Categories Section */
.categories-section {
  padding: 20px 0 40px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.category-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.category-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: all 0.3s ease;
}

.category-photos {
  background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
}

.category-videos {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
}

.category-audio {
  background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%);
}

.category-documents {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFCC02 100%);
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.category-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.category-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Content Section */
.content-section {
  padding: 20px 0 80px;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.loading-text {
  margin-top: 24px;
  font-size: 1.125rem;
  color: var(--text-secondary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  margin-bottom: 32px;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.empty-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* Files Grid */
.files-grid {
  margin-top: 20px;
}

/* Files List */
.files-list {
  margin-top: 20px;
}

.file-list-item {
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.file-list-item:hover {
  background: rgba(var(--primary-rgb), 0.02);
}

.file-list-item:last-child {
  border-bottom: none;
}

.file-avatar {
  border-radius: 12px;
}

.file-list-title {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.file-list-subtitle {
  margin-top: 8px;
}

.list-actions {
  display: flex;
  gap: 8px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.file-list-item:hover .list-actions {
  opacity: 1;
}

/* Responsive */
@media (max-width: 960px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .controls-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .section-title {
    text-align: center;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 12px;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .category-card {
    padding: 24px 20px;
  }
  
  .category-icon {
    width: 60px;
    height: 60px;
  }
}
</style>
