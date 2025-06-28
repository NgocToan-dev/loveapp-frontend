<template>
  <AppLayout>
    <div class="blog-page min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div class="container mx-auto px-4 py-8">
        <!-- Page Header -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div class="mb-4 lg:mb-0">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-spring-green bg-clip-text text-transparent mb-2">
              {{ $t('blog.title') }}
            </h1>
            <p class="text-gray-600">{{ $t('blog.subtitle') }}</p>
          </div>
          <button 
            v-if="isAuthenticated"
            class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors"
            @click="showCreateForm = true"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>{{ $t('blog.createPost') }}</span>
          </button>
        </div>

        <!-- Statistics (only show for authenticated users) -->
        <BlogStats 
          v-if="isAuthenticated"
          :stats="stats" 
          :recent-posts="recentPosts"
        />
        
        <!-- Message for non-authenticated users -->
        <div 
          v-else
          class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8"
        >
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-blue-900">{{ $t('blog.loginPrompt.title') }}</h3>
              <p class="text-blue-700">{{ $t('blog.loginPrompt.message') }}</p>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <BlogFilters
          :filters="filters"
          :available-tags="allTags"
          @update-filters="updateFilters"
          @clear-filters="clearFilters"
        />

        <!-- Loading State -->
        <div v-if="isLoading && posts.length === 0" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p class="mt-4 text-gray-600">{{ $t('common.loading') }}</p>
        </div>

        <!-- Posts List -->
        <BlogPostList
          v-else
          :posts="filteredPosts"
          :is-loading="isLoading"
          :has-more="currentPage < totalPages"
          @select-post="handleSelectPost"
          @toggle-like="handleToggleLike"
          @edit-post="handleEditPost"
          @delete-post="handleDeletePost"
          @create-post="showCreateForm = true"
          @load-more="loadMorePosts"
        />

        <!-- Create/Edit Modal -->
        <div v-if="showCreateForm" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Backdrop -->
            <div 
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              @click="closeCreateForm"
            ></div>

            <!-- Modal -->
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div class="bg-white px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ editingPost ? $t('blog.editPost') : $t('blog.createPost') }}
                  </h3>
                  <button
                    @click="closeCreateForm"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="bg-white px-6 py-4">
                <div class="space-y-6">
                  <!-- Simple form for now - will enhance later -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('blog.form.title') }}</label>
                    <input
                      v-model="formData.title"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      :placeholder="$t('blog.form.titlePlaceholder')"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('blog.form.content') }}</label>
                    <textarea
                      v-model="formData.content"
                      rows="10"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      :placeholder="$t('blog.form.contentPlaceholder')"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('blog.form.tags') }}</label>
                    <input
                      v-model="tagsInput"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      :placeholder="$t('blog.form.tagsPlaceholder')"
                    />
                    <p class="text-xs text-gray-500 mt-1">{{ $t('blog.form.tagsHelp') }}</p>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('blog.form.privacy') }}</label>
                      <select 
                        v-model="formData.privacy"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="private">{{ $t('blog.privacy.private') }}</option>
                        <option value="couple">{{ $t('blog.privacy.couple') }}</option>
                        <option value="public">{{ $t('blog.privacy.public') }}</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('blog.form.status') }}</label>
                      <select 
                        v-model="formData.status"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="draft">{{ $t('blog.status.draft') }}</option>
                        <option value="published">{{ $t('blog.status.published') }}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      @click="closeCreateForm"
                      class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {{ $t('common.cancel') }}
                    </button>
                    <button
                      type="submit"
                      @click="handleQuickSubmit"
                      :disabled="isCreating || isUpdating || !formData.title || !formData.content"
                      class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-400"
                    >
                      {{ isCreating || isUpdating ? $t('common.saving') : $t('common.save') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Post Detail Modal -->
        <div v-if="selectedPost" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Backdrop -->
            <div 
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              @click="selectedPost = null"
            ></div>

            <!-- Modal -->
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <BlogPostDetail
                :post="selectedPost"
                @close="selectedPost = null"
                @edit="handleEditPost"
                @delete="handleDeletePost"
                @like="handleToggleLike"
              />
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ error }}</span>
            <button @click="clearError" class="ml-4 text-red-700 hover:text-red-900">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlogStore } from '@/stores/blog'
import { useUserStore } from '@/stores/user'
import type { BlogPost, CreateBlogPostRequest, UpdateBlogPostRequest } from '@/types'

import AppLayout from '@/components/layout/AppLayout.vue'
import BlogStats from '@/components/blog/BlogStats.vue'
import BlogFilters from '@/components/blog/BlogFilters.vue'
import BlogPostList from '@/components/blog/BlogPostList.vue'
import BlogPostDetail from '@/components/blog/BlogPostDetail.vue'

const { t } = useI18n()
const userStore = useUserStore()
const { isAuthenticated } = userStore

const blogStore = useBlogStore()

// Reactive references from store
const {
  posts,
  selectedPost: storeSelectedPost,
  stats,
  isLoading,
  isCreating,
  isUpdating,
  error,
  currentPage,
  totalPages,
  filters,
  filteredPosts,
  allTags,
  fetchPosts,
  fetchStats,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  updateFilters: storeUpdateFilters,
  clearFilters: storeClearFilters,
  clearError
} = blogStore

// Local state
const showCreateForm = ref(false)
const editingPost = ref<BlogPost | null>(null)
const selectedPost = ref<BlogPost | null>(null)

// Form data
const formData = ref({
  title: '',
  content: '',
  privacy: 'couple' as 'private' | 'couple' | 'public',
  status: 'draft' as 'draft' | 'published'
})

const tagsInput = ref('')

// Computed
const recentPosts = computed(() => {
  return posts.slice(0, 5)
})

// Methods
const handleSelectPost = (post: BlogPost) => {
  selectedPost.value = post
}

const handleEditPost = (post: BlogPost) => {
  editingPost.value = post
  showCreateForm.value = true
  selectedPost.value = null
}

const handleDeletePost = async (postId: string) => {
  if (confirm(t('blog.confirmDelete'))) {
    await deletePost(postId)
    selectedPost.value = null
  }
}

const handleToggleLike = async (postId: string) => {
  await toggleLike(postId)
}

const handleFormSubmit = async (data: CreateBlogPostRequest | UpdateBlogPostRequest) => {
  try {
    if (editingPost.value) {
      await updatePost(data as UpdateBlogPostRequest)
    } else {
      await createPost(data as CreateBlogPostRequest)
    }
    closeCreateForm()
    // Only fetch stats if user is authenticated
    if (isAuthenticated) {
      await fetchStats()
    }
  } catch (err) {
    // Error handled in store
  }
}

const closeCreateForm = () => {
  showCreateForm.value = false
  editingPost.value = null
  // Reset form
  formData.value = {
    title: '',
    content: '',
    privacy: 'couple',
    status: 'draft'
  }
  tagsInput.value = ''
}

const handleQuickSubmit = async () => {
  const tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)

  const postData: CreateBlogPostRequest | UpdateBlogPostRequest = {
    title: formData.value.title,
    content: formData.value.content,
    contentHtml: `<p>${formData.value.content.replace(/\n/g, '</p><p>')}</p>`,
    tags,
    privacy: formData.value.privacy,
    status: formData.value.status,
    excerpt: formData.value.content.substring(0, 150) + (formData.value.content.length > 150 ? '...' : '')
  }

  if (editingPost.value) {
    await updatePost({ ...postData, id: editingPost.value.id } as UpdateBlogPostRequest)
  } else {
    await createPost(postData as CreateBlogPostRequest)
  }
  
  closeCreateForm()
  // Only fetch stats if user is authenticated
  if (isAuthenticated) {
    await fetchStats()
  }
}

const loadMorePosts = async () => {
  await fetchPosts(currentPage + 1)
}

const updateFilters = (newFilters: any) => {
  storeUpdateFilters(newFilters)
}

const clearFilters = () => {
  storeClearFilters()
}

// Lifecycle
onMounted(async () => {
  // Always fetch posts (public content)
  await fetchPosts()
  
  // Only fetch stats if user is authenticated (personal stats)
  if (isAuthenticated) {
    try {
      await fetchStats()
    } catch (error) {
      console.error('Error fetching blog stats:', error)
      // Don't throw error here as stats are optional
    }
  }
})
</script>
