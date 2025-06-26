<template>
  <AuthForm :mode="mode" class="w-full" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthForm from '@/components/auth/AuthForm.vue'

const route = useRoute()

const mode = computed(() => {
  return route.path.includes('register') ? 'register' : 'login'
})
</script>
