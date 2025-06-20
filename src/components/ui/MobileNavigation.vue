<template>
  <div class="mobile-nav">
    <!-- Mobile Menu Toggle Button -->
    <v-app-bar-nav-icon
      v-if="!isMenuOpen"
      @click="toggleMenu"
      class="mobile-menu-toggle"
    />

    <!-- Mobile Drawer -->
    <v-navigation-drawer
      v-model="isMenuOpen"
      temporary
      location="start"
      class="mobile-drawer"
      :style="{ zIndex: 9999 }"
    >
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div class="app-logo">
          <v-icon icon="mdi-heart" color="primary" size="32" />
          <span class="app-name">LoveApp</span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeMenu"
          class="close-btn"
        />
      </div>

      <!-- Navigation Items -->
      <v-list density="comfortable" class="nav-list">
        <v-list-item
          v-for="item in navigationItems"
          :key="item.route"
          :to="item.route"
          @click="closeMenu"
          class="nav-item"
          :class="{ 'nav-item--active': isActiveRoute(item.route) }"
        >
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- User Actions -->
      <div class="drawer-footer">
        <v-divider class="mb-4" />
        
        <!-- Theme Toggle -->
        <div class="theme-section">
          <h4 class="section-title">Theme</h4>
          <v-chip-group 
            v-model="selectedTheme" 
            mandatory 
            class="theme-chips"
            @update:model-value="changeTheme"
          >
            <v-chip
              v-for="theme in themes"
              :key="theme.value"
              :value="theme.value"
              size="small"
              :color="theme.color"
            >
              {{ theme.name }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- User Profile -->
        <div class="user-section">
          <v-btn
            block
            variant="outlined"
            color="primary"
            @click="navigateToProfile"
          >
            <v-icon icon="mdi-account" start />
            Profile
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Overlay -->
    <v-overlay
      v-model="isMenuOpen"
      class="mobile-overlay"
      @click="closeMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const route = useRoute()
const vuetifyTheme = useTheme()
const themeStore = useThemeStore()

// Mobile menu state
const isMenuOpen = ref(false)

// Navigation items
const navigationItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
  { title: 'Memories', icon: 'mdi-heart', route: '/memories' },
  { title: 'Notes', icon: 'mdi-notebook', route: '/notes' },
  { title: 'Reminders', icon: 'mdi-bell', route: '/reminders' },
  { title: 'Anniversaries', icon: 'mdi-calendar-heart', route: '/anniversaries' },
  { title: 'Files', icon: 'mdi-folder', route: '/files' },
  { title: 'Couples', icon: 'mdi-account-multiple-plus', route: '/couples' },
  { title: 'Settings', icon: 'mdi-cog', route: '/settings' }
]

// Available themes
const themes = [
  { name: 'Romance', value: 'romance', color: 'pink' },
  { name: 'Sunset', value: 'sunset', color: 'orange' },
  { name: 'Ocean', value: 'ocean', color: 'blue' },
  { name: 'Emerald', value: 'emerald', color: 'green' },
  { name: 'Lavender', value: 'lavender', color: 'purple' },
  { name: 'Pastel', value: 'pastel-romance', color: 'pink' },
  { name: 'Mint', value: 'mint-elegance', color: 'teal' },
  { name: 'Golden', value: 'golden-hour', color: 'amber' }
]

// Current theme
const selectedTheme = computed({
  get: () => themeStore.currentTheme,
  set: (value: string) => themeStore.setTheme(value)
})

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const isActiveRoute = (routePath: string) => {
  return route.path.startsWith(routePath)
}

const changeTheme = (themeName: string) => {
  themeStore.setTheme(themeName)
}

const navigateToProfile = () => {
  router.push('/profile')
  closeMenu()
}

// Expose toggle method for parent components
defineExpose({
  toggleMenu,
  closeMenu
})
</script>

<style scoped lang="scss">
.mobile-nav {
  .mobile-menu-toggle {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.mobile-drawer {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 16px;
    background: linear-gradient(
      135deg,
      rgb(var(--v-theme-primary)) 0%,
      rgb(var(--v-theme-secondary)) 100%
    );
    color: white;

    .app-logo {
      display: flex;
      align-items: center;
      gap: 12px;

      .app-name {
        font-size: 1.5rem;
        font-weight: 600;
        font-family: 'Dancing Script', cursive;
      }
    }

    .close-btn {
      color: white !important;
    }
  }

  .nav-list {
    padding: 16px 8px;

    .nav-item {
      margin-bottom: 4px;
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(var(--v-theme-primary), 0.08);
        transform: translateX(4px);
      }

      &--active {
        background: rgba(var(--v-theme-primary), 0.12);
        color: rgb(var(--v-theme-primary));
        
        .v-icon {
          color: rgb(var(--v-theme-primary)) !important;
        }
      }
    }
  }

  .drawer-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;

    .theme-section {
      margin-bottom: 20px;

      .section-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: rgb(var(--v-theme-on-surface-variant));
        margin-bottom: 12px;
      }

      .theme-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
    }

    .user-section {
      .v-btn {
        border-radius: 12px;
      }
    }
  }
}

.mobile-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

// Dark mode styles
.v-theme--dark {
  .mobile-drawer {
    background: linear-gradient(
      135deg,
      rgba(30, 30, 30, 0.95) 0%,
      rgba(20, 20, 20, 0.95) 100%
    );
    
    .drawer-header {
      background: linear-gradient(
        135deg,
        rgb(var(--v-theme-primary)) 0%,
        rgb(var(--v-theme-secondary)) 100%
      );
    }
  }
}

// Responsive breakpoints
@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}
</style>
