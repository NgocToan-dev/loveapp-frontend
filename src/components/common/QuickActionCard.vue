<template>
  <div 
    class="card-romantic p-6 text-center cursor-pointer transform hover:scale-105 transition-all duration-300"
    @click="$emit('click')"
  >
    <div class="text-5xl mb-4 animate-float">{{ icon }}</div>
    <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()
defineEmits<{
  click: []
}>()
</script>

<style>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
