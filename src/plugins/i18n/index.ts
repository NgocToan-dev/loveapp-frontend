import { createI18n } from 'vue-i18n'
import en from './en'
import vi from './vi'

const messages = {
  en,
  vi
}

const i18n = createI18n({
  legacy: false,
  locale: 'vi', // Vietnamese as default
  fallbackLocale: 'en',
  globalInjection: true,
  messages,
})

export default i18n
