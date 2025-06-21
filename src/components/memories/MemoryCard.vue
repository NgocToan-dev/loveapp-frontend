<template>  <v-card 
    class="memory-card cardLift loveClick slideInUp" 
    :class="{ 'mobile-optimized': mobile }"
    elevation="0"
    @click="handleCardClick"
    ref="cardRef"
  ><!-- Memory Image/Video -->
    <div class="memory-media" v-if="memoryImage || memoryVideo">
      <div class="media-container">
        <img 
          v-if="memoryImage" 
          :src="memoryImage" 
          :alt="memory.title"
          class="memory-image"
          @load="onImageLoad"
        />
        <video 
          v-else-if="memoryVideo"
          :src="memoryVideo"
          class="memory-video"
          muted
          @mouseover="playVideo"
          @mouseleave="pauseVideo"
        />          <!-- Media Overlay -->
        <div class="media-overlay">
          <div class="media-actions">
            <v-btn
              icon
              variant="text"
              size="small"
              class="media-btn loveClick"
              @click.stop="toggleFavorite"
            >
              <v-icon 
                :color="memory.isFavorite ? 'error' : 'white'"
                :class="{ 'heartBeat': memory.isFavorite }"
              >
                {{ memory.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </v-btn>
            
            <!-- Action Menu -->
            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  class="media-btn loveClick"
                  v-bind="menuProps"
                  @click.stop
                >
                  <v-icon color="white">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              
              <v-list>
                <v-list-item @click.stop="handleConvertToAnniversary">
                  <template #prepend>
                    <v-icon icon="mdi-calendar-star" color="primary" />
                  </template>
                  <v-list-item-title>{{ $t('memories.convertToAnniversary') }}</v-list-item-title>
                </v-list-item>
                
                <v-list-item @click.stop="handleEdit">
                  <template #prepend>
                    <v-icon icon="mdi-pencil" />
                  </template>
                  <v-list-item-title>{{ $t('common.edit') }}</v-list-item-title>
                </v-list-item>
                
                <v-list-item @click.stop="handleShare">
                  <template #prepend>
                    <v-icon icon="mdi-share" />
                  </template>
                  <v-list-item-title>{{ $t('common.share') }}</v-list-item-title>
                </v-list-item>
                
                <v-divider />
                
                <v-list-item @click.stop="handleDelete">
                  <template #prepend>
                    <v-icon icon="mdi-delete" color="error" />
                  </template>
                  <v-list-item-title class="text-error">{{ $t('common.delete') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          
          <!-- Date Badge -->
          <div class="date-badge magicalGlow">
            {{ formatDate(memory.date) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Memory Content -->
    <v-card-text class="memory-content">
      <!-- Title and Description -->
      <div class="memory-text">
        <h3 class="memory-title">{{ memory.title }}</h3>
        <p class="memory-description" v-if="memory.description">
          {{ memory.description }}
        </p>
      </div>

      <!-- Tags -->
      <div class="memory-tags" v-if="memory.tags && memory.tags.length">
        <v-chip
          v-for="tag in memory.tags"
          :key="tag"
          size="small"
          variant="outlined"
          color="primary"
          class="memory-tag sparkle"
        >
          {{ tag }}
        </v-chip>
      </div>      <!-- Memory Stats -->
      <div class="memory-stats">
        <div class="stat-item">
          <v-icon size="16" color="primary">mdi-calendar</v-icon>
          <span>{{ formatDate(memory.date) }}</span>
        </div>
        <div class="stat-item" v-if="memory.category">
          <v-icon size="16" color="secondary">mdi-tag</v-icon>
          <span>{{ memory.category }}</span>
        </div>
      </div>
    </v-card-text>

    <!-- Floating Hearts for Favorite -->
    <div class="favorite-feedback" v-if="showFavoriteHearts">
      <div class="heart heart-1 confettiFall">💖</div>
      <div class="heart heart-2 confettiFall">💕</div>
      <div class="heart heart-3 confettiFall">💝</div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Memory } from '@/types'
import { useTouch } from '@/composables/useTouch'
import { useBreakpoints } from '@/composables/useBreakpoints'

interface Props {
  memory: Memory
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'click': [memory: Memory]
  'favorite': [memory: Memory]
  'swipe-left': [memory: Memory]
  'swipe-right': [memory: Memory]
  'convert-to-anniversary': [memory: Memory]
  'edit': [memory: Memory]
  'delete': [memory: Memory]
  'share': [memory: Memory]
}>()

const showFavoriteHearts = ref(false)
const cardRef = ref<HTMLElement>()
const { mobile, isTouchDevice } = useBreakpoints()

// Touch handling
const { setHandlers, bindToElement } = useTouch()

// Setup touch handlers
setHandlers({
  onTap: () => {
    if (isTouchDevice.value) {
      handleCardClick()
    }
  },
  onSwipe: (swipe) => {
    if (swipe.direction === 'left') {
      emit('swipe-left', props.memory)
    } else if (swipe.direction === 'right') {
      emit('swipe-right', props.memory)
    }
  },
  onLongPress: () => {
    // Long press to favorite on mobile
    if (mobile.value) {
      toggleFavorite()
    }
  }
})

// Computed properties for media files
const memoryImage = computed(() => {
  const imageFile = props.memory.files?.find(file => 
    file.type?.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '')
  )
  return imageFile?.url
})

const memoryVideo = computed(() => {
  const videoFile = props.memory.files?.find(file => 
    file.type?.startsWith('video/') || 
    /\.(mp4|webm|ogg|mov)$/i.test(file.name || '')
  )
  return videoFile?.url
})

const handleCardClick = () => {
  emit('click', props.memory)
}

const toggleFavorite = () => {
  // Show hearts animation for favorites
  if (!props.memory.isFavorite) {
    showFavoriteHearts.value = true
    setTimeout(() => {
      showFavoriteHearts.value = false
    }, 2000)
  }
  
  emit('favorite', props.memory)
}

// Action handlers
const handleConvertToAnniversary = () => {
  emit('convert-to-anniversary', props.memory)
}

const handleEdit = () => {
  emit('edit', props.memory)
}

const handleShare = () => {
  emit('share', props.memory)
}

const handleDelete = () => {
  emit('delete', props.memory)
}

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}

const onImageLoad = () => {
  // Add a subtle entrance animation when image loads
}

const playVideo = (event: Event) => {
  const video = event.target as HTMLVideoElement
  video.play()
}

const pauseVideo = (event: Event) => {
  const video = event.target as HTMLVideoElement
  video.pause()
}

// Bind touch events when component mounts
onMounted(() => {
  if (cardRef.value && isTouchDevice.value) {
    bindToElement(cardRef.value)
  }
})
</script>

<style scoped>
.memory-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(10px);
}

.memory-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(var(--primary-rgb), 0.15);
  border-color: var(--primary-color);
}

/* Memory Media */
.memory-media {
  position: relative;
  overflow: hidden;
}

.media-container {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.memory-image,
.memory-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.memory-card:hover .memory-image,
.memory-card:hover .memory-video {
  transform: scale(1.05);
}

/* Media Overlay */
.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.memory-card:hover .media-overlay {
  opacity: 1;
}

.media-actions {
  display: flex;
  gap: 8px;
}

.media-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.media-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.1);
}

.date-badge {
  background: rgba(var(--primary-rgb), 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

/* Memory Content */
.memory-content {
  padding: 20px;
}

.memory-text {
  margin-bottom: 16px;
}

.memory-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.3;
}

.memory-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Memory Tags */
.memory-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.memory-tag {
  height: 24px;
  font-size: 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.memory-tag:hover {
  transform: scale(1.05);
  background: rgba(var(--primary-rgb), 0.1) !important;
}

/* Memory Stats */
.memory-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0.7;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Favorite Feedback */
.favorite-feedback {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.heart {
  position: absolute;
  font-size: 20px;
  opacity: 0.8;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
}

.heart-1 {
  top: 30%;
  left: 30%;
  animation-delay: 0s;
}

.heart-2 {
  top: 40%;
  right: 30%;
  animation-delay: 0.3s;
}

.heart-3 {
  top: 60%;
  left: 50%;
  animation-delay: 0.6s;
}

/* No Image State */
.memory-card:not(:has(.memory-media)) {
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.05) 0%, 
    rgba(var(--secondary-rgb), 0.03) 100%);
}

.memory-card:not(:has(.memory-media)) .memory-content {
  padding: 24px;
}

/* Mobile Optimizations */
.mobile-optimized {
  /* Larger touch targets */
  min-height: 120px;
}

.mobile-optimized .memory-content {
  padding: 16px;
}

.mobile-optimized .memory-title {
  font-size: 1.1rem;
  line-height: 1.4;
}

.mobile-optimized .memory-description {
  font-size: 0.9rem;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.mobile-optimized .media-overlay {
  opacity: 1; /* Always visible on mobile */
}

.mobile-optimized .media-btn {
  width: 48px;
  height: 48px;
  font-size: 20px;
}

.mobile-optimized .memory-stats {
  margin-top: 12px;
}

.mobile-optimized .stat-item {
  font-size: 0.85rem;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .memory-card:hover {
    transform: none; /* Disable hover effects on touch devices */
  }
  
  .memory-card:active {
    transform: scale(0.98); /* Active state for touch feedback */
  }
}

/* Responsive improvements */
@media (max-width: 768px) {
  .memory-content {
    padding: 16px;
  }
  
  .memory-title {
    font-size: 1.125rem;
  }
  
  .memory-description {
    font-size: 0.9rem;
  }
  
  .media-overlay {
    padding: 12px;
  }
  
  .memory-stats {
    gap: 12px;
  }
  
  .stat-item {
    font-size: 0.8rem;
  }
}
</style>
