import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  function getInitialTheme(): 'light' | 'dark' | 'romantic' | 'spring' {
    try {
      const saved = localStorage.getItem('love-app-theme')
      if (saved) {
        const { theme } = JSON.parse(saved)
        if (['light','dark','romantic','spring'].includes(theme)) {
          return theme as 'light' | 'dark' | 'romantic' | 'spring'
        }
      }
    } catch {
      // ignore parse errors
    }
    return 'light'
  }
  const currentTheme = ref<'light' | 'dark' | 'romantic' | 'spring'>(getInitialTheme())

  // Getters
  const isDark = computed(() => currentTheme.value === 'dark')
  const isLight = computed(() => currentTheme.value === 'light')
  const isRomantic = computed(() => currentTheme.value === 'romantic')
  const isSpring = computed(() => currentTheme.value === 'spring')

  // Actions
  function applyTheme() {
    const html = document.documentElement
    html.classList.remove('light', 'dark', 'romantic', 'spring')
    html.classList.add(currentTheme.value)
    localStorage.setItem(
      'love-app-theme',
      JSON.stringify({ theme: currentTheme.value })
    )
  }

  function toggleDarkLight() {
    currentTheme.value = isDark.value ? 'light' : 'dark'
    applyTheme()
  }

  function setRomanticMode(enabled: boolean) {
    currentTheme.value = enabled ? 'romantic' : 'light'
    applyTheme()
  }

  function setSpringMode(enabled: boolean) {
    currentTheme.value = enabled ? 'spring' : 'light'
    applyTheme()
  }

  function initialize() {
    applyTheme()
  }

  return {
    currentTheme,
    isDark,
    isLight,
    isRomantic,
    isSpring,
    toggleDarkLight,
    setRomanticMode,
    setSpringMode,
    initialize
  }
})