<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMemoriesStore } from '@/stores/memories'
import { useNotesStore } from '@/stores/notes'
import { useFilesStore } from '@/stores/files'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const memoriesStore = useMemoriesStore()
const notesStore = useNotesStore()
const filesStore = useFilesStore()

// Helper function to safely convert dates
const safeDate = (date: Date | { _seconds: number; _nanoseconds: number } | string): Date => {
  if (date instanceof Date) return date
  if (typeof date === 'string') return new Date(date)
  if (date && typeof date === 'object' && '_seconds' in date) {
    return new Date(date._seconds * 1000 + (date._nanoseconds || 0) / 1000000)
  }
  return new Date()
}

// Get real stats from stores
const stats = computed(() => ({
  memories: memoriesStore.totalMemories,
  notes: notesStore.totalNotes,
  reminders: 0, // No reminders store yet
  anniversaries: 0, // No anniversaries store yet
  totalFiles: filesStore.totalFiles,
  totalSize: filesStore.fileStats.totalSize,
  recentUploads: 0,
  storageUsed: filesStore.fileStats.totalSize,
  storageLimit: 1024 * 1024 * 1024 * 5 // 5GB
}))

interface RecentItem {
  id: string
  title: string
  type: 'memory' | 'note' | 'reminder' | 'anniversary'
  updatedAt: Date
}

interface UpcomingEvent {
  id: string
  title: string
  type: 'reminder' | 'anniversary'
  date: Date
}

// Get recent items from stores
const recentItems = computed(() => {
  const items: RecentItem[] = []
  
  // Add recent memories (with null check)
  if (memoriesStore.memories && Array.isArray(memoriesStore.memories)) {
    memoriesStore.memories.slice(0, 3).forEach(memory => {
      items.push({
        id: memory.id,
        title: memory.title,
        type: 'memory',
        updatedAt: safeDate(memory.updatedAt)
      })
    })
  }
  
  // Add recent notes (with null check)
  if (notesStore.notes && Array.isArray(notesStore.notes)) {
    notesStore.notes.slice(0, 3).forEach(note => {
      items.push({
        id: note.id,
        title: note.title,
        type: 'note',
        updatedAt: safeDate(note.updatedAt)
      })
    })
  }
  
  // Sort by updated date
  return items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5)
})

const upcomingEvents = ref<UpcomingEvent[]>([]) // Will be populated when reminders/anniversaries are available
const isLoading = computed(() => memoriesStore.isLoading || notesStore.isLoading || filesStore.isLoading)

// Navigation methods
const navigateTo = (route: string) => {
  router.push({ name: route })
}

const createReminder = () => {
  // TODO: Open reminder creation dialog
  console.log('Create reminder')
}

const createAnniversary = () => {
  // TODO: Open anniversary creation dialog
  console.log('Create anniversary')
}

const openItem = (item: any) => {
  // Navigate to item detail page based on type
  switch (item.type) {
    case 'memory':
      router.push({ name: 'memory-detail', params: { id: item.id } })
      break
    case 'note':
      router.push({ name: 'note-detail', params: { id: item.id } })
      break
    default:
      console.log('Open item:', item)
  }
}

const getItemColor = (type: string) => {
  const colors: Record<string, string> = {
    memory: 'pink',
    note: 'primary',
    reminder: 'orange',
    anniversary: 'success'
  }
  return colors[type] || 'grey'
}

const getItemIcon = (type: string) => {
  const icons: Record<string, string> = {
    memory: 'mdi-heart',
    note: 'mdi-note-text',
    reminder: 'mdi-bell',
    anniversary: 'mdi-calendar-heart'
  }
  return icons[type] || 'mdi-file'
}

const formatDate = (date: Date) => {
  return dayjs(date).format('MMM D, YYYY')
}

onMounted(async () => {
  // Load real data from APIs
  try {
    await Promise.all([
      memoriesStore.fetchMemories({ limit: 10 }),
      notesStore.fetchNotes({ limit: 10 }),
      filesStore.fetchFiles({ limit: 10 })
    ])
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
})

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getStoragePercentage(): number {
  return Math.round((stats.value.storageUsed / stats.value.storageLimit) * 100)
}
</script>

<template>
  <v-container class="pa-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-h3 font-weight-bold text-primary mb-2">
        {{ t('dashboard.title') }}
      </h1>
      <p class="text-h6 text-medium-emphasis">
        {{ t('dashboard.welcome', { name: authStore.user?.displayName || authStore.user?.email }) }}
      </p>
    </div>

    <!-- Love App Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4 hover-card" elevation="2" @click="navigateTo('memories')">
          <v-icon size="48" color="pink" class="mb-3">
            mdi-heart
          </v-icon>
          <div class="text-h4 font-weight-bold text-pink mb-1">
            {{ isLoading ? '...' : stats.memories }}
          </div>
          <div class="text-body-1 text-medium-emphasis">
            {{ t('nav.memories') }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4 hover-card" elevation="2" @click="navigateTo('notes')">
          <v-icon size="48" color="primary" class="mb-3">
            mdi-note-text
          </v-icon>
          <div class="text-h4 font-weight-bold text-primary mb-1">
            {{ isLoading ? '...' : stats.notes }}
          </div>
          <div class="text-body-1 text-medium-emphasis">
            {{ t('nav.notes') }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4 hover-card" elevation="2" @click="navigateTo('reminders')">
          <v-icon size="48" color="orange" class="mb-3">
            mdi-bell
          </v-icon>
          <div class="text-h4 font-weight-bold text-orange mb-1">
            {{ isLoading ? '...' : stats.reminders }}
          </div>
          <div class="text-body-1 text-medium-emphasis">
            {{ t('nav.reminders') }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4 hover-card" elevation="2" @click="navigateTo('anniversaries')">
          <v-icon size="48" color="success" class="mb-3">
            mdi-calendar-heart
          </v-icon>
          <div class="text-h4 font-weight-bold text-success mb-1">
            {{ isLoading ? '...' : stats.anniversaries }}
          </div>
          <div class="text-body-1 text-medium-emphasis">
            {{ t('nav.anniversaries') }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Storage Usage -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            {{ t('dashboard.storageUsage') }}
          </v-card-title>
          
          <div class="mb-4">
            <div class="d-flex justify-space-between mb-2">
              <span>{{ formatFileSize(stats.storageUsed) }}</span>
              <span>{{ formatFileSize(stats.storageLimit) }}</span>
            </div>
            <v-progress-linear
              :model-value="getStoragePercentage()"
              color="primary"
              height="10"
              rounded
            />
          </div>
          
          <div class="text-body-2 text-medium-emphasis">
            {{ t('dashboard.storageUsageText', { percentage: getStoragePercentage() }) }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon icon="mdi-lightning-bolt" class="mr-2"></v-icon>
            {{ t('dashboard.quickActions') }}
          </v-card-title>
          
          <v-row>
            <v-col cols="6">
              <v-btn
                block
                color="pink"
                variant="tonal"
                size="large"
                @click="navigateTo('create-memory')"
                prepend-icon="mdi-heart-plus"
              >
                {{ t('dashboard.createMemory') }}
              </v-btn>
            </v-col>
            
            <v-col cols="6">
              <v-btn
                block
                color="primary"
                variant="tonal"
                size="large"
                @click="navigateTo('create-note')"
                prepend-icon="mdi-note-plus"
              >
                {{ t('dashboard.createNote') }}
              </v-btn>
            </v-col>
            
            <v-col cols="6">
              <v-btn
                block
                color="orange"
                variant="tonal"
                size="large"
                @click="createReminder"
                prepend-icon="mdi-bell-plus"
              >
                {{ t('dashboard.createReminder') }}
              </v-btn>
            </v-col>
            
            <v-col cols="6">
              <v-btn
                block
                color="success"
                variant="tonal"
                size="large"
                @click="createAnniversary"
                prepend-icon="mdi-calendar-plus"
              >
                {{ t('dashboard.createAnniversary') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity and Upcoming Events -->
    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon icon="mdi-clock-outline" class="mr-2"></v-icon>
            {{ t('dashboard.recentActivity') }}
          </v-card-title>
          
          <v-list v-if="recentItems.length > 0" class="bg-transparent">
            <v-list-item
              v-for="item in recentItems"
              :key="item.id"
              @click="openItem(item)"
              class="px-0 hover-item"
            >
              <template #prepend>
                <v-avatar :color="getItemColor(item.type)" class="mr-3">
                  <v-icon :icon="getItemIcon(item.type)"></v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.type }} • {{ formatDate(item.updatedAt) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          
          <div v-else class="text-center py-8">
            <v-icon icon="mdi-inbox" size="48" color="grey-lighten-2" class="mb-3"></v-icon>
            <p class="text-body-1 text-medium-emphasis">
              {{ t('dashboard.noRecentActivity') }}
            </p>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" lg="4">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon icon="mdi-calendar-today" class="mr-2"></v-icon>
            {{ t('dashboard.upcomingEvents') }}
          </v-card-title>
          
          <v-list v-if="upcomingEvents.length > 0" class="bg-transparent">
            <v-list-item
              v-for="event in upcomingEvents"
              :key="event.id"
              class="px-0"
            >
              <template #prepend>
                <v-avatar size="small" :color="event.type === 'reminder' ? 'orange' : 'success'">
                  <v-icon :icon="event.type === 'reminder' ? 'mdi-bell' : 'mdi-calendar-heart'" size="small"></v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title class="text-body-2">{{ event.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ formatDate(event.date) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          
          <div v-else class="text-center py-4">
            <v-icon icon="mdi-calendar-blank" size="32" color="grey-lighten-2" class="mb-2"></v-icon>
            <p class="text-caption text-medium-emphasis">
              {{ t('dashboard.noUpcomingEvents') }}
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.hover-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.hover-item {
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.hover-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.text-pink {
  color: rgb(233, 30, 99) !important;
}

.text-orange {
  color: rgb(255, 152, 0) !important;
}
</style>