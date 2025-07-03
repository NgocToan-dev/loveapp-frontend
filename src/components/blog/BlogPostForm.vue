<template>
  <Modal 
    :is-open="isOpen" 
    :title="isEditMode ? $t('blog.form.editTitle') : $t('blog.form.createTitle')"
    size="full"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="h-full flex flex-col">
      <div class="flex-1 space-y-6 overflow-y-auto p-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('blog.form.title') }}
          </label>
          <Input
            id="title"
            v-model="form.title"
            :placeholder="$t('blog.form.titlePlaceholder')"
            :error="errors.title"
            size="lg"
            required
          />
        </div>

        <!-- Cover Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('blog.form.coverImage') }}
          </label>
          
          <!-- Image Upload Area -->
          <div
            @drop.prevent="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors"
            :class="{ 
              'border-pink-400 bg-pink-50': isDragging,
              'border-blue-400 bg-blue-50': isUploadingImage,
              'opacity-50 pointer-events-none': isUploadingImage
            }"
          >
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              @change="handleImageSelect"
              class="hidden"
              :disabled="isUploadingImage"
            />
            
            <!-- Current Cover Image -->
            <div v-if="coverImagePreview" class="mb-4">
              <img 
                :src="coverImagePreview" 
                :alt="$t('blog.form.coverImagePreview')"
                class="max-w-xs mx-auto rounded-lg"
              />
              <button
                type="button"
                @click="removeCoverImage"
                class="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                {{ $t('blog.form.removeCoverImage') }}
              </button>
            </div>

            <!-- Upload Prompt -->
            <div v-else-if="!isUploadingImage">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              <p class="mt-2 text-sm text-gray-600">
                {{ $t('blog.form.dragCoverImage') }}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="mt-2"
                @click="imageInput?.click()"
              >
                {{ $t('blog.form.selectCoverImage') }}
              </Button>
            </div>

            <!-- Upload Loading State -->
            <div v-else class="flex flex-col items-center">
              <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p class="mt-2 text-sm text-blue-600">
                {{ $t('blog.form.uploadingImage') }}
              </p>
            </div>
          </div>
          
          <!-- Upload Error -->
          <p v-if="errors.coverImage" class="mt-1 text-sm text-red-600">
            {{ errors.coverImage }}
          </p>
        </div>

        <!-- Content Editor -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('blog.form.content') }}
          </label>
          <RichTextEditor
            v-model="form.content"
            :placeholder="$t('blog.form.contentPlaceholder')"
          />
          <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
        </div>

        <!-- Excerpt -->
        <div>
          <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('blog.form.excerpt') }}
          </label>
          <textarea
            id="excerpt"
            v-model="form.excerpt"
            :placeholder="$t('blog.form.excerptPlaceholder')"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.excerpt }"
          />
          <p class="mt-1 text-xs text-gray-500">
            {{ $t('blog.form.excerptHelp') }}
          </p>
          <p v-if="errors.excerpt" class="mt-1 text-sm text-red-600">{{ errors.excerpt }}</p>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('blog.form.tags') }}
          </label>
          <ComboBox
            :model-value="selectedTags"
            @update:modelValue="handleTagsUpdate"
            :options="tagOptions"
            key-value="id"
            display-value="name"
            :placeholder="$t('blog.form.tagsPlaceholder')"
          />
          <p v-if="errors.tags" class="mt-1 text-sm text-red-600">{{ errors.tags }}</p>
        </div>

        <!-- Settings Panel -->
        <div class="border-t border-gray-200 bg-gray-50 p-6 space-y-4 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900">{{ $t('blog.form.settings') }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Privacy Settings -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('blog.form.privacy') }}</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="form.privacy"
                    value="private"
                    type="radio"
                    name="privacy"
                    class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ $t('blog.privacy.private') }}</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.privacy"
                    value="couple"
                    type="radio"
                    name="privacy"
                    class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ $t('blog.privacy.couple') }}</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.privacy"
                    value="public"
                    type="radio"
                    name="privacy"
                    class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ $t('blog.privacy.public') }}</span>
                </label>
                <p class="text-xs text-gray-500">{{ $t('blog.form.privacyHelp') }}</p>
              </div>
            </div>

            <!-- Publishing Settings -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('blog.form.publishing') }}</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="form.status"
                    value="draft"
                    type="radio"
                    name="status"
                    class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ $t('blog.status.draft') }}</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.status"
                    value="published"
                    type="radio"
                    name="status"
                    class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ $t('blog.status.published') }}</span>
                </label>
                <p class="text-xs text-gray-500">{{ $t('blog.form.publishHelp') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center pt-6 border-t bg-white px-6 py-4">
        <div class="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            @click="handleClose"
          >
            {{ $t('common.actions.cancel') }}
          </Button>
          
          <Button
            v-if="form.status === 'draft'"
            type="button"
            variant="outline"
            :loading="isSavingDraft"
            @click="saveDraft"
          >
            {{ $t('blog.actions.saveDraft') }}
          </Button>
        </div>

        <div class="flex space-x-3">
          <Button
            v-if="isEditMode && post?.status === 'published'"
            type="button"
            variant="outline"
            :loading="isUnpublishing"
            @click="unpublish"
          >
            {{ $t('blog.actions.unpublish') }}
          </Button>

          <Button
            type="submit"
            :loading="isSubmitting"
            :disabled="!isFormValid"
          >
            {{ form.status === 'published' 
              ? (isEditMode ? $t('blog.actions.update') : $t('blog.actions.publish'))
              : $t('blog.actions.publish')
            }}
          </Button>
        </div>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlogStore } from '@/stores/blog'
import { PrivacyEnum, StatusEnum } from '@/utils/enum'
import { uploadService } from '@/services/upload'
import { validateImageFile } from '@/utils/helpers'
import type { CreateBlogPostRequest } from '@/types'
import Modal from '@/components/common/Modal.vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import RichTextEditor from './RichTextEditor.vue'
import ComboBox from '@/components/common/ComboBox.vue'
import type { BlogPostEntity } from '@/types/model/blog/BlogPostEntity'
// Type for tag options
interface TagOption { id: string; name: string }

interface Props {
  isOpen: boolean
  isEditMode?: boolean
  post?: BlogPostEntity | null
}

interface Emits {
  close: []
  success: []
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  post: null
})
const emit = defineEmits<Emits>()

const { t } = useI18n()
const blogStore = useBlogStore()
const form = ref<CreateBlogPostRequest>({
  title: '',
  content: '',
  contentHtml: '',
  excerpt: '',
  tags: [],
  privacy: PrivacyEnum.private,
  status: StatusEnum.draft,
  isPrivate: false,
  isPublished: false
})
// Use object-based options for ComboBox
const selectedTags = computed<TagOption[]>(() =>
  (form.value.tags ?? []).map(name => ({ id: name, name }))
)
const tagOptions = computed<TagOption[]>(() => {
  // Create available tag options from a predefined list
  const availableTags = ['love', 'relationship', 'memories', 'anniversary', 'date', 'travel', 'food', 'celebration']
  return availableTags.map(tag => ({ id: tag, name: tag }))
})

// Handler for tags update
const handleTagsUpdate = (newTags: TagOption[]) => {
  form.value.tags = newTags.map(tag => tag.name)
}

const errors = ref<Record<string, string>>({})
const isDragging = ref(false)
const coverImagePreview = ref<string | null>(null)
const selectedCoverImage = ref<File | null>(null)

const isSubmitting = ref(false)
const isSavingDraft = ref(false)
const isUnpublishing = ref(false)
const isUploadingImage = ref(false)
const imageInput = ref<HTMLInputElement>()

// Computed
const isEditMode = computed(() => props.isEditMode || !!props.post)

const isFormValid = computed(() => {
  return form.value.title.trim() && form.value.content.trim()
})

// Sync enum values with boolean flags
const syncFormValues = () => {
  // Sync privacy
  form.value.isPrivate = form.value.privacy === PrivacyEnum.private
  
  // Sync status
  form.value.isPublished = form.value.status === StatusEnum.published
}

// Watch for privacy changes
watch(() => form.value.privacy, () => {
  syncFormValues()
})

// Watch for status changes
watch(() => form.value.status, () => {
  syncFormValues()
})

// Methods
const handleImageSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    processImage(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processImage(file)
  }
}

const processImage = async (file: File) => {
  // Validate image file
  const validation = validateImageFile(file)
  if (!validation.isValid) {
    errors.value.coverImage = validation.error || 'Invalid image file'
    return
  }

  // Clear any previous errors
  errors.value.coverImage = ''
  
  // Show loading state
  isUploadingImage.value = true
  
  try {
    // Upload image to MinIO via backend
    const result = await uploadService.uploadCoverImage(file)
    
    // Set the uploaded image URL
    form.value.coverImageUrl = result.imageUrl
    
    // Set preview for user interface
    const reader = new FileReader()
    reader.onload = (e) => {
      coverImagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    
    // Clear the selected file since we now have the URL
    selectedCoverImage.value = null
    
  } catch (error) {
    console.error('Image upload failed:', error)
    errors.value.coverImage = t('blog.form.imageUploadFailed')
  } finally {
    isUploadingImage.value = false
  }
}

const removeCoverImage = async () => {
  // If we have an uploaded image URL, try to delete it from MinIO
  if (form.value.coverImageUrl) {
    try {
      await uploadService.deleteFile(form.value.coverImageUrl)
    } catch (error) {
      console.error('Failed to delete cover image:', error)
      // Continue anyway - the form removal is more important
    }
  }
  
  // Clear form data
  form.value.coverImageUrl = undefined
  selectedCoverImage.value = null
  coverImagePreview.value = null
  
  // Clear file input
  if (imageInput.value) {
    imageInput.value.value = ''
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
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  
  try {
    const submitData = {
      ...form.value,
      contentHtml: form.value.content, // For now, use content as contentHtml
      // coverImage is no longer needed since we upload directly
    }

    if (isEditMode.value && props.post) {
      await blogStore.updatePost({
        id: props.post.id,
        ...submitData
      })
    } else {
      await blogStore.createPost(submitData)
    }

    emit('success')
    handleClose()
  } catch (error) {
    console.error('Failed to save post:', error)
  } finally {
    isSubmitting.value = false
  }
}

const saveDraft = async () => {
  if (!validateForm()) return

  isSavingDraft.value = true
  
  try {
    const draftData = {
      ...form.value,
      contentHtml: form.value.content, // For now, use content as contentHtml
      isPublished: false,
      status: StatusEnum.draft,
      // coverImage is no longer needed since we upload directly
    }

    if (isEditMode.value && props.post) {
      await blogStore.updatePost({
        id: props.post.id,
        ...draftData
      })
    } else {
      await blogStore.createPost(draftData)
    }

    emit('success')
    handleClose()
  } catch (error) {
    console.error('Failed to save draft:', error)
  } finally {
    isSavingDraft.value = false
  }
}

const unpublish = async () => {
  if (!props.post) return

  isUnpublishing.value = true
  
  try {
    await blogStore.updatePost({
      id: props.post.id,
      status: StatusEnum.draft,
      isPublished: false
    })
    emit('success')
    handleClose()
  } catch (error) {
    console.error('Failed to unpublish post:', error)
  } finally {
    isUnpublishing.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    content: '',
    contentHtml: '',
    excerpt: '',
    tags: [],
    privacy: PrivacyEnum.private,
    status: StatusEnum.draft,
    isPrivate: false,
    isPublished: false,
    coverImageUrl: undefined
  }
  selectedCoverImage.value = null
  coverImagePreview.value = null
  errors.value = {}
}

const handleClose = () => {
  resetForm()
  emit('close')
}

// Watch for post prop changes
watch(() => props.post, (post) => {
  if (post) {
    form.value = {
      title: post.title,
      content: post.content,
      contentHtml: post.contentHtml,
      excerpt: post.excerpt,
      tags: [...post.tags],
      privacy: post.privacy,
      status: post.status,
      isPrivate: post.privacy === PrivacyEnum.private,
      isPublished: post.status === StatusEnum.published
    }
    coverImagePreview.value = post.coverImage || null
    // Note: We don't set selectedCoverImage for existing posts
  }
}, { immediate: true })

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    // Reset form when modal closes, but avoid infinite loop
    resetForm()
  } else if (isOpen && props.post) {
    // Populate form with post data when editing
    populateFormFromPost(props.post)
  }
})

// Watch for post changes
watch(() => props.post, (newPost) => {
  if (newPost && props.isOpen) {
    populateFormFromPost(newPost)
  }
})

// Method to populate form data from post
const populateFormFromPost = (post: BlogPostEntity) => {
  form.value = {
    title: post.title || '',
    content: post.content || '',
    contentHtml: post.contentHtml || '',
    excerpt: post.excerpt || '',
    tags: post.tags || [],
    privacy: post.privacy || PrivacyEnum.private,
    status: post.status || StatusEnum.draft,
    isPrivate: post.privacy === PrivacyEnum.private,
    isPublished: post.status === StatusEnum.published,
    coverImageUrl: post.coverImageUrl || undefined
  }
  
  // Set cover image preview if exists
  if (post.coverImageUrl) {
    coverImagePreview.value = post.coverImageUrl
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
