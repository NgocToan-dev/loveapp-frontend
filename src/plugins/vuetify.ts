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
    background: '#f8fffe',        // Very light green background
    surface: '#ffffff',
    'surface-variant': '#f1f8e9',
    'on-primary': '#ffffff',      // White text on primary buttons
    'on-secondary': '#000000',    // Black text on light green buttons (better contrast)
    'on-background': '#1b5e20',   // Dark green text on light background
    'on-surface': '#2e7d32',      // Dark green text on surface
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
    background: '#0d1f0f',
    surface: '#1b2a1d',
    'surface-variant': '#2e3f2f',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-background': '#c8e6c9',   // Light green text on dark background
    'on-surface': '#a5d6a7',     // Light green text on dark surface
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
    background: '#fffef7',        // Light yellow background
    surface: '#ffffff',
    'surface-variant': '#fff8e1',
    'on-primary': '#ffffff',      // White text on orange buttons
    'on-secondary': '#000000',    // Black text on yellow buttons (better contrast)
    'on-background': '#e65100',   // Dark orange text on light background
    'on-surface': '#ef6c00',      // Dark orange text on surface
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
    background: '#1f1b0a',
    surface: '#2a1f0d',
    'surface-variant': '#3f2f1a',
    'on-primary': '#ffffff',
    'on-secondary': '#000000',
    'on-background': '#ffe0b2',   // Light orange text on dark background
    'on-surface': '#ffcc80',     // Light orange text on dark surface
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
    background: '#fff9f5',        // Light orange background
    surface: '#ffffff',
    'surface-variant': '#fbe9e7',
    'on-primary': '#ffffff',      // White text on red-orange buttons
    'on-secondary': '#000000',    // Black text on light orange buttons (better contrast)
    'on-background': '#bf360c',   // Dark red-orange text on light background
    'on-surface': '#d84315',      // Dark orange text on surface
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
    background: '#1f170d',
    surface: '#2a1a15',
    'surface-variant': '#3f2a20',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-background': '#ffccbc',   // Light orange text on dark background
    'on-surface': '#ffab91',     // Light orange text on dark surface
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
    background: '#f8fbff',        // Very light blue background
    surface: '#ffffff',
    'surface-variant': '#e3f2fd',
    'on-primary': '#ffffff',      // White text on blue buttons
    'on-secondary': '#000000',    // Black text on light blue buttons (better contrast)
    'on-background': '#0d47a1',   // Dark blue text on light background
    'on-surface': '#1565c0',      // Dark blue text on surface
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
    background: '#0a1220',
    surface: '#0d1421',
    'surface-variant': '#162537',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-background': '#bbdefb',   // Light blue text on dark background
    'on-surface': '#90caf9',     // Light blue text on dark surface
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
    background: '#fff8fb',        // Very light pink - Page background
    surface: '#ffffff',           // White - Card/surface background
    'surface-variant': '#fce4ec', // Light pink variant
    'on-primary': '#ffffff',      // White text on primary
    'on-secondary': '#ffffff',    // White text on secondary
    'on-background': '#880e4f',   // Dark pink text on background
    'on-surface': '#ad1457',      // Dark pink text on surface
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
    background: '#1f0d18',
    surface: '#2a1420',
    'surface-variant': '#3f2535',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-background': '#f8bbd9',   // Light pink text on dark background
    'on-surface': '#f48fb1',     // Light pink text on dark surface
    'on-error': '#ffffff',
    'primary-darken-1': '#d81b60',
    'secondary-darken-1': '#c2185b',
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
      // Light themes
      spring: springTheme,
      summer: summerTheme,
      autumn: autumnTheme,
      winter: winterTheme,
      love: loveTheme,
      // Dark themes
      darkSpring: darkSpringTheme,
      darkSummer: darkSummerTheme,
      darkAutumn: darkAutumnTheme,
      darkWinter: darkWinterTheme,
      darkLove: darkLoveTheme
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
      rounded: 'lg'
    },
    VCard: {
      variant: 'elevated',
      rounded: 'lg'
    },
    VTextField: {
      variant: 'outlined',
      rounded: 'lg'
    },
    VTextarea: {
      variant: 'outlined',
      rounded: 'lg'
    },
    VSelect: {
      variant: 'outlined',
      rounded: 'lg'
    }
  }
})