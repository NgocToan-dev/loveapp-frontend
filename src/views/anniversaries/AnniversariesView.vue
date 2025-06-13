<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-success mb-2">
          <v-icon icon="mdi-calendar-heart" class="mr-2"></v-icon>
          Anniversaries
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Celebrate your special moments and milestones
        </p>
      </div>
      <v-btn
        color="success"
        size="large"
        variant="elevated"
        prepend-icon="mdi-calendar-plus"
      >
        Create Anniversary
      </v-btn>
    </div>

    <v-card>
      <v-card-text class="text-center py-12">
        <v-icon icon="mdi-calendar-heart-outline" size="64" color="success" class="mb-4"></v-icon>
        <h2 class="text-h5 mb-2">Anniversaries Feature</h2>
        <p class="text-body-1 text-medium-emphasis mb-4">
          This view will display and manage all your special anniversaries.
        </p>
        <v-chip color="success" variant="tonal">Coming Soon</v-chip>
      </v-card-text>
    </v-card>
  </v-container>
</template> 