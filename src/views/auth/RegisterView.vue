<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  displayName: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

async function handleSubmit() {
  if (!form.email || !form.password || !form.displayName) return
  if (form.password !== form.confirmPassword) return

  isLoading.value = true

  try {
    await authStore.register(form.email, form.password, form.displayName)
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12" rounded="lg">
          <v-card-title class="text-h4 font-weight-bold text-center pa-6">
            <v-icon size="48" color="primary" class="mb-4">
              mdi-account-plus
            </v-icon>
            <div>{{ t('auth.register.title') }}</div>
          </v-card-title>

          <v-card-text class="px-6 pb-6">
            <v-alert v-if="authStore.error" type="error" variant="tonal" class="mb-4" closable
              @click:close="authStore.clearError">
              {{ authStore.error }}
            </v-alert>

            <v-form @submit.prevent="handleSubmit">
              <v-text-field v-model="form.displayName" :label="t('auth.displayName')" variant="outlined"
                prepend-inner-icon="mdi-account" class="mb-4" required />

              <v-text-field v-model="form.email" :label="t('auth.email')" type="email" variant="outlined"
                prepend-inner-icon="mdi-email" class="mb-4" required />

              <v-text-field v-model="form.password" :label="t('auth.password')"
                :type="showPassword ? 'text' : 'password'" variant="outlined" prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword" class="mb-4" required />

              <v-text-field v-model="form.confirmPassword" :label="t('auth.confirmPassword')"
                :type="showConfirmPassword ? 'text' : 'password'" variant="outlined" prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword" class="mb-4" required />

              <v-btn type="submit" color="primary" size="large" variant="elevated" block
                :loading="isLoading || authStore.isLoading" class="mb-4">
                {{ t('auth.register.submit') }}
              </v-btn>
            </v-form>

            <div class="text-center">
              <v-divider class="my-4" />
              <p class="text-body-2 text-medium-emphasis mb-2">
                {{ t('auth.hasAccount') }}
              </p>
              <v-btn variant="outlined" color="secondary" @click="router.push('/login')">
                {{ t('auth.login.title') }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>