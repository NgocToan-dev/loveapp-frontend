<template>  <v-card 
    class="note-card cardLift loveClick slideInUp" 
    :class="{ 'mobile-optimized': isMobile }"
    elevation="0"
    @click="handleClick"
    ref="cardRef"
  >
    <!-- Note Header -->
    <div class="note-header">
      <div class="note-title-section">
        <h3 class="note-title">{{ note.title }}</h3>
        <div class="note-meta">
          <span class="note-date">{{ formatDate(note.createdAt) }}</span>
          <v-chip
            size="small"
            :color="getCategoryColor(note.category)"
            variant="tonal"
            class="category-chip sparkle"
          >
            {{ note.category }}
          </v-chip>
        </div>
      </div>

      <!-- Note Actions -->
      <div class="note-actions">
        <v-btn
          icon
          variant="text"
          size="small"
          class="action-btn loveClick"
          @click.stop="togglePrivate"
        >
          <v-icon 
            :color="note.isPrivate ? 'error' : 'grey-lighten-1'"
            :class="{ 'softWobble': note.isPrivate }"
          >
            {{ note.isPrivate ? 'mdi-eye-off' : 'mdi-eye' }}
          </v-icon>
        </v-btn>
        
        <v-btn
          icon
          variant="text"
          size="small"
          class="action-btn loveClick"
          @click.stop="$emit('edit', note)"
        >
          <v-icon color="primary" class="sparkle">mdi-pencil</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Note Content -->
    <v-card-text class="note-content">
      <p class="note-text">
        {{ truncatedContent }}
      </p>

      <!-- Note Tags -->
      <div class="note-tags" v-if="note.tags && note.tags.length">
        <v-chip
          v-for="tag in note.tags.slice(0, 3)"
          :key="tag"
          size="small"
          variant="outlined"
          color="primary"
          class="note-tag"
        >
          {{ tag }}
        </v-chip>
        <v-chip
          v-if="note.tags.length > 3"
          size="small"
          variant="text"
          color="grey"
          class="more-tags"
        >
          +{{ note.tags.length - 3 }}
        </v-chip>
      </div>

      <!-- Note Footer -->
      <div class="note-footer">
        <div class="note-stats">
          <div class="stat-item" v-if="note.attachments?.length">
            <v-icon size="14" color="info">mdi-paperclip</v-icon>
            <span>{{ note.attachments.length }}</span>
          </div>
          <div class="stat-item" v-if="note.sharedWith?.length">
            <v-icon size="14" color="success">mdi-share</v-icon>
            <span>{{ note.sharedWith.length }}</span>
          </div>
        </div>

        <div class="note-status">
          <v-icon 
            v-if="note.isArchived" 
            size="16" 
            color="orange"
            class="status-icon"
          >
            mdi-archive
          </v-icon>
        </div>
      </div>
    </v-card-text>

    <!-- Privacy Feedback -->
    <div class="privacy-feedback" v-if="showPrivacyHearts">
      <div class="heart heart-1 confettiFall">🔒</div>
      <div class="heart heart-2 confettiFall">💕</div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTouch } from '@/composables/useTouch'
import type { SwipeDirection } from '@/composables/useTouch'
import { useBreakpoints } from '@/composables/useBreakpoints'
import type { Note } from '@/types'

interface Props {
  note: Note
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'click': [note: Note]
  'edit': [note: Note]
  'togglePrivate': [note: Note]
}>()

const { isMobile } = useBreakpoints()
const { setHandlers, bindToElement } = useTouch()
const cardRef = ref<HTMLElement>()
const showPrivacyHearts = ref(false)

const handleClick = () => {
  emit('click', props.note)
}

const togglePrivate = () => {
  // Show hearts animation for privacy toggle
  showPrivacyHearts.value = true
  setTimeout(() => {
    showPrivacyHearts.value = false
  }, 1000)
  
  emit('togglePrivate', props.note)
}

const truncatedContent = computed(() => {
  if (!props.note.content) return ''
  return props.note.content.length > 150 
    ? props.note.content.slice(0, 150) + '...'
    : props.note.content
})

const formatDate = (date: Date | { _seconds: number; _nanoseconds: number }) => {
  let d: Date
  if (date && typeof date === 'object' && '_seconds' in date) {
    d = new Date(date._seconds * 1000)
  } else {
    d = new Date(date)
  }
  
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'personal': 'primary',
    'love': 'error',
    'memories': 'secondary',
    'thoughts': 'purple',
    'dreams': 'indigo',
    'goals': 'success',
    'ideas': 'orange'
  }
  return colors[category.toLowerCase()] || 'primary'
}

// Touch handlers for mobile
onMounted(() => {
  if (cardRef.value && isMobile.value) {
    setHandlers({
      onTap: handleClick,
      onLongPress: () => emit('edit', props.note),      onSwipe: (swipeData) => {
        if (swipeData.direction === 'left') togglePrivate()
      },
    })
    bindToElement(cardRef.value)
  }
})
</script>

<style scoped>
.note-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(var(--primary-rgb), 0.08);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(10px);
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(var(--primary-rgb), 0.12);
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 1);
}

/* Note Header */
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 0;
  gap: 16px;
}

.note-title-section {
  flex: 1;
  min-width: 0;
}

.note-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  line-height: 1.3;
  word-break: break-word;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.note-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.8;
}

.category-chip {
  height: 20px;
  font-size: 0.7rem;
  transition: all 0.3s ease;
}

.category-chip:hover {
  transform: scale(1.05);
}

/* Note Actions */
.note-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.note-card:hover .note-actions {
  opacity: 1;
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  background: rgba(var(--primary-rgb), 0.1) !important;
}

/* Note Content */
.note-content {
  padding: 16px 20px 20px;
}

.note-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 16px;
  word-break: break-word;
}

/* Note Tags */
.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.note-tag {
  height: 22px;
  font-size: 0.7rem;
  border-radius: 11px;
  transition: all 0.3s ease;
}

.note-tag:hover {
  transform: scale(1.05);
  background: rgba(var(--primary-rgb), 0.1) !important;
}

.more-tags {
  height: 22px;
  font-size: 0.7rem;
  opacity: 0.7;
}

/* Note Footer */
.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.note-status {
  display: flex;
  gap: 4px;
}

.status-icon {
  opacity: 0.7;
}

/* Privacy Feedback */
.privacy-feedback {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.heart {
  position: absolute;
  font-size: 16px;
  opacity: 0.8;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.heart-1 {
  top: 30%;
  left: 40%;
  animation-delay: 0s;
}

.heart-2 {
  top: 50%;
  right: 40%;
  animation-delay: 0.3s;
}

/* Responsive */
@media (max-width: 768px) {
  .note-header {
    padding: 16px 16px 0;
  }
  
  .note-content {
    padding: 12px 16px 16px;
  }
  
  .note-title {
    font-size: 1rem;
  }
  
  .note-text {
    font-size: 0.9rem;
  }
  
  .note-meta {
    gap: 6px;
  }
  
  .note-stats {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .note-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .note-actions {
    opacity: 1;
    align-self: flex-end;
  }
  
  .note-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

/* Mobile Optimizations */
.mobile-optimized {
  .note-header {
    padding: 12px 16px 8px;
    
    .note-title {
      font-size: 1.1rem;
      line-height: 1.3;
    }
    
    .note-actions {
      .action-btn {
        min-width: 40px;
        min-height: 40px;
      }
    }
  }
  
  .note-content {
    padding: 8px 16px;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .note-footer {
    padding: 8px 16px 12px;
    
    .note-tags {
      .tag-chip {
        height: 24px;
        font-size: 0.75rem;
      }
    }
  }
  
  /* Touch feedback */
  &:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}
</style>
