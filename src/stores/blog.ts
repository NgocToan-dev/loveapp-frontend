import { BlogPostEntity } from '@/types/model/blog/BlogPostEntity';
import { defineStore } from 'pinia'
import { blogService } from '@/services/blog'
import { PrivacyEnum, StatusEnum } from '@/utils/enum'
import type { 
  CreateBlogPostRequest, 
  UpdateBlogPostRequest, 
  BlogPostFilters,
  BlogPostStats,
  BlogComment,
  CreateBlogCommentRequest
} from '@/types'

// Export types for component usage

export const useBlogStore = defineStore('blog', {
  state: () => ({
    // State
    posts: [] as BlogPostEntity[],
    selectedPost: null as BlogPostEntity | null,
    comments: [] as BlogComment[],
    stats: null as BlogPostStats | null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null as string | null,
    
    // Pagination
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    pageSize: 12,
    
    // Filters
    filters: {
      search: '',
      tags: [],
      privacy: 'all',
      status: 'all',
      sortBy: 'latest'
    } as BlogPostFilters
  }),

  getters: {
    filteredPosts: (state) => {
      if (!state.posts || !Array.isArray(state.posts)) {
        return []
      }
      let filtered = [...state.posts]

      // Search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase()
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.excerpt?.toLowerCase().includes(searchTerm) ||
          post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        )
      }

      // Tags filter
      if (state.filters.tags && state.filters.tags.length > 0) {
        filtered = filtered.filter(post =>
          state.filters.tags!.some((tag: string) => post.tags.includes(tag))
        )
      }

      // Status filter
      if (state.filters.status === StatusEnum.published) {
        filtered = filtered.filter(post => post.status === StatusEnum.published)
      } else if (state.filters.status === StatusEnum.draft) {
        filtered = filtered.filter(post => post.status === StatusEnum.draft)
      }

      // Privacy filter
      if (state.filters.privacy === PrivacyEnum.public) {
        filtered = filtered.filter(post => post.privacy === PrivacyEnum.public)
      } else if (state.filters.privacy === PrivacyEnum.private) {
        filtered = filtered.filter(post => post.privacy === PrivacyEnum.private)
      } else if (state.filters.privacy === PrivacyEnum.couple) {
        filtered = filtered.filter(post => post.privacy === PrivacyEnum.couple)
      }

      // Sort
      switch (state.filters.sortBy) {
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
    },

    publishedPosts: (state) => {
      if (!state.posts || !Array.isArray(state.posts)) {
        return []
      }
      return state.posts.filter(post => post.status === StatusEnum.published)
    },

    draftPosts: (state) => {
      if (!state.posts || !Array.isArray(state.posts)) {
        return []
      }
      return state.posts.filter(post => post.status === StatusEnum.draft)
    },

    publicPosts: (state) => {
      if (!state.posts || !Array.isArray(state.posts)) {
        return []
      }
      return state.posts.filter(post => post.privacy === PrivacyEnum.public && post.status === StatusEnum.published)
    },

    postsCount: (state) => {
      return Array.isArray(state.posts) ? state.posts.length : 0
    },

    allTags: (state) => {
      if (!state.posts || !Array.isArray(state.posts)) {
        return []
      }
      const tagSet = new Set<string>()
      state.posts.forEach(post => {
        post.tags.forEach(tag => tagSet.add(tag))
      })
      return Array.from(tagSet).sort()
    }
  },

  actions: {
    async fetchPosts(page = 1, limit = 12) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await blogService.getBlogPosts(page, limit, this.filters)
        
        if (page === 1) {
          this.posts = Array.isArray(response.data) ? response.data : []
        } else {
          if (Array.isArray(this.posts) && Array.isArray(response.data)) {
            this.posts.push(...response.data)
          } else {
            this.posts = Array.isArray(response.data) ? response.data : []
          }
        }
        
        this.totalPages = response.pagination.totalPages
        this.totalPosts = response.pagination.total
        this.currentPage = page
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi tải blog posts'
        console.error('Error fetching blog posts:', err)
        // Ensure posts is always an array even on error
        this.posts = []
      } finally {
        this.isLoading = false
      }
    },

    async fetchPostById(id: string) {
      this.isLoading = true
      this.error = null
      
      try {
        const post = await blogService.getBlogPost(id)
        this.selectedPost = post
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Không tìm thấy bài viết'
        console.error('Error fetching blog post:', err)
      } finally {
        this.isLoading = false
      }
    },

    async createPost(data: CreateBlogPostRequest) {
      this.isCreating = true
      this.error = null
      
      try {
        const newPost = await blogService.createBlogPost(data)
        if (Array.isArray(this.posts)) {
          this.posts.unshift(newPost)
        } else {
          this.posts = [newPost]
        }
        this.totalPosts++
        return newPost
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi tạo bài viết'
        console.error('Error creating blog post:', err)
        throw err
      } finally {
        this.isCreating = false
      }
    },

    async updatePost(data: UpdateBlogPostRequest) {
      this.isUpdating = true
      this.error = null
      
      try {
        const updatedPost = await blogService.updateBlogPost(data)
        if (Array.isArray(this.posts)) {
          const index = this.posts.findIndex(p => p.id === data.id)
          if (index !== -1) {
            this.posts[index] = updatedPost
          }
        }
        if (this.selectedPost?.id === data.id) {
          this.selectedPost = updatedPost
        }
        return updatedPost
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi cập nhật bài viết'
        console.error('Error updating blog post:', err)
        throw err
      } finally {
        this.isUpdating = false
      }
    },

    async deletePost(id: string) {
      this.isDeleting = true
      this.error = null
      
      try {
        await blogService.deleteBlogPost(id)
        if (Array.isArray(this.posts)) {
          this.posts = this.posts.filter(p => p.id !== id)
        }
        this.totalPosts--
        if (this.selectedPost?.id === id) {
          this.selectedPost = null
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi xóa bài viết'
        console.error('Error deleting blog post:', err)
        throw err
      } finally {
        this.isDeleting = false
      }
    },

    async toggleLike(id: string) {
      try {
        const result = await blogService.toggleLike(id)
        const post = this.posts.find(p => p.id === id)
        if (post) {
          post.isLiked = result.isLiked
          post.likesCount = result.likesCount
        }
        if (this.selectedPost?.id === id) {
          this.selectedPost.isLiked = result.isLiked
          this.selectedPost.likesCount = result.likesCount
        }
        return result
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi thích bài viết'
        console.error('Error toggling like:', err)
        throw err
      }
    },

    async fetchComments(postId: string) {
      try {
        const commentList = await blogService.getComments(postId)
        this.comments = commentList
        return commentList
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi tải bình luận'
        console.error('Error fetching comments:', err)
        throw err
      }
    },

    async addComment(postId: string, data: CreateBlogCommentRequest) {
      try {
        const newComment = await blogService.addComment(postId, data)
        this.comments.push(newComment)
        return newComment
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi thêm bình luận'
        console.error('Error adding comment:', err)
        throw err
      }
    },

    async fetchStats() {
      try {
        const blogStats = await blogService.getBlogStats()
        this.stats = blogStats
        return blogStats
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi tải thống kê'
        console.error('Error fetching stats:', err)
        throw err
      }
    },

    updateFilters(newFilters: Partial<BlogPostFilters>) {
      this.filters = { ...this.filters, ...newFilters }
    },

    clearFilters() {
      this.filters = {
        search: '',
        tags: [],
        privacy: 'all',
        status: 'all',
        sortBy: 'latest'
      }
    },

    clearError() {
      this.error = null
    },

    clearSelectedPost() {
      this.selectedPost = null
    }
  }
})
