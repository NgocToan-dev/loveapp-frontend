<template>
  <Teleport to="body">
    <div v-if="showPrompt" class="install-prompt-overlay">
      <div class="install-prompt">
        <div class="install-header">
          <div class="install-icon">📱</div>
          <h3>{{ $t('pwa.install.title') }}</h3>
          <button @click="$emit('dismiss')" class="close-btn">
            <CloseIcon />
          </button>
        </div>
        
        <div class="install-content">
          <p>{{ $t('pwa.install.description') }}</p>
          
          <div class="install-benefits">
            <div class="benefit">
              <span class="benefit-icon">⚡</span>
              <span>{{ $t('pwa.benefits.fast') }}</span>
            </div>
            <div class="benefit">
              <span class="benefit-icon">📱</span>
              <span>{{ $t('pwa.benefits.native') }}</span>
            </div>
            <div class="benefit">
              <span class="benefit-icon">🔄</span>
              <span>{{ $t('pwa.benefits.offline') }}</span>
            </div>
          </div>
        </div>
        
        <div class="install-actions">
          <Button @click="$emit('dismiss')" variant="outline">
            {{ $t('common.buttons.cancel') }}
          </Button>
          <Button @click="$emit('install')" variant="primary">
            {{ $t('pwa.install.button') }}
          </Button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button.vue'

defineProps<{
  showPrompt: boolean
}>()

defineEmits<{
  install: []
  dismiss: []
}>()

import CloseIcon from '@/components/icons/CloseIcon.vue'
</script>

<style scoped>
.install-prompt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.install-prompt {
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
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

.install-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 0 20px;
  position: relative;
}

.install-icon {
  font-size: 32px;
}

.install-header h3 {
  flex: 1;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

.install-content {
  padding: 20px;
}

.install-content p {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.5;
}

.install-benefits {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.benefit-icon {
  font-size: 20px;
}

.benefit span:last-child {
  color: #333;
  font-weight: 500;
}

.install-actions {
  display: flex;
  gap: 12px;
  padding: 0 20px 20px 20px;
}

.install-actions button {
  flex: 1;
}

/* Mobile styles */
@media (max-width: 480px) {
  .install-prompt-overlay {
    padding: 16px;
    align-items: flex-end;
  }
  
  .install-prompt {
    border-radius: 16px 16px 0 0;
    max-width: none;
  }
  
  .install-header {
    padding: 16px 16px 0 16px;
  }
  
  .install-content {
    padding: 16px;
  }
  
  .install-actions {
    padding: 0 16px 16px 16px;
    flex-direction: column;
  }
}
</style>
