<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <h1 class="text-h4 font-weight-bold">{{ $t('memories.title') }}</h1>
            <p class="text-subtitle-1 text-medium-emphasis">{{ $t('memories.subtitle') }}</p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openCreateMemoryDialog"
          >
            {{ $t('memories.create') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Memory Statistics -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="pink" size="40" class="me-3">mdi-heart</v-icon>
              <div>
                <div class="text-h6">{{ totalMemories }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('memories.totalMemories') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="purple" size="40" class="me-3">mdi-calendar-heart</v-icon>
              <div>
                <div class="text-h6">
                  {{ daysTogether > 0 ? daysTogether : '--' }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ $t('memories.daysTogether') }}
                </div>
                <div v-if="daysTogether === 0" class="text-caption text-warning">
                  <router-link to="/profile" class="text-decoration-none">
                    Chưa thiết lập ngày bắt đầu
                  </router-link>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="orange" size="40" class="me-3">mdi-camera</v-icon>
              <div>
                <div class="text-h6">{{ photosCount }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('memories.photos') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="green" size="40" class="me-3">mdi-star</v-icon>
              <div>
                <div class="text-h6">{{ specialMoments }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('memories.specialMoments') }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          :label="$t('memories.search')"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          :label="$t('memories.category')"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          :label="$t('memories.sortBy')"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn icon="mdi-view-grid" value="grid" />
          <v-btn icon="mdi-view-list" value="list" />
          <v-btn icon="mdi-timeline" value="timeline" />
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Memories Grid View -->
    <v-row v-if="viewMode === 'grid'">
      <v-col
        v-for="memory in filteredMemories"
        :key="memory.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card hover @click="viewMemory(memory)" class="memory-card">
          <v-img
            v-if="memory.files && memory.files.length > 0"
            :src="memory.files[0].url"
            height="200"
            cover
          >
            <div class="memory-overlay">
              <v-chip
                :color="getCategoryColor(getLocationString(memory.location))"
                size="small"
                class="ma-2"
              >
                {{ memory.location || 'Memory' }}
              </v-chip>
            </div>
          </v-img>
          <div
            v-else
            class="d-flex align-center justify-center memory-placeholder"
            :style="{ backgroundColor: getCategoryColor(getLocationString(memory.location)) + '20' }"
          >
            <v-icon :color="getCategoryColor(getLocationString(memory.location))" size="60">
              {{ getCategoryIcon(getLocationString(memory.location)) }}
            </v-icon>
          </div>

          <v-card-text>
            <div class="text-subtitle-1 font-weight-medium mb-1">
              {{ memory.title }}
            </div>
            <div class="text-caption text-medium-emphasis mb-2">
              {{ formatDate(memory.memoryDate || memory.date) }}
            </div>
            <p class="text-body-2 memory-description">
              {{ memory.description }}
            </p>
          </v-card-text>

          <v-card-actions>
            <v-btn
              icon="mdi-heart"
              size="small"
              variant="text"
              :color="memory.isFavorite ? 'pink' : 'grey'"
              @click.stop="toggleFavorite(memory)"
            />
            <v-btn
              icon="mdi-share-variant"
              size="small"
              variant="text"
              @click.stop="shareMemory(memory)"
            />
            <v-spacer />
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click.stop="editMemory(memory)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click.stop="deleteMemory(memory)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Memories List View -->
    <v-row v-if="viewMode === 'list'">
      <v-col cols="12">
        <v-card>
          <v-list>
            <v-list-item
              v-for="memory in filteredMemories"
              :key="memory.id"
              @click="viewMemory(memory)"
            >
              <template #prepend>
                <v-avatar :color="getCategoryColor(getLocationString(memory.location))">
                  <v-icon>{{ getCategoryIcon(getLocationString(memory.location)) }}</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>{{ memory.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(memory.memoryDate || memory.date) }} • {{ getLocationString(memory.location) || 'Memory' }}
              </v-list-item-subtitle>

              <template #append>
                <v-btn
                  icon="mdi-heart"
                  size="small"
                  variant="text"
                  :color="memory.isFavorite ? 'pink' : 'grey'"
                  @click.stop="toggleFavorite(memory)"
                />
                <v-btn
                  icon="mdi-dots-vertical"
                  size="small"
                  variant="text"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Timeline View -->
    <v-row v-if="viewMode === 'timeline'">
      <v-col cols="12">
        <v-timeline side="end">
          <v-timeline-item
            v-for="memory in filteredMemories"
            :key="memory.id"
            :dot-color="getCategoryColor(getLocationString(memory.location))"
            size="small"
          >
            <template #icon>
              <v-icon>{{ getCategoryIcon(getLocationString(memory.location)) }}</v-icon>
            </template>

            <v-card @click="viewMemory(memory)">
              <v-card-title class="text-h6">
                {{ memory.title }}
              </v-card-title>
              <v-card-subtitle>
                {{ formatDate(memory.memoryDate || memory.date) }}
              </v-card-subtitle>
              <v-card-text>
                {{ memory.description }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-if="memories.length === 0 && !loading">
      <v-col cols="12" class="text-center py-12">
        <v-icon size="120" color="grey-lighten-2">mdi-heart-outline</v-icon>
        <h3 class="text-h5 mt-4 mb-2">{{ $t('memories.noMemories') }}</h3>
        <p class="text-body-1 text-medium-emphasis mb-4">{{ $t('memories.noMemoriesDescription') }}</p>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateMemoryDialog"
        >
          {{ $t('memories.createFirst') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="text-body-1 mt-4">{{ $t('memories.loading') }}</p>
      </v-col>
    </v-row>
    
    <!-- Dialog removed - using global dialog system -->
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemoriesStore } from '@/stores/memories'
import { useAuthStore } from '@/stores/auth'
import { useDialogsStore } from '@/stores/dialogs'
import type { Memory } from '@/types'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'

const { t } = useI18n()
const memoriesStore = useMemoriesStore()
const authStore = useAuthStore()
const dialogsStore = useDialogsStore()

// State
const editingMemory = ref<Memory | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('date-desc')
const viewMode = ref('grid')

// Get data from store
const memories = computed(() => memoriesStore.memories)
const loading = computed(() => memoriesStore.isLoading)
const error = computed(() => memoriesStore.error)

// Form
const memoryForm = ref({
  title: '',
  description: '',
  date: '',
  category: '',
  photos: [] as any[],
  isFavorite: false
})

// No more mock data - using real data from store

// Computed
const totalMemories = computed(() => memories.value.length)
const daysTogether = computed(() => {
  const startDate = authStore.user?.relationshipStartDate
  if (!startDate) {
    return 0 // Return 0 if no start date is set
  }
  const firstDate = new Date(startDate)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - firstDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})
const photosCount = computed(() => memories.value.reduce((sum: number, m: Memory) => sum + (m.files?.length || 0), 0))
const specialMoments = computed(() => memories.value.filter((m: Memory) => m.isFavorite).length)

const categories = [
  { title: 'Hẹn hò đầu tiên', value: 'Hẹn hò đầu tiên' },
  { title: 'Du lịch', value: 'Du lịch' },
  { title: 'Sinh nhật', value: 'Sinh nhật' },
  { title: 'Kỷ niệm', value: 'Kỷ niệm' },
  { title: 'Lễ hội', value: 'Lễ hội' },
  { title: 'Khác', value: 'Khác' }
]

const sortOptions = [
  { title: t('memories.newestFirst'), value: 'date-desc' },
  { title: t('memories.oldestFirst'), value: 'date-asc' },
  { title: t('memories.titleAZ'), value: 'title-asc' },
  { title: t('memories.favorites'), value: 'favorites' }
]

const filteredMemories = computed(() => {
  let filtered = [...memories.value]

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(memory =>
      memory.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      memory.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by category (using location as category)
  if (selectedCategory.value) {
    filtered = filtered.filter(memory => (memory.location || '') === selectedCategory.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.memoryDate || b.date || 0).getTime() - new Date(a.memoryDate || a.date || 0).getTime()
      case 'date-asc':
        return new Date(a.memoryDate || a.date || 0).getTime() - new Date(b.memoryDate || b.date || 0).getTime()
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'favorites':
        return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
      default:
        return 0
    }
  })

  return filtered
})

// Validation rules
const rules = {
  required: (value: any) => !!value || t('validation.required')
}

// Methods
const loadMemories = async () => {
  try {
    await memoriesStore.fetchMemories()
  } catch (error) {
    console.error('Failed to load memories:', error)
  }
}

const openCreateMemoryDialog = () => {
  // For now, use alert dialog as placeholder
  dialogsStore.openAlertDialog({
    title: 'Tạo Memory',
    message: 'Memory dialog sẽ được tích hợp sau. Hiện tại sử dụng route /memories/create'
  })
}

const viewMemory = (memory: Memory) => {
  // TODO: Navigate to memory detail view
  console.log('View memory:', memory)
}

const editMemory = (memory: Memory) => {
  // Use global dialog or route to edit
  dialogsStore.openAlertDialog({
    title: 'Chỉnh sửa Memory', 
    message: 'Edit memory dialog sẽ được tích hợp sau.'
  })
}

const deleteMemory = async (memory: Memory) => {
  const result = await Swal.fire({
    title: t('memories.confirmDeleteTitle') || 'Xác nhận xóa',
    text: t('memories.confirmDelete', { title: memory.title }),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#FF5722',
    cancelButtonColor: '#757575',
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
    reverseButtons: true,
    customClass: {
      popup: 'swal2-popup-custom',
      title: 'swal2-title-custom',
      confirmButton: 'swal2-confirm-custom',
      cancelButton: 'swal2-cancel-custom'
    }
  })

  if (result.isConfirmed) {
    try {
      await memoriesStore.deleteMemory(memory.id)
      
      Swal.fire({
        title: t('common.deleted') || 'Đã xóa!',
        text: t('memories.deleteSuccess') || 'Kỷ niệm đã được xóa thành công!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'swal2-popup-custom'
        }
      })
    } catch (error) {
      console.error('Delete failed:', error)
      
      Swal.fire({
        title: t('common.error') || 'Lỗi!',
        text: t('memories.deleteError') || 'Có lỗi xảy ra khi xóa kỷ niệm. Vui lòng thử lại.',
        icon: 'error',
        confirmButtonText: t('common.ok') || 'OK',
        confirmButtonColor: '#FF6B35',
        customClass: {
          popup: 'swal2-popup-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      })
    }
  }
}

const toggleFavorite = async (memory: Memory) => {
  try {
    await memoriesStore.toggleFavorite(memory.id)
  } catch (error) {
    console.error('Toggle favorite failed:', error)
  }
}

const shareMemory = async (memory: Memory) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: memory.title,
        text: memory.description,
        url: window.location.href + '/memories/' + memory.id
      })
    }
  } catch (error) {
    console.error('Share failed:', error)
  }
}

const saveMemory = async () => {
  try {
    if (editingMemory.value) {
      // Update existing memory
      await memoriesStore.updateMemory(editingMemory.value.id, {
        title: memoryForm.value.title,
        description: memoryForm.value.description,
        date: memoryForm.value.date,
        location: '',
        category: 'Khác',
        tags: [],
        isPrivate: false
      })
    } else {
      // Create new memory
      await memoriesStore.createMemory({
        title: memoryForm.value.title,
        description: memoryForm.value.description,
        date: memoryForm.value.date,
        location: '',
        category: 'Khác',
        tags: [],
        isPrivate: false
      })
    }
    
    // Dialog closed automatically in global system
    editingMemory.value = null
    // Reset form handled by global dialog
  } catch (error) {
    console.error('Save failed:', error)
  }
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Hẹn hò đầu tiên': 'pink',
    'Du lịch': 'blue',
    'Sinh nhật': 'orange',
    'Kỷ niệm': 'purple',
    'Lễ hội': 'green',
    'Khác': 'grey'
  }
  return colors[category] || 'grey'
}

// Helper function to get location as string
const getLocationString = (location: string | { name: string } | undefined): string => {
  if (!location) return 'Default'
  if (typeof location === 'string') return location
  return location.name || 'Default'
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'Hẹn hò đầu tiên': 'mdi-heart',
    'Du lịch': 'mdi-airplane',
    'Sinh nhật': 'mdi-cake',
    'Kỷ niệm': 'mdi-star',
    'Lễ hội': 'mdi-party-popper',
    'Khác': 'mdi-bookmark'
  }
  return icons[category] || 'mdi-bookmark'
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'Không xác định'
  return dayjs(date).format('DD/MM/YYYY')
}

// Lifecycle
onMounted(() => {
  loadMemories()
})
</script>

<style scoped>
.memory-card {
  transition: transform 0.2s;
}

.memory-card:hover {
  transform: translateY(-2px);
}

.memory-overlay {
  position: absolute;
  top: 0;
  right: 0;
}

.memory-placeholder {
  height: 200px;
}

.memory-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* SweetAlert2 Custom Styles */
:deep(.swal2-popup-custom) {
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

:deep(.swal2-title-custom) {
  color: #2c3e50 !important;
  font-weight: 600 !important;
}

:deep(.swal2-confirm-custom) {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%) !important;
  border: none !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  padding: 10px 24px !important;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3) !important;
  transition: all 0.3s ease !important;
}

:deep(.swal2-confirm-custom:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4) !important;
}

:deep(.swal2-cancel-custom) {
  background: #f5f5f5 !important;
  color: #666 !important;
  border: 1px solid #ddd !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  padding: 10px 24px !important;
  transition: all 0.3s ease !important;
}

:deep(.swal2-cancel-custom:hover) {
  background: #e0e0e0 !important;
  border-color: #bbb !important;
  transform: translateY(-1px) !important;
}

:deep(.swal2-icon.swal2-warning) {
  border-color: #FF8A65 !important;
  color: #FF6B35 !important;
}

:deep(.swal2-icon.swal2-success) {
  border-color: #4CAF50 !important;
  color: #4CAF50 !important;
}

:deep(.swal2-icon.swal2-error) {
  border-color: #F44336 !important;
  color: #F44336 !important;
}
</style>