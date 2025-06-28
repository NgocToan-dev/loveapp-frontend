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
    return posts.value.filter(post => post.status === 'published')
  })

  const draftPosts = computed(() => {
    return posts.value.filter(post => post.status === 'draft')
  })

  const publicPosts = computed(() => {
    return posts.value.filter(post => post.privacy === 'public' && post.status === 'published')
  })

  const postsCount = computed(() => posts.value.length)

  const allTags = computed(() => {
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
        posts.value = response.data
      } else {
        posts.value.push(...response.data)
      }
      
      totalPages.value = response.pagination.totalPages
      totalPosts.value = response.pagination.totalItems
      currentPage.value = page
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tải blog posts'
      console.error('Error fetching blog posts:', err)
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
      posts.value.unshift(newPost)
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
    isCreating.value = true
    error.value = null
    
    try {
      // Mock API call - replace with actual API
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        contentHtml: data.contentHtml,
        excerpt: data.excerpt || data.content.substring(0, 150) + '...',
        coverImageUrl: data.coverImageUrl,
        author: {
          id: 'current-user',
          displayName: 'Tôi',
          avatarUrl: 'https://picsum.photos/100/100?random=3'
        },
        tags: data.tags || [],
        privacy: data.privacy || 'couple',
        status: data.status || 'draft',
        isLiked: false,
        likesCount: 0,
        views: 0,
        readingTime: Math.ceil(data.content.length / 200),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: data.status === 'published' ? new Date().toISOString() : undefined
      }
      
      posts.value.unshift(newPost)
      return newPost
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo bài viết'
      throw err
    } finally {
      isCreating.value = false
    }
  }

  const updatePost = async (data: UpdateBlogPostRequest) => {
    isUpdating.value = true
    error.value = null
    
    try {
      // Mock API call - replace with actual API
      const index = posts.value.findIndex(p => p.id === data.id)
      if (index !== -1) {
        const updatedPost: BlogPost = {
          ...posts.value[index],
          title: data.title || posts.value[index].title,
          content: data.content || posts.value[index].content,
          contentHtml: data.contentHtml || posts.value[index].contentHtml,
          excerpt: data.excerpt || posts.value[index].excerpt,
          coverImageUrl: data.coverImageUrl || posts.value[index].coverImageUrl,
          tags: data.tags || posts.value[index].tags,
          privacy: data.privacy || posts.value[index].privacy,
          status: data.status || posts.value[index].status,
          updatedAt: new Date().toISOString(),
          publishedAt: data.status === 'published' && !posts.value[index].publishedAt 
            ? new Date().toISOString() 
            : posts.value[index].publishedAt
        }
        posts.value[index] = updatedPost
        
        if (selectedPost.value?.id === data.id) {
          selectedPost.value = updatedPost
        }
        
        return updatedPost
      } else {
        throw new Error('Không tìm thấy bài viết')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật bài viết'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  const deletePost = async (id: string) => {
    isDeleting.value = true
    error.value = null
    
    try {
      // Mock API call - replace with actual API
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value.splice(index, 1)
        
        if (selectedPost.value?.id === id) {
          selectedPost.value = null
        }
      } else {
        throw new Error('Không tìm thấy bài viết')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa bài viết'
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  const toggleLike = async (id: string) => {
    try {
      // Mock API call - replace with actual API
      const post = posts.value.find(p => p.id === id)
      if (post) {
        if (post.isLiked) {
          post.isLiked = false
          post.likesCount--
        } else {
          post.isLiked = true
          post.likesCount++
        }
        
        if (selectedPost.value?.id === id) {
          selectedPost.value = { ...post }
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Có lỗi xảy ra'
    }
  }

  const fetchStats = async () => {
    try {
      // Mock stats - replace with actual API
      stats.value = {
        totalPosts: posts.value.length,
        publishedPosts: publishedPosts.value.length,
        draftPosts: draftPosts.value.length,
        totalViews: posts.value.reduce((sum, post) => sum + post.views, 0),
        totalLikes: posts.value.reduce((sum, post) => sum + post.likesCount, 0),
        postsThisMonth: posts.value.filter(post => {
          const postDate = new Date(post.createdAt)
          const now = new Date()
          return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
        }).length,
        popularTags: allTags.value.slice(0, 10).map(tag => ({
          tag,
          count: posts.value.filter(post => post.tags.includes(tag)).length
        })).sort((a, b) => b.count - a.count)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thống kê'
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
    fetchStats,
    updateFilters,
    clearFilters,
    clearError
  }
})
