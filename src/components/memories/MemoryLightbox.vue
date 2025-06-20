<template>
  <v-dialog
    v-model="isOpen"
    fullscreen
    transition="dialog-bottom-transition"
    class="memory-lightbox"
  >
    <v-card color="black" class="lightbox-container">
      <!-- Lightbox Header -->
      <v-app-bar
        color="rgba(0,0,0,0.8)"
        class="lightbox-header"
        density="compact"
        flat
      >
        <v-app-bar-title class="text-white">
          <div class="d-flex align-center">
            <v-avatar size="32" class="me-3">
              <v-img :src="getMemoryAvatar()"></v-img>
            </v-avatar>
            <div>
              <div class="text-body-1 font-weight-bold">{{ memory?.title }}</div>
              <div class="text-caption text-grey-lighten-1">
                {{ memory ? formatDate(memory.date) : '' }}
              </div>
            </div>
          </div>
        </v-app-bar-title>

        <template #append>
          <!-- Lightbox Actions -->
          <div class="lightbox-actions d-flex align-center">
            <v-btn
              icon
              color="white"
              @click="toggleFavorite"
              class="me-2"
            >
              <v-icon>
                {{ memory?.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </v-btn>

            <v-btn
              icon
              color="white"
              @click="shareMemory"
              class="me-2"
            >
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>

            <v-btn
              icon
              color="white"
              @click="downloadImage"
              class="me-2"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>

            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  icon
                  color="white"
                  v-bind="props"
                  class="me-2"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              
              <v-list>
                <v-list-item @click="editMemory">
                  <v-list-item-title>
                    <v-icon start>mdi-pencil</v-icon>
                    Chỉnh sửa
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteMemory">
                  <v-list-item-title>
                    <v-icon start>mdi-delete</v-icon>
                    Xóa
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn
              icon
              color="white"
              @click="close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </template>
      </v-app-bar>

      <!-- Lightbox Content -->
      <div class="lightbox-content">
        <div class="lightbox-main">
          <!-- Navigation Arrows -->
          <v-btn
            v-if="hasPrevious"
            icon
            color="white"
            size="large"
            class="lightbox-nav lightbox-nav--prev"
            @click="previousImage"
          >
            <v-icon size="32">mdi-chevron-left</v-icon>
          </v-btn>

          <v-btn
            v-if="hasNext"
            icon
            color="white"
            size="large"
            class="lightbox-nav lightbox-nav--next"
            @click="nextImage"
          >
            <v-icon size="32">mdi-chevron-right</v-icon>
          </v-btn>

          <!-- Main Image -->
          <div class="lightbox-image-container" @click="toggleZoom">
            <v-img              v-if="getMemoryImage(memory)"
              :src="getMemoryImage(memory) || ''"
              :class="{ 'zoomed': isZoomed }"
              class="lightbox-image"
              contain
              @load="onImageLoad"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    color="white"
                    indeterminate
                    size="48"
                  ></v-progress-circular>
                </div>
              </template>
            </v-img>

            <!-- Zoom Indicator -->
            <div v-if="!isZoomed" class="zoom-indicator">
              <v-icon color="white" size="24">mdi-magnify-plus</v-icon>
            </div>
          </div>

          <!-- Image Counter -->
          <div class="lightbox-counter">
            <v-chip color="rgba(0,0,0,0.7)" text-color="white" size="small">
              {{ currentIndex + 1 }} / {{ totalImages }}
            </v-chip>
          </div>
        </div>

        <!-- Lightbox Sidebar -->
        <div v-if="showSidebar" class="lightbox-sidebar">
          <v-card color="rgba(0,0,0,0.8)" class="fill-height" flat>
            <v-card-text class="pa-6 text-white">
              <!-- Memory Info -->
              <div class="memory-info mb-6">
                <h3 class="text-h5 font-weight-bold mb-3">{{ memory?.title }}</h3>
                
                <div class="d-flex align-center mb-2">
                  <v-icon color="grey-lighten-1" size="16" class="me-2">
                    mdi-calendar
                  </v-icon>
                  <span class="text-body-2 text-grey-lighten-1">
                    {{ memory ? formatDate(memory.date) : '' }}
                  </span>
                </div>

                <div v-if="memory?.location" class="d-flex align-center mb-3">
                  <v-icon color="grey-lighten-1" size="16" class="me-2">
                    mdi-map-marker
                  </v-icon>
                  <span class="text-body-2 text-grey-lighten-1">
                    {{ memory.location }}
                  </span>
                </div>

                <p v-if="memory?.description" class="text-body-2 text-grey-lighten-2 mb-4">
                  {{ memory.description }}
                </p>

                <!-- Tags -->
                <div v-if="memory?.tags && memory.tags.length > 0" class="memory-tags mb-4">
                  <v-chip
                    v-for="tag in memory.tags"
                    :key="tag"
                    size="small"
                    color="primary"
                    variant="tonal"
                    class="me-1 mb-1"
                  >
                    {{ tag }}
                  </v-chip>
                </div>

                <!-- Stats -->
                <div class="memory-stats d-flex align-center mb-4">                  <div class="d-flex align-center me-4">
                    <v-icon color="pink" size="16" class="me-1">mdi-heart</v-icon>
                    <span class="text-caption">0</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon color="blue" size="16" class="me-1">mdi-comment</v-icon>
                    <span class="text-caption">0</span>
                  </div>
                </div>
              </div>

              <!-- Comments Section -->
              <div class="memory-comments">
                <h4 class="text-h6 font-weight-bold mb-3">
                  Bình luận ({{ comments.length }})
                </h4>

                <!-- Comment List -->
                <div class="comment-list mb-4" style="max-height: 300px; overflow-y: auto;">
                  <div
                    v-for="comment in comments"
                    :key="comment.id"
                    class="comment-item mb-3"
                  >
                    <div class="d-flex">
                      <v-avatar size="32" class="me-3">
                        <v-img :src="comment.userAvatar || '/default-avatar.png'"></v-img>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="comment-header mb-1">
                          <span class="text-body-2 font-weight-bold text-white">
                            {{ comment.userName }}
                          </span>
                          <span class="text-caption text-grey-lighten-2 ms-2">
                            {{ formatDate(comment.createdAt) }}
                          </span>
                        </div>
                        <p class="text-body-2 text-grey-lighten-1 mb-0">
                          {{ comment.text }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add Comment -->
                <div class="add-comment">
                  <v-textarea
                    v-model="newComment"
                    label="Thêm bình luận..."
                    density="compact"
                    variant="outlined"
                    rows="2"
                    bg-color="rgba(255,255,255,0.1)"
                    color="white"
                    hide-details
                    @keydown.ctrl.enter="addComment"
                  ></v-textarea>
                  <div class="d-flex justify-end mt-2">
                    <v-btn
                      color="primary"
                      size="small"
                      :disabled="!newComment.trim()"
                      @click="addComment"
                    >
                      Gửi
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>

      <!-- Thumbnail Strip -->
      <div v-if="thumbnails.length > 1" class="lightbox-thumbnails">
        <div class="thumbnail-strip">
          <div
            v-for="(thumbnail, index) in thumbnails"
            :key="thumbnail.id"
            class="thumbnail-item"
            :class="{ 'active': index === currentIndex }"
            @click="goToImage(index)"
          >            <v-img
              :src="getMemoryImage(thumbnail) || ''"
              width="60"
              height="60"
              cover
              class="thumbnail-image"
            ></v-img>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

import type { Memory } from '@/types'

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  text: string
  createdAt: Date | string
}

interface Props {
  modelValue: boolean
  memory: Memory | null
  memories?: Memory[]
  currentIndex?: number
  showSidebar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  memory: null,
  memories: () => [],
  currentIndex: 0,
  showSidebar: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:currentIndex': [index: number]
  toggleFavorite: [memory: Memory]
  shareMemory: [memory: Memory]
  editMemory: [memory: Memory]
  deleteMemory: [memory: Memory]
  addComment: [memoryId: string, comment: string]
}>()

// State
const isZoomed = ref(false)
const newComment = ref('')
const comments = ref<Comment[]>([
  {
    id: '1',
    userId: 'user1',
    userName: 'Bảo',
    userAvatar: '',
    text: 'Kỷ niệm đẹp quá! 💕',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'My',
    userAvatar: '',
    text: 'Hình này đẹp lắm anh ơi 😍',
    createdAt: new Date('2024-01-16')
  }
])

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const currentImageIndex = computed({
  get: () => props.currentIndex,
  set: (value) => emit('update:currentIndex', value)
})

// Helper functions for memory data
const getMemoryImage = (memory: Memory | null) => {
  if (!memory?.files) return null
  const imageFile = memory.files.find(file => 
    file.type?.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '')
  )
  return imageFile?.url
}

const getMemoryAvatar = () => {
  // Default avatar since ownerAvatar doesn't exist in Memory type
  return '/default-avatar.png'
}

const thumbnails = computed(() => {
  return props.memories.filter(memory => getMemoryImage(memory))
})

const totalImages = computed(() => thumbnails.value.length)

const hasPrevious = computed(() => currentImageIndex.value > 0)

const hasNext = computed(() => currentImageIndex.value < totalImages.value - 1)

// Methods
const close = () => {
  isOpen.value = false
  isZoomed.value = false
}

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
}

const previousImage = () => {
  if (hasPrevious.value) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (hasNext.value) {
    currentImageIndex.value++
  }
}

const goToImage = (index: number) => {
  currentImageIndex.value = index
}

const toggleFavorite = () => {
  if (props.memory) {
    emit('toggleFavorite', props.memory)
  }
}

const shareMemory = () => {
  if (props.memory) {
    emit('shareMemory', props.memory)
  }
}

const editMemory = () => {
  if (props.memory) {
    emit('editMemory', props.memory)
  }
}

const deleteMemory = () => {
  if (props.memory) {
    emit('deleteMemory', props.memory)
  }
}

const downloadImage = () => {
  const imageUrl = getMemoryImage(props.memory)
  if (imageUrl) {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${props.memory?.title || 'memory'}.jpg`
    link.click()
  }
}

const addComment = () => {
  if (newComment.value.trim() && props.memory) {
    emit('addComment', props.memory.id, newComment.value.trim())
    newComment.value = ''
  }
}

const formatDate = (date: Date | string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const onImageLoad = () => {
  // Image loaded successfully
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return
  
  switch (event.key) {
    case 'Escape':
      close()
      break
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
    case ' ':
      event.preventDefault()
      toggleZoom()
      break
  }
}

// Watch for keyboard events
watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.memory-lightbox {
  z-index: 2000;
}

.lightbox-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.lightbox-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.lightbox-content {
  display: flex;
  height: 100vh;
  padding-top: 64px;
  padding-bottom: 80px;
}

.lightbox-main {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
}

.lightbox-sidebar {
  width: 400px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.lightbox-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: zoom-in;
}

.lightbox-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.lightbox-image.zoomed {
  transform: scale(2);
  cursor: zoom-out;
}

.zoom-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.lightbox-image-container:hover .zoom-indicator {
  opacity: 1;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(10px);
  z-index: 5;
}

.lightbox-nav--prev {
  left: 20px;
}

.lightbox-nav--next {
  right: 20px;
}

.lightbox-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.lightbox-thumbnails {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.thumbnail-strip {
  display: flex;
  gap: 8px;
  padding: 0 20px;
  overflow-x: auto;
  scrollbar-width: none;
}

.thumbnail-strip::-webkit-scrollbar {
  display: none;
}

.thumbnail-item {
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail-item:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.thumbnail-item.active {
  border-color: rgb(var(--v-theme-primary));
}

.thumbnail-image {
  border-radius: 6px;
}

.comment-list::-webkit-scrollbar {
  width: 4px;
}

.comment-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.comment-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.comment-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.comment-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-item:last-child {
  border-bottom: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .lightbox-sidebar {
    display: none;
  }
  
  .lightbox-nav {
    display: none;
  }
  
  .lightbox-thumbnails {
    padding: 8px 0;
  }
  
  .thumbnail-strip {
    padding: 0 12px;
  }
  
  .thumbnail-item {
    width: 50px;
    height: 50px;
  }
}

/* Animation */
.lightbox-container {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
