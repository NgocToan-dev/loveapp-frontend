<template>
  <nav class="bottom-navigation">
    <router-link
      v-for="item in navigationItems"
      :key="item.name"
      :to="item.path"
      class="nav-item"
      :class="{ active: isActiveRoute(item.path) }"
    >
      <div class="nav-icon">
        <component :is="item.icon" class="icon" />
      </div>
      <span class="nav-label">{{ $t(item.label) }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

// Define navigation items
const navigationItems = [
  {
    name: 'home',
    path: '/',
    label: 'navigation.home',
    icon: 'HomeIcon'
  },
  {
    name: 'memories',
    path: '/memories',
    label: 'navigation.memories',
    icon: 'MemoryIcon'
  },
  {
    name: 'timeline',
    path: '/timeline',
    label: 'navigation.timeline',
    icon: 'TimelineIcon'
  },
  {
    name: 'reminders',
    path: '/reminders',
    label: 'navigation.reminders',
    icon: 'ReminderIcon'
  },
  {
    name: 'blog',
    path: '/blog',
    label: 'navigation.blog',
    icon: 'BlogIcon'
  }
]

const { t } = useI18n()
const route = useRoute()

const isActiveRoute = (path: string) => {
  return route.path === path || (path !== '/' && route.path.startsWith(path))
}

// Icon components (simple SVG icons)
const HomeIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  `
}

const MemoryIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>
  `
}

const TimelineIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="m17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  `
}

const ReminderIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  `
}

const BlogIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  `
}
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-around;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 8px;
  min-width: 60px;
}

.nav-item:hover {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}

.nav-item.active {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.icon {
  width: 100%;
  height: 100%;
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

/* Add bottom padding to body when navigation is present */
:global(body) {
  padding-bottom: 70px;
}

/* Responsive design */
@media (min-width: 768px) {
  .bottom-navigation {
    position: static;
    box-shadow: none;
    border-top: none;
    border-bottom: 1px solid #e0e0e0;
    padding: 12px 0;
    justify-content: center;
    gap: 32px;
  }
  
  .nav-item {
    flex-direction: row;
    gap: 8px;
    padding: 8px 16px;
    min-width: auto;
  }
  
  .nav-icon {
    margin-bottom: 0;
  }
  
  .nav-label {
    font-size: 14px;
  }
  
  :global(body) {
    padding-bottom: 0;
  }
}
</style>
