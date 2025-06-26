<template>
  <AppLayout>
    <div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">
            {{ $t('timeline.title') }}
          </h1>
          <p class="text-gray-600 max-w-2xl mx-auto">
            {{ $t('timeline.description') }}
          </p>
        </div>
        
        <TimelineView />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import TimelineView from '@/components/timeline/TimelineView.vue'
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Custom romantic styling */
.text-romantic {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style>