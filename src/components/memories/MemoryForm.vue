<template>
  <Modal 
    :is-open="isOpen" 
    :title="isEditMode ? $t('memories.form.editTitle') : $t('memories.form.createTitle')"
    size="large"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('memories.form.title') }}
        </label>
        <Input
          id="title"
          v-model="form.title"
          :placeholder="$t('memories.form.titlePlaceholder')"
          :error="errors.title"
          required
        />
      </div>

      <!-- Date -->
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('memories.form.date') }}
        </label>
        <Input
          id="date"
          v-model="form.date"
          type="date"
          :error="errors.date"
          required
        />
      </div>

      <!-- Content -->
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('memories.form.content') }}
        </label>
        <textarea
          id="content"
          v-model="form.content"
          :placeholder="$t('memories.form.contentPlaceholder')"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.content }"
        />
        <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
      </div>

      <!-- Images -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('memories.form.images') }}
        </label>
        
        <!-- Image Upload Area -->
        <div
          @drop.prevent="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors"
          :class="{ 'border-pink-400 bg-pink-50': isDragging }"
        >
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <p class="mt-2 text-sm text-gray-600">
            {{ $t('memories.form.dragImages') }}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            class="mt-2"
            @click="$refs.fileInput.click()"
          >
            {{ $t('memories.form.selectImages') }}
          </Button>
        </div>

        <!-- Image Preview -->
        <div v-if="selectedImages.length > 0" class="mt-4 grid grid-cols-3 gap-4">
          <div
            v-for="(image, index) in selectedImages"
            :key="index"
            class="relative group"
          >
            <img
              :src="image.preview"
              :alt="`Image ${index + 1}`"
              class="w-full h-24 object-cover rounded-lg"
            />
            <button
              type="button"
              @click="removeImage(index)"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('memories.form.location') }}
        </label>
        <Input
          id="location"
          v-model="form.location.name"
          :placeholder="$t('memories.form.locationPlaceholder')"
          :error="errors.location"
        />
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('memories.form.tags') }}
        </label>
        <div class="flex flex-wrap gap-2 mb-2">
          <Badge
            v-for="tag in form.tags"
            :key="tag"
            :label="tag"
            variant="secondary"
            removable
            @remove="removeTag(tag)"
          />
        </div>
        <Input
          v-model="newTag"
          :placeholder="$t('memories.form.tagsPlaceholder')"
          @keydown.enter.prevent="addTag"
        />
      </div>

      <!-- Mood -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('memories.form.mood') }}
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="mood in availableMoods"
            :key="mood"
            type="button"
            @click="form.mood = form.mood === mood ? undefined : mood"
            class="flex items-center justify-center p-3 border rounded-lg transition-colors"
            :class="{
              'border-pink-500 bg-pink-50 text-pink-700': form.mood === mood,
              'border-gray-300 hover:border-gray-400': form.mood !== mood
            }"
          >
            <span class="text-xl mr-2">{{ getMoodEmoji(mood) }}</span>
            <span class="text-sm">{{ $t(`memories.moods.${mood}`) }}</span>
          </button>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="flex items-center justify-between">
        <div>
          <label class="flex items-center">
            <input
              v-model="form.isPrivate"
              type="checkbox"
              class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">{{ $t('memories.form.private') }}</span>
          </label>
          <p class="text-xs text-gray-500 mt-1">{{ $t('memories.form.privateDesc') }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          @click="handleClose"
        >
          {{ $t('common.actions.cancel') }}
        </Button>
        <Button
          type="submit"
          :loading="isSubmitting"
          :disabled="!isFormValid"
        >
          {{ isEditMode ? $t('common.actions.update') : $t('common.actions.create') }}
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemoriesStore, type Memory, type CreateMemoryData } from '@/stores/memories'
import Modal from '@/components/common/Modal.vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'

interface Props {
  isOpen: boolean
  memory?: Memory | null
}

interface Emits {
  close: []
  success: []
}

const props = withDefaults(defineProps<Props>(), {
  memory: null
})
const emit = defineEmits<Emits>()

const { t } = useI18n()
const memoriesStore = useMemoriesStore()

// Form state
const form = ref<CreateMemoryData>({
  title: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  images: [],
  tags: [],
  location: { name: '' },
  mood: undefined,
  isPrivate: false
})

const errors = ref<Record<string, string>>({})
const selectedImages = ref<Array<{ file: File; preview: string }>>([])
const newTag = ref('')
const isDragging = ref(false)
const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement>()

// Computed
const isEditMode = computed(() => !!props.memory)

const availableMoods: Memory['mood'][] = [
  'happy', 'love', 'excited', 'romantic', 'nostalgic', 'grateful'
]

const isFormValid = computed(() => {
  return form.value.title.trim() && form.value.content.trim() && form.value.date
})

// Methods
const getMoodEmoji = (mood: Memory['mood']) => {
  const moodEmojis = {
    happy: '😊',
    love: '💕',
    excited: '🎉',
    romantic: '🌹',
    nostalgic: '😌',
    grateful: '🙏'
  }
  return moodEmojis[mood] || '😊'
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    processFiles(Array.from(files))
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files) {
    processFiles(Array.from(files))
  }
}

const processFiles = (files: File[]) => {
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImages.value.push({
          file,
          preview: e.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

const removeImage = (index: number) => {
  selectedImages.value.splice(index, 1)
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.value.tags?.includes(tag)) {
    if (!form.value.tags) form.value.tags = []
    form.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (tag: string) => {
  if (form.value.tags) {
    const index = form.value.tags.indexOf(tag)
    if (index > -1) {
      form.value.tags.splice(index, 1)
    }
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = t('validation.required')
  }
  
  if (!form.value.content.trim()) {
    errors.value.content = t('validation.required')
  }
  
  if (!form.value.date) {
    errors.value.date = t('validation.required')
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  
  try {
    const submitData = {
      ...form.value,
      images: selectedImages.value.map(img => img.file)
    }

    if (isEditMode.value && props.memory) {
      await memoriesStore.updateMemory({
        id: props.memory.id,
        ...submitData
      })
    } else {
      await memoriesStore.createMemory(submitData)
    }

    emit('success')
    handleClose()
  } catch (error) {
    console.error('Failed to save memory:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    images: [],
    tags: [],
    location: { name: '' },
    mood: undefined,
    isPrivate: false
  }
  selectedImages.value = []
  newTag.value = ''
  errors.value = {}
}

const handleClose = () => {
  resetForm()
  emit('close')
}

// Watch for memory prop changes
watch(() => props.memory, (memory) => {
  if (memory) {
    form.value = {
      title: memory.title,
      content: memory.content,
      date: memory.date,
      tags: [...memory.tags],
      location: { ...memory.location } || { name: '' },
      mood: memory.mood,
      isPrivate: memory.isPrivate
    }
    // Note: We don't populate selectedImages for existing images in edit mode
    // This would require converting URLs back to File objects
  }
}, { immediate: true })

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    nextTick(() => {
      resetForm()
    })
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
