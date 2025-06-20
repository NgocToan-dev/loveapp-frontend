<template>
  <ResponsiveContainer>
    <div class="memories-view">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-background">
          <div class="floating-hearts">
            <div class="heart" v-for="n in 6" :key="n"></div>
          </div>
        </div>
        <div class="hero-content">
          <h1 class="hero-title">
            <v-icon icon="mdi-heart" class="title-icon" />
            Our Love Story
          </h1>
          <p class="hero-subtitle">Every moment together is a precious memory</p>
          <v-btn
            color="primary"
            size="large"
            rounded
            elevation="0"
            class="create-memory-btn"
            @click="openCreateMemoryDialog"
          >
            <v-icon icon="mdi-plus" start />
            Create New Memory
          </v-btn>
        </div>
      </section>

      <!-- Stats & Quick Actions -->
      <section class="stats-section">
        <v-container>
          <v-row>
            <v-col cols="12" md="8">
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon">
                    <v-icon icon="mdi-heart-multiple" color="primary" />
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ memories.length }}</div>
                    <div class="stat-label">Total Memories</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">
                    <v-icon icon="mdi-calendar-heart" color="secondary" />
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ monthsWithMemories }}</div>
                    <div class="stat-label">Months Together</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">
                    <v-icon icon="mdi-star" color="accent" />
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ favoriteMemories }}</div>
                    <div class="stat-label">Favorites</div>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="quick-filters">
                <v-chip-group v-model="selectedFilter" mandatory>
                  <v-chip value="all" variant="elevated">All</v-chip>
                  <v-chip value="favorites" variant="elevated">Favorites</v-chip>
                  <v-chip value="recent" variant="elevated">Recent</v-chip>
                </v-chip-group>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>      <!-- Advanced Filter Section -->
      <section class="filter-section">
        <v-container>
          <v-card class="filter-card" elevation="0" rounded="xl">
            <v-card-text class="pa-6">
              <!-- Header with Title and Create Button -->
              <div class="filter-header">
                <div class="filter-title">
                  <h2>Memory Collection</h2>
                  <p class="text-medium-emphasis mb-0">Cherish and organize your precious moments</p>
                </div>
                <v-btn
                  color="primary"
                  size="large"
                  rounded="xl"
                  @click="openCreateMemoryDialog"
                  class="create-btn"
                >
                  <v-icon icon="mdi-plus" start />
                  Create Memory
                </v-btn>
              </div>

              <v-divider class="my-6" />

              <!-- Main Filter Controls -->
              <v-row align="center" class="filter-controls">
                <!-- Search -->
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Search memories..."
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    clearable
                    rounded="lg"
                    class="search-field"
                    bg-color="surface"
                  />
                </v-col>

                <!-- Sort -->
                <v-col cols="12" md="3">
                  <v-select
                    v-model="sortBy"
                    :items="sortOptions"
                    label="Sort by"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    rounded="lg"
                    bg-color="surface"
                    prepend-inner-icon="mdi-sort"
                  />
                </v-col>

                <!-- Category Filter -->
                <v-col cols="12" md="3">
                  <v-select
                    v-model="selectedFilter"
                    :items="filterOptions"
                    label="Filter by"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    clearable
                    rounded="lg"
                    bg-color="surface"
                    prepend-inner-icon="mdi-filter"
                  />
                </v-col>

                <!-- View Toggle -->
                <v-col cols="12" md="2" class="text-right">
                  <v-btn-toggle v-model="viewMode" mandatory class="view-toggle" rounded="lg">
                    <v-btn value="gallery" variant="outlined" icon size="large">
                      <v-icon icon="mdi-grid" />
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>

              <!-- Quick Filter Chips -->
              <div class="quick-filters mt-4">
                <div class="quick-filters-label">
                  <v-icon icon="mdi-lightning-bolt" size="small" class="mr-2" />
                  Quick Filters:
                </div>
                <v-chip-group
                  v-model="selectedQuickFilter"
                  selected-class="text-primary"
                  class="quick-filter-chips"
                >
                  <v-chip
                    v-for="filter in quickFilters"
                    :key="filter.value"
                    :value="filter.value"
                    variant="outlined"
                    size="small"
                    rounded="lg"
                    class="quick-filter-chip"
                    @click="handleQuickFilter(filter.value)"
                  >
                    <v-icon :icon="filter.icon" start size="small" />
                    {{ filter.text }}
                    <v-badge
                      v-if="getFilterCount(filter.value) > 0"
                      :content="getFilterCount(filter.value)"
                      color="primary"
                      class="ml-2"
                    />
                  </v-chip>
                </v-chip-group>
              </div>
            </v-card-text>
          </v-card>
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
            <p class="loading-text">Loading your precious memories...</p>
          </div>        <!-- Empty State -->
          <div v-else-if="componentMemories.length === 0" class="empty-state">
            <div class="empty-icon">
              <v-icon icon="mdi-heart-outline" size="120" color="grey-lighten-2" />
            </div>
            <h3 class="empty-title">No memories yet</h3>
            <p class="empty-subtitle">
              Start creating beautiful memories together!
            </p>
            <v-btn
              color="primary"
              size="large"
              rounded
              @click="openCreateMemoryDialog"
            >
              <v-icon icon="mdi-plus" start />
              Create Your First Memory
            </v-btn>
          </div>          <!-- Gallery View -->
          <MemoryGallery
            v-else-if="componentMemories.length > 0"
            :memories="componentMemories"
            :view-mode="galleryViewMode"
            @edit-memory="handleEditMemoryFromComponent"
            @delete-memory="handleDeleteMemoryFromComponent"
            @view-memory="handleViewMemoryFromComponent"
            @change-view="handleGalleryViewChange"
          />
        </v-container>
      </section>    <!-- Memory Lightbox -->
      <MemoryLightbox
        v-if="selectedMemory"
        v-model="showLightbox"
        :memory="selectedMemory"
        @close="closeLightbox"
        @edit="handleEditFromLightbox"
        @delete="handleDeleteFromLightbox"      />
    </div>
  </ResponsiveContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useMemoriesStore } from '@/stores/memories'
import { useDialogsStore } from '@/stores/dialogs'
import type { Memory } from '@/types'
import type { CreateMemoryData } from '@/services/memories'
import MemoryGallery from '@/components/memories/MemoryGallery.vue'
import MemoryLightbox from '@/components/memories/MemoryLightbox.vue'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer.vue'

// Stores
const memoriesStore = useMemoriesStore()
const dialogStore = useDialogsStore()
const router = useRouter()

// Store refs
const { memories, isLoading } = storeToRefs(memoriesStore)

// Local state
const searchQuery = ref('')
const selectedFilter = ref('all')
const viewMode = ref<'gallery'>('gallery')
const galleryViewMode = ref<'grid' | 'masonry' | 'list'>('grid')
const selectedMemory = ref<Memory | null>(null)
const showLightbox = ref(false)
const selectedQuickFilter = ref('')
const sortBy = ref('date-desc')

// Filter options
const filterOptions = [
  { title: 'All Memories', value: 'all' },
  { title: 'Favorites', value: 'favorites' },
  { title: 'Recent (30 days)', value: 'recent' },
  { title: 'Private', value: 'private' },
  { title: 'Shared', value: 'shared' }
]

const sortOptions = [
  { title: 'Date (Newest)', value: 'date-desc' },
  { title: 'Date (Oldest)', value: 'date-asc' },
  { title: 'Title A-Z', value: 'title-asc' },
  { title: 'Title Z-A', value: 'title-desc' }
]

// Quick filter definitions
const quickFilters = [
  { text: 'All', value: 'all', icon: 'mdi-all-inclusive' },
  { text: 'Favorites', value: 'favorites', icon: 'mdi-heart' },
  { text: 'Recent', value: 'recent', icon: 'mdi-clock' },
  { text: 'Private', value: 'private', icon: 'mdi-lock' },
  { text: 'Shared', value: 'shared', icon: 'mdi-share' }
]

// Computed properties
const processedMemories = computed(() => {
  return memories.value.map(memory => ({
    ...memory,
    category: memory.category || 'general',
    isPrivate: memory.isPrivate ?? false,
    isFavorite: memory.isFavorite ?? false,
    isShared: memory.isShared ?? false,
    tags: memory.tags || [],
    files: memory.files || []
  } as Memory))
})

const filteredMemories = computed(() => {
  let filtered = [...processedMemories.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(memory =>
      memory.title.toLowerCase().includes(query) ||
      memory.description.toLowerCase().includes(query) ||
      memory.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Apply category filter
  switch (selectedFilter.value) {
    case 'favorites':
      filtered = filtered.filter(memory => memory.isFavorite)
      break
    case 'recent':
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      filtered = filtered.filter(memory => new Date(memory.createdAt).getTime() > thirtyDaysAgo.getTime())
      break
    case 'private':
      filtered = filtered.filter(memory => memory.isPrivate)
      break
    case 'shared':
      filtered = filtered.filter(memory => memory.isShared)
      break
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'date-desc':
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case 'date-asc':
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
    case 'title-asc':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'title-desc':
      filtered.sort((a, b) => b.title.localeCompare(a.title))
      break
    default:
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return filtered
})

// Transform filtered memories for component compatibility
const componentMemories = computed(() => {
  return filteredMemories.value
})

const monthsWithMemories = computed(() => {
  const months = new Set()
  memories.value.forEach(memory => {
    const date = new Date(memory.date)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    months.add(monthKey)
  })
  return months.size
})

const favoriteMemories = computed(() => {
  return memories.value.filter(memory => memory.isFavorite).length
})

// Methods
const openCreateMemoryDialog = () => {
  router.push('/memories/create')
}

const closeCreateMemoryDialog = () => {
  // No longer needed - navigation based
}

const handleMemoryCreated = async (memoryData: CreateMemoryData) => {
  try {
    await memoriesStore.createMemory(memoryData)
    // Dialog is now handled by the view component
  } catch (error) {
    console.error('Failed to create memory:', error)
  }
}

const handleEditMemory = (memory: Memory) => {
  // Open edit dialog using the dialog store
  dialogStore.openDialog({
    component: 'CreateMemoryDialog',
    props: {
      memory,
      isEdit: true
    },
    options: {
      maxWidth: '800px',
      scrollable: true
    }
  })
}

const handleDeleteMemory = async (memory: Memory) => {
  try {
    const confirmed = await dialogStore.openConfirmDialog({
      title: 'Delete Memory',
      message: `Are you sure you want to delete "${memory.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })

    if (confirmed) {
      await memoriesStore.deleteMemory(memory.id)
      if (selectedMemory.value?.id === memory.id) {
        closeLightbox()
      }
    }
  } catch (error) {
    console.error('Failed to delete memory:', error)
  }
}

const handleViewMemory = (memory: Memory) => {
  selectedMemory.value = memory
  showLightbox.value = true
}

// Handlers for memory events (simplified)
const handleEditMemoryFromComponent = (memory: Memory) => {
  handleEditMemory(memory)
}

const handleDeleteMemoryFromComponent = async (memory: Memory) => {
  await handleDeleteMemory(memory)
}

const handleViewMemoryFromComponent = (memory: Memory) => {
  handleViewMemory(memory)
}

const closeLightbox = () => {
  showLightbox.value = false
  selectedMemory.value = null
}

// Handlers for lightbox events
const handleEditFromLightbox = (memory: Memory) => {
  if (selectedMemory.value) {
    handleEditMemory(selectedMemory.value)
  }
}

const handleDeleteFromLightbox = async (memory: Memory) => {
  if (selectedMemory.value) {
    await handleDeleteMemory(selectedMemory.value)
  }
}

const handleGalleryViewChange = (newViewMode: 'grid' | 'masonry' | 'list') => {
  galleryViewMode.value = newViewMode
}

// Methods for quick filters
const handleQuickFilter = (value: string) => {
  selectedFilter.value = value
  selectedQuickFilter.value = value
}

const getFilterCount = (filter: string) => {
  switch (filter) {
    case 'all':
      return processedMemories.value.length
    case 'favorites':
      return processedMemories.value.filter(memory => memory.isFavorite).length
    case 'recent':
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return processedMemories.value.filter(memory => 
        new Date(memory.createdAt).getTime() > thirtyDaysAgo.getTime()
      ).length
    case 'private':
      return processedMemories.value.filter(memory => memory.isPrivate).length
    case 'shared':
      return processedMemories.value.filter(memory => memory.isShared).length
    default:
      return 0
  }
}

// Lifecycle
onMounted(async () => {
  if (memories.value.length === 0) {
    await memoriesStore.fetchMemories()
  }
})

// Watch for search query changes to debounce
watch(searchQuery, () => {
  // Search is reactive, no debouncing needed for now
}, { immediate: true })
</script>

<style scoped lang="scss">
.memories-view {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(var(--v-theme-surface), 0.8) 0%, rgba(var(--v-theme-background), 1) 100%);
}

.hero-section {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 2rem;

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(var(--v-theme-primary), 0.1) 0%, 
      rgba(var(--v-theme-secondary), 0.05) 100%);
  }

  .floating-hearts {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .heart {
      position: absolute;
      width: 20px;
      height: 20px;
      opacity: 0.3;
      animation: floatHeart 15s infinite ease-in-out;

      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 16px;
        background: rgb(var(--v-theme-primary));
        border-radius: 10px 10px 0 0;
        transform: rotate(-45deg);
        transform-origin: 0 100%;
      }

      &::after {
        left: 0;
        transform: rotate(45deg);
        transform-origin: 100% 100%;
      }

      &:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
      &:nth-child(2) { top: 20%; left: 80%; animation-delay: 2s; }
      &:nth-child(3) { top: 40%; left: 20%; animation-delay: 4s; }
      &:nth-child(4) { top: 60%; left: 90%; animation-delay: 6s; }
      &:nth-child(5) { top: 80%; left: 30%; animation-delay: 8s; }
      &:nth-child(6) { top: 30%; left: 70%; animation-delay: 10s; }
    }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem;

    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: 3.5rem;
      font-weight: 700;
      color: rgb(var(--v-theme-on-surface));
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;

      .title-icon {
        color: rgb(var(--v-theme-primary));
        font-size: 3rem;
      }

      @media (max-width: 768px) {
        font-size: 2.5rem;
        flex-direction: column;
        gap: 0.5rem;

        .title-icon {
          font-size: 2rem;
        }
      }
    }    .hero-subtitle {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.25rem;
      color: rgb(var(--v-theme-on-surface));
      margin-bottom: 2rem;
      opacity: 0.7;
    }

    .create-memory-btn {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      padding: 1rem 2rem;
      letter-spacing: 0.5px;
      box-shadow: 0 8px 32px rgba(var(--v-theme-primary), 0.3);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(var(--v-theme-primary), 0.4);
      }
    }
  }
}

.stats-section {
  margin-bottom: 2rem;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1rem;

    .stat-card {
      background: rgba(var(--v-theme-surface), 1);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(var(--v-theme-outline), 0.1);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(var(--v-theme-primary), 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stat-content {
        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: rgb(var(--v-theme-on-surface));
          line-height: 1;
        }        .stat-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.875rem;
          color: rgb(var(--v-theme-on-surface));
          opacity: 0.6;
          margin-top: 0.25rem;
        }
      }
    }
  }

  .quick-filters {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    @media (max-width: 768px) {
      justify-content: flex-start;
      margin-top: 1rem;
    }
  }
}

/* Filter Section */
.filter-section {
  margin-bottom: 2rem;
  background: linear-gradient(135deg, 
    rgba(var(--v-theme-primary), 0.05) 0%, 
    rgba(var(--v-theme-secondary), 0.03) 100%);
  padding: 40px 0;
}

.filter-card {
  background: rgba(var(--v-theme-surface), 0.9) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  transition: all 0.3s ease;
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.filter-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;

  @media (max-width: 960px) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
}

.filter-title h2 {
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 960px) {
    font-size: 1.75rem;
  }

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
}

.filter-title p {
  font-size: 0.95rem;
  opacity: 0.8;
}

.create-btn {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary))) !important;
  color: white !important;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 24px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
  flex-shrink: 0;

  @media (max-width: 960px) {
    width: 100%;
    margin-top: 16px;
  }
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(var(--v-theme-primary), 0.4);
}

.filter-controls {
  margin: 0;
}

.search-field :deep(.v-field) {
  transition: all 0.3s ease;
}

.search-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.view-toggle {
  background: rgba(var(--v-theme-surface), 0.9);
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  overflow: hidden;

  @media (max-width: 600px) {
    justify-self: center;
  }
}

.view-toggle .v-btn {
  transition: all 0.3s ease;
}

.view-toggle .v-btn:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

.quick-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 960px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

.quick-filters-label {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
  flex-shrink: 0;

  @media (max-width: 960px) {
    justify-content: center;
  }
}

.quick-filter-chips {
  flex: 1;
  min-width: 0;

  @media (max-width: 960px) {
    justify-content: center;
  }
}

.quick-filter-chip {
  transition: all 0.3s ease;
  margin: 2px;
}

.quick-filter-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.quick-filter-chip.v-chip--selected {
  background: rgba(var(--v-theme-primary), 0.15) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.content-section {
  padding-bottom: 4rem;

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;    .loading-text {
      margin-top: 1rem;
      font-family: 'Montserrat', sans-serif;
      color: rgb(var(--v-theme-on-surface));
      opacity: 0.6;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;

    .empty-icon {
      margin-bottom: 2rem;
      opacity: 0.5;
    }

    .empty-title {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      font-weight: 600;
      color: rgb(var(--v-theme-on-surface));
      margin-bottom: 1rem;
    }    .empty-subtitle {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.125rem;
      color: rgb(var(--v-theme-on-surface));
      opacity: 0.6;
      margin-bottom: 2rem;
      max-width: 400px;
    }
  }
}

@keyframes floatHeart {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(10deg);    opacity: 0.6;
  }
}
</style>
