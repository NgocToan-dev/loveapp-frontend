import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useNotifications } from './useNotifications'
import { useBlogStore } from '@/stores/blog'
import type { CreateBlogPostRequest, UpdateBlogPostRequest } from '@/types'

export function useBlog() {
  const { t } = useI18n()
  const { showSuccess, showError } = useNotifications()
  const blogStore = useBlogStore()

  // Return store properties using computed for reactivity
  const posts = computed(() => blogStore.posts)
  const isLoading = computed(() => blogStore.isLoading)
  const error = computed(() => blogStore.error)
  const selectedPost = computed(() => blogStore.selectedPost)
  const filteredPosts = computed(() => blogStore.filteredPosts)
  const publishedPosts = computed(() => blogStore.publishedPosts)
  const draftPosts = computed(() => blogStore.draftPosts)
  const postsCount = computed(() => blogStore.postsCount)

  // Wrapped actions with notifications
  const fetchPosts = async (page = 1, limit = 12) => {
    try {
      await blogStore.fetchPosts(page, limit)
    } catch (err: any) {
      showError(t('blog.errors.fetch_failed'), err.message)
      throw err
    }
  }

  const fetchPost = async (id: string) => {
    try {
      return await blogStore.fetchPostById(id)
    } catch (err: any) {
      showError(t('blog.errors.fetch_single_failed'), err.message)
      throw err
    }
  }

  const createPost = async (data: CreateBlogPostRequest) => {
    try {
      const newPost = await blogStore.createPost(data)
      showSuccess(t('blog.success.created'))
      return newPost
    } catch (err: any) {
      showError(t('blog.errors.create_failed'), err.message)
      throw err
    }
  }

  const updatePost = async (data: UpdateBlogPostRequest) => {
    try {
      const updatedPost = await blogStore.updatePost(data)
      showSuccess(t('blog.success.updated'))
      return updatedPost
    } catch (err: any) {
      showError(t('blog.errors.update_failed'), err.message)
      throw err
    }
  }

  const deletePost = async (id: string) => {
    try {
      await blogStore.deletePost(id)
      showSuccess(t('blog.success.deleted'))
    } catch (err: any) {
      showError(t('blog.errors.delete_failed'), err.message)
      throw err
    }
  }

  const publishPost = async (id: string) => {
    try {
      // Implementation will be added to store later
      const publishedPost = await blogStore.updatePost({ id, isPublished: true, publishedAt: new Date().toISOString() })
      showSuccess(t('blog.success.published'))
      return publishedPost
    } catch (err: any) {
      showError(t('blog.errors.publish_failed'), err.message)
      throw err
    }
  }

  const unpublishPost = async (id: string) => {
    try {
      // Implementation will be added to store later  
      const unpublishedPost = await blogStore.updatePost({ id, isPublished: false, publishedAt: undefined })
      showSuccess(t('blog.success.unpublished'))
      return unpublishedPost
    } catch (err: any) {
      showError(t('blog.errors.unpublish_failed'), err.message)
      throw err
    }
  }

  const searchPosts = async (query: string) => {
    try {
      // Basic client-side search for now - will enhance later
      return posts.value.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    } catch (err: any) {
      showError(t('blog.errors.search_failed'), err.message)
      throw err
    }
  }

  // Helper functions
  const hasPosts = () => {
    return Array.isArray(posts.value) && posts.value.length > 0
  }

  const clearError = () => {
    blogStore.clearError()
  }

  const clearSelectedPost = () => {
    blogStore.clearSelectedPost()
  }

  return {
    // State
    posts,
    isLoading,
    error,
    selectedPost,
    
    // Computed
    filteredPosts,
    publishedPosts,
    draftPosts,
    postsCount,
    
    // Actions
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    searchPosts,
    
    // Helpers
    hasPosts,
    clearError,
    clearSelectedPost
  }
}
