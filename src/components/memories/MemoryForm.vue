<template>
  <Modal 
    :is-open="isOpen" 
    :title="isEditMode ? $t('memories.form.editTitle') : $t('memories.form.createTitle')"
    size="lg"
    :close-on-backdrop="false"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title -->
      <div class="mt-2">
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

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('memories.form.description') }}
        </label>
        <textarea
          id="description"
          v-model="form.description"
          :placeholder="$t('memories.form.descriptionPlaceholder')"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.description }"
          required
        />
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
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
          @dragover.prevent="handleDragOver"
          @dragenter.prevent="handleDragEnter"
          @dragleave.prevent="handleDragLeave"
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors cursor-pointer"
          :class="{ 'border-pink-400 bg-pink-50': isDragging }"
          @click="handleUploadAreaClick"
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
            @click="fileInput?.click()"
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
              :class="{ 'opacity-50': image.isUploading }"
            />
            
            <!-- Upload loading indicator -->
            <div
              v-if="image.isUploading"
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg"
            >
              <div class="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
            
            <!-- Upload success indicator -->
            <div
              v-else-if="image.url && !image.isExisting"
              class="absolute top-1 left-1 bg-green-500 text-white rounded-full p-1"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            
            <!-- Upload error indicator -->
            <div
              v-else-if="image.uploadError"
              class="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1"
              :title="image.uploadError"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            
            <Button
              type="button"
              @click="removeImage(index)"
              variant="outline"
              size="sm"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              :disabled="image.isUploading"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </Button>
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
          v-model="form.location"
          :placeholder="$t('memories.form.locationPlaceholder')"
          :error="errors.location"
        />
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('memories.form.tags') }}
        </label>
        
        <!-- Current Tags Display -->
        <div v-if="form.tags && form.tags.length > 0" class="mb-2">
          <div class="flex flex-wrap gap-2">
            <Badge
              v-for="tag in form.tags"
              :key="tag"
              variant="secondary"
              class="inline-flex items-center"
            >
              {{ $t(`memories.tags.${tag}`) }}
              <button
                type="button"
                @click="removeTag(tag)"
                class="ml-1 text-gray-400 hover:text-gray-600"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </Badge>
          </div>
        </div>

        <!-- Tag Selection -->
        <div class="relative">
          <ComboBox
            v-model="selectedTagOption"
            :options="tagOptions"
            key-value="id"
            display-value="name"
            :placeholder="$t('memories.form.selectTag')"
            @update:modelValue="handleTagSelection"
          />
        </div>
      </div>

      <!-- Mood -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('memories.form.mood') }}
        </label>
        <div class="grid grid-cols-3 gap-2">
          <Button
            v-for="mood in availableMoods"
            :key="mood"
            type="button"
            @click="form.mood = form.mood === mood ? undefined : mood"
            :variant="form.mood === mood ? 'primary' : 'outline'"
            class="flex items-center justify-center p-3"
          >
            <span class="text-xl mr-2">{{ getMoodEmoji(mood) }}</span>
            <span class="text-sm">{{ $t(`memories.moods.${mood}`) }}</span>
          </Button>
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
import { memoriesService } from '@/services/memories'
import Modal from '@/components/common/Modal.vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import ComboBox from '@/components/common/ComboBox.vue'

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

// Form state - Updated to use string URLs for images
const form = ref<CreateMemoryData>({
  title: '',
  description: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  images: [], // This will now be array of URLs
  tags: [],
  location: '',
  mood: undefined,
  isPrivate: false
})

const errors = ref<Record<string, string>>({})
const selectedImages = ref<Array<{ 
  file: File | null; 
  preview: string; 
  isExisting?: boolean; 
  url?: string;
  isUploading?: boolean;
  uploadError?: string;
}>>([])
const newTag = ref('')
const selectedTag = ref('')
const isDragging = ref(false)
const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement>()

// Computed
const isEditMode = computed(() => !!props.memory)

const availableMoods: Memory['mood'][] = [
  'happy', 'love', 'excited', 'romantic', 'nostalgic', 'grateful'
]

const availableTags = [
  'anniversary', 'date', 'travel', 'food', 'family', 'friends', 
  'celebration', 'milestone', 'gift', 'surprise', 'adventure', 'home'
]

// Transform tags for ComboBox component - only show unselected tags
const tagOptions = computed(() => 
  availableTags
    .filter(tag => !form.value.tags?.includes(tag))
    .map(tag => ({
      id: tag,
      name: t(`memories.tags.${tag}`)
    }))
)

// Available tags that haven't been selected yet
const availableTagsForSelection = computed(() => 
  availableTags.filter(tag => !form.value.tags?.includes(tag))
)

const selectedTagOption = ref<{ id: string; name: string }[]>([])

const isFormValid = computed(() => {
  return form.value.title.trim() && form.value.description.trim() && form.value.date
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
  } as const
  return mood ? moodEmojis[mood] || '😊' : '😊'
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  console.log('Files selected:', files?.length || 0)
  if (files) {
    processFiles(Array.from(files))
  }
}

const handleUploadAreaClick = (event: Event) => {
  // Only trigger file input if click is not from the button
  const target = event.target as HTMLElement
  if (!target.closest('button')) {
    fileInput.value?.click()
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  console.log('Files dropped:', files?.length || 0)
  if (files) {
    processFiles(Array.from(files))
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  // Only set to false if we're leaving the drop zone entirely
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
    isDragging.value = false
  }
}

const processFiles = (files: File[]) => {
  console.log('Processing files:', files.length)
  files.forEach((file, index) => {
    console.log(`File ${index}:`, { name: file.name, type: file.type, size: file.size })
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log(`File ${index} processed successfully`)
        selectedImages.value.push({
          file,
          preview: e.target?.result as string,
          isExisting: false,
          isUploading: false
        })
        
        console.log('Total selected images:', selectedImages.value.length)
      }
      reader.readAsDataURL(file)
    } else {
      console.log(`File ${index} skipped - not an image`)
    }
  })
}

const uploadImage = async (imageItem: typeof selectedImages.value[0]) => {
  if (!imageItem.file || imageItem.isExisting || imageItem.url) return imageItem.url

  imageItem.isUploading = true
  imageItem.uploadError = undefined
  
  try {
    console.log('Uploading image:', imageItem.file.name)
    const response = await memoriesService.uploadImage(imageItem.file)
    imageItem.url = response.url
    console.log('Image uploaded successfully:', response.url)
    return response.url
  } catch (error) {
    console.error('Failed to upload image:', error)
    imageItem.uploadError = 'Upload failed'
    throw error
  } finally {
    imageItem.isUploading = false
  }
}

const removeImage = (index: number) => {
  const imageToRemove = selectedImages.value[index]
  
  // Remove from selectedImages UI array
  selectedImages.value.splice(index, 1)
  
  console.log('Image removed:', { index, remaining: selectedImages.value.length })
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.value.tags?.includes(tag)) {
    if (!form.value.tags) form.value.tags = []
    form.value.tags.push(tag)
    newTag.value = ''
  }
}

const handleTagSelection = (values: any[]) => {
  // Check if new tags were added
  if (values && values.length > 0) {
    // Get the newly selected tags
    const currentTags = form.value.tags || []
    
    values.forEach(option => {
      if (option && option.id && !currentTags.includes(option.id)) {
        if (!form.value.tags) form.value.tags = []
        form.value.tags.push(option.id)
      }
    })
    
    // Clear the selection after adding tags
    selectedTagOption.value = []
  }
}

const addCustomTag = () => {
  addTag()
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
  
  if (!form.value.description.trim()) {
    errors.value.description = t('validation.required')
  }
  
  if (form.value.content && !form.value.content.trim()) {
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
    // Upload all new images first and get their URLs
    const imageUploadPromises = selectedImages.value
      .filter(img => !img.isExisting && img.file && !img.url)
      .map(img => uploadImage(img))

    console.log('Uploading images:', imageUploadPromises.length)
    
    // Wait for all images to upload
    await Promise.all(imageUploadPromises)
    
    // Collect all image URLs (existing + newly uploaded)
    const allImageUrls = selectedImages.value
      .filter(img => img.url || img.isExisting)
      .map(img => img.url!)
      .filter(Boolean)

    console.log('Form data being submitted:', {
      ...form.value,
      imageUrls: allImageUrls.length,
      mood: form.value.mood,
      isPrivate: form.value.isPrivate
    })

    const submitData = {
      title: form.value.title,
      description: form.value.description,
      content: form.value.content,
      date: form.value.date,
      tags: form.value.tags || [],
      location: form.value.location,
      mood: form.value.mood,
      isPrivate: Boolean(form.value.isPrivate),
      images: allImageUrls // Array of URLs instead of File objects
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
    // Show error to user (you can add toast notification here)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    images: [],
    tags: [],
    location: '',
    mood: undefined,
    isPrivate: false
  }
  selectedImages.value = []
  newTag.value = ''
  selectedTag.value = ''
  selectedTagOption.value = []
  errors.value = {}
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleClose = () => {
  resetForm()
  emit('close')
}

// Watch for memory prop changes
watch(() => props.memory, (memory) => {
  if (memory) {
    // Format date for HTML input (YYYY-MM-DD)
    const formattedDate = memory.date ? new Date(memory.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    
    form.value = {
      title: memory.title,
      description: memory.description || '',
      content: memory.content || '',
      date: formattedDate,
      tags: [...memory.tags || []],
      location: memory.location || '',
      mood: memory.mood || undefined,
      isPrivate: Boolean(memory.isPrivate),
      images: [] // Will be populated separately
    }
    
    // Handle existing images for edit mode
    selectedImages.value = []
    if (memory.images && memory.images.length > 0) {
      // Create preview objects for existing images
      memory.images.forEach((imageUrl, index) => {
        selectedImages.value.push({
          file: null as any, // Existing images don't have File objects
          preview: imageUrl,
          isExisting: true,
          url: imageUrl
        })
      })
    }
    
    console.log('Memory data loaded:', {
      mood: memory.mood,
      isPrivate: memory.isPrivate,
      tags: memory.tags,
      images: memory.images
    })
  }
}, { immediate: true })

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    // Reset form when modal closes, but avoid infinite loop
    resetForm()
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
