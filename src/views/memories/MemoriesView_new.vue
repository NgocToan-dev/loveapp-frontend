<template>
  <div class="memories-view">
    <!-- Hero Section (unchanged for now) -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="floating-hearts">
          <div class="heart" v-for="n in 6" :key="n"></div>
        </div>
      </div>
      <ResponsiveContainer class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            <v-icon icon="mdi-heart" class="title-icon" />
            {{ $t("memories.title") }}
          </h1>
          <p class="hero-subtitle">{{ $t("memories.subtitle") }}</p>
          <v-btn
            color="primary"
            size="large"
            rounded
            elevation="0"
            class="create-memory-btn hover-lift"
            @click="openCreateMemory"
          >
            <v-icon icon="mdi-plus" start />
            {{ $t("memories.createNew") }}
          </v-btn>
        </div>
      </ResponsiveContainer>
    </section>

    <!-- Two Column Layout -->
    <TwoColumnLayout>
      <!-- Left column: Memory List -->
      <template #left>
        <MemoryList :memories="filteredMemories" :loading="isLoading" />
      </template>
      
      <!-- Right column: Filter and Stats -->
      <template #right>
        <MemoryStatsWidget :memories="memories" />        <MemoryFilterPanel 
          :memories="memories"
          v-model:search="searchQuery"
          v-model:type-filter="typeFilter"
          v-model:year-filter="yearFilter"
          v-model:sort-by="sortBy"
        />
      </template>
    </TwoColumnLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMemoriesStore } from '@/stores/memories'
import { useDialogsStore } from '@/stores/dialogs'
import type { Memory } from '@/types'

// Components
import ResponsiveContainer from '@/components/ui/ResponsiveContainer.vue'
import TwoColumnLayout from '@/components/ui/TwoColumnLayout.vue'
import MemoryList from '@/components/memories/MemoryList.vue'
import MemoryStatsWidget from '@/components/memories/MemoryStatsWidget.vue'
import MemoryFilterPanel from '@/components/memories/MemoryFilterPanel.vue'

// Composables
const { t } = useI18n()
const router = useRouter()
const memoriesStore = useMemoriesStore()
const dialogsStore = useDialogsStore()

// Reactive state
const searchQuery = ref('')
const typeFilter = ref('')
const yearFilter = ref('')
const sortBy = ref('newest')

// Computed
const memories = computed(() => memoriesStore.memories)
const isLoading = computed(() => memoriesStore.isLoading)

const memoryTypes = computed(() => [
  { value: '', title: t('common.all') },
  { value: 'first-meet', title: t('memories.types.first-meet') },
  { value: 'date', title: t('memories.types.date') },
  { value: 'travel', title: t('memories.types.travel') },
  { value: 'special-moment', title: t('memories.types.special-moment') },
  { value: 'celebration', title: t('memories.types.celebration') },
  { value: 'milestone', title: t('memories.types.milestone') },
  { value: 'everyday', title: t('memories.types.everyday') },
  { value: 'other', title: t('memories.types.other') }
])

const availableYears = computed(() => {
  const years = new Set<number>()
  memories.value.forEach(memory => {
    const year = new Date(memory.createdAt).getFullYear()
    years.add(year)
  })
  
  return [
    { value: '', title: t('common.all') },
    ...Array.from(years).sort((a, b) => b - a).map(year => ({
      value: year.toString(),
      title: year.toString()
    }))
  ]
})

const filteredMemories = computed(() => {
  let filtered = [...memories.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(memory =>
      memory.title.toLowerCase().includes(query) ||
      memory.description.toLowerCase().includes(query) ||
      (memory.content && memory.content.toLowerCase().includes(query)) ||
      memory.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Apply type filter (using category instead of type)
  if (typeFilter.value) {
    filtered = filtered.filter(memory => memory.category === typeFilter.value)
  }

  // Apply year filter
  if (yearFilter.value) {
    const year = parseInt(yearFilter.value)
    filtered = filtered.filter(memory => 
      new Date(memory.createdAt).getFullYear() === year
    )
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'alphabetical':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    default:
      break
  }

  return filtered
})

// Methods
const openCreateMemory = () => {
  dialogsStore.openBaseDialog('CreateMemoryDialog')
}

// Lifecycle
onMounted(async () => {
  await memoriesStore.fetchMemories()
})
</script>

<style scoped>
.memories-view {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.02) 0%, 
    rgba(var(--secondary-rgb), 0.01) 100%);
}

/* Hero Section Styles */
.hero-section {
  position: relative;
  padding: 80px 0 60px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.08) 0%, 
    rgba(var(--secondary-rgb), 0.06) 50%,
    rgba(var(--accent-rgb), 0.04) 100%);
}

.floating-hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.heart {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.heart:before,
.heart:after {
  content: '';
  width: 10px;
  height: 16px;
  position: absolute;
  left: 10px;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
  border-radius: 10px 10px 0 0;
  background: rgb(var(--primary-rgb));
}

.heart:after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
}

.heart:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.heart:nth-child(2) { top: 20%; left: 80%; animation-delay: 1s; }
.heart:nth-child(3) { top: 60%; left: 15%; animation-delay: 2s; }
.heart:nth-child(4) { top: 80%; left: 70%; animation-delay: 3s; }
.heart:nth-child(5) { top: 30%; left: 90%; animation-delay: 4s; }
.heart:nth-child(6) { top: 70%; left: 45%; animation-delay: 5s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.hero-container {
  position: relative;
  z-index: 1;
}

.hero-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: rgb(var(--primary-rgb));
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.title-icon {
  font-size: 3rem !important;
  color: rgb(var(--accent-rgb));
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgb(var(--text-secondary-rgb));
  margin-bottom: 2rem;
  line-height: 1.6;
}

.create-memory-btn {
  font-size: 1.1rem;
  padding: 12px 32px;
  background: linear-gradient(135deg, 
    rgb(var(--primary-rgb)), 
    rgb(var(--secondary-rgb)));
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.create-memory-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .title-icon {
    font-size: 2rem !important;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>
