<template>
  <div class="memories-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="floating-hearts">
          <div class="heart" v-for="n in 6" :key="n"></div>
        </div>
      </div>
      <ResponsiveContainer class="hero-container">
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
            class="create-memory-btn hover-lift"
            @click="openCreateMemory"
          >
            <v-icon icon="mdi-plus" start />
            Create New Memory
          </v-btn>
        </div>
      </ResponsiveContainer>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <ResponsiveContainer>
        <div class="stats-grid">
          <div class="stat-card hover-lift">
            <div class="stat-icon">
              <v-icon icon="mdi-heart-multiple" color="primary" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ memories.length }}</div>
              <div class="stat-label">Total Memories</div>
            </div>
          </div>
          <div class="stat-card hover-lift">
            <div class="stat-icon">
              <v-icon icon="mdi-calendar-heart" color="secondary" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ monthsWithMemories }}</div>
              <div class="stat-label">Months Together</div>
            </div>
          </div>
          <div class="stat-card hover-lift">
            <div class="stat-icon">
              <v-icon icon="mdi-star" color="accent" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ favoriteMemories }}</div>
              <div class="stat-label">Favorites</div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <ResponsiveContainer>
        <div class="filters-container">
          <div class="filters-header">
            <h2 class="filters-title">Memory Collection</h2>
            <v-btn
              color="primary"
              rounded
              class="create-btn-secondary"
              @click="openCreateMemory"
            >
              <v-icon icon="mdi-plus" start />
              Create Memory
            </v-btn>
          </div>

          <div class="filters-controls">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search memories..."
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              rounded
              class="search-field"
            />

            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Sort by"
              variant="outlined"
              density="comfortable"
              hide-details
              rounded
              prepend-inner-icon="mdi-sort"
              class="sort-field"
            />

            <v-select
              v-model="selectedFilter"
              :items="filterOptions"
              label="Filter by"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              rounded
              prepend-inner-icon="mdi-filter"
              class="filter-field"
            />
          </div>

        </div>
      </ResponsiveContainer>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <ResponsiveContainer>
        <!-- Empty State -->
        <div v-if="filteredMemories.length === 0 && !isLoading" class="empty-state">
          <v-icon icon="mdi-heart-outline" size="64" color="grey-lighten-2" class="mb-4" />
          <h3 class="empty-state-title">No memories found</h3>
          <p class="empty-state-text">Start creating beautiful memories together</p>
          <v-btn
            color="primary"
            size="large"
            rounded
            @click="openCreateMemory"
            class="mt-4"
          >
            <v-icon icon="mdi-plus" start />
            Create Your First Memory
          </v-btn>
        </div>

        <!-- Loading State -->
        <div v-else-if="isLoading" class="loading-state">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
            class="mb-4"
          />
          <p class="loading-text">Loading memories...</p>
        </div>

        <!-- Memories Grid -->
        <div v-else class="memories-grid">
          <MemoryCard
            v-for="memory in filteredMemories"
            :key="memory.id"
            :memory="memory"
            @click="openMemoryDetail(memory)"
            @favorite="toggleFavorite(memory)"
            @edit="editMemory(memory)"
            @delete="deleteMemory(memory)"
            class="memory-card-item hover-lift"
          />
        </div>
      </ResponsiveContainer>
    </main>
  </div>
</template><script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useMemoriesStore } from '@/stores/memories'
import { useDialogsStore } from '@/stores/dialogs'
import type { Memory } from '@/types'
import MemoryCard from '@/components/memories/MemoryCard.vue'
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
const sortBy = ref('date-desc')

// Filter and sort options
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

// Computed properties
const filteredMemories = computed(() => {
  let filtered = [...memories.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(memory => 
      memory.title.toLowerCase().includes(query) ||
      memory.description?.toLowerCase().includes(query) ||
      memory.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Category filter
  if (selectedFilter.value !== 'all') {
    switch (selectedFilter.value) {
      case 'favorites':
        filtered = filtered.filter(memory => memory.isFavorite)
        break
      case 'recent':
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        filtered = filtered.filter(memory => new Date(memory.createdAt) >= thirtyDaysAgo)
        break
      case 'private':
        filtered = filtered.filter(memory => memory.isPrivate)
        break
      case 'shared':
        filtered = filtered.filter(memory => !memory.isPrivate)
        break
    }
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'date-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'title-desc':
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  return filtered
})

// Stats
const monthsWithMemories = computed(() => {
  const months = new Set(
    memories.value.map(memory => {
      const date = new Date(memory.createdAt)
      return `${date.getFullYear()}-${date.getMonth()}`
    })
  )
  return months.size
})

const favoriteMemories = computed(() => {
  return memories.value.filter(memory => memory.isFavorite).length
})

// Methods
const openCreateMemory = () => {
  router.push({ name: 'create-memory' })
}

const openMemoryDetail = (memory: Memory) => {
  router.push({ name: 'memory-detail', params: { id: memory.id } })
}

const toggleFavorite = async (memory: Memory) => {
  try {
    await memoriesStore.updateMemory(memory.id, {
      ...memory,
    })
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
  }
}

const editMemory = (memory: Memory) => {
  router.push({ name: 'edit-memory', params: { id: memory.id } })
}

const deleteMemory = async (memory: Memory) => {
  if (confirm('Are you sure you want to delete this memory?')) {
    try {
      await memoriesStore.deleteMemory(memory.id)
    } catch (error) {
      console.error('Failed to delete memory:', error)
    }
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await memoriesStore.fetchMemories()
  } catch (error) {
    console.error('Failed to load memories:', error)
  }
})
</script><style scoped>
.memories-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--v-theme-background) 0%, var(--v-theme-surface) 100%);
}

.hero-section {
  position: relative;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, var(--v-theme-primary-lighten-5) 0%, var(--v-theme-surface) 100%);
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 40vh;
  }
}

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
}

.heart {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0.3;
  animation: floatHeart 15s infinite ease-in-out;
}

.heart::before,
.heart::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 16px;
  background: rgb(var(--v-theme-primary));
  border-radius: 10px 10px 0 0;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
}

.heart::after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
}

.heart:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.heart:nth-child(2) { top: 20%; left: 80%; animation-delay: 2s; }
.heart:nth-child(3) { top: 40%; left: 20%; animation-delay: 4s; }
.heart:nth-child(4) { top: 60%; left: 90%; animation-delay: 6s; }
.heart:nth-child(5) { top: 80%; left: 30%; animation-delay: 8s; }
.heart:nth-child(6) { top: 30%; left: 70%; animation-delay: 10s; }

@keyframes floatHeart {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  25% { transform: translateY(-20px) rotate(5deg); opacity: 0.5; }
  50% { transform: translateY(-10px) rotate(-5deg); opacity: 0.3; }
  75% { transform: translateY(-30px) rotate(3deg); opacity: 0.4; }
}

.hero-container {
  position: relative;
  z-index: 2;
}

.hero-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--v-theme-on-surface);
  margin-bottom: 16px;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 8px;
  }
}

.title-icon {
  color: var(--v-theme-primary);
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--v-theme-on-surface-variant);
  margin-bottom: 32px;
  line-height: 1.6;
}

.create-memory-btn {
  font-weight: 600;
  text-transform: none;
  padding: 12px 32px;
  box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.stats-section {
  padding: 48px 0;
  background: var(--v-theme-surface);
  border-radius: 24px 24px 0 0;
  margin-top: -24px;
  position: relative;
  z-index: 3;
}

@media (max-width: 768px) {
  .stats-section {
    padding: 32px 0;
    margin-top: -16px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.stat-card {
  background: var(--v-theme-surface);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--v-theme-outline-variant), 0.12);
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--v-theme-primary-lighten-4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--v-theme-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--v-theme-on-surface-variant);
  line-height: 1.5;
  margin-top: 4px;
}

.filters-section {
  background: var(--v-theme-surface);
  padding: 32px 0;
  border-bottom: 1px solid var(--v-theme-outline-variant);
  position: sticky;
  top: 64px;
  z-index: 10;
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 768px) {
  .filters-header {
    flex-direction: column;
    align-items: stretch;
  }
}

.filters-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--v-theme-on-surface);
  margin: 0;
}

.create-btn-secondary {
  text-transform: none;
  font-weight: 500;
}

.filters-controls {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  align-items: end;
}

@media (max-width: 768px) {
  .filters-controls {
    grid-template-columns: 1fr;
  }
}

.filter-chips {
  display: flex;
  justify-content: center;
}

.filter-chip {
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.main-content {
  padding: 48px 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 32px 0;
  }
}

.empty-state {
  text-align: center;
  padding: 96px 24px;
}

.empty-state-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--v-theme-on-surface);
  margin: 16px 0 8px 0;
}

.empty-state-text {
  font-size: 1rem;
  color: var(--v-theme-on-surface-variant);
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: 96px 24px;
}

.loading-text {
  font-size: 1rem;
  color: var(--v-theme-on-surface-variant);
  margin: 16px 0 0 0;
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .memories-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.memory-card-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-theme--dark .hero-section {
  background: linear-gradient(135deg, var(--v-theme-surface-variant) 0%, var(--v-theme-surface) 100%);
}

.v-theme--dark .stats-section {
  background: var(--v-theme-surface-variant);
}

.v-theme--dark .filters-section {
  background: var(--v-theme-surface-variant);
}

@media (prefers-reduced-motion: reduce) {
  .heart {
    animation: none !important;
  }
  
  .stat-card,
  .memory-card-item,
  .create-memory-btn {
    transition: none !important;
  }
  
  .hover-lift:hover {
    transform: none !important;
  }
}

.stat-card:focus-visible,
.memory-card-item:focus-visible {
  outline: 2px solid var(--v-theme-primary);
  outline-offset: 2px;
}
</style>