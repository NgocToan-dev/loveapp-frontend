<template>
  <AppLayout>
    <div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div class="container mx-auto px-4 py-8">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ $t('memories.title') }}
          </h1>
          <p class="text-gray-600">
            {{ $t('memories.subtitle') }}
          </p>
        </div>

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

const { t } = useI18n()
</script>
