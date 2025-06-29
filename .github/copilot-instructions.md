# GitHub Copilot Instructions for LoveApp Frontend

## Project Overview
This is a **Vue 3 + Vite + TypeScript + TailwindCSS** love/couple management application with internationalization support. The app helps couples store memories, share notes, celebrate their relationship, and includes features like blog posts, reminders, timeline, and real-time chat.

## Core Technologies
- **Vue 3** with Composition API
- **Vite** for build tooling
- **TypeScript** for type safety
- **TailwindCSS** for modern utility-first styling
- **Headless UI Vue** for unstyled, accessible UI components
- **Vue Router 4** for navigation
- **Pinia** for state management
- **Vue I18n** for internationalization
- **Axios** for API calls
- **Node.js/Express** backend with MongoDB
- **Vee-Validate + Zod** for form validation
- **TipTap** for rich text editing
- **Vue Toastification** for notifications
- **Heroicons** for icons

## Code Generation Guidelines

### 1. Internationalization (i18n) - MANDATORY
- **ALWAYS** use `useI18n()` from `vue-i18n` for all user-facing text
- Store translation keys in `src/plugins/i18n/en/` and `src/plugins/i18n/vi/` directories
- Use descriptive translation keys with dot notation (e.g., `common.buttons.save`, `memories.form.title`)
- Default locale is Vietnamese (`vi`), fallback is English (`en`)

```typescript
// Correct usage
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const buttonText = t('common.buttons.save')

// In template
<button>{{ $t('common.buttons.save') }}</button>
```

### 2. Vue 3 Composition API Standards
- **ALWAYS** use Composition API with `<script setup>`
- Use `ref()` and `reactive()` for reactive data
- Extract reusable logic into composables in `src/composables/`
- Use proper TypeScript interfaces for props and emits

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  userId: string
  isVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: true
})

const emit = defineEmits<{
  close: []
  submit: [data: FormData]
}>()

const { t } = useI18n()
const isLoading = ref(false)
</script>
```

### 3. TailwindCSS + Headless UI Usage
- Use TailwindCSS utility classes for styling following modern design principles
- Leverage Headless UI Vue components for accessible, unstyled components
- Use responsive breakpoints with Tailwind's grid system
- Follow the existing color scheme (Green theme with primary: #22c55e)
- Use Heroicons for consistent iconography

```vue
<template>
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          {{ $t('memories.title') }}
        </h2>
        <button 
          class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">{{ $t('common.buttons.save') }}</span>
          <div v-else class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
        </button>
      </div>
    </div>
  </div>
</template>
```

### 4. State Management with Pinia
- Create stores in `src/stores/` directory
- Use composition API syntax for stores
- Implement proper loading, error, and success states
- Follow the existing store pattern

```typescript
// stores/memories.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Memory } from '@/types'

export const useMemoriesStore = defineStore('memories', () => {
  const memories = ref<Memory[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const memoriesCount = computed(() => memories.value.length)

  const fetchMemories = async () => {
    isLoading.value = true
    try {
      // API call logic
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    memories,
    isLoading,
    error,
    memoriesCount,
    fetchMemories
  }
})
```

### 5. File Structure & Organization
```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── memories/           # Memory-related components
│   ├── notes/              # Note-related components
│   ├── anniversaries/      # Anniversary components
│   └── dashboard/          # Dashboard components
├── views/                  # Page components
├── stores/                 # Pinia stores
├── services/               # API services
├── composables/            # Reusable composition functions
├── types/                  # TypeScript type definitions
├── plugins/                # Vue plugins (Vuetify, i18n)
├── router/                 # Vue Router configuration
└── assets/                 # Static assets and styles
```

### 6. API Integration
- Use the existing API service pattern in `src/services/`
- Implement proper error handling with user-friendly messages
- Use TypeScript interfaces for API responses
- Handle loading states consistently
- Backend is Node.js/Express with MongoDB

```typescript
// services/memories.ts
import api from './api'
import type { Memory, CreateMemoryRequest } from '@/types'

export const memoriesService = {
  async getMemories(): Promise<Memory[]> {
    const response = await api.get('/memories')
    return response.data
  },

  async createMemory(data: CreateMemoryRequest): Promise<Memory> {
    const response = await api.post('/memories', data)
    return response.data
  }
}
```

### 7. Component Structure Guidelines
- Use single-file components (`.vue`)
- Implement proper prop validation with TypeScript
- Use descriptive component names (PascalCase)
- Extract complex logic into composables
- Implement proper loading and error states

### 8. Styling Guidelines
- Use TailwindCSS utility classes when possible
- Custom styles should be in CSS files in `src/assets/`
- Follow the existing green theme structure (primary: #22c55e)
- Use CSS variables for consistent theming
- Implement responsive design with Tailwind's breakpoint system
- Leverage @tailwindcss/forms and @tailwindcss/typography plugins

### 9. Love App Specific Features
- Handle couple connections and invitations
- Store and display memories with photos
- Manage anniversary countdowns
- Create and share notes between partners
- Implement file upload with proper validation
- Add notification system for important dates
- Ensure privacy and security for couple data
- Blog system for couples to share stories
- Timeline view for relationship milestones
- Reminder system for special dates
- Real-time chat functionality

### 10. TypeScript Guidelines
- Define interfaces in `src/types/index.ts`
- Use strict typing for all props, emits, and functions
- Implement proper error types
- Use generic types where appropriate

```typescript
// types/index.ts
export interface Memory {
  id: string
  title: string
  content: string
  imageUrl?: string
  createdAt: string
  coupleId: string
}

export interface CreateMemoryRequest {
  title: string
  content: string
  image?: File
}
```

### 11. Performance Best Practices
- Use `defineAsyncComponent` for lazy loading
- Implement proper image optimization
- Use virtual scrolling for large lists
- Optimize bundle size with proper imports
- Leverage Vite's fast HMR for development

### 12. Security & Privacy
- Validate all user inputs
- Sanitize user-generated content
- Implement proper authentication checks
- Handle sensitive couple data with care
- Use HTTPS for all API communications

## Code Examples

### Complete Component Example:
```vue
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">
      {{ $t('memories.create.title') }}
    </h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('memories.form.title') }}
        </label>
        <input
          v-model="form.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          :class="{ 'border-red-500': titleError }"
          required
        />
        <p v-if="titleError" class="mt-1 text-sm text-red-600">
          {{ titleError }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('memories.form.content') }}
        </label>
        <textarea
          v-model="form.content"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          :class="{ 'border-red-500': contentError }"
          required
        ></textarea>
        <p v-if="contentError" class="mt-1 text-sm text-red-600">
          {{ contentError }}
        </p>
      </div>
      <button
        type="submit"
        class="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isSubmitting"
      >
        <div v-if="isSubmitting" class="flex items-center justify-center">
          <div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
          {{ $t('common.loading') }}
        </div>
        <span v-else>{{ $t('common.buttons.create') }}</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemoriesStore } from '@/stores/memories'
import type { CreateMemoryRequest } from '@/types'

const { t } = useI18n()
const memoriesStore = useMemoriesStore()

const form = ref<CreateMemoryRequest>({
  title: '',
  content: ''
})

const isSubmitting = ref(false)

const titleError = computed(() => {
  if (!form.value.title) return t('validation.required')
  if (form.value.title.length < 3) return t('validation.minLength', { min: 3 })
  return null
})

const contentError = computed(() => {
  if (!form.value.content) return t('validation.required')
  return null
})

const handleSubmit = async () => {
  if (titleError.value || contentError.value) return
  
  isSubmitting.value = true
  try {
    await memoriesStore.createMemory(form.value)
    // Handle success (show toast, redirect, etc.)
    form.value = { title: '', content: '' }
  } catch (error) {
    // Handle error (show error toast)
    console.error('Failed to create memory:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

## Additional Notes
- Follow the existing project conventions and patterns
- Always test components with both Vietnamese and English locales
- Consider mobile-first design approach
- Implement proper accessibility features
- Use semantic HTML elements within TailwindCSS components
- Maintain consistency with the existing green theme design