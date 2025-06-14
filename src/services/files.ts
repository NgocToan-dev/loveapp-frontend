import type { FileItem, FileUploadProgress } from '@/types'
import ApiService from './api'

interface FileListResponse {
  files: FileItem[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

interface FileResponse {
  file: FileItem
}

interface FileUploadResponse {
  file: FileItem
  uploadUrl?: string
}

export class FilesService {
  // Get all files with pagination and filters
  async getFiles(params?: {
    page?: number
    limit?: number
    search?: string
    type?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ files: FileItem[]; total: number; page: number; limit: number }> {
    try {
      const response = await ApiService.get<FileListResponse>('/files', { params })
      // Transform the response to match expected format
      return {
        files: response.files.map(file => this.transformFileItem(file)),
        total: response.pagination.total,
        page: Math.floor(response.pagination.offset / response.pagination.limit) + 1,
        limit: response.pagination.limit
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Failed to fetch files')
    }
  }

  // Get file by ID
  async getFile(id: string): Promise<FileItem> {
    try {
      const response = await ApiService.get<FileResponse>(`/files/${id}`)
      return this.transformFileItem(response.file)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Failed to fetch file')
    }
  }

  // Upload single file
  async uploadFile(
    file: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<FileItem> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await ApiService.post<FileUploadResponse>('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress({
              name: file.name,
              progress,
              loaded: progressEvent.loaded,
              total: progressEvent.total
            })
          }
        }
      })

      return this.transformFileItem(response.file)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Failed to upload file')
    }
  }

  // Upload multiple files
  async uploadFiles(
    files: File[],
    onProgress?: (progress: FileUploadProgress[]) => void
  ): Promise<FileItem[]> {
    const uploadPromises = files.map((file, index) => {
      return this.uploadFile(file, (fileProgress) => {
        if (onProgress) {
          // Update progress for this specific file
          const allProgress = files.map((f, i) => ({
            name: f.name,
            progress: i === index ? fileProgress.progress : 0,
            loaded: i === index ? fileProgress.loaded : 0,
            total: i === index ? fileProgress.total : f.size
          }))
          onProgress(allProgress)
        }
      })
    })

    try {
      return await Promise.all(uploadPromises)
    } catch (error) {
      throw new Error('Some files failed to upload')
    }
  }

  // Delete file
  async deleteFile(id: string): Promise<void> {
    try {
      await ApiService.delete(`/files/${id}`)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Failed to delete file')
    }
  }

  // Update file metadata
  async updateFile(id: string, updates: {
    name?: string
    description?: string
    tags?: string[]
  }): Promise<FileItem> {
    try {
      const response = await ApiService.put<FileResponse>(`/files/${id}`, updates)
      return this.transformFileItem(response.file)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Failed to update file')
    }
  }

  // Get file download URL
  async getDownloadUrl(id: string): Promise<string> {
    try {
      const response = await ApiService.get<{ downloadUrl: string }>(`/files/${id}/download`)
      return response.downloadUrl
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Failed to get download URL')
    }
  }

  // Download file
  async downloadFile(id: string, filename?: string): Promise<void> {
    try {
      const downloadUrl = await this.getDownloadUrl(id)
      
      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Failed to download file')
    }
  }

  // Get file share URL
  async getShareUrl(id: string, expiresIn?: number): Promise<string> {
    try {
      const response = await ApiService.post<{ shareUrl: string }>(`/files/${id}/share`, {
        expiresIn
      })
      return response.shareUrl
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Failed to get share URL')
    }
  }

  // Get file statistics
  async getFileStats(): Promise<{
    totalFiles: number
    totalSize: number
    filesByType: Record<string, number>
    recentFiles: FileItem[]
  }> {
    try {
      const response = await ApiService.get<{
        totalFiles: number
        totalSize: number
        filesByType: Record<string, number>
        recentFiles: FileItem[]
      }>('/files/stats')
      return response
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Failed to fetch file statistics')
    }
  }

  // Search files
  async searchFiles(query: string, filters?: {
    type?: string
    dateFrom?: Date
    dateTo?: Date
    sizeMin?: number
    sizeMax?: number
  }): Promise<FileItem[]> {
    try {
      const response = await ApiService.get<FileListResponse>('/files/search', {
        params: {
          q: query,
          ...filters
        }
      })
      return response.files.map(file => this.transformFileItem(file))
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Failed to search files')
    }
  }

  // Get file thumbnail
  async getThumbnailUrl(id: string, size: 'small' | 'medium' | 'large' = 'medium'): Promise<string> {
    try {
      const response = await ApiService.get<{ thumbnailUrl: string }>(`/files/${id}/thumbnail`, {
        params: { size }
      })
      return response.thumbnailUrl
    } catch (error: unknown) {
      // If thumbnail generation fails, return a placeholder or the original file URL
      return `/api/v1/files/${id}`
    }
  }

  // Utility methods
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  static getFileTypeIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'mdi-image'
    if (mimeType.startsWith('video/')) return 'mdi-video'
    if (mimeType.startsWith('audio/')) return 'mdi-music'
    if (mimeType.includes('pdf')) return 'mdi-file-pdf-box'
    if (mimeType.includes('word')) return 'mdi-file-word-box'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'mdi-file-excel-box'
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'mdi-file-powerpoint-box'
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'mdi-folder-zip'
    if (mimeType.includes('text')) return 'mdi-file-document'
    return 'mdi-file'
  }

  static getFileTypeColor(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'success'
    if (mimeType.startsWith('video/')) return 'info'
    if (mimeType.startsWith('audio/')) return 'purple'
    if (mimeType.includes('pdf')) return 'error'
    if (mimeType.includes('word')) return 'primary'
    if (mimeType.includes('excel')) return 'success'
    if (mimeType.includes('powerpoint')) return 'warning'
    return 'grey'
  }

  static isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/')
  }

  static isVideo(mimeType: string): boolean {
    return mimeType.startsWith('video/')
  }

  static isAudio(mimeType: string): boolean {
    return mimeType.startsWith('audio/')
  }

  static isDocument(mimeType: string): boolean {
    return mimeType.includes('pdf') || 
           mimeType.includes('word') || 
           mimeType.includes('excel') || 
           mimeType.includes('powerpoint') ||
           mimeType.includes('text')
  }

  // Transform backend file structure to frontend-compatible structure
  private transformFileItem(file: FileItem): FileItem {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
    return {
      ...file,
      // Add computed properties for backward compatibility
      name: file.fileName || file.originalName,
      size: file.metadata.size,
      type: file.metadata.mimeType,
      url: `${baseURL}/files/view/${file.id}`, // File view URL using backend base URL
      thumbnailUrl: file.processing.thumbnailGenerated ? `${baseURL}/files/${file.id}/thumbnail` : undefined,
      uploadedBy: file.userId,
      uploadedAt: new Date(file.createdAt),
      lastModified: new Date(file.updatedAt),
      description: file.tags.join(', ') // Use tags as description for now
    }
  }
}

export default new FilesService()