<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  icon?: string
  color?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  icon: 'mdi-heart',
  color: 'primary',
  disabled: false
})
</script>

<template>
  <v-card
    class="love-card"
    :class="{ 'love-card--disabled': disabled }"
    variant="elevated"
    hover
  >
    <v-card-text class="text-center pa-6">
      <v-avatar
        size="64"
        :color="disabled ? 'grey-lighten-2' : color"
        class="mb-4"
      >
        <v-icon 
          size="32" 
          :color="disabled ? 'grey' : 'white'"
        >
          {{ icon }}
        </v-icon>
      </v-avatar>
      
      <v-card-title 
        class="text-h6 font-weight-bold mb-2"
        :class="{ 'text-grey': disabled }"
      >
        {{ title }}
      </v-card-title>
      
      <v-card-subtitle 
        v-if="subtitle"
        :class="{ 'text-grey-lighten-1': disabled }"
      >
        {{ subtitle }}
      </v-card-subtitle>
    </v-card-text>

    <v-overlay
      v-if="disabled"
      contained
      class="d-flex align-center justify-center"
    >
      <v-chip
        color="info"
        variant="elevated"
      >
        Coming Soon
      </v-chip>
    </v-overlay>
  </v-card>
</template>

<style scoped>
.love-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.love-card:hover:not(.love-card--disabled) {
  transform: translateY(-4px);
}

.love-card--disabled {
  opacity: 0.7;
}
</style>