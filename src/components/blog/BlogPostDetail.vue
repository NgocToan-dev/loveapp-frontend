<template>
  <div class="blog-post-detail">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ post.title }}</h1>
            <div class="flex items-center space-x-4 mt-1">
              <div class="flex items-center space-x-2">
                <img
                  :src="post.author.avatarUrl || '/default-avatar.png'"
                  :alt="post.author.displayName"
                  class="w-6 h-6 rounded-full"
                />
                <span class="text-sm text-gray-600">{{ post.author.displayName }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</span>
              <span 
                class="px-2 py-1 text-xs rounded-full"
                :class="statusBadgeClass"
              >
                {{ statusLabel }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('like', post.id)"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
            :class="post.isLiked 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
          >
            <svg class="w-5 h-5" :fill="post.isLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{{ post.likesCount }}</span>
          </button>
          
          <button
            @click="$emit('edit', post)"
            class="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{{ $t('common.edit') }}</span>
          </button>
          
          <button
            @click="$emit('delete', post.id)"
            class="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>{{ $t('common.delete') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Cover Image -->
    <div v-if="post.coverImageUrl" class="w-full h-64 lg:h-80 overflow-hidden">
      <img 
        :src="post.coverImageUrl" 
        :alt="post.title"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Content -->
    <div class="p-6 lg:p-8">
      <!-- Tags -->
      <div v-if="post.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="px-3 py-1 bg-primary-50 text-primary-600 text-sm rounded-full font-medium"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Excerpt -->
      <div v-if="post.excerpt" class="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500">
        <p class="text-gray-700 italic">{{ post.excerpt }}</p>
      </div>

      <!-- Article Content -->
      <div class="prose prose-lg max-w-none">
        <div v-if="post.contentHtml" v-html="post.contentHtml"></div>
        <div v-else class="whitespace-pre-wrap">{{ post.content }}</div>
      </div>

      <!-- Meta Info -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex items-center space-x-6 text-sm text-gray-500">
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{{ post.views }} {{ $t('blog.views') }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ post.readingTime || estimatedReadingTime }} {{ $t('blog.readingTime') }}</span>
            </div>
            <div v-if="post.updatedAt !== post.createdAt">
              <span>{{ $t('blog.lastUpdated') }}: {{ formatDate(post.updatedAt) }}</span>
            </div>
          </div>
          
          <!-- Privacy Info -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">{{ $t('blog.privacy.label') }}:</span>
            <span 
              class="px-2 py-1 text-xs rounded-full text-white"
              :class="privacyBadgeClass"
            >
              {{ privacyLabel }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlogPost } from '@/types'

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  edit: [post: BlogPost]
  delete: [postId: string]
  like: [postId: string]
}>()

const { t } = useI18n()

const estimatedReadingTime = computed(() => {
  const wordsPerMinute = 200
  const wordCount = props.post.content.split(' ').length
  return Math.ceil(wordCount / wordsPerMinute)
})

const statusLabel = computed(() => {
  return props.post.status === 'published' 
    ? t('blog.status.published') 
    : t('blog.status.draft')
})

const statusBadgeClass = computed(() => {
  return props.post.status === 'published'
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800'
})

const privacyLabel = computed(() => {
  switch (props.post.privacy) {
    case 'public':
      return t('blog.privacy.public')
    case 'couple':
      return t('blog.privacy.couple')
    case 'private':
      return t('blog.privacy.private')
    default:
      return ''
  }
})

const privacyBadgeClass = computed(() => {
  switch (props.post.privacy) {
    case 'public':
      return 'bg-green-500'
    case 'couple':
      return 'bg-blue-500'
    case 'private':
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #111827;
  font-weight: 600;
  line-height: 1.25;
}

.prose h1 {
  font-size: 2.25rem;
  margin-top: 0;
  margin-bottom: 2rem;
}

.prose h2 {
  font-size: 1.875rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1.25rem;
}

.prose img {
  margin: 1.5rem 0;
  border-radius: 0.5rem;
  max-width: 100%;
  height: auto;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #6b7280;
}

.prose ul,
.prose ol {
  margin: 1.25rem 0;
  padding-left: 1.625rem;
}

.prose li {
  margin: 0.5rem 0;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose a:hover {
  color: #1d4ed8;
}
</style>
