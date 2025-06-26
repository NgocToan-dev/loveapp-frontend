# 🚀 LOVE APP - QUICK START GUIDE

## 📋 Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- VS Code (recommended) with Vue + TypeScript extensions

---

## ⚡ Immediate Setup (15 minutes)

### Step 1: Initialize the Project
```bash
# Navigate to your workspace
cd e:\Workspace\LoveApp\loveapp-frontend

# Initialize Vue 3 project with TypeScript
npm create vue@latest . -- --typescript --router --pinia --eslint --prettier

# Install dependencies
npm install
```

### Step 2: Install Additional Dependencies
```bash
# UI & Styling
npm install tailwindcss @headlessui/vue @heroicons/vue
npm install -D @tailwindcss/typography @tailwindcss/forms postcss autoprefixer

# Rich Text Editor
npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder

# Utilities
npm install axios dayjs vue-toastification

# Form Validation
npm install vee-validate @vee-validate/zod zod

# Development
npm install -D @types/node
```

### Step 3: Initialize Tailwind CSS
```bash
npx tailwindcss init -p
```

### Step 4: Start Development Server
```bash
npm run dev
```

---

## 🎨 Initial Configuration Files

### 1. Update `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        romantic: {
          pink: '#f8bbd9',
          purple: '#e879f9',
          cream: '#fefce8',
          gold: '#fbbf24',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        romantic: ['Dancing Script', 'cursive'],
      },
      animation: {
        'heart-beat': 'heartBeat 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        heartBeat: {
          '0%, 50%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

### 2. Update `src/style.css`
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Import romantic fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@400;600;700&display=swap');

/* Custom romantic utilities */
@layer components {
  .btn-romantic {
    @apply bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105;
  }
  
  .card-romantic {
    @apply bg-white rounded-xl shadow-md border border-pink-100 hover:shadow-lg transition-shadow duration-300;
  }
  
  .input-romantic {
    @apply border-pink-200 focus:border-pink-500 focus:ring-pink-500 rounded-lg;
  }
  
  .text-romantic {
    @apply bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent;
  }
}

/* Global styles */
body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%);
  min-height: 100vh;
}

.romantic-title {
  font-family: 'Dancing Script', cursive;
  font-weight: 600;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #ec4899, #a855f7);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #db2777, #9333ea);
}
```

### 3. Update `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

---

## 🏗️ Create Initial File Structure

### Create directory structure:
```bash
mkdir -p src/components/common
mkdir -p src/components/blog
mkdir -p src/components/memories
mkdir -p src/components/reminders
mkdir -p src/components/layout
mkdir -p src/pages
mkdir -p src/stores
mkdir -p src/services
mkdir -p src/types
mkdir -p src/composables
mkdir -p src/utils
```

---

## 🧩 Create Your First Components

### 1. Create `src/components/common/Button.vue`
```vue
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'romantic' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500',
    romantic: 'btn-romantic focus:ring-pink-500',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const disabled = props.disabled || props.loading ? 'opacity-50 cursor-not-allowed' : ''
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${disabled}`
})
</script>
```

### 2. Create `src/components/layout/Header.vue`
```vue
<template>
  <header class="bg-white shadow-sm border-b border-pink-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="text-2xl">💕</div>
            <span class="romantic-title text-2xl text-romantic">LoveApp</span>
          </router-link>
        </div>
        
        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            class="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-pink-600 bg-pink-50"
          >
            {{ item.name }}
          </router-link>
        </nav>
        
        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-600 hover:text-pink-600 p-2"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-2">
        <div class="flex flex-col space-y-1">
          <router-link 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            class="text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md text-base font-medium"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Our Blog', href: '/blog' },
  { name: 'Memories', href: '/memories' },
  { name: 'Reminders', href: '/reminders' },
  { name: 'Timeline', href: '/timeline' },
]
</script>
```

### 3. Update `src/App.vue`
```vue
<template>
  <div id="app" class="min-h-screen">
    <Header />
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
</script>
```

### 4. Create `src/pages/HomePage.vue`
```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
    <!-- Hero Section -->
    <section class="text-center py-20">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="romantic-title text-6xl md:text-8xl text-romantic mb-6">
          Our Love Story
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-8">
          Together for <span class="font-bold text-pink-600">{{ daysTogether }}</span> amazing days ❤️
        </p>
        <div class="animate-heart-beat text-6xl mb-8">💕</div>
        <Button variant="romantic" size="lg" @click="navigateToMemories">
          Start Our Journey
        </Button>
      </div>
    </section>
    
    <!-- Quick Actions -->
    <section class="max-w-6xl mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
        What would you like to do today?
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <QuickActionCard 
          icon="💕"
          title="Add Memory"
          description="Capture a special moment together"
          @click="navigateToMemories"
        />
        <QuickActionCard 
          icon="📝"
          title="Write Blog Post"
          description="Share your thoughts and feelings"
          @click="navigateToBlog"
        />
        <QuickActionCard 
          icon="⏰"
          title="Set Reminder"
          description="Never forget important dates"
          @click="navigateToReminders"
        />
      </div>
    </section>
    
    <!-- Love Quote -->
    <section class="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-16">
      <div class="max-w-4xl mx-auto text-center px-4">
        <blockquote class="text-2xl md:text-3xl font-light italic mb-4">
          "{{ currentQuote.text }}"
        </blockquote>
        <cite class="text-lg opacity-90">{{ currentQuote.author }}</cite>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import Button from '@/components/common/Button.vue'
import QuickActionCard from '@/components/common/QuickActionCard.vue'

const router = useRouter()

// Mock data - replace with actual data from store
const relationshipStartDate = ref('2024-01-01')

const daysTogether = computed(() => {
  return dayjs().diff(dayjs(relationshipStartDate.value), 'day')
})

const loveQuotes = [
  { text: "Love is not just looking at each other, it's looking in the same direction.", author: "Antoine de Saint-Exupéry" },
  { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
  { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
]

const currentQuote = computed(() => {
  const index = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % loveQuotes.length
  return loveQuotes[index]
})

const navigateToMemories = () => {
  router.push('/memories')
}

const navigateToBlog = () => {
  router.push('/blog')
}

const navigateToReminders = () => {
  router.push('/reminders')
}
</script>
```

### 5. Create `src/components/common/QuickActionCard.vue`
```vue
<template>
  <div 
    class="card-romantic p-6 text-center cursor-pointer transform hover:scale-105 transition-all duration-300"
    @click="$emit('click')"
  >
    <div class="text-5xl mb-4 animate-float">{{ icon }}</div>
    <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()
defineEmits<{
  click: []
}>()
</script>
```

---

## 📝 Update Router Configuration

Update `src/router/index.ts`:
```typescript
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/pages/BlogPage.vue')
    },
    {
      path: '/memories',
      name: 'memories',
      component: () => import('@/pages/MemoriesPage.vue')
    },
    {
      path: '/reminders',
      name: 'reminders',
      component: () => import('@/pages/ReminderPage.vue')
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('@/pages/TimelinePage.vue')
    }
  ]
})

export default router
```

---

## 🎯 What You'll Have After This Setup

1. ✅ **Beautiful romantic homepage** with animations
2. ✅ **Tailwind CSS** with custom romantic theme
3. ✅ **Vue 3 + TypeScript** properly configured
4. ✅ **Responsive navigation** with mobile menu
5. ✅ **Component library** foundation started
6. ✅ **Routing** structure in place
7. ✅ **Development server** running on http://localhost:3000

---

## 🚀 Next Steps

1. **Run the project**: `npm run dev`
2. **Check the homepage** - you should see a beautiful romantic landing page
3. **Follow the Technical Roadmap** for detailed implementation
4. **Start with Phase 2** - Core Infrastructure (stores, API services)

---

## 🆘 Troubleshooting

### Common Issues:

1. **TypeScript errors**: Make sure all dependencies are installed
2. **Tailwind not working**: Check that `postcss.config.js` exists
3. **Font not loading**: Verify the Google Fonts import in `style.css`
4. **Components not found**: Check file paths and import statements

### Getting Help:
- Check the Technical Roadmap for detailed implementation steps
- Review the Development Plan for feature specifications
- Each component should be built incrementally following the roadmap

---

**🎉 You're now ready to build your romantic Love App! Start with `npm run dev` and watch your love story come to life in code!**
