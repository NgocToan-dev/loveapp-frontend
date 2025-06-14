<template>
  <v-card class="ma-4 pa-4">
    <v-card-title>Authentication Debug</v-card-title>
    <v-card-text>
      <div class="mb-4">
        <h3>Auth Store State:</h3>
        <pre>{{ authState }}</pre>
      </div>
      
      <div class="mb-4">
        <h3>Tokens Info:</h3>
        <pre>{{ tokensInfo }}</pre>
      </div>
      
      <div class="mb-4">
        <h3>Current Route:</h3>
        <pre>{{ routeInfo }}</pre>
      </div>
      
      <v-btn @click="refreshAuth" color="primary">
        Refresh Auth
      </v-btn>
      
      <v-btn @click="checkAuth" color="secondary" class="ml-2">
        Check Auth Status
      </v-btn>
      
      <v-btn @click="clearTokens" color="error" class="ml-2">
        Clear Tokens
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import AuthService from '@/services/auth'

const authStore = useAuthStore()
const route = useRoute()

const authState = computed(() => ({
  user: authStore.user,
  isAuthenticated: authStore.isAuthenticated,
  isLoading: authStore.isLoading,
  error: authStore.error
}))

const tokensInfo = computed(() => AuthService.getTokensInfo())

const routeInfo = computed(() => ({
  path: route.path,
  name: route.name,
  meta: route.meta
}))

async function refreshAuth() {
  try {
    const result = await authStore.refreshTokens()
    console.log('Refresh result:', result)
  } catch (error) {
    console.error('Refresh error:', error)
  }
}

async function checkAuth() {
  try {
    const result = await authStore.checkAuthStatus()
    console.log('Check auth result:', result)
  } catch (error) {
    console.error('Check auth error:', error)
  }
}

function clearTokens() {
  localStorage.clear()
  window.location.reload()
}
</script>