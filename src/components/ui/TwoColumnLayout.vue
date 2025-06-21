<template>
  <div class="two-column-layout">
    <v-container fluid class="pa-0">
      <v-row no-gutters :class="{ 'mobile-stacked': isMobile }">
        <!-- Left Column - Main Content -->
        <v-col 
          :cols="isMobile ? 12 : 8" 
          :lg="9"
          class="main-content"
          :class="{ 'mobile-order-2': isMobile && showRightPanel }"
        >
          <div class="content-wrapper">
            <slot name="left" />
          </div>
        </v-col>

        <!-- Right Column - Filters & Stats -->
        <v-col 
          :cols="isMobile ? 12 : 4" 
          :lg="3"
          class="sidebar-content"
          :class="{ 
            'mobile-order-1': isMobile && showRightPanel,
            'mobile-hidden': isMobile && !showRightPanel 
          }"
        >
          <div class="sidebar-wrapper">
            <!-- Mobile Toggle -->
            <div v-if="isMobile" class="mobile-toggle mb-4">
              <v-btn
                @click="showRightPanel = !showRightPanel"
                :color="showRightPanel ? 'primary' : 'default'"
                variant="outlined"
                block
                prepend-icon="mdi-filter-variant"
              >
                {{ showRightPanel ? $t('common.hideFilters') : $t('common.showFilters') }}
              </v-btn>
            </div>

            <div v-show="!isMobile || showRightPanel">
              <slot name="right" />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBreakpoints } from '@/composables/useBreakpoints'

const { isMobile } = useBreakpoints()
const showRightPanel = ref(false)
</script>

<style scoped>
.two-column-layout {
  min-height: 100vh;
}

.main-content {
  border-right: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.content-wrapper {
  padding: 24px;
  min-height: calc(100vh - 48px);
}

.sidebar-wrapper {
  padding: 24px 16px;
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  min-height: calc(100vh - 48px);
  position: sticky;
  top: 0;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .mobile-stacked .main-content {
    border-right: none;
    border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
  }
  
  .content-wrapper {
    padding: 16px;
    min-height: auto;
  }
  
  .sidebar-wrapper {
    padding: 16px;
    min-height: auto;
    position: relative;
    background: rgba(var(--v-theme-surface), 0.95);
  }
  
  .mobile-hidden {
    display: none;
  }
  
  .mobile-order-1 {
    order: 1;
  }
  
  .mobile-order-2 {
    order: 2;
  }
}

/* Dark theme adjustments */
.v-theme--dark .sidebar-wrapper {
  background: rgba(var(--v-theme-surface), 0.9);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .main-content {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .v-theme--dark .mobile-stacked .main-content {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* Smooth transitions */
.sidebar-content {
  transition: all 0.3s ease;
}

.content-wrapper,
.sidebar-wrapper {
  transition: padding 0.3s ease;
}
</style>
