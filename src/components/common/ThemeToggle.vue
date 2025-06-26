<template>
  <button
    @click="toggleTheme"
    class="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
    :title="$t('common.theme.toggle')"
  >
    <Transition name="theme-icon" mode="out-in">
      <SunIcon
        v-if="themeStore.isDark"
        class="w-6 h-6 text-yellow-500"
      />
      <HeartIcon
        v-else-if="themeStore.isRomantic"
        class="w-6 h-6 text-pink-500"
      />
      <SparklesIcon
        v-else-if="themeStore.isSpring"
        class="w-6 h-6 text-green-500"
      />
      <MoonIcon
        v-else
        class="w-6 h-6 text-gray-600 dark:text-gray-300"
      />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon, HeartIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const toggleTheme = () => {
  const themes: ('light' | 'dark' | 'romantic' | 'spring')[] = ['light', 'dark', 'romantic', 'spring']
  const currentIndex = themes.indexOf(themeStore.currentTheme)
  const nextIndex = (currentIndex + 1) % themes.length
  const nextTheme = themes[nextIndex]
  
  // Use the existing theme store methods
  switch (nextTheme) {
    case 'dark':
      if (!themeStore.isDark) themeStore.toggleDarkLight()
      break
    case 'romantic':
      themeStore.setRomanticMode(true)
      break
    case 'spring':
      themeStore.setSpringMode(true)
      break
    default: // light
      if (themeStore.isDark) themeStore.toggleDarkLight()
      else if (themeStore.isRomantic) themeStore.setRomanticMode(false)
      else if (themeStore.isSpring) themeStore.setSpringMode(false)
      break
  }
}
</script>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.3s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(180deg) scale(0.5);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(-180deg) scale(0.5);
}
</style>
