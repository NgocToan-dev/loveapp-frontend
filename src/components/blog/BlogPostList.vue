<template>
  <div class="blog-post-list">
    <!-- Loading State -->
    <div v-if="isLoading && posts.length === 0" class="loading-state">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-gray-200 rounded-lg h-48 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Posts Grid -->
    <div v-else-if="posts.length > 0" class="posts-grid">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogPostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @click="$emit('selectPost', post)"
          @like="$emit('toggleLike', post.id)"
          @edit="$emit('editPost', post)"
          @delete="$emit('deletePost', post.id)"
        />
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="text-center mt-8">
        <button
          @click="$emit('loadMore')"
          :disabled="isLoading"
          class="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <span v-if="isLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ $t('common.loading') }}
          </span>
          <span v-else>{{ $t('blog.loadMore') }}</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state text-center py-16">
      <div class="text-6xl mb-6">📝</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        {{ $t('blog.noPosts') }}
      </h3>
      <p class="text-gray-600 mb-6">
        {{ $t('blog.noPostsDescription') }}
      </p>
      <button
        @click="$emit('createPost')"
        class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        {{ $t('blog.createFirst') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import BlogPostCard from './BlogPostCard.vue'
import type { BlogPostEntity } from '@/types/model/blog/BlogPostEntity'

interface Props {
  posts: BlogPostEntity[]
  isLoading?: boolean
  hasMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  hasMore: false
})

const emit = defineEmits<{
  selectPost: [post: BlogPostEntity]
  toggleLike: [postId: string]
  editPost: [post: BlogPostEntity]
  deletePost: [postId: string]
  createPost: []
  loadMore: []
}>()

const { t } = useI18n()
</script>

<style scoped>
.loading-state {
  margin-bottom: 2rem;
}

.posts-grid {
  min-height: 200px;
}

.empty-state {
  padding: 4rem 1rem;
}

@media (max-width: 640px) {
  .posts-grid .grid {
    grid-template-columns: 1fr;
  }
}
</style>
