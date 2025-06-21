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
        <v-icon icon="mdi-note-text" class="mr-2"></v-icon>        {{ t('notes.noteDetail') }}
      </h1>
    </div>

    <v-card>
      <v-card-text class="text-center py-12">
        <v-icon icon="mdi-note-text-outline" size="64" color="primary" class="mb-4"></v-icon>
        <h2 class="text-h5 mb-2">{{ t('notes.noteDetailView') }}</h2>
        <p class="text-body-1 text-medium-emphasis">
          {{ t('notes.noteDetailDescription') }}
        </p>
        <p class="text-caption">{{ t('notes.noteId') }}: {{ $route.params.id }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const goBack = () => {
  router.back()
}
</script> 