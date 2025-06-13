<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthService from '@/services/auth'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const isLoading = ref(false)
const success = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value) return

  isLoading.value = true
  error.value = ''
  
  try {
    await AuthService.resetPassword(email.value)
    success.value = true
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
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
              mdi-lock-reset
            </v-icon>
            <div>{{ t('auth.forgotPassword') }}</div>
          </v-card-title>

          <v-card-text class="px-6 pb-6">
            <v-alert v-if="success" type="success" variant="tonal" class="mb-4">
              Password reset email sent! Check your inbox.
            </v-alert>
            
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              {{ error }}
            </v-alert>

            <v-form v-if="!success" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                :label="t('auth.email')"
                type="email"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                class="mb-4"
                required
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                variant="elevated"
                block
                :loading="isLoading"
                class="mb-4"
              >
                Send Reset Email
              </v-btn>
            </v-form>

            <div class="text-center">
              <v-btn variant="text" color="primary" @click="router.push('/login')">
                Back to Login
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