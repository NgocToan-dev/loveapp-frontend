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
  const searchResults = ref<Note[]>([])
  const filters = ref<NoteFilters>({
    page: 1,
    limit: 10,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  })

  // Getters
  const privateNotes = computed(() => 
    notes.value.filter(note => note.isPrivate)
  )

  const publicNotes = computed(() => 
    notes.value.filter(note => !note.isPrivate)
  )

  const notesByCategory = computed(() => {
    const categories: Record<string, Note[]> = {}
    notes.value.forEach(note => {
      if (!categories[note.category]) {
        categories[note.category] = []
      }
      categories[note.category].push(note)
    })
    return categories
  })

  const allCategories = computed(() => 
    [...new Set(notes.value.map(note => note.category))]
  )

  const totalPages = computed(() => 
    Math.ceil(totalNotes.value / (filters.value.limit || 10))
  )

  // Actions
  const fetchNotes = async (customFilters?: Partial<NoteFilters>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const mergedFilters = { ...filters.value, ...customFilters }
      const response = await notesService.getNotes(mergedFilters)
      
      if (response.success && response.data) {
        notes.value = response.data.notes
        totalNotes.value = response.data.total
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch notes'
      console.error('Error fetching notes:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchNoteById = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await notesService.getNoteById(id)
      
      if (response.success && response.data) {
        currentNote.value = response.data
        return response.data
      }
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
      
      if (response.success && response.data) {
        notes.value.unshift(response.data)
        totalNotes.value += 1
        return response.data
      }
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
      
      if (response.success && response.data) {
        const index = notes.value.findIndex(note => note.id === id)
        if (index !== -1) {
          notes.value[index] = response.data
        }
        if (currentNote.value?.id === id) {
          currentNote.value = response.data
        }
        return response.data
      }
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
      
      const response = await notesService.deleteNote(id)
      
      if (response.success) {
        notes.value = notes.value.filter(note => note.id !== id)
        totalNotes.value -= 1
        if (currentNote.value?.id === id) {
          currentNote.value = null
        }
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
      
      if (response.success && response.data) {
        searchResults.value = response.data
        return response.data
      }
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
      
      if (response.success && response.data) {
        return response.data
      }
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