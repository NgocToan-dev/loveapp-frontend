<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
    <div class="container mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ $t('memories.title') }}
            </h1>
            <p class="text-gray-600">
              {{ $t('memories.subtitle') }}
            </p>
          </div>
          <button
            @click="showCreateForm = true"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ $t('memories.actions.create') }}
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search Input -->
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('memories.search.placeholder')"
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- View Mode Toggle -->
          <div class="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Filter Options -->
        <div class="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
          <!-- Favorites Filter -->
          <button
            @click="toggleFavoritesFilter"
            :class="[
              'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              showFavoritesOnly
                ? 'bg-red-100 text-red-700 border-2 border-red-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
            ]"
          >
            <svg :class="['w-4 h-4 mr-2', showFavoritesOnly ? 'text-red-500' : '']" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            {{ $t('memories.filters.favorites') }}
          </button>

          <!-- Sort Options -->
          <div class="relative">
            <button
              class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-200 border-2 border-transparent"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
              {{ $t('common.filter.title') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="memoriesStore.isLoading" class="flex justify-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p class="text-gray-600">{{ $t('common.status.loading') }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="displayedMemories.length === 0" class="text-center py-20">
        <div class="mb-8">
          <svg class="mx-auto h-24 w-24 text-pink-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 class="text-2xl font-semibold text-gray-900 mb-3">
            {{ hasActiveFilters ? $t('memories.empty.noMatches') : $t('memories.empty.noMemories') }}
          </h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            {{ hasActiveFilters ? $t('memories.empty.tryAdjustingFilters') : $t('memories.empty.createFirst') }}
          </p>
          <button
            v-if="!hasActiveFilters"
            @click="showCreateForm = true"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            {{ $t('memories.actions.createFirst') }}
          </button>
          <button
            v-else
            @click="clearAllFilters"
            class="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
          >
            {{ $t('memories.filters.clearAll') }}
          </button>
        </div>
      </div>

      <!-- Memory Grid -->
      <div v-else class="grid gap-6" :class="viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'">
        <MemoryCard
          v-for="memory in displayedMemories"
          :key="memory.id"
          :memory="memory"
          :view-mode="viewMode"
          @edit="editMemory(memory)"
          @delete="confirmDelete(memory)"
        />
      </div>

      <!-- Memory Form Modal -->
      <MemoryForm
        :is-open="showCreateForm || !!editingMemory"
        :memory="editingMemory"
        @close="closeForm"
        @success="handleFormSuccess"
      />

      <!-- Confirm Delete Dialog -->
      <ConfirmDialog
        :is-open="!!memoryToDelete"
        :title="$t('memories.delete.title')"
        :message="$t('memories.delete.message')"
        :confirm-text="$t('common.buttons.delete')"
        @confirm="handleDelete"
        @cancel="memoryToDelete = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemoriesStore, type Memory } from '@/stores/memories'
import MemoryCard from './MemoryCard.vue'
import MemoryForm from './MemoryForm.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const { t } = useI18n()
const memoriesStore = useMemoriesStore()

const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref<string>('')
const selectedMood = ref<Memory['mood'] | null>(null)
const showFavoritesOnly = ref<boolean>(false)
const showPrivateOnly = ref<boolean>(false)
const sortBy = ref<{ field: string; direction: 'asc' | 'desc' }>({ field: 'date', direction: 'desc' })

// Available moods for filtering
const availableMoods = computed(() => ['happy', 'love', 'excited', 'romantic', 'nostalgic', 'grateful'])

// Check if any filters are active
const hasActiveFilters = computed(() => 
  searchQuery.value || 
  selectedMood.value || 
  showFavoritesOnly.value || 
  showPrivateOnly.value
)

const sortOptions = [
  { label: t('memories.filters.newestFirst'), value: 'date_desc' },
  { label: t('memories.filters.oldestFirst'), value: 'date_asc' },
  { label: t('memories.filters.titleAZ'), value: 'title_asc' }
]
const currentSort = computed(() => `${sortBy.value.field}_${sortBy.value.direction}`)

const filtersObj = computed(() => ({
  search: searchQuery.value,
  mood: selectedMood.value,
  showFavoritesOnly: showFavoritesOnly.value,
  showPrivateOnly: showPrivateOnly.value
}))

const displayedMemories = computed(() => memoriesStore.filteredMemories)

const handleSort = (newSort: string) => {
  const [field, direction] = newSort.split('_') as [string, 'asc' | 'desc']
  sortBy.value = { field, direction }
  memoriesStore.setSortBy(field, direction)
}

const handleFilters = (newFilters: Record<string, any>) => {
  searchQuery.value = newFilters.search || ''
  selectedMood.value = newFilters.mood || null
  showFavoritesOnly.value = !!newFilters.showFavoritesOnly
  showPrivateOnly.value = !!newFilters.showPrivateOnly
  memoriesStore.setFilters(newFilters)
}

const hasMoreMemories = computed(() => false)
const isLoadingMore = ref(false)
const loadMore = async () => {
  isLoadingMore.value = true
  try {
    await memoriesStore.loadMoreMemories()
  } finally {
    isLoadingMore.value = false
  }
}

const showCreateForm = ref(false)
const editingMemory = ref<Memory | null>(null)
const memoryToDelete = ref<Memory | null>(null)

const editMemory = (memory: Memory) => {
  editingMemory.value = memory
}

const confirmDelete = (memory: Memory) => {
  memoryToDelete.value = memory
}

const handleDelete = async () => {
  if (!memoryToDelete.value) return
  
  try {
    await memoriesStore.deleteMemory(memoryToDelete.value.id)
    memoryToDelete.value = null
    // Show success toast if available
  } catch (error) {
    console.error('Failed to delete memory:', error)
    // Show error toast if available
  }
}

const closeForm = () => {
  showCreateForm.value = false
  editingMemory.value = null
}

const handleFormSuccess = () => {
  closeForm()
}

// Filter and sort methods
const getMoodEmoji = (mood: string) => {
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    love: '❤️',
    excited: '🎉',
    romantic: '💕',
    nostalgic: '💭',
    grateful: '🙏'
  }
  return moodEmojis[mood] || '😊'
}

const setSortBy = (field: string, direction: 'asc' | 'desc') => {
  sortBy.value = { field, direction }
  memoriesStore.setSortBy(field, direction)
}

const setMoodFilter = (mood: Memory['mood'] | null) => {
  selectedMood.value = mood
  memoriesStore.setFilters(filtersObj.value)
}

const toggleFavoritesFilter = () => {
  showFavoritesOnly.value = !showFavoritesOnly.value
  memoriesStore.setFilters(filtersObj.value)
}

const togglePrivateFilter = () => {
  showPrivateOnly.value = !showPrivateOnly.value
  memoriesStore.setFilters(filtersObj.value)
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedMood.value = null
  showFavoritesOnly.value = false
  showPrivateOnly.value = false
  memoriesStore.setFilters({})
}

const handleViewModeChange = (mode: 'grid' | 'list' | 'gallery') => {
  if (mode === 'grid' || mode === 'list') {
    viewMode.value = mode
  }
}

onMounted(() => {
  memoriesStore.fetchMemories()
})
</script>