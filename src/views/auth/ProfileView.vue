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
</script>

<template>
  <v-container class="pa-6">
    <div class="mb-6">
      <h1 class="text-h3 font-weight-bold text-primary mb-2">
        {{ t('auth.profile.title') }}
      </h1>
      <p class="text-h6 text-medium-emphasis">
        {{ t('auth.profile.subtitle') }}
      </p>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            {{ t('auth.profile.accountInfo') }}
          </v-card-title>

          <v-form @submit.prevent="handleUpdateProfile">
            <v-text-field
              v-model="form.displayName"
              :label="t('auth.displayName')"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              class="mb-4"
            />

            <v-text-field
              v-model="form.email"
              :label="t('auth.email')"
              variant="outlined"
              prepend-inner-icon="mdi-email"
              class="mb-4"
              readonly
            />

            <v-textarea
              v-model="form.bio"
              label="Tiểu sử"
              variant="outlined"
              prepend-inner-icon="mdi-text"
              class="mb-4"
              rows="3"
            />

            <v-text-field
              v-model="form.dateOfBirth"
              label="Ngày sinh"
              type="date"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              class="mb-4"
            />

            <v-select
              v-model="form.gender"
              :items="genderOptions"
              label="Giới tính"
              variant="outlined"
              prepend-inner-icon="mdi-gender-male-female"
              class="mb-4"
            />

            <v-text-field
              v-model="form.relationshipStartDate"
              label="Ngày bắt đầu mối quan hệ"
              type="date"
              variant="outlined"
              prepend-inner-icon="mdi-heart"
              class="mb-4"
              hint="Ngày này sẽ được sử dụng để tính số ngày bên nhau"
              persistent-hint
            />

            <v-btn
              type="submit"
              color="primary"
              variant="elevated"
              :loading="isLoading"
              class="mb-4"
            >
              {{ t('auth.profile.updateProfile') }}
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            {{ t('auth.profile.accountActions') }}
          </v-card-title>

          <div class="d-flex flex-column gap-3">
            <v-btn
              color="error"
              variant="outlined"
              prepend-icon="mdi-logout"
              @click="handleLogout"
            >
              {{ t('nav.logout') }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Relationship Info -->
    <v-row v-if="form.relationshipStartDate">
      <v-col cols="12">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon icon="mdi-heart" class="mr-2" color="pink"></v-icon>
            Thông tin mối quan hệ
          </v-card-title>
          
          <v-row>
            <v-col cols="12" md="4">
              <v-card variant="tonal" color="pink">
                <v-card-text class="text-center">
                  <div class="text-h4 font-weight-bold text-pink mb-2">
                    {{ daysSinceStart }}
                  </div>
                  <div class="text-body-1">
                    Ngày bên nhau
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-card variant="tonal" color="purple">
                <v-card-text class="text-center">
                  <div class="text-h4 font-weight-bold text-purple mb-2">
                    {{ monthsSinceStart }}
                  </div>
                  <div class="text-body-1">
                    Tháng yêu nhau
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-card variant="tonal" color="orange">
                <v-card-text class="text-center">
                  <div class="text-h4 font-weight-bold text-orange mb-2">
                    {{ yearsSinceStart }}
                  </div>
                  <div class="text-body-1">
                    Năm gắn bó
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="text-center">
            <div class="text-body-1 text-medium-emphasis mb-2">
              Bắt đầu từ ngày
            </div>
            <div class="text-h6 font-weight-medium">
              {{ formatStartDate }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>