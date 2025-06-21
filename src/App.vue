<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import ServerOfflineNotice from '@/components/ServerOfflineNotice.vue'
import NotificationBell from '@/components/NotificationBell.vue'
import GlobalDialogContainer from '@/components/GlobalDialogContainer.vue'
import ShareMemoryDialog from '@/components/ShareMemoryDialog.vue'
import MobileNavigation from '@/components/ui/MobileNavigation.vue'
import BottomNavigation from '@/components/ui/BottomNavigation.vue'

const { t, locale } = useI18n()
const theme = useTheme()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const drawer = ref(false)

// Initialize theme on app start
onMounted(() => {
  themeStore.initializeTheme()
})

// Watch for theme changes and apply to Vuetify
watch(
  () => themeStore.currentTheme,
  (newTheme) => {
    theme.global.name.value = newTheme
  },
  { immediate: true }
)

const toggleLanguage = () => {
  locale.value = locale.value === 'vi' ? 'en' : 'vi'
}

const logout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Page transition logic
const getTransitionName = (route: any) => {
  // Define transition mapping based on route depth or specific routes
  const transitions: Record<string, string> = {
    '/login': 'fade',
    '/register': 'fade',
    '/dashboard': 'slideRight',
    '/memories': 'slideLeft',
    '/notes': 'slideLeft',
    '/reminders': 'slideLeft',
    '/anniversaries': 'slideLeft',
    '/files': 'slideLeft',
    '/profile': 'slideUp',
    '/settings': 'slideUp'
  }
  
  return transitions[route.path] || 'fade'
}
</script>

<template>
  <v-app :theme="theme.global.name.value">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="left"
      width="280"
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://via.placeholder.com/40x40/ff4081/ffffff?text=💕"
          title="AnhVaCun"
          :subtitle="authStore.isAuthenticated ? authStore.user?.displayName : 'Ứng dụng quản lý tình yêu'"
        />
      </v-list>

      <v-divider />

      <v-list density="compact" nav>
        <!-- Protected Routes -->
        <template v-if="authStore.isAuthenticated">
          <v-list-item
            prepend-icon="mdi-view-dashboard"
            :title="t('nav.dashboard') || 'Dashboard'"
            value="dashboard"
            to="/dashboard"
          />
          <v-list-item
            prepend-icon="mdi-heart"
            :title="t('nav.memories') || 'Memories'"
            value="memories"
            to="/memories"
          />
          <v-list-item
            prepend-icon="mdi-note-text"
            :title="t('nav.notes') || 'Notes'"
            value="notes"
            to="/notes"
          />
          <v-list-item
            prepend-icon="mdi-bell"
            :title="t('nav.reminders') || 'Reminders'"
            value="reminders"
            to="/reminders"
          />
          <v-list-item
            prepend-icon="mdi-calendar-heart"
            :title="t('nav.anniversaries') || 'Anniversaries'"
            value="anniversaries"
            to="/anniversaries"
          />
          <v-list-item
            prepend-icon="mdi-file-multiple"
            :title="t('nav.files') || 'Files'"
            value="files"
            to="/files"
          />

        </template>
        
        <v-list-item
          prepend-icon="mdi-palette"
          title="Cài Đặt Giao Diện"
          value="settings"
          to="/settings"
        />
      </v-list>

      <!-- Auth Section -->
      <template #append>
        <div class="pa-2">
          <v-divider class="mb-2" />
          <v-list density="compact">
            <v-list-item
              v-if="authStore.isAuthenticated"
              prepend-icon="mdi-account"
              :title="t('nav.profile')"
              to="/profile"
            />
            <v-list-item
              v-if="authStore.isAuthenticated"
              prepend-icon="mdi-logout"
              :title="t('nav.logout')"
              @click="logout"
            />
            <v-list-item
              v-else
              prepend-icon="mdi-login"
              :title="t('nav.login')"
              to="/login"
            />
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      elevation="2"
      color="primary"
      style="background-color: rgb(var(--v-theme-primary)) !important;"
    >
      <v-app-bar-nav-icon 
        color="on-primary"
        @click="drawer = !drawer" 
      />
      
      <v-toolbar-title 
        class="text-h5 font-weight-bold"
        style="color: rgb(var(--v-theme-on-primary)) !important;"
      >
        <v-icon class="mr-2" color="on-primary">mdi-heart</v-icon>
        AnhVaCun
      </v-toolbar-title>

      <v-spacer />

      <!-- Notification Bell for authenticated users -->
      <NotificationBell v-if="authStore.isAuthenticated" />

      <!-- Language Toggle -->
      <v-btn
        variant="text"
        size="small"
        color="on-primary"
        class="mr-2"
        @click="toggleLanguage"
        :title="locale === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'"
        :icon="locale === 'vi' ? 'mdi-translate' : 'mdi-translate-variant'"
      />

      <!-- Settings Button -->
      <v-btn
        variant="text"
        size="small"
        color="on-primary"
        class="mr-2"
        title="Cài đặt giao diện"
        icon="mdi-palette"
        to="/settings"
      />

      <!-- Auth Button -->
      <v-btn
        v-if="authStore.isAuthenticated"
        variant="text"
        size="small"
        color="on-primary"
        @click="logout"
      >
        {{ t('nav.logout') }}
      </v-btn>
      <v-btn
        v-else
        variant="text"
        size="small"
        color="on-primary"
        to="/login"
      >
        {{ t('nav.login') }}
      </v-btn>
    </v-app-bar>

    <!-- Server Offline Notice -->
    <ServerOfflineNotice v-if="!authStore.isAuthenticated && authStore.error && authStore.error.includes('Backend server not available')" />

    <!-- Main Content -->
    <v-main class="bg-background">
      <router-view v-slot="{ Component, route }">
        <transition :name="getTransitionName(route)" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </v-main>

    <!-- Mobile Navigation -->
    <MobileNavigation />
    
    <!-- Bottom Navigation for Mobile -->
    <BottomNavigation />

    <!-- Footer -->
    <v-footer
      color="surface"
      class="border-t footer-desktop"
      height="60"
    >
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          <div class="text-body-2 text-medium-emphasis">
            {{ t('common.copyright', { year: new Date().getFullYear() }) }}
          </div>
        </v-col>
      </v-row>
    </v-footer>

    <!-- Global Dialog Container -->
    <GlobalDialogContainer />
    
    <!-- Share Memory Dialog -->
    <ShareMemoryDialog />
  </v-app>
</template>

<style scoped>
.v-toolbar-title {
  letter-spacing: 0.5px;
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slideRight-enter-active,
.slideRight-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slideRight-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slideRight-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slideLeft-enter-active,
.slideLeft-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slideLeft-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slideLeft-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slideUp-enter-active,
.slideUp-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slideUp-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slideUp-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Mobile Responsive Styles */
.footer-desktop {
  @media (max-width: 767px) {
    display: none !important;
  }
}

/* Hide desktop navigation on mobile */
@media (max-width: 767px) {
  .v-navigation-drawer,
  .v-app-bar {
    display: none !important;
  }
  
  .v-main {
    padding-bottom: 80px !important; /* Space for bottom navigation */
  }
}
</style>
