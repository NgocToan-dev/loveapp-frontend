import { BlogPostEntity } from '@/types/model/blog/BlogPostEntity';
import api from './api'
import { uploadService } from './upload'
import type { 
  CreateBlogPostRequest, 
  UpdateBlogPostRequest, 
  BlogPostFilters,
  BlogPostStats,
  BlogComment,
  CreateBlogCommentRequest,
  PaginatedResponse 
} from '@/types'

export const blogService = {
  // Get all blog posts with pagination and filters
  async getBlogPosts(
    page = 1, 
    limit = 12, 
    filters?: BlogPostFilters
  ): Promise<PaginatedResponse<BlogPostEntity>> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','))
    if (filters?.privacy) params.append('privacy', filters.privacy)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    
    const response = await api.get(`/blog?${params.toString()}`)
    
    // Map backend response to frontend format
    const mappedData = {
      data: response.data.posts.map((post: any) => ({
        ...post,
        id: post._id,
        likesCount: post.likes?.length || 0,
        commentsCount: post.comments?.length || 0,
        // Safe navigation for userId object
        userId: post.userId ? {
          _id: post.userId._id,
          displayName: post.userId.displayName || 'Unknown User',
          avatarUrl: post.userId.avatarUrl || ''
        } : null
      })),
      pagination: {
        ...response.data.pagination,
        total: response.data.pagination.totalPosts
      },
      success: true
    }
    
    return mappedData
  },

  // Get single blog post by ID
  async getBlogPost(id: string): Promise<BlogPostEntity> {
    const response = await api.get(`/blog/${id}`)
    
    // Map backend response to frontend format
    return {
      ...response.data,
      id: response.data._id,
      likesCount: response.data.likes?.length || 0,
      commentsCount: response.data.comments?.length || 0,
      // Safe navigation for userId object
      userId: response.data.userId ? {
        _id: response.data.userId._id,
        displayName: response.data.userId.displayName || 'Unknown User',
        avatarUrl: response.data.userId.avatarUrl || ''
      } : null
    }
  },

  // Create new blog post
  async createBlogPost(data: CreateBlogPostRequest): Promise<BlogPostEntity> {
    console.log('blogService.createBlogPost called with:', data) // Debug log
    
    // Validate required fields
    if (!data.title?.trim()) {
      throw new Error('Title is required')
    }
    if (!data.content?.trim()) {
      throw new Error('Content is required')
    }
    if (!data.contentHtml?.trim()) {
      throw new Error('Content HTML is required')
    }
    
    // Handle cover image upload separately if present
    let coverImageUrl = ''
    if (data.coverImage && data.coverImage instanceof File) {
      const imageResult = await uploadService.uploadCoverImage(data.coverImage)
      coverImageUrl = imageResult.imageUrl
    }
    
    // Prepare JSON payload
    const payload = {
      title: data.title.trim(),
      content: data.content.trim(),
      contentHtml: data.contentHtml.trim(),
      tags: data.tags || [],
      privacy: data.privacy || 'private',
      status: data.status || 'draft',
      excerpt: data.excerpt?.trim() || '',
      ...(coverImageUrl && { coverImageUrl })
    }

    console.log('Sending JSON payload:', payload) // Debug log

    const response = await api.post('/blog', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // Map backend response to frontend format
    return {
      ...response.data,
      id: response.data._id,
      likesCount: response.data.likes?.length || 0,
      commentsCount: response.data.comments?.length || 0,
      // Safe navigation for userId object
      userId: response.data.userId ? {
        _id: response.data.userId._id,
        displayName: response.data.userId.displayName || 'Unknown User',
        avatarUrl: response.data.userId.avatarUrl || ''
      } : null
    }
  },

  // Update blog post
  async updateBlogPost(data: UpdateBlogPostRequest): Promise<BlogPostEntity> {
    const { id, coverImage, ...updateData } = data
    
    // If there's a cover image, handle it separately
    if (coverImage && coverImage instanceof File) {
      // First upload the image
      const imageResult = await uploadService.uploadCoverImage(coverImage)
      updateData.coverImageUrl = imageResult.imageUrl
    }
    
    // Send JSON payload for other fields
    const payload = {
      ...updateData,
      tags: updateData.tags || []
    }

    console.log('Updating blog post with JSON payload:', payload) // Debug log

    const response = await api.put(`/blog/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // Map backend response to frontend format
    return {
      ...response.data,
      id: response.data._id,
      likesCount: response.data.likes?.length || 0,
      commentsCount: response.data.comments?.length || 0,
      // Safe navigation for userId object
      userId: response.data.userId ? {
        _id: response.data.userId._id,
        displayName: response.data.userId.displayName || 'Unknown User',
        avatarUrl: response.data.userId.avatarUrl || ''
      } : null
    }
  },

  // Delete blog post
  async deleteBlogPost(id: string): Promise<void> {
    await api.delete(`/blog/${id}`)
  },

  // Like/unlike blog post
  async toggleLike(id: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const response = await api.post(`/blog/${id}/like`)
    return response.data
  },

  // Get likes for a blog post
  async getLikes(id: string): Promise<{ likesCount: number; userLikes: boolean }> {
    const response = await api.get(`/blog/${id}/likes`)
    return response.data
  },

  // Get comments for a blog post
  async getComments(postId: string): Promise<BlogComment[]> {
    const response = await api.get(`/blog/${postId}/comments`)
    return response.data
  },

  // Add comment to blog post
  async addComment(postId: string, data: CreateBlogCommentRequest): Promise<BlogComment> {
    const response = await api.post(`/blog/${postId}/comments`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  },

  // Update comment
  async updateComment(postId: string, commentId: string, content: string): Promise<BlogComment> {
    const response = await api.put(`/blog/${postId}/comments/${commentId}`, { content }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  },

  // Delete comment
  async deleteComment(postId: string, commentId: string): Promise<void> {
    await api.delete(`/blog/${postId}/comments/${commentId}`)
  },

  // Get blog statistics
  async getBlogStats(): Promise<BlogPostStats> {
    const response = await api.get('/blog/stats')
    return response.data
  },

  // Get all tags
  async getTags(): Promise<string[]> {
    const response = await api.get('/blog/tags')
    return response.data
  },

  // Search blog posts
  async searchBlogPosts(query: string): Promise<BlogPostEntity[]> {
    const response = await api.get(`/blog/search?q=${encodeURIComponent(query)}`)
    return response.data
  }
}

export default blogService
