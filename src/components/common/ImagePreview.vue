<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ title || $t('common.image.preview') }}
      </h3>
      <button
        @click="$emit('close')"
        class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <!-- Image -->
    <div class="mb-4">
      <img
        :src="imageUrl"
        :alt="title"
        class="w-full max-h-96 object-contain rounded-lg"
        @error="handleImageError"
      />
    </div>
    
    <!-- Description -->
    <p v-if="description" class="text-gray-600 dark:text-gray-300 mb-4">
      {{ description }}
    </p>
    
    <!-- Actions -->
    <div class="flex space-x-3 justify-end">
      <button
        @click="$emit('close')"
        class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        {{ $t('common.buttons.close') }}
      </button>
      <button
        v-if="downloadUrl"
        @click="downloadImage"
        class="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
      >
        {{ $t('common.buttons.download') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  imageUrl: string
  description?: string
  downloadUrl?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const handleImageError = () => {
  console.error('Failed to load image:', props.imageUrl)
}

const downloadImage = () => {
  if (props.downloadUrl) {
    const link = document.createElement('a')
    link.href = props.downloadUrl
    link.download = props.title || 'image'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>
