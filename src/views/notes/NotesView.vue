<template>
  <v-container fluid>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary mb-2">
          <v-icon icon="mdi-note-text" class="mr-2"></v-icon>
          {{ $t('notes.title') }}
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          {{ $t('notes.subtitle') }}
        </p>
      </div>
      <v-btn
        color="primary"
        size="large"
        variant="elevated"
        @click="createNote"
        prepend-icon="mdi-plus"
      >
        {{ $t('notes.create') }}
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4">
          <v-icon icon="mdi-note-text" size="48" color="primary" class="mb-2"></v-icon>
          <div class="text-h4 font-weight-bold">{{ totalNotes }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ $t('notes.total') }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4">
          <v-icon icon="mdi-folder" size="48" color="success" class="mb-2"></v-icon>
          <div class="text-h4 font-weight-bold">{{ allCategories.length }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ $t('notes.categories') }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4">
          <v-icon icon="mdi-lock" size="48" color="orange" class="mb-2"></v-icon>
          <div class="text-h4 font-weight-bold">{{ privateNotes.length }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ $t('notes.private') }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4">
          <v-icon icon="mdi-earth" size="48" color="info" class="mb-2"></v-icon>
          <div class="text-h4 font-weight-bold">{{ publicNotes.length }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ $t('notes.public') }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and Filters -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              :label="$t('common.search')"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              @input="onSearchInput"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedCategory"
              :items="categoryItems"
              :label="$t('notes.category')"
              variant="outlined"
              clearable
              @update:model-value="applyFilters"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="privacyFilter"
              :items="privacyItems"
              :label="$t('notes.privacy')"
              variant="outlined"
              clearable
              @update:model-value="applyFilters"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Notes List -->
    <v-row>
      <v-col
        v-for="note in displayedNotes"
        :key="note.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="h-100 hover-card"
          @click="viewNote(note.id)"
          :class="{ 'border-primary': note.isPrivate }"
        >
          <v-card-title class="d-flex justify-space-between align-start">
            <div class="flex-grow-1">
              <div class="text-h6 mb-1">{{ note.title }}</div>
              <div class="d-flex align-center">
                <v-chip
                  :color="getCategoryColor(note.category)"
                  size="small"
                  variant="tonal"
                  class="mr-2"
                >
                  {{ note.category }}
                </v-chip>
                <v-icon
                  v-if="note.isPrivate"
                  icon="mdi-lock"
                  size="small"
                  color="orange"
                ></v-icon>
              </div>
            </div>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  v-bind="props"
                  @click.stop
                ></v-btn>
              </template>
              <v-list>
                <v-list-item @click="editNote(note.id)">
                  <v-list-item-title>
                    <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
                    {{ $t('common.edit') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteNote(note.id)" class="text-error">
                  <v-list-item-title>
                    <v-icon icon="mdi-delete" class="mr-2"></v-icon>
                    {{ $t('common.delete') }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          
          <v-card-text>
            <p class="text-body-2 text-medium-emphasis mb-3">
              {{ truncateText(note.content, 120) }}
            </p>
            
            <div v-if="note.tags.length > 0" class="mb-3">
              <v-chip
                v-for="tag in note.tags.slice(0, 3)"
                :key="tag"
                size="x-small"
                variant="outlined"
                class="mr-1 mb-1"
              >
                #{{ tag }}
              </v-chip>
              <span v-if="note.tags.length > 3" class="text-caption text-medium-emphasis">
                +{{ note.tags.length - 3 }} more
              </span>
            </div>
            
            <div class="text-caption text-medium-emphasis">
              {{ $t('common.updated') }}: {{ formatDate(note.updatedAt) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-if="!isLoading && displayedNotes.length === 0" class="text-center py-12">
      <v-card-text>
        <v-icon icon="mdi-note-text-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
        <h3 class="text-h5 mb-2">
          {{ searchQuery ? $t('notes.noSearchResults') : $t('notes.noNotes') }}
        </h3>
        <p class="text-body-1 text-medium-emphasis mb-4">
          {{ searchQuery ? $t('notes.tryDifferentSearch') : $t('notes.createFirstNote') }}
        </p>
        <v-btn
          v-if="!searchQuery"
          color="primary"
          variant="elevated"
          @click="createNote"
          prepend-icon="mdi-plus"
        >
          {{ $t('notes.create') }}
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @update:model-value="onPageChange"
      ></v-pagination>
    </div>

    <!-- Loading -->
    <v-overlay :model-value="isLoading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">{{ $t('notes.deleteConfirm') }}</v-card-title>
        <v-card-text>
          {{ $t('notes.deleteWarning') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">{{ $t('common.cancel') }}</v-btn>
          <v-btn color="error" @click="confirmDelete">{{ $t('common.delete') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotesStore } from '@/stores/notes'
import dayjs from 'dayjs'

const { t } = useI18n()
const router = useRouter()
const notesStore = useNotesStore()

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref('')
const privacyFilter = ref('')
const currentPage = ref(1)
const deleteDialog = ref(false)
const noteToDelete = ref('')

// Computed
const {
  notes,
  isLoading,
  error,
  totalNotes,
  totalPages,
  allCategories,
  privateNotes,
  publicNotes,
  searchResults
} = notesStore

const displayedNotes = computed(() => {
  if (searchQuery.value) {
    return searchResults || []
  }
  return notes || []
})

const categoryItems = computed(() => [
  { title: t('common.all'), value: '' },
  ...allCategories.map(category => ({
    title: category,
    value: category
  }))
])

const privacyItems = computed(() => [
  { title: t('common.all'), value: '' },
  { title: t('notes.private'), value: 'private' },
  { title: t('notes.public'), value: 'public' }
])

// Methods
const fetchNotes = async () => {
  const filters: any = {
    page: currentPage.value,
    limit: 12
  }
  
  if (selectedCategory.value) {
    filters.category = selectedCategory.value
  }
  
  if (privacyFilter.value) {
    filters.isPrivate = privacyFilter.value === 'private'
  }
  
  await notesStore.fetchNotes(filters)
}

const onSearchInput = async () => {
  if (searchQuery.value.trim()) {
    await notesStore.searchNotes(searchQuery.value, selectedCategory.value)
  } else {
    notesStore.clearSearchResults()
    await fetchNotes()
  }
}

const applyFilters = async () => {
  currentPage.value = 1
  if (searchQuery.value.trim()) {
    await notesStore.searchNotes(searchQuery.value, selectedCategory.value)
  } else {
    await fetchNotes()
  }
}

const onPageChange = async (page: number) => {
  currentPage.value = page
  await fetchNotes()
}

const createNote = () => {
  router.push({ name: 'create-note' })
}

const viewNote = (id: string) => {
  router.push({ name: 'note-detail', params: { id } })
}

const editNote = (id: string) => {
  router.push({ name: 'note-detail', params: { id }, query: { edit: 'true' } })
}

const deleteNote = (id: string) => {
  noteToDelete.value = id
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await notesStore.deleteNote(noteToDelete.value)
    deleteDialog.value = false
    noteToDelete.value = ''
  } catch (error) {
    console.error('Error deleting note:', error)
  }
}

const getCategoryColor = (category: string) => {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error']
  const index = category.length % colors.length
  return colors[index]
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const formatDate = (date: Date) => {
  return dayjs(date).format('MMM D, YYYY')
}

// Lifecycle
onMounted(() => {
  fetchNotes()
})

// Watchers
watch(() => notesStore.error, (newError) => {
  if (newError) {
    console.error('Notes error:', newError)
  }
})
</script>

<style scoped>
.hover-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.border-primary {
  border-left: 4px solid rgb(var(--v-theme-primary));
}
</style> 