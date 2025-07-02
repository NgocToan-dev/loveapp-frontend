import { defineStore } from 'pinia'

type ThemeType = 'light' | 'dark' | 'romantic' | 'spring'

interface ThemeState {
  currentTheme: ThemeType
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    currentTheme: getInitialTheme()
  }),

  getters: {
    isDark: (state) => state.currentTheme === 'dark',
    isLight: (state) => state.currentTheme === 'light',
    isRomantic: (state) => state.currentTheme === 'romantic',
    isSpring: (state) => state.currentTheme === 'spring'
  },

  actions: {
    applyTheme() {
      const html = document.documentElement
      html.classList.remove('light', 'dark', 'romantic', 'spring')
      html.classList.add(this.currentTheme)
      localStorage.setItem(
        'love-app-theme',
        JSON.stringify({ theme: this.currentTheme })
      )
    },

    toggleDarkLight() {
      this.currentTheme = this.isDark ? 'light' : 'dark'
      this.applyTheme()
    },

    setRomanticMode(enabled: boolean) {
      this.currentTheme = enabled ? 'romantic' : 'light'
      this.applyTheme()
    },

    setSpringMode(enabled: boolean) {
      this.currentTheme = enabled ? 'spring' : 'light'
      this.applyTheme()
    },

    initialize() {
      this.applyTheme()
    }
  }
})

function getInitialTheme(): ThemeType {
  try {
    const saved = localStorage.getItem('love-app-theme')
    if (saved) {
      const { theme } = JSON.parse(saved)
      if (['light','dark','romantic','spring'].includes(theme)) {
        return theme as ThemeType
      }
    }
  } catch {
    // ignore parse errors
  }
  return 'light'
}