<template>
  <v-container class="py-8">
    <div class="text-center mb-8">
      <h1 class="text-h3 font-weight-bold mb-3">
        <v-icon size="40" color="primary" class="me-3">mdi-bell-plus</v-icon>
        Create Reminder
      </h1>
      <p class="text-h6 text-medium-emphasis">
        Set a reminder for important moments
      </p>
    </div>

    <v-row justify="center">
      <v-col cols="12" lg="8" xl="6">
        <CreateReminderDialog 
          :open="true" 
          @close="handleClose"
          @reminder-created="handleReminderCreated"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import CreateReminderDialog from '@/components/CreateReminderDialog.vue'

const router = useRouter()

const handleClose = () => {
  router.push('/reminders')
}

const handleReminderCreated = () => {
  router.push('/reminders')
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  padding-top: 2rem;
}
</style>
