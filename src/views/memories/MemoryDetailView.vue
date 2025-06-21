<template>
  <v-container fluid>
    <div class="d-flex align-center mb-6">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        class="mr-3"
        @click="goBack"
      ></v-btn>
      <h1 class="text-h4 font-weight-bold text-pink">
        <v-icon icon="mdi-heart" class="mr-2"></v-icon>
        {{ t('memories.title') }}
      </h1>
    </div>

    <v-card>
      <v-card-text class="text-center py-12">
        <v-icon icon="mdi-heart-outline" size="64" color="pink" class="mb-4"></v-icon>
        <h2 class="text-h5 mb-2">{{ t('memories.viewDetails') }}</h2>
        <p class="text-body-1 text-medium-emphasis">
          {{ t('memories.viewDetailsDescription') }}
        </p>
        <p class="text-caption">Memory ID: {{ $route.params.id }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const goBack = () => {
  router.back()
}
</script> 