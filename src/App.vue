<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const theme = useTheme()
const drawer = ref(false)

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'loveTheme' : 'darkLoveTheme'
}

const toggleLanguage = () => {
  locale.value = locale.value === 'vi' ? 'en' : 'vi'
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
          :subtitle="t('nav.home')"
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
        <v-list-item
          prepend-icon="mdi-heart-multiple"
          :title="t('nav.memories')"
          value="memories"
          disabled
        />
        <v-list-item
          prepend-icon="mdi-message-heart"
          :title="t('nav.messages')"
          value="messages"
          disabled
        />
        <v-list-item
          prepend-icon="mdi-camera-account"
          :title="t('nav.photos')"
          value="photos"
          disabled
        />
        <v-list-item
          prepend-icon="mdi-information"
          :title="t('nav.about')"
          value="about"
          to="/about"
        />
      </v-list>
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

      <!-- Login Button (placeholder for future auth) -->
      <v-btn
        variant="outlined"
        color="white"
        disabled
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
