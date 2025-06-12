import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Love Theme Configuration
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
    background: '#fce4ec',        // Very light pink - Page background
    surface: '#ffffff',           // White - Card/surface background
    'surface-variant': '#f8bbd9', // Light pink variant
    'on-primary': '#ffffff',      // White text on primary
    'on-secondary': '#ffffff',    // White text on secondary
    'on-background': '#333333',   // Dark text on background
    'on-surface': '#333333',      // Dark text on surface
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
    background: '#121212',
    surface: '#1e1e1e',
    'surface-variant': '#2d1b2b',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
    'on-background': '#ffffff',
    'on-surface': '#ffffff',
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
    defaultTheme: 'loveTheme',
    themes: {
      loveTheme,
      darkLoveTheme
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