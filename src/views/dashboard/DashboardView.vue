<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Enhanced stats for Love App
const stats = ref({
  memories: 0,
  notes: 0,
  reminders: 0,
  anniversaries: 0,
  totalFiles: 0,
  totalSize: 0,
  recentUploads: 0,
  storageUsed: 0,
  storageLimit: 1024 * 1024 * 1024 * 5 // 5GB
})

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

const recentItems = ref<RecentItem[]>([])
const upcomingEvents = ref<UpcomingEvent[]>([])
const isLoading = ref(true)

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
  // TODO: Load dashboard data from API
  setTimeout(() => {
    stats.value = {
      memories: 15,
      notes: 8,
      reminders: 3,
      anniversaries: 2,
      totalFiles: 42,
      totalSize: 1024 * 1024 * 150, // 150MB
      recentUploads: 8,
      storageUsed: 1024 * 1024 * 150,
      storageLimit: 1024 * 1024 * 1024 * 5
    }
    
    // Mock recent items
    recentItems.value = [
      { id: '1', title: 'Our First Date', type: 'memory', updatedAt: new Date('2024-01-15') },
      { id: '2', title: 'Love Notes', type: 'note', updatedAt: new Date('2024-01-14') },
      { id: '3', title: 'Anniversary Plans', type: 'note', updatedAt: new Date('2024-01-13') }
    ]
    
    // Mock upcoming events
    upcomingEvents.value = [
      { id: '1', title: 'Valentine\'s Day', type: 'anniversary', date: new Date('2024-02-14') },
      { id: '2', title: 'Plan Date Night', type: 'reminder', date: new Date('2024-01-20') }
    ]
    
    isLoading.value = false
  }, 1000)
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