<template>
  <v-bottom-navigation
    v-if="isMobile"
    v-model="activeTab"
    class="mobile-bottom-nav"
    :class="{ 'mobile-bottom-nav--elevated': isScrolled }"
    :style="{ zIndex: 1000 }"
    height="64"
    grow
  >
    <v-btn
      v-for="item in navigationItems"
      :key="item.route"
      :value="item.route"
      :to="item.route"
      class="nav-btn"
      :class="{ 'nav-btn--active': isActiveRoute(item.route) }"
      @click="handleNavigation(item.route)"
    >
      <v-icon 
        :icon="item.icon" 
        :size="isActiveRoute(item.route) ? 28 : 24"
        :class="{ 'nav-icon--active': isActiveRoute(item.route) }"
      />
      <span 
        class="nav-label"
        :class="{ 'nav-label--active': isActiveRoute(item.route) }"
      >
        {{ item.title }}
      </span>

      <!-- Active indicator -->
      <div 
        v-if="isActiveRoute(item.route)"
        class="active-indicator"
      />
    </v-btn>

    <!-- Floating Action Button for quick create -->
    <v-fab
      icon="mdi-plus"
      color="primary"
      class="fab-create"
      size="small"
      @click="openQuickCreate"
    >
      <v-icon icon="mdi-plus" />
    </v-fab>
  </v-bottom-navigation>

  <!-- Quick Create Menu -->
  <v-menu
    v-model="showQuickCreate"
    :close-on-content-click="false"
    location="top center"
    offset="16"
  >
    <v-card class="quick-create-menu">
      <v-card-title class="text-center py-3">
        <v-icon icon="mdi-lightning-bolt" color="primary" class="mr-2" />
        Quick Create
      </v-card-title>
      
      <v-card-text class="pa-2">
        <div class="quick-actions-grid">
          <v-btn
            v-for="action in quickActions"
            :key="action.type"
            :color="action.color"
            variant="tonal"
            size="large"
            class="quick-action-btn"
            @click="handleQuickCreate(action.type)"
          >
            <v-icon :icon="action.icon" size="20" />
            <span class="action-label">{{ action.label }}</span>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBreakpoints } from '@/composables/useBreakpoints'
import { useDialogsStore } from '@/stores/dialogs'

const router = useRouter()
const route = useRoute()
const { isMobile } = useBreakpoints()
const dialogStore = useDialogsStore()

// Navigation state
const activeTab = ref('')
const isScrolled = ref(false)
const showQuickCreate = ref(false)

// Navigation items for bottom bar
const navigationItems = [
  { title: 'Home', icon: 'mdi-home', route: '/dashboard' },
  { title: 'Memories', icon: 'mdi-heart', route: '/memories' },
  { title: 'Notes', icon: 'mdi-notebook', route: '/notes' },
  { title: 'More', icon: 'mdi-dots-horizontal', route: '/more' }
]

// Quick create actions
const quickActions = [
  { type: 'memory', label: 'Memory', icon: 'mdi-heart-plus', color: 'pink' },
  { type: 'note', label: 'Note', icon: 'mdi-note-plus', color: 'blue' },
  { type: 'reminder', label: 'Reminder', icon: 'mdi-bell-plus', color: 'orange' },
  { type: 'anniversary', label: 'Anniversary', icon: 'mdi-calendar-plus', color: 'green' }
]

// Methods
const isActiveRoute = (routePath: string) => {
  if (routePath === '/more') {
    // For "More" tab, consider it active for routes not in main navigation
    const mainRoutes = ['/dashboard', '/memories', '/notes']
    return !mainRoutes.some(mainRoute => route.path.startsWith(mainRoute))
  }
  return route.path.startsWith(routePath)
}

const handleNavigation = (routePath: string) => {
  if (routePath === '/more') {
    // Show options for other pages
    router.push('/settings') // Or show a menu
  } else {
    router.push(routePath)
  }
}

const openQuickCreate = () => {
  showQuickCreate.value = !showQuickCreate.value
}

const handleQuickCreate = (type: string) => {
  showQuickCreate.value = false
  
  switch (type) {
    case 'memory':
      // Navigate to create memory page
      router.push('/memories/create')
      break
    case 'note':
      // Navigate to create note page
      router.push('/notes/create')
      break
    case 'reminder':
      // Open reminder creation using generic dialog
      dialogStore.openDialog({
        component: 'CreateReminderDialog',
        options: { maxWidth: '500' }
      })
      break
    case 'anniversary':
      // Open anniversary creation using generic dialog
      dialogStore.openDialog({
        component: 'CreateAnniversaryDialog',
        options: { maxWidth: '500' }
      })
      break
  }
}

// Scroll detection for elevated style
const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
}

// Set active tab based on current route
const updateActiveTab = () => {
  const currentRoute = route.path
  const matchingItem = navigationItems.find(item => 
    item.route === '/more' 
      ? !navigationItems.slice(0, -1).some(navItem => currentRoute.startsWith(navItem.route))
      : currentRoute.startsWith(item.route)
  )
  activeTab.value = matchingItem?.route || '/dashboard'
}

// Lifecycle
onMounted(() => {
  updateActiveTab()
  window.addEventListener('scroll', handleScroll)
  
  // Watch route changes
  router.afterEach(() => {
    updateActiveTab()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.mobile-bottom-nav {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &--elevated {
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    border-top-color: transparent;
  }

  .nav-btn {
    position: relative;
    height: 64px !important;
    flex-direction: column;
    border-radius: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &--active {
      .nav-icon--active {
        color: rgb(var(--v-theme-primary)) !important;
        transform: scale(1.1);
      }

      .nav-label--active {
        color: rgb(var(--v-theme-primary)) !important;
        font-weight: 600;
      }
    }

    .nav-label {
      font-size: 0.75rem;
      margin-top: 2px;
      transition: all 0.3s ease;
      line-height: 1;
    }

    .active-indicator {
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background: rgb(var(--v-theme-primary));
      border-radius: 2px;
      animation: slideIn 0.3s ease;
    }

    &:hover {
      background: rgba(var(--v-theme-primary), 0.04);
    }
  }

  .fab-create {
    position: absolute !important;
    top: -16px;
    right: 16px;
    box-shadow: 0 4px 16px rgba(var(--v-theme-primary-rgb), 0.3);
    animation: fabPulse 2s infinite;

    &:hover {
      animation: none;
      transform: scale(1.1);
    }
  }
}

.quick-create-menu {
  min-width: 280px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  .quick-actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    .quick-action-btn {
      height: 64px;
      flex-direction: column;
      border-radius: 12px;
      gap: 4px;
      
      .action-label {
        font-size: 0.75rem;
        font-weight: 500;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(var(--v-theme-primary-rgb), 0.2);
      }
    }
  }
}

// Dark mode styles
.v-theme--dark {
  .mobile-bottom-nav {
    background: rgba(30, 30, 30, 0.95) !important;
    border-top-color: rgba(255, 255, 255, 0.08);

    &--elevated {
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
    }
  }
}

// Animations
@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 20px;
    opacity: 1;
  }
}

@keyframes fabPulse {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(var(--v-theme-primary-rgb), 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(var(--v-theme-primary-rgb), 0.5);
  }
}

// Hide on larger screens
@media (min-width: 768px) {
  .mobile-bottom-nav {
    display: none !important;
  }
}
</style>
