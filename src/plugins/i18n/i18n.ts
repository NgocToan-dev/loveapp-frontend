import { createI18n } from 'vue-i18n'
import vi from './vn'
import en from './en'

const i18n = createI18n({
  legacy: false,
  locale: 'vi', // Default to Vietnamese
  fallbackLocale: 'en',
  messages: {
    vi,
    en
  }
})

export default i18n