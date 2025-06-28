import api from './api'
import type { 
  BlogPost, 
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
  ): Promise<PaginatedResponse<BlogPost>> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','))
    if (filters?.privacy) params.append('privacy', filters.privacy)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    
    const response = await api.get(`/blog?${params.toString()}`)
    return response.data
  },

  // Get single blog post by ID
  async getBlogPost(id: string): Promise<BlogPost> {
    const response = await api.get(`/blog/${id}`)
    return response.data
  },

  // Create new blog post
  async createBlogPost(data: CreateBlogPostRequest): Promise<BlogPost> {
    const formData = new FormData()
    
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('contentHtml', data.contentHtml)
    formData.append('tags', JSON.stringify(data.tags))
    
    if (data.privacy) formData.append('privacy', data.privacy)
    if (data.status) formData.append('status', data.status)
    if (data.excerpt) formData.append('excerpt', data.excerpt)
    if (data.coverImage) formData.append('coverImage', data.coverImage)

    const response = await api.post('/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Update blog post
  async updateBlogPost(data: UpdateBlogPostRequest): Promise<BlogPost> {
    const { id, ...updateData } = data
    
    const formData = new FormData()
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(value))
        } else if (key === 'coverImage' && value instanceof File) {
          formData.append(key, value)
        } else if (key !== 'coverImage') {
          formData.append(key, value.toString())
        }
      }
    })

    const response = await api.put(`/blog/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
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
    const response = await api.post(`/blog/${postId}/comments`, data)
    return response.data
  },

  // Update comment
  async updateComment(postId: string, commentId: string, content: string): Promise<BlogComment> {
    const response = await api.put(`/blog/${postId}/comments/${commentId}`, { content })
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

  // Upload cover image
  async uploadCoverImage(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/blog/upload-cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Search blog posts
  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    const response = await api.get(`/blog/search?q=${encodeURIComponent(query)}`)
    return response.data
  }
}

export default blogService
