<template>
  <div class="memory-statistics">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
      <p class="text-body-2 mt-2">Đang tải thống kê...</p>
    </div>

    <!-- Statistics Cards -->
    <div v-else-if="stats" class="stats-grid">
      <!-- Overview Cards -->
      <v-row class="mb-6">
        <v-col cols="6" sm="3">
          <v-card rounded="xl" elevation="2" class="stat-card">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="primary" class="mb-2">mdi-heart-multiple</v-icon>
              <div class="stat-number">{{ stats.totalMemories }}</div>
              <div class="stat-label">Tổng Memories</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="6" sm="3">
          <v-card rounded="xl" elevation="2" class="stat-card">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="red" class="mb-2">mdi-heart</v-icon>
              <div class="stat-number">{{ stats.favoriteMemories }}</div>
              <div class="stat-label">Yêu Thích</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="6" sm="3">
          <v-card rounded="xl" elevation="2" class="stat-card">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="success" class="mb-2">mdi-share-variant</v-icon>
              <div class="stat-number">{{ stats.sharedMemories }}</div>
              <div class="stat-label">Đã Chia Sẻ</div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="6" sm="3">
          <v-card rounded="xl" elevation="2" class="stat-card">
            <v-card-text class="text-center pa-4">
              <v-icon size="32" color="orange" class="mb-2">mdi-calendar-month</v-icon>
              <div class="stat-number">{{ stats.memoriesThisMonth }}</div>
              <div class="stat-label">Tháng Này</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Most Used Tags -->
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <v-card rounded="xl" elevation="2">
            <v-card-title class="pa-4">
              <v-icon color="primary" class="mr-2">mdi-tag-multiple</v-icon>
              Tags Phổ Biến
            </v-card-title>
            <v-card-text class="pa-4">
              <div v-if="stats.mostUsedTags && stats.mostUsedTags.length > 0" class="tags-list">
                <div
                  v-for="(tag, index) in stats.mostUsedTags.slice(0, 10)"
                  :key="tag.tag"
                  class="tag-item d-flex align-center justify-space-between mb-2"
                >
                  <div class="d-flex align-center">
                    <v-chip
                      :color="getTagColor(index)"
                      variant="tonal"
                      size="small"
                      class="mr-2"
                    >
                      {{ tag.tag }}
                    </v-chip>
                  </div>
                  <div class="tag-count">
                    <span class="text-h6 font-weight-medium">{{ tag.count }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-medium-emphasis">
                Chưa có tags nào
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Memory Count by Month -->
        <v-col cols="12" md="6">
          <v-card rounded="xl" elevation="2">
            <v-card-title class="pa-4">
              <v-icon color="primary" class="mr-2">mdi-chart-bar</v-icon>
              Memories Theo Tháng
            </v-card-title>
            <v-card-text class="pa-4">
              <div v-if="monthlyData && monthlyData.length > 0" class="monthly-chart">
                <div
                  v-for="month in monthlyData"
                  :key="month.month"
                  class="month-item d-flex align-center justify-space-between mb-3"
                >
                  <div class="month-label">
                    {{ month.monthName }}
                  </div>
                  <div class="month-bar-container">
                    <div class="month-bar-bg">
                      <div 
                        class="month-bar"
                        :style="{ width: `${month.percentage}%` }"
                      ></div>
                    </div>
                    <span class="month-count ml-2">{{ month.count }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-medium-emphasis">
                Chưa có dữ liệu theo tháng
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recent Memories -->
      <v-row v-if="stats.recentMemories && stats.recentMemories.length > 0">
        <v-col cols="12">
          <v-card rounded="xl" elevation="2">
            <v-card-title class="pa-4">
              <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
              Memories Gần Đây
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row>
                <v-col
                  v-for="memory in stats.recentMemories.slice(0, 4)"
                  :key="memory.id"
                  cols="12" sm="6" md="3"
                >
                  <v-card
                    rounded="lg"
                    elevation="1"
                    hover
                    @click="$emit('memory-click', memory)"
                    class="recent-memory-card"
                  >
                    <div class="recent-memory-image">
                      <v-img
                        v-if="memory.files && memory.files[0]"
                        :src="memory.files[0].url"
                        :alt="memory.title"
                        aspect-ratio="1.5"
                        cover
                      />
                      <div v-else class="image-placeholder">
                        <v-icon size="32" color="grey-lighten-2">mdi-image-outline</v-icon>
                      </div>
                    </div>
                    <v-card-text class="pa-3">
                      <h4 class="text-subtitle-2 font-weight-medium mb-1 text-truncate">
                        {{ memory.title }}
                      </h4>
                      <p class="text-caption text-medium-emphasis text-truncate">
                        {{ memory.description || memory.content || '' }}
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <v-icon size="64" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
      <h4 class="text-h6 font-weight-medium mb-2">Không thể tải thống kê</h4>
      <p class="text-body-2 text-medium-emphasis mb-4">{{ error }}</p>
      <v-btn color="primary" variant="outlined" @click="fetchStats">
        <v-icon start>mdi-refresh</v-icon>
        Thử Lại
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMemoriesStore } from '@/stores/memories'
import type { Memory } from '@/types'

// Define emits
defineEmits<{
  'memory-click': [memory: Memory]
}>()

// Store
const memoriesStore = useMemoriesStore()

// Local state
const stats = ref<any>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Computed
const monthlyData = computed(() => {
  if (!stats.value?.memoryCountByMonth) return []
  
  const months = Object.entries(stats.value.memoryCountByMonth)
  const maxCount = Math.max(...months.map(([, count]) => count as number), 1)
  
  return months.map(([monthKey, count]) => {
    const [year, month] = monthKey.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    
    return {
      month: monthKey,
      monthName: date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
      count: count as number,
      percentage: ((count as number) / maxCount) * 100
    }
  }).sort((a, b) => a.month.localeCompare(b.month))
})

// Methods
const fetchStats = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await memoriesStore.fetchMemoryStats()
    stats.value = response
  } catch (err: any) {
    error.value = err.message || 'Không thể tải thống kê'
    console.error('Error fetching memory stats:', err)
  } finally {
    isLoading.value = false
  }
}

const getTagColor = (index: number) => {
  const colors = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']
  return colors[index % colors.length]
}

// Lifecycle
onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.memory-statistics {
  padding: 16px;
}

.stats-grid {
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: 4px;
}

.tag-item {
  padding: 4px 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.tag-item:last-child {
  border-bottom: none;
}

.tag-count {
  min-width: 40px;
  text-align: right;
}

.month-item {
  padding: 4px 0;
}

.month-label {
  min-width: 120px;
  font-size: 0.875rem;
  font-weight: 500;
}

.month-bar-container {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 200px;
}

.month-bar-bg {
  flex: 1;
  height: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-right: 8px;
}

.month-bar {
  height: 100%;
  background: rgb(var(--v-theme-primary));
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
}

.month-count {
  min-width: 30px;
  text-align: right;
  font-size: 0.875rem;
  font-weight: 600;
}

.recent-memory-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.recent-memory-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.recent-memory-image {
  position: relative;
}

.image-placeholder {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
</style>
