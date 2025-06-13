<template>
  <v-container fluid>
    <div class="d-flex align-center mb-6">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        class="mr-3"
        @click="goBack"
      ></v-btn>
      <h1 class="text-h4 font-weight-bold text-primary">
        <v-icon icon="mdi-note-text" class="mr-2"></v-icon>
        Note Detail
      </h1>
    </div>

    <v-card>
      <v-card-text class="text-center py-12">
        <v-icon icon="mdi-note-text-outline" size="64" color="primary" class="mb-4"></v-icon>
        <h2 class="text-h5 mb-2">Note Detail View</h2>
        <p class="text-body-1 text-medium-emphasis">
          This view will show detailed information about a specific note.
        </p>
        <p class="text-caption">Note ID: {{ $route.params.id }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script> 