import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import type { FileItem, FileUploadProgress } from '@/types'
import FilesService from '@/services/files'

export const useFilesStore = defineStore('files', () => {
  // State
  const files = ref<FileItem[]>([])
  const uploadProgress = ref<FileUploadProgress[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalFiles = ref(0)
  const searchQuery = ref('')
  const selectedType = ref('')
  const sortBy = ref('date-desc')

  // Getters
  const filteredFiles = computed(() => {
    let filtered = [...files.value]
    
    // Filter by search query
    if (searchQuery.value) {
      filtered = filtered.filter(file =>
        (file.name || file.fileName || file.originalName || '').toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }

    // Filter by type
    if (selectedType.value) {
      filtered = filtered.filter(file =>
        (file.type || file.metadata?.mimeType || '').startsWith(selectedType.value)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy.value) {
        case 'date-desc':
          const bDate = new Date(b.uploadedAt || b.createdAt || 0).getTime()
          const aDate = new Date(a.uploadedAt || a.createdAt || 0).getTime()
          return bDate - aDate
        case 'date-asc':
          const aDateAsc = new Date(a.uploadedAt || a.createdAt || 0).getTime()
          const bDateAsc = new Date(b.uploadedAt || b.createdAt || 0).getTime()
          return aDateAsc - bDateAsc
        case 'name-asc':
          const aName = a.name || a.fileName || a.originalName || ''
          const bName = b.name || b.fileName || b.originalName || ''
          return aName.localeCompare(bName)
        case 'name-desc':
          const aNameDesc = a.name || a.fileName || a.originalName || ''
          const bNameDesc = b.name || b.fileName || b.originalName || ''
          return bNameDesc.localeCompare(aNameDesc)
        case 'size-desc':
          const bSize = b.size || b.metadata?.size || 0
          const aSize = a.size || a.metadata?.size || 0
          return bSize - aSize
        case 'size-asc':
          const aSizeAsc = a.size || a.metadata?.size || 0
          const bSizeAsc = b.size || b.metadata?.size || 0
          return aSizeAsc - bSizeAsc
        default:
          return 0
      }
    })

    return filtered
  })

  const fileStats = computed(() => {
    const stats = {
      totalFiles: files.value.length,
      totalSize: files.value.reduce((sum, file) => sum + (file.size || file.metadata?.size || 0), 0),
      imageFiles: files.value.filter(f => (f.type || f.metadata?.mimeType || '').startsWith('image/')).length,
      videoFiles: files.value.filter(f => (f.type || f.metadata?.mimeType || '').startsWith('video/')).length,
      audioFiles: files.value.filter(f => (f.type || f.metadata?.mimeType || '').startsWith('audio/')).length,
      documentFiles: files.value.filter(f => {
        const type = f.type || f.metadata?.mimeType || ''
        return type.includes('pdf') ||
               type.includes('word') ||
               type.includes('excel') ||
               type.includes('powerpoint')
      }).length
    }
    return stats
  })

  const isUploading = computed(() => uploadProgress.value.length > 0)

  // Actions
  async function fetchFiles(params?: {
    page?: number
    limit?: number
    search?: string
    type?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    isLoading.value = true
    error.value = null

    try {
      const response = await FilesService.getFiles(params)
      files.value = response.files
      totalFiles.value = response.total
      currentPage.value = response.page
      totalPages.value = Math.ceil(response.total / response.limit)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch files'
      error.value = errorMessage
      
      // If it's a 404 or connection error, set empty state instead of throwing
      if (errorMessage.includes('404') || errorMessage.includes('Failed to fetch')) {
        console.warn('Backend not available, setting empty files state:', errorMessage)
        files.value = []
        totalFiles.value = 0
        currentPage.value = 1
        totalPages.value = 1
        error.value = 'Backend service is not available. Files functionality is temporarily disabled.'
      } else {
        throw err
      }
    } finally {
      isLoading.value = false
    }
  }

  async function uploadFile(file: File) {
    error.value = null

    try {
      const uploadedFile = await FilesService.uploadFile(file, (progress) => {
        // Update progress
        const existingIndex = uploadProgress.value.findIndex(p => p.name === file.name)
        if (existingIndex >= 0) {
          uploadProgress.value[existingIndex] = progress
        } else {
          uploadProgress.value.push(progress)
        }
      })

      // Add to files list
      files.value.unshift(uploadedFile)
      totalFiles.value++

      // Remove from upload progress
      uploadProgress.value = uploadProgress.value.filter(p => p.name !== file.name)

      return uploadedFile
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file'
      error.value = errorMessage
      
      // Update progress with error
      const existingIndex = uploadProgress.value.findIndex(p => p.name === file.name)
      if (existingIndex >= 0) {
        uploadProgress.value[existingIndex].status = 'error'
        uploadProgress.value[existingIndex].error = errorMessage
      }
      
      throw err
    }
  }

  async function uploadFiles(filesToUpload: File[]) {
    error.value = null

    try {
      const uploadedFiles = await FilesService.uploadFiles(filesToUpload, (progressList) => {
        uploadProgress.value = progressList
      })

      // Add to files list
      files.value.unshift(...uploadedFiles)
      totalFiles.value += uploadedFiles.length

      // Clear upload progress
      uploadProgress.value = []

      return uploadedFiles
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload files'
      error.value = errorMessage
      throw err
    }
  }

  async function deleteFile(fileId: string) {
    error.value = null

    try {
      await FilesService.deleteFile(fileId)
      
      // Remove from files list
      files.value = files.value.filter(f => f.id !== fileId)
      totalFiles.value--
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file'
      error.value = errorMessage
      throw err
    }
  }

  async function updateFile(fileId: string, updates: {
    name?: string
    description?: string
    tags?: string[]
  }) {
    error.value = null

    try {
      const updatedFile = await FilesService.updateFile(fileId, updates)
      
      // Update in files list
      const index = files.value.findIndex(f => f.id === fileId)
      if (index >= 0) {
        files.value[index] = updatedFile
      }

      return updatedFile
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update file'
      error.value = errorMessage
      throw err
    }
  }

  async function downloadFile(fileId: string, filename?: string) {
    error.value = null

    try {
      await FilesService.downloadFile(fileId, filename)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download file'
      error.value = errorMessage
      throw err
    }
  }

  async function shareFile(fileId: string, expiresIn?: number) {
    error.value = null

    try {
      const shareUrl = await FilesService.getShareUrl(fileId, expiresIn)
      return shareUrl
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share file'
      error.value = errorMessage
      throw err
    }
  }

  async function searchFiles(query: string, filters?: {
    type?: string
    dateFrom?: Date
    dateTo?: Date
    sizeMin?: number
    sizeMax?: number
  }) {
    isLoading.value = true
    error.value = null

    try {
      const searchResults = await FilesService.searchFiles(query, filters)
      files.value = searchResults
      totalFiles.value = searchResults.length
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search files'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setSelectedType(type: string) {
    selectedType.value = type
  }

  function setSortBy(sort: string) {
    sortBy.value = sort
  }

  function clearError() {
    error.value = null
  }

  function clearUploadProgress() {
    uploadProgress.value = []
  }

  function cancelUpload(fileName: string) {
    uploadProgress.value = uploadProgress.value.filter(p => p.name !== fileName)
  }

  // Initialize store
  function initialize() {
    fetchFiles().catch(error => {
      console.warn('Files initialization failed:', error)
      // Don't re-throw error during initialization to prevent app crash
    })
  }

  return {
    // State
    files,
    uploadProgress,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalFiles,
    searchQuery,
    selectedType,
    sortBy,

    // Getters
    filteredFiles,
    fileStats,
    isUploading,

    // Actions
    fetchFiles,
    uploadFile,
    uploadFiles,
    deleteFile,
    updateFile,
    downloadFile,
    shareFile,
    searchFiles,
    setSearchQuery,
    setSelectedType,
    setSortBy,
    clearError,
    clearUploadProgress,
    cancelUpload,
    initialize
  }
}) 