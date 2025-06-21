<template>
  <div class="memory-gallery">
    <!-- Gallery Header -->
    <div class="gallery-header">
      <div class="d-flex justify-space-between align-center mb-4">        <div>
          <h3 class="font-heading text-h5 mb-1">
            <v-icon start color="primary" size="24">mdi-view-gallery</v-icon>
            {{ $t('memories.gallery.title') }}
          </h3>
          <p class="text-body-2 text-medium-emphasis">
            {{ $t('memories.gallery.stats', { count: memories.length, photos: totalPhotos }) }}
          </p>
        </div>
        
        <!-- View Mode Toggle -->
        <div class="gallery-controls">
          <v-btn-toggle
            v-model="viewMode"
            color="primary"
            density="compact"
            rounded="xl"
            mandatory
          >
            <v-btn value="grid" size="small">
              <v-icon>mdi-view-grid</v-icon>
            </v-btn>
            <v-btn value="masonry" size="small">
              <v-icon>mdi-view-masonry</v-icon>
            </v-btn>
            <v-btn value="list" size="small">
              <v-icon>mdi-view-list</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>

      <!-- Filters -->
      <div class="gallery-filters mb-6">
        <v-row>
          <v-col cols="12" md="4">            <v-select
              v-model="selectedType"
              :items="memoryTypes"
              :label="$t('memories.gallery.filters.type')"
              density="compact"
              variant="outlined"
              hide-details
              clearable
            >
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-icon :color="item.raw.color" size="20">
                      {{ item.raw.icon }}
                    </v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-col>
          
          <v-col cols="12" md="4">            <v-select
              v-model="selectedYear"
              :items="yearOptions"
              :label="$t('memories.gallery.filters.year')"
              density="compact"
              variant="outlined"
              hide-details
              clearable
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="4">            <v-text-field
              v-model="searchText"
              :label="$t('memories.gallery.filters.search')"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Gallery Content -->
    <div class="gallery-content">
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="gallery-grid">
        <MemoryCard
          v-for="memory in filteredMemories"
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

      <!-- Masonry View -->
      <div v-else-if="viewMode === 'masonry'" class="gallery-masonry">
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

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="gallery-list">
        <MemoryCard
          v-for="memory in filteredMemories"
          :key="memory.id"
          :memory="memory"
          :image-height="120"
          :description-length="200"
          class="mb-4"
          @click="openMemory"
          @toggle-favorite="toggleFavorite"
          @open-comments="openComments"
          @share-memory="shareMemory"
          @edit-memory="editMemory"
          @delete-memory="deleteMemory"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredMemories.length === 0" class="gallery-empty">
        <div class="text-center py-12">
          <v-icon
            icon="mdi-camera-off"
            size="64"
            color="grey-lighten-2"
            class="mb-4"
          ></v-icon>          <h4 class="text-h6 mb-2">{{ $t('memories.gallery.empty.title') }}</h4>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ $t('memories.gallery.empty.description') }}
          </p>
          <v-btn
            color="primary"
            variant="outlined"
            @click="$emit('createMemory')"
          >
            {{ $t('memories.gallery.empty.action') }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore && filteredMemories.length > 0" class="gallery-load-more text-center mt-8">        <v-btn
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
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
const viewMode = ref<'grid' | 'masonry' | 'list'>('grid')
const selectedType = ref<string | null>(null)
const selectedYear = ref<number | null>(null)
const searchText = ref('')

// Memory categories for filter
const memoryTypes = computed(() => [
  { title: t('memories.gallery.types.first-meet'), value: 'first-meet', icon: 'mdi-heart-flash', color: 'pink' },
  { title: t('memories.gallery.types.date'), value: 'date', icon: 'mdi-heart', color: 'purple' },
  { title: t('memories.gallery.types.travel'), value: 'travel', icon: 'mdi-airplane-takeoff', color: 'indigo' },
  { title: t('memories.gallery.types.milestone'), value: 'milestone', icon: 'mdi-trophy', color: 'success' },
  { title: t('memories.gallery.types.celebration'), value: 'celebration', icon: 'mdi-party-popper', color: 'orange' },
  { title: t('memories.gallery.types.general'), value: 'general', icon: 'mdi-camera', color: 'primary' }
])

// Year options for filter
const yearOptions = computed(() => {
  const years = new Set<number>()
  props.memories.forEach(memory => {
    const year = new Date(memory.date).getFullYear()
    years.add(year)
  })
  return Array.from(years)
    .sort((a, b) => b - a)
    .map(year => ({ title: year.toString(), value: year }))
})

// Total photos count
const totalPhotos = computed(() => {
  return props.memories.filter(memory => 
    memory.files?.some(file => 
      file.type?.startsWith('image/') || 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '')
    )
  ).length
})

// Filtered memories
const filteredMemories = computed(() => {
  let filtered = [...props.memories]

  // Filter by category instead of type
  if (selectedType.value) {
    filtered = filtered.filter(memory => memory.category === selectedType.value)
  }

  // Filter by year
  if (selectedYear.value) {
    filtered = filtered.filter(memory => {
      const year = new Date(memory.date).getFullYear()
      return year === selectedYear.value
    })
  }

  // Filter by search text
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    filtered = filtered.filter(memory => 
      memory.title.toLowerCase().includes(search) ||
      memory.description?.toLowerCase().includes(search) ||
      memory.tags?.some(tag => tag.toLowerCase().includes(search))
    )
  }

  // Sort by date (newest first)
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Masonry columns
const masonryColumns = computed(() => {
  const columnCount = 3
  const columns: Memory[][] = Array.from({ length: columnCount }, () => [])
  
  filteredMemories.value.forEach((memory, index) => {
    const columnIndex = index % columnCount
    columns[columnIndex].push(memory)
  })
  
  return columns
})

// Generate random height for masonry
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

// Watch view mode changes to adjust layout
watch(viewMode, (newMode) => {
  // Could add specific logic for view mode changes
  console.log('View mode changed to:', newMode)
})
</script>

<style scoped>
.memory-gallery {
  padding: 24px 0;
}

.gallery-header {
  margin-bottom: 32px;
}

.gallery-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gallery-filters {
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
}

/* Grid View */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Masonry View */
.gallery-masonry {
  display: flex;
  gap: 24px;
}

.masonry-column {
  flex: 1;
}

/* List View */
.gallery-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gallery-list .memory-card {
  display: flex;
  flex-direction: row;
  height: auto;
}

.gallery-list .memory-card :deep(.memory-image-container) {
  flex: 0 0 200px;
  height: auto !important;
}

.gallery-list .memory-card :deep(.memory-content) {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Empty State */
.gallery-empty {
  background: rgba(var(--v-theme-surface), 0.3);
  border-radius: 20px;
  border: 2px dashed rgba(var(--v-theme-outline), 0.3);
}

/* Load More */
.gallery-load-more {
  padding: 24px 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .gallery-masonry {
    flex-direction: column;
  }
  
  .gallery-list .memory-card {
    flex-direction: column;
  }
  
  .gallery-list .memory-card :deep(.memory-image-container) {
    flex: none;
  }
  
  .gallery-filters {
    padding: 16px;
  }
  
  .gallery-header .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .gallery-controls {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* Animation */
.gallery-grid .memory-card,
.gallery-masonry .memory-card,
.gallery-list .memory-card {
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

/* Dark theme adjustments */
.v-theme--dark .gallery-filters {
  background: rgba(var(--v-theme-surface), 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .gallery-empty {
  background: rgba(var(--v-theme-surface), 0.5);
  border: 2px dashed rgba(255, 255, 255, 0.2);
}
</style>
