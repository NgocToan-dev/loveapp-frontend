import type { Note, PaginationParams } from '@/types'
import ApiService from './api'

export interface NotesResponse {
  data: Note[]
  meta?: {
    pagination?: {
      total: number
      page: number
      limit: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

export interface CreateNoteData {
  title: string
  content: string
  category: string
  tags: string[]
  isPrivate: boolean
  attachments?: string[]
  sharedWith?: string[]
}

export interface UpdateNoteData {
  title?: string
  content?: string
  category?: string
  tags?: string[]
  isPrivate?: boolean
  attachments?: string[]
  sharedWith?: string[]
  isArchived?: boolean
}

export interface NoteFilters extends PaginationParams {
  category?: string
  tags?: string
  isPrivate?: boolean
}

class NotesService {
  private readonly baseUrl = '/notes'

  private convertFirestoreDate(date: Date | { _seconds: number; _nanoseconds: number }): Date {
    if (date instanceof Date) {
      return date
    }
    if (date && typeof date === 'object' && '_seconds' in date) {
      return new Date(date._seconds * 1000 + date._nanoseconds / 1000000)
    }
    return new Date()
  }

  async getNotes(filters?: NoteFilters): Promise<{ notes: Note[], total: number, pagination?: any }> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await ApiService.get<NotesResponse>(`/notes?${params.toString()}`)
    
    // Convert Firestore timestamps to Date objects
    const notes = response.data.map((note: any) => ({
      ...note,
      createdAt: this.convertFirestoreDate(note.createdAt),
      updatedAt: this.convertFirestoreDate(note.updatedAt),
      createdBy: note.userId // Map userId to createdBy for backward compatibility
    }))
    
    const pagination = response.meta?.pagination
    const total = pagination?.total || notes.length
    
    return { notes, total, pagination }
  }

  async getNoteById(id: string): Promise<Note> {
    const note = await ApiService.get<Note>(`${this.baseUrl}/${id}`)
    return {
      ...note,
      createdAt: this.convertFirestoreDate(note.createdAt),
      updatedAt: this.convertFirestoreDate(note.updatedAt),
      createdBy: note.userId || note.createdBy // Map userId to createdBy for backward compatibility
    }
  }

  async createNote(data: CreateNoteData): Promise<Note> {
    const note = await ApiService.post<Note>(this.baseUrl, data)
    return {
      ...note,
      createdAt: this.convertFirestoreDate(note.createdAt),
      updatedAt: this.convertFirestoreDate(note.updatedAt),
      createdBy: note.userId || note.createdBy // Map userId to createdBy for backward compatibility
    }
  }

  async updateNote(id: string, data: UpdateNoteData): Promise<Note> {
    const note = await ApiService.put<Note>(`${this.baseUrl}/${id}`, data)
    return {
      ...note,
      createdAt: this.convertFirestoreDate(note.createdAt),
      updatedAt: this.convertFirestoreDate(note.updatedAt),
      createdBy: note.userId || note.createdBy // Map userId to createdBy for backward compatibility
    }
  }

  async deleteNote(id: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/${id}`)
  }

  async searchNotes(query: string, category?: string): Promise<Note[]> {
    const params = new URLSearchParams({ q: query })
    if (category) params.append('category', category)
    
    const notes = await ApiService.get<Note[]>(`${this.baseUrl}/search?${params.toString()}`)
    return notes.map(note => ({
      ...note,
      createdAt: this.convertFirestoreDate(note.createdAt),
      updatedAt: this.convertFirestoreDate(note.updatedAt),
      createdBy: note.userId || note.createdBy // Map userId to createdBy for backward compatibility
    }))
  }

  async getNotesByCategory(category: string): Promise<Note[]> {
    const notes = await ApiService.get<Note[]>(`${this.baseUrl}/category/${category}`)
    return notes.map(note => ({
      ...note,
      createdAt: this.convertFirestoreDate(note.createdAt),
      updatedAt: this.convertFirestoreDate(note.updatedAt),
      createdBy: note.userId || note.createdBy // Map userId to createdBy for backward compatibility
    }))
  }

  async getNotesStats(): Promise<any> {
    return await ApiService.get<any>(`${this.baseUrl}/stats`)
  }
}

export const notesService = new NotesService() 