<template>
  <div class="settings-view">
    <v-container class="py-8">
      <div class="text-center mb-8">
        <h1 class="text-h3 font-weight-bold mb-3">
          <v-icon size="40" color="primary" class="me-3">mdi-cog</v-icon>
          Cài Đặt
        </h1>
        <p class="text-h6 text-medium-emphasis">
          Tùy chỉnh giao diện và trải nghiệm của bạn
        </p>
      </div>

      <v-row justify="center">
        <v-col cols="12" lg="10" xl="8">
          <ThemeSettings />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import ThemeSettings from '@/components/ThemeSettings.vue'
</script>

<style scoped lang="scss">
.settings-view {
  min-height: 100vh;
  padding-top: 2rem;
}
</style> 