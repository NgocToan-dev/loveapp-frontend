<template>
  <AppLayout>
    <div class="memory-detail-page">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb mb-6">
        <RouterLink to="/memories" class="breadcrumb-link text-blue-600 hover:text-blue-800">
          {{ $t('memories.title') }}
        </RouterLink>
        <ChevronRightIcon class="w-4 h-4 text-gray-400 mx-2" />
        <span class="breadcrumb-current text-gray-900">
          {{ currentMemory?.title || $t('memories.detail.title') }}
        </span>
      </nav>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p class="mt-4 text-gray-600">{{ $t('common.loading') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-content bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="error-icon text-4xl mb-4">❌</div>
          <h2 class="text-xl font-semibold text-red-800 mb-2">{{ $t('common.error.title') }}</h2>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <div class="error-actions space-x-3">
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
      <div v-else-if="!currentMemory" class="not-found-container">
        <div class="not-found-content bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div class="not-found-icon text-4xl mb-4">🔍</div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ $t('memories.detail.not_found') }}</h2>
          <p class="text-gray-600 mb-4">{{ $t('memories.detail.not_found_message') }}</p>
          <Button @click="$router.push('/memories')" variant="primary">
            {{ $t('memories.detail.back_to_list') }}
          </Button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="content">
        <!-- Page Header -->
        <div class="page-header flex justify-between items-start mb-6">
          <div class="header-content flex items-center space-x-4">
            <Button
              @click="$router.go(-1)"
              variant="ghost"
              size="sm"
              class="back-button"
            >
              <ArrowLeftIcon class="w-4 h-4 mr-2" />
              {{ $t('common.actions.back') }}
            </Button>
            
            <div class="header-badges flex space-x-2">
              <Badge
                :label="formatDate(currentMemory.date)"
                variant="secondary"
              />
              <Badge
                v-if="currentMemory.location"
                :label="currentMemory.location"
                variant="info"
              />
              <Badge
                v-if="currentMemory.isFavorite"
                :label="$t('memories.favorite')"
                variant="warning"
              />
            </div>
          </div>

          <div class="header-actions">
            <CrudActions
              :can-edit="canEdit"
              :can-delete="canDelete"
              :can-share="canShare"
              :can-favorite="true"
              :is-favorite="currentMemory.isFavorite"
              :is-loading="isUpdating"
              @edit="handleEdit"
              @delete="handleDelete"
              @share="handleShare"
              @favorite="handleToggleFavorite"
            />
          </div>
        </div>

        <!-- Memory Detail -->
        <div class="memory-detail-content">
          <!-- Main Content -->
          <div class="main-content bg-white rounded-lg shadow-sm border p-6 mb-6">
            <!-- Title -->
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              {{ currentMemory.title }}
            </h1>

            <!-- Metadata -->
            <div class="metadata flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              <div class="flex items-center">
                <CalendarIcon class="w-4 h-4 mr-1" />
                {{ formatDate(currentMemory.date) }}
              </div>
              <div v-if="currentMemory.location" class="flex items-center">
                <MapPinIcon class="w-4 h-4 mr-1" />
                {{ currentMemory.location }}
              </div>
              <div class="flex items-center">
                <UserIcon class="w-4 h-4 mr-1" />
                {{ currentMemory.createdBy || 'Unknown' }}
              </div>
              <div class="flex items-center">
                <ClockIcon class="w-4 h-4 mr-1" />
                {{ $t('memories.created_at') }}: {{ formatDateTime(currentMemory.createdAt) }}
              </div>
            </div>

            <!-- Images -->
            <div v-if="currentMemory.images && currentMemory.images.length > 0" class="images-section mb-6">
              <div v-if="currentMemory.images.length === 1" class="single-image">
                <img
                  :src="currentMemory.images[0]"
                  :alt="currentMemory.title"
                  class="w-full h-96 object-cover rounded-lg shadow-sm cursor-pointer"
                  @click="openImageViewer(0)"
                />
              </div>
              <div v-else class="image-grid grid grid-cols-2 md:grid-cols-3 gap-4">
                <img
                  v-for="(imageUrl, index) in currentMemory.images"
                  :key="index"
                  :src="imageUrl"
                  :alt="`${currentMemory.title} - Image ${index + 1}`"
                  class="w-full h-48 object-cover rounded-lg shadow-sm cursor-pointer"
                  @click="openImageViewer(index)"
                />
              </div>
            </div>

            <!-- Content -->
            <div class="content-section">
              <div v-if="currentMemory.content" class="prose max-w-none">
                <div v-html="currentMemory.content"></div>
              </div>
              <div v-else class="text-gray-500 italic">
                {{ $t('memories.no_content') }}
              </div>
            </div>

            <!-- Tags -->
            <div v-if="currentMemory.tags && currentMemory.tags.length > 0" class="tags-section mt-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">{{ $t('memories.tags') }}</h3>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="tag in currentMemory.tags"
                  :key="tag"
                  :label="tag"
                  variant="secondary"
                  size="sm"
                />
              </div>
            </div>
          </div>

          <!-- Related Memories -->
          <div v-if="relatedMemories.length > 0" class="related-section">
            <h3 class="text-lg font-semibold mb-4">{{ $t('memories.detail.related_memories') }}</h3>
            <div class="related-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MemoryCard
                v-for="relatedMemory in relatedMemories"
                :key="relatedMemory.id"
                :memory="relatedMemory"
                @edit="handleEditRelated"
                @delete="handleDeleteRelated"
                @toggle-favorite="handleToggleFavoriteRelated"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Image Viewer Modal -->
      <Modal v-model="showImageViewer" :title="currentMemory?.title || ''" size="lg" :close-on-backdrop="true">
        <div v-if="currentMemory?.images" class="image-viewer">
          <div class="relative">
            <img
              :src="currentMemory.images[currentImageIndex]"
              :alt="`${currentMemory.title} - Image ${currentImageIndex + 1}`"
              class="w-full h-auto max-h-[70vh] object-contain"
            />
            
            <!-- Navigation buttons -->
            <div v-if="currentMemory.images.length > 1" class="absolute inset-y-0 left-0 flex items-center">
              <Button
                @click="previousImage"
                variant="ghost"
                size="sm"
                class="ml-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              >
                <ChevronLeftIcon class="w-5 h-5" />
              </Button>
            </div>
            <div v-if="currentMemory.images.length > 1" class="absolute inset-y-0 right-0 flex items-center">
              <Button
                @click="nextImage"
                variant="ghost"
                size="sm"
                class="mr-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              >
                <ChevronRightIcon class="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <!-- Image counter -->
          <div v-if="currentMemory.images.length > 1" class="text-center mt-4 text-sm text-gray-600">
            {{ currentImageIndex + 1 }} / {{ currentMemory.images.length }}
          </div>
        </div>
      </Modal>

      <!-- Share Modal -->
      <Modal v-model="showShareModal" :title="$t('memories.share.title')">
        <div class="share-content">
          <p class="mb-4">{{ $t('memories.share.description') }}</p>
          
          <div class="share-options flex space-x-3 mb-4">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('common.share.share_text_label') }}
            </label>
            <textarea
              v-model="shareText"
              readonly
              class="w-full p-3 border border-gray-300 rounded-md"
              rows="4"
              @click="($event.target as HTMLTextAreaElement).select()"
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
import { useMemories } from '@/composables/useMemories'
import { useCouple } from '@/composables/useCouple'
import { useNotifications } from '@/composables/useNotifications'
import { formatDate, formatDateTime } from '@/utils/helpers'
import type { Memory } from '@/types'

import AppLayout from '@/components/layout/AppLayout.vue'
import MemoryCard from '@/components/memories/MemoryCard.vue'
import CrudActions from '@/components/common/CrudActions.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import Modal from '@/components/common/Modal.vue'

// Icons
import { 
  ChevronRightIcon, 
  ArrowLeftIcon,
  ChevronLeftIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import LinkIcon from '@/components/icons/LinkIcon.vue'
import ShareIcon from '@/components/icons/ShareIcon.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { isConnected } = useCouple()
const { showSuccess, showError } = useNotifications()

const {
  memories,
  selectedMemory,
  isLoading,
  error,
  fetchMemory,
  updateMemory,
  deleteMemory,
  clearError
} = useMemories()

// State
const isUpdating = ref(false)
const showShareModal = ref(false)
const showImageViewer = ref(false)
const currentImageIndex = ref(0)
const shareText = ref('')

// Computed
const memoryId = computed(() => route.params.id as string)
const currentMemory = computed(() => selectedMemory)

const canEdit = computed(() => {
  return !!(isConnected.value && currentMemory.value)
})

const canDelete = computed(() => {
  return !!(isConnected.value && currentMemory.value)
})

const canShare = computed(() => {
  return currentMemory.value !== null
})

const relatedMemories = computed(() => {
  if (!currentMemory.value || !memories) return []
  
  return memories
    .filter((m: Memory) => 
      m.id !== currentMemory.value?.id && 
      (m.location === currentMemory.value?.location ||
       m.tags?.some(tag => currentMemory.value?.tags?.includes(tag)) ||
       Math.abs(new Date(m.date).getTime() - new Date(currentMemory.value?.date || '').getTime()) < 30 * 24 * 60 * 60 * 1000) // Within 30 days
    )
    .slice(0, 6)
})

// Methods
const handleRetry = async () => {
  clearError()
  await fetchMemory(memoryId.value)
}

const handleEdit = () => {
  if (!currentMemory.value) return
  router.push(`/memories/${currentMemory.value.id}/edit`)
}

const handleDelete = async () => {
  if (!currentMemory.value) return
  
  try {
    await deleteMemory(currentMemory.value.id)
    showSuccess(t('memories.delete.success'))
    router.push('/memories')
  } catch (error) {
    showError(t('memories.delete.error'))
  }
}

const handleShare = () => {
  if (!currentMemory.value) return
  
  shareText.value = `${currentMemory.value.title}\n${currentMemory.value.content || ''}\n${t('memories.date')}: ${formatDate(currentMemory.value.date)}`
  showShareModal.value = true
}

const handleToggleFavorite = async () => {
  if (!currentMemory.value) return
  
  isUpdating.value = true
  try {
    await updateMemory({
      id: currentMemory.value.id,
      isFavorite: !currentMemory.value.isFavorite
    })
    showSuccess(currentMemory.value.isFavorite 
      ? t('memories.unfavorite.success') 
      : t('memories.favorite.success')
    )
  } catch (error) {
    showError(t('memories.favorite.error'))
  } finally {
    isUpdating.value = false
  }
}

// Related memories handlers
const handleEditRelated = (relatedMemory: Memory) => {
  router.push(`/memories/${relatedMemory.id}/edit`)
}

const handleDeleteRelated = async (memory: Memory) => {
  try {
    await deleteMemory(memory.id)
    showSuccess(t('memories.delete.success'))
  } catch (error) {
    showError(t('memories.delete.error'))
  }
}

const handleToggleFavoriteRelated = async (id: string) => {
  const relatedMemory = memories?.find((m: Memory) => m.id === id)
  if (!relatedMemory) return
  
  try {
    await updateMemory({
      id: relatedMemory.id,
      isFavorite: !relatedMemory.isFavorite
    })
    showSuccess(t('memories.favorite.success'))
  } catch (error) {
    showError(t('memories.favorite.error'))
  }
}

// Image viewer handlers
const openImageViewer = (index: number) => {
  currentImageIndex.value = index
  showImageViewer.value = true
}

const nextImage = () => {
  if (currentMemory.value?.images) {
    currentImageIndex.value = (currentImageIndex.value + 1) % currentMemory.value.images.length
  }
}

const previousImage = () => {
  if (currentMemory.value?.images) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? currentMemory.value.images.length - 1 
      : currentImageIndex.value - 1
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
        title: currentMemory.value?.title,
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
  if (memoryId.value) {
    await fetchMemory(memoryId.value)
  }
})

// Watch for route changes
watch(
  () => route.params.id,
  async (newId) => {
    if (newId && newId !== currentMemory.value?.id) {
      await fetchMemory(newId as string)
    }
  }
)
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  font-weight: 500;
  text-decoration: none;
}

.breadcrumb-current {
  font-weight: 600;
}

.loading-container,
.error-container,
.not-found-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.memory-detail-content {
  max-width: 4xl;
}

.prose {
  line-height: 1.75;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.prose p {
  margin-bottom: 1em;
}

.prose img {
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.image-viewer img {
  max-height: 70vh;
  width: auto;
  height: auto;
}

.share-content textarea {
  resize: none;
  font-family: monospace;
  font-size: 0.875rem;
}

.related-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
  margin-top: 2rem;
}
</style>
