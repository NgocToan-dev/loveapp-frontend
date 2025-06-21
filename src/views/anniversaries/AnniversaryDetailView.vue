<template>
  <v-container fluid max-width="900">
    <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px;">
      <v-progress-circular indeterminate color="pink" size="64"></v-progress-circular>
    </div>

    <div v-else-if="anniversary">
      <!-- Header with actions -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center">
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            class="mr-3"
            @click="goBack"
          ></v-btn>
          <div>
            <h1 class="text-h4 font-weight-bold text-pink mb-1">
              <v-icon :icon="getTypeIcon(anniversary.type)" class="mr-2"></v-icon>
              {{ anniversary.title }}
            </h1>
            <p class="text-body-2 text-medium-emphasis">
              {{ formatDate(anniversary.date) }}
              <v-chip
                :color="getTypeColor(anniversary.type)"
                variant="tonal"
                size="small"
                class="ml-2"
              >
                {{ getTypeLabel(anniversary.type) }}
              </v-chip>
            </p>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="d-flex gap-2">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                v-bind="props"
              ></v-btn>
            </template>
            <v-list>
              <v-list-item @click="editAnniversary">
                <template v-slot:prepend>
                  <v-icon icon="mdi-pencil"></v-icon>
                </template>
                <v-list-item-title>{{ $t('common.edit') || 'Edit' }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteAnniversary" class="text-error">
                <template v-slot:prepend>
                  <v-icon icon="mdi-delete" color="error"></v-icon>
                </template>
                <v-list-item-title>{{ $t('common.delete') || 'Delete' }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <!-- Anniversary content -->
      <v-row>
        <v-col cols="12" md="8">
          <!-- Main content card -->
          <v-card class="mb-4">
            <v-card-text class="pa-6">
              <!-- Countdown card -->
              <div class="countdown-section mb-6">
                <div class="text-center pa-6 rounded-lg" :style="{ backgroundColor: 'rgba(var(--v-theme-primary), 0.05)' }">
                  <h2 class="text-h3 font-weight-bold mb-2" :style="{ color: 'rgb(var(--v-theme-primary))' }">
                    {{ daysUntil }}
                  </h2>
                  <p class="text-h6 mb-0">
                    {{ daysUntil === 0 ? 
                        ($t('anniversaries.today') || 'Today!') : 
                        daysUntil === 1 ? 
                          ($t('anniversaries.tomorrow') || 'Tomorrow') : 
                          daysUntil > 0 ? 
                            ($t('anniversaries.daysLeft') || 'days left') : 
                            ($t('anniversaries.daysPassed') || 'days ago')
                    }}
                  </p>
                </div>
              </div>

              <!-- Description -->
              <div v-if="anniversary.description" class="mb-4">
                <h3 class="text-h6 mb-2">{{ $t('anniversaries.description') || 'Description' }}</h3>
                <div class="text-body-1" style="white-space: pre-wrap; line-height: 1.6;">
                  {{ anniversary.description }}
                </div>
              </div>

              <!-- Recurring info -->
              <div v-if="anniversary.isRecurring" class="mb-4">
                <v-chip
                  :color="getFrequencyColor(anniversary.frequency)"
                  variant="tonal"
                  prepend-icon="mdi-repeat"
                >
                  {{ $t('anniversaries.recurring') || 'Recurring' }} - {{ getFrequencyLabel(anniversary.frequency) }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" md="4">
          <!-- Anniversary info card -->
          <v-card class="mb-4">
            <v-card-title class="text-h6">
              <v-icon icon="mdi-information" class="mr-2"></v-icon>
              {{ $t('anniversaries.details') || 'Details' }}
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-calendar"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('anniversaries.date') || 'Date' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDate(anniversary.date) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon :icon="getTypeIcon(anniversary.type)"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('anniversaries.type') || 'Type' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ getTypeLabel(anniversary.type) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="anniversary.isRecurring">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-repeat"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('anniversaries.frequency') || 'Frequency' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ getFrequencyLabel(anniversary.frequency) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-account"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('anniversaries.createdBy') || 'Created by' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ anniversary.createdBy }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-clock"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('anniversaries.createdAt') || 'Created' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDateTime(anniversary.createdAt) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="anniversary.updatedAt !== anniversary.createdAt">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-update"></v-icon>
                  </template>
                  <v-list-item-title>{{ $t('anniversaries.updatedAt') || 'Updated' }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatDateTime(anniversary.updatedAt) }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Related anniversaries (optional) -->
          <v-card v-if="relatedAnniversaries.length > 0">
            <v-card-title class="text-h6">
              <v-icon icon="mdi-calendar-multiple" class="mr-2"></v-icon>
              {{ $t('anniversaries.related') || 'Related Anniversaries' }}
            </v-card-title>
            <v-card-text>
              <div
                v-for="related in relatedAnniversaries"
                :key="related.id"
                class="d-flex align-center pa-2 rounded cursor-pointer hover-bg"
                @click="viewAnniversary(related.id)"
              >
                <v-avatar size="40" class="mr-3" :color="getTypeColor(related.type)">
                  <v-icon :icon="getTypeIcon(related.type)" color="white"></v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <p class="text-body-2 font-weight-medium mb-0">{{ related.title }}</p>
                  <p class="text-caption text-medium-emphasis">{{ formatDate(related.date) }}</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Not found -->
    <div v-else class="text-center pa-8">
      <v-icon icon="mdi-calendar-remove" size="64" color="grey" class="mb-4"></v-icon>
      <h2 class="text-h5 mb-2">{{ $t('anniversaries.notFound') || 'Anniversary Not Found' }}</h2>
      <p class="text-body-1 text-medium-emphasis mb-4">
        {{ $t('anniversaries.notFoundDescription') || 'The anniversary you are looking for does not exist or has been deleted.' }}
      </p>
      <v-btn color="pink" @click="goBack">
        {{ $t('common.goBack') || 'Go Back' }}
      </v-btn>
    </div>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          {{ $t('anniversaries.confirmDelete') || 'Delete Anniversary' }}
        </v-card-title>
        <v-card-text>
          {{ $t('anniversaries.deleteWarning') || 'Are you sure you want to delete this anniversary? This action cannot be undone.' }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">
            {{ $t('common.cancel') || 'Cancel' }}
          </v-btn>
          <v-btn
            color="error"
            @click="confirmDelete"
            :loading="actionLoading"
          >
            {{ $t('common.delete') || 'Delete' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAnniversariesStore } from '@/stores/anniversaries'
import type { Anniversary } from '@/types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const anniversariesStore = useAnniversariesStore()

const loading = ref(true)
const actionLoading = ref(false)
const deleteDialog = ref(false)
const anniversary = ref<Anniversary | null>(null)

const daysUntil = computed(() => {
  if (!anniversary.value) return 0
  
  const anniversaryDate = new Date(anniversary.value.date)
  const today = new Date()
  
  // Set anniversary to this year
  anniversaryDate.setFullYear(today.getFullYear())
  
  // If anniversary has passed this year, move to next year
  if (anniversaryDate < today) {
    anniversaryDate.setFullYear(today.getFullYear() + 1)
  }
  
  const diffTime = anniversaryDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const relatedAnniversaries = computed(() => {
  if (!anniversary.value) return []
  
  return anniversariesStore.anniversaries
    .filter(a => a.id !== anniversary.value!.id && a.type === anniversary.value!.type)
    .slice(0, 5)
})

const loadAnniversary = async () => {
  loading.value = true
  try {
    const anniversaryId = route.params.id as string
    let foundAnniversary = anniversariesStore.anniversaries.find(a => a.id === anniversaryId)
    
    if (!foundAnniversary) {
      await anniversariesStore.fetchAnniversaries()
      foundAnniversary = anniversariesStore.anniversaries.find(a => a.id === anniversaryId)
    }
    
    if (foundAnniversary) {
      anniversary.value = foundAnniversary
    } else {
      anniversary.value = null
    }
  } catch (error) {
    console.error('Error loading anniversary:', error)
    anniversary.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    'relationship': 'Mối quan hệ',
    'milestone': 'Cột mốc',
    'birthday': 'Sinh nhật',
    'other': 'Khác'
  }
  return types[type] || type
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'relationship': 'pink',
    'milestone': 'purple',
    'birthday': 'orange',
    'other': 'blue'
  }
  return colors[type] || 'blue'
}

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'relationship': 'mdi-heart',
    'milestone': 'mdi-star',
    'birthday': 'mdi-cake',
    'other': 'mdi-calendar'
  }
  return icons[type] || 'mdi-calendar'
}

const getFrequencyLabel = (frequency?: string) => {
  if (!frequency) return ''
  const frequencies: Record<string, string> = {
    'yearly': 'Hằng năm',
    'monthly': 'Hằng tháng'
  }
  return frequencies[frequency] || frequency
}

const getFrequencyColor = (frequency?: string) => {
  const colors: Record<string, string> = {
    'yearly': 'success',
    'monthly': 'info'
  }
  return colors[frequency || ''] || 'success'
}

const editAnniversary = () => {
  if (anniversary.value) {
    router.push(`/anniversaries/${anniversary.value.id}/edit`)
  }
}

const deleteAnniversary = () => {
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!anniversary.value) return
  
  actionLoading.value = true
  try {
    await anniversariesStore.deleteAnniversary(anniversary.value.id)
    router.push('/anniversaries')
  } catch (error) {
    console.error('Error deleting anniversary:', error)
  } finally {
    actionLoading.value = false
    deleteDialog.value = false
  }
}

const viewAnniversary = (id: string) => {
  router.push(`/anniversaries/${id}`)
}

const goBack = () => {
  router.push('/anniversaries')
}

onMounted(() => {
  loadAnniversary()
})
</script>

<style scoped>
.text-pink {
  color: rgb(233, 30, 99) !important;
}

.countdown-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-secondary), 0.1) 100%);
}

.hover-bg:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.08);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
