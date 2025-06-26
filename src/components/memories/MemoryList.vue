<template>
  <div class="memory-list">
    <!-- Filters and Search -->
    <div class="mb-6 space-y-4">
      <!-- Search and Quick Actions -->
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <Input
              v-model="searchQuery"
              :placeholder="$t('memories.search.placeholder')"
              class="pl-10"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- View Toggle -->
        <div class="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              viewMode === 'grid' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              viewMode === 'list' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Create Button -->
        <Button @click="showCreateForm = true">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ $t('memories.actions.create') }}
        </Button>
      </div>

      <!-- Advanced Filters -->
      <div class="flex flex-wrap gap-2">
        <!-- Sort Options -->
        <Dropdown class="inline-block">
          <template #trigger>
            <Button variant="outline" size="sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {{ $t('memories.filters.sortBy') }}
            </Button>
          </template>
          
          <DropdownItem @click="setSortBy('date', 'desc')">
            {{ $t('memories.filters.newestFirst') }}
          </DropdownItem>
          <DropdownItem @click="setSortBy('date', 'asc')">
            {{ $t('memories.filters.oldestFirst') }}
          </DropdownItem>
          <DropdownItem @click="setSortBy('title', 'asc')">
            {{ $t('memories.filters.titleAZ') }}
          </DropdownItem>
        </Dropdown>

        <!-- Mood Filter -->
        <Dropdown class="inline-block">
          <template #trigger>
            <Button variant="outline" size="sm">
              <span class="mr-2">{{ selectedMood ? getMoodEmoji(selectedMood) : '😊' }}</span>
              {{ selectedMood ? $t(`memories.moods.${selectedMood}`) : $t('memories.filters.allMoods') }}
            </Button>
          </template>
          
          <DropdownItem @click="setMoodFilter(null)">
            {{ $t('memories.filters.allMoods') }}
          </DropdownItem>
          <DropdownItem 
            v-for="mood in availableMoods"
            :key="mood"
            @click="setMoodFilter(mood)"
          >
            <span class="mr-2">{{ getMoodEmoji(mood) }}</span>
            {{ $t(`memories.moods.${mood}`) }}
          </DropdownItem>
        </Dropdown>

        <!-- Quick Filters -->
        <Button
          variant="outline"
          size="sm"
          :class="{ 'bg-pink-50 border-pink-300 text-pink-700': showFavoritesOnly }"
          @click="toggleFavoritesFilter"
        >
          <svg class="w-4 h-4 mr-1" :class="showFavoritesOnly ? 'text-red-500' : ''" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
          {{ $t('memories.filters.favorites') }}
        </Button>

        <Button
          variant="outline"
          size="sm"
          :class="{ 'bg-gray-50 border-gray-400 text-gray-700': showPrivateOnly }"
          @click="togglePrivateFilter"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {{ $t('memories.filters.private') }}
        </Button>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
        <span class="text-sm text-gray-600">{{ $t('memories.filters.activeFilters') }}:</span>
        
        <Badge
          v-if="searchQuery"
          :label="`${$t('memories.filters.search')}: ${searchQuery}`"
          variant="secondary"
          removable
          @remove="searchQuery = ''"
        />
        
        <Badge
          v-if="selectedMood"
          :label="`${$t('memories.filters.mood')}: ${$t(`memories.moods.${selectedMood}`)}`"
          variant="secondary"
          removable
          @remove="setMoodFilter(null)"
        />
        
        <Badge
          v-if="showFavoritesOnly"
          :label="$t('memories.filters.favorites')"
          variant="secondary"
          removable
          @remove="toggleFavoritesFilter"
        />
        
        <Badge
          v-if="showPrivateOnly"
          :label="$t('memories.filters.private')"
          variant="secondary"
          removable
          @remove="togglePrivateFilter"
        />

        <Button variant="ghost" size="sm" @click="clearAllFilters">
          {{ $t('memories.filters.clearAll') }}
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="memoriesStore.isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Empty State -->
    <div v-else-if="displayedMemories.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ hasActiveFilters ? $t('memories.empty.noMatches') : $t('memories.empty.noMemories') }}
      </h3>
      
      <p class="text-gray-600 mb-4">
        {{ hasActiveFilters ? $t('memories.empty.tryAdjustingFilters') : $t('memories.empty.createFirst') }}
      </p>
      
      <Button v-if="!hasActiveFilters" @click="showCreateForm = true">
        {{ $t('memories.actions.createFirst') }}
      </Button>
      
      <Button v-else variant="outline" @click="clearAllFilters">
        {{ $t('memories.filters.clearAll') }}
      </Button>
    </div>

    <!-- Memory Grid/List -->
    <div v-else>
      <!-- Grid View -->
      <div 
        v-if="viewMode === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <MemoryCard
          v-for="memory in displayedMemories"
          :key="memory.id"
          :memory="memory"
          @edit="editMemory"
          @delete="confirmDelete"
        />
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <MemoryCard
          v-for="memory in displayedMemories"
          :key="memory.id"
          :memory="memory"
          class="w-full"
          @edit="editMemory"
          @delete="confirmDelete"
        />
      </div>

      <!-- Load More -->
      <div v-if="hasMoreMemories" class="text-center mt-8">
        <Button
          variant="outline"
          :loading="isLoadingMore"
          @click="loadMore"
        >
          {{ $t('common.actions.loadMore') }}
        </Button>
      </div>
    </div>

    <!-- Memory Form Modal -->
    <MemoryForm
      :is-open="showCreateForm || !!editingMemory"
      :memory="editingMemory"
      @close="closeForm"
      @success="handleFormSuccess"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :is-open="!!deletingMemory"
      :title="$t('memories.delete.title')"
      :message="$t('memories.delete.message')"
      :confirm-text="$t('common.actions.delete')"
      :cancel-text="$t('common.actions.cancel')"
      variant="danger"
      @confirm="handleDelete"
      @cancel="deletingMemory = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemoriesStore, type Memory } from '@/stores/memories'
import MemoryCard from './MemoryCard.vue'
import MemoryForm from './MemoryForm.vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import Dropdown from '@/components/common/Dropdown.vue'
import DropdownItem from '@/components/common/DropdownItem.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const { t } = useI18n()
const memoriesStore = useMemoriesStore()

// Local state
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedMood = ref<Memory['mood'] | null>(null)
const showFavoritesOnly = ref(false)
const showPrivateOnly = ref(false)
const sortBy = ref<{ field: string; direction: 'asc' | 'desc' }>({ field: 'date', direction: 'desc' })

const showCreateForm = ref(false)
const editingMemory = ref<Memory | null>(null)
const deletingMemory = ref<Memory | null>(null)
const isLoadingMore = ref(false)

const availableMoods: Memory['mood'][] = [
  'happy', 'love', 'excited', 'romantic', 'nostalgic', 'grateful'
]

// Computed
const displayedMemories = computed(() => {
  return memoriesStore.filteredMemories
})

const hasActiveFilters = computed(() => {
  return !!(
    searchQuery.value ||
    selectedMood.value ||
    showFavoritesOnly.value ||
    showPrivateOnly.value
  )
})

const hasMoreMemories = computed(() => {
  // This would be based on pagination from the store
  return false // For now, assuming no pagination
})

// Methods
const getMoodEmoji = (mood: Memory['mood']) => {
  const moodEmojis = {
    happy: '😊',
    love: '💕',
    excited: '🎉',
    romantic: '🌹',
    nostalgic: '😌',
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
  memoriesStore.setFilters({ mood })
}

const toggleFavoritesFilter = () => {
  showFavoritesOnly.value = !showFavoritesOnly.value
  memoriesStore.setFilters({ showFavoritesOnly: showFavoritesOnly.value })
}

const togglePrivateFilter = () => {
  showPrivateOnly.value = !showPrivateOnly.value
  memoriesStore.setFilters({ showPrivateOnly: showPrivateOnly.value })
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedMood.value = null
  showFavoritesOnly.value = false
  showPrivateOnly.value = false
  memoriesStore.clearFilters()
}

const editMemory = (memory: Memory) => {
  editingMemory.value = memory
}

const confirmDelete = (memory: Memory) => {
  deletingMemory.value = memory
}

const handleDelete = async () => {
  if (deletingMemory.value) {
    try {
      await memoriesStore.deleteMemory(deletingMemory.value.id)
      deletingMemory.value = null
    } catch (error) {
      console.error('Failed to delete memory:', error)
    }
  }
}

const closeForm = () => {
  showCreateForm.value = false
  editingMemory.value = null
}

const handleFormSuccess = () => {
  closeForm()
  // Optionally show success notification
}

const loadMore = async () => {
  isLoadingMore.value = true
  try {
    // Implement pagination loading
    await memoriesStore.loadMoreMemories()
  } finally {
    isLoadingMore.value = false
  }
}

// Watch for search changes
watch(searchQuery, (newQuery) => {
  memoriesStore.setFilters({ search: newQuery })
}, { debounced: true, debounceTime: 300 })

// Load memories on mount
onMounted(() => {
  memoriesStore.fetchMemories()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
