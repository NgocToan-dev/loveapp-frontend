import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ThemeOption {
  key: string
  name: string
  description: string
  icon: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

export const useThemeStore = defineStore('theme', () => {
  // Available themes
  const availableThemes: ThemeOption[] = [
    {
      key: 'spring',
      name: 'Mùa Xuân',
      description: 'Tươi mát như những ngày đầu xuân',
      icon: 'mdi-flower',
      colors: {
        primary: '#4caf50',
        secondary: '#81c784',  
        accent: '#ffb74d'
      }
    },
    {
      key: 'summer',
      name: 'Mùa Hè',
      description: 'Rực rỡ như nắng hè',
      icon: 'mdi-white-balance-sunny',
      colors: {
        primary: '#ff9800',
        secondary: '#ffc107',
        accent: '#03a9f4'
      }
    },
    {
      key: 'autumn',
      name: 'Mùa Thu',
      description: 'Ấm áp như lá vàng mùa thu',
      icon: 'mdi-leaf',
      colors: {
        primary: '#ff5722',
        secondary: '#ff8a65',
        accent: '#8d6e63'
      }
    },
    {
      key: 'winter',
      name: 'Mùa Đông',
      description: 'Thanh lịch như tuyết trắng',
      icon: 'mdi-snowflake',
      colors: {
        primary: '#2196f3',
        secondary: '#64b5f6',
        accent: '#90a4ae'
      }
    },
    {
      key: 'love',
      name: 'Tình Yêu',
      description: 'Ngọt ngào như tình yêu đầu',
      icon: 'mdi-heart',
      colors: {
        primary: '#ff4081',
        secondary: '#e91e63',
        accent: '#ff80ab'
      }
    },
    {
      key: 'pastelRomance',
      name: 'Lãng Mạn Pastel',
      description: 'Nhẹ nhàng như sương mai',
      icon: 'mdi-flower-tulip',
      colors: {
        primary: '#f8bbd9',
        secondary: '#e1bee7',
        accent: '#fff3e0'
      }
    },
    {
      key: 'mintElegance', 
      name: 'Thanh Lịch Mint',
      description: 'Tươi mát như gió biển',
      icon: 'mdi-leaf-circle',
      colors: {
        primary: '#a8e6cf',
        secondary: '#c8e6c9',
        accent: '#fff9c4'
      }
    },
    {
      key: 'goldenHour',
      name: 'Giờ Vàng',
      description: 'Ấm áp như hoàng hôn',
      icon: 'mdi-weather-sunset',
      colors: {
        primary: '#ffcc80',
        secondary: '#ffab91', 
        accent: '#f3e5ab'
      }
    }
  ]

  // Current theme state
  const currentTheme = ref<string>('love')
  
  // Theme preference persistence
  const THEME_STORAGE_KEY = 'loveapp-theme'

  // Load theme from localStorage
  const loadTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme && availableThemes.some(t => t.key === savedTheme)) {
      currentTheme.value = savedTheme
    }
  }

  // Save theme to localStorage
  const saveTheme = (themeKey: string) => {
    localStorage.setItem(THEME_STORAGE_KEY, themeKey)
  }

  // Set current theme
  const setTheme = (themeKey: string) => {
    if (availableThemes.some(t => t.key === themeKey)) {
      currentTheme.value = themeKey
      saveTheme(themeKey)
    }
  }

  // Computed properties
  const currentThemeInfo = computed(() => {
    return availableThemes.find(t => t.key === currentTheme.value) || availableThemes[4] // Default to love
  })

  // Initialize theme
  const initializeTheme = () => {
    loadTheme()
  }

  return {
    // State
    availableThemes,
    currentTheme,
    
    // Getters
    currentThemeInfo,
    
    // Actions
    setTheme,
    initializeTheme,
    loadTheme,
    saveTheme
  }
}) 