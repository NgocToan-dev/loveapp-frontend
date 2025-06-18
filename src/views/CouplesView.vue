<template>
  <div class="couples-view">
    <!-- Header -->
    <v-container>
      <div class="text-center mb-8">
        <h1 class="text-h3 font-weight-bold text-primary mb-4">
          💕 Không Gian Cặp Đôi
        </h1>
        <p class="text-h6 text-medium-emphasis">
          Nơi lưu giữ và chia sẻ những khoảnh khắc đẹp nhất của chúng ta
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="couplesStore.isLoading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
        <p class="text-body-1 mt-4">Đang tải thông tin cặp đôi...</p>
      </div>

      <!-- Not Connected - Show Invitation System -->
      <div v-else-if="!couplesStore.isConnected" class="max-width-800 mx-auto">
        <!-- Connection Status Card -->
        <v-card rounded="xl" elevation="2" class="mb-6">
          <v-card-text class="pa-8 text-center">
            <v-icon size="100" color="grey-lighten-2" class="mb-4">mdi-heart-broken-outline</v-icon>
            <h3 class="text-h5 font-weight-medium mb-2">Chưa Kết Nối Với Người Yêu</h3>
            <p class="text-body-1 text-medium-emphasis mb-6">
              Kết nối với người yêu để bắt đầu chia sẻ những khoảnh khắc đẹp nhất
            </p>
          </v-card-text>
        </v-card>

        <!-- Invitation Actions -->
        <v-row>
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="1" class="h-100">
              <v-card-text class="pa-6 text-center">
                <v-icon size="48" color="primary" class="mb-4">mdi-email-send-outline</v-icon>
                <h4 class="text-h6 font-weight-medium mb-2">Gửi Lời Mời</h4>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Gửi lời mời kết nối đến người yêu của bạn
                </p>
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  rounded="xl"
                  block
                  @click="openInvitationDialog"
                >
                  <v-icon start>mdi-plus</v-icon>
                  Gửi Lời Mời
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card rounded="xl" elevation="1" class="h-100">
              <v-card-text class="pa-6 text-center">
                <v-icon size="48" color="green" class="mb-4">mdi-email-receive-outline</v-icon>
                <h4 class="text-h6 font-weight-medium mb-2">Lời Mời Nhận Được</h4>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Xem các lời mời kết nối đã nhận
                </p>
                <v-btn
                  color="green"
                  variant="elevated"
                  size="large"
                  rounded="xl"
                  block
                  @click="openViewInvitationsDialog"
                >
                  <v-icon start>mdi-email-check</v-icon>
                  Xem Lời Mời
                  <v-badge 
                    v-if="invitationsStore.pendingReceivedInvitations.length > 0"
                    :content="invitationsStore.pendingReceivedInvitations.length"
                    color="error"
                    floating
                  />
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Pending Invitations Summary -->
        <v-card v-if="invitationsStore.totalPendingCount > 0" rounded="xl" elevation="1" class="mt-6">
          <v-card-text class="pa-6">
            <h4 class="text-h6 font-weight-medium mb-4">
              <v-icon color="orange" class="mr-2">mdi-clock-outline</v-icon>
              Lời Mời Đang Chờ
            </h4>
            <v-row>
              <v-col cols="12" md="6" v-if="invitationsStore.pendingReceivedInvitations.length > 0">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-green mb-1">
                    {{ invitationsStore.pendingReceivedInvitations.length }}
                  </div>
                  <div class="text-body-2">Lời mời nhận được</div>
                </div>
              </v-col>
              <v-col cols="12" md="6" v-if="invitationsStore.pendingSentInvitations.length > 0">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-blue mb-1">
                    {{ invitationsStore.pendingSentInvitations.length }}
                  </div>
                  <div class="text-body-2">Lời mời đã gửi</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>

      <!-- Connected - Show Couple Dashboard -->
      <div v-else>
        <!-- Couple Info Header -->
        <v-card rounded="xl" elevation="2" class="mb-6">
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-avatar size="60" class="mr-4">
                  <v-img v-if="couplesStore.partner?.photoURL" :src="couplesStore.partner.photoURL" />
                  <v-icon v-else size="30">mdi-account</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h5 font-weight-medium">
                    {{ couplesStore.partner?.name || 'Người Yêu' }}
                  </h3>
                  <p class="text-body-2 text-medium-emphasis">
                    {{ couplesStore.daysTogether }} ngày bên nhau
                  </p>
                  <v-chip 
                    :color="getStatusColor(couplesStore.coupleStatus?.status)"
                    size="small"
                    class="mt-1"
                  >
                    {{ getStatusText(couplesStore.coupleStatus?.status) }}
                  </v-chip>
                </div>
              </div>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                </template>
                <v-list>
                  <v-list-item @click="openPreferencesDialog">
                    <v-list-item-title>
                      <v-icon start>mdi-cog</v-icon>
                      Cài Đặt
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="showDisconnectDialog = true" class="text-error">
                    <v-list-item-title>
                      <v-icon start>mdi-link-off</v-icon>
                      Ngắt Kết Nối
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-card-text>
        </v-card>

        <!-- Stats Cards -->
        <v-row class="mb-8">
          <v-col cols="12" md="3" v-for="stat in statsCards" :key="stat.title">
            <v-card 
              :color="stat.color"
              variant="tonal"
              rounded="xl"
              class="love-stat-card"
            >
              <v-card-text class="pa-6 text-center">
                <v-icon :color="stat.color" size="48" class="mb-3">
                  {{ stat.icon }}
                </v-icon>
                <div class="text-h3 font-weight-bold mb-2" :class="`text-${stat.color}`">
                  {{ stat.value }}
                </div>
                <div class="text-body-1">
                  {{ stat.title }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Quick Actions -->
        <v-card rounded="xl" elevation="1" class="mb-6">
          <v-card-text class="pa-6">
            <h4 class="text-h6 font-weight-medium mb-4">
              <v-icon color="primary" class="mr-2">mdi-lightning-bolt</v-icon>
              Hành Động Nhanh
            </h4>
            <v-row>
              <v-col cols="6" md="3">
                <v-btn
                  color="pink"
                  variant="elevated"
                  size="large"
                  rounded="xl"
                  block
                  @click="goToMemories"
                >
                  <v-icon start>mdi-camera-outline</v-icon>
                  Kỷ Niệm
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  color="orange"
                  variant="elevated"
                  size="large"
                  rounded="xl"
                  block
                  @click="goToNotes"
                >
                  <v-icon start>mdi-note-text-outline</v-icon>
                  Ghi Chú
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  color="green"
                  variant="elevated"
                  size="large"
                  rounded="xl"
                  block
                  @click="goToAnniversaries"
                >
                  <v-icon start>mdi-calendar-heart</v-icon>
                  Ngày Đặc Biệt
                </v-btn>
              </v-col>
              <v-col cols="6" md="3">
                <v-btn
                  color="purple"
                  variant="elevated"
                  size="large"
                  rounded="xl"
                  block
                  @click="goToReminders"
                >
                  <v-icon start>mdi-bell-outline</v-icon>
                  Nhắc Nhở
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-container>

    <!-- Invitations Management Dialog -->
    <InvitationsDialog 
      v-model="showInvitationsDialog"
      @invitation-accepted="handleInvitationAccepted"
    />

    <!-- Couple Preferences Dialog -->
    <CouplePreferencesDialog 
      v-model="showPreferencesDialog"
      :preferences="couplesStore.preferences"
      @updated="handlePreferencesUpdated"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCouplesStore } from '@/stores/couples'
import { useCoupleInvitationsStore } from '@/stores/coupleInvitations'
import { useDialogsStore } from '@/stores/dialogs'
import type { CreateInvitationData } from '@/services/coupleInvitations'
import InvitationsDialog from '@/components/InvitationsDialog.vue'
import CouplePreferencesDialog from '@/components/CouplePreferencesDialog.vue'

const router = useRouter()
const couplesStore = useCouplesStore()
const invitationsStore = useCoupleInvitationsStore()
const dialogsStore = useDialogsStore()

// Dialog states - keeping some for compatibility
const showSendInvitationDialog = ref(false)
const showInvitationsDialog = ref(false)
const showPreferencesDialog = ref(false)
const showDisconnectDialog = ref(false)

// Form data
const invitationData = ref<CreateInvitationData>({
  receiverEmail: '',
  message: ''
})

// Form validation
const emailRules = [
  (v: string) => !!v || 'Email là bắt buộc',
  (v: string) => /.+@.+\..+/.test(v) || 'Email không hợp lệ'
]

// Computed
const statsCards = computed(() => [
  {
    title: 'Ngày Bên Nhau',
    value: couplesStore.daysTogether || 0,
    icon: 'mdi-heart',
    color: 'pink'
  },
  {
    title: 'Kỷ Niệm',
    value: couplesStore.coupleStats?.memoriesCount || 0,
    icon: 'mdi-camera-outline',
    color: 'purple'
  },
  {
    title: 'Ghi Chú',
    value: couplesStore.coupleStats?.notesCount || 0,
    icon: 'mdi-note-text-outline',
    color: 'orange'
  },
  {
    title: 'Ngày Đặc Biệt',
    value: couplesStore.coupleStats?.anniversariesCount || 0,
    icon: 'mdi-calendar-heart',
    color: 'green'
  }
])

// Methods
const getStatusColor = (status?: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'pending': return 'warning'
    case 'inactive': return 'error'
    default: return 'grey'
  }
}

const getStatusText = (status?: string) => {
  switch (status) {
    case 'active': return 'Hoạt động'
    case 'pending': return 'Đang chờ'
    case 'inactive': return 'Không hoạt động'
    default: return 'Không xác định'
  }
}

const sendInvitation = async () => {
  try {
    await invitationsStore.sendInvitation(invitationData.value)
    showSendInvitationDialog.value = false
    invitationData.value = { receiverEmail: '', message: '' }
    // Show success message
  } catch (error) {
    // Error is handled in the store
  }
}

const handleInvitationAccepted = async () => {
  // Refresh couple data after accepting invitation
  await couplesStore.fetchAll()
  showInvitationsDialog.value = false
}

const handlePreferencesUpdated = () => {
  showPreferencesDialog.value = false
}

const disconnectFromPartner = async () => {
  try {
    await couplesStore.disconnect()
    showDisconnectDialog.value = false
  } catch (error) {
    // Error is handled in the store
  }
}

// Dialog methods - hybrid approach (local + global)
const openInvitationDialog = () => {
  // For now use local dialog, can switch to global later
  showSendInvitationDialog.value = true
  // Future: dialogsStore.openInvitationsDialog()
}

const openViewInvitationsDialog = () => {
  showInvitationsDialog.value = true
  // Future: dialogsStore.openInvitationsDialog()
}

const openPreferencesDialog = () => {
  showPreferencesDialog.value = true
  // Future: dialogsStore.openCouplePreferencesDialog()
}

const confirmDisconnect = () => {
  dialogsStore.openConfirmDialog({
    title: 'Xác Nhận Ngắt Kết Nối',
    message: 'Bạn có chắc chắn muốn ngắt kết nối với người yêu không? Dữ liệu chung sẽ không bị xóa và có thể kết nối lại sau.',
    confirmText: 'Ngắt Kết Nối',
    cancelText: 'Hủy',
    onConfirm: async () => {
      try {
        await couplesStore.disconnect()
        dialogsStore.openAlertDialog({
          title: 'Thành công',
          message: 'Đã ngắt kết nối thành công!'
        })
      } catch (error) {
        dialogsStore.openAlertDialog({
          title: 'Lỗi',
          message: 'Có lỗi xảy ra khi ngắt kết nối. Vui lòng thử lại.'
        })
      }
    }
  })
}

// Navigation methods
const goToMemories = () => router.push('/memories')
const goToNotes = () => router.push('/notes')
const goToAnniversaries = () => router.push('/anniversaries')
const goToReminders = () => router.push('/reminders')

onMounted(async () => {
  await Promise.all([
    couplesStore.fetchAll(),
    invitationsStore.fetchAllInvitations()
  ])
})
</script>

<style scoped lang="scss">
.couples-view {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(var(--v-theme-primary), 0.05) 0%, 
    rgba(var(--v-theme-secondary), 0.03) 50%,
    rgba(var(--v-theme-accent), 0.02) 100%
  );
}

.max-width-800 {
  max-width: 800px;
}

.love-stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 960px) {
  .love-stat-card:hover {
    transform: translateY(-2px);
  }
}

@media (max-width: 600px) {
  .love-stat-card:hover {
    transform: none;
  }
}
</style>