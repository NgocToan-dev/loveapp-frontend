<template>
  <div class="couple-invitation-card">
    <!-- Connection Status Display -->
    <div v-if="isConnected" class="connection-status connected">
      <div class="partner-info">
        <Avatar :src="partner?.avatar" :name="partnerName" size="large" />
        <div class="partner-details">
          <h3>{{ partnerName }}</h3>
          <p class="duration">{{ formatRelationshipDuration() }}</p>
          <p class="next-anniversary">
            {{ $t('couple.next_anniversary') }}: {{ formatCountdown(nextAnniversary) }}
          </p>
        </div>
      </div>
      
      <div class="action-buttons">
        <Button
          @click="showEditRelationshipDate = true"
          variant="outline"
          size="small"
        >
          {{ $t('couple.edit_relationship_date') }}
        </Button>
        
        <Button
          @click="showDisconnectConfirm = true"
          variant="danger"
          size="small"
        >
          {{ $t('couple.disconnect') }}
        </Button>
      </div>
    </div>

    <!-- Pending Connection -->
    <div v-else-if="isPending" class="connection-status pending">
      <div class="pending-info">
        <div class="icon">⏳</div>
        <h3>{{ $t('couple.connection_pending') }}</h3>
        <p>{{ $t('couple.waiting_for_partner') }}</p>
      </div>
    </div>

    <!-- No Connection -->
    <div v-else class="connection-status no-connection">
      <div class="invitation-form">
        <h3>{{ $t('couple.connect_with_partner') }}</h3>
        <p class="description">{{ $t('couple.invitation_description') }}</p>
        
        <form @submit.prevent="handleSendInvitation">
          <Input
            v-model="invitationEmail"
            type="email"
            :label="$t('couple.partner_email')"
            :placeholder="$t('couple.enter_partner_email')"
            required
            :disabled="isSendingInvitation"
          />
          
          <Button
            type="submit"
            :loading="isSendingInvitation"
            :disabled="!invitationEmail"
            class="send-invitation-btn"
          >
            {{ $t('couple.send_invitation') }}
          </Button>
        </form>

        <div class="divider">
          <span>{{ $t('common.or') }}</span>
        </div>

        <div class="join-with-code">
          <h4>{{ $t('couple.have_invitation_code') }}</h4>
          <form @submit.prevent="handleAcceptInvitation">
            <Input
              v-model="invitationCode"
              :label="$t('couple.invitation_code')"
              :placeholder="$t('couple.enter_invitation_code')"
              required
              :disabled="isAcceptingInvitation"
            />
            
            <Button
              type="submit"
              :loading="isAcceptingInvitation"
              :disabled="!invitationCode"
              variant="outline"
              class="mt-4"
            >
              {{ $t('couple.join_with_code') }}
            </Button>
          </form>
        </div>
      </div>
    </div>

    <!-- Pending Invitations -->
    <div v-if="pendingInvitations.length > 0" class="pending-invitations">
      <h4>{{ $t('couple.pending_invitations') }}</h4>
      <div v-for="invitation in pendingInvitations" :key="invitation.id" class="invitation-item">
        <div class="invitation-info">
          <span class="email">{{ invitation.toEmail }}</span>
          <span class="date">{{ formatDate(invitation.createdAt, 'relative') }}</span>
        </div>
        <div class="invitation-actions">
          <Button
            @click="copyInvitationCode(invitation.invitationCode)"
            variant="ghost"
            size="small"
          >
            {{ $t('couple.copy_code') }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <Button @click="clearError" variant="ghost" size="small">
        {{ $t('common.dismiss') }}
      </Button>
    </div>

    <!-- Edit Relationship Date Modal -->
    <Modal v-model="showEditRelationshipDate" :title="$t('couple.edit_relationship_date')">
      <form @submit.prevent="handleUpdateRelationshipDate">
        <Input
          v-model="newRelationshipDate"
          type="date"
          :label="$t('couple.relationship_start_date')"
          required
        />
        
        <div class="modal-actions">
          <Button @click="showEditRelationshipDate = false" variant="outline">
            {{ $t('common.cancel') }}
          </Button>
          <Button type="submit" :loading="isLoading">
            {{ $t('common.save') }}
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Disconnect Confirmation -->
    <ConfirmModal
      v-model="showDisconnectConfirm"
      :title="$t('couple.confirm_disconnect')"
      :message="$t('couple.disconnect_warning')"
      confirmText="couple.disconnect"
      confirmVariant="danger"
      @confirm="handleDisconnect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCouple } from '@/composables/useCouple'
import { formatDate, formatCountdown, copyToClipboard } from '@/utils/helpers'
import Avatar from '@/components/common/Avatar.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Modal from '@/components/common/Modal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const { t } = useI18n()
const {
  coupleConnection,
  pendingInvitations,
  isLoading,
  isSendingInvitation,
  isAcceptingInvitation,
  error,
  isConnected,
  isPending,
  partner,
  nextAnniversary,
  fetchCoupleConnection,
  sendInvitation,
  acceptInvitation,
  fetchPendingInvitations,
  disconnectCouple,
  updateRelationshipStart,
  clearError,
  formatRelationshipDuration
} = useCouple()

// Form state
const invitationEmail = ref('')
const invitationCode = ref('')
const showEditRelationshipDate = ref(false)
const showDisconnectConfirm = ref(false)
const newRelationshipDate = ref('')

// Computed
const partnerName = computed(() => {
  if (!partner.value) return ''
  return `${partner.value.firstName} ${partner.value.lastName}`.trim()
})

// Methods
const handleSendInvitation = async () => {
  try {
    await sendInvitation(invitationEmail.value)
    invitationEmail.value = ''
    await fetchPendingInvitations()
  } catch (error) {
    // Error is handled in the composable
  }
}

const handleAcceptInvitation = async () => {
  try {
    await acceptInvitation(invitationCode.value)
    invitationCode.value = ''
  } catch (error) {
    // Error is handled in the composable
  }
}

const handleUpdateRelationshipDate = async () => {
  try {
    await updateRelationshipStart(newRelationshipDate.value)
    showEditRelationshipDate.value = false
    newRelationshipDate.value = ''
  } catch (error) {
    // Error is handled in the composable
  }
}

const handleDisconnect = async () => {
  try {
    await disconnectCouple()
    showDisconnectConfirm.value = false
  } catch (error) {
    // Error is handled in the composable
  }
}

const copyInvitationCode = async (code: string) => {
  const success = await copyToClipboard(code)
  if (success) {
    // Show success toast
  }
}

// Lifecycle
onMounted(async () => {
  await fetchCoupleConnection()
  await fetchPendingInvitations()
  if (coupleConnection.value?.relationshipStart) {
    newRelationshipDate.value = coupleConnection.value.relationshipStart.split('T')[0]
  }
})
</script>

<style scoped>
.couple-invitation-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.connection-status {
  text-align: center;
}

.connected {
  .partner-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .partner-details {
    text-align: left;
    flex: 1;

    h3 {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .duration {
      color: #666;
      margin: 0 0 4px 0;
    }

    .next-anniversary {
      color: #e91e63;
      font-weight: 500;
      margin: 0;
    }
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
}

.pending {
  .pending-info {
    .icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }

    h3 {
      margin: 0 0 8px 0;
      color: #ff9800;
    }

    p {
      color: #666;
      margin: 0;
    }
  }
}

.no-connection {
  .invitation-form {
    max-width: 400px;
    margin: 0 auto;

    h3 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
    }

    .description {
      color: #666;
      margin: 0 0 24px 0;
    }

    .send-invitation-btn {
      width: 100%;
      margin-top: 16px;
    }
  }

  .divider {
    margin: 24px 0;
    position: relative;
    text-align: center;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #ddd;
    }

    span {
      background: white;
      padding: 0 16px;
      color: #666;
      font-size: 0.875rem;
    }
  }

  .join-with-code {
    h4 {
      margin: 0 0 16px 0;
      font-size: 1.125rem;
    }
  }
}

.pending-invitations {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;

  h4 {
    margin: 0 0 16px 0;
    font-size: 1.125rem;
  }

  .invitation-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 8px;

    .invitation-info {
      .email {
        font-weight: 500;
        display: block;
      }

      .date {
        font-size: 0.875rem;
        color: #666;
      }
    }
  }
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #ffebee;
  border: 1px solid #f44336;
  border-radius: 8px;
  color: #c62828;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    margin: 0;
  }
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>
