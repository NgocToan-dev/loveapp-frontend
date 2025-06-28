<template>
  <div class="timeline-container">
    <!-- Timeline Filters -->
    <div class="timeline-filters">
      <div class="filter-tabs">
        <button
          v-for="filter in filterOptions"
          :key="filter.value"
          :class="['filter-tab', { active: activeFilter === filter.value }]"
          @click="activeFilter = filter.value"
        >
          <span class="filter-icon">{{ filter.icon }}</span>
          <span>{{ $t(filter.label) }}</span>
        </button>
      </div>
      
      <div class="sort-controls">
        <button
          :class="['sort-btn', { active: sortOrder === 'desc' }]"
          @click="sortOrder = 'desc'"
          :title="$t('timeline.sortDesc')"
        >
          <SortDescIcon />
        </button>
        <button
          :class="['sort-btn', { active: sortOrder === 'asc' }]"
          @click="sortOrder = 'asc'"  
          :title="$t('timeline.sortAsc')"
        >
          <SortAscIcon />
        </button>
      </div>
    </div>

    <!-- Timeline Items -->
    <div v-if="isLoading" class="timeline-loading">
      <LoadingSpinner />
      <p>{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="filteredItems.length === 0" class="timeline-empty">
      <div class="empty-icon">📅</div>
      <h3>{{ $t('timeline.empty.title') }}</h3>
      <p>{{ $t('timeline.empty.description') }}</p>
      <div class="empty-actions">
        <Button @click="$router.push('/memories')" variant="primary">
          {{ $t('timeline.empty.createMemory') }}
        </Button>
        <Button @click="$router.push('/reminders')" variant="outline">
          {{ $t('timeline.empty.createReminder') }}
        </Button>
      </div>
    </div>

    <div v-else class="timeline-list">
      <div
        v-for="item in filteredItems"
        :key="`${item.type}-${item.id}`"
        class="timeline-item"
        :data-type="item.type"
      >
        <div class="timeline-marker">
          <div :class="['timeline-dot', `timeline-${item.type}`]">
            <span class="timeline-icon">{{ getTypeIcon(item.type) }}</span>
          </div>
        </div>

        <div class="timeline-content">
          <div class="timeline-card">
            <div class="timeline-header">
              <div class="timeline-title">
                <h4>{{ item.title }}</h4>
                <span class="timeline-type">{{ $t(`timeline.types.${item.type}`) }}</span>
              </div>
              <div class="timeline-date">
                {{ formatDate(item.date, 'relative') }}
              </div>
            </div>

            <div v-if="item.description" class="timeline-description">
              {{ truncateText(item.description, 150) }}
            </div>

            <div v-if="item.imageUrl" class="timeline-image">
              <img 
                :src="item.imageUrl" 
                :alt="item.title"
                @click="showImagePreview(item.imageUrl)"
                loading="lazy"
              />
            </div>

            <div class="timeline-meta">
              <div class="timeline-status">
                <!-- Memory Status -->
                <div v-if="item.type === 'memory'" class="status-memory">
                  <div class="status-dot status-memory-dot"></div>
                  <span>{{ $t('timeline.types.memory') }}</span>
                </div>

                <!-- Reminder Status -->
                <div v-else-if="item.type === 'reminder'" class="status-reminder">
                  <div 
                    :class="[
                      'status-dot',
                      item.isCompleted ? 'status-completed' : 'status-pending'
                    ]"
                  ></div>
                  <span>
                    {{ item.isCompleted ? $t('reminders.status.completed') : $t('reminders.status.pending') }}
                  </span>
                </div>

                <!-- Anniversary Status -->
                <div v-else-if="item.type === 'anniversary'" class="status-anniversary">
                  <div class="status-dot status-anniversary-dot"></div>
                  <span>{{ $t('timeline.types.anniversary') }}</span>
                </div>
              </div>

              <div class="timeline-actions">
                <button
                  v-if="item.type === 'memory'"
                  @click="viewMemory(item.id)"
                  class="action-btn"
                  :title="$t('common.actions.view')"
                >
                  <ViewIcon />
                </button>
                <button
                  v-if="item.type === 'reminder'"
                  @click="viewReminder(item.id)"
                  class="action-btn"
                  :title="$t('common.actions.view')"
                >
                  <ViewIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <ImagePreview 
      v-if="previewImage"
      :imageUrl="previewImage"
      @close="previewImage = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMemories } from '@/composables/useMemories'
import { useReminders } from '@/composables/useReminders'
import { useCouple } from '@/composables/useCouple'
import { formatDate, truncateText, getDaysUntil } from '@/utils/helpers'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ImagePreview from '@/components/common/ImagePreview.vue'

// Timeline items interface
interface TimelineItem {
  id: string
  type: 'memory' | 'reminder' | 'anniversary'
  title: string
  description?: string
  date: string
  imageUrl?: string
  isCompleted?: boolean
}

const { t } = useI18n()
const router = useRouter()

const memoriesStore = useMemories()
const remindersStore = useReminders()
const { coupleConnection } = useCouple()

// State
const activeFilter = ref<string>('all')
const sortOrder = ref<'asc' | 'desc'>('desc')
const previewImage = ref<string | null>(null)

// Filter options
const filterOptions = [
  { value: 'all', label: 'timeline.filters.all', icon: '📅' },
  { value: 'memories', label: 'timeline.filters.memories', icon: '📸' },
  { value: 'reminders', label: 'timeline.filters.reminders', icon: '⏰' },
  { value: 'anniversaries', label: 'timeline.filters.anniversaries', icon: '💕' }
]

// Computed
const isLoading = computed(() => memoriesStore.isLoading || remindersStore.isLoading)

const timelineItems = computed(() => {
  const items: TimelineItem[] = []

  // Add memories (with enhanced safe guard)
  if (memoriesStore.memories && Array.isArray(memoriesStore.memories) && memoriesStore.memories.length > 0) {
    try {
      memoriesStore.memories.forEach((memory: any) => {
        if (memory && memory.id && memory.title && memory.createdAt) {
          items.push({
            id: memory.id,
            type: 'memory',
            title: memory.title,
            description: memory.content || '',
            date: memory.createdAt,
            imageUrl: memory.imageUrl
          })
        }
      })
    } catch (error) {
      console.error('Error processing memories:', error)
    }
  }

  // Add reminders (with enhanced safe guard)
  if (remindersStore.reminders && Array.isArray(remindersStore.reminders) && remindersStore.reminders.length > 0) {
    try {
      remindersStore.reminders.forEach((reminder: any) => {
        if (reminder && reminder.id && reminder.title && reminder.reminderDate) {
          items.push({
            id: reminder.id,
            type: 'reminder',
            title: reminder.title,
            description: reminder.description || '',
            date: reminder.reminderDate,
            isCompleted: reminder.isCompleted
          })
        }
      })
    } catch (error) {
      console.error('Error processing reminders:', error)
    }
  }

  // Add anniversary if couple exists
  if (coupleConnection.value?.relationshipStart) {
    const relationshipStart = new Date(coupleConnection.value.relationshipStart)
    const today = new Date()
    
    // Calculate years together
    let years = today.getFullYear() - relationshipStart.getFullYear()
    const monthDiff = today.getMonth() - relationshipStart.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < relationshipStart.getDate())) {
      years--
    }
    
    if (years > 0) {
      // Create anniversary for each year
      for (let year = 1; year <= years; year++) {
        const anniversaryDate = new Date(relationshipStart)
        anniversaryDate.setFullYear(relationshipStart.getFullYear() + year)
        
        items.push({
          id: `anniversary-${year}`,
          type: 'anniversary',
          title: t('timeline.anniversary.title'),
          description: t('timeline.anniversary.description'),
          date: anniversaryDate.toISOString()
        })
      }
    }
  }

  return items
})

const filteredItems = computed(() => {
  let filtered = timelineItems.value

  // Apply filter
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'anniversaries') {
      filtered = filtered.filter(item => item.type === 'anniversary')
    } else {
      filtered = filtered.filter(item => item.type === activeFilter.value.slice(0, -1)) // Remove 's' from plural
    }
  }

  // Apply sort
  return filtered.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })
})

// Methods
const getTypeIcon = (type: string) => {
  const icons = {
    memory: '📸',
    reminder: '⏰',
    anniversary: '💕'
  }
  return icons[type as keyof typeof icons] || '✨'
}

const showImagePreview = (imageUrl: string) => {
  previewImage.value = imageUrl
}

const viewMemory = (id: string) => {
  router.push('/memories')
}

const viewReminder = (id: string) => {
  router.push('/reminders')
}

// Icon components
import SortDescIcon from '@/components/icons/SortDescIcon.vue'
import SortAscIcon from '@/components/icons/SortAscIcon.vue'
import ViewIcon from '@/components/icons/ViewIcon.vue'

// Lifecycle
onMounted(async () => {
  await Promise.all([
    memoriesStore.fetchMemories(),
    remindersStore.fetchReminders()
  ])
})
</script>

<style scoped>
.timeline-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.timeline-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.filter-tab:hover {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.05);
}

.filter-tab.active {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
}

.filter-icon {
  font-size: 16px;
}

.sort-controls {
  display: flex;
  gap: 4px;
}

.sort-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.05);
}

.sort-btn.active {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
}

.sort-btn svg {
  width: 16px;
  height: 16px;
}

.timeline-loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.timeline-empty {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
}

.timeline-list {
  position: relative;
}

.timeline-list::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item {
  position: relative;
  padding-left: 64px;
  margin-bottom: 32px;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 0;
}

.timeline-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 3px solid;
  position: relative;
  z-index: 2;
}

.timeline-memory {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
}

.timeline-reminder {
  border-color: #ff9800;
  background: #ff9800;
  color: white;
}

.timeline-anniversary {
  border-color: #e91e63;
  background: #e91e63;
  color: white;
}

.timeline-icon {
  font-size: 18px;
}

.timeline-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.2s ease;
}

.timeline-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.timeline-title h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.timeline-type {
  display: inline-block;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.timeline-date {
  color: #999;
  font-size: 14px;
  white-space: nowrap;
}

.timeline-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
}

.timeline-image {
  margin-bottom: 12px;
}

.timeline-image img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.timeline-image img:hover {
  transform: scale(1.02);
}

.timeline-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-memory-dot {
  background: #4caf50;
}

.status-completed {
  background: #4caf50;
}

.status-pending {
  background: #ff9800;
}

.status-anniversary-dot {
  background: #e91e63;
}

.timeline-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .timeline-container {
    padding: 16px;
  }
  
  .timeline-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-tabs {
    justify-content: stretch;
  }
  
  .filter-tab {
    flex: 1;
    justify-content: center;
    font-size: 12px;
    padding: 6px 12px;
  }
  
  .timeline-list::before {
    left: 16px;
  }
  
  .timeline-item {
    padding-left: 52px;
  }
  
  .timeline-dot {
    width: 32px;
    height: 32px;
  }
  
  .timeline-icon {
    font-size: 14px;
  }
  
  .timeline-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .timeline-title h4 {
    font-size: 16px;
  }
  
  .empty-actions {
    flex-direction: column;
  }
}
</style>
