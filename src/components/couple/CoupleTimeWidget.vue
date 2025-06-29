<template>
  <div v-if="isConnected && relationshipDuration" class="couple-time-widget">
    <div class="widget-content">
      <div class="heart-icon">💕</div>
      <div class="time-info">
        <span class="time-number">{{ relationshipDuration.days }}</span>
        <span class="time-label">{{ $t('couple.stats.days_together') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCouple } from '@/composables/useCouple'

const { t } = useI18n()
const { isConnected, relationshipDuration } = useCouple()
</script>

<style scoped>
.couple-time-widget {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 25px;
  color: white;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.widget-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.heart-icon {
  font-size: 1.25rem;
  animation: heartbeat 2s infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.time-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.time-number {
  font-weight: 700;
  font-size: 1rem;
  color: #ffd89b;
}

.time-label {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.9;
}
</style>
