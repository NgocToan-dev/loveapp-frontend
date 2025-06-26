<template>
  <Teleport to="body">
    <div class="notification-container">
      <TransitionGroup name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="notificationClass(notification.type)"
          class="notification-toast"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon" v-html="getIcon(notification.type)"></div>
          <div class="notification-content">
            <h4 class="notification-title">{{ notification.title }}</h4>
            <p v-if="notification.message" class="notification-message">
              {{ notification.message }}
            </p>
          </div>
          <button 
            class="notification-close"
            @click.stop="removeNotification(notification.id)"
            :aria-label="$t('common.buttons.close')"
            v-html="closeIcon"
          >
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications'

const { notifications, removeNotification, markAsRead } = useNotifications()

const notificationClass = (type: string) => {
  const baseClass = 'notification-'
  return baseClass + type
}

const getIcon = (type: string) => {
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20,6 9,17 4,12"></polyline>
    </svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>`
  }
  return icons[type as keyof typeof icons] || icons.info
}

const closeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notification-toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 400px;
  margin-bottom: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  cursor: pointer;
  pointer-events: all;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.notification-toast:hover {
  transform: translateX(-4px);
}

.notification-success {
  border-left-color: #4caf50;
}

.notification-error {
  border-left-color: #f44336;
}

.notification-warning {
  border-left-color: #ff9800;
}

.notification-info {
  border-left-color: #2196f3;
}

.notification-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-success .notification-icon {
  color: #4caf50;
}

.notification-error .notification-icon {
  color: #f44336;
}

.notification-warning .notification-icon {
  color: #ff9800;
}

.notification-info .notification-icon {
  color: #2196f3;
}

.notification-content {
  flex: 1;
}

.notification-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.notification-message {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.notification-close {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: none;
  background: none;
  color: #999;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.notification-close:hover {
  color: #666;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .notification-container {
    left: 20px;
    right: 20px;
    top: 80px;
  }
  
  .notification-toast {
    max-width: 100%;
  }
}
</style>
