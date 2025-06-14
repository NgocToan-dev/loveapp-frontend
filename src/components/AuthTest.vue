<template>
  <v-card class="mx-auto" max-width="600" title="Authentication Test">
    <v-card-text>
      <!-- Login Form -->
      <v-form v-if="!authStore.isAuthenticated" @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          required
          :disabled="authStore.isLoading"
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          required
          :disabled="authStore.isLoading"
        />
        <v-btn
          type="submit"
          color="primary"
          :loading="authStore.isLoading"
          block
        >
          Login
        </v-btn>
      </v-form>

      <!-- User Info -->
      <div v-else>
        <v-alert type="success" class="mb-4">
          Successfully logged in!
        </v-alert>
        
        <v-card variant="outlined" class="mb-4">
          <v-card-title>User Information</v-card-title>
          <v-card-text>
            <div><strong>ID:</strong> {{ authStore.user?.id }}</div>
            <div><strong>Email:</strong> {{ authStore.user?.email }}</div>
            <div><strong>Name:</strong> {{ authStore.user?.name }}</div>
            <div><strong>Role:</strong> {{ authStore.user?.role }}</div>
            <div><strong>Email Verified:</strong> {{ authStore.user?.isEmailVerified ? 'Yes' : 'No' }}</div>
            <div><strong>Created:</strong> {{ formatDate(authStore.user?.createdAt) }}</div>
            <div><strong>Last Login:</strong> {{ formatDate(authStore.user?.lastLoginAt) }}</div>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-4">
          <v-card-title>Token Information</v-card-title>
          <v-card-text>
            <div><strong>Has Tokens:</strong> {{ tokenInfo.hasTokens ? 'Yes' : 'No' }}</div>
            <div><strong>Token Expired:</strong> {{ tokenInfo.isExpired ? 'Yes' : 'No' }}</div>
            <div><strong>Expires At:</strong> {{ formatDate(tokenInfo.expiresAt) }}</div>
          </v-card-text>
        </v-card>

        <v-row>
          <v-col>
            <v-btn
              color="secondary"
              @click="refreshTokens"
              :loading="refreshing"
              block
            >
              Refresh Tokens
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              color="error"
              @click="handleLogout"
              :loading="authStore.isLoading"
              block
            >
              Logout
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Error Display -->
      <v-alert
        v-if="authStore.error"
        type="error"
        class="mt-4"
        dismissible
        @click:close="authStore.clearError"
      >
        {{ authStore.error }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Form data
const email = ref('pntoan@gmail.com')
const password = ref('')
const refreshing = ref(false)

// Token info
const tokenInfo = computed(() => authStore.getTokensInfo())

// Methods
const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
    console.log('Login successful:', authStore.user)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    console.log('Logout successful')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const refreshTokens = async () => {
  refreshing.value = true
  try {
    const success = await authStore.refreshTokens()
    console.log('Token refresh:', success ? 'successful' : 'failed')
  } catch (error) {
    console.error('Token refresh failed:', error)
  } finally {
    refreshing.value = false
  }
}

const formatDate = (date: string | Date | undefined | null) => {
  if (!date) return 'N/A'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString()
}

// Initialize auth on component mount
onMounted(() => {
  authStore.initializeAuth()
})
</script>