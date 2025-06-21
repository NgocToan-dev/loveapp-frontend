<template>
  <div class="memory-list">
    <!-- List Header -->
    <div class="list-header mb-6">
      <div class="d-flex justify-space-between align-center">
        <div>
          <h2 class="font-heading text-h4 mb-2">
            <v-icon start color="primary" size="28">mdi-camera-burst</v-icon>
            {{ $t('memories.title') }}
          </h2>
          <p class="text-body-1 text-medium-emphasis">
            {{ $t('memories.subtitle') }}
          </p>
        </div>
        
        <!-- Quick Actions -->
        <div class="quick-actions">
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            prepend-icon="mdi-plus"
            @click="$emit('createMemory')"
          >
            {{ $t('memories.create') }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- View Mode Toggle -->
    <div class="view-controls mb-6">
      <v-btn-toggle
        v-model="viewMode"
        color="primary"
        density="comfortable"
        rounded="xl"
        mandatory
      >
        <v-btn value="list" prepend-icon="mdi-view-list">
          {{ $t('memories.gallery.viewModes.list') }}
        </v-btn>
        <v-btn value="grid" prepend-icon="mdi-view-grid">
          {{ $t('memories.gallery.viewModes.grid') }}
        </v-btn>
        <v-btn value="masonry" prepend-icon="mdi-view-masonry">
          {{ $t('memories.gallery.viewModes.masonry') }}
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- Memory Content -->
    <div class="memory-content">
      <!-- List View (Default) -->
      <div v-if="viewMode === 'list'" class="memory-list-view">
        <v-card
          v-for="memory in memories"
          :key="memory.id"
          class="memory-list-item mb-4"
          :elevation="2"
          @click="openMemory(memory)"
        >
          <div class="d-flex">
            <!-- Memory Image -->
            <div class="memory-image-container">
              <v-img
                v-if="getMemoryImage(memory)"
                :src="getMemoryImage(memory)"
                :alt="memory.title"
                class="memory-image"
                height="120"
                width="160"
                cover
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate color="primary" />
                  </div>
                </template>
              </v-img>
              <div v-else class="memory-placeholder">
                <v-icon icon="mdi-camera" size="32" color="grey" />
              </div>
            </div>

            <!-- Memory Details -->
            <div class="memory-details flex-grow-1 pa-4">
              <div class="d-flex justify-space-between align-start mb-2">
                <h3 class="text-h6 font-weight-bold">{{ memory.title }}</h3>
                <div class="memory-actions">
                  <v-btn
                    icon="mdi-heart"
                    :color="memory.isFavorite ? 'red' : 'grey'"
                    variant="text"
                    size="small"
                    @click.stop="toggleFavorite(memory)"
                  />
                  <v-menu>
                    <template #activator="{ props }">
                      <v-btn
                        icon="mdi-dots-vertical"
                        variant="text"
                        size="small"
                        v-bind="props"
                        @click.stop
                      />
                    </template>
                    <v-list>
                      <v-list-item @click="editMemory(memory)">
                        <template #prepend>
                          <v-icon icon="mdi-pencil" />
                        </template>
                        <v-list-item-title>{{ $t('common.edit') }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="shareMemory(memory)">
                        <template #prepend>
                          <v-icon icon="mdi-share" />
                        </template>
                        <v-list-item-title>{{ $t('common.share') }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteMemory(memory)">
                        <template #prepend>
                          <v-icon icon="mdi-delete" color="error" />
                        </template>
                        <v-list-item-title class="text-error">{{ $t('common.delete') }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>

              <p class="text-body-2 text-medium-emphasis mb-3 line-clamp-2">
                {{ memory.description }}
              </p>

              <div class="memory-meta d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-4">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-calendar" size="16" class="me-1" />
                    <span class="text-caption">{{ formatDate(memory.date) }}</span>
                  </div>
                  <div v-if="memory.location" class="d-flex align-center">
                    <v-icon icon="mdi-map-marker" size="16" class="me-1" />
                    <span class="text-caption">{{ memory.location }}</span>
                  </div>
                </div>
                
                <div class="memory-stats d-flex align-center gap-2">
                  <div v-if="memory.files?.length" class="d-flex align-center">
                    <v-icon icon="mdi-image" size="16" class="me-1" />
                    <span class="text-caption">{{ memory.files.length }}</span>
                  </div>
                  <v-chip
                    v-if="memory.category"
                    :color="getCategoryColor(memory.category)"
                    size="x-small"
                    variant="tonal"
                  >
                    {{ getCategoryName(memory.category) }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="memory-grid-view">
        <div class="memory-grid">
          <MemoryCard
            v-for="memory in memories"
            :key="memory.id"
            :memory="memory"
            :compact="true"
            :image-height="200"
            @click="openMemory"
            @toggle-favorite="toggleFavorite"
            @open-comments="openComments"
            @share-memory="shareMemory"
            @edit-memory="editMemory"
            @delete-memory="deleteMemory"
          />
        </div>
      </div>

      <!-- Masonry View -->
      <div v-else-if="viewMode === 'masonry'" class="memory-masonry-view">
        <div class="memory-masonry">
          <div
            v-for="(column, columnIndex) in masonryColumns"
            :key="columnIndex"
            class="masonry-column"
          >
            <MemoryCard
              v-for="memory in column"
              :key="memory.id"
              :memory="memory"
              :image-height="getRandomHeight()"
              class="mb-4"
              @click="openMemory"
              @toggle-favorite="toggleFavorite"
              @open-comments="openComments"
              @share-memory="shareMemory"
              @edit-memory="editMemory"
              @delete-memory="deleteMemory"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="memories.length === 0" class="empty-state">
        <div class="text-center py-12">
          <v-icon
            icon="mdi-camera-off"
            size="64"
            color="grey-lighten-2"
            class="mb-4"
          />
          <h4 class="text-h6 mb-2">{{ $t('memories.noMemories') }}</h4>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ $t('memories.noMemoriesDescription') }}
          </p>
          <v-btn
            color="primary"
            variant="elevated"
            @click="$emit('createMemory')"
          >
            {{ $t('memories.createFirst') }}
          </v-btn>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore && memories.length > 0" class="load-more text-center mt-8">
        <v-btn
          color="primary"
          variant="outlined"
          size="large"
          :loading="loading"
          @click="$emit('loadMore')"
        >
          {{ $t('memories.gallery.loadMore') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MemoryCard from './MemoryCard.vue'
import type { Memory } from '@/types'

interface Props {
  memories: Memory[]
  loading?: boolean
  hasMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  memories: () => [],
  loading: false,
  hasMore: false
})

const emit = defineEmits<{
  openMemory: [memory: Memory]
  toggleFavorite: [memory: Memory]
  openComments: [memory: Memory]
  shareMemory: [memory: Memory]
  editMemory: [memory: Memory]
  deleteMemory: [memory: Memory]
  createMemory: []
  loadMore: []
}>()

const { t } = useI18n()

// View state
const viewMode = ref<'list' | 'grid' | 'masonry'>('list')

// Masonry columns for masonry view
const masonryColumns = computed(() => {
  const columnCount = 3
  const columns: Memory[][] = Array.from({ length: columnCount }, () => [])
  
  props.memories.forEach((memory, index) => {
    const columnIndex = index % columnCount
    columns[columnIndex].push(memory)
  })
  
  return columns
})

// Utility functions
const getMemoryImage = (memory: Memory) => {
  const imageFile = memory.files?.find(file => 
    file.type?.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '')
  )
  return imageFile?.url || imageFile?.name
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getCategoryColor = (category: string) => {
  const colors = {
    'first-meet': 'pink',
    'date': 'purple',
    'travel': 'indigo',
    'milestone': 'success',
    'celebration': 'orange',
    'general': 'primary'
  }
  return colors[category as keyof typeof colors] || 'primary'
}

const getCategoryName = (category: string) => {
  return t(`memories.gallery.types.${category}`)
}

const getRandomHeight = () => {
  const heights = [180, 220, 260, 300, 200, 240]
  return heights[Math.floor(Math.random() * heights.length)]
}

// Event handlers
const openMemory = (memory: Memory) => {
  emit('openMemory', memory)
}

const toggleFavorite = (memory: Memory) => {
  emit('toggleFavorite', memory)
}

const openComments = (memory: Memory) => {
  emit('openComments', memory)
}

const shareMemory = (memory: Memory) => {
  emit('shareMemory', memory)
}

const editMemory = (memory: Memory) => {
  emit('editMemory', memory)
}

const deleteMemory = (memory: Memory) => {
  emit('deleteMemory', memory)
}
</script>

<style scoped>
.memory-list {
  padding: 0;
}

.list-header {
  margin-bottom: 32px;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.view-controls {
  display: flex;
  justify-content: center;
}

/* List View Styles */
.memory-list-item {
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.memory-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.memory-image-container {
  flex: 0 0 160px;
}

.memory-image {
  border-radius: 16px 0 0 16px;
}

.memory-placeholder {
  height: 120px;
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 16px 0 0 16px;
}

.memory-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.memory-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.memory-meta {
  margin-top: auto;
}

.memory-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Grid View Styles */
.memory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Masonry View Styles */
.memory-masonry {
  display: flex;
  gap: 24px;
}

.masonry-column {
  flex: 1;
}

/* Empty State */
.empty-state {
  background: rgba(var(--v-theme-surface), 0.3);
  border-radius: 20px;
  border: 2px dashed rgba(var(--v-theme-outline), 0.3);
}

/* Text utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 768px) {
  .list-header .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .quick-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .quick-actions .v-btn {
    flex: 1;
  }
  
  .memory-list-item .d-flex {
    flex-direction: column;
  }
  
  .memory-image-container {
    flex: none;
  }
  
  .memory-image {
    border-radius: 16px 16px 0 0;
    height: 200px;
    width: 100%;
  }
  
  .memory-placeholder {
    border-radius: 16px 16px 0 0;
    height: 200px;
    width: 100%;
  }
  
  .memory-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .memory-masonry {
    flex-direction: column;
  }
}

/* Dark theme adjustments */
.v-theme--dark .memory-list-item:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .empty-state {
  background: rgba(var(--v-theme-surface), 0.5);
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

/* Animation */
.memory-list-item {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
