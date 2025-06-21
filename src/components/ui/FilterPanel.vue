<template>
  <div class="filter-panel">
    <div class="panel-sections">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// This is a simple container component for organizing filter content
</script>

<style scoped>
.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
}

.panel-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .filter-panel {
    gap: 16px;
  }
  
  .panel-sections {
    gap: 16px;
  }
}
</style>
