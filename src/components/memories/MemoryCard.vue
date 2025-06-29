<template>
  <div 
    :class="[
      'memory-card group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1',
      viewMode === 'list' ? 'flex items-start' : 'flex flex-col'
    ]"
  >
    <!-- Image Section -->
    <div 
      v-if="memory.images && memory.images.length > 0" 
      :class="[
        'relative overflow-hidden',
        viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'w-full h-56'
      ]"
    >
      <img 
        :src="memory.images[0]" 
        :alt="memory.title"
        :class="[
          'object-cover transition-transform duration-300 group-hover:scale-105',
          viewMode === 'list' ? 'w-full h-full rounded-l-2xl' : 'w-full h-full'
        ]"
      />
      
      <!-- Image Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Image Count Badge -->
      <div v-if="memory.images && memory.images.length > 1" 
           class="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
        {{ memory.images?.length || 0 }}
      </div>

      <!-- Favorite Heart -->
      <button
        v-if="memory.isFavorite"
        @click.stop="toggleFavorite"
        class="absolute top-3 left-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-red-500 hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Content Section -->
    <div :class="['flex-1', viewMode === 'list' ? 'p-6' : 'p-5']">
      <!-- Header with Title and Actions -->
      <div class="flex items-start justify-between mb-3">
        <h3 :class="[
          'font-bold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors',
          viewMode === 'list' ? 'text-xl' : 'text-lg'
        ]">
          {{ memory.title }}
        </h3>
        
        <!-- Actions Menu -->
        <div class="relative flex-shrink-0 ml-3">
          <button 
            @click="showMenu = !showMenu"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="showMenu" class="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
            <button 
              @click="toggleFavorite(); showMenu = false"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg class="w-4 h-4 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
              </svg>
              {{ memory.isFavorite ? $t('memories.actions.removeFavorite') : $t('memories.actions.addFavorite') }}
            </button>
            
            <button 
              @click="$emit('edit', memory); showMenu = false"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg class="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ $t('common.actions.edit') }}
            </button>
            
            <button 
              @click="$emit('delete', memory); showMenu = false"
              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {{ $t('common.actions.delete') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Date and Location -->
      <div class="flex items-center text-sm text-gray-500 mb-3 space-x-4">
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-1.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formatDate(memory.date) }}
        </div>
        
        <div v-if="memory.location" class="flex items-center">
          <svg class="w-4 h-4 mr-1.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ memory.location }}
        </div>

        <!-- Mood Badge -->
        <div v-if="memory.mood" class="flex items-center">
          <span class="text-base mr-1">{{ getMoodEmoji(memory.mood) }}</span>
          <span class="text-xs">{{ $t(`memories.moods.${memory.mood}`) }}</span>
        </div>
      </div>

      <!-- Content Preview -->
      <p :class="[
        'text-gray-600 mb-4 leading-relaxed',
        viewMode === 'list' ? 'line-clamp-2 text-sm' : 'line-clamp-3 text-sm'
      ]">
        {{ memory.description || memory.content }}
      </p>

      <!-- Tags -->
      <div v-if="memory.tags && memory.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in (memory.tags || []).slice(0, viewMode === 'list' ? 2 : 3)"
          :key="tag"
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
        >
          #{{ tag }}
        </span>
        <span 
          v-if="(memory.tags || []).length > (viewMode === 'list' ? 2 : 3)"
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
        >
          +{{ (memory.tags || []).length - (viewMode === 'list' ? 2 : 3) }}
        </span>
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100">
        <!-- Favorite Button -->
        <button
          @click="toggleFavorite"
          :class="[
            'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            memory.isFavorite 
              ? 'text-red-600 bg-red-50 hover:bg-red-100' 
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
          ]"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
          <span>{{ memory.isFavorite ? $t('memories.actions.favorited') : $t('memories.actions.favorite') }}</span>
        </button>

        <!-- Share Button -->
        <button class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>{{ $t('common.share') }}</span>
        </button>
      </div>
    </div>

    <!-- Click overlay for mobile -->
    <div 
      v-if="showMenu" 
      @click="showMenu = false"
      class="fixed inset-0 z-0 md:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemoriesStore, type Memory } from '@/stores/memories'
import { formatRelativeDate } from '@/utils/helpers'

interface Props {
  memory: Memory
  viewMode?: 'grid' | 'list'
}

interface Emits {
  edit: [memory: Memory]
  delete: [memory: Memory]
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid'
})

const emit = defineEmits<Emits>()

const { t } = useI18n()
const memoriesStore = useMemoriesStore()

// Component state
const showMenu = ref(false)

const formatDate = (date: string) => {
  return formatRelativeDate(date)
}

const getMoodEmoji = (mood: Memory['mood']) => {
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    love: '💕',
    excited: '🎉',
    peaceful: '🙏',
    romantic: '💖',
    grateful: '🙏',
    nostalgic: '💭'
  }
  return moodEmojis[mood || 'happy'] || '😊'
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
