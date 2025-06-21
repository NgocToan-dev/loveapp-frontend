<template>
  <v-card 
    class="stats-widget" 
    :elevation="elevation"
    :variant="variant"
  >
    <v-card-title v-if="title" class="pb-2">
      <v-icon v-if="icon" :icon="icon" class="me-2" :color="iconColor" />
      {{ title }}
    </v-card-title>
    
    <v-card-text class="pt-2">
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  icon?: string
  iconColor?: string
  elevation?: number | string
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
}

withDefaults(defineProps<Props>(), {
  elevation: 2,
  variant: 'elevated',
  iconColor: 'primary'
})
</script>

<style scoped>
.stats-widget {
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stats-widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Dark theme */
.v-theme--dark .stats-widget {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
}

.v-theme--dark .stats-widget:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}
</style>
