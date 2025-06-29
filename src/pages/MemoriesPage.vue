<template>
  <AppLayout>
    <div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div class="container mx-auto px-4 py-8">
        <!-- Couple Time Banner -->
        <CoupleTimeBanner />
        <!-- Memories List -->
        <MemoryList />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'
import MemoryList from '@/components/memories/MemoryList.vue'
import CoupleTimeBanner from '@/components/couple/CoupleTimeBanner.vue'

const { t } = useI18n()
</script>
