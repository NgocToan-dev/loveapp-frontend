<template>
  <div v-if="isConnected && relationshipDuration" class="couple-time-banner">
    <div class="banner-content">
      <div class="banner-main">
        <div class="time-display">
          <span class="time-number">{{ relationshipDuration.days }}</span>
          <span class="time-label">{{ $t('couple.stats.days_together') }}</span>
        </div>
        
        <div class="couple-info">
          <h3 class="couple-names">{{ coupleNames }}</h3>
          <div class="time-breakdown">
            <span v-if="relationshipDuration.years > 0" class="time-part">
              {{ relationshipDuration.years }} {{ $t('couple.stats.years') }}
            </span>
            <span v-if="relationshipDuration.months > 0" class="time-part">
              {{ relationshipDuration.months }} {{ $t('couple.stats.months') }}
            </span>
            <span class="time-part">
              {{ relationshipDuration.remainingDays }} {{ $t('couple.stats.days') }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-if="nextAnniversary" class="anniversary-info">
        <div class="anniversary-icon">🎉</div>
        <div class="anniversary-text">
          <span class="anniversary-label">{{ $t('couple.next_anniversary') }}</span>
          <span class="anniversary-countdown">{{ formatCountdown(nextAnniversary) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCouple } from '@/composables/useCouple'
import { useAuth } from '@/composables/useAuth'
import { formatCountdown } from '@/utils/helpers'

const { t } = useI18n()
const { userDisplayName } = useAuth()
const { 
  isConnected, 
  partner, 
  relationshipDuration, 
  nextAnniversary 
} = useCouple()

// Computed properties
const coupleNames = computed(() => {
  if (!partner.value) return ''
  
  const userName = userDisplayName.value || 'You'
  const partnerName = partner.value.displayName || 
                      `${partner.value.firstName || ''} ${partner.value.lastName || ''}`.trim() || 
                      partner.value.email?.split('@')[0] || 
                      'Partner'
  
  return `${userName} & ${partnerName}`
})
</script>

<style scoped>
.couple-time-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.banner-main {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.time-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.time-number {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(45deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.time-label {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.25rem;
  opacity: 0.9;
}

.couple-info {
  flex: 1;
}

.couple-names {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.time-breakdown {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.time-part {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.anniversary-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.anniversary-icon {
  font-size: 1.5rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

.anniversary-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.anniversary-label {
  font-size: 0.8rem;
  opacity: 0.8;
  font-weight: 500;
}

.anniversary-countdown {
  font-size: 1rem;
  font-weight: 700;
  color: #ffd89b;
}

/* Responsive design */
@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    gap: 1rem;
  }

  .banner-main {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .time-display {
    padding: 0.75rem;
  }

  .time-number {
    font-size: 2rem;
  }

  .couple-names {
    font-size: 1.25rem;
  }

  .time-breakdown {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .couple-time-banner {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .time-breakdown {
    flex-direction: column;
    gap: 0.5rem;
  }

  .time-part {
    text-align: center;
  }
}
</style>
