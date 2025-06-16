<template>
  <v-alert
    v-if="showAlert"
    type="warning"
    closable
    class="ma-4"
    elevation="2"
    @click:close="showAlert = false"
  >
    <template #title>
      <v-icon icon="mdi-server-network-off" class="mr-2"></v-icon>
      Backend Server Offline
    </template>
    <div>
      <p class="mb-2">
        Backend server is not available at <strong>{{ apiUrl }}</strong>
      </p>
      <p class="mb-2">
        Please make sure the backend server is running and accessible.
      </p>
      <v-btn
        variant="outlined"
        size="small"
        @click="retryConnection"
        :loading="retrying"
      >
        <v-icon icon="mdi-refresh" class="mr-1"></v-icon>
        Retry Connection
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showAlert = ref(true)
const retrying = ref(false)

const apiUrl = computed(() => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
})

const retryConnection = async () => {
  retrying.value = true
  try {
    await authStore.checkAuthStatus()
    showAlert.value = false
  } catch (error) {
    console.error('Retry failed:', error)
  } finally {
    retrying.value = false
  }
}
</script> 