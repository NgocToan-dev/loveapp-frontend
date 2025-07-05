<template>
  <div class="p-8 space-y-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Tooltip Demo</h1>
    
    <!-- Basic Tooltips -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Basic Tooltips</h2>
      
      <div class="flex flex-wrap gap-4">
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          v-tooltip="'This is a basic tooltip'"
        >
          Hover me (Basic)
        </button>
        
        <button 
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          v-tooltip="{ content: 'Top tooltip', placement: 'top' }"
        >
          Top Tooltip
        </button>
        
        <button 
          class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          v-tooltip="{ content: 'Bottom tooltip', placement: 'bottom' }"
        >
          Bottom Tooltip
        </button>
        
        <button 
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          v-tooltip="{ content: 'Left tooltip', placement: 'left' }"
        >
          Left Tooltip
        </button>
        
        <button 
          class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          v-tooltip="{ content: 'Right tooltip', placement: 'right' }"
        >
          Right Tooltip
        </button>
      </div>
    </section>
    
    <!-- Theme Variants -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Theme Variants</h2>
      
      <div class="flex flex-wrap gap-4">
        <button 
          class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          v-tooltip="{ content: 'Dark theme tooltip', theme: 'dark' }"
        >
          Dark Theme
        </button>
        
        <button 
          class="px-4 py-2 bg-white text-gray-800 border rounded hover:bg-gray-50"
          v-tooltip="{ content: 'Light theme tooltip', theme: 'light' }"
        >
          Light Theme
        </button>
      </div>
    </section>
    
    <!-- Delay Options -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Delay Options</h2>
      
      <div class="flex flex-wrap gap-4">
        <button 
          class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          v-tooltip="{ content: 'No delay tooltip', delay: 0 }"
        >
          No Delay
        </button>
        
        <button 
          class="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          v-tooltip="{ content: 'Slow tooltip', delay: 500 }"
        >
          500ms Delay
        </button>
      </div>
    </section>
    
    <!-- Real-world Examples -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Real-world Examples</h2>
      
      <div class="flex flex-wrap gap-4">
        <!-- Icon buttons like in ReminderCard -->
        <button 
          class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
          v-tooltip="'Đánh dấu hoàn thành'"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
          v-tooltip="'Hoãn lại'"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <button 
          class="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded"
          v-tooltip="'Chỉnh sửa'"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <button 
          class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
          v-tooltip="'Xóa'"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </section>
    
    <!-- Disabled State -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Disabled State</h2>
      
      <div class="flex flex-wrap gap-4">
        <button 
          class="px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
          v-tooltip="{ content: 'This tooltip should not show', disabled: true }"
          disabled
        >
          Disabled Button
        </button>
        
        <button 
          class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          v-tooltip="{ content: dynamicContent, disabled: isDisabled }"
          @click="toggleDisabled"
        >
          {{ isDisabled ? 'Enable Tooltip' : 'Disable Tooltip' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isDisabled = ref(false)

const dynamicContent = computed(() => 
  isDisabled.value 
    ? 'This tooltip is disabled' 
    : 'This tooltip is enabled! Click to toggle.'
)

const toggleDisabled = () => {
  isDisabled.value = !isDisabled.value
}
</script>

<style scoped>
/* Demo specific styles */
button {
  transition: all 0.2s ease;
}

button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
