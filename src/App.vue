<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import ServerOfflineNotice from '@/components/ServerOfflineNotice.vue'

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
    const themeName = themeStore.isDarkMode ? `dark${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}` : newTheme
    theme.global.name.value = themeName
  },
  { immediate: true }
)

watch(
  () => themeStore.isDarkMode,
  (isDark) => {
    const currentTheme = themeStore.currentTheme
    const themeName = isDark ? `dark${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}` : currentTheme
    theme.global.name.value = themeName
  }
)

const toggleDarkMode = () => {
  themeStore.toggleDarkMode()
}

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
          title="LoveApp"
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
          prepend-icon="mdi-information"
          :title="t('nav.about')"
          value="about"
          to="/about"
        />
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
        LoveApp
      </v-toolbar-title>

      <v-spacer />

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

      <!-- Theme Toggle -->
      <v-btn
        variant="text"
        size="small"
        color="on-primary"
        class="mr-2"
        @click="toggleDarkMode"
        :title="themeStore.isDarkMode ? t('theme.toggleLight') : t('theme.toggleDark')"
        :icon="themeStore.isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night'"
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
      <RouterView />
    </v-main>

    <!-- Footer -->
    <v-footer
      color="surface"
      class="border-t"
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
  </v-app>
</template>

<style scoped>
.v-toolbar-title {
  letter-spacing: 0.5px;
}
</style>
