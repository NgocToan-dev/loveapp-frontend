import type { Note, ApiResponse, PaginationParams } from '@/types'
import { api } from './api'

export interface CreateNoteData {
  title: string
  content: string
  category: string
  tags: string[]
  isPrivate: boolean
}

export interface UpdateNoteData {
  title?: string
  content?: string
  category?: string
  tags?: string[]
  isPrivate?: boolean
}

export interface NoteFilters extends PaginationParams {
  category?: string
  tags?: string
  isPrivate?: boolean
}

class NotesService {
  private readonly baseUrl = '/notes'

  async getNotes(filters?: NoteFilters): Promise<ApiResponse<{ notes: Note[], total: number }>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await api.get(`${this.baseUrl}?${params.toString()}`)
    return response.data
  }

  async getNoteById(id: string): Promise<ApiResponse<Note>> {
    const response = await api.get(`${this.baseUrl}/${id}`)
    return response.data
  }

  async createNote(data: CreateNoteData): Promise<ApiResponse<Note>> {
    const response = await api.post(this.baseUrl, data)
    return response.data
  }

  async updateNote(id: string, data: UpdateNoteData): Promise<ApiResponse<Note>> {
    const response = await api.put(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async deleteNote(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`${this.baseUrl}/${id}`)
    return response.data
  }

  async searchNotes(query: string, category?: string): Promise<ApiResponse<Note[]>> {
    const params = new URLSearchParams({ q: query })
    if (category) params.append('category', category)
    
    const response = await api.get(`${this.baseUrl}/search?${params.toString()}`)
    return response.data
  }

  async getNotesByCategory(category: string): Promise<ApiResponse<Note[]>> {
    const response = await api.get(`${this.baseUrl}/category/${category}`)
    return response.data
  }

  async getNotesStats(): Promise<ApiResponse<any>> {
    const response = await api.get(`${this.baseUrl}/stats`)
    return response.data
  }
}

export const notesService = new NotesService() 