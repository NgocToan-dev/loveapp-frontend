<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-orange mb-2">
          <v-icon icon="mdi-bell" class="mr-2"></v-icon>
          Reminders
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Manage your important reminders and never miss a moment
        </p>
      </div>
      <v-btn
        color="orange"
        size="large"
        variant="elevated"
        prepend-icon="mdi-bell-plus"
      >
        Create Reminder
      </v-btn>
    </div>

    <v-card>
      <v-card-text class="text-center py-12">
        <v-icon icon="mdi-bell-outline" size="64" color="orange" class="mb-4"></v-icon>
        <h2 class="text-h5 mb-2">Reminders Feature</h2>
        <p class="text-body-1 text-medium-emphasis mb-4">
          This view will display and manage all your reminders.
        </p>
        <v-chip color="orange" variant="tonal">Coming Soon</v-chip>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.text-orange {
  color: rgb(255, 152, 0) !important;
}
</style> 