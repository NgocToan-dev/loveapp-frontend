<template>
  <div class="blog-stats grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <!-- Total Posts -->
    <div class="stat-card bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-blue-100 text-sm font-medium">{{ $t('blog.stats.totalPosts') }}</p>
          <p class="text-2xl font-bold">{{ stats?.totalPosts || 0 }}</p>
        </div>
        <div class="p-3 bg-blue-400/30 rounded-full">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>
      </div>
      <div class="mt-2">
        <span class="text-blue-100 text-xs">
          {{ $t('blog.stats.published') }}: {{ stats?.publishedPosts || 0 }}
        </span>
      </div>
    </div>

    <!-- Published Posts -->
    <div class="stat-card bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-green-100 text-sm font-medium">{{ $t('blog.stats.published') }}</p>
          <p class="text-2xl font-bold">{{ stats?.publishedPosts || 0 }}</p>
        </div>
        <div class="p-3 bg-green-400/30 rounded-full">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
          </svg>
        </div>
      </div>
      <div class="mt-2">
        <span class="text-green-100 text-xs">
          {{ $t('blog.stats.drafts') }}: {{ stats?.draftPosts || 0 }}
        </span>
      </div>
    </div>

    <!-- Total Views -->
    <div class="stat-card bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-purple-100 text-sm font-medium">{{ $t('blog.stats.totalViews') }}</p>
          <p class="text-2xl font-bold">{{ formatNumber(stats?.totalViews || 0) }}</p>
        </div>
        <div class="p-3 bg-purple-400/30 rounded-full">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
          </svg>
        </div>
      </div>
      <div class="mt-2">
        <span class="text-purple-100 text-xs">
          {{ $t('blog.stats.thisMonth') }}: {{ stats?.postsThisMonth || 0 }}
        </span>
      </div>
    </div>

    <!-- Total Likes -->
    <div class="stat-card bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-pink-100 text-sm font-medium">{{ $t('blog.stats.totalLikes') }}</p>
          <p class="text-2xl font-bold">{{ formatNumber(stats?.totalLikes || 0) }}</p>
        </div>
        <div class="p-3 bg-pink-400/30 rounded-full">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
          </svg>
        </div>
      </div>
      <div class="mt-2">
        <span class="text-pink-100 text-xs">
          {{ $t('blog.stats.avgLikes') }}: {{ averageLikes }}
        </span>
      </div>
    </div>
  </div>

  <!-- Popular Tags -->
  <div v-if="stats?.popularTags && stats.popularTags.length > 0" class="popular-tags bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('blog.stats.popularTags') }}</h3>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="tag in stats.popularTags.slice(0, 10)"
        :key="tag.tag"
        class="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg"
      >
        <span class="text-sm font-medium text-gray-700">#{{ tag.tag }}</span>
        <span class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{{ tag.count }}</span>
      </div>
    </div>
  </div>

  <!-- Recent Activity -->
  <div v-if="recentPosts && recentPosts.length > 0" class="recent-activity bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('blog.stats.recentActivity') }}</h3>
    <div class="space-y-3">
      <div
        v-for="post in recentPosts.slice(0, 5)"
        :key="post.id"
        class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 truncate max-w-xs">{{ post.title }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(post.createdAt) }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4 text-xs text-gray-500">
          <span class="flex items-center space-x-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
            </svg>
            <span>{{ post.likesCount }}</span>
          </span>
          <span class="flex items-center space-x-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
            </svg>
            <span>{{ post.views }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BlogPostStats, BlogPost } from '@/types'

interface Props {
  stats?: BlogPostStats | null
  recentPosts?: BlogPost[]
}

const props = defineProps<Props>()

const { t } = useI18n()

const averageLikes = computed(() => {
  if (!props.stats || !props.stats.totalPosts || !props.stats.totalLikes) return '0'
  return (props.stats.totalLikes / props.stats.totalPosts).toFixed(1)
})

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return t('blog.stats.today')
  } else if (days === 1) {
    return t('blog.stats.yesterday')
  } else if (days < 7) {
    return t('blog.stats.daysAgo', { days })
  } else {
    return date.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric'
    })
  }
}
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@media (max-width: 640px) {
  .blog-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .blog-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
