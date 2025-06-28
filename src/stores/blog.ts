import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { blogService } from '@/services/blog'
import type { 
  BlogPost, 
  CreateBlogPostRequest, 
  UpdateBlogPostRequest, 
  BlogPostFilters,
  BlogPostStats,
  BlogComment,
  CreateBlogCommentRequest
} from '@/types'

// Export types for component usage
export type { BlogPost } from '@/types'

export const useBlogStore = defineStore('blog', () => {
  // State
  const posts = ref<BlogPost[]>([])
  const selectedPost = ref<BlogPost | null>(null)
  const comments = ref<BlogComment[]>([])
  const stats = ref<BlogPostStats | null>(null)
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalPosts = ref(0)
  const pageSize = ref(12)
  
  // Filters
  const filters = ref<BlogPostFilters>({
    search: '',
    tags: [],
    privacy: 'all',
    status: 'all',
    sortBy: 'latest'
  })

  // Computed
  const filteredPosts = computed(() => {
    if (!posts.value || !Array.isArray(posts.value)) {
      return []
    }
    let filtered = [...posts.value]

    // Search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.excerpt?.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Tags filter
    if (filters.value.tags && filters.value.tags.length > 0) {
      filtered = filtered.filter(post =>
        filters.value.tags!.some((tag: string) => post.tags.includes(tag))
      )
    }

    // Status filter
    if (filters.value.status === 'published') {
      filtered = filtered.filter(post => post.status === 'published')
    } else if (filters.value.status === 'draft') {
      filtered = filtered.filter(post => post.status === 'draft')
    }

    // Privacy filter
    if (filters.value.privacy === 'public') {
      filtered = filtered.filter(post => post.privacy === 'public')
    } else if (filters.value.privacy === 'private') {
      filtered = filtered.filter(post => post.privacy === 'private')
    } else if (filters.value.privacy === 'couple') {
      filtered = filtered.filter(post => post.privacy === 'couple')
    }

    // Sort
    switch (filters.value.sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => b.likesCount - a.likesCount)
        break
      case 'views':
        filtered.sort((a, b) => b.views - a.views)
        break
    }

    return filtered
  })

  const publishedPosts = computed(() => {
    if (!posts.value || !Array.isArray(posts.value)) {
      return []
    }
    return posts.value.filter(post => post.status === 'published')
  })

  const draftPosts = computed(() => {
    if (!posts.value || !Array.isArray(posts.value)) {
      return []
    }
    return posts.value.filter(post => post.status === 'draft')
  })

  const publicPosts = computed(() => {
    if (!posts.value || !Array.isArray(posts.value)) {
      return []
    }
    return posts.value.filter(post => post.privacy === 'public' && post.status === 'published')
  })

  const postsCount = computed(() => {
    return Array.isArray(posts.value) ? posts.value.length : 0
  })

  const allTags = computed(() => {
    if (!posts.value || !Array.isArray(posts.value)) {
      return []
    }
    const tagSet = new Set<string>()
    posts.value.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  // Actions
  const fetchPosts = async (page = 1, limit = 12) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await blogService.getBlogPosts(page, limit, filters.value)
      
      if (page === 1) {
        posts.value = Array.isArray(response.data) ? response.data : []
      } else {
        if (Array.isArray(posts.value) && Array.isArray(response.data)) {
          posts.value.push(...response.data)
        } else {
          posts.value = Array.isArray(response.data) ? response.data : []
        }
      }
      
      totalPages.value = response.pagination.totalPages
      totalPosts.value = response.pagination.total
      currentPage.value = page
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tải blog posts'
      console.error('Error fetching blog posts:', err)
      // Ensure posts is always an array even on error
      posts.value = []
    } finally {
      isLoading.value = false
    }
  }

  const fetchPostById = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const post = await blogService.getBlogPost(id)
      selectedPost.value = post
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Không tìm thấy bài viết'
      console.error('Error fetching blog post:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createPost = async (data: CreateBlogPostRequest) => {
    isCreating.value = true
    error.value = null
    
    try {
      const newPost = await blogService.createBlogPost(data)
      if (Array.isArray(posts.value)) {
        posts.value.unshift(newPost)
      } else {
        posts.value = [newPost]
      }
      totalPosts.value++
      return newPost
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tạo bài viết'
      console.error('Error creating blog post:', err)
      throw err
    } finally {
      isCreating.value = false
    }
  }

  const updatePost = async (data: UpdateBlogPostRequest) => {
    isUpdating.value = true
    error.value = null
    
    try {
      const updatedPost = await blogService.updateBlogPost(data)
      if (Array.isArray(posts.value)) {
        const index = posts.value.findIndex(p => p.id === data.id)
        if (index !== -1) {
          posts.value[index] = updatedPost
        }
      }
      if (selectedPost.value?.id === data.id) {
        selectedPost.value = updatedPost
      }
      return updatedPost
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi cập nhật bài viết'
      console.error('Error updating blog post:', err)
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  const deletePost = async (id: string) => {
    isDeleting.value = true
    error.value = null
    
    try {
      await blogService.deleteBlogPost(id)
      if (Array.isArray(posts.value)) {
        posts.value = posts.value.filter(p => p.id !== id)
      }
      totalPosts.value--
      if (selectedPost.value?.id === id) {
        selectedPost.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi xóa bài viết'
      console.error('Error deleting blog post:', err)
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  const toggleLike = async (id: string) => {
    try {
      const result = await blogService.toggleLike(id)
      const post = posts.value.find(p => p.id === id)
      if (post) {
        post.isLiked = result.isLiked
        post.likesCount = result.likesCount
      }
      if (selectedPost.value?.id === id) {
        selectedPost.value.isLiked = result.isLiked
        selectedPost.value.likesCount = result.likesCount
      }
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi thích bài viết'
      console.error('Error toggling like:', err)
      throw err
    }
  }

  const fetchComments = async (postId: string) => {
    try {
      const commentList = await blogService.getComments(postId)
      comments.value = commentList
      return commentList
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tải bình luận'
      console.error('Error fetching comments:', err)
      throw err
    }
  }

  const addComment = async (postId: string, data: CreateBlogCommentRequest) => {
    try {
      const newComment = await blogService.addComment(postId, data)
      comments.value.push(newComment)
      return newComment
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi thêm bình luận'
      console.error('Error adding comment:', err)
      throw err
    }
  }

  const fetchStats = async () => {
    try {
      const blogStats = await blogService.getBlogStats()
      stats.value = blogStats
      return blogStats
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tải thống kê'
      console.error('Error fetching stats:', err)
      throw err
    }
  }

  const updateFilters = (newFilters: Partial<BlogPostFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      tags: [],
      privacy: 'all',
      status: 'all',
      sortBy: 'latest'
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearSelectedPost = () => {
    selectedPost.value = null
  }

  return {
    // State
    posts,
    selectedPost,
    comments,
    stats,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    currentPage,
    totalPages,
    totalPosts,
    pageSize,
    filters,
    
    // Computed
    filteredPosts,
    publishedPosts,
    draftPosts,
    publicPosts,
    postsCount,
    allTags,
    
    // Actions
    fetchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    fetchComments,
    addComment,
    fetchStats,
    updateFilters,
    clearFilters,
    clearError,
    clearSelectedPost
  }
})
