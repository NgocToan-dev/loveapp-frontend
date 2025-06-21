<template>
  <div 
    class="responsive-container"
    :class="{
      'mobile': mobile,
      'tablet': tablet, 
      'desktop': desktop,
      'touch-device': isTouchDevice
    }"
  >
    <slot 
      :mobile="mobile"
      :tablet="tablet"
      :desktop="desktop"
      :touch="isTouchDevice"
      :current="current"
      :windowWidth="windowWidth"
      :windowHeight="windowHeight"
    />
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints } from '@/composables/useBreakpoints'

interface Props {
  // Container sizing
  maxWidth?: string | number
  padding?: string | number
  margin?: string | number
  
  // Responsive behavior
  mobileFirst?: boolean
  adaptiveSpacing?: boolean
  adaptiveFontSize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: '1200px',
  padding: '16px',
  margin: '0 auto',
  mobileFirst: true,
  adaptiveSpacing: true,
  adaptiveFontSize: true
})

const {
  mobile,
  tablet,
  desktop,
  isTouchDevice,
  current,
  windowWidth,
  windowHeight
} = useBreakpoints()

// Computed styles
import { computed } from 'vue'

const containerStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  // Max width
  if (props.maxWidth) {
    styles.maxWidth = typeof props.maxWidth === 'number' 
      ? `${props.maxWidth}px` 
      : props.maxWidth
  }
    // Responsive padding
  if (props.adaptiveSpacing) {
    if (mobile.value) {
      styles.padding = '16px' // $container-padding-mobile
    } else if (tablet.value) {
      styles.padding = '24px' // $container-padding-tablet
    } else {
      styles.padding = '32px' // $container-padding-desktop
    }
  } else if (props.padding) {
    styles.padding = typeof props.padding === 'number'
      ? `${props.padding}px`
      : props.padding
  }
  
  // Margin
  if (props.margin) {
    styles.margin = typeof props.margin === 'number'
      ? `${props.margin}px`
      : props.margin
  }
  
  return styles
})
</script>

<style scoped>
.responsive-container {
  width: 100%;
  box-sizing: border-box;
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Apply computed styles */
.responsive-container {
  max-width: v-bind('containerStyles.maxWidth');
  padding: v-bind('containerStyles.padding');
  margin: v-bind('containerStyles.margin');
}

/* Mobile-specific styles */
.responsive-container.mobile {
  /* Larger touch targets */
  --min-touch-target: 44px;
  
  /* Increased spacing for readability */
  line-height: 1.6;
  
  /* Better text contrast */
  -webkit-font-smoothing: antialiased;
  
  /* Mobile-first max width */
  max-width: 100%;
}

/* Tablet styles */
.responsive-container.tablet {
  max-width: 1024px; /* $container-lg */
}

/* Desktop styles */
.responsive-container.desktop {
  max-width: 1280px; /* $container-xl */
}

/* Large desktop styles */
@media (min-width: 1280px) {
  .responsive-container.desktop {
    max-width: 1400px; /* $container-xxl */
  }
}

/* Touch device optimizations */
.responsive-container.touch-device {
  /* Disable hover effects */
  --hover-enabled: 0;
  
  /* Larger interactive elements */
  --button-min-height: 48px;
  --input-min-height: 56px;
}

/* Desktop optimizations */
.responsive-container.desktop {
  /* Enable hover effects */
  --hover-enabled: 1;
  
  /* Smaller interactive elements */
  --button-min-height: 40px;
  --input-min-height: 48px;
}

/* Adaptive font sizing */
.responsive-container.mobile {
  font-size: clamp(14px, 4vw, 16px);
}

.responsive-container.tablet {
  font-size: clamp(15px, 2.5vw, 17px);
}

.responsive-container.desktop {
  font-size: clamp(16px, 1.5vw, 18px);
}

/* Safe area support for devices with notches */
.responsive-container.mobile {
  padding-top: max(v-bind('containerStyles.padding'), env(safe-area-inset-top, 0));
  padding-bottom: max(v-bind('containerStyles.padding'), env(safe-area-inset-bottom, 0));
  padding-left: max(v-bind('containerStyles.padding'), env(safe-area-inset-left, 0));
  padding-right: max(v-bind('containerStyles.padding'), env(safe-area-inset-right, 0));
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .responsive-container {
    --text-contrast-boost: 1;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .responsive-container,
  .responsive-container * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print styles */
@media print {
  .responsive-container {
    padding: 0;
    margin: 0;
    max-width: none;
    background: white !important;
    color: black !important;
  }
}
</style>
