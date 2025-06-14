import type { Note, PaginationParams } from '@/types'
import ApiService from './api'

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

  async getNotes(filters?: NoteFilters): Promise<{ notes: Note[], total: number }> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    return await ApiService.get<{ notes: Note[], total: number }>(`${this.baseUrl}?${params.toString()}`)
  }

  async getNoteById(id: string): Promise<Note> {
    return await ApiService.get<Note>(`${this.baseUrl}/${id}`)
  }

  async createNote(data: CreateNoteData): Promise<Note> {
    return await ApiService.post<Note>(this.baseUrl, data)
  }

  async updateNote(id: string, data: UpdateNoteData): Promise<Note> {
    return await ApiService.put<Note>(`${this.baseUrl}/${id}`, data)
  }

  async deleteNote(id: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/${id}`)
  }

  async searchNotes(query: string, category?: string): Promise<Note[]> {
    const params = new URLSearchParams({ q: query })
    if (category) params.append('category', category)
    
    return await ApiService.get<Note[]>(`${this.baseUrl}/search?${params.toString()}`)
  }

  async getNotesByCategory(category: string): Promise<Note[]> {
    return await ApiService.get<Note[]>(`${this.baseUrl}/category/${category}`)
  }

  async getNotesStats(): Promise<any> {
    return await ApiService.get<any>(`${this.baseUrl}/stats`)
  }
}

export const notesService = new NotesService() 