Kho<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useDialogsStore } from '@/stores/dialogs'
import type { Notification, NotificationFilters } from '@/types'

const notificationsStore = useNotificationsStore()
const dialogsStore = useDialogsStore()

// State
const selectedTab = ref('all')
const viewMode = ref<'list' | 'grid'>('list')
const searchQuery = ref('')
const showFilters = ref(false)
// Remove old dialog state - now using global dialogs
const selectedNotifications = ref<string[]>([])
const notificationToDelete = ref<string | null>(null)

// Filters
const currentFilters = ref<NotificationFilters>({
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc'
})

// Computed properties
const filteredNotifications = computed(() => {
  let notifications = notificationsStore.notifications || []
    // Filter by tab
  switch (selectedTab.value) {
    case 'unread':
      notifications = notifications.filter(n => !n.readAt)
      break
    case 'read':
      notifications = notifications.filter(n => !!n.readAt)
      break
    case 'archived':
      notifications = notifications.filter(n => !!n.archivedAt)
      break
    case 'anniversary':
    case 'memory':
    case 'reminder':
    case 'couple':
    case 'system':
    case 'general':
      notifications = notifications.filter(n => n.type === selectedTab.value)
      break
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    notifications = notifications.filter(n =>
      n.title.toLowerCase().includes(query) ||
      (n.message && n.message.toLowerCase().includes(query))
    )
  }
  
  return notifications
})

const stats = computed(() => notificationsStore.localStats)
const isLoading = computed(() => notificationsStore.isLoading)
const error = computed(() => notificationsStore.error)

const tabs = computed(() => [
  { key: 'all', label: 'Tất cả', count: stats.value.total },
  { key: 'unread', label: 'Chưa đọc', count: stats.value.unread },
  { key: 'anniversary', label: 'Kỷ niệm', count: stats.value.byType.anniversary },
  { key: 'memory', label: 'Ký ức', count: stats.value.byType.memory },
  { key: 'reminder', label: 'Nhắc nhở', count: stats.value.byType.reminder },
  { key: 'couple', label: 'Đôi', count: stats.value.byType.couple },
  { key: 'system', label: 'Hệ thống', count: stats.value.byType.system }
])

// Methods
const fetchNotifications = async () => {
  await notificationsStore.fetchNotifications(currentFilters.value)
}

const handleMarkAsRead = async (id: string) => {
  try {
    await notificationsStore.markAsRead(id)
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

const handleMarkAsReadWithEvent = async (event: Event, id: string) => {
  event.stopPropagation()
  await handleMarkAsRead(id)
}

const handleMarkAllAsRead = async () => {
  try {
    await notificationsStore.markAllAsRead()
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

const handleArchive = async (id: string) => {
  try {
    await notificationsStore.archiveNotification(id)
  } catch (error) {
    console.error('Error archiving notification:', error)
  }
}

const handleArchiveWithEvent = async (event: Event, id: string) => {
  event.stopPropagation()
  await handleArchive(id)
}

const confirmDelete = (id: string) => {
  dialogsStore.openConfirmDialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa thông báo này?',
    confirmText: 'Xóa',
    cancelText: 'Hủy',
    onConfirm: async () => {
      try {
        await notificationsStore.deleteNotification(id)
        dialogsStore.openAlertDialog({
          title: 'Thành công',
          message: 'Đã xóa thông báo thành công!'
        })
      } catch (error) {
        console.error('Error deleting notification:', error)
        dialogsStore.openAlertDialog({
          title: 'Lỗi',
          message: 'Có lỗi xảy ra khi xóa thông báo.'
        })
      }
    }
  })
}

const confirmDeleteWithEvent = (event: Event, id: string) => {
  event.stopPropagation()
  confirmDelete(id)
}

// Remove old handleDelete method as it's now integrated into confirmDelete

const handleBulkAction = async (action: 'read' | 'archive' | 'delete') => {
  // Implementation for bulk actions
  console.log(`Bulk ${action} for:`, selectedNotifications.value)
  selectedNotifications.value = []
}

const formatTimeAgo = (date: string | Date) => {
  const now = new Date()
  const notificationDate = new Date(date)
  const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Vừa xong'
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} giờ trước`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} ngày trước`
  
  return notificationDate.toLocaleDateString('vi-VN')
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'anniversary': return 'mdi-calendar-heart'
    case 'memory': return 'mdi-heart'
    case 'reminder': return 'mdi-bell'
    case 'couple': return 'mdi-account-heart'
    case 'system': return 'mdi-cog'
    default: return 'mdi-information'
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'anniversary': return 'purple'
    case 'memory': return 'pink'
    case 'reminder': return 'orange'
    case 'couple': return 'red'
    case 'system': return 'blue'
    default: return 'grey'
  }
}

const getDeliveryStatusColor = (status?: string) => {
  switch (status) {
    case 'delivered': return 'success'
    case 'sent': return 'info'
    case 'pending': return 'warning'
    case 'failed': return 'error'
    default: return 'grey'
  }
}

const getDeliveryStatusIcon = (status?: string) => {
  switch (status) {
    case 'delivered': return 'mdi-check-circle'
    case 'sent': return 'mdi-send'
    case 'pending': return 'mdi-clock'
    case 'failed': return 'mdi-alert-circle'
    default: return 'mdi-help-circle'
  }
}

const handleNotificationClick = async (notification: Notification) => {
  // Mark as read if not already read
  if (!notification.readAt) {
    await handleMarkAsRead(notification.id)
  }
  
  // Navigate to actionUrl if available
  if (notification.actionUrl) {
    // Handle internal routes
    if (notification.actionUrl.startsWith('/')) {
      window.location.href = notification.actionUrl
    } else {
      // Handle external URLs
      window.open(notification.actionUrl, '_blank')
    }
  }
}

// Watch for tab changes
watch(selectedTab, () => {
  fetchNotifications()
})

// Watch for search changes with debounce
watch(searchQuery, async () => {
  await fetchNotifications()
})

// Initialize
onMounted(() => {
  fetchNotifications()
  notificationsStore.fetchStats()
})
</script>

<template>
  <v-container fluid class="pa-4 pa-sm-6">
    <!-- Header -->
    <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-6 gap-4">
      <div class="header-content">
        <h1 class="text-h4 text-sm-h3 font-weight-bold mb-2 d-flex align-center">
          <v-icon class="mr-3" color="primary" size="large">mdi-bell</v-icon>
          Thông báo
        </h1>
        <p class="text-body-1 text-medium-emphasis ma-0">
          Quản lý tất cả thông báo của bạn
        </p>
      </div>
      
      <div class="d-flex align-center flex-wrap gap-2">
        <!-- View Mode Toggle -->
        <v-btn-toggle
          v-model="viewMode"
          mandatory
          variant="outlined"
          divided
          density="comfortable"
        >
          <v-btn value="list" size="small" :class="{ 'v-btn--active': viewMode === 'list' }">
            <v-icon>mdi-format-list-bulleted</v-icon>
            <v-tooltip activator="parent" location="bottom">Danh sách</v-tooltip>
          </v-btn>
          <v-btn value="grid" size="small" :class="{ 'v-btn--active': viewMode === 'grid' }">
            <v-icon>mdi-grid</v-icon>
            <v-tooltip activator="parent" location="bottom">Lưới</v-tooltip>
          </v-btn>
        </v-btn-toggle>

        <!-- Actions -->
        <v-btn
          color="primary"
          variant="flat"
          @click="handleMarkAllAsRead"
          :loading="isLoading"
          :disabled="stats.unread === 0"
          density="comfortable"
        >
          <v-icon start>mdi-check-all</v-icon>
          <span class="d-none d-sm-inline">Đánh dấu đã đọc tất cả</span>
          <span class="d-inline d-sm-none">Đã đọc tất cả</span>
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="6" sm="6" md="3">
        <v-card class="stats-card text-center pa-4" elevation="2" :ripple="false">
          <v-icon size="40" color="primary" class="mb-3">mdi-bell</v-icon>
          <div class="text-h5 text-md-h4 font-weight-bold text-primary">{{ stats.total }}</div>
          <div class="text-caption text-md-body-2 text-medium-emphasis">Tổng thông báo</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="6" md="3">
        <v-card class="stats-card text-center pa-4" elevation="2" :ripple="false">
          <v-icon size="40" color="warning" class="mb-3">mdi-bell-badge</v-icon>
          <div class="text-h5 text-md-h4 font-weight-bold text-warning">{{ stats.unread }}</div>
          <div class="text-caption text-md-body-2 text-medium-emphasis">Chưa đọc</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="6" md="3">
        <v-card class="stats-card text-center pa-4" elevation="2" :ripple="false">
          <v-icon size="40" color="info" class="mb-3">mdi-clock</v-icon>
          <div class="text-h5 text-md-h4 font-weight-bold text-info">{{ stats.pending }}</div>
          <div class="text-caption text-md-body-2 text-medium-emphasis">Đang chờ</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="6" md="3">
        <v-card class="stats-card text-center pa-4" elevation="2" :ripple="false">
          <v-icon size="40" color="success" class="mb-3">mdi-heart</v-icon>
          <div class="text-h5 text-md-h4 font-weight-bold text-success">{{ stats.byType.anniversary + stats.byType.memory }}</div>
          <div class="text-caption text-md-body-2 text-medium-emphasis">Kỷ niệm & Ký ức</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search and Filters -->
    <v-card class="mb-4" elevation="1">
      <v-card-text class="pb-2">
        <v-row align="center" no-gutters class="gap-3">
          <v-col cols="12" md="8">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Tìm kiếm thông báo..."
              hide-details
              clearable
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              @click="showFilters = !showFilters"
              :color="showFilters ? 'primary' : undefined"
              density="comfortable"
            >
              <v-icon start>mdi-filter</v-icon>
              Bộ lọc
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabs -->
    <v-card class="mb-4" elevation="1">
      <v-tabs
        v-model="selectedTab"
        show-arrows
        density="comfortable"
        color="primary"
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.key"
          :value="tab.key"
          class="text-none"
        >
          <span class="mr-2">{{ tab.label }}</span>
          <v-chip
            v-if="tab.count > 0"
            size="small"
            :color="tab.key === 'unread' ? 'error' : 'primary'"
            variant="flat"
            density="comfortable"
          >
            {{ tab.count }}
          </v-chip>
        </v-tab>
      </v-tabs>
    </v-card>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64" />
      <div class="mt-4 text-h6">Đang tải thông báo...</div>
    </div>

    <!-- Error -->
    <v-alert
      v-else-if="error"
      type="error"
      class="mb-4"
      closable
      @click:close="() => notificationsStore.clearError()"
    >
      {{ error }}
    </v-alert>

    <!-- Empty State -->
    <v-card v-else-if="filteredNotifications.length === 0" class="text-center pa-8">
      <v-icon size="80" color="grey-lighten-1" class="mb-4">
        mdi-bell-off-outline
      </v-icon>
      <h3 class="text-h5 mb-2">Không có thông báo</h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        Không tìm thấy thông báo nào phù hợp với bộ lọc của bạn.
      </p>
      <v-btn color="primary" @click="() => { selectedTab = 'all'; searchQuery = '' }">
        Xem tất cả thông báo
      </v-btn>
    </v-card>

    <!-- Notifications List -->
    <template v-else>
      <!-- List View -->
      <v-card v-if="viewMode === 'list'" elevation="2">
        <v-list lines="three" class="pa-0">
          <v-list-item            v-for="(notification, index) in filteredNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'notification-unread': !notification.readAt }"
            :ripple="false"
            min-height="88"
            @click="() => handleNotificationClick(notification)"
          >
            <template #prepend>
              <div class="d-flex align-center mr-4">
                <v-checkbox
                  v-model="selectedNotifications"
                  :value="notification.id"
                  class="mr-3"
                  density="compact"
                  hide-details
                />
                <v-avatar
                  size="44"
                  :color="getNotificationColor(notification.type)"
                  variant="tonal"
                >
                  <v-icon :color="getNotificationColor(notification.type)" size="20">
                    {{ getNotificationIcon(notification.type) }}
                  </v-icon>
                </v-avatar>
              </div>
            </template>

            <v-list-item-title class="text-subtitle-1 font-weight-medium mb-1 d-flex align-center flex-wrap">
              <span class="mr-2">{{ notification.title }}</span>              <v-chip
                v-if="!notification.readAt"
                size="x-small"
                color="primary"
                variant="flat"
                density="comfortable"
              >
                Mới
              </v-chip>
            </v-list-item-title>
              <v-list-item-subtitle v-if="notification.message" class="text-body-2 mb-2 notification-message">
              {{ notification.message }}
            </v-list-item-subtitle>

            <div class="d-flex align-center flex-wrap gap-2 text-caption text-medium-emphasis">
              <v-chip
                size="x-small"
                :color="getNotificationColor(notification.type)"
                variant="outlined"
                density="comfortable"
              >
                {{ notification.type }}
              </v-chip>
              
              <v-chip
                size="x-small"
                :color="getDeliveryStatusColor(notification.deliveryStatus)"
                variant="outlined"
                density="comfortable"
              >
                <v-icon start size="10">
                  {{ getDeliveryStatusIcon(notification.deliveryStatus) }}
                </v-icon>
                {{ notification.deliveryStatus }}
              </v-chip>
              
              <span class="text-caption">{{ formatTimeAgo(notification.createdAt) }}</span>
            </div>

            <template #append>
              <div class="d-flex align-center flex-column flex-sm-row gap-1">
                <v-btn
                  v-if="!notification.isRead"
                  icon="mdi-check"                  size="small"
                  variant="text"
                  color="primary"
                  @click="(event: Event) => handleMarkAsReadWithEvent(event, notification.id)"
                  density="comfortable"
                >
                  <v-icon>mdi-check</v-icon>
                  <v-tooltip activator="parent" location="bottom">Đánh dấu đã đọc</v-tooltip>
                </v-btn>
                
                <v-btn
                  icon="mdi-archive"                  size="small"
                  variant="text"
                  color="orange"
                  @click="(event: Event) => handleArchiveWithEvent(event, notification.id)"
                  density="comfortable"
                >
                  <v-icon>mdi-archive</v-icon>
                  <v-tooltip activator="parent" location="bottom">Lưu trữ</v-tooltip>
                </v-btn>
                
                <v-btn
                  icon="mdi-delete"                  size="small"
                  variant="text"
                  color="error"
                  @click="(event: Event) => confirmDeleteWithEvent(event, notification.id)"
                  density="comfortable"
                >
                  <v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent" location="bottom">Xóa</v-tooltip>
                </v-btn>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <!-- Grid View -->
      <v-row v-else>
        <v-col
          v-for="notification in filteredNotifications"
          :key="notification.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card            class="notification-card h-100"
            :class="{ 'notification-unread': !notification.readAt }"
            elevation="2"
            @click="() => handleNotificationClick(notification)"
          >
            <v-card-title class="d-flex align-center pb-2">
              <v-avatar
                size="32"
                :color="getNotificationColor(notification.type)"
                variant="tonal"
                class="mr-3"
              >
                <v-icon size="18" :color="getNotificationColor(notification.type)">
                  {{ getNotificationIcon(notification.type) }}
                </v-icon>
              </v-avatar>
              
              <div class="flex-grow-1">
                <div class="text-subtitle-2 font-weight-medium">
                  {{ notification.title }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ formatTimeAgo(notification.createdAt) }}
                </div>
              </div>
              
              <v-chip
                v-if="!notification.isRead"
                size="x-small"
                color="primary"
                variant="flat"
              >
                Mới
              </v-chip>
            </v-card-title>

            <v-card-text class="pb-2">
              <p class="text-body-2 mb-3">
                {{ notification.message }}
              </p>
              
              <div class="d-flex gap-1 mb-2">
                <v-chip
                  size="x-small"
                  :color="getNotificationColor(notification.type)"
                  variant="outlined"
                >
                  {{ notification.type }}
                </v-chip>
                
                <v-chip
                  size="x-small"
                  :color="getDeliveryStatusColor(notification.deliveryStatus)"
                  variant="outlined"
                >
                  {{ notification.deliveryStatus }}
                </v-chip>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn
                v-if="!notification.isRead"
                size="small"
                color="primary"
                variant="text"
                @click="(event: Event) => handleMarkAsReadWithEvent(event, notification.id)"
              >
                <v-icon start>mdi-check</v-icon>
                Đã đọc
              </v-btn>
              
              <v-spacer />
              
              <v-btn
                icon
                size="small"
                variant="text"
                color="orange"
                @click="(event: Event) => handleArchiveWithEvent(event, notification.id)"
              >
                <v-icon>mdi-archive</v-icon>
              </v-btn>
              
              <v-btn
                icon
                size="small"
                variant="text"
                color="error"
                @click="(event: Event) => confirmDeleteWithEvent(event, notification.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Delete dialog removed - using global dialog system -->
  </v-container>
</template>

<style scoped>
.header-content {
  flex: 1;
  min-width: 0;
}

.stats-card {
  transition: all 0.3s ease;
  cursor: default;
  border-radius: 12px;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
}

.notification-item {
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
  border-radius: 0;
  padding: 16px;
}

.notification-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  border-left-color: rgba(var(--v-theme-primary), 0.3);
}

.notification-unread {
  background-color: rgba(var(--v-theme-primary), 0.06);
  border-left-color: rgb(var(--v-theme-primary));
}

.notification-unread:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.notification-message {
  line-height: 1.4;
  word-wrap: break-word;
  max-width: 100%;
}

.notification-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  border-radius: 12px;
}

.notification-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.notification-card.notification-unread {
  border-left-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.03);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .stats-card {
    padding: 12px !important;
  }
  
  .notification-item {
    padding: 12px;
  }
  
  .header-content h1 {
    font-size: 1.75rem !important;
  }
}

@media (max-width: 960px) {
  .gap-2 {
    gap: 8px !important;
  }
  
  .gap-3 {
    gap: 12px !important;
  }
  
  .gap-4 {
    gap: 16px !important;
  }
}

/* Accessibility improvements */
.v-btn:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.stats-card:focus-within {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
</style>