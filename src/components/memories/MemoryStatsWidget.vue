<template>
  <div class="memory-stats-widget">
    <!-- Overview Stats -->
    <StatsWidget 
      :title="$t('memories.title')"
      icon="mdi-chart-box"
      class="mb-4"
    >
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ memories.length }}</div>
          <div class="stat-label">{{ $t('memories.totalMemories') }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-number">{{ totalPhotos }}</div>
          <div class="stat-label">{{ $t('memories.photos') }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-number">{{ favoriteCount }}</div>
          <div class="stat-label">{{ $t('memories.favorites') }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-number">{{ daysTogether }}</div>
          <div class="stat-label">{{ $t('memories.daysTogether') }}</div>
        </div>
      </div>
    </StatsWidget>

    <!-- Category Breakdown -->
    <StatsWidget 
      :title="$t('memories.category')"
      icon="mdi-shape"
      class="mb-4"
    >
      <div class="category-stats">
        <div 
          v-for="category in categoryStats"
          :key="category.type"
          class="category-item d-flex align-center justify-space-between mb-2"
        >
          <div class="d-flex align-center">
            <v-icon :color="category.color" size="20" class="me-2">
              {{ category.icon }}
            </v-icon>
            <span class="text-body-2">{{ category.name }}</span>
          </div>
          <v-chip 
            :color="category.color"
            size="x-small"
            variant="tonal"
          >
            {{ category.count }}
          </v-chip>
        </div>
      </div>
    </StatsWidget>

    <!-- Recent Activity -->
    <StatsWidget 
      :title="$t('common.recentActivity')"
      icon="mdi-clock-outline"
      class="mb-4"
    >
      <div class="recent-memories">
        <div 
          v-for="memory in recentMemories" 
          :key="memory.id"
          class="recent-item d-flex align-center mb-3"
          @click="$emit('openMemory', memory)"
        >
          <v-avatar size="32" class="me-3">
            <v-img 
              v-if="getMemoryImage(memory)"
              :src="getMemoryImage(memory)"
              :alt="memory.title"
            />
            <v-icon v-else icon="mdi-camera" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-body-2 font-weight-medium line-clamp-1">
              {{ memory.title }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ formatRelativeTime(memory.date) }}
            </div>
          </div>
        </div>
        
        <v-btn
          v-if="memories.length > 3"
          variant="text"
          size="small"
          block
          @click="$emit('viewAllMemories')"
        >
          {{ $t('common.viewAll') }}
        </v-btn>
      </div>
    </StatsWidget>

    <!-- Monthly Progress -->
    <StatsWidget 
      :title="$t('common.thisMonth')"
      icon="mdi-calendar-month"
      class="mb-4"
    >
      <div class="monthly-progress">
        <div class="progress-item d-flex align-center justify-space-between mb-2">
          <span class="text-body-2">{{ $t('memories.create') }}</span>
          <div class="d-flex align-center">
            <span class="text-h6 me-2">{{ thisMonthCount }}</span>
            <v-icon 
              :color="monthlyChange >= 0 ? 'success' : 'error'"
              size="16"
            >
              {{ monthlyChange >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
            </v-icon>
          </div>
        </div>
        
        <v-progress-linear
          :model-value="monthlyProgress"
          color="primary"
          height="6"
          rounded
        />
        
        <div class="text-caption text-medium-emphasis mt-1">
          {{ $t('common.comparedToLastMonth') }}
        </div>
      </div>
    </StatsWidget>

    <!-- Quick Actions -->
    <StatsWidget 
      :title="$t('common.quickActions')"
      icon="mdi-lightning-bolt"
    >
      <div class="quick-actions d-flex flex-column gap-2">
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          prepend-icon="mdi-plus"
          block
          @click="$emit('createMemory')"
        >
          {{ $t('memories.create') }}
        </v-btn>
        
        <v-btn
          color="secondary"
          variant="tonal"
          size="small"
          prepend-icon="mdi-heart"
          block
          @click="$emit('viewFavorites')"
        >
          {{ $t('memories.favorites') }}
        </v-btn>
        
        <v-btn
          color="info"
          variant="tonal"
          size="small"
          prepend-icon="mdi-export"
          block
          @click="$emit('exportMemories')"
        >
          {{ $t('common.export') }}
        </v-btn>
      </div>
    </StatsWidget>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StatsWidget from '@/components/ui/StatsWidget.vue'
import type { Memory } from '@/types'

interface Props {
  memories: Memory[]
}

const props = withDefaults(defineProps<Props>(), {
  memories: () => []
})

const emit = defineEmits<{
  openMemory: [memory: Memory]
  createMemory: []
  viewAllMemories: []
  viewFavorites: []
  exportMemories: []
}>()

const { t } = useI18n()

// Computed stats
const totalPhotos = computed(() => {
  return props.memories.filter(memory => 
    memory.files?.some(file => 
      file.type?.startsWith('image/') || 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '')
    )
  ).length
})

const favoriteCount = computed(() => {
  return props.memories.filter(memory => memory.isFavorite).length
})

const daysTogether = computed(() => {
  if (props.memories.length === 0) return 0
  
  const firstMemory = props.memories.reduce((earliest, memory) => {
    return new Date(memory.date) < new Date(earliest.date) ? memory : earliest
  })
  
  const today = new Date()
  const firstDate = new Date(firstMemory.date)
  const diffTime = Math.abs(today.getTime() - firstDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
})

// Category statistics
const categoryStats = computed(() => {
  const stats = new Map()
  const categoryConfig = {
    'first-meet': { name: t('memories.gallery.types.first-meet'), icon: 'mdi-heart-flash', color: 'pink' },
    'date': { name: t('memories.gallery.types.date'), icon: 'mdi-heart', color: 'purple' },
    'travel': { name: t('memories.gallery.types.travel'), icon: 'mdi-airplane-takeoff', color: 'indigo' },
    'milestone': { name: t('memories.gallery.types.milestone'), icon: 'mdi-trophy', color: 'success' },
    'celebration': { name: t('memories.gallery.types.celebration'), icon: 'mdi-party-popper', color: 'orange' },
    'general': { name: t('memories.gallery.types.general'), icon: 'mdi-camera', color: 'primary' }
  }
  
  props.memories.forEach(memory => {
    const category = memory.category || 'general'
    stats.set(category, (stats.get(category) || 0) + 1)
  })
  
  return Array.from(stats.entries())
    .map(([type, count]) => ({
      type,
      count,
      ...categoryConfig[type as keyof typeof categoryConfig]
    }))
    .sort((a, b) => b.count - a.count)
})

// Recent memories (last 3)
const recentMemories = computed(() => {
  return [...props.memories]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
})

// Monthly statistics
const thisMonthCount = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  
  return props.memories.filter(memory => {
    const memoryDate = new Date(memory.date)
    return memoryDate.getMonth() === thisMonth && memoryDate.getFullYear() === thisYear
  }).length
})

const lastMonthCount = computed(() => {
  const now = new Date()
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  
  return props.memories.filter(memory => {
    const memoryDate = new Date(memory.date)
    return memoryDate.getMonth() === lastMonth && memoryDate.getFullYear() === lastMonthYear
  }).length
})

const monthlyChange = computed(() => {
  return thisMonthCount.value - lastMonthCount.value
})

const monthlyProgress = computed(() => {
  if (lastMonthCount.value === 0) return 100
  return Math.min((thisMonthCount.value / lastMonthCount.value) * 100, 100)
})

// Utility functions
const getMemoryImage = (memory: Memory) => {
  const imageFile = memory.files?.find(file => 
    file.type?.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '')
  )
  return imageFile?.url || imageFile?.name
}

const formatRelativeTime = (date: string) => {
  const now = new Date()
  const memoryDate = new Date(date)
  const diffTime = now.getTime() - memoryDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return t('common.today')
  if (diffDays === 1) return t('common.yesterday')
  if (diffDays < 7) return t('common.daysAgo', { days: diffDays })
  if (diffDays < 30) return t('common.weeksAgo', { weeks: Math.floor(diffDays / 7) })
  return memoryDate.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.memory-stats-widget {
  display: flex;
  flex-direction: column;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-top: 4px;
}

.category-stats .category-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.1);
}

.category-stats .category-item:last-child {
  border-bottom: none;
}

.recent-item {
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.recent-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.monthly-progress {
  padding: 8px 0;
}

.progress-item {
  margin-bottom: 8px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-item {
    padding: 8px;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
}

/* Dark theme adjustments */
.v-theme--dark .stat-item {
  background: rgba(var(--v-theme-primary), 0.1);
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.v-theme--dark .recent-item:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}
</style>
