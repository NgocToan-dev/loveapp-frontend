<template>
  <v-container class="couple-connection-container">
    <div class="text-center mb-8">
      <h2 class="text-h4 font-weight-medium text-high-emphasis mb-3">
        💕 Kết Nối Cặp Đôi
      </h2>
      <p class="text-h6 text-medium-emphasis">
        Kết nối với người yêu để chia sẻ những khoảnh khắc đặc biệt
      </p>
    </div>

    <!-- Current Connection Status -->
    <v-row v-if="couplesStore.isConnected" class="mb-6">
      <v-col cols="12">
        <v-card 
          class="love-connection-card"
          color="success"
          variant="tonal"
          rounded="xl"
        >
          <v-card-text class="pa-6 text-center">
            <v-avatar
              size="80"
              class="mb-4"
              color="success"
            >
              <v-icon size="40" color="white">mdi-heart-multiple</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-medium mb-2">
              Đã Kết Nối Thành Công!
            </h3>
            <p class="text-body-1 mb-4">
              Bạn đã kết nối với {{ couplesStore.partner?.displayName }}
            </p>
            <v-chip 
              color="success" 
              variant="elevated"
              class="mb-2"
            >
              <v-icon start>mdi-calendar-heart</v-icon>
              {{ formatDate(couplesStore.currentCouple?.relationshipStartDate) }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Connection Tabs -->
    <v-row v-if="!couplesStore.isConnected">
      <v-col cols="12">
        <v-card class="love-tabs-card" rounded="xl" elevation="0">
          <v-tabs 
            v-model="activeTab" 
            color="primary"
            grow
            class="mb-4"
          >
            <v-tab value="invite">
              <v-icon start>mdi-email-send</v-icon>
              Gửi Lời Mời
            </v-tab>
            <v-tab value="join">
              <v-icon start>mdi-qrcode-scan</v-icon>
              Nhập Mã
            </v-tab>
            <v-tab value="invitations">
              <v-icon start>mdi-inbox</v-icon>
              Lời Mời
              <v-badge 
                v-if="pendingInvitations > 0"
                :content="pendingInvitations"
                color="error"
                class="ml-2"
              />
            </v-tab>
          </v-tabs>

          <v-card-text class="pa-6">
            <v-tabs-window v-model="activeTab">
              <!-- Send Invitation Tab -->
              <v-tabs-window-item value="invite">
                <div class="text-center mb-6">
                  <v-icon size="64" color="pink" class="mb-3">mdi-heart-plus</v-icon>
                  <h3 class="text-h6 font-weight-medium mb-2">
                    Mời Người Yêu Kết Nối
                  </h3>
                  <p class="text-body-2 text-medium-emphasis">
                    Gửi lời mời qua email để kết nối với người yêu của bạn
                  </p>
                </div>

                <v-form @submit.prevent="sendInvitation" ref="inviteForm">
                  <v-text-field
                    v-model="inviteForm.email"
                    label="Email người yêu"
                    type="email"
                    variant="outlined"
                    prepend-inner-icon="mdi-email"
                    :rules="emailRules"
                    class="mb-4"
                    required
                  />

                  <v-textarea
                    v-model="inviteForm.message"
                    label="Lời nhắn ngọt ngào (tùy chọn)"
                    variant="outlined"
                    prepend-inner-icon="mdi-message-text"
                    rows="3"
                    class="mb-4"
                    placeholder="Anh/Em muốn chia sẻ những khoảnh khắc đẹp với em/anh..."
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    rounded="xl"
                    :loading="couplesStore.isLoading"
                    elevation="2"
                  >
                    <v-icon start>mdi-heart-plus</v-icon>
                    Gửi Lời Mời Tình Yêu
                  </v-btn>
                </v-form>
              </v-tabs-window-item>

              <!-- Join by Code Tab -->
              <v-tabs-window-item value="join">
                <div class="text-center mb-6">
                  <v-icon size="64" color="purple" class="mb-3">mdi-key-plus</v-icon>
                  <h3 class="text-h6 font-weight-medium mb-2">
                    Nhập Mã Kết Nối
                  </h3>
                  <p class="text-body-2 text-medium-emphasis">
                    Nhập mã mời mà người yêu đã gửi cho bạn
                  </p>
                </div>

                <v-form @submit.prevent="joinByCode" ref="joinForm">
                  <v-text-field
                    v-model="joinForm.code"
                    label="Mã kết nối"
                    variant="outlined"
                    prepend-inner-icon="mdi-key"
                    :rules="codeRules"
                    class="mb-6"
                    placeholder="Nhập mã kết nối..."
                    required
                  />

                  <v-btn
                    type="submit"
                    color="purple"
                    size="large"
                    block
                    rounded="xl"
                    :loading="couplesStore.isLoading"
                    elevation="2"
                  >
                    <v-icon start>mdi-heart-circle</v-icon>
                    Kết Nối Ngay
                  </v-btn>
                </v-form>
              </v-tabs-window-item>

              <!-- Invitations Tab -->
              <v-tabs-window-item value="invitations">
                <div class="text-center mb-6">
                  <v-icon size="64" color="orange" class="mb-3">mdi-inbox</v-icon>
                  <h3 class="text-h6 font-weight-medium mb-2">
                    Lời Mời Kết Nối
                  </h3>
                  <p class="text-body-2 text-medium-emphasis">
                    Quản lý các lời mời đã gửi và nhận
                  </p>
                </div>

                <!-- Received Invitations -->
                <div v-if="couplesStore.pendingReceivedInvitations.length > 0" class="mb-6">
                  <h4 class="text-h6 font-weight-medium mb-3">
                    <v-icon color="success" class="mr-2">mdi-inbox-arrow-down</v-icon>
                    Lời Mời Nhận Được
                  </h4>
                  
                  <v-card 
                    v-for="invitation in couplesStore.pendingReceivedInvitations" 
                    :key="invitation.id"
                    class="mb-3 love-invitation-card"
                    variant="tonal"
                    color="success"
                    rounded="xl"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center">
                        <v-avatar class="mr-4" color="success">
                          <v-icon color="white">mdi-account-heart</v-icon>
                        </v-avatar>
                        <div class="flex-grow-1">
                          <h5 class="text-h6 font-weight-medium">
                            {{ invitation.sender?.displayName }}
                          </h5>
                          <p class="text-body-2 text-medium-emphasis mb-2">
                            {{ invitation.sender?.email }}
                          </p>
                          <p v-if="invitation.message" class="text-body-2 mb-0">
                            "{{ invitation.message }}"
                          </p>
                        </div>
                      </div>
                      
                      <v-divider class="my-3"></v-divider>
                      
                      <div class="d-flex gap-2">
                        <v-btn
                          color="success"
                          variant="elevated"
                          size="small"
                          @click="acceptInvitation(invitation.id)"
                          :loading="couplesStore.isLoading"
                          rounded="xl"
                        >
                          <v-icon start>mdi-heart</v-icon>
                          Chấp Nhận
                        </v-btn>
                        <v-btn
                          color="error"
                          variant="outlined"
                          size="small"
                          @click="rejectInvitation(invitation.id)"
                          :loading="couplesStore.isLoading"
                          rounded="xl"
                        >
                          <v-icon start>mdi-close</v-icon>
                          Từ Chối
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>

                <!-- Sent Invitations -->
                <div v-if="couplesStore.pendingSentInvitations.length > 0">
                  <h4 class="text-h6 font-weight-medium mb-3">
                    <v-icon color="primary" class="mr-2">mdi-inbox-arrow-up</v-icon>
                    Lời Mời Đã Gửi
                  </h4>
                  
                  <v-card 
                    v-for="invitation in couplesStore.pendingSentInvitations" 
                    :key="invitation.id"
                    class="mb-3 love-invitation-card"
                    variant="tonal" 
                    color="primary"
                    rounded="xl"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <h5 class="text-h6 font-weight-medium">
                            {{ invitation.receiverEmail }}
                          </h5>
                          <p class="text-body-2 text-medium-emphasis mb-2">
                            Mã: {{ invitation.invitationCode }}
                          </p>
                          <p v-if="invitation.message" class="text-body-2 mb-0">
                            "{{ invitation.message }}"
                          </p>
                        </div>
                        <v-chip color="warning" variant="elevated" size="small">
                          <v-icon start size="14">mdi-clock</v-icon>
                          Chờ phản hồi
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>

                <!-- No Invitations -->
                <div v-if="couplesStore.pendingReceivedInvitations.length === 0 && couplesStore.pendingSentInvitations.length === 0" class="text-center">
                  <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-inbox-outline</v-icon>
                  <p class="text-body-1 text-medium-emphasis">
                    Chưa có lời mời nào
                  </p>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      timeout="4000"
      rounded="pill"
    >
      <v-icon start>mdi-check-circle</v-icon>
      {{ successMessage }}
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showErrorSnackbar"
      color="error"
      timeout="6000"
      rounded="pill"
    >
      <v-icon start>mdi-alert-circle</v-icon>
      {{ couplesStore.error }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useCouplesStore } from '@/stores/couples'
import dayjs from 'dayjs'

const couplesStore = useCouplesStore()

const activeTab = ref('invite')
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')

const inviteForm = reactive({
  email: '',
  message: ''
})

const joinForm = reactive({
  code: ''
})

const inviteFormRef = ref()
const joinFormRef = ref()

const emailRules = [
  (v: string) => !!v || 'Email là bắt buộc',
  (v: string) => /.+@.+\..+/.test(v) || 'Email không hợp lệ'
]

const codeRules = [
  (v: string) => !!v || 'Mã kết nối là bắt buộc',
  (v: string) => v.length >= 6 || 'Mã kết nối phải có ít nhất 6 ký tự'
]

const pendingInvitations = computed(() => 
  couplesStore.pendingReceivedInvitations.length
)

const formatDate = (date: string | undefined) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY')
}

const sendInvitation = async () => {
  try {
    const { valid } = await inviteFormRef.value.validate()
    if (!valid) return

    await couplesStore.sendInvitation({
      receiverEmail: inviteForm.email,
      message: inviteForm.message || undefined
    })

    successMessage.value = 'Lời mời đã được gửi thành công!'
    showSuccessSnackbar.value = true
    
    // Reset form
    inviteForm.email = ''
    inviteForm.message = ''
    inviteFormRef.value.reset()
  } catch (error) {
    showErrorSnackbar.value = true
  }
}

const joinByCode = async () => {
  try {
    const { valid } = await joinFormRef.value.validate()
    if (!valid) return

    await couplesStore.joinByCode(joinForm.code)
    
    successMessage.value = 'Kết nối thành công! Chào mừng bạn đến với không gian tình yêu.'
    showSuccessSnackbar.value = true
    
    // Reset form
    joinForm.code = ''
    joinFormRef.value.reset()
  } catch (error) {
    showErrorSnackbar.value = true
  }
}

const acceptInvitation = async (invitationId: string) => {
  try {
    await couplesStore.acceptInvitation(invitationId)
    successMessage.value = 'Đã chấp nhận lời mời! Chào mừng bạn đến với không gian tình yêu.'
    showSuccessSnackbar.value = true
  } catch (error) {
    showErrorSnackbar.value = true
  }
}

const rejectInvitation = async (invitationId: string) => {
  try {
    await couplesStore.rejectInvitation(invitationId)
    successMessage.value = 'Đã từ chối lời mời.'
    showSuccessSnackbar.value = true
  } catch (error) {
    showErrorSnackbar.value = true
  }
}

// Watch for errors
watch(() => couplesStore.error, (error) => {
  if (error) {
    showErrorSnackbar.value = true
  }
})

// Initialize data
onMounted(async () => {
  await Promise.all([
    couplesStore.fetchCurrentCouple(),
    couplesStore.fetchInvitations()
  ])
})
</script>

<style scoped lang="scss">
.couple-connection-container {
  padding: 2rem 0;
}

.love-connection-card {
  border: 2px solid rgba(var(--v-theme-success), 0.3);
  background: linear-gradient(135deg, rgba(var(--v-theme-success), 0.1), rgba(var(--v-theme-success), 0.05));
}

.love-tabs-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
  background: linear-gradient(135deg, rgba(var(--v-theme-surface), 1), rgba(var(--v-theme-primary), 0.02));
}

.love-invitation-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.v-tabs {
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.8);
}

.v-tab {
  border-radius: 8px;
  margin: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(var(--v-theme-primary), 0.1);
  }
}

.v-btn {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 600px) {
  .couple-connection-container {
    padding: 1rem 0;
  }
  
  .v-tab {
    font-size: 0.875rem;
    padding: 0 8px;
  }
  
  .love-invitation-card:hover {
    transform: none;
  }
}
</style> 