<template>
  <v-dialog v-model="dialog" max-width="800" scrollable>
    <v-card rounded="xl">
      <v-card-title class="text-h5 font-weight-bold pa-6">
        <v-icon color="primary" class="mr-2">mdi-email-multiple</v-icon>
        Quản Lý Lời Mời
      </v-card-title>

      <v-tabs v-model="activeTab" color="primary" class="px-6">
        <v-tab value="received">
          <v-icon start>mdi-email-receive</v-icon>
          Nhận Được
          <v-badge 
            v-if="invitationsStore.pendingReceivedInvitations.length > 0"
            :content="invitationsStore.pendingReceivedInvitations.length"
            color="error"
            floating
          />
        </v-tab>
        <v-tab value="sent">
          <v-icon start>mdi-email-send</v-icon>
          Đã Gửi
        </v-tab>
      </v-tabs>

      <v-card-text class="pa-0">
        <v-tabs-window v-model="activeTab">
          <!-- Received Invitations -->
          <v-tabs-window-item value="received" class="pa-6">
            <div v-if="invitationsStore.receivedInvitations.length === 0" class="text-center py-8">
              <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-email-receive-outline</v-icon>
              <h4 class="text-h6 font-weight-medium mb-2">Không có lời mời nào</h4>
              <p class="text-body-2 text-medium-emphasis">
                Chưa có ai gửi lời mời kết nối cho bạn
              </p>
            </div>

            <div v-else>
              <v-list>
                <v-list-item
                  v-for="invitation in invitationsStore.receivedInvitations"
                  :key="invitation.id"
                  class="mb-3"
                >
                  <template v-slot:prepend>
                    <v-avatar>
                      <v-img v-if="invitation.sender?.photoURL" :src="invitation.sender.photoURL" />
                      <v-icon v-else>mdi-account</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium">
                    {{ invitation.sender?.name || invitation.sender?.email }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ invitation.message || 'Lời mời kết nối cặp đôi' }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption">
                    {{ formatDate(invitation.createdAt) }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="d-flex flex-column align-center ga-2">
                      <v-chip
                        :color="getStatusColor(invitation.status)"
                        size="small"
                        class="mb-2"
                      >
                        {{ getStatusText(invitation.status) }}
                      </v-chip>

                      <div v-if="invitation.status === 'pending'" class="d-flex ga-2">
                        <v-btn
                          color="success"
                          size="small"
                          variant="elevated"
                          :loading="invitationsStore.isLoading"
                          @click="acceptInvitation(invitation.id)"
                        >
                          <v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-btn
                          color="error"
                          size="small"
                          variant="elevated"
                          :loading="invitationsStore.isLoading"
                          @click="rejectInvitation(invitation.id)"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </div>
          </v-tabs-window-item>

          <!-- Sent Invitations -->
          <v-tabs-window-item value="sent" class="pa-6">
            <div v-if="invitationsStore.sentInvitations.length === 0" class="text-center py-8">
              <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-email-send-outline</v-icon>
              <h4 class="text-h6 font-weight-medium mb-2">Chưa gửi lời mời nào</h4>
              <p class="text-body-2 text-medium-emphasis">
                Bạn chưa gửi lời mời kết nối nào
              </p>
            </div>

            <div v-else>
              <v-list>
                <v-list-item
                  v-for="invitation in invitationsStore.sentInvitations"
                  :key="invitation.id"
                  class="mb-3"
                >
                  <template v-slot:prepend>
                    <v-avatar>
                      <v-img v-if="invitation.receiver?.photoURL" :src="invitation.receiver.photoURL" />
                      <v-icon v-else>mdi-account</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium">
                    {{ invitation.receiver?.name || invitation.receiverEmail }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ invitation.message || 'Lời mời kết nối cặp đôi' }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="text-caption">
                    {{ formatDate(invitation.createdAt) }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="d-flex flex-column align-center ga-2">
                      <v-chip
                        :color="getStatusColor(invitation.status)"
                        size="small"
                        class="mb-2"
                      >
                        {{ getStatusText(invitation.status) }}
                      </v-chip>

                      <v-btn
                        v-if="invitation.status === 'pending'"
                        color="error"
                        size="small"
                        variant="text"
                        :loading="invitationsStore.isLoading"
                        @click="cancelInvitation(invitation.id)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>

      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn
          variant="elevated"
          color="primary"
          @click="dialog = false"
        >
          Đóng
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCoupleInvitationsStore } from '@/stores/coupleInvitations'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'invitation-accepted': []
}>()

const invitationsStore = useCoupleInvitationsStore()
const activeTab = ref('received')

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'accepted': return 'success'
    case 'rejected': return 'error'
    case 'expired': return 'grey'
    default: return 'grey'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Đang chờ'
    case 'accepted': return 'Đã chấp nhận'
    case 'rejected': return 'Đã từ chối'
    case 'expired': return 'Đã hết hạn'
    default: return 'Không xác định'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const acceptInvitation = async (invitationId: string) => {
  try {
    await invitationsStore.acceptInvitation(invitationId)
    emit('invitation-accepted')
  } catch (error) {
    // Error is handled in the store
  }
}

const rejectInvitation = async (invitationId: string) => {
  try {
    await invitationsStore.rejectInvitation(invitationId)
  } catch (error) {
    // Error is handled in the store
  }
}

const cancelInvitation = async (invitationId: string) => {
  try {
    await invitationsStore.cancelInvitation(invitationId)
  } catch (error) {
    // Error is handled in the store
  }
}
</script>

<style scoped lang="scss">
.v-list-item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.8);
}
</style>