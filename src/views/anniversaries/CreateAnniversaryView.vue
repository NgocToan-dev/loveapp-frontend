<template>
  <v-container class="py-8">
    <div class="text-center mb-8">
      <h1 class="text-h3 font-weight-bold mb-3">
        <v-icon size="40" color="primary" class="me-3">mdi-calendar-heart</v-icon>
        {{ t('anniversaries.createAnniversary') }}
      </h1>
      <p class="text-h6 text-medium-emphasis">
        {{ t('anniversaries.subtitle') }}
      </p>
    </div>

    <v-row justify="center">
      <v-col cols="12" lg="8" xl="6">
        <CreateAnniversaryDialog 
          :open="true" 
          @close="handleClose"
          @anniversary-created="handleAnniversaryCreated"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CreateAnniversaryDialog from '@/components/CreateAnniversaryDialog.vue'

const router = useRouter()
const { t } = useI18n()

const handleClose = () => {
  router.push('/anniversaries')
}

const handleAnniversaryCreated = () => {
  router.push('/anniversaries')
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  padding-top: 2rem;
}
</style>
