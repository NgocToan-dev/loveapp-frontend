<template>
  <v-card max-width="800" rounded="xl">
    <v-card-title class="text-h5 font-weight-bold pa-6">
      <v-icon color="primary" class="mr-2">mdi-note-edit</v-icon>
      {{ $t('notes.edit') || 'Edit Note' }}
    </v-card-title>

    <v-card-text class="pa-6">
      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
        <v-row>
          <!-- Title -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.title"
              :label="$t('notes.title') || 'Note Title'"
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
              :items="categoryOptions"
              :label="$t('notes.category') || 'Category'"
              :rules="categoryRules"
              variant="outlined"
              prepend-inner-icon="mdi-folder"
              required
            ></v-combobox>
          </v-col>

          <!-- Privacy -->
          <v-col cols="12" md="6">
            <v-switch
              v-model="formData.isPrivate"
              :label="$t('notes.private') || 'Private Note'"
              color="primary"
              hide-details
            ></v-switch>
          </v-col>

          <!-- Content -->
          <v-col cols="12">
            <v-textarea
              v-model="formData.content"
              :label="$t('notes.content') || 'Content'"
              :rules="contentRules"
              variant="outlined"
              prepend-inner-icon="mdi-text"
              rows="8"
              required
              counter
              no-resize
            ></v-textarea>
          </v-col>

          <!-- Tags -->
          <v-col cols="12">
            <v-label class="mb-2">{{ $t('notes.tags') || 'Tags' }}</v-label>
            <div class="d-flex flex-wrap gap-2 mb-3">
              <v-chip
                v-for="(tag, index) in formData.tags"
                :key="index"
                closable
                @click:close="removeTag(index)"
                color="primary"
                variant="tonal"
              >
                {{ tag }}
              </v-chip>
            </div>
            <v-text-field
              v-model="newTag"
              label="Add tag and press Enter"
              variant="outlined"
              density="compact"
              @keyup.enter="addTag"
              prepend-inner-icon="mdi-tag"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="pa-6">
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        @click="$emit('cancel')"
      >
        {{ $t('common.cancel') || 'Cancel' }}
      </v-btn>
      <v-btn
        color="primary"
        variant="elevated"
        :loading="isLoading"
        :disabled="!valid"
        @click="handleSubmit"
        prepend-icon="mdi-content-save"
      >
        {{ $t('notes.update') || 'Update Note' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotesStore } from '@/stores/notes'

interface Props {
  note: any
}

const props = defineProps<Props>()
const { t } = useI18n()
const notesStore = useNotesStore()

// Form references
const form = ref()
const valid = ref(false)

// Reactive data
const formData = ref({
  title: '',
  content: '',
  category: '',
  tags: [] as string[],
  isPrivate: false
})

const newTag = ref('')
const isLoading = ref(false)

// Computed
const categoryOptions = computed(() => [
  'Personal',
  'Work',
  'Ideas', 
  'Thoughts',
  'Memories',
  'Goals',
  'Other'
])

// Validation rules
const titleRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required',
  (v: string) => (v && v.length <= 100) || t('validation.maxLength', { max: 100 }) || 'Maximum 100 characters'
]

const categoryRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required'
]

const contentRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required',
  (v: string) => (v && v.length >= 10) || t('validation.minLength', { min: 10 }) || 'Minimum 10 characters'
]

// Events
const emit = defineEmits<{
  confirm: [data: any]
  cancel: []
}>()

// Methods
const addTag = () => {
  const tag = newTag.value.trim().replace(',', '')
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

const handleSubmit = async () => {
  if (!valid.value) return

  try {
    isLoading.value = true
    
    // Update note using store
    const updatedNote = await notesStore.updateNote(props.note.id, {
      title: formData.value.title,
      content: formData.value.content,
      category: formData.value.category,
      tags: formData.value.tags,
      isPrivate: formData.value.isPrivate
    })
    
    // Emit success with the updated note
    emit('confirm', updatedNote)
  } catch (error) {
    console.error('Error updating note:', error)
    // Could show error toast here
  } finally {
    isLoading.value = false
  }
}

// Initialize form with note data
onMounted(() => {
  if (props.note) {
    formData.value = {
      title: props.note.title || '',
      content: props.note.content || '',
      category: props.note.category || '',
      tags: props.note.tags || [],
      isPrivate: props.note.isPrivate || false
    }
  }
})
</script>
