<template>
  <AppLayout>
    <div class="blog-page min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-gray-800">
      <div class="container mx-auto px-4 py-8">
        <!-- Page Header -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div class="mb-4 lg:mb-0">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-spring-green bg-clip-text mb-2">
              {{ isEditMode ? $t('blog.form.editTitle') : $t('blog.title') }}
            </h1>
            <p class="text-gray-600">{{ $t('blog.subtitle') }}</p>
          </div>
          <Button 
            v-if="!isEditMode"
            variant="primary" 
            size="md" 
            class="flex items-center space-x-2" 
            @click="showCreateForm = true"
          >
            <template #icon>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </template>
            {{ $t('blog.createPost') }}
          </Button>
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

        <!-- Error Display -->
        <div v-if="error" class="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ error }}</span>
            <Button variant="ghost-link" size="xs" class="ml-4 text-red-700 hover:text-red-900" @click="clearErrorAction">
              <template #icon>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </template>
            </Button>
          </div>
        </div>

        <!-- thêm modal tạo bài viết -->
        <BlogPostForm
          v-if="showCreateForm"
          :is-open="showCreateForm"
          :is-edit-mode="!!editingPost"
          :post="editingPost"
          @close="closeCreateForm"
          @success="handleCreateSuccess"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlogStore } from '@/stores/blog'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'

import AppLayout from '@/components/layout/AppLayout.vue'
import BlogStats from '@/components/blog/BlogStats.vue'
import BlogFilters from '@/components/blog/BlogFilters.vue'
import BlogPostList from '@/components/blog/BlogPostList.vue'
import BlogPostForm from '@/components/blog/BlogPostForm.vue'
// Common form components
import Button from '@/components/common/Button.vue'
import type { BlogPostEntity } from '@/types/model/blog/BlogPostEntity'

const { t } = useI18n()
const userStore = useUserStore()
const { isAuthenticated } = userStore

const blogStore = useBlogStore()
const router = useRouter()
const route = useRoute()

// Reactive references from store - options API pattern
const posts = computed(() => blogStore.posts)
const stats = computed(() => blogStore.stats)
const isLoading = computed(() => blogStore.isLoading)
const error = computed(() => blogStore.error)
const currentPage = computed(() => blogStore.currentPage)
const totalPages = computed(() => blogStore.totalPages)
const filters = computed(() => blogStore.filters)
const filteredPosts = computed(() => blogStore.filteredPosts)
const allTags = computed(() => blogStore.allTags)

// Store actions
const fetchPostsAction = blogStore.fetchPosts
const fetchStatsAction = blogStore.fetchStats
const createPostAction = blogStore.createPost
const updatePostAction = blogStore.updatePost
const deletePostAction = blogStore.deletePost
const toggleLikeAction = blogStore.toggleLike
const updateFiltersAction = blogStore.updateFilters
const clearFiltersAction = blogStore.clearFilters
const clearErrorAction = blogStore.clearError
const fetchPostByIdAction = blogStore.fetchPostById

// Local state
const showCreateForm = ref(false)
const editingPost = ref<BlogPostEntity | null>(null)

// Computed
const isEditMode = computed(() => {
  return route.name === 'blog-edit' && !!route.params.id
})

const postId = computed(() => {
  return route.params.id as string
})

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
  return posts.value.slice(0, 5)
})
// Validation rules for Vuetify form fields
const titleRules = computed(() => [
  (v: string) => !!v || t('validation.required'),
  (v: string) => (v && v.length >= 3) || t('validation.minLength', { min: 3 })
])
const contentRules = computed(() => [
  (v: string) => !!v || t('validation.required')
])

// Methods
const handleSelectPost = (post: BlogPostEntity) => {
  router.push({ name: 'blog-detail', params: { id: post.id } })
}

const handleEditPost = (post: BlogPostEntity) => {
  editingPost.value = post
  router.push({ name: 'blog-edit', params: { id: post.id } })
}

const handleDeletePost = async (postId: string) => {
  if (confirm(t('blog.confirmDelete'))) {
    await deletePostAction(postId)
  }
}

const handleToggleLike = async (postId: string) => {
  await toggleLikeAction(postId)
}

const closeCreateForm = () => {
  showCreateForm.value = false
  const wasEditing = editingPost.value
  editingPost.value = null
  // Reset form
  formData.value = {
    title: '',
    content: '',
    privacy: 'couple',
    status: 'draft'
  }
  tagsInput.value = ''
  
  // If we were editing, redirect back to blog list
  if (wasEditing && isEditMode.value) {
    router.push('/blog')
  }
}

const loadMorePosts = async () => {
  await fetchPostsAction(currentPage.value + 1)
}

const updateFilters = (newFilters: any) => {
  updateFiltersAction(newFilters)
}

const clearFilters = () => {
  clearFiltersAction()
}

// Lifecycle
onMounted(async () => {
  // Always fetch posts (public content)
  await fetchPostsAction()
  
  // Only fetch stats if user is authenticated (personal stats)
  if (isAuthenticated) {
    try {
      await fetchStatsAction()
    } catch (error) {
      console.error('Error fetching blog stats:', error)
      // Don't throw error here as stats are optional
    }
  }

  // If in edit mode, load the post and show edit form
  if (isEditMode.value && postId.value) {
    try {
      await fetchPostByIdAction(postId.value)
      const selectedPost = blogStore.selectedPost
      if (selectedPost) {
        editingPost.value = selectedPost
        // Populate form with post data
        formData.value = {
          title: selectedPost.title || '',
          content: selectedPost.content || '',
          privacy: (selectedPost.privacy as any) || 'couple',
          status: (selectedPost.status as any) || 'draft'
        }
        tagsInput.value = selectedPost.tags?.join(', ') || ''
        showCreateForm.value = true
      }
    } catch (error) {
      console.error('Error loading post for edit:', error)
      // Redirect back to blog list if post not found
      router.push('/blog')
    }
  }
})

// Watch for route changes to handle edit mode
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (isEditMode.value && newId && newId !== oldId) {
      try {
        await fetchPostByIdAction(newId as string)
        const selectedPost = blogStore.selectedPost
        if (selectedPost) {
          editingPost.value = selectedPost
          // Populate form with post data
          formData.value = {
            title: selectedPost.title || '',
            content: selectedPost.content || '',
            privacy: (selectedPost.privacy as any) || 'couple',
            status: (selectedPost.status as any) || 'draft'
          }
          tagsInput.value = selectedPost.tags?.join(', ') || ''
          showCreateForm.value = true
        }
      } catch (error) {
        console.error('Error loading post for edit:', error)
        router.push('/blog')
      }
    }
  }
)

// Đóng form tạo bài viết và làm mới danh sách posts
const handleCreateSuccess = async () => {
  showCreateForm.value = false
  await fetchPostsAction(1)
}
</script>
