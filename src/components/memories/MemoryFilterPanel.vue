<template>
  <div class="memory-filter-panel">
    <!-- Search -->
    <StatsWidget 
      :title="$t('memories.search')"
      icon="mdi-magnify"
      class="mb-4"
    >
      <v-text-field
        v-model="localSearchText"
        :placeholder="$t('memories.gallery.filters.search')"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        prepend-inner-icon="mdi-magnify"
        @update:model-value="updateSearch"
      />
    </StatsWidget>

    <!-- Filters -->
    <StatsWidget 
      :title="$t('common.filters')"
      icon="mdi-filter-variant"
      class="mb-4"
    >
      <div class="filter-section">
        <!-- Memory Type Filter -->
        <v-select
          v-model="localSelectedType"
          :items="memoryTypes"
          :label="$t('memories.gallery.filters.type')"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          class="mb-3"
          @update:model-value="updateType"
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

        <!-- Year Filter -->
        <v-select
          v-model="localSelectedYear"
          :items="yearOptions"
          :label="$t('memories.gallery.filters.year')"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          class="mb-3"
          @update:model-value="updateYear"
        />

        <!-- Quick Filters -->
        <div class="quick-filters">
          <h4 class="text-subtitle-2 mb-2">{{ $t('common.quickFilters') }}</h4>
          <div class="d-flex flex-wrap gap-2">
            <v-chip
              :color="showFavorites ? 'primary' : 'default'"
              :variant="showFavorites ? 'elevated' : 'outlined'"
              size="small"
              clickable
              @click="toggleFavorites"
            >
              <v-icon start icon="mdi-heart" />
              {{ $t('memories.favorites') }}
            </v-chip>
            
            <v-chip
              :color="showWithPhotos ? 'primary' : 'default'"
              :variant="showWithPhotos ? 'elevated' : 'outlined'"
              size="small"
              clickable
              @click="toggleWithPhotos"
            >
              <v-icon start icon="mdi-image" />
              {{ $t('memories.photos') }}
            </v-chip>

            <v-chip
              :color="showRecent ? 'primary' : 'default'"
              :variant="showRecent ? 'elevated' : 'outlined'"
              size="small"
              clickable
              @click="toggleRecent"
            >
              <v-icon start icon="mdi-clock" />
              {{ $t('common.recent') }}
            </v-chip>
          </div>
        </div>
      </div>
    </StatsWidget>

    <!-- Sort Options -->
    <StatsWidget 
      :title="$t('memories.sortBy')"
      icon="mdi-sort"
      class="mb-4"
    >
      <v-select
        v-model="localSortBy"
        :items="sortOptions"
        density="compact"
        variant="outlined"
        hide-details
        @update:model-value="updateSortBy"
      />
    </StatsWidget>

    <!-- Clear All Filters -->
    <div class="filter-actions">
      <v-btn
        color="error"
        variant="outlined"
        size="small"
        block
        prepend-icon="mdi-filter-remove"
        @click="clearAllFilters"
      >
        {{ $t('common.clearFilters') }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import StatsWidget from '@/components/ui/StatsWidget.vue'
import type { Memory } from '@/types'

interface Props {
  memories: Memory[]
  searchText?: string
  selectedType?: string | null
  selectedYear?: number | null
  sortBy?: string
}

const props = withDefaults(defineProps<Props>(), {
  memories: () => [],
  searchText: '',
  selectedType: null,
  selectedYear: null,
  sortBy: 'newest'
})

const emit = defineEmits<{
  'update:searchText': [value: string]
  'update:selectedType': [value: string | null]
  'update:selectedYear': [value: number | null]
  'update:sortBy': [value: string]
  'update:filters': [filters: {
    favorites?: boolean
    withPhotos?: boolean
    recent?: boolean
  }]
}>()

const { t } = useI18n()

// Local reactive state
const localSearchText = ref(props.searchText)
const localSelectedType = ref(props.selectedType)
const localSelectedYear = ref(props.selectedYear)
const localSortBy = ref(props.sortBy)

// Quick filter states
const showFavorites = ref(false)
const showWithPhotos = ref(false)
const showRecent = ref(false)

// Memory types for filter
const memoryTypes = computed(() => [
  { title: t('memories.gallery.types.first-meet'), value: 'first-meet', icon: 'mdi-heart-flash', color: 'pink' },
  { title: t('memories.gallery.types.date'), value: 'date', icon: 'mdi-heart', color: 'purple' },
  { title: t('memories.gallery.types.travel'), value: 'travel', icon: 'mdi-airplane-takeoff', color: 'indigo' },
  { title: t('memories.gallery.types.milestone'), value: 'milestone', icon: 'mdi-trophy', color: 'success' },
  { title: t('memories.gallery.types.celebration'), value: 'celebration', icon: 'mdi-party-popper', color: 'orange' },
  { title: t('memories.gallery.types.general'), value: 'general', icon: 'mdi-camera', color: 'primary' }
])

// Year options
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

// Sort options
const sortOptions = computed(() => [
  { title: t('memories.newestFirst'), value: 'newest' },
  { title: t('memories.oldestFirst'), value: 'oldest' },
  { title: t('memories.titleAZ'), value: 'title' },
  { title: t('memories.favorites'), value: 'favorites' }
])

// Update methods
const updateSearch = (value: string) => {
  emit('update:searchText', value)
}

const updateType = (value: string | null) => {
  emit('update:selectedType', value)
}

const updateYear = (value: number | null) => {
  emit('update:selectedYear', value)
}

const updateSortBy = (value: string) => {
  emit('update:sortBy', value)
}

// Quick filter toggles
const toggleFavorites = () => {
  showFavorites.value = !showFavorites.value
  emitFilters()
}

const toggleWithPhotos = () => {
  showWithPhotos.value = !showWithPhotos.value
  emitFilters()
}

const toggleRecent = () => {
  showRecent.value = !showRecent.value
  emitFilters()
}

const emitFilters = () => {
  emit('update:filters', {
    favorites: showFavorites.value,
    withPhotos: showWithPhotos.value,
    recent: showRecent.value
  })
}

const clearAllFilters = () => {
  localSearchText.value = ''
  localSelectedType.value = null
  localSelectedYear.value = null
  localSortBy.value = 'newest'
  showFavorites.value = false
  showWithPhotos.value = false
  showRecent.value = false
  
  emit('update:searchText', '')
  emit('update:selectedType', null)
  emit('update:selectedYear', null)
  emit('update:sortBy', 'newest')
  emitFilters()
}

// Watch for prop changes
watch(() => props.searchText, (newValue) => {
  localSearchText.value = newValue
})

watch(() => props.selectedType, (newValue) => {
  localSelectedType.value = newValue
})

watch(() => props.selectedYear, (newValue) => {
  localSelectedYear.value = newValue
})

watch(() => props.sortBy, (newValue) => {
  localSortBy.value = newValue
})
</script>

<style scoped>
.memory-filter-panel {
  display: flex;
  flex-direction: column;
}

.filter-section {
  display: flex;
  flex-direction: column;
}

.quick-filters {
  padding-top: 8px;
  border-top: 1px solid rgba(var(--v-theme-outline), 0.2);
}

.filter-actions {
  margin-top: 16px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .memory-filter-panel {
    gap: 12px;
  }
  
  .quick-filters .d-flex {
    gap: 8px;
  }
}
</style>
