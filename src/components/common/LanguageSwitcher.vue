<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span class="font-medium">{{ currentLanguage.label }}</span>
      <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': showDropdown }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div 
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div class="py-1">
        <button
          v-for="language in languages"
          :key="language.code"
          @click="changeLanguage(language.code)"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          :class="{ 'bg-primary-50 text-primary-700': currentLocale === language.code }"
        >
          <span class="text-lg mr-3">{{ language.flag }}</span>
          <span>{{ language.label }}</span>
          <svg v-if="currentLocale === language.code" class="h-4 w-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const showDropdown = ref(false)

const languages = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' }
]

const currentLocale = computed(() => locale.value)

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === currentLocale.value) || languages[0]
})

const changeLanguage = (langCode: string) => {
  locale.value = langCode
  localStorage.setItem('loveapp-locale', langCode)
  showDropdown.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  // Load saved language preference
  const savedLocale = localStorage.getItem('loveapp-locale')
  if (savedLocale && languages.some(lang => lang.code === savedLocale)) {
    locale.value = savedLocale
  }
  
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
