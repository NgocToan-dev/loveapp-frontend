<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          <v-icon class="mr-3" color="purple">mdi-calendar-heart</v-icon>
          {{ $t('anniversaries.title') || 'Anniversaries' }}
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          {{ $t('anniversaries.subtitle') || 'Special dates to remember' }}
        </p>
      </div>
      
      <v-btn
        color="purple"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="openCreateAnniversaryDialog"
      >
        {{ $t('anniversaries.create') || 'Create Anniversary' }}
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4">
          <v-icon size="48" color="purple" class="mb-2">mdi-calendar-heart</v-icon>
          <div class="text-h4 font-weight-bold">{{ stats.total }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ $t('anniversaries.totalAnniversaries') || 'Total' }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4">
          <v-icon size="48" color="orange" class="mb-2">mdi-calendar-clock</v-icon>
          <div class="text-h4 font-weight-bold">{{ stats.upcoming }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ $t('anniversaries.upcoming') || 'Upcoming' }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4">
          <v-icon size="48" color="success" class="mb-2">mdi-repeat</v-icon>
          <div class="text-h4 font-weight-bold">{{ stats.recurring }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ $t('anniversaries.recurring') || 'Recurring' }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center pa-4">
          <v-icon size="48" color="pink" class="mb-2">mdi-heart</v-icon>
          <div class="text-h4 font-weight-bold">{{ stats.relationship }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ $t('anniversaries.relationship') || 'Love' }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and Filters -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              :label="$t('anniversaries.search') || 'Search anniversaries...'"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedType"
              :items="typeOptions"
              :label="$t('anniversaries.type') || 'Type'"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              :label="$t('anniversaries.sortBy') || 'Sort by'"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular indeterminate color="purple" size="64" />
      <div class="mt-4 text-h6">{{ $t('anniversaries.loading') || 'Loading...' }}</div>
    </div>

    <!-- Error -->
    <v-alert
      v-else-if="error"
      type="error"
      class="mb-4"
      closable
      @click:close="anniversariesStore.clearError()"
    >
      {{ error }}
    </v-alert>

    <!-- Empty State -->
    <v-card v-else-if="filteredAnniversaries.length === 0" class="text-center pa-8">
      <v-icon size="80" color="grey-lighten-1" class="mb-4">
        mdi-calendar-heart-outline
      </v-icon>
      <h3 class="text-h5 mb-2">{{ $t('anniversaries.noAnniversaries') || 'No anniversaries' }}</h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        {{ $t('anniversaries.noAnniversariesDescription') || 'Create your first anniversary' }}
      </p>
      <v-btn color="purple" @click="createDialog = true">
        {{ $t('anniversaries.createFirst') || 'Create First Anniversary' }}
      </v-btn>
    </v-card>

    <!-- Anniversaries List -->
    <v-row v-else>
      <v-col
        v-for="anniversary in filteredAnniversaries"
        :key="anniversary.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card hover class="h-100">
          <v-card-title class="d-flex align-center">
            <v-avatar
              :color="getTypeColor(anniversary.type)"
              class="mr-3"
              size="40"
            >
              <v-icon color="white">{{ getTypeIcon(anniversary.type) }}</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                {{ anniversary.title }}
              </div>
              <v-chip
                :color="getTypeColor(anniversary.type)"
                size="x-small"
                variant="tonal"
              >
                {{ getTypeLabel(anniversary.type) }}
              </v-chip>
            </div>
          </v-card-title>

          <v-card-text>
            <div class="mb-3">
              <div class="text-body-2 text-medium-emphasis mb-1">
                <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                {{ formatDate(anniversary.date) }}
              </div>
              <div v-if="getDaysUntil(anniversary.date) >= 0" class="text-success text-body-2">
                <v-icon size="16" class="mr-1">mdi-clock</v-icon>
                {{ getDaysUntil(anniversary.date) === 0 ? 'Today!' : `In ${getDaysUntil(anniversary.date)} days` }}
              </div>
            </div>
            
            <p v-if="anniversary.description" class="text-body-2 mb-3">
              {{ anniversary.description }}
            </p>
            
            <div v-if="anniversary.isRecurring" class="d-flex align-center">
              <v-chip color="purple" size="small" variant="tonal" prepend-icon="mdi-repeat">
                {{ anniversary.frequency || 'Yearly' }}
              </v-chip>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editAnniversary(anniversary)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="deleteAnniversary(anniversary)"
            />
            <v-spacer />
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              @click="viewAnniversary(anniversary)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAnniversariesStore } from '@/stores/anniversaries'
import { useDialogsStore } from '@/stores/dialogs'
import type { Anniversary } from '@/types'
import dayjs from 'dayjs'

const { t } = useI18n()
const anniversariesStore = useAnniversariesStore()
const dialogsStore = useDialogsStore()

// State
const createDialog = ref(false)
const editingAnniversary = ref<Anniversary | null>(null)
const searchQuery = ref('')
const selectedType = ref('')
const sortBy = ref('date-asc')
const valid = ref(false)

// Form
const anniversaryForm = ref({
  title: '',
  description: '',
  date: '',
  type: 'other',
  isRecurring: false,
  frequency: 'yearly'
})

// Computed
const anniversaries = computed(() => anniversariesStore.anniversaries || [])
const isLoading = computed(() => anniversariesStore.isLoading)
const error = computed(() => anniversariesStore.error)

const stats = computed(() => ({
  total: anniversaries.value.length,
  upcoming: anniversariesStore.upcomingAnniversaries?.length || 0,
  recurring: anniversariesStore.recurringAnniversaries?.length || 0,
  relationship: anniversaries.value.filter(a => a.type === 'relationship').length
}))

const typeOptions = [
  { title: 'Relationship', value: 'relationship' },
  { title: 'Milestone', value: 'milestone' },
  { title: 'Birthday', value: 'birthday' },
  { title: 'Other', value: 'other' }
]

const frequencyOptions = [
  { title: 'Yearly', value: 'yearly' },
  { title: 'Monthly', value: 'monthly' }
]

const sortOptions = [
  { title: 'Date (newest)', value: 'date-desc' },
  { title: 'Date (oldest)', value: 'date-asc' },
  { title: 'Title A-Z', value: 'title-asc' },
  { title: 'Type', value: 'type-asc' }
]

const filteredAnniversaries = computed(() => {
  let filtered = [...anniversaries.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(anniversary =>
      anniversary.title.toLowerCase().includes(query) ||
      (anniversary.description && anniversary.description.toLowerCase().includes(query))
    )
  }

  // Type filter
  if (selectedType.value) {
    filtered = filtered.filter(anniversary => anniversary.type === selectedType.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'type-asc':
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  return filtered
})

// Dialog methods
const openCreateAnniversaryDialog = () => {
  // Use global dialog system for anniversary form
  dialogsStore.openBaseDialog(
    'CreateAnniversaryDialog',
    {},
    { maxWidth: '700', scrollable: true, persistent: true },
    {
      onConfirm: (newAnniversary) => {
        console.log('New anniversary created:', newAnniversary)
        // Refresh anniversaries list
        loadAnniversaries()
      }
    }
  )
}

// Methods
const loadAnniversaries = async () => {
  try {
    await anniversariesStore.fetchAnniversaries()
  } catch (error) {
    console.error('Failed to load anniversaries:', error)
  }
}

const viewAnniversary = (anniversary: Anniversary) => {
  console.log('View anniversary:', anniversary)
}

const editAnniversary = (anniversary: Anniversary) => {
  // Use global dialog system for editing anniversaries
  dialogsStore.openBaseDialog(
    'EditAnniversaryDialog',
    { anniversary },
    { maxWidth: '700', scrollable: true, persistent: true },
    {
      onConfirm: (updatedAnniversary) => {
        console.log('Anniversary updated:', updatedAnniversary)
        // Refresh anniversaries list
        loadAnniversaries()
      }
    }
  )
}

const deleteAnniversary = async (anniversary: Anniversary) => {
  dialogsStore.openConfirmDialog({
    title: t('anniversaries.confirmDeleteTitle') || 'Xác nhận xóa',
    message: t('anniversaries.confirmDelete', { title: anniversary.title }) || `Bạn có chắc chắn muốn xóa "${anniversary.title}"?`,
    confirmText: t('common.delete') || 'Xóa',
    cancelText: t('common.cancel') || 'Hủy',
    onConfirm: async () => {
      try {
        await anniversariesStore.deleteAnniversary(anniversary.id)
        
        dialogsStore.openAlertDialog({
          title: t('common.deleted') || 'Đã xóa!',
          message: t('anniversaries.deleteSuccess') || 'Ngày kỷ niệm đã được xóa thành công!'
        })
      } catch (error) {
        console.error('Delete failed:', error)
        
        dialogsStore.openAlertDialog({
          title: t('common.error') || 'Lỗi!',
          message: t('anniversaries.deleteError') || 'Có lỗi xảy ra khi xóa ngày kỷ niệm. Vui lòng thử lại.'
        })
      }
    }
  })
}

const saveAnniversary = async () => {
  if (!valid.value) return

  try {
    if (editingAnniversary.value) {
      await anniversariesStore.updateAnniversary(editingAnniversary.value.id, {
        title: anniversaryForm.value.title,
        description: anniversaryForm.value.description,
        date: anniversaryForm.value.date,
        type: anniversaryForm.value.type as any,
        isRecurring: anniversaryForm.value.isRecurring,
        frequency: anniversaryForm.value.isRecurring ? anniversaryForm.value.frequency as any : undefined
      })
    } else {
      await anniversariesStore.createAnniversary({
        title: anniversaryForm.value.title,
        description: anniversaryForm.value.description,
        date: anniversaryForm.value.date,
        type: anniversaryForm.value.type as any,
        isRecurring: anniversaryForm.value.isRecurring,
        frequency: anniversaryForm.value.isRecurring ? anniversaryForm.value.frequency as any : undefined
      })
    }
    
    createDialog.value = false
    editingAnniversary.value = null
    anniversaryForm.value = {
      title: '',
      description: '',
      date: '',
      type: 'other',
      isRecurring: false,
      frequency: 'yearly'
    }
  } catch (error) {
    console.error('Save failed:', error)
  }
}

const getTypeColor = (type: string) => {
  const colors = {
    'relationship': 'pink',
    'milestone': 'purple',
    'birthday': 'orange',
    'other': 'success'
  }
  return colors[type as keyof typeof colors] || 'success'
}

const getTypeIcon = (type: string) => {
  const icons = {
    'relationship': 'mdi-heart',
    'milestone': 'mdi-trophy',
    'birthday': 'mdi-cake',
    'other': 'mdi-calendar-star'
  }
  return icons[type as keyof typeof icons] || 'mdi-calendar-star'
}

const getTypeLabel = (type: string) => {
  const labels = {
    'relationship': 'Relationship',
    'milestone': 'Milestone',
    'birthday': 'Birthday',
    'other': 'Other'
  }
  return labels[type as keyof typeof labels] || type
}

const formatDate = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const getDaysUntil = (date: string | Date) => {
  const today = dayjs()
  const anniversaryDate = dayjs(date)
  
  let targetDate = anniversaryDate.year(today.year())
  if (targetDate.isBefore(today, 'day')) {
    targetDate = targetDate.year(today.year() + 1)
  }
  
  return targetDate.diff(today, 'day')
}

// Initialize
onMounted(() => {
  loadAnniversaries()
})
</script>

<style scoped>
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