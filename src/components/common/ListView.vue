<template>
  <div class="list-view">
    <!-- Header với search, filters và view controls -->
    <div class="list-header">
      <div class="search-section">
        <div class="search-input-wrapper">
          <Input
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            class="search-input"
            @input="handleSearchInput"
          >
            <template #prefix>
              <SearchIcon class="w-4 h-4 text-gray-400" />
            </template>
            <template #suffix>
              <Button
                v-if="searchQuery"
                @click="clearSearch"
                variant="ghost"
                size="sm"
                class="clear-search"
              >
                <XIcon class="w-4 h-4" />
              </Button>
            </template>
          </Input>
        </div>
      </div>

      <div class="controls-section">
        <!-- View Mode Toggle -->
        <div class="view-controls">
          <div class="view-toggle">
            <Button
              @click="updateViewMode('grid')"
              :variant="viewMode === 'grid' ? 'primary' : 'ghost'"
              size="sm"
              class="view-button"
            >
              <GridIcon class="w-4 h-4" />
            </Button>
            <Button
              @click="updateViewMode('list')"
              :variant="viewMode === 'list' ? 'primary' : 'ghost'"
              size="sm"
              class="view-button"
            >
              <ListIcon class="w-4 h-4" />
            </Button>
            <Button
              v-if="supportGallery"
              @click="updateViewMode('gallery')"
              :variant="viewMode === 'gallery' ? 'primary' : 'ghost'"
              size="sm"
              class="view-button"
            >
              <GalleryIcon class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Sort Controls -->
        <div class="sort-controls">
          <Dropdown>
            <template #trigger>
              <Button variant="outline" size="sm" class="sort-button">
                <SortIcon class="w-4 h-4 mr-2" />
                {{ $t('common.sort.label') }}
                <ChevronDownIcon class="w-4 h-4 ml-1" />
              </Button>
            </template>
            
            <DropdownItem
              v-for="option in sortOptions"
              :key="option.value"
              @click="updateSort(option.value)"
              :class="{ 'active': currentSort === option.value }"
            >
              <CheckIcon v-if="currentSort === option.value" class="w-4 h-4 mr-2" />
              <span class="w-4 h-4 mr-2" v-else></span>
              {{ option.label }}
            </DropdownItem>
          </Dropdown>
        </div>

        <!-- Filter Toggle -->
        <Button
          @click="showFilters = !showFilters"
          variant="outline"
          size="sm"
          class="filter-button"
          :class="{ 'has-filters': hasActiveFilters }"
        >
          <FilterIcon class="w-4 h-4 mr-2" />
          {{ $t('common.filter.label') }}
          <Badge v-if="activeFiltersCount > 0" :label="activeFiltersCount.toString()" variant="primary" size="sm" />
        </Button>
      </div>
    </div>

    <!-- Filters Panel -->
    <Transition name="slide-down">
      <div v-if="showFilters" class="filters-panel">
        <FilterSortPanel
          :filters="filters"
          :entity="entity"
          @update:filters="updateFilters"
          @clear="clearFilters"
        />
      </div>
    </Transition>

    <!-- Active Filters Tags -->
    <div v-if="hasActiveFilters" class="active-filters">
      <div class="filters-list">
        <Badge
          v-for="filter in activeFilterTags"
          :key="filter.key"
          :label="filter.label"
          variant="secondary"
          removable
          @remove="removeFilter(filter.key)"
        />
      </div>
      <Button @click="clearFilters" variant="ghost" size="sm">
        {{ $t('common.filter.clear_all') }}
      </Button>
    </div>

    <!-- Bulk Actions Bar -->
    <Transition name="slide-down">
      <div v-if="selectedItems.length > 0" class="bulk-actions-bar">
        <div class="selection-info">
          <span>{{ $t('common.bulk.selected', { count: selectedItems.length }) }}</span>
          <Button @click="clearSelection" variant="ghost" size="sm">
            {{ $t('common.bulk.clear_selection') }}
          </Button>
        </div>
        
        <div class="bulk-actions">
          <Button
            v-for="action in bulkActions"
            :key="action.key"
            @click="handleBulkAction(action.key)"
            :variant="action.variant || 'outline'"
            size="sm"
            :loading="bulkActionLoading === action.key"
            :disabled="!action.enabled || bulkActionLoading !== null"
          >
            <component :is="action.icon" class="w-4 h-4 mr-2" />
            {{ action.label }}
          </Button>
        </div>
      </div>
    </Transition>

    <!-- Content Area -->
    <div class="list-content">
      <!-- Loading State -->
      <div v-if="isLoading && items.length === 0" class="loading-state">
        <LoadingSpinner size="lg" />
        <p>{{ $t('common.loading') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && items.length === 0" class="empty-state">
        <div class="empty-icon">{{ emptyIcon }}</div>
        <h3>{{ emptyTitle }}</h3>
        <p>{{ emptyDescription }}</p>
        <Button v-if="showCreateButton" @click="$emit('create')" variant="primary">
          {{ createButtonText }}
        </Button>
      </div>

      <!-- Items Grid/List -->
      <div v-else class="items-container" :class="`view-${viewMode}`">
        <div
          v-for="item in items"
          :key="item.id"
          class="item-wrapper"
          :class="{ 'selected': selectedItems.includes(item.id) }"
        >
          <!-- Selection Checkbox -->
          <div v-if="allowSelection" class="item-selection">
            <input
              type="checkbox"
              :checked="selectedItems.includes(item.id)"
              @change="toggleSelection(item.id)"
              class="selection-checkbox"
            />
          </div>

          <!-- Item Content -->
          <div class="item-content" @click="handleItemClick(item)">
            <slot name="item" :item="item" :view-mode="viewMode" />
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore && items.length > 0" class="load-more-section">
        <Button
          @click="$emit('load-more')"
          variant="outline"
          :loading="isLoading"
        >
          {{ $t('common.actions.load_more') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import Dropdown from '@/components/common/Dropdown.vue'
import DropdownItem from '@/components/common/DropdownItem.vue'
import FilterSortPanel from '@/components/common/FilterSortPanel.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import XIcon from '@/components/icons/XIcon.vue'
import GridIcon from '@/components/icons/GridIcon.vue'
import ListIcon from '@/components/icons/ListIcon.vue'
import GalleryIcon from '@/components/icons/GalleryIcon.vue'
import SortIcon from '@/components/icons/SortIcon.vue'
import FilterIcon from '@/components/icons/FilterIcon.vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import CheckIcon from '@/components/icons/CheckIcon.vue'

interface SortOption {
  value: string
  label: string
}

interface BulkAction {
  key: string
  label: string
  icon: any
  variant?: 'primary' | 'outline' | 'error'
  enabled: boolean
}

interface FilterTag {
  key: string
  label: string
}

interface Props {
  items: any[]
  entity: 'memory' | 'reminder' | 'blog'
  viewMode: 'grid' | 'list' | 'gallery'
  isLoading?: boolean
  hasMore?: boolean
  allowSelection?: boolean
  supportGallery?: boolean
  showCreateButton?: boolean
  searchPlaceholder?: string
  emptyIcon?: string
  emptyTitle?: string
  emptyDescription?: string
  createButtonText?: string
  sortOptions: SortOption[]
  currentSort: string
  filters: Record<string, any>
  bulkActions?: BulkAction[]
}

interface Emits {
  'update:view-mode': [mode: 'grid' | 'list' | 'gallery']
  'update:search': [query: string]
  'update:sort': [sort: string]
  'update:filters': [filters: Record<string, any>]
  'update:selection': [selectedIds: string[]]
  'item-click': [item: any]
  'bulk-action': [action: string, items: any[]]
  'load-more': []
  'create': []
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  hasMore: false,
  allowSelection: false,
  supportGallery: false,
  showCreateButton: true,
  searchPlaceholder: '',
  emptyIcon: '📭',
  emptyTitle: '',
  emptyDescription: '',
  createButtonText: '',
  bulkActions: () => []
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

// State
const searchQuery = ref('')
const showFilters = ref(false)
const selectedItems = ref<string[]>([])
const bulkActionLoading = ref<string | null>(null)

// Computed
const hasActiveFilters = computed(() => {
  return Object.values(props.filters).some(value => 
    value !== null && value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  )
})

const activeFiltersCount = computed(() => {
  return Object.values(props.filters).filter(value => 
    value !== null && value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length
})

const activeFilterTags = computed((): FilterTag[] => {
  const tags: FilterTag[] = []
  Object.entries(props.filters).forEach(([key, value]) => {
    if (value && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        tags.push({
          key,
          label: `${t(`common.filter.${key}`)}: ${value.join(', ')}`
        })
      } else if (!Array.isArray(value)) {
        tags.push({
          key,
          label: `${t(`common.filter.${key}`)}: ${value}`
        })
      }
    }
  })
  return tags
})

// Methods
const updateViewMode = (mode: 'grid' | 'list' | 'gallery') => {
  emit('update:view-mode', mode)
}

// Custom debounce function
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const debouncedSearch = (query: string) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    emit('update:search', query)
  }, 300)
}

const handleSearchInput = () => {
  debouncedSearch(searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('update:search', '')
}

const updateSort = (sort: string) => {
  emit('update:sort', sort)
}

const updateFilters = (newFilters: Record<string, any>) => {
  emit('update:filters', newFilters)
}

const clearFilters = () => {
  const clearedFilters = Object.keys(props.filters).reduce((acc, key) => {
    acc[key] = null
    return acc
  }, {} as Record<string, any>)
  emit('update:filters', clearedFilters)
}

const removeFilter = (filterKey: string) => {
  const newFilters = { ...props.filters }
  newFilters[filterKey] = null
  emit('update:filters', newFilters)
}

const toggleSelection = (itemId: string) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
  emit('update:selection', selectedItems.value)
}

const clearSelection = () => {
  selectedItems.value = []
  emit('update:selection', [])
}

const handleItemClick = (item: any) => {
  emit('item-click', item)
}

const handleBulkAction = async (actionKey: string) => {
  const selectedItemsData = props.items.filter(item => selectedItems.value.includes(item.id))
  bulkActionLoading.value = actionKey
  
  try {
    emit('bulk-action', actionKey, selectedItemsData)
  } finally {
    bulkActionLoading.value = null
  }
}
</script>

<style scoped>
.list-view {
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.search-section {
  flex: 1;
}

.search-input-wrapper {
  max-width: 400px;
}

.controls-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.view-controls {
  display: flex;
  align-items: center;
}

.view-toggle {
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 2px;
}

.view-button {
  min-width: 36px;
  height: 32px;
  padding: 0;
  margin: 0;
  border-radius: 6px;
}

.sort-controls,
.filter-button {
  flex-shrink: 0;
}

.filter-button.has-filters {
  border-color: #4caf50;
  color: #4caf50;
}

.filters-panel {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.active-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.filters-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bulk-actions-bar {
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1976d2;
  font-weight: 500;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-content {
  min-height: 400px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.empty-state p {
  color: #666;
  margin: 0 0 24px 0;
  font-size: 1.125rem;
}

.items-container {
  margin-bottom: 24px;
}

.items-container.view-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.items-container.view-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.items-container.view-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.item-wrapper {
  position: relative;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.item-wrapper.selected {
  outline: 2px solid #4caf50;
  outline-offset: 2px;
}

.item-selection {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
}

.selection-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #ccc;
  background: white;
  cursor: pointer;
}

.selection-checkbox:checked {
  background: #4caf50;
  border-color: #4caf50;
}

.item-content {
  cursor: pointer;
}

.load-more-section {
  text-align: center;
  padding: 24px;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

@media (max-width: 768px) {
  .list-header {
    gap: 12px;
  }

  .controls-section {
    flex-direction: column;
    align-items: stretch;
  }

  .view-controls,
  .sort-controls {
    justify-content: center;
  }

  .bulk-actions-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .bulk-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .items-container.view-grid {
    grid-template-columns: 1fr;
  }

  .items-container.view-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
