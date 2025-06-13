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
            @click="createDialog = true"
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
                <div class="text-h6">{{ daysTogether }}</div>
                <div class="text-caption text-medium-emphasis">{{ $t('memories.daysTogether') }}</div>
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
            v-if="memory.coverImage"
            :src="memory.coverImage"
            height="200"
            cover
          >
            <div class="memory-overlay">
              <v-chip
                :color="getCategoryColor(memory.category)"
                size="small"
                class="ma-2"
              >
                {{ memory.category }}
              </v-chip>
            </div>
          </v-img>
          <div
            v-else
            class="d-flex align-center justify-center memory-placeholder"
            :style="{ backgroundColor: getCategoryColor(memory.category) + '20' }"
          >
            <v-icon :color="getCategoryColor(memory.category)" size="60">
              {{ getCategoryIcon(memory.category) }}
            </v-icon>
          </div>

          <v-card-text>
            <div class="text-subtitle-1 font-weight-medium mb-1">
              {{ memory.title }}
            </div>
            <div class="text-caption text-medium-emphasis mb-2">
              {{ formatDate(memory.date) }}
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
                <v-avatar :color="getCategoryColor(memory.category)">
                  <v-icon>{{ getCategoryIcon(memory.category) }}</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>{{ memory.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(memory.date) }} • {{ memory.category }}
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
            :dot-color="getCategoryColor(memory.category)"
            size="small"
          >
            <template #icon>
              <v-icon>{{ getCategoryIcon(memory.category) }}</v-icon>
            </template>

            <v-card @click="viewMemory(memory)">
              <v-card-title class="text-h6">
                {{ memory.title }}
              </v-card-title>
              <v-card-subtitle>
                {{ formatDate(memory.date) }}
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
          @click="createDialog = true"
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

    <!-- Create/Edit Memory Dialog -->
    <v-dialog v-model="createDialog" max-width="800">
      <v-card>
        <v-card-title>
          {{ editingMemory ? $t('memories.editMemory') : $t('memories.createMemory') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="memoryForm">
            <v-text-field
              v-model="memoryForm.title"
              :label="$t('memories.memoryTitle')"
              variant="outlined"
              :rules="[rules.required]"
              class="mb-3"
            />
            
            <v-textarea
              v-model="memoryForm.description"
              :label="$t('memories.description')"
              variant="outlined"
              rows="3"
              class="mb-3"
            />

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="memoryForm.date"
                  :label="$t('memories.date')"
                  type="date"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="memoryForm.category"
                  :items="categories"
                  :label="$t('memories.category')"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>

            <v-file-input
              v-model="memoryForm.photos"
              :label="$t('memories.photos')"
              variant="outlined"
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              class="mb-3"
            />

            <v-switch
              v-model="memoryForm.isFavorite"
              :label="$t('memories.markAsFavorite')"
              color="pink"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="createDialog = false">{{ $t('common.cancel') }}</v-btn>
          <v-btn color="primary" @click="saveMemory">
            {{ editingMemory ? $t('common.save') : $t('memories.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

const { t } = useI18n()

interface Memory {
  id: string
  title: string
  description: string
  date: Date
  category: string
  coverImage?: string
  isFavorite: boolean
  photos?: any[]
}

// State
const memories = ref<Memory[]>([])
const loading = ref(false)
const createDialog = ref(false)
const editingMemory = ref<Memory | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('date-desc')
const viewMode = ref('grid')

// Form
const memoryForm = ref({
  title: '',
  description: '',
  date: '',
  category: '',
  photos: [] as any[],
  isFavorite: false
})

// Mock data
const mockMemories = [
  {
    id: '1',
    title: 'Ngày đầu tiên gặp nhau',
    description: 'Khoảnh khắc đặc biệt khi chúng ta lần đầu gặp gỡ tại quán cà phê nhỏ.',
    date: new Date('2023-01-15'),
    category: 'Hẹn hò đầu tiên',
    coverImage: '/api/memories/1/cover.jpg',
    isFavorite: true
  },
  {
    id: '2',
    title: 'Chuyến du lịch Đà Lạt',
    description: 'Chuyến đi đáng nhớ cùng nhau khám phá thành phố ngàn hoa.',
    date: new Date('2023-06-20'),
    category: 'Du lịch',
    coverImage: '/api/memories/2/cover.jpg',
    isFavorite: false
  },
  {
    id: '3',
    title: 'Sinh nhật của em',
    description: 'Bữa tiệc sinh nhật bất ngờ mà anh chuẩn bị cho em.',
    date: new Date('2023-09-10'),
    category: 'Sinh nhật',
    isFavorite: true
  }
]

// Computed
const totalMemories = computed(() => memories.value.length)
const daysTogether = computed(() => {
  const firstDate = new Date('2023-01-15') // Replace with actual relationship start date
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - firstDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})
const photosCount = computed(() => memories.value.reduce((sum, m) => sum + (m.photos?.length || 0), 0))
const specialMoments = computed(() => memories.value.filter(m => m.isFavorite).length)

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

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(memory => memory.category === selectedCategory.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
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
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    memories.value = mockMemories
  } catch (error) {
    console.error('Failed to load memories:', error)
  } finally {
    loading.value = false
  }
}

const viewMemory = (memory: any) => {
  // TODO: Navigate to memory detail view
  console.log('View memory:', memory)
}

const editMemory = (memory: any) => {
  editingMemory.value = memory
  memoryForm.value = { ...memory }
  createDialog.value = true
}

const deleteMemory = async (memory: any) => {
  if (confirm(t('memories.confirmDelete', { title: memory.title }))) {
    try {
      // TODO: API call to delete memory
      memories.value = memories.value.filter(m => m.id !== memory.id)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }
}

const toggleFavorite = async (memory: any) => {
  try {
    // TODO: API call to toggle favorite
    memory.isFavorite = !memory.isFavorite
  } catch (error) {
    console.error('Toggle favorite failed:', error)
  }
}

const shareMemory = async (memory: any) => {
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
    // TODO: API call to save memory
    if (editingMemory.value) {
      // Update existing memory
      const index = memories.value.findIndex(m => m.id === editingMemory.value!.id)
      if (index >= 0) {
        memories.value[index] = { 
          ...memoryForm.value, 
          id: editingMemory.value.id,
          date: new Date(memoryForm.value.date),
          coverImage: editingMemory.value.coverImage
        }
      }
    } else {
      // Create new memory
      const newMemory = {
        id: Date.now().toString(),
        ...memoryForm.value,
        date: new Date(memoryForm.value.date)
      }
      memories.value.unshift(newMemory)
    }
    
    createDialog.value = false
    editingMemory.value = null
    memoryForm.value = {
      title: '',
      description: '',
      date: '',
      category: '',
      photos: [],
      isFavorite: false
    }
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

const formatDate = (date: Date) => {
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 