import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note } from '@/types'
import { notesService, type CreateNoteData, type UpdateNoteData, type NoteFilters } from '@/services/notes'

export const useNotesStore = defineStore('notes', () => {
  // State
  const notes = ref<Note[]>([])
  const currentNote = ref<Note | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalNotes = ref(0)
  const pagination = ref<any>(null)
  const searchResults = ref<Note[]>([])
  const filters = ref<NoteFilters>({
    page: 1,
    limit: 12,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  })

  // Getters
  const privateNotes = computed(() => 
    (notes.value || []).filter(note => note.isPrivate)
  )

  const publicNotes = computed(() => 
    (notes.value || []).filter(note => !note.isPrivate)
  )

  const notesByCategory = computed(() => {
    const categories: Record<string, Note[]> = {}
    ;(notes.value || []).forEach(note => {
      if (!categories[note.category]) {
        categories[note.category] = []
      }
      categories[note.category].push(note)
    })
    return categories
  })

  const allCategories = computed(() => 
    [...new Set((notes.value || []).map(note => note.category))]
  )

  const totalPages = computed(() => {
    if (pagination.value?.totalPages) {
      return pagination.value.totalPages
    }
    return Math.ceil(totalNotes.value / (filters.value.limit || 12))
  })

  // Actions
  const fetchNotes = async (customFilters?: Partial<NoteFilters>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const mergedFilters = { ...filters.value, ...customFilters }
      const response = await notesService.getNotes(mergedFilters)
      
      notes.value = response.notes
      totalNotes.value = response.total
      pagination.value = response.pagination
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch notes'
      console.error('Error fetching notes:', err)
      
      // Set fallback empty data if backend is not available
      if (err.code === 'ERR_NETWORK' || err.code === 'ERR_NAME_NOT_RESOLVED') {
        notes.value = []
        totalNotes.value = 0
        pagination.value = null
        error.value = 'Backend server not available. Please check if the server is running.'
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchNoteById = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await notesService.getNoteById(id)
      
      currentNote.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch note'
      console.error('Error fetching note:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createNote = async (data: CreateNoteData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await notesService.createNote(data)
      
      if (!notes.value) {
        notes.value = []
      }
      notes.value.unshift(response)
      totalNotes.value += 1
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create note'
      console.error('Error creating note:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateNote = async (id: string, data: UpdateNoteData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await notesService.updateNote(id, data)
      
      const index = (notes.value || []).findIndex(note => note.id === id)
      if (index !== -1 && notes.value) {
        notes.value[index] = response
      }
      if (currentNote.value?.id === id) {
        currentNote.value = response
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update note'
      console.error('Error updating note:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteNote = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await notesService.deleteNote(id)
      
      notes.value = (notes.value || []).filter(note => note.id !== id)
      totalNotes.value -= 1
      if (currentNote.value?.id === id) {
        currentNote.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete note'
      console.error('Error deleting note:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const searchNotes = async (query: string, category?: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await notesService.searchNotes(query, category)
      
      searchResults.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to search notes'
      console.error('Error searching notes:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchNotesByCategory = async (category: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await notesService.getNotesByCategory(category)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch notes by category'
      console.error('Error fetching notes by category:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateFilters = (newFilters: Partial<NoteFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      page: 1,
      limit: 10,
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentNote = () => {
    currentNote.value = null
  }

  const clearSearchResults = () => {
    searchResults.value = []
  }

  return {
    // State
    notes,
    currentNote,
    isLoading,
    error,
    totalNotes,
    pagination,
    searchResults,
    filters,
    
    // Getters
    privateNotes,
    publicNotes,
    notesByCategory,
    allCategories,
    totalPages,
    
    // Actions
    fetchNotes,
    fetchNoteById,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    fetchNotesByCategory,
    updateFilters,
    resetFilters,
    clearError,
    clearCurrentNote,
    clearSearchResults
  }
}) 