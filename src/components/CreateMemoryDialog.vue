<template>
  <v-card max-width="800" rounded="xl">
    <v-card-title class="text-h5 font-weight-bold pa-6">
      <v-icon color="pink" class="mr-2">mdi-heart-plus</v-icon>
      {{ $t('memories.createNew') || 'Create New Memory' }}
    </v-card-title>

    <v-card-text class="pa-6">
      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
        <v-row>
          <!-- Title -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.title"
              :label="$t('memories.title') || 'Memory Title'"
              :rules="titleRules"
              variant="outlined"
              prepend-inner-icon="mdi-format-title"
              required
              counter="100"
              maxlength="100"
            ></v-text-field>
          </v-col>

          <!-- Memory Date -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.date"
              :label="$t('memories.date') || 'Memory Date'"
              :rules="dateRules"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              type="date"
              required
            ></v-text-field>
          </v-col>

          <!-- Category -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.category"
              :items="categoryOptions"
              :label="$t('memories.category') || 'Category'"
              :rules="categoryRules"
              variant="outlined"
              prepend-inner-icon="mdi-folder"
              required
            ></v-select>
          </v-col>

          <!-- Location -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.location"
              :label="$t('memories.location') || 'Location (Optional)'"
              variant="outlined"
              prepend-inner-icon="mdi-map-marker"
              clearable
            ></v-text-field>
          </v-col>

          <!-- Description -->
          <v-col cols="12">
            <v-textarea
              v-model="formData.description"
              :label="$t('memories.description') || 'Description'"
              :rules="descriptionRules"
              variant="outlined"
              prepend-inner-icon="mdi-text"
              rows="4"
              required
              counter
              no-resize
            ></v-textarea>
          </v-col>

          <!-- Tags -->
          <v-col cols="12">
            <v-label class="mb-2">{{ $t('memories.tags') || 'Tags' }}</v-label>
            <div class="d-flex flex-wrap gap-2 mb-3">
              <v-chip
                v-for="(tag, index) in formData.tags"
                :key="index"
                closable
                @click:close="removeTag(index)"
                color="pink"
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

          <!-- Privacy -->
          <v-col cols="12">
            <v-switch
              v-model="formData.isPrivate"
              :label="$t('memories.private') || 'Private Memory'"
              color="pink"
              hide-details
            ></v-switch>
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
        color="pink"
        variant="elevated"
        :loading="isLoading"
        :disabled="!valid"
        @click="handleSubmit"
        prepend-icon="mdi-heart"
      >
        {{ $t('memories.save') || 'Save Memory' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemoriesStore } from '@/stores/memories'

const { t } = useI18n()
const memoriesStore = useMemoriesStore()

// Form references
const form = ref()
const valid = ref(false)

// Reactive data
const formData = ref({
  title: '',
  description: '',
  date: '',
  location: '',
  category: '',
  tags: [] as string[],
  isPrivate: false
})

const newTag = ref('')
const isLoading = ref(false)

// Computed
const categoryOptions = computed(() => [
  { title: 'Hẹn hò', value: 'date' },
  { title: 'Du lịch', value: 'travel' },
  { title: 'Kỷ niệm', value: 'milestone' },
  { title: 'Hằng ngày', value: 'daily' },
  { title: 'Đặc biệt', value: 'special' },
  { title: 'Khác', value: 'other' }
])

// Validation rules
const titleRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required',
  (v: string) => (v && v.length <= 100) || t('validation.maxLength', { max: 100 }) || 'Maximum 100 characters'
]

const dateRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required'
]

const categoryRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required'
]

const descriptionRules = [
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
    
    // Create memory using store
    const newMemory = await memoriesStore.createMemory({
      title: formData.value.title,
      description: formData.value.description,
      date: formData.value.date,
      location: formData.value.location || '',
      category: formData.value.category,
      tags: formData.value.tags,
      isPrivate: formData.value.isPrivate
    })
    
    // Emit success with the created memory
    emit('confirm', newMemory)
  } catch (error) {
    console.error('Error creating memory:', error)
    // Could show error toast here
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.text-pink {
  color: rgb(233, 30, 99) !important;
}
</style>
