# GitHub Copilot Instructions for LoveApp Frontend

## Project Overview
This is a **Vue 3 + Vite + TypeScript + Vuetify** love/couple management application with internationalization support. The app helps couples store memories, share notes, and celebrate their relationship.

## Core Technologies
- **Vue 3** with Composition API
- **Vite** for build tooling
- **TypeScript** for type safety
- **Vuetify 3** for Material Design components
- **Vue Router 4** for navigation
- **Pinia** for state management
- **Vue I18n** for internationalization
- **Axios** for API calls
- **Firebase** for backend services
- **PWA** capabilities with Vite PWA plugin

## Code Generation Guidelines

### 1. Internationalization (i18n) - MANDATORY
- **ALWAYS** use `useI18n()` from `vue-i18n` for all user-facing text
- Store translation keys in `src/plugins/i18n/en/` and `src/plugins/i18n/vn/` directories
- Use descriptive translation keys with dot notation (e.g., `common.buttons.save`, `memories.form.title`)
- Default locale is Vietnamese (`vi`), fallback is English (`en`)

```typescript
// Correct usage
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const buttonText = t('common.buttons.save')

// In template
<v-btn>{{ $t('common.buttons.save') }}</v-btn>
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

### 3. Vuetify 3 Component Usage
- Use Vuetify components following Material Design 3 principles
- Leverage the custom theme system already configured
- Use responsive breakpoints with Vuetify's grid system
- Follow the existing color scheme (Spring theme with primary: #4caf50)

```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>{{ $t('memories.title') }}</v-card-title>
          <v-card-text>
            <v-btn color="primary" :loading="isLoading">
              {{ $t('common.buttons.save') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
- Use Vuetify's built-in classes when possible
- Custom styles should be in SCSS files in `src/assets/styles/`
- Follow the existing theme structure
- Use CSS variables for consistent theming
- Implement responsive design with Vuetify's breakpoint system

### 9. Love App Specific Features
- Handle couple connections and invitations
- Store and display memories with photos
- Manage anniversary countdowns
- Create and share notes between partners
- Implement file upload with proper validation
- Add notification system for important dates
- Ensure privacy and security for couple data

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
- Use Vuetify's virtual scrolling for large lists
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
  <v-card>
    <v-card-title>{{ $t('memories.create.title') }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.title"
          :label="$t('memories.form.title')"
          :rules="titleRules"
          required
        />
        <v-textarea
          v-model="form.content"
          :label="$t('memories.form.content')"
          :rules="contentRules"
        />
        <v-btn
          type="submit"
          color="primary"
          :loading="isSubmitting"
          block
        >
          {{ $t('common.buttons.create') }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
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

const titleRules = computed(() => [
  (v: string) => !!v || t('validation.required'),
  (v: string) => v.length >= 3 || t('validation.minLength', { min: 3 })
])

const contentRules = computed(() => [
  (v: string) => !!v || t('validation.required')
])

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await memoriesStore.createMemory(form.value)
    // Handle success
  } catch (error) {
    // Handle error
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
- Use semantic HTML elements within Vuetify components
- Maintain consistency with the existing Spring theme design