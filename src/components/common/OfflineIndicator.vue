<template>
  <Teleport to="body">
    <Transition name="slide-down">
      <div v-if="!isOnline" class="offline-indicator">
        <div class="offline-content">
          <div class="offline-icon">📡</div>
          <div class="offline-text">
            <strong>{{ $t('pwa.offline.title') }}</strong>
            <span>{{ $t('pwa.offline.message') }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.offline-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.offline-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.offline-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
}

.offline-text strong {
  font-weight: 600;
  font-size: 14px;
}

.offline-text span {
  font-size: 12px;
  opacity: 0.9;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .offline-content {
    padding: 10px 16px;
    gap: 8px;
  }
  
  .offline-icon {
    font-size: 18px;
  }
  
  .offline-text {
    gap: 0;
  }
  
  .offline-text strong {
    font-size: 13px;
  }
  
  .offline-text span {
    font-size: 11px;
  }
}
</style>
