<template>
  <v-container fluid max-width="900">
    <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px;">
      <v-progress-circular indeterminate color="pink" size="64"></v-progress-circular>
    </div>

    <div v-else-if="memory">
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
            <h1 class="text-h4 font-weight-bold text-pink mb-1">
              <v-icon icon="mdi-heart" class="mr-2"></v-icon>
              {{ memory.title }}
            </h1>
            <p class="text-body-2 text-medium-emphasis">
              {{ formatDate(memory.date) }}
              <span v-if="memory.location" class="ml-2">
                <v-icon icon="mdi-map-marker" size="small" class="mr-1"></v-icon>
                {{ typeof memory.location === 'string' ? memory.location : memory.location.name }}
              </span>
            </p>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="d-flex gap-2">
          <v-btn
            icon="mdi-heart"
            :color="memory.isFavorite ? 'pink' : 'grey'"
            variant="text"
            @click="toggleFavorite"
            :loading="actionLoading"
          ></v-btn>
          
          <v-btn
            icon="mdi-share-variant"
            color="blue"
            variant="text"
            @click="shareMemory"
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
              <v-list-item @click="editMemory">
                <template v-slot:prepend>
                  <v-icon icon="mdi-pencil"></v-icon>
                </template>
                <v-list-item-title>{{ $t('common.edit') || 'Edit' }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteMemory" class="text-error">
                <template v-slot:prepend>
                  <v-icon icon="mdi-delete" color="error"></v-icon>
                </template>
                <v-list-item-title>{{ $t('common.delete') || 'Delete' }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <!-- Memory content -->
      <v-row>
        <v-col cols="12" md="8">
          <!-- Main content card -->
          <v-card class="mb-4">
            <v-card-text class="pa-6">
              <!-- Category and privacy badges -->
              <div class="d-flex flex-wrap gap-2 mb-4">
                <v-chip
                  :color="getCategoryColor(memory.category)"
                  variant="tonal"
                  size="small"
                >
                  <v-icon start :icon="getCategoryIcon(memory.category)"></v-icon>
                  {{ getCategoryLabel(memory.category) }}
                </v-chip>
                
                <v-chip
                  v-if="memory.isPrivate"
                  color="grey"
                  variant="tonal"
                  size="small"
                >
                  <v-icon start icon="mdi-lock"></v-icon>
                  {{ $t('memories.private') || 'Private' }}
                </v-chip>

                <v-chip
                  v-if="memory.isShared"
                  color="success"
                  variant="tonal"
                  size="small"
                >
                  <v-icon start icon="mdi-share"></v-icon>
                  {{ $t('memories.shared') || 'Shared' }}
                </v-chip>
              </div>

              <!-- Description -->
              <div class="text-body-1 mb-4" style="white-space: pre-wrap; line-height: 1.6;">
                {{ memory.description }}
              </div>

              <!-- Tags -->
              <div v-if="memory.tags && memory.tags.length > 0" class="mb-4">
                <h3 class="text-h6 mb-2">{{ $t('memories.tags') || 'Tags' }}</h3>
                <div class="d-flex flex-wrap gap-2">
                  <v-chip
                    v-for="tag in memory.tags"
                    :key="tag"
                    color="pink"
                    variant="outlined"
                    size="small"
                  >
                    #{{ tag }}
                  </v-chip>
                </div>
              </div>

              <!-- Files/Media -->
              <div v-if="memory.files && memory.files.length > 0" class="mb-4">
                <h3 class="text-h6 mb-3">{{ $t('memories.attachments') || 'Attachments' }}</h3>
                <v-row>
                  <v-col
                    v-for="file in memory.files"
                    :key="file.id"
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-card
                      class="file-card"
                      @click="viewFile(file)"
                      hover
                    >
                      <v-img
                        v-if="file.type?.startsWith('image/') || file.metadata?.mimeType?.startsWith('image/')"
                        :src="file.url"
                        :alt="file.fileName || file.originalName"
                        aspect-ratio="1"
                        cover
                      >
                        <template v-slot:placeholder>
                          <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular indeterminate color="pink"></v-progress-circular>
                          </div>
                        </template>
                      </v-img>
                      
                      <div v-else class="d-flex align-center justify-center pa-4" style="height: 150px;">
                        <v-icon :icon="getFileIcon(file.type || file.metadata?.mimeType || 'file')" size="48" color="grey"></v-icon>
                      </div>
                      
                      <v-card-text class="pa-2">
                        <p class="text-caption text-truncate">{{ file.fileName || file.originalName }}</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" md="4">
          <!-- Memory info card -->
          <v-card class="mb-4">
            <v-card-title class="text-h6">
              <v-icon icon="mdi-information" class="mr-2"></v-icon>
              {{ $t('memories.details') || 'Details' }}
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-calendar"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('memories.date') || 'Date' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(memory.date) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="memory.location">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-map-marker"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('memories.location') || 'Location' }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ typeof memory.location === 'string' ? memory.location : memory.location.name }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-account"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('memories.createdBy') || 'Created by' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ memory.createdBy }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-clock"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('memories.createdAt') || 'Created' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDateTime(memory.createdAt) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="memory.updatedAt !== memory.createdAt">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-update"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('memories.updatedAt') || 'Updated' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDateTime(memory.updatedAt) }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Related memories (optional) -->
          <v-card v-if="relatedMemories.length > 0">
            <v-card-title class="text-h6">
              <v-icon icon="mdi-heart-multiple" class="mr-2"></v-icon>
              {{ $t('memories.related') || 'Related Memories' }}
            </v-card-title>
            <v-card-text>
              <div
                v-for="related in relatedMemories"
                :key="related.id"
                class="d-flex align-center pa-2 rounded cursor-pointer hover-bg"
                @click="viewMemory(related.id)"
              >
                <v-avatar size="40" class="mr-3">
                  <v-img
                    v-if="related.files?.[0]?.type?.startsWith('image/') || related.files?.[0]?.metadata?.mimeType?.startsWith('image/')"
                    :src="related.files[0].url"
                    :alt="related.title"
                  ></v-img>
                  <v-icon v-else icon="mdi-heart" color="pink"></v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <p class="text-body-2 font-weight-medium mb-0">{{ related.title }}</p>
                  <p class="text-caption text-medium-emphasis">{{ formatDate(related.date) }}</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Not found -->
    <div v-else class="text-center pa-8">
      <v-icon icon="mdi-heart-broken" size="64" color="grey" class="mb-4"></v-icon>
      <h2 class="text-h5 mb-2">{{ $t('memories.notFound') || 'Memory Not Found' }}</h2>
      <p class="text-body-1 text-medium-emphasis mb-4">
        {{ $t('memories.notFoundDescription') || 'The memory you are looking for does not exist or has been deleted.' }}
      </p>
      <v-btn color="pink" @click="goBack">
        {{ $t('common.goBack') || 'Go Back' }}
      </v-btn>
    </div>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          {{ $t('memories.confirmDelete') || 'Delete Memory' }}
        </v-card-title>
        <v-card-text>
          {{ $t('memories.deleteWarning') || 'Are you sure you want to delete this memory? This action cannot be undone.' }}
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
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMemoriesStore } from '@/stores/memories'
import type { Memory, FileItem } from '@/types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const memoriesStore = useMemoriesStore()

const loading = ref(true)
const actionLoading = ref(false)
const deleteDialog = ref(false)
const memory = ref<Memory | null>(null)

const relatedMemories = computed(() => {
  if (!memory.value) return []
  
  return memoriesStore.memories
    .filter(m => 
      m.id !== memory.value!.id && 
      (m.category === memory.value!.category || 
       m.tags.some(tag => memory.value!.tags.includes(tag)))
    )
    .slice(0, 5)
})

const loadMemory = async () => {
  loading.value = true
  try {
    const memoryId = route.params.id as string
    let foundMemory = memoriesStore.memories.find(m => m.id === memoryId)
    
    if (!foundMemory) {
      await memoriesStore.fetchMemories()
      foundMemory = memoriesStore.memories.find(m => m.id === memoryId)
    }
    
    if (foundMemory) {
      memory.value = foundMemory
    } else {
      memory.value = null
    }
  } catch (error) {
    console.error('Error loading memory:', error)
    memory.value = null
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

const getCategoryLabel = (category: string) => {
  const categories: Record<string, string> = {
    'date': 'Hẹn hò',
    'travel': 'Du lịch',
    'milestone': 'Kỷ niệm',
    'daily': 'Hằng ngày',
    'special': 'Đặc biệt',
    'other': 'Khác'
  }
  return categories[category] || category
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'date': 'pink',
    'travel': 'blue',
    'milestone': 'purple',
    'daily': 'green',
    'special': 'orange',
    'other': 'grey'
  }
  return colors[category] || 'grey'
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'date': 'mdi-heart',
    'travel': 'mdi-airplane',
    'milestone': 'mdi-star',
    'daily': 'mdi-calendar-today',
    'special': 'mdi-gift',
    'other': 'mdi-folder'
  }
  return icons[category] || 'mdi-folder'
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return 'mdi-image'
  if (type.startsWith('video/')) return 'mdi-video'
  if (type.startsWith('audio/')) return 'mdi-music'
  if (type.includes('pdf')) return 'mdi-file-pdf'
  if (type.includes('doc')) return 'mdi-file-word'
  return 'mdi-file'
}

const toggleFavorite = async () => {
  if (!memory.value) return
  
  actionLoading.value = true
  try {
    await memoriesStore.updateMemory(memory.value.id, {
      isFavorite: !memory.value.isFavorite
    })
    memory.value.isFavorite = !memory.value.isFavorite
  } catch (error) {
    console.error('Error toggling favorite:', error)
  } finally {
    actionLoading.value = false
  }
}

const shareMemory = () => {
  // TODO: Implement share functionality
  console.log('Share memory:', memory.value?.id)
}

const editMemory = () => {
  if (memory.value) {
    router.push(`/memories/${memory.value.id}/edit`)
  }
}

const deleteMemory = () => {
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!memory.value) return
  
  actionLoading.value = true
  try {
    await memoriesStore.deleteMemory(memory.value.id)
    router.push('/memories')
  } catch (error) {
    console.error('Error deleting memory:', error)
  } finally {
    actionLoading.value = false
    deleteDialog.value = false
  }
}

const viewFile = (file: FileItem) => {
  // TODO: Implement file viewer
  window.open(file.url, '_blank')
}

const viewMemory = (id: string) => {
  router.push(`/memories/${id}`)
}

const goBack = () => {
  router.push('/memories')
}

onMounted(() => {
  loadMemory()
})
</script>

<style scoped>
.text-pink {
  color: rgb(233, 30, 99) !important;
}

.file-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.file-card:hover {
  transform: translateY(-2px);
}

.hover-bg:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.08);
}

.cursor-pointer {
  cursor: pointer;
}
</style> 