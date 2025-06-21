<template>
  <div class="shared-memories-view">    <!-- Header -->
    <div class="text-center mb-6">
      <h2 class="text-h4 font-weight-medium text-high-emphasis mb-3">
        💑 Memories Được Chia Sẻ
      </h2>
      <p class="text-h6 text-medium-emphasis">
        Những khoảnh khắc đặc biệt mà bạn và người yêu đã chia sẻ
      </p>
      
      <!-- Stats Info -->
      <div v-if="pagination" class="mt-4">
        <v-chip color="primary" variant="tonal" size="small" class="mr-2">
          <v-icon start size="16">mdi-counter</v-icon>
          {{ pagination.total }} memories
        </v-chip>
        <v-chip v-if="filters?.dateRange" color="secondary" variant="tonal" size="small">
          <v-icon start size="16">mdi-calendar-range</v-icon>
          {{ formatDateRange(filters.dateRange) }}
        </v-chip>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
      <p class="text-body-1 mt-4">Đang tải memories được chia sẻ...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="sharedMemories.length === 0" class="text-center py-12">
      <v-icon size="100" color="grey-lighten-2" class="mb-4">mdi-heart-multiple-outline</v-icon>
      <h3 class="text-h5 font-weight-medium mb-2">Chưa có memories được chia sẻ</h3>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Bắt đầu chia sẻ những khoảnh khắc đẹp với người yêu
      </p>
      <v-btn
        color="primary"
        variant="elevated"
        size="large"
        rounded="xl"
        @click="$router.push('/memories')"
      >
        <v-icon start>mdi-plus</v-icon>
        Tạo Memory Đầu Tiên
      </v-btn>
    </div>

    <!-- Shared Memories Grid -->
    <div v-else class="memories-grid">
      <v-row>
        <v-col
          v-for="memory in sharedMemories"
          :key="memory.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="memory-card"
            rounded="xl"
            elevation="2"
            hover
            @click="openMemoryDetail(memory)"
          >
            <!-- Memory Image -->
            <div class="memory-image-container">
              <v-img
                v-if="memory.files && memory.files[0]"
                :src="memory.files[0].url"
                :alt="memory.title"
                aspect-ratio="1.5"
                cover
                class="memory-image"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
              </v-img>
              <div v-else class="memory-placeholder">
                <v-icon size="48" color="grey-lighten-2">mdi-image-outline</v-icon>
              </div>

              <!-- Shared Badge -->
              <v-chip
                class="shared-badge"
                color="primary"
                variant="elevated"
                size="small"
              >
                <v-icon start size="16">mdi-share-variant</v-icon>
                Shared
              </v-chip>

              <!-- Favorite Button -->
              <v-btn
                class="favorite-btn"
                :color="memory.isFavorite ? 'red' : 'white'"
                icon
                size="small"
                variant="elevated"
                @click.stop="toggleFavorite(memory)"
              >
                <v-icon :color="memory.isFavorite ? 'white' : 'grey'">
                  {{ memory.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-btn>
            </div>

            <!-- Memory Content -->
            <v-card-text class="pa-4">
              <h4 class="text-h6 font-weight-medium mb-2 text-truncate">
                {{ memory.title }}
              </h4>              <p class="text-body-2 text-medium-emphasis mb-3 text-truncate-2">
                {{ memory.description || memory.content || '' }}
              </p>

              <!-- Memory Meta -->
              <div class="memory-meta">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon size="16" color="grey" class="mr-1">mdi-calendar</v-icon>                    <span class="text-caption text-medium-emphasis">
                      {{ formatDate(memory.date || memory.memoryDate || '') }}
                    </span>
                  </div>
                  <div v-if="memory.location" class="d-flex align-center">
                    <v-icon size="16" color="grey" class="mr-1">mdi-map-marker</v-icon>
                    <span class="text-caption text-medium-emphasis text-truncate">
                      {{ typeof memory.location === 'string' ? memory.location : memory.location.name }}
                    </span>
                  </div>
                </div>

                <!-- Shared By Info -->
                <div v-if="memory.sharedBy" class="mt-2 d-flex align-center">
                  <v-avatar size="20" class="mr-2">
                    <v-img v-if="memory.sharedBy.avatar" :src="memory.sharedBy.avatar" />
                    <v-icon v-else size="12">mdi-account</v-icon>
                  </v-avatar>
                  <span class="text-caption text-medium-emphasis">
                    Shared by {{ memory.sharedBy.fullName }}
                  </span>
                </div>
              </div>
            </v-card-text>

            <!-- Action Menu -->
            <v-card-actions class="pa-2">
              <v-spacer />
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    size="small"
                    variant="text"
                    v-bind="props"
                  />
                </template>
                <v-list>
                  <v-list-item @click="openMemoryDetail(memory)">
                    <v-list-item-title>
                      <v-icon start>mdi-eye</v-icon>
                      Xem Chi Tiết
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="toggleFavorite(memory)">
                    <v-list-item-title>
                      <v-icon start>{{ memory.isFavorite ? 'mdi-heart-off' : 'mdi-heart' }}</v-icon>
                      {{ memory.isFavorite ? 'Bỏ Yêu Thích' : 'Yêu Thích' }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </v-card>        </v-col>
      </v-row>
      
      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="text-center mt-8">
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalPages"
          :total-visible="5"
          color="primary"
          @update:model-value="onPageChange"
        />
        <p class="text-caption text-medium-emphasis mt-2">
          Hiển thị {{ ((pagination.page - 1) * pagination.limit) + 1 }} - 
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
          trên {{ pagination.total }} memories
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemoriesStore } from '@/stores/memories'
import type { Memory } from '@/types'

// Composables
const router = useRouter()
const memoriesStore = useMemoriesStore()

// Local state
const sharedMemories = ref<Memory[]>([])
const isLoading = ref(false)
const pagination = ref<any>(null)
const filters = ref<any>(null)

// Methods
const fetchSharedMemories = async () => {
  try {
    isLoading.value = true
    const response = await memoriesStore.fetchSharedMemoriesWithDetails()
    sharedMemories.value = response.data.memories
    pagination.value = response.data.pagination
    filters.value = response.data.filters
  } catch (error) {
    console.error('Error fetching shared memories:', error)
  } finally {
    isLoading.value = false
  }
}

const openMemoryDetail = (memory: Memory) => {
  router.push(`/memories/${memory.id}`)
}

const toggleFavorite = async (memory: Memory) => {
  try {
    await memoriesStore.toggleFavorite(memory.id)
    // Update local state
    const index = sharedMemories.value.findIndex(m => m.id === memory.id)
    if (index !== -1) {
      sharedMemories.value[index].isFavorite = !sharedMemories.value[index].isFavorite
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

const formatDate = (date: string | Date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateRange = (dateRange: { earliest: string; latest: string }) => {
  if (!dateRange.earliest || !dateRange.latest) return ''
  
  const earliest = new Date(dateRange.earliest)
  const latest = new Date(dateRange.latest)
  
  // If same date, show only one date
  if (earliest.toDateString() === latest.toDateString()) {
    return formatDate(earliest)
  }
  
  // If same year, don't repeat year
  if (earliest.getFullYear() === latest.getFullYear()) {
    return `${earliest.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })} - ${latest.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  
  return `${formatDate(earliest)} - ${formatDate(latest)}`
}

const onPageChange = (page: number) => {
  // TODO: Implement pagination - call API with new page number
  console.log('Page changed to:', page)
  // For now, we'll just log it. In a full implementation, 
  // we'd need to modify the service to accept pagination parameters
}

// Lifecycle
onMounted(() => {
  fetchSharedMemories()
})
</script>

<style scoped>
.shared-memories-view {
  padding: 24px;
}

.memories-grid {
  margin-top: 24px;
}

.memory-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

.memory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.memory-image-container {
  position: relative;
}

.memory-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.shared-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
}

.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.memory-meta {
  margin-top: 8px;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
