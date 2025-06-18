<template>
  <div class="timeline-view">
    <v-container fluid>
      <!-- Header -->
      <div class="timeline-header">
        <h1 class="page-title">Timeline Sự kiện</h1>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="showCreateForm = true"
        >
          Tạo sự kiện mới
        </v-btn>
      </div>

      <!-- Upcoming Anniversaries -->
      <v-card v-if="upcomingAnniversaries.length > 0" class="upcoming-section mb-6">
        <v-card-title>
          <v-icon icon="mdi-calendar-heart" color="error" />
          Ngày kỷ niệm sắp tới
        </v-card-title>
        <v-card-text>
          <div class="upcoming-list">
            <div 
              v-for="event in upcomingAnniversaries" 
              :key="event.id"
              class="upcoming-item"
            >
              <v-chip color="error" variant="outlined" size="small">
                {{ formatUpcomingDate(event.date) }}
              </v-chip>
              <span class="upcoming-title">{{ event.title }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Filters and Search -->
      <v-card class="filters-section mb-6">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                v-model="filters.type"
                :items="typeFilterOptions"
                label="Loại sự kiện"
                clearable
                @update:model-value="applyFilters"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="filters.priority"
                :items="priorityFilterOptions"
                label="Độ ưu tiên"
                clearable
                @update:model-value="applyFilters"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="filters.startDate"
                label="Từ ngày"
                type="date"
                clearable
                @update:model-value="applyFilters"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="filters.endDate"
                label="Đến ngày"
                type="date"
                clearable
                @update:model-value="applyFilters"
              />
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" md="9">
              <v-text-field
                v-model="searchQuery"
                label="Tìm kiếm sự kiện..."
                prepend-inner-icon="mdi-magnify"
                clearable
                @update:model-value="handleSearch"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                variant="outlined"
                block
                @click="clearAllFilters"
              >
                <v-icon icon="mdi-filter-off" />
                Xóa bộ lọc
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Statistics -->
      <v-row v-if="eventStats" class="stats-section mb-6">
        <v-col cols="6" md="3">
          <v-card class="stat-card">
            <v-card-text class="text-center">
              <div class="stat-number">{{ eventStats.total }}</div>
              <div class="stat-label">Tổng cộng</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card class="stat-card">
            <v-card-text class="text-center">
              <div class="stat-number text-info">{{ eventStats.memories }}</div>
              <div class="stat-label">Kỷ niệm</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card class="stat-card">
            <v-card-text class="text-center">
              <div class="stat-number text-error">{{ eventStats.anniversaries }}</div>
              <div class="stat-label">Ngày kỷ niệm</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card class="stat-card">
            <v-card-text class="text-center">
              <div class="stat-number text-warning">{{ eventStats.milestones }}</div>
              <div class="stat-label">Cột mốc</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Events List -->
      <div class="events-container">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64" />
          <p class="mt-4">Đang tải sự kiện...</p>
        </div>
        
        <!-- Empty State -->
        <v-card v-else-if="filteredEvents.length === 0" class="empty-state">
          <v-card-text class="text-center py-12">
            <v-icon icon="mdi-calendar-blank" size="64" color="grey" />
            <h3 class="mt-4">Chưa có sự kiện nào</h3>
            <p class="text-grey">
              {{ searchQuery || hasActiveFilters ? 'Không tìm thấy sự kiện nào phù hợp với bộ lọc' : 'Hãy tạo sự kiện đầu tiên để lưu giữ những kỷ niệm đẹp!' }}
            </p>
            <v-btn
              v-if="!searchQuery && !hasActiveFilters"
              color="primary"
              class="mt-4"
              @click="showCreateForm = true"
            >
              Tạo sự kiện đầu tiên
            </v-btn>
          </v-card-text>
        </v-card>
        
        <!-- Events Grid -->
        <div v-else class="events-list">
          <TimelineEventCard
            v-for="event in filteredEvents"
            :key="event.id"
            :event="event"
            @edit="handleEditEvent"
            @delete="handleDeleteEvent"
          />
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore && !loading" class="text-center mt-6">
        <v-btn
          variant="outlined"
          :loading="loading"
          @click="loadMoreEvents"
        >
          Xem thêm
        </v-btn>
      </div>
    </v-container>    <!-- Create/Edit Form -->
    <TimelineEventForm
      v-if="showCreateForm || editingEvent"
      :event="editingEvent || undefined"
      @save="handleSaveEvent"
      @cancel="handleCancelForm"
    />

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useTimelineEvents } from '@/composables/useTimelineEvents'
import type { TimelineEvent, TimelineEventFilters } from '@/types'
import type { CreateTimelineEventData } from '@/services/timelineEvents'
import TimelineEventCard from '@/components/TimelineEventCard.vue'
import TimelineEventForm from '@/components/TimelineEventForm.vue'

// Composables
const {
  events: filteredEvents,
  loading,
  hasMore,
  eventStats,
  addEvent,
  updateEvent,
  deleteEvent,
  setFilters,
  setSearchQuery,
  getUpcomingAnniversaries,
  loadMoreEvents
} = useTimelineEvents()

// State
const showCreateForm = ref(false)
const editingEvent = ref<TimelineEvent | null>(null)
const searchQuery = ref('')
const upcomingAnniversaries = ref<TimelineEvent[]>([])

const filters = reactive<{
  type?: string
  priority?: string
  startDate?: string
  endDate?: string
}>({})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Filter options
const typeFilterOptions = [
  { title: 'Kỷ niệm', value: 'memory' },
  { title: 'Ngày kỷ niệm', value: 'anniversary' },
  { title: 'Cột mốc', value: 'milestone' }
]

const priorityFilterOptions = [
  { title: 'Thấp', value: 'low' },
  { title: 'Trung bình', value: 'medium' },
  { title: 'Cao', value: 'high' }
]

// Computed
const hasActiveFilters = computed(() => {
  return !!(filters.type || filters.priority || filters.startDate || filters.endDate)
})

// Methods
const loadUpcomingAnniversaries = async () => {
  try {
    upcomingAnniversaries.value = await getUpcomingAnniversaries(30)
  } catch (error) {
    console.error('Error loading upcoming anniversaries:', error)
  }
}

const applyFilters = () => {
  const filterData: TimelineEventFilters = {}
  
  if (filters.type) filterData.type = filters.type as any
  if (filters.priority) filterData.priority = filters.priority as any
  if (filters.startDate && filters.endDate) {
    filterData.dateRange = {
      start: new Date(filters.startDate),
      end: new Date(filters.endDate)
    }
  }
  
  setFilters(filterData)
}

const handleSearch = () => {
  setSearchQuery(searchQuery.value)
}

const clearAllFilters = () => {
  filters.type = undefined
  filters.priority = undefined
  filters.startDate = undefined
  filters.endDate = undefined
  searchQuery.value = ''
  
  setFilters({})
  setSearchQuery('')
}

const handleEditEvent = (event: TimelineEvent) => {
  editingEvent.value = event
}

const handleDeleteEvent = async (eventId: string) => {
  try {
    await deleteEvent(eventId)
    showSnackbar('Đã xóa sự kiện thành công', 'success')
    await loadUpcomingAnniversaries() // Refresh upcoming anniversaries
  } catch (error) {
    showSnackbar('Không thể xóa sự kiện', 'error')
  }
}

const handleSaveEvent = async (eventData: CreateTimelineEventData) => {
  try {
    if (editingEvent.value) {
      await updateEvent(editingEvent.value.id, eventData)
      showSnackbar('Đã cập nhật sự kiện thành công', 'success')
    } else {
      await addEvent(eventData)
      showSnackbar('Đã tạo sự kiện mới thành công', 'success')
    }
    
    await loadUpcomingAnniversaries() // Refresh upcoming anniversaries
    handleCancelForm()
  } catch (error) {
    showSnackbar(
      editingEvent.value ? 'Không thể cập nhật sự kiện' : 'Không thể tạo sự kiện',
      'error'
    )
  }
}

const handleCancelForm = () => {
  showCreateForm.value = false
  editingEvent.value = null
}

const showSnackbar = (message: string, color: string = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

const formatUpcomingDate = (date: Date) => {
  const now = new Date()
  const eventThisYear = new Date(now.getFullYear(), date.getMonth(), date.getDate())
  const diffTime = eventThisYear.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hôm nay'
  if (diffDays === 1) return 'Ngày mai'
  return `${diffDays} ngày nữa`
}

// Initialize data
onMounted(() => {
  loadUpcomingAnniversaries()
})
</script>

<style scoped>
.timeline-view {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  margin: 0;
}

.upcoming-section .v-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upcoming-title {
  font-weight: 500;
}

.filters-section {
  background: rgb(var(--v-theme-surface));
}

.stats-section .stat-card {
  background: rgb(var(--v-theme-surface));
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.stat-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: uppercase;
  font-weight: 500;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  background: rgb(var(--v-theme-surface));
}

@media (max-width: 768px) {
  .timeline-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .upcoming-list {
    gap: 12px;
  }
  
  .upcoming-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
