<template>
  <div v-if="isConnected && relationshipDuration" class="couple-time-display">
    <div class="time-container">
      <!-- Heart animation background -->
      <div class="heart-background">
        <div class="floating-heart heart-1">💕</div>
        <div class="floating-heart heart-2">💖</div>
        <div class="floating-heart heart-3">💗</div>
        <div class="floating-heart heart-4">💓</div>
        <div class="floating-heart heart-5">💘</div>
      </div>

      <!-- Main content -->
      <div class="time-content">
        <h2 class="couple-names">
          {{ coupleNames }}
        </h2>
        
        <div class="time-stats">
          <div class="stat-item primary">
            <div class="stat-number">{{ relationshipDuration.days }}</div>
            <div class="stat-label">{{ $t('couple.stats.days_together') }}</div>
          </div>
          
          <div class="time-breakdown">
            <div v-if="relationshipDuration.years > 0" class="breakdown-item">
              <span class="breakdown-number">{{ relationshipDuration.years }}</span>
              <span class="breakdown-label">{{ $t('couple.stats.years') }}</span>
            </div>
            
            <div v-if="relationshipDuration.months > 0" class="breakdown-item">
              <span class="breakdown-number">{{ relationshipDuration.months }}</span>
              <span class="breakdown-label">{{ $t('couple.stats.months') }}</span>
            </div>
            
            <div class="breakdown-item">
              <span class="breakdown-number">{{ relationshipDuration.remainingDays }}</span>
              <span class="breakdown-label">{{ $t('couple.stats.days') }}</span>
            </div>
          </div>
        </div>

        <!-- Anniversary countdown -->
        <div v-if="nextAnniversary" class="anniversary-countdown">
          <div class="countdown-icon">🎉</div>
          <div class="countdown-text">
            <span class="countdown-label">{{ $t('couple.next_anniversary') }}</span>
            <span class="countdown-value">{{ formatCountdown(nextAnniversary) }}</span>
          </div>
        </div>

        <!-- Love quote -->
        <div class="love-quote">
          <p class="quote-text">"{{ getCurrentQuote().text }}"</p>
          <p class="quote-author">— {{ getCurrentQuote().author }}</p>
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
const { user, userDisplayName } = useAuth()
const { 
  isConnected, 
  partner, 
  relationshipDuration, 
  nextAnniversary
} = useCouple()

// Computed properties
const coupleNames = computed(() => {
  if (!partner.value || !user.value) return ''
  
  const userName = userDisplayName.value || 
                   user.value.email?.split('@')[0] || 
                   'You'
  
  const partnerName = partner.value.displayName || 
                      `${partner.value.firstName || ''} ${partner.value.lastName || ''}`.trim() || 
                      partner.value.email?.split('@')[0] || 
                      'Partner'
  
  return `${userName} & ${partnerName}`
})

// Love quotes rotation
const loveQuotes = [
  { 
    text: "Tình yêu không chỉ là nhìn vào mắt nhau, mà là cùng nhìn về một hướng", 
    author: "Antoine de Saint-Exupéry" 
  },
  { 
    text: "Điều tốt nhất để nắm giữ trong cuộc sống là nhau", 
    author: "Audrey Hepburn" 
  },
  { 
    text: "Tình yêu được tạo thành từ một linh hồn sống trong hai cơ thể", 
    author: "Aristotle" 
  },
  { 
    text: "Tình yêu thật sự bắt đầu khi không mong đợi gì để đáp lại", 
    author: "Antoine de Saint-Exupéry" 
  },
  { 
    text: "Hạnh phúc lớn nhất của cuộc đời là tin chắc rằng chúng ta được yêu thương", 
    author: "Victor Hugo" 
  }
]

const getCurrentQuote = () => {
  const index = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % loveQuotes.length
  return loveQuotes[index]
}
</script>

<style scoped>
.couple-time-display {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 2rem auto;
  perspective: 1000px;
}

.time-container {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(102, 126, 234, 0.3),
    0 10px 20px rgba(118, 75, 162, 0.2);
  transform: translateZ(0);
  transition: all 0.3s ease;
}

.time-container:hover {
  transform: translateY(-8px) rotateX(5deg);
  box-shadow: 
    0 30px 60px rgba(102, 126, 234, 0.4),
    0 15px 30px rgba(118, 75, 162, 0.3);
}

.heart-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-heart {
  position: absolute;
  font-size: 2rem;
  opacity: 0.15;
  animation: floatingHeart 8s infinite ease-in-out;
}

.heart-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.heart-2 {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.heart-3 {
  top: 30%;
  right: 25%;
  animation-delay: 4s;
}

.heart-4 {
  bottom: 20%;
  left: 20%;
  animation-delay: 6s;
}

.heart-5 {
  top: 10%;
  left: 60%;
  animation-delay: 1s;
}

@keyframes floatingHeart {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-10px) rotate(5deg) scale(1.1);
  }
  50% {
    transform: translateY(-20px) rotate(-5deg) scale(0.9);
  }
  75% {
    transform: translateY(-10px) rotate(3deg) scale(1.05);
  }
}

.time-content {
  position: relative;
  z-index: 2;
  color: white;
}

.couple-names {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #fff 30%, #f8f9ff 70%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease-in-out infinite alternate;
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.time-stats {
  margin-bottom: 2rem;
}

.stat-item.primary {
  margin-bottom: 1.5rem;
}

.stat-number {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(45deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 15px rgba(255, 216, 155, 0.5);
  animation: pulse 2s ease-in-out infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

.stat-label {
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 0.5rem;
  opacity: 0.9;
}

.time-breakdown {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.breakdown-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffd89b;
  text-shadow: 0 2px 8px rgba(255, 216, 155, 0.4);
}

.breakdown-label {
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}

.anniversary-countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.countdown-icon {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.countdown-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.countdown-label {
  font-size: 0.9rem;
  opacity: 0.8;
  font-weight: 500;
}

.countdown-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffd89b;
}

.love-quote {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.quote-text {
  font-size: 1.1rem;
  font-style: italic;
  margin: 0 0 0.5rem 0;
  opacity: 0.9;
  line-height: 1.6;
}

.quote-author {
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0;
  font-weight: 300;
}

/* Responsive design */
@media (max-width: 768px) {
  .time-container {
    padding: 2rem 1.5rem;
  }

  .couple-names {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .stat-number {
    font-size: 3rem;
  }

  .breakdown-number {
    font-size: 2rem;
  }

  .time-breakdown {
    gap: 1rem;
  }

  .anniversary-countdown {
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

  .floating-heart {
    font-size: 1.5rem;
  }

  .love-quote {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }

  .quote-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .time-container {
    padding: 1.5rem 1rem;
    margin: 0 0.5rem 2rem 0.5rem;
  }

  .couple-names {
    font-size: 1.8rem;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .breakdown-number {
    font-size: 1.8rem;
  }

  .time-breakdown {
    flex-direction: column;
    gap: 0.5rem;
  }

  .anniversary-info {
    padding: 0.75rem;
    flex-direction: column;
    text-align: center;
  }

  .love-quote {
    margin-top: 1rem;
    padding-top: 1rem;
  }

  .quote-text {
    font-size: 0.9rem;
  }

  .quote-author {
    font-size: 0.8rem;
  }
}

/* Additional animations */
.time-container {
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.time-content > * {
  animation: fadeInSequence 0.6s ease-out forwards;
  opacity: 0;
}

.couple-names {
  animation-delay: 0.1s;
}

.time-stats {
  animation-delay: 0.2s;
}

.anniversary-countdown {
  animation-delay: 0.3s;
}

.love-quote {
  animation-delay: 0.4s;
}

@keyframes fadeInSequence {
  to {
    opacity: 1;
  }
}
</style>
