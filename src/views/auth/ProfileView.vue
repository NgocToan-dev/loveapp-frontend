<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

const { t } = useI18n()
const authStore = useAuthStore()

const form = reactive({
  displayName: authStore.user?.displayName || '',
  email: authStore.user?.email || '',
  bio: authStore.user?.bio || '',
  dateOfBirth: authStore.user?.dateOfBirth || '',
  gender: authStore.user?.gender || '',
  relationshipStartDate: authStore.user?.relationshipStartDate || ''
})

const genderOptions = [
  { title: 'Nam', value: 'male' },
  { title: 'Nữ', value: 'female' },
  { title: 'Khác', value: 'other' }
]

const isLoading = ref(false)

// Computed properties for relationship info
const daysSinceStart = computed(() => {
  if (!form.relationshipStartDate) return 0
  const startDate = dayjs(form.relationshipStartDate)
  const today = dayjs()
  return today.diff(startDate, 'day')
})

const monthsSinceStart = computed(() => {
  if (!form.relationshipStartDate) return 0
  const startDate = dayjs(form.relationshipStartDate)
  const today = dayjs()
  return today.diff(startDate, 'month')
})

const yearsSinceStart = computed(() => {
  if (!form.relationshipStartDate) return 0
  const startDate = dayjs(form.relationshipStartDate)
  const today = dayjs()
  return parseFloat(today.diff(startDate, 'year', true).toFixed(1))
})

const formatStartDate = computed(() => {
  if (!form.relationshipStartDate) return ''
  return dayjs(form.relationshipStartDate).format('DD/MM/YYYY')
})

// Profile completion
const profileCompletion = computed(() => {
  let completed = 0
  const total = 6
  
  if (form.displayName) completed++
  if (form.bio) completed++
  if (form.dateOfBirth) completed++
  if (form.gender) completed++
  if (form.relationshipStartDate) completed++
  if (authStore.user?.photoURL) completed++
  
  return Math.round((completed / total) * 100)
})

const completionTips = computed(() => [
  { text: 'Thêm ảnh đại diện', completed: !!authStore.user?.photoURL },
  { text: 'Viết giới thiệu bản thân', completed: !!form.bio },
  { text: 'Cập nhật ngày sinh', completed: !!form.dateOfBirth },
  { text: 'Chọn giới tính', completed: !!form.gender },
  { text: 'Thêm ngày bắt đầu yêu', completed: !!form.relationshipStartDate }
])

async function handleUpdateProfile() {
  isLoading.value = true
  try {
    await authStore.updateProfile({ 
      displayName: form.displayName,
      bio: form.bio,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender as 'male' | 'female' | 'other',
      relationshipStartDate: form.relationshipStartDate
    })
  } catch (error) {
    console.error('Profile update failed:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
}

function handleAvatarUpload() {
  // TODO: Implement avatar upload functionality
  console.log('Avatar upload clicked')
}

function handleChangePassword() {
  // TODO: Implement change password functionality
  console.log('Change password clicked')
}

function handlePrivacySettings() {
  // TODO: Implement privacy settings functionality
  console.log('Privacy settings clicked')
}
</script>

<template>
  <div class="profile-view">
    <v-container class="py-8">
      <!-- Header Section -->
      <div class="profile-header text-center mb-8">
        <div class="hero-background">
          <div class="floating-hearts">
            <div class="heart" v-for="n in 5" :key="n"></div>
          </div>
        </div>
        <div class="profile-avatar-section mb-6">
          <v-avatar size="120" class="profile-avatar elevation-4">
            <v-img
              v-if="authStore.user?.photoURL"
              :src="authStore.user.photoURL"
              :alt="authStore.user?.displayName"
            />
            <v-icon v-else size="60" color="primary">mdi-account-circle</v-icon>
          </v-avatar>
          <v-btn
            icon="mdi-camera"
            size="small"
            color="primary"
            class="avatar-edit-btn elevation-2"
            @click="handleAvatarUpload"
          />
        </div>
        <h1 class="text-h3 font-weight-bold gradient-text mb-2">
          {{ authStore.user?.displayName || 'Người dùng' }}
        </h1>
        <p class="text-h6 text-medium-emphasis mb-4">
          {{ authStore.user?.email }}
        </p>
        <v-chip
          v-if="authStore.user?.bio"
          color="primary"
          variant="tonal"
          class="ma-1"
        >
          <v-icon start>mdi-heart</v-icon>
          {{ authStore.user.bio }}
        </v-chip>
      </div>

      <!-- Quick Stats -->
      <v-row v-if="form.relationshipStartDate" class="mb-6">
        <v-col cols="12">
          <v-card class="stats-card overflow-hidden" elevation="0" rounded="xl">
            <v-card-text class="pa-6">
              <div class="text-center mb-4">
                <h3 class="text-h5 font-weight-bold mb-2">
                  <v-icon color="pink" class="me-2">mdi-heart-multiple</v-icon>
                  Hành trình tình yêu
                </h3>
                <p class="text-body-2 text-medium-emphasis">
                  Bắt đầu từ ngày {{ formatStartDate }}
                </p>
              </div>
              
              <v-row>
                <v-col cols="12" sm="4">
                  <div class="stat-item">
                    <div class="stat-circle days">
                      <div class="stat-number">{{ daysSinceStart }}</div>
                      <div class="stat-label">Ngày</div>
                    </div>
                  </div>
                </v-col>
                
                <v-col cols="12" sm="4">
                  <div class="stat-item">
                    <div class="stat-circle months">
                      <div class="stat-number">{{ monthsSinceStart }}</div>
                      <div class="stat-label">Tháng</div>
                    </div>
                  </div>
                </v-col>
                
                <v-col cols="12" sm="4">
                  <div class="stat-item">
                    <div class="stat-circle years">
                      <div class="stat-number">{{ yearsSinceStart }}</div>
                      <div class="stat-label">Năm</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Content -->
      <v-row>
        <!-- Profile Information -->
        <v-col cols="12" lg="8">
          <v-card class="profile-form-card" elevation="0" rounded="xl">
            <v-card-title class="pa-6 pb-2">
              <div class="d-flex align-center">
                <v-icon size="28" color="primary" class="me-3">mdi-account-edit</v-icon>
                <span class="text-h5 font-weight-bold">Thông tin cá nhân</span>
              </div>
            </v-card-title>

            <v-card-text class="pa-6 pt-4">
              <v-form @submit.prevent="handleUpdateProfile">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.displayName"
                      label="Tên hiển thị"
                      variant="outlined"
                      prepend-inner-icon="mdi-account"
                      class="mb-4"
                      rounded="lg"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.email"
                      label="Email"
                      variant="outlined"
                      prepend-inner-icon="mdi-email"
                      class="mb-4"
                      readonly
                      rounded="lg"
                      hint="Email không thể thay đổi"
                      persistent-hint
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-textarea
                      v-model="form.bio"
                      label="Giới thiệu bản thân"
                      variant="outlined"
                      prepend-inner-icon="mdi-text"
                      class="mb-4"
                      rows="3"
                      rounded="lg"
                      hint="Chia sẻ một chút về bản thân bạn"
                      persistent-hint
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.dateOfBirth"
                      label="Ngày sinh"
                      type="date"
                      variant="outlined"
                      prepend-inner-icon="mdi-calendar"
                      class="mb-4"
                      rounded="lg"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form.gender"
                      :items="genderOptions"
                      label="Giới tính"
                      variant="outlined"
                      prepend-inner-icon="mdi-gender-male-female"
                      class="mb-4"
                      rounded="lg"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.relationshipStartDate"
                      label="Ngày bắt đầu mối quan hệ"
                      type="date"
                      variant="outlined"
                      prepend-inner-icon="mdi-heart"
                      class="mb-4"
                      rounded="lg"
                      hint="Ngày này sẽ được sử dụng để tính toán thời gian yêu nhau"
                      persistent-hint
                    />
                  </v-col>
                </v-row>

                <div class="text-center mt-4">
                  <v-btn
                    type="submit"
                    color="primary"
                    variant="elevated"
                    :loading="isLoading"
                    size="large"
                    rounded="lg"
                    prepend-icon="mdi-content-save"
                    class="px-8"
                  >
                    Cập nhật thông tin
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Side Panel -->
        <v-col cols="12" lg="4">
          <!-- Account Actions -->
          <v-card class="profile-actions-card mb-4" elevation="0" rounded="xl">
            <v-card-title class="pa-6 pb-2">
              <div class="d-flex align-center">
                <v-icon size="28" color="secondary" class="me-3">mdi-cog</v-icon>
                <span class="text-h6 font-weight-bold">Cài đặt tài khoản</span>
              </div>
            </v-card-title>

            <v-card-text class="pa-6 pt-4">
              <div class="d-flex flex-column">
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-key"
                  class="mb-3"
                  rounded="lg"
                  @click="handleChangePassword"
                >
                  Đổi mật khẩu
                </v-btn>
                
                <v-btn
                  color="orange"
                  variant="outlined"
                  prepend-icon="mdi-account-settings"
                  class="mb-3"
                  rounded="lg"
                  @click="handlePrivacySettings"
                >
                  Cài đặt riêng tư
                </v-btn>
                
                <v-btn
                  color="error"
                  variant="outlined"
                  prepend-icon="mdi-logout"
                  rounded="lg"
                  @click="handleLogout"
                >
                  Đăng xuất
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Profile Completion -->
          <v-card class="completion-card" elevation="0" rounded="xl">
            <v-card-title class="pa-6 pb-2">
              <div class="d-flex align-center">
                <v-icon size="28" color="success" class="me-3">mdi-progress-check</v-icon>
                <span class="text-h6 font-weight-bold">Hoàn thiện hồ sơ</span>
              </div>
            </v-card-title>

            <v-card-text class="pa-6 pt-4">
              <div class="completion-info mb-4">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-2">Tiến độ hoàn thành</span>
                  <span class="text-body-2 font-weight-bold">{{ profileCompletion }}%</span>
                </div>
                <v-progress-linear
                  :model-value="profileCompletion"
                  color="success"
                  rounded
                  height="8"
                />
              </div>
              
              <div class="completion-tips">
                <div class="text-body-2 text-medium-emphasis mb-2">
                  Để hoàn thiện hồ sơ:
                </div>
                <div v-for="tip in completionTips" :key="tip.text" class="d-flex align-center mb-1">
                  <v-icon 
                    :color="tip.completed ? 'success' : 'grey'" 
                    size="16" 
                    class="me-2"
                  >
                    {{ tip.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                  </v-icon>
                  <span class="text-caption" :class="tip.completed ? 'text-success' : ''">
                    {{ tip.text }}
                  </span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.profile-view {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(var(--v-theme-primary), 0.02) 0%, 
    rgba(var(--v-theme-secondary), 0.01) 100%);
}

.profile-header {
  position: relative;
  padding: 2rem 0;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(135deg, 
    rgba(var(--v-theme-primary), 0.05) 0%, 
    rgba(var(--v-theme-secondary), 0.03) 100%);
}

.floating-hearts {
  position: absolute;
  width: 100%;
  height: 100%;
}

.heart {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(var(--v-theme-primary), 0.1);
  transform: rotate(-45deg);
  animation: float 6s ease-in-out infinite;
  
  &:before,
  &:after {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(var(--v-theme-primary), 0.1);
    border-radius: 50%;
    transform: rotate(-45deg);
  }
  
  &:before {
    transform-origin: 0 100%;
  }
  
  &:after {
    transform-origin: 100% 100%;
    left: -10px;
  }
  
  &:nth-child(1) {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 20%;
    right: 15%;
    animation-delay: 1s;
  }
  
  &:nth-child(3) {
    bottom: 25%;
    left: 20%;
    animation-delay: 2s;
  }
  
  &:nth-child(4) {
    bottom: 15%;
    right: 10%;
    animation-delay: 3s;
  }
  
  &:nth-child(5) {
    top: 50%;
    left: 50%;
    animation-delay: 4s;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(-45deg); }
  50% { transform: translateY(-10px) rotate(-45deg); }
}

.profile-avatar-section {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  border: 4px solid rgba(var(--v-theme-primary), 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    border-color: rgba(var(--v-theme-primary), 0.4);
  }
}

.avatar-edit-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgb(var(--v-theme-primary)) !important;
  
  &:hover {
    transform: scale(1.1);
  }
}

.gradient-text {
  background: linear-gradient(45deg, 
    rgb(var(--v-theme-primary)), 
    rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stats-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.stat-item {
  text-align: center;
  padding: 1rem 0;
}

.stat-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  
  &.days {
    background: linear-gradient(135deg, #ff6b9d, #ff8e8e);
    color: white;
  }
  
  &.months {
    background: linear-gradient(135deg, #a78bfa, #c084fc);
    color: white;
  }
  
  &.years {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: white;
  }
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  margin-top: 4px;
  opacity: 0.9;
}

.profile-form-card,
.profile-actions-card,
.completion-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary), 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
}

.completion-info {
  .v-progress-linear {
    border-radius: 8px;
  }
}

.completion-tips {
  .v-icon {
    transition: all 0.2s ease;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .profile-header {
    padding: 1rem 0;
  }
  
  .profile-avatar {
    width: 80px !important;
    height: 80px !important;
  }
  
  .stat-circle {
    width: 80px;
    height: 80px;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
}

// Form enhancements
.v-text-field,
.v-textarea,
.v-select {
  .v-field {
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.1);
    }
  }
  
  &.v-field--focused .v-field {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
  }
}

// Button enhancements
.v-btn {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
}
</style>