<template>
  <v-dialog v-model="internalValue" max-width="600" persistent>
    <v-card>
      <v-card-title class="text-h6">
        <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
        {{ $t('files.editMetadata') || 'Edit File Metadata' }}
      </v-card-title>
      
      <v-card-text class="pa-6">
        <v-form ref="form" v-model="valid">
          <v-row>
            <!-- File Name -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.fileName"
                :label="$t('files.fileName') || 'File Name'"
                :rules="fileNameRules"
                variant="outlined"
                prepend-inner-icon="mdi-file"
                required
              ></v-text-field>
            </v-col>

            <!-- Category -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.category"
                :items="categoryOptions"
                :label="$t('files.category') || 'Category'"
                variant="outlined"
                prepend-inner-icon="mdi-folder"
              ></v-select>
            </v-col>

            <!-- Visibility -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.isPublic"
                :items="visibilityOptions"
                :label="$t('files.visibility') || 'Visibility'"
                variant="outlined"
                prepend-inner-icon="mdi-shield-account"
              ></v-select>
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                :label="$t('files.description') || 'Description (Optional)'"
                variant="outlined"
                prepend-inner-icon="mdi-text"
                rows="3"
                counter="500"
                maxlength="500"
                no-resize
              ></v-textarea>
            </v-col>

            <!-- Tags -->
            <v-col cols="12">
              <v-label class="mb-2">{{ $t('files.tags') || 'Tags' }}</v-label>
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
                :label="$t('files.addTag') || 'Add Tag'"
                variant="outlined"
                prepend-inner-icon="mdi-tag-plus"
                @keyup.enter="addTag"
                @keyup.comma="addTag"
                :hint="$t('files.tagHint') || 'Press Enter or comma to add'"
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
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="cancel"
        >
          {{ $t('common.cancel') || 'Cancel' }}
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="isLoading"
          :disabled="!valid"
          @click="save"
        >
          {{ $t('files.saveChanges') || 'Save Changes' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFilesStore } from '@/stores/files'
import type { FileItem } from '@/types'

interface Props {
  modelValue: boolean
  file: FileItem | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'file-updated', file: FileItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const filesStore = useFilesStore()

const form = ref()
const valid = ref(false)
const isLoading = ref(false)
const newTag = ref('')

const formData = ref({
  fileName: '',
  category: '',
  description: '',
  tags: [] as string[],
  isPublic: false
})

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const categoryOptions = computed(() => [
  { title: t('files.categories.images') || 'Images', value: 'images' },
  { title: t('files.categories.documents') || 'Documents', value: 'documents' },
  { title: t('files.categories.videos') || 'Videos', value: 'videos' },
  { title: t('files.categories.audio') || 'Audio', value: 'audio' },
  { title: t('files.categories.archives') || 'Archives', value: 'archives' },
  { title: t('files.categories.other') || 'Other', value: 'other' }
])

const visibilityOptions = computed(() => [
  { title: t('files.private') || 'Private', value: false },
  { title: t('files.public') || 'Public', value: true }
])

const fileNameRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required',
  (v: string) => (v && v.length >= 1) || t('validation.minLength', { min: 1 }) || 'Minimum 1 character',
  (v: string) => (v && v.length <= 255) || t('validation.maxLength', { max: 255 }) || 'Maximum 255 characters'
]

// Watch for file changes to populate form
watch(() => props.file, (newFile) => {
  if (newFile) {
    formData.value = {
      fileName: newFile.fileName || newFile.originalName,
      category: newFile.category || '',
      description: newFile.description || '',
      tags: [...(newFile.tags || [])],
      isPublic: newFile.isPublic || false
    }
  }
}, { immediate: true })

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

const save = async () => {
  if (!props.file || !valid.value) return

  try {
    isLoading.value = true
      const updatedFile = await filesStore.updateFile(props.file.id, {
      name: formData.value.fileName,
      description: formData.value.description || undefined,
      tags: formData.value.tags
    })
    
    emit('file-updated', updatedFile)
  } catch (error) {
    console.error('Error updating file metadata:', error)
  } finally {
    isLoading.value = false
  }
}

const cancel = () => {
  internalValue.value = false
  newTag.value = ''
}
</script>
