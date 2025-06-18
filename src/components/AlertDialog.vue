<template>
  <v-card>
    <v-card-title class="text-h6">
      {{ title }}
    </v-card-title>
    
    <v-card-text>
      <p>{{ message }}</p>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        variant="elevated"
        @click="$emit('confirm')"
      >
        {{ buttonText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  message: string
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'OK'
})

defineEmits<{
  confirm: []
}>()
</script>
