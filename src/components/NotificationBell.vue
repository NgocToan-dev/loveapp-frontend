<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()
const showDropdown = ref(false)

// Computed properties
const unreadCount = computed(() => notificationsStore.unreadCount)
const recentNotifications = computed(() => notificationsStore.recentNotifications)
const hasUnread = computed(() => unreadCount.value > 0)

// Methods
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    // Fetch recent notifications when opening dropdown
    notificationsStore.fetchRecentNotifications(5)
  }
}

const markAsRead = async (id: string) => {
  try {
    await notificationsStore.markAsRead(id)
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await notificationsStore.markAllAsRead()
    showDropdown.value = false
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

const goToNotifications = () => {
  showDropdown.value = false
  // Navigate to full notifications page
  window.location.href = '/notifications'
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

// Initialize unread count on mount
onMounted(() => {
  // Temporarily disabled until backend implements notifications API
  // notificationsStore.fetchUnreadCount()
})
</script>

<template>
  <v-menu
    v-model="showDropdown"
    :close-on-content-click="false"
    location="bottom end"
    offset="10"
    max-width="400"
  >    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        variant="text"
        size="large"
        color="on-primary"
        class="mr-2 notification-bell-btn"
        :title="hasUnread ? `${unreadCount} thông báo chưa đọc` : 'Thông báo'"
        @click="toggleDropdown"
      >
        <v-badge
          v-if="hasUnread"
          :content="unreadCount > 99 ? '99+' : unreadCount.toString()"
          color="error"
          offset-x="8"
          offset-y="8"
        >
          <v-icon size="24">mdi-bell</v-icon>
        </v-badge>
        <v-icon v-else size="24">mdi-bell-outline</v-icon>
      </v-btn>
    </template>

    <v-card class="notification-dropdown" min-width="350" max-width="400">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between py-3">
        <span class="text-h6">Thông báo</span>
        <v-chip
          v-if="hasUnread"
          size="small"
          color="primary"
          variant="flat"
        >
          {{ unreadCount }} mới
        </v-chip>
      </v-card-title>

      <v-divider />

      <!-- Loading state -->
      <div v-if="notificationsStore.isLoading" class="pa-4 text-center">
        <v-progress-circular indeterminate color="primary" />
        <div class="mt-2 text-body-2 text-medium-emphasis">
          Đang tải thông báo...
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="recentNotifications.length === 0" class="pa-6 text-center">
        <v-icon size="48" color="grey-lighten-1" class="mb-2">
          mdi-bell-off-outline
        </v-icon>
        <div class="text-body-1 text-medium-emphasis">
          Không có thông báo
        </div>
        <div class="text-body-2 text-medium-emphasis">
          Bạn sẽ nhận được thông báo ở đây
        </div>
      </div>

      <!-- Notifications list -->
      <v-list v-else class="pa-0" max-height="400" style="overflow-y: auto;">
        <v-list-item
          v-for="notification in recentNotifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 'notification-unread': !notification.readAt }"
          @click="markAsRead(notification.id)"
        >
          <template #prepend>
            <v-avatar
              size="40"
              :color="getNotificationColor(notification.type)"
              variant="tonal"
            >
              <v-icon :color="getNotificationColor(notification.type)">
                {{ getNotificationIcon(notification.type) }}
              </v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="text-subtitle-2 font-weight-medium">
            {{ notification.title }}
          </v-list-item-title>
            <v-list-item-subtitle v-if="notification.message" class="text-body-2 mt-1">
            {{ notification.message }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex flex-column align-end">              <v-chip
                v-if="!notification.readAt"
                size="x-small"
                color="primary"
                variant="flat"
                class="mb-1"
              >
                Mới
              </v-chip>
              <span class="text-caption text-medium-emphasis">
                {{ formatTimeAgo(notification.createdAt) }}
              </span>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <v-divider v-if="recentNotifications.length > 0" />

      <!-- Actions -->
      <v-card-actions class="pa-3">
        <v-btn
          v-if="hasUnread"
          variant="text"
          size="small"
          color="primary"
          @click="markAllAsRead"
          :loading="notificationsStore.isLoading"
        >
          <v-icon start>mdi-check-all</v-icon>
          Đánh dấu đã đọc tất cả
        </v-btn>
        
        <v-spacer />
        
        <v-btn
          variant="text"
          size="small"
          color="primary"
          @click="goToNotifications"
        >
          Xem tất cả
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<style scoped>
.notification-dropdown {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
}

.notification-item {
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.notification-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.notification-unread {
  background-color: rgba(var(--v-theme-primary), 0.08);
  border-left-color: rgb(var(--v-theme-primary));
}

.notification-unread:hover {
  background-color: rgba(var(--v-theme-primary), 0.12);
}

.notification-bell-btn {
  position: relative;
  min-width: 48px !important;
  width: 48px !important;
  height: 48px !important;
}

.notification-bell-btn :deep(.v-badge__wrapper) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-bell-btn :deep(.v-badge__badge) {
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  top: 8px !important;
  right: 8px !important;
}

.notification-bell-btn :deep(.v-icon) {
  font-size: 24px !important;
}
</style>