<template>
  <v-dialog v-model="dialog" max-width="600" scrollable>
    <v-card rounded="xl">
      <v-card-title class="text-h5 font-weight-bold pa-6">
        <v-icon color="primary" class="mr-2">mdi-cog</v-icon>
        Cài Đặt Cặp Đôi
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="preferencesForm" @submit.prevent="updatePreferences">
          <!-- Notifications Section -->
          <div class="mb-6">
            <h4 class="text-h6 font-weight-medium mb-4">
              <v-icon color="orange" class="mr-2">mdi-bell</v-icon>
              Thông Báo
            </h4>
            <v-card variant="outlined" rounded="lg" class="pa-4">
              <v-switch
                v-model="localPreferences.notifications.email"
                label="Thông báo qua Email"
                color="primary"
                hide-details
                class="mb-2"
              />
              <v-switch
                v-model="localPreferences.notifications.push"
                label="Thông báo đẩy"
                color="primary"
                hide-details
                class="mb-2"
              />
              <v-switch
                v-model="localPreferences.notifications.anniversaries"
                label="Nhắc nhở ngày đặc biệt"
                color="primary"
                hide-details
                class="mb-2"
              />
              <v-switch
                v-model="localPreferences.notifications.reminders"
                label="Nhắc nhở công việc"
                color="primary"
                hide-details
              />
            </v-card>
          </div>

          <!-- Privacy Section -->
          <div class="mb-6">
            <h4 class="text-h6 font-weight-medium mb-4">
              <v-icon color="blue" class="mr-2">mdi-shield-account</v-icon>
              Quyền Riêng Tư
            </h4>
            <v-card variant="outlined" rounded="lg" class="pa-4">
              <v-select
                v-model="localPreferences.privacy.profileVisibility"
                :items="profileVisibilityOptions"
                label="Hiển thị hồ sơ"
                variant="outlined"
                hide-details
                class="mb-4"
              />
              <v-switch
                v-model="localPreferences.privacy.shareMemories"
                label="Chia sẻ kỷ niệm với đối tác"
                color="primary"
                hide-details
                class="mb-2"
              />
              <v-switch
                v-model="localPreferences.privacy.shareNotes"
                label="Chia sẻ ghi chú với đối tác"
                color="primary"
                hide-details
              />
            </v-card>
          </div>

          <!-- General Settings Section -->
          <div class="mb-6">
            <h4 class="text-h6 font-weight-medium mb-4">
              <v-icon color="green" class="mr-2">mdi-cog-outline</v-icon>
              Cài Đặt Chung
            </h4>
            <v-card variant="outlined" rounded="lg" class="pa-4">
              <v-select
                v-model="localPreferences.timezone"
                :items="timezoneOptions"
                label="Múi giờ"
                variant="outlined"
                hide-details
                class="mb-4"
              />
              <v-select
                v-model="localPreferences.language"
                :items="languageOptions"
                label="Ngôn ngữ"
                variant="outlined"
                hide-details
                class="mb-4"
              />
              <v-select
                v-model="localPreferences.theme"
                :items="themeOptions"
                label="Giao diện"
                variant="outlined"
                hide-details
              />
            </v-card>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn
          variant="text"
          @click="dialog = false"
        >
          Hủy
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="isLoading"
          @click="updatePreferences"
        >
          <v-icon start>mdi-content-save</v-icon>
          Lưu Cài Đặt
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CouplePreferences } from '@/services/couples'

const props = defineProps<{
  modelValue: boolean
  preferences?: CouplePreferences | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'updated': [preferences: CouplePreferences]
}>()

const isLoading = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Default preferences
const defaultPreferences: CouplePreferences = {
  timezone: 'Asia/Ho_Chi_Minh',
  notifications: {
    email: true,
    push: true,
    anniversaries: true,
    reminders: true
  },
  privacy: {
    profileVisibility: 'private',
    shareMemories: true,
    shareNotes: true
  },
  theme: 'system',
  language: 'vi'
}

const localPreferences = ref<CouplePreferences>({ ...defaultPreferences })

// Options
const profileVisibilityOptions = [
  { title: 'Công khai', value: 'public' },
  { title: 'Riêng tư', value: 'private' }
]

const timezoneOptions = [
  { title: 'Việt Nam (UTC+7)', value: 'Asia/Ho_Chi_Minh' },
  { title: 'Singapore (UTC+8)', value: 'Asia/Singapore' },
  { title: 'Japan (UTC+9)', value: 'Asia/Tokyo' },
  { title: 'UTC', value: 'UTC' }
]

const languageOptions = [
  { title: 'Tiếng Việt', value: 'vi' },
  { title: 'English', value: 'en' }
]

const themeOptions = [
  { title: 'Tự động', value: 'system' },
  { title: 'Sáng', value: 'light' },
  { title: 'Tối', value: 'dark' }
]

// Watch for preferences changes
watch(() => props.preferences, (newPreferences) => {
  if (newPreferences) {
    localPreferences.value = { ...defaultPreferences, ...newPreferences }
  } else {
    localPreferences.value = { ...defaultPreferences }
  }
}, { immediate: true, deep: true })

const updatePreferences = async () => {
  try {
    isLoading.value = true
    emit('updated', localPreferences.value)
  } catch (error) {
    console.error('Error updating preferences:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.v-card.v-card--outlined {
  background: rgba(var(--v-theme-surface), 0.8);
}
</style>