<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()

const form = reactive({
  displayName: authStore.user?.displayName || '',
  email: authStore.user?.email || ''
})

const isLoading = ref(false)

async function handleUpdateProfile() {
  isLoading.value = true
  try {
    await authStore.updateProfile({ displayName: form.displayName })
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
        Profile
      </h1>
      <p class="text-h6 text-medium-emphasis">
        Manage your account settings
      </p>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            Account Information
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

            <v-btn
              type="submit"
              color="primary"
              variant="elevated"
              :loading="isLoading"
              class="mb-4"
            >
              Update Profile
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-6" elevation="2">
          <v-card-title class="text-h5 font-weight-bold mb-4">
            Account Actions
          </v-card-title>

          <div class="d-flex flex-column gap-3">
            <v-btn
              color="error"
              variant="outlined"
              prepend-icon="mdi-logout"
              @click="handleLogout"
            >
              Logout
            </v-btn>
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