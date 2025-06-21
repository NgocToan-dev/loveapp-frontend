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
        <h1 class="text-h4 font-weight-bold text-pink mb-1">
          <v-icon icon="mdi-heart-plus" class="mr-2"></v-icon>
          {{ $t('memories.createNew') || 'Create New Memory' }}
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          {{ $t('memories.createSubtitle') || 'Capture and preserve your precious moments' }}
        </p>
      </div>
    </div>

    <v-form ref="form" v-model="valid" @submit.prevent="saveMemory">
      <v-card>
        <v-card-text class="pa-6">
          <v-row>
            <!-- Title -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.title"
            :label="$t('memories.memoryTitle') || 'Memory Title'"
                :rules="titleRules"
                variant="outlined"
                prepend-inner-icon="mdi-format-title"
                required
                counter="100"
                maxlength="100"
              ></v-text-field>
            </v-col>

            <!-- Memory Date -->
            <v-col cols="12" md="4">
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
            <v-col cols="12" md="4">
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
            <v-col cols="12" md="6">
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
                rows="6"
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
                  #{{ tag }}
                </v-chip>
              </div>
              <v-text-field
                v-model="newTag"
                :label="$t('memories.addTag') || 'Add Tag'"
                variant="outlined"
                prepend-inner-icon="mdi-tag-plus"
                @keyup.enter="addTag"
                @keyup.comma="addTag"
                :hint="$t('memories.tagHint') || 'Press Enter or comma to add'"
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

            <!-- Privacy -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.isPrivate"
                :items="privacyOptions"
                :label="$t('memories.privacy') || 'Privacy'"
                variant="outlined"
                prepend-inner-icon="mdi-shield-account"
              ></v-select>
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
            {{ $t('common.cancel') || 'Cancel' }}
          </v-btn>
          <v-btn
            color="pink"
            variant="elevated"
            type="submit"
            :loading="isLoading"
            :disabled="!valid"
            prepend-icon="mdi-heart"
          >
            {{ $t('memories.save') || 'Save Memory' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMemoriesStore } from '@/stores/memories'

const { t } = useI18n()
const router = useRouter()
const memoriesStore = useMemoriesStore()

// Form references
const form = ref()
const valid = ref(false)

// Reactive data
const formData = ref({
  title: '',
  description: '',
  date: '',  // Changed from memoryDate to date
  location: '',
  category: '',  // Added required category
  tags: [] as string[],
  isPrivate: false
})

const newTag = ref('')
const isLoading = ref(false)

// Computed
const privacyOptions = computed(() => [
  { title: t('memories.public') || 'Public', value: false },
  { title: t('memories.private') || 'Private', value: true }
])

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

const saveMemory = async () => {
  if (!valid.value) return

  try {
    isLoading.value = true
    
    // Create memory using store
    await memoriesStore.createMemory({
      title: formData.value.title,
      description: formData.value.description,
      date: formData.value.date,  // Changed from memoryDate to date
      location: formData.value.location || '',
      category: formData.value.category,  // Added required category
      tags: formData.value.tags,
      isPrivate: formData.value.isPrivate
    })
    
    // Show success message and redirect
    router.push({ name: 'memories' })
  } catch (error) {
    console.error('Error creating memory:', error)
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.text-pink {
  color: rgb(233, 30, 99) !important;
}
</style> 