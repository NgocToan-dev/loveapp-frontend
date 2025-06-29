<template>
  <AppLayout>
    <div class="demo-page">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-8">Couple Time Display Demo</h1>
        
        <!-- Main Display -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Main Feature Display (Dashboard)</h2>
          <CoupleTimeDisplay />
        </section>
        
        <!-- Banner -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Banner Display (Other Pages)</h2>
          <CoupleTimeBanner />
        </section>
        
        <!-- Widget -->
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Widget Display (Header/Sidebar)</h2>
          <div class="flex justify-center">
            <CoupleTimeWidget />
          </div>
        </section>
        
        <!-- Usage Info -->
        <section class="bg-gray-50 p-6 rounded-lg">
          <h2 class="text-2xl font-semibold mb-4">Usage Information</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="card">
              <h3 class="text-lg font-semibold mb-2">CoupleTimeDisplay</h3>
              <p class="text-gray-600 mb-3">Large featured display for dashboard homepage</p>
              <ul class="text-sm text-gray-500 list-disc list-inside">
                <li>Full-width gradient background</li>
                <li>Animated floating hearts</li>
                <li>Large numbers with effects</li>
                <li>Daily rotating love quotes</li>
                <li>Anniversary countdown</li>
              </ul>
            </div>
            
            <div class="card">
              <h3 class="text-lg font-semibold mb-2">CoupleTimeBanner</h3>
              <p class="text-gray-600 mb-3">Compact banner for other pages</p>
              <ul class="text-sm text-gray-500 list-disc list-inside">
                <li>Horizontal layout</li>
                <li>Gradient background</li>
                <li>Time breakdown</li>
                <li>Anniversary info</li>
                <li>Responsive design</li>
              </ul>
            </div>
            
            <div class="card">
              <h3 class="text-lg font-semibold mb-2">CoupleTimeWidget</h3>
              <p class="text-gray-600 mb-3">Small widget for header/sidebar</p>
              <ul class="text-sm text-gray-500 list-disc list-inside">
                <li>Minimal design</li>
                <li>Heart animation</li>
                <li>Days count only</li>
                <li>Perfect for navigation</li>
                <li>Rounded pill shape</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import CoupleTimeDisplay from '@/components/couple/CoupleTimeDisplay.vue'
import CoupleTimeBanner from '@/components/couple/CoupleTimeBanner.vue'
import CoupleTimeWidget from '@/components/couple/CoupleTimeWidget.vue'
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
}

section {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

section:last-child {
  background: #f9fafb;
}
</style>
