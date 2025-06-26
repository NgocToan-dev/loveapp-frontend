<template>
  <article class="blog-post-card bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <!-- Cover Image -->
    <div v-if="post.coverImage" class="relative">
      <img 
        :src="post.coverImage" 
        :alt="post.title"
        class="w-full h-48 object-cover"
      />
      
      <!-- Reading Time Badge -->
      <div class="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
        {{ readingTime }} {{ $t('blog.readingTime') }}
      </div>

      <!-- Published Status -->
      <div 
        v-if="!post.isPublished"
        class="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        {{ $t('blog.status.draft') }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Meta Info -->
      <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div class="flex items-center space-x-3">
          <!-- Date -->
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(post.createdAt) }}
          </span>

          <!-- Author -->
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ post.author }}
          </span>
        </div>

        <!-- Actions -->
        <Dropdown>
          <template #trigger>
            <button class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </template>
          
          <DropdownItem @click="$emit('view', post)">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ $t('blog.actions.view') }}
          </DropdownItem>
          
          <DropdownItem @click="$emit('edit', post)">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {{ $t('blog.actions.edit') }}
          </DropdownItem>

          <DropdownItem 
            v-if="!post.isPublished"
            @click="$emit('publish', post)"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {{ $t('blog.actions.publish') }}
          </DropdownItem>

          <DropdownItem 
            v-else
            @click="$emit('unpublish', post)"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 18M5.636 5.636L6 6" />
            </svg>
            {{ $t('blog.actions.unpublish') }}
          </DropdownItem>
          
          <DropdownItem @click="$emit('delete', post)" class="text-red-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ $t('blog.actions.delete') }}
          </DropdownItem>
        </Dropdown>
      </div>

      <!-- Title -->
      <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-pink-600 transition-colors cursor-pointer"
          @click="$emit('view', post)">
        {{ post.title }}
      </h2>

      <!-- Excerpt -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>

      <!-- Tags -->
      <div v-if="post.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <Badge
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          :label="tag"
          variant="secondary"
          size="sm"
        />
        <Badge
          v-if="post.tags.length > 3"
          :label="`+${post.tags.length - 3}`"
          variant="outline"
          size="sm"
        />
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <!-- Engagement Stats -->
        <div class="flex items-center space-x-4 text-sm text-gray-500">
          <!-- Views -->
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ post.views || 0 }}
          </span>

          <!-- Likes -->
          <button 
            @click="$emit('toggleLike', post)"
            class="flex items-center hover:text-pink-600 transition-colors"
          >
            <svg 
              class="w-4 h-4 mr-1" 
              :class="post.isLiked ? 'fill-current text-pink-600' : ''"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {{ post.likesCount || 0 }}
          </button>
        </div>

        <!-- Privacy Indicator -->
        <div class="flex items-center">
          <svg 
            v-if="post.isPrivate" 
            class="w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            :title="$t('blog.privacy.private')"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <svg 
            v-else-if="post.isPublished" 
            class="w-4 h-4 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            :title="$t('blog.privacy.public')"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlogPost } from '@/stores/blog'
import Dropdown from '@/components/common/Dropdown.vue'
import DropdownItem from '@/components/common/DropdownItem.vue'
import Badge from '@/components/common/Badge.vue'
import { formatRelativeDate } from '@/utils/helpers'

interface Props {
  post: BlogPost
}

interface Emits {
  view: [post: BlogPost]
  edit: [post: BlogPost]
  delete: [post: BlogPost]
  publish: [post: BlogPost]
  unpublish: [post: BlogPost]
  toggleLike: [post: BlogPost]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

// Computed
const readingTime = computed(() => {
  // Estimate reading time (average 200 words per minute)
  const wordsPerMinute = 200
  const wordCount = props.post.content.split(' ').length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min`
})

const formatDate = (date: string) => {
  return formatRelativeDate(date)
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
</style>
