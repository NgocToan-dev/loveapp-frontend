<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Form state
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const isLoading = ref(false)

// Validation rules
const emailRules = [
  (v: string) => !!v || t('validation.required'),
  (v: string) => /.+@.+\..+/.test(v) || t('validation.emailInvalid')
]

const passwordRules = [
  (v: string) => !!v || t('validation.required'),
  (v: string) => v.length >= 6 || t('validation.passwordMinLength')
]

// Submit handler
async function handleSubmit() {
  if (!form.email || !form.password) return

  isLoading.value = true
  
  try {
    await authStore.login(form.email, form.password)
    
    // Redirect to dashboard or intended page
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/dashboard')
  } catch (error) {
    // Error is handled by the store
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}

// Navigate to register
function goToRegister() {
  router.push('/register')
}

// Navigate to forgot password
function goToForgotPassword() {
  router.push('/forgot-password')
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12" rounded="lg">
          <v-card-title class="text-h4 font-weight-bold text-center pa-6">
            <v-icon size="48" color="primary" class="mb-4">
              mdi-account-circle
            </v-icon>
            <div>{{ t('auth.login.title') }}</div>
          </v-card-title>

          <v-card-text class="px-6 pb-6">
            <!-- Error Alert -->
            <v-alert
              v-if="authStore.error"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="authStore.clearError"
            >
              {{ authStore.error }}
            </v-alert>

            <!-- Login Form -->
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="form.email"
                :label="t('auth.email')"
                :rules="emailRules"
                type="email"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                class="mb-4"
                required
              />

              <v-text-field
                v-model="form.password"
                :label="t('auth.password')"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                class="mb-4"
                required
              />

              <v-checkbox
                v-model="form.rememberMe"
                :label="t('auth.rememberMe')"
                class="mb-4"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                variant="elevated"
                block
                :loading="isLoading || authStore.isLoading"
                :disabled="!form.email || !form.password"
                class="mb-4"
              >
                {{ t('auth.login.submit') }}
              </v-btn>
            </v-form>

            <!-- Additional Actions -->
            <div class="text-center">
              <v-btn
                variant="text"
                color="primary"
                @click="goToForgotPassword"
                class="mb-2"
              >
                {{ t('auth.forgotPassword') }}
              </v-btn>
              
              <v-divider class="my-4" />
              
              <p class="text-body-2 text-medium-emphasis mb-2">
                {{ t('auth.noAccount') }}
              </p>
              
              <v-btn
                variant="outlined"
                color="secondary"
                @click="goToRegister"
              >
                {{ t('auth.register.title') }}
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