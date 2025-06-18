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
        color="grey"
        variant="text"
        @click="$emit('cancel')"
      >
        {{ cancelText }}
      </v-btn>
      <v-btn
        color="primary"
        variant="elevated"
        @click="$emit('confirm')"
      >
        {{ confirmText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Xác nhận',
  cancelText: 'Hủy'
})

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>
