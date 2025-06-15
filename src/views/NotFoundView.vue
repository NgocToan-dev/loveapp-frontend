<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

function goHome() {
  router.push('/')
}

function goBack() {
  router.go(-1)
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center" class="fill-height text-center">
      <v-col cols="12" sm="8" md="6">
        <div class="mb-8">
          <v-icon size="200" color="grey-lighten-2" class="mb-6">
            mdi-emoticon-sad-outline
          </v-icon>
          
          <h1 class="text-h1 font-weight-bold text-primary mb-4">
            404
          </h1>
          
          <h2 class="text-h4 font-weight-medium mb-4">
            {{ t('notFound.title') }}
          </h2>
          
          <p class="text-h6 text-medium-emphasis mb-8">
            {{ t('notFound.description') }}
          </p>
          
          <div class="d-flex flex-column flex-sm-row justify-center gap-4">
            <v-btn
              color="primary"
              variant="elevated"
              size="large"
              prepend-icon="mdi-home"
              @click="goHome"
            >
              {{ t('notFound.goHome') }}
            </v-btn>
            
            <v-btn
              color="secondary"
              variant="outlined"
              size="large"
              prepend-icon="mdi-arrow-left"
              @click="goBack"
            >
              {{ t('notFound.goBack') }}
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.gap-4 {
  gap: 1rem;
}
</style>