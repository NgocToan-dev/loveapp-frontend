import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/stores/theme'

export function useAppTheme() {
  const themeStore = useThemeStore()
  const vuetifyTheme = useTheme()
  
  // Computed properties for easy access
  const currentTheme = computed(() => themeStore.currentTheme)
  const currentThemeInfo = computed(() => themeStore.currentThemeInfo)
  const isDarkMode = computed(() => themeStore.isDarkMode)
  const availableThemes = computed(() => themeStore.availableThemes)
  
  // Methods
  const setTheme = (themeKey: string) => {
    themeStore.setTheme(themeKey)
  }
  
  const toggleDarkMode = () => {
    themeStore.toggleDarkMode()
  }
  
  const initializeTheme = () => {
    themeStore.initializeTheme()
  }
  
  // Theme-based utility functions
  const getThemeClass = (baseClass: string) => {
    return `${baseClass}-${currentTheme.value}`
  }
  
  const getSeasonalAnimation = () => {
    const animations = {
      spring: 'spring-sway',
      summer: 'summer-glow', 
      autumn: 'autumn-fall',
      winter: 'winter-shimmer',
      love: 'love-heartbeat'
    }
    return animations[currentTheme.value as keyof typeof animations] || 'theme-bounce'
  }
  
  const getThemeColors = () => {
    return currentThemeInfo.value?.colors || {
      primary: '#ff4081',
      secondary: '#e91e63',
      accent: '#ff80ab'
    }
  }
  
  const applyThemeToVuetify = (theme: string, isDark: boolean) => {
    const themeName = isDark ? `dark${theme.charAt(0).toUpperCase() + theme.slice(1)}` : theme
    vuetifyTheme.global.name.value = themeName
  }
  
  return {
    // State
    currentTheme,
    currentThemeInfo,
    isDarkMode,
    availableThemes,
    
    // Actions
    setTheme,
    toggleDarkMode,
    initializeTheme,
    
    // Utilities
    getThemeClass,
    getSeasonalAnimation,
    getThemeColors,
    applyThemeToVuetify,
    
    // Store reference
    themeStore
  }
} 