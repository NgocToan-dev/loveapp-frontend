<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import type { DashboardStats } from '@/types'

useI18n()
const authStore = useAuthStore()

const stats = ref<DashboardStats>({
  totalFiles: 0,
  totalSize: 0,
  recentUploads: 0,
  storageUsed: 0,
  storageLimit: 1024 * 1024 * 1024 * 5 // 5GB
})

const isLoading = ref(true)

onMounted(async () => {
  // TODO: Load dashboard data from API
  setTimeout(() => {
    stats.value = {
      totalFiles: 42,
      totalSize: 1024 * 1024 * 150, // 150MB
      recentUploads: 8,
      storageUsed: 1024 * 1024 * 150,
      storageLimit: 1024 * 1024 * 1024 * 5
    }
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
        Dashboard
      </h1>
      <p class="text-h6 text-medium-emphasis">
        Welcome back, {{ authStore.user?.displayName || authStore.user?.email }}!
      </p>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="48" color="primary" class="mb-3">
            mdi-file-multiple
          </v-icon>
          <div class="text-h4 font-weight-bold text-primary mb-1">
            {{ isLoading ? '...' : stats.totalFiles }}
          </div>
          <div class="text-body-1 text-medium-emphasis">
            Total Files
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="48" color="success" class="mb-3">
            mdi-harddisk
          </v-icon>
          <div class="text-h4 font-weight-bold text-success mb-1">
            {{ isLoading ? '...' : formatFileSize(stats.totalSize) }}
          </div>
          <div class="text-body-1 text-medium-emphasis">
            Total Size
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="48" color="info" class="mb-3">
            mdi-upload
          </v-icon>
          <div class="text-h4 font-weight-bold text-info mb-1">
            {{ isLoading ? '...' : stats.recentUploads }}
          </div>
          <div class="text-body-1 text-medium-emphasis">
            Recent Uploads
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="48" color="warning" class="mb-3">
            mdi-chart-pie
          </v-icon>
          <div class="text-h4 font-weight-bold text-warning mb-1">
            {{ isLoading ? '...' : getStoragePercentage() }}%
          </div>
          <div class="text-body-1 text-medium-emphasis">
            Storage Used
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Storage Usage -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            Storage Usage
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
            {{ getStoragePercentage() }}% of your storage quota is being used.
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            Quick Actions
          </v-card-title>
          
          <div class="d-flex flex-column gap-3">
            <v-btn
              color="primary"
              variant="elevated"
              size="large"
              prepend-icon="mdi-upload"
              to="/files"
            >
              Upload Files
            </v-btn>
            
            <v-btn
              color="secondary"
              variant="outlined"
              size="large"
              prepend-icon="mdi-folder-open"
              to="/files"
            >
              Browse Files
            </v-btn>
            
            <v-btn
              color="info"
              variant="outlined"
              size="large"
              prepend-icon="mdi-account-cog"
              to="/profile"
            >
              Manage Profile
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity (Placeholder) -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            Recent Activity
          </v-card-title>
          
          <v-list class="bg-transparent">
            <v-list-item
              v-for="i in 5"
              :key="i"
              class="px-0"
            >
              <template #prepend>
                <v-icon color="primary">mdi-file-upload</v-icon>
              </template>
              
              <v-list-item-title>
                Uploaded file {{ i }}.pdf
              </v-list-item-title>
              
              <v-list-item-subtitle>
                {{ Math.floor(Math.random() * 24) }} hours ago
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          
          <div class="text-center mt-4">
            <v-btn variant="outlined" color="primary">
              View All Activity
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>