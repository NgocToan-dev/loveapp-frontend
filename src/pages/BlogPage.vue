<template>
  <AppLayout>
    <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-spring-green bg-clip-text text-transparent mb-2">
            {{ $t('blog.title') }}
          </h1>
          <p class="text-gray-600">{{ $t('blog.subtitle') }}</p>
        </div>
        <button 
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors"
          @click="createPost"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>{{ $t('blog.createPost') }}</span>
        </button>
      </div>
      
      <!-- Empty State -->
      <div class="text-center py-20">
        <div class="text-6xl mb-6">📝</div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ $t('blog.noPosts') }}</h2>
        <p class="text-gray-600 mb-8">{{ $t('blog.firstPost') }}</p>
        <button 
          class="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
          @click="createPost"
        >
          {{ $t('blog.createPost') }}
        </button>
      </div>
    </div>
  </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'

const { t } = useI18n()

const createPost = () => {
  // Navigation to create post page
  console.log('Navigate to create post page')
}
</script>
