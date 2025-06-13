<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { t, locale } = useI18n()
const theme = useTheme()
const authStore = useAuthStore()
const drawer = ref(false)

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'loveTheme' : 'darkLoveTheme'
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
  <v-app>
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
          :subtitle="authStore.isAuthenticated ? authStore.user?.displayName : t('nav.home')"
        />
      </v-list>

      <v-divider />

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home"
          :title="t('nav.home')"
          value="home"
          to="/"
        />
        
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
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      
      <v-toolbar-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-heart</v-icon>
        LoveApp
      </v-toolbar-title>

      <v-spacer />

      <!-- Language Toggle -->
      <v-btn
        icon
        @click="toggleLanguage"
        class="mr-2"
        :title="locale === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'"
      >
        <v-icon>
          {{ locale === 'vi' ? 'mdi-translate' : 'mdi-translate-variant' }}
        </v-icon>
      </v-btn>

      <!-- Theme Toggle -->
      <v-btn
        icon
        @click="toggleTheme"
        class="mr-2"
        :title="theme.global.current.value.dark ? t('theme.toggleLight') : t('theme.toggleDark')"
      >
        <v-icon>
          {{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>

      <!-- Auth Button -->
      <v-btn
        v-if="authStore.isAuthenticated"
        variant="outlined"
        color="white"
        @click="logout"
      >
        {{ t('nav.logout') }}
      </v-btn>
      <v-btn
        v-else
        variant="outlined"
        color="white"
        to="/login"
      >
        {{ t('nav.login') }}
      </v-btn>
    </v-app-bar>

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
