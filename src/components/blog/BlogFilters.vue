<template>
  <div class="blog-filters bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('blog.filters.search') }}
        </label>
        <div class="relative">
          <input
            type="text"
            v-model="localFilters.search"
            :placeholder="$t('blog.filters.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            @input="debouncedUpdateFilters"
          />
          <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Status Filter -->
      <div class="w-full lg:w-48">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('blog.filters.status') }}
        </label>
        <select
          v-model="localFilters.status"
          @change="updateFilters"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">{{ $t('blog.filters.allStatus') }}</option>
          <option value="published">{{ $t('blog.filters.published') }}</option>
          <option value="draft">{{ $t('blog.filters.draft') }}</option>
        </select>
      </div>

      <!-- Privacy Filter -->
      <div class="w-full lg:w-48">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('blog.filters.privacy') }}
        </label>
        <select
          v-model="localFilters.privacy"
          @change="updateFilters"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">{{ $t('blog.filters.allPrivacy') }}</option>
          <option value="public">{{ $t('blog.privacy.public') }}</option>
          <option value="couple">{{ $t('blog.privacy.couple') }}</option>
          <option value="private">{{ $t('blog.privacy.private') }}</option>
        </select>
      </div>

      <!-- Sort By -->
      <div class="w-full lg:w-48">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('blog.filters.sortBy') }}
        </label>
        <select
          v-model="localFilters.sortBy"
          @change="updateFilters"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="latest">{{ $t('blog.filters.latest') }}</option>
          <option value="oldest">{{ $t('blog.filters.oldest') }}</option>
          <option value="popular">{{ $t('blog.filters.popular') }}</option>
          <option value="views">{{ $t('blog.filters.mostViewed') }}</option>
        </select>
      </div>
    </div>

    <!-- Tags Filter -->
    <div v-if="availableTags.length > 0" class="mt-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ $t('blog.filters.tags') }}
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in availableTags"
          :key="tag"
          @click="toggleTag(tag)"
          class="px-3 py-1 text-sm rounded-full transition-colors"
          :class="isTagSelected(tag) 
            ? 'bg-primary-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          #{{ tag }}
        </button>
      </div>
    </div>

    <!-- Active Filters & Clear -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">{{ $t('blog.filters.activeFilters') }}:</span>
          
          <!-- Active search -->
          <span v-if="localFilters.search" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            "{{ localFilters.search }}"
          </span>
          
          <!-- Active status -->
          <span v-if="localFilters.status !== 'all'" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            {{ $t(`blog.filters.${localFilters.status}`) }}
          </span>
          
          <!-- Active privacy -->
          <span v-if="localFilters.privacy !== 'all'" class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            {{ $t(`blog.privacy.${localFilters.privacy}`) }}
          </span>
          
          <!-- Active tags -->
          <span 
            v-for="tag in localFilters.tags" 
            :key="tag"
            class="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
          >
            #{{ tag }}
          </span>
        </div>
        
        <button
          @click="clearAllFilters"
          class="text-sm text-gray-500 hover:text-red-500 font-medium"
        >
          {{ $t('blog.filters.clearAll') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlogPostFilters } from '@/types'

interface Props {
  filters: BlogPostFilters
  availableTags: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateFilters: [filters: Partial<BlogPostFilters>]
  clearFilters: []
}>()

const { t } = useI18n()

// Local filters for immediate UI updates
const localFilters = ref<BlogPostFilters>({ ...props.filters })

// Debounced search update
let searchTimeout: number | null = null

const debouncedUpdateFilters = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    updateFilters()
  }, 300) as unknown as number
}

const updateFilters = () => {
  emit('updateFilters', localFilters.value)
}

const toggleTag = (tag: string) => {
  const currentTags = localFilters.value.tags || []
  if (currentTags.includes(tag)) {
    localFilters.value.tags = currentTags.filter(t => t !== tag)
  } else {
    localFilters.value.tags = [...currentTags, tag]
  }
  updateFilters()
}

const isTagSelected = (tag: string) => {
  return localFilters.value.tags?.includes(tag) || false
}

const hasActiveFilters = computed(() => {
  return (
    localFilters.value.search !== '' ||
    localFilters.value.status !== 'all' ||
    localFilters.value.privacy !== 'all' ||
    (localFilters.value.tags && localFilters.value.tags.length > 0)
  )
})

const clearAllFilters = () => {
  localFilters.value = {
    search: '',
    tags: [],
    privacy: 'all',
    status: 'all',
    sortBy: 'latest'
  }
  emit('clearFilters')
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>

<style scoped>
/* Custom styles for better UX */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
