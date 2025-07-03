import api from './api'

export interface UploadResponse {
  message: string
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
}

export interface MultipleUploadResponse {
  message: string
  files: UploadResponse[]
}

export const uploadService = {
  // Upload single file
  async uploadSingle(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  // Upload multiple files
  async uploadMultiple(files: File[]): Promise<MultipleUploadResponse> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  // Delete file
  async deleteFile(fileUrl: string): Promise<void> {
    await api.delete('/upload/file', {
      data: { fileUrl }
    })
  },

  // Generate presigned URL
  async generatePresignedUrl(fileUrl: string, expirySeconds = 3600): Promise<string> {
    const response = await api.post('/upload/presigned-url', {
      fileUrl,
      expirySeconds
    })

    return response.data.presignedUrl
  },

  // Upload cover image for blog
  async uploadCoverImage(file: File): Promise<{ imageUrl: string }> {
    const result = await this.uploadSingle(file)
    return { imageUrl: result.fileUrl }
  }
}
