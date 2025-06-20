<template>
  <v-card class="quick-actions-card cardLift" elevation="0">
    <v-card-title class="actions-header slideInUp">
      <v-icon class="header-icon magicalGlow" color="primary" size="28">
        mdi-lightning-bolt
      </v-icon>
      <span>Quick Actions</span>
    </v-card-title>

    <v-card-text class="actions-content">
      <div class="actions-grid">
        <!-- Create Memory -->
        <div 
          class="action-item loveClick cardLift slideInUp"
          style="animation-delay: 0.1s;"
          @click="handleAction('memory')"
        >
          <div class="action-icon memory-icon">
            <v-icon size="32" color="primary">mdi-heart</v-icon>
          </div>
          <div class="action-text">
            <h4 class="action-title">Create Memory</h4>
            <p class="action-description">Capture a special moment</p>
          </div>
        </div>

        <!-- Add Note -->
        <div 
          class="action-item loveClick cardLift slideInUp"
          style="animation-delay: 0.2s;"
          @click="handleAction('note')"
        >
          <div class="action-icon note-icon">
            <v-icon size="32" color="secondary">mdi-note-plus</v-icon>
          </div>
          <div class="action-text">
            <h4 class="action-title">Add Note</h4>
            <p class="action-description">Write a sweet message</p>
          </div>
        </div>

        <!-- Set Reminder -->
        <div 
          class="action-item loveClick cardLift slideInUp"
          style="animation-delay: 0.3s;"
          @click="handleAction('reminder')"
        >
          <div class="action-icon reminder-icon">
            <v-icon size="32" color="accent">mdi-bell-plus</v-icon>
          </div>
          <div class="action-text">
            <h4 class="action-title">Set Reminder</h4>
            <p class="action-description">Never forget important dates</p>
          </div>
        </div>

        <!-- Upload Files -->
        <div 
          class="action-item loveClick cardLift slideInUp"
          style="animation-delay: 0.4s;"
          @click="handleAction('files')"
        >
          <div class="action-icon files-icon">
            <v-icon size="32" color="info">mdi-cloud-upload</v-icon>
          </div>
          <div class="action-text">
            <h4 class="action-title">Upload Files</h4>
            <p class="action-description">Share photos and videos</p>
          </div>
        </div>

        <!-- Plan Anniversary -->
        <div 
          class="action-item loveClick cardLift slideInUp"
          style="animation-delay: 0.5s;"
          @click="handleAction('anniversary')"
        >
          <div class="action-icon anniversary-icon">
            <v-icon size="32" color="error">mdi-calendar-heart</v-icon>
          </div>
          <div class="action-text">
            <h4 class="action-title">Plan Anniversary</h4>
            <p class="action-description">Celebrate your milestones</p>
          </div>
        </div>

        <!-- Send Invitation -->
        <div 
          class="action-item loveClick cardLift slideInUp"
          style="animation-delay: 0.6s;"
          @click="handleAction('invite')"
        >
          <div class="action-icon invite-icon">
            <v-icon size="32" color="purple">mdi-account-plus</v-icon>
          </div>
          <div class="action-text">
            <h4 class="action-title">Send Invitation</h4>
            <p class="action-description">Invite your partner</p>
          </div>
        </div>
      </div>

      <!-- Floating Hearts for Click Feedback -->
      <div class="click-feedback" v-if="showClickFeedback">
        <div class="feedback-heart confettiFall">💖</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDialogsStore } from '@/stores/dialogs'

const router = useRouter()
const dialogs = useDialogsStore()
const showClickFeedback = ref(false)

const handleAction = (actionType: string) => {
  // Show click feedback
  showClickFeedback.value = true
  setTimeout(() => {
    showClickFeedback.value = false
  }, 1000)
  // Handle the action
  switch (actionType) {
    case 'memory':
      router.push('/memories/create')
      break
    case 'note':
      router.push('/notes/create')
      break
    case 'reminder':
      router.push('/reminders/create')
      break
    case 'files':
      router.push('/files')
      break
    case 'anniversary':
      router.push('/anniversaries/create')
      break
    case 'invite':
      dialogs.openBaseDialog('InvitationsDialog')
      break
  }
}
</script>

<style scoped>
.quick-actions-card {
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.02) 0%, 
    rgba(var(--secondary-rgb), 0.01) 100%);
  border: 1px solid rgba(var(--primary-rgb), 0.08);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.actions-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 16px;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-icon {
  animation: sparkle 2s ease-in-out infinite;
}

.actions-content {
  padding: 0 24px 24px;
  position: relative;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(var(--primary-rgb), 0.1), 
    transparent);
  transition: left 0.5s ease;
}

.action-item:hover::before {
  left: 100%;
}

.action-item:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--primary-color);
  box-shadow: 0 8px 32px rgba(var(--primary-rgb), 0.15);
}

.action-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.memory-icon {
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.15), 
    rgba(var(--primary-rgb), 0.1));
}

.note-icon {
  background: linear-gradient(135deg, 
    rgba(var(--secondary-rgb), 0.15), 
    rgba(var(--secondary-rgb), 0.1));
}

.reminder-icon {
  background: linear-gradient(135deg, 
    rgba(var(--accent-rgb), 0.15), 
    rgba(var(--accent-rgb), 0.1));
}

.files-icon {
  background: linear-gradient(135deg, 
    rgba(33, 150, 243, 0.15), 
    rgba(33, 150, 243, 0.1));
}

.anniversary-icon {
  background: linear-gradient(135deg, 
    rgba(244, 67, 54, 0.15), 
    rgba(244, 67, 54, 0.1));
}

.invite-icon {
  background: linear-gradient(135deg, 
    rgba(156, 39, 176, 0.15), 
    rgba(156, 39, 176, 0.1));
}

.action-item:hover .action-icon {
  transform: scale(1.1) rotate(5deg);
}

.action-text {
  flex: 1;
  position: relative;
  z-index: 1;
}

.action-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.action-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
  opacity: 0.8;
}

/* Click Feedback */
.click-feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10;
}

.feedback-heart {
  font-size: 32px;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

/* Responsive */
@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .action-item {
    padding: 16px;
    gap: 12px;
  }
  
  .action-icon {
    width: 56px;
    height: 56px;
  }
  
  .action-title {
    font-size: 1rem;
  }
  
  .action-description {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .actions-header {
    padding: 20px 16px 12px;
    font-size: 1.125rem;
  }
  
  .actions-content {
    padding: 0 16px 20px;
  }
  
  .action-item {
    padding: 14px;
  }
  
  .action-icon {
    width: 48px;
    height: 48px;
  }
}
</style>
