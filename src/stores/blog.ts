import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  coverImage?: string
  author: string
  tags: string[]
  isPublished: boolean
  isPrivate: boolean
  isLiked?: boolean
  likesCount: number
  views: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface CreateBlogPostData {
  title: string
  content: string
  excerpt?: string
  coverImage?: File
  tags?: string[]
  isPrivate?: boolean
  isPublished?: boolean
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string
  isLiked?: boolean
  likesCount?: number
  views?: number
}

export const useBlogStore = defineStore('blog', () => {
  // State
  const posts = ref<BlogPost[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedPost = ref<BlogPost | null>(null)
  const filters = ref({
    search: '',
    tags: [] as string[],
    status: 'all' as 'all' | 'published' | 'draft',
    privacy: 'all' as 'all' | 'public' | 'private',
    sortBy: {
      field: 'createdAt',
      direction: 'desc' as 'asc' | 'desc'
    }
  })

  // Getters
  const filteredPosts = computed(() => {
    let filtered = [...posts.value]

    // Search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Tags filter
    if (filters.value.tags.length > 0) {
      filtered = filtered.filter(post =>
        filters.value.tags.some(tag => post.tags.includes(tag))
      )
    }

    // Status filter
    if (filters.value.status === 'published') {
      filtered = filtered.filter(post => post.isPublished)
    } else if (filters.value.status === 'draft') {
      filtered = filtered.filter(post => !post.isPublished)
    }

    // Privacy filter
    if (filters.value.privacy === 'public') {
      filtered = filtered.filter(post => !post.isPrivate)
    } else if (filters.value.privacy === 'private') {
      filtered = filtered.filter(post => post.isPrivate)
    }

    // Sort
    filtered.sort((a, b) => {
      const field = filters.value.sortBy.field as keyof BlogPost
      const direction = filters.value.sortBy.direction
      
      let aValue = a[field] ?? ''
      let bValue = b[field] ?? ''
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  })

  const publishedPosts = computed(() => {
    return posts.value.filter(post => post.isPublished && !post.isPrivate)
  })

  const draftPosts = computed(() => {
    return posts.value.filter(post => !post.isPublished)
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    posts.value.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  const postsCount = computed(() => posts.value.length)
  const publishedCount = computed(() => publishedPosts.value.length)
  const draftCount = computed(() => draftPosts.value.length)

  // Actions
  const fetchPosts = async () => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await blogService.getPosts()
      
      // Mock data for now
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Our First Adventure Together',
          content: '<p>Today we went on our first hiking trip together. The view from the mountain was absolutely breathtaking, but not as beautiful as the smile on your face when we reached the top...</p>',
          excerpt: 'Today we went on our first hiking trip together. The view from the mountain was absolutely breathtaking...',
          coverImage: '/images/hiking-trip.jpg',
          author: 'You',
          tags: ['adventure', 'hiking', 'nature'],
          isPublished: true,
          isPrivate: false,
          likesCount: 5,
          views: 24,
          createdAt: '2023-06-15T10:00:00Z',
          updatedAt: '2023-06-15T10:00:00Z',
          publishedAt: '2023-06-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Weekend Cooking Experiment',
          content: '<p>We decided to try making homemade pasta from scratch. It was messy, chaotic, and absolutely perfect...</p>',
          excerpt: 'We decided to try making homemade pasta from scratch. It was messy, chaotic, and absolutely perfect...',
          author: 'Me',
          tags: ['cooking', 'weekend', 'fun'],
          isPublished: false,
          isPrivate: false,
          likesCount: 0,
          views: 0,
          createdAt: '2023-06-20T15:30:00Z',
          updatedAt: '2023-06-20T15:30:00Z'
        }
      ]

      posts.value = mockPosts
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch posts'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const createPost = async (data: CreateBlogPostData) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await blogService.createPost(data)

      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || generateExcerpt(data.content),
        coverImage: undefined, // TODO: Handle image upload
        author: 'Me', // TODO: Get from auth store
        tags: data.tags || [],
        isPublished: data.isPublished || false,
        isPrivate: data.isPrivate || false,
        likesCount: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: data.isPublished ? new Date().toISOString() : undefined
      }

      posts.value.unshift(newPost)
      return newPost
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create post'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const updatePost = async (data: UpdateBlogPostData) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await blogService.updatePost(data)

      const index = posts.value.findIndex(p => p.id === data.id)
      if (index === -1) {
        throw new Error('Post not found')
      }

      const currentPost = posts.value[index]
      const updatedPost: BlogPost = {
        ...currentPost,
        title: data.title ?? currentPost.title,
        content: data.content ?? currentPost.content,
        tags: data.tags ?? currentPost.tags,
        isPrivate: data.isPrivate ?? currentPost.isPrivate,
        isPublished: data.isPublished ?? currentPost.isPublished,
        isLiked: data.isLiked ?? currentPost.isLiked,
        likesCount: data.likesCount ?? currentPost.likesCount,
        views: data.views ?? currentPost.views,
        excerpt: data.excerpt || (data.content ? generateExcerpt(data.content) : currentPost.excerpt),
        updatedAt: new Date().toISOString(),
        publishedAt: data.isPublished && !currentPost.isPublished 
          ? new Date().toISOString() 
          : currentPost.publishedAt
      }

      posts.value[index] = updatedPost
      
      if (selectedPost.value?.id === data.id) {
        selectedPost.value = updatedPost
      }

      return updatedPost
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update post'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const deletePost = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // await blogService.deletePost(id)

      const index = posts.value.findIndex(p => p.id === id)
      if (index === -1) {
        throw new Error('Post not found')
      }

      posts.value.splice(index, 1)
      
      if (selectedPost.value?.id === id) {
        selectedPost.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete post'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const publishPost = async (id: string) => {
    await updatePost({ id, isPublished: true })
  }

  const unpublishPost = async (id: string) => {
    await updatePost({ id, isPublished: false })
  }

  const toggleLike = async (id: string) => {
    const post = posts.value.find(p => p.id === id)
    if (!post) return

    const wasLiked = post.isLiked || false
    const newLikesCount = wasLiked ? post.likesCount - 1 : post.likesCount + 1

    await updatePost({
      id,
      isLiked: !wasLiked,
      likesCount: newLikesCount
    })
  }

  const incrementViews = async (id: string) => {
    const post = posts.value.find(p => p.id === id)
    if (!post) return

    await updatePost({
      id,
      views: post.views + 1
    })
  }

  const setSelectedPost = (post: BlogPost | null) => {
    selectedPost.value = post
  }

  const setFilters = (newFilters: Partial<typeof filters.value>) => {
    filters.value = {
      ...filters.value,
      ...newFilters
    }
  }

  const setSortBy = (field: string, direction: 'asc' | 'desc') => {
    setFilters({ sortBy: { field, direction } })
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      tags: [],
      status: 'all',
      privacy: 'all',
      sortBy: {
        field: 'createdAt',
        direction: 'desc'
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Helper functions
  const generateExcerpt = (content: string, maxLength = 150) => {
    // Strip HTML tags and get plain text
    const textContent = content.replace(/<[^>]*>/g, '')
    if (textContent.length <= maxLength) {
      return textContent
    }
    return textContent.substring(0, maxLength).trim() + '...'
  }

  return {
    // State
    posts,
    isLoading,
    error,
    selectedPost,
    filters,

    // Getters
    filteredPosts,
    publishedPosts,
    draftPosts,
    allTags,
    postsCount,
    publishedCount,
    draftCount,

    // Actions
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    toggleLike,
    incrementViews,
    setSelectedPost,
    setFilters,
    setSortBy,
    clearFilters,
    clearError
  }
})
