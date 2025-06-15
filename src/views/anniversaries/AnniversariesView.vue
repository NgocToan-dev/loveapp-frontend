<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-success mb-2">
          <v-icon icon="mdi-calendar-heart" class="mr-2"></v-icon>
          {{ $t('anniversaries.title') }}
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          {{ $t('anniversaries.subtitle') }}
        </p>
      </div>
      <v-btn
        color="success"
        size="large"
        variant="elevated"
        prepend-icon="mdi-calendar-plus"
      >
        {{ $t('anniversaries.create') }}
      </v-btn>
    </div>

    <v-card>
      <v-card-text class="text-center py-12">
        <v-icon icon="mdi-calendar-heart-outline" size="64" color="success" class="mb-4"></v-icon>
        <h2 class="text-h5 mb-2">{{ $t('anniversaries.feature') }}</h2>
        <p class="text-body-1 text-medium-emphasis mb-4">
          {{ $t('anniversaries.featureDescription') }}
        </p>
        <v-chip color="success" variant="tonal">{{ $t('common.comingSoon') }}</v-chip>
      </v-card-text>
    </v-card>
  </v-container>
</template>