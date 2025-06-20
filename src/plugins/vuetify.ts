import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// 🌸 Spring Theme - Fresh and vibrant like early spring
const springTheme = {
  dark: false,
  colors: {
    primary: '#4caf50',           // Fresh green
    secondary: '#81c784',         // Light green  
    accent: '#ffb74d',            // Warm orange
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50',
    background: '#ffffff',        // Pure white background
    surface: '#ffffff',
    'surface-variant': '#f5f5f5',
    'on-primary': '#ffffff',      // White text on primary buttons
    'on-secondary': '#ffffff',    // White text on secondary buttons
    'on-background': '#2e2e2e',   // Dark gray text on white background
    'on-surface': '#424242',      // Dark gray text on surface
    'on-surface-variant': '#616161', // Medium gray text for surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#388e3c',
    'secondary-darken-1': '#66bb6a',
  }
}

const darkSpringTheme = {
  dark: true,
  colors: {
    primary: '#4caf50',
    secondary: '#81c784',
    accent: '#ffb74d',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50',
    background: '#121212',        // Standard dark background
    surface: '#1e1e1e',          // Dark surface
    'surface-variant': '#2e2e2e',
    'on-primary': '#ffffff',
    'on-secondary': '#000000',
    'on-background': '#ffffff',   // White text on dark background
    'on-surface': '#ffffff',      // White text on dark surface
    'on-surface-variant': '#e0e0e0', // Light gray text for dark surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#388e3c',
    'secondary-darken-1': '#66bb6a',
  }
}

// ☀️ Summer Theme - Bright and energetic like summer sun
const summerTheme = {
  dark: false,
  colors: {
    primary: '#ff9800',           // Bright orange
    secondary: '#ffc107',         // Golden yellow
    accent: '#03a9f4',            // Sky blue
    error: '#f44336',
    warning: '#ff9800',
    info: '#03a9f4',
    success: '#4caf50',
    background: '#ffffff',        // Pure white background
    surface: '#ffffff',
    'surface-variant': '#f5f5f5',
    'on-primary': '#ffffff',      // White text on orange buttons
    'on-secondary': '#2e2e2e',    // Dark text on yellow buttons
    'on-background': '#2e2e2e',   // Dark gray text on white background
    'on-surface': '#424242',      // Dark gray text on surface
    'on-surface-variant': '#616161', // Medium gray text for surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#f57c00',
    'secondary-darken-1': '#ffb300',
  }
}

const darkSummerTheme = {
  dark: true,
  colors: {
    primary: '#ff9800',
    secondary: '#ffc107',
    accent: '#03a9f4',
    error: '#f44336',
    warning: '#ff9800',
    info: '#03a9f4',
    success: '#4caf50',
    background: '#121212',        // Standard dark background
    surface: '#1e1e1e',          // Dark surface
    'surface-variant': '#2e2e2e',
    'on-primary': '#ffffff',
    'on-secondary': '#000000',
    'on-background': '#ffffff',   // White text on dark background
    'on-surface': '#ffffff',      // White text on dark surface
    'on-surface-variant': '#e0e0e0', // Light gray text for dark surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#f57c00',
    'secondary-darken-1': '#ffb300',
  }
}

// 🍂 Autumn Theme - Warm and cozy like autumn leaves
const autumnTheme = {
  dark: false,
  colors: {
    primary: '#ff5722',           // Deep orange
    secondary: '#ff8a65',         // Light orange-red
    accent: '#8d6e63',            // Brown
    error: '#d32f2f',
    warning: '#f57c00',
    info: '#1976d2',
    success: '#388e3c',
    background: '#ffffff',        // Pure white background
    surface: '#ffffff',
    'surface-variant': '#f5f5f5',
    'on-primary': '#ffffff',      // White text on red-orange buttons
    'on-secondary': '#ffffff',    // White text on orange buttons
    'on-background': '#2e2e2e',   // Dark gray text on white background
    'on-surface': '#424242',      // Dark gray text on surface
    'on-surface-variant': '#616161', // Medium gray text for surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#e64a19',
    'secondary-darken-1': '#ff7043',
  }
}

const darkAutumnTheme = {
  dark: true,
  colors: {
    primary: '#ff5722',
    secondary: '#ff8a65',
    accent: '#8d6e63',
    error: '#d32f2f',
    warning: '#f57c00',
    info: '#1976d2',
    success: '#388e3c',
    background: '#121212',        // Standard dark background
    surface: '#1e1e1e',          // Dark surface
    'surface-variant': '#2e2e2e',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-background': '#ffffff',   // White text on dark background
    'on-surface': '#ffffff',      // White text on dark surface
    'on-surface-variant': '#e0e0e0', // Light gray text for dark surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#e64a19',
    'secondary-darken-1': '#ff7043',
  }
}

// ❄️ Winter Theme - Cool and elegant like winter snow
const winterTheme = {
  dark: false,
  colors: {
    primary: '#2196f3',           // Cool blue
    secondary: '#64b5f6',         // Light blue
    accent: '#90a4ae',            // Blue grey
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50',
    background: '#ffffff',        // Pure white background
    surface: '#ffffff',
    'surface-variant': '#f5f5f5',
    'on-primary': '#ffffff',      // White text on blue buttons
    'on-secondary': '#ffffff',    // White text on light blue buttons
    'on-background': '#2e2e2e',   // Dark gray text on white background
    'on-surface': '#424242',      // Dark gray text on surface
    'on-surface-variant': '#616161', // Medium gray text for surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#1976d2',
    'secondary-darken-1': '#42a5f5',
  }
}

const darkWinterTheme = {
  dark: true,
  colors: {
    primary: '#2196f3',
    secondary: '#64b5f6',
    accent: '#90a4ae',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50',
    background: '#121212',        // Standard dark background
    surface: '#1e1e1e',          // Dark surface
    'surface-variant': '#2e2e2e',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-background': '#ffffff',   // White text on dark background
    'on-surface': '#ffffff',      // White text on dark surface
    'on-surface-variant': '#e0e0e0', // Light gray text for dark surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#1976d2',
    'secondary-darken-1': '#42a5f5',
  }
}

// 💕 Love Theme - Sweet and romantic
const loveTheme = {
  dark: false,
  colors: {
    primary: '#ff4081',           // Pink - Main brand color
    secondary: '#e91e63',         // Deep pink - Secondary actions
    accent: '#ff80ab',            // Light pink - Accents and highlights
    error: '#f44336',             // Red - Error states
    warning: '#ff9800',           // Orange - Warning states
    info: '#2196f3',              // Blue - Info states
    success: '#4caf50',           // Green - Success states
    background: '#ffffff',        // Pure white background
    surface: '#ffffff',           // White - Card/surface background
    'surface-variant': '#f5f5f5', // Light gray variant
    'on-primary': '#ffffff',      // White text on primary
    'on-secondary': '#ffffff',    // White text on secondary
    'on-background': '#2e2e2e',   // Dark gray text on white background
    'on-surface': '#424242',      // Dark gray text on surface
    'on-surface-variant': '#616161', // Medium gray text for surface variant
    'on-error': '#ffffff',        // White text on error
    'primary-darken-1': '#d81b60', // Darker pink
    'secondary-darken-1': '#c2185b', // Darker deep pink
  }
}

const darkLoveTheme = {
  dark: true,
  colors: {
    primary: '#ff4081',
    secondary: '#e91e63',
    accent: '#ff80ab',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50',
    background: '#121212',        // Standard dark background
    surface: '#1e1e1e',          // Dark surface
    'surface-variant': '#2e2e2e',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-background': '#ffffff',   // White text on dark background
    'on-surface': '#ffffff',      // White text on dark surface
    'on-surface-variant': '#e0e0e0', // Light gray text for dark surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#d81b60',
    'secondary-darken-1': '#c2185b',
  }
}

// 🌸 Pastel Romance Theme - Minimalist and elegant
const pastelRomanceTheme = {
  dark: false,
  colors: {
    primary: '#e91e63',           // Deep pink for better contrast
    secondary: '#9c27b0',         // Purple for better contrast
    accent: '#f3e5f5',            // Light purple accent
    error: '#ef5350',
    warning: '#ffa726',
    info: '#42a5f5',
    success: '#66bb6a',
    background: '#ffffff',        // Pure white background
    surface: '#ffffff',
    'surface-variant': '#f5f5f5',
    'on-primary': '#ffffff',      // White text on deep pink
    'on-secondary': '#ffffff',    // White text on purple
    'on-background': '#2e2e2e',   // Dark gray text on white background
    'on-surface': '#424242',      // Dark gray text on surface
    'on-surface-variant': '#616161', // Medium gray text for surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#c2185b',
    'secondary-darken-1': '#7b1fa2',
  }
}

const darkPastelRomanceTheme = {
  dark: true,
  colors: {
    primary: '#e91e63',
    secondary: '#9c27b0',
    accent: '#f3e5f5',
    error: '#ef5350',
    warning: '#ffa726',
    info: '#42a5f5',
    success: '#66bb6a',
    background: '#121212',        // Standard dark background
    surface: '#1e1e1e',          // Dark surface
    'surface-variant': '#2e2e2e',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-background': '#ffffff',   // White text on dark background
    'on-surface': '#ffffff',      // White text on dark surface
    'on-surface-variant': '#e0e0e0', // Light gray text for dark surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#c2185b',
    'secondary-darken-1': '#7b1fa2',
  }
}

// 🌿 Mint Elegance Theme - Fresh and tranquil
const mintEleganceTheme = {
  dark: false,
  colors: {
    primary: '#26a69a',           // Teal for better contrast
    secondary: '#66bb6a',         // Green for better contrast
    accent: '#fff9c4',            // Light yellow accent
    error: '#ef5350',
    warning: '#ffa726',
    info: '#42a5f5',
    success: '#66bb6a',
    background: '#ffffff',        // Pure white background
    surface: '#ffffff',
    'surface-variant': '#f5f5f5',
    'on-primary': '#ffffff',      // White text on teal
    'on-secondary': '#ffffff',    // White text on green
    'on-background': '#2e2e2e',   // Dark gray text on white background
    'on-surface': '#424242',      // Dark gray text on surface
    'on-surface-variant': '#616161', // Medium gray text for surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#00796b',
    'secondary-darken-1': '#4caf50',
  }
}

const darkMintEleganceTheme = {
  dark: true,
  colors: {
    primary: '#26a69a',
    secondary: '#66bb6a',
    accent: '#fff9c4',
    error: '#ef5350',
    warning: '#ffa726',
    info: '#42a5f5',
    success: '#66bb6a',
    background: '#121212',        // Standard dark background
    surface: '#1e1e1e',          // Dark surface
    'surface-variant': '#2e2e2e',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-background': '#ffffff',   // White text on dark background
    'on-surface': '#ffffff',      // White text on dark surface
    'on-surface-variant': '#e0e0e0', // Light gray text for dark surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#00796b',
    'secondary-darken-1': '#4caf50',
  }
}

// ✨ Golden Hour Theme - Warm and luxurious
const goldenHourTheme = {
  dark: false,
  colors: {
    primary: '#ff9800',           // Orange for better contrast
    secondary: '#ff5722',         // Deep orange for better contrast
    accent: '#fff3e0',            // Light orange accent
    error: '#ef5350',
    warning: '#ffa726',
    info: '#42a5f5',
    success: '#66bb6a',
    background: '#ffffff',        // Pure white background
    surface: '#ffffff',
    'surface-variant': '#f5f5f5',
    'on-primary': '#ffffff',      // White text on orange
    'on-secondary': '#ffffff',    // White text on deep orange
    'on-background': '#2e2e2e',   // Dark gray text on white background
    'on-surface': '#424242',      // Dark gray text on surface
    'on-surface-variant': '#616161', // Medium gray text for surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#f57c00',
    'secondary-darken-1': '#e64a19',
  }
}

const darkGoldenHourTheme = {
  dark: true,
  colors: {
    primary: '#ff9800',
    secondary: '#ff5722',
    accent: '#fff3e0',
    error: '#ef5350',
    warning: '#ffa726',
    info: '#42a5f5',
    success: '#66bb6a',
    background: '#121212',        // Standard dark background
    surface: '#1e1e1e',          // Dark surface
    'surface-variant': '#2e2e2e',
    'on-primary': '#ffffff',      // White text on orange
    'on-secondary': '#ffffff',    // White text on deep orange
    'on-background': '#ffffff',   // White text on dark background
    'on-surface': '#ffffff',      // White text on dark surface
    'on-surface-variant': '#e0e0e0', // Light gray text for dark surface variant
    'on-error': '#ffffff',
    'primary-darken-1': '#f57c00',
    'secondary-darken-1': '#e64a19',
  }
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'love',
    themes: {
      // Original 5 themes (PRESERVED)
      spring: springTheme,
      summer: summerTheme,
      autumn: autumnTheme,
      winter: winterTheme,
      love: loveTheme,
      // NEW: 3 Minimalist themes
      pastelRomance: pastelRomanceTheme,
      mintElegance: mintEleganceTheme,
      goldenHour: goldenHourTheme,
      // Dark themes
      darkSpring: darkSpringTheme,
      darkSummer: darkSummerTheme,
      darkAutumn: darkAutumnTheme,
      darkWinter: darkWinterTheme,
      darkLove: darkLoveTheme,
      darkPastelRomance: darkPastelRomanceTheme,
      darkMintElegance: darkMintEleganceTheme,
      darkGoldenHour: darkGoldenHourTheme
    },
    variations: {
      colors: ['primary', 'secondary', 'accent'],
      lighten: 4,
      darken: 4
    }
  },
  defaults: {
    VBtn: {
      variant: 'elevated',
      rounded: 'lg',
      style: 'font-family: "Montserrat", sans-serif; text-transform: none; letter-spacing: 0.5px;'
    },
    VCard: {
      variant: 'elevated',
      rounded: 'xl',
      style: 'transition: all 0.3s ease;'
    },
    VTextField: {
      variant: 'outlined',
      rounded: 'lg',
      style: 'font-family: "Montserrat", sans-serif;'
    },
    VTextarea: {
      variant: 'outlined',
      rounded: 'lg',
      style: 'font-family: "Montserrat", sans-serif;'
    },
    VSelect: {
      variant: 'outlined',
      rounded: 'lg',
      style: 'font-family: "Montserrat", sans-serif;'
    }
  }
})