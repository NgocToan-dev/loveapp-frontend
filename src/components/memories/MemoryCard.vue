<template>
  <div class="memory-card bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <!-- Image Gallery -->
    <div v-if="memory.images && memory.images.length > 0" class="relative">
      <div class="aspect-w-16 aspect-h-9">
        <img 
          :src="memory.images[0]" 
          :alt="memory.title"
          class="w-full h-48 object-cover"
        />
      </div>
      
      <!-- Image Count Badge -->
      <div v-if="memory.images && memory.images.length > 1" 
           class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
        <svg class="inline w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
        {{ memory.images.length }}
      </div>

      <!-- Favorite Badge -->
      <button
        v-if="memory.isFavorite"
        @click.stop="toggleFavorite"
        class="absolute top-2 left-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
          {{ memory.title }}
        </h3>
        
        <!-- Actions -->
        <Dropdown class="ml-2">
          <template #trigger>
            <button class="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </template>
          
          <DropdownItem @click="toggleFavorite">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            {{ memory.isFavorite ? $t('memories.actions.removeFavorite') : $t('memories.actions.addFavorite') }}
          </DropdownItem>
          
          <DropdownItem @click="$emit('edit', memory)">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {{ $t('common.actions.edit') }}
          </DropdownItem>
          
          <DropdownItem @click="$emit('delete', memory)" class="text-red-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ $t('common.actions.delete') }}
          </DropdownItem>
        </Dropdown>
      </div>

      <!-- Date and Location -->
      <div class="flex items-center text-sm text-gray-600 mb-2">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formatDate(memory.date) }}
        
        <span v-if="memory.location" class="ml-3 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ memory.location }}
        </span>
      </div>

      <!-- Content Preview -->
      <p class="text-gray-700 text-sm line-clamp-3 mb-3">
        {{ memory.content }}
      </p>

      <!-- Tags -->
      <div v-if="memory.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
        <Badge
          v-for="tag in memory.tags.slice(0, 3)"
          :key="tag"
          :label="tag"
          variant="secondary"
          size="sm"
        />
        <Badge
          v-if="memory.tags.length > 3"
          :label="`+${memory.tags.length - 3}`"
          variant="outline"
          size="sm"
        />
      </div>

      <!-- Mood and Privacy -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <!-- Mood -->
          <div v-if="memory.mood" class="flex items-center text-sm text-gray-600">
            <span class="mr-1">{{ getMoodEmoji(memory.mood) }}</span>
            <span class="capitalize">{{ $t(`memories.moods.${memory.mood}`) }}</span>
          </div>
        </div>

        <!-- Privacy Indicator -->
        <div class="flex items-center">
          <svg 
            v-if="memory.isPrivate" 
            class="w-4 h-4 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <svg 
            v-else 
            class="w-4 h-4 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMemoriesStore, type Memory } from '@/stores/memories'
import Dropdown from '@/components/common/Dropdown.vue'
import DropdownItem from '@/components/common/DropdownItem.vue'
import Badge from '@/components/common/Badge.vue'
import { formatRelativeDate } from '@/utils/helpers'

interface Props {
  memory: Memory
}

interface Emits {
  edit: [memory: Memory]
  delete: [memory: Memory]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const memoriesStore = useMemoriesStore()

const formatDate = (date: string) => {
  return formatRelativeDate(date)
}

const getMoodEmoji = (mood: Memory['mood']) => {
  const moodEmojis = {
    happy: '😊',
    love: '💕',
    excited: '🎉',
    romantic: '🌹',
    nostalgic: '😌',
    grateful: '🙏'
  } as const
  return mood ? moodEmojis[mood] || '😊' : '😊'
}

const toggleFavorite = async () => {
  try {
    await memoriesStore.toggleFavorite(props.memory.id)
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-w-16 {
  position: relative;
  padding-bottom: calc(9 / 16 * 100%);
}

.aspect-h-9 {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
