<template>
  <v-container fluid max-width="800">
    <!-- Header -->
    <div class="d-flex align-center mb-6">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        class="mr-3"
        @click="goBack"
      ></v-btn>
      <div>
        <h1 class="text-h4 font-weight-bold text-primary mb-1">
          <v-icon icon="mdi-note-plus" class="mr-2"></v-icon>
          {{ $t('notes.createNew') }}
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          {{ $t('notes.createSubtitle') }}
        </p>
      </div>
    </div>

    <v-form ref="form" v-model="valid">
      <v-card>
        <v-card-text class="pa-6">
          <v-row>
            <!-- Title -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.title"
                :label="$t('notes.noteTitle')"
                :rules="titleRules"
                variant="outlined"
                prepend-inner-icon="mdi-format-title"
                required
                counter="100"
                maxlength="100"
              ></v-text-field>
            </v-col>

            <!-- Category -->
            <v-col cols="12" md="6">
              <v-combobox
                v-model="formData.category"
                :items="suggestedCategories"
                :label="$t('notes.category')"
                :rules="categoryRules"
                variant="outlined"
                prepend-inner-icon="mdi-folder"
                required
                clearable
              ></v-combobox>
            </v-col>

            <!-- Privacy -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.isPrivate"
                :items="privacyOptions"
                :label="$t('notes.privacy')"
                variant="outlined"
                prepend-inner-icon="mdi-shield-account"
              ></v-select>
            </v-col>

            <!-- Content -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.content"
                :label="$t('notes.content')"
                :rules="contentRules"
                variant="outlined"
                prepend-inner-icon="mdi-text"
                rows="10"
                required
                counter
                no-resize
              ></v-textarea>
            </v-col>

            <!-- Tags -->
            <v-col cols="12">
              <v-label class="mb-2">{{ $t('notes.tags') }}</v-label>
              <div class="d-flex flex-wrap gap-2 mb-3">
                <v-chip
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  closable
                  @click:close="removeTag(index)"
                  color="primary"
                  variant="tonal"
                >
                  #{{ tag }}
                </v-chip>
              </div>
              <v-text-field
                v-model="newTag"
                :label="$t('notes.addTag')"
                variant="outlined"
                prepend-inner-icon="mdi-tag-plus"
                @keyup.enter="addTag"
                @keyup.comma="addTag"
                :hint="$t('notes.tagHint')"
                persistent-hint
              >
                <template v-slot:append-inner>
                  <v-btn
                    icon="mdi-plus"
                    variant="text"
                    size="small"
                    @click="addTag"
                    :disabled="!newTag.trim()"
                  ></v-btn>
                </template>
              </v-text-field>
            </v-col>

            <!-- Suggested Tags -->
            <v-col v-if="suggestedTags.length > 0" cols="12">
              <v-label class="mb-2">{{ $t('notes.suggestedTags') }}</v-label>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="tag in suggestedTags"
                  :key="tag"
                  @click="addSuggestedTag(tag)"
                  variant="outlined"
                  size="small"
                  class="cursor-pointer"
                >
                  +{{ tag }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="goBack"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="isLoading"
            :disabled="!valid"
            prepend-icon="mdi-content-save"
            @click="saveNoteWithDraftClear"
          >
            {{ $t('notes.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>

  <!-- Floating Action Button for Preview -->
    <v-fab
      icon="mdi-eye"
      location="bottom end"
      app
      color="secondary"
      @click="showPreview"
      :disabled="!formData.title || !formData.content"
    ></v-fab>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotesStore } from '@/stores/notes'
import type { CreateNoteData } from '@/services/notes'

const { t } = useI18n()
const router = useRouter()
const notesStore = useNotesStore()

// Form references
const form = ref()
const valid = ref(false)

// Reactive data
const formData = ref<CreateNoteData>({
  title: '',
  content: '',
  category: '',
  tags: [],
  isPrivate: false
})

const newTag = ref('')
const previewDialog = ref(false)
const isLoading = ref(false)

// Computed
const privacyOptions = computed(() => [
  { title: t('notes.public'), value: false },
  { title: t('notes.private'), value: true }
])

const suggestedCategories = computed(() => [
  'Personal',
  'Work',
  'Ideas',
  'Quotes',
  'Recipes',
  'Travel',
  'Health',
  'Finance',
  'Learning'
])

const suggestedTags = computed(() => {
  const commonTags = ['love', 'memories', 'important', 'todo', 'ideas', 'goals']
  return commonTags.filter(tag => !formData.value.tags.includes(tag))
})

// Validation rules
const titleRules = [
  (v: string) => !!v || t('validation.required'),
  (v: string) => (v && v.length <= 100) || t('validation.maxLength', { max: 100 })
]

const categoryRules = [
  (v: string) => !!v || t('validation.required')
]

const contentRules = [
  (v: string) => !!v || t('validation.required'),
  (v: string) => (v && v.length >= 10) || t('validation.minLength', { min: 10 })
]

// Methods
const addTag = () => {
  const tag = newTag.value.trim().replace(',', '')
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
    newTag.value = ''
  }
}

const addSuggestedTag = (tag: string) => {
  if (!formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
  }
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

const showPreview = () => {
  previewDialog.value = true
}

const saveNote = async () => {
  if (!valid.value) return

  try {
    isLoading.value = true
    await notesStore.createNote(formData.value)
    
    // Show success message and redirect
    router.push({ name: 'notes' })
  } catch (error) {
    console.error('Error creating note:', error)
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.back()
}

// Auto-save to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('notesDraft', JSON.stringify(formData.value))
}

const loadFromLocalStorage = () => {
  const draft = localStorage.getItem('notesDraft')
  if (draft) {
    try {
      const parsedDraft = JSON.parse(draft)
      formData.value = { ...formData.value, ...parsedDraft }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }
}

const clearDraft = () => {
  localStorage.removeItem('notesDraft')
}

// Lifecycle
onMounted(() => {
  loadFromLocalStorage()
})

// Auto-save on form changes
import { watchEffect } from 'vue'
watchEffect(() => {
  if (formData.value.title || formData.value.content) {
    saveToLocalStorage()
  }
})

// Wrapper function to clear draft on successful save
const saveNoteWithDraftClear = async () => {
  await saveNote()
  clearDraft()
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.v-textarea :deep(.v-field__input) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style> 