<template>
  <v-container class="pa-6" max-width="800">    <div class="text-center mb-8">
      <h1 class="font-heading text-3xl mb-4" :style="{ color: 'rgb(var(--v-theme-on-surface))' }">
        ✏️ {{ t('notes.editNote') }}
      </h1>
      <p class="text-lg font-script" :style="{ color: 'rgb(var(--v-theme-on-surface-variant))' }">
        {{ t('notes.editSubtitle') }}
      </p>
    </div>

    <v-card rounded="xl" class="love-card-hover" elevation="0" :style="{ backgroundColor: 'rgb(var(--v-theme-surface))' }">
      <v-card-text class="pa-8">
        <v-form ref="noteForm" @submit.prevent="updateNote">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="noteData.title"
                :label="t('notes.noteTitle')"
                variant="outlined"
                rounded="lg"
                :rules="[v => !!v || t('validation.titleRequired')]"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="noteData.content"
                :label="t('notes.content')"
                variant="outlined"
                rounded="lg"
                rows="8"
                :rules="[v => !!v || t('validation.contentRequired')]"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>            <v-col cols="12" md="6">
              <v-text-field
                v-model="noteData.category"
                :label="t('notes.category')"
                variant="outlined"
                rounded="lg"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-switch
                v-model="noteData.isPrivate"
                :label="t('notes.private')"
                color="primary"
                hide-details
              />
            </v-col>

            <v-col cols="12">
              <v-chip-group v-model="selectedTags" multiple color="primary">
                <v-chip
                  v-for="tag in availableTags"
                  :key="tag"
                  :value="tag"
                  filter
                  variant="outlined"
                  rounded="lg"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <div class="d-flex justify-space-between flex-wrap gap-3">
            <v-btn
              variant="outlined"
              rounded="lg"
              size="large"
              @click="goBack"
              :style="{ color: 'rgb(var(--v-theme-on-surface))' }"
            >              <v-icon start>mdi-arrow-left</v-icon>
              {{ t('common.cancel') }}
            </v-btn>
            
            <v-btn
              color="primary"
              variant="flat"
              rounded="lg"
              size="large"
              type="submit"
              :loading="loading"
            >              <v-icon start>mdi-content-save</v-icon>
              {{ t('notes.update') }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const noteForm = ref()
const loading = ref(false)
const selectedTags = ref<string[]>([])

const noteData = ref({
  title: '',
  content: '',
  category: '',
  isPrivate: false
})

const availableTags = [
  'Tình yêu', 'Hẹn hò', 'Kỷ niệm', 'Gia đình', 'Du lịch', 
  'Công việc', 'Suy tư', 'Mơ ước', 'Kế hoạch', 'Cảm xúc'
]

const loadNote = async () => {
  const noteId = route.params.id as string
  const note = notesStore.notes.find(n => n.id === noteId)
  
  if (note) {    noteData.value = {
      title: note.title,
      content: note.content,
      category: note.category || '',
      isPrivate: note.isPrivate
    }
    selectedTags.value = note.tags || []
  } else {
    // Try to fetch from API if not in store
    await notesStore.fetchNotes()
    const fetchedNote = notesStore.notes.find(n => n.id === noteId)
    if (fetchedNote) {      noteData.value = {
        title: fetchedNote.title,
        content: fetchedNote.content,
        category: fetchedNote.category || '',
        isPrivate: fetchedNote.isPrivate
      }
      selectedTags.value = fetchedNote.tags || []
    } else {
      // Note not found, redirect to notes list
      router.push('/notes')
    }
  }
}

const updateNote = async () => {
  const { valid } = await noteForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const noteId = route.params.id as string
    const updatedNote: Partial<Note> = {
      id: noteId,
      title: noteData.value.title,
      content: noteData.value.content,
      category: noteData.value.category,
      isPrivate: noteData.value.isPrivate,
      tags: selectedTags.value
    }

    await notesStore.updateNote(noteId, updatedNote)
    router.push('/notes')
  } catch (error) {
    console.error('Failed to update note:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/notes')
}

onMounted(() => {
  loadNote()
})
</script>

<style scoped>
.love-card-hover {
  transition: all 0.3s ease;
  border: 1px solid rgb(var(--v-theme-outline-variant));
}

.love-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.15);
}
</style>
