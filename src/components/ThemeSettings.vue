<template>
  <v-card class="theme-settings-card" elevation="0" rounded="xl">
    <v-card-title class="pa-6">
      <div class="d-flex align-center">
        <v-icon size="28" color="primary" class="me-3">mdi-palette</v-icon>
        <span class="text-h5 font-weight-medium">Trang Trí Tình Yêu</span>
      </div>
      <p class="text-body-2 text-medium-emphasis mt-2 mb-0">Chọn gam màu phù hợp với tâm trạng của hai người</p>
    </v-card-title>

    <v-divider class="soft-divider"></v-divider>

    <v-card-text class="pa-6">
      <!-- Dark Mode Toggle -->
      <div class="mb-8">
        <div class="gentle-section-card pa-4">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon 
                :icon="themeStore.isDarkMode ? 'mdi-weather-night' : 'mdi-weather-sunny'" 
                size="24" 
                :color="themeStore.isDarkMode ? 'indigo-lighten-1' : 'orange-lighten-1'"
                class="me-3"
              ></v-icon>
              <div>
                <div class="text-subtitle-1 font-weight-medium text-high-emphasis">
                  {{ themeStore.isDarkMode ? 'Ánh nến lung linh' : getThemeMoodText() }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ themeStore.isDarkMode ? 'Không gian riêng tư, ấm cúng' : 'Tươi sáng, tràn đầy năng lượng' }}
                </div>
              </div>
            </div>
            <v-switch
              v-model="themeStore.isDarkMode"
              @change="handleDarkModeToggle"
              color="primary"
              hide-details
              inset
            ></v-switch>
          </div>
        </div>
      </div>

      <!-- Theme Selection -->
      <div class="mb-6">
        <h3 class="text-h6 font-weight-medium mb-2 text-high-emphasis d-flex align-center">
          <v-icon size="20" class="me-2">mdi-heart-outline</v-icon>
          Chọn Cảm Xúc Yêu Thương
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">Mỗi gam màu mang một câu chuyện tình yêu riêng</p>
        
        <v-row>
          <v-col
            v-for="theme in themeStore.availableThemes"
            :key="theme.key"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              :class="[
                'love-theme-card',
                'pa-0',
                'cursor-pointer',
                'position-relative',
                { 'selected-love-theme': themeStore.currentTheme === theme.key }
              ]"
              :elevation="themeStore.currentTheme === theme.key ? 2 : 0"
              rounded="xl"
              @click="selectTheme(theme.key)"
              :style="getLoveThemeCardStyle(theme)"
            >
              <!-- Gentle selection indicator -->
              <div
                v-if="themeStore.currentTheme === theme.key"
                class="love-selection-indicator"
              >
                <v-icon color="white" size="16">mdi-heart</v-icon>
              </div>

              <v-card-text class="pa-5 text-center">
                <!-- Gentle Theme Icon -->
                <div class="love-theme-icon mb-3">
                  <v-avatar
                    :color="theme.colors.primary"
                    size="48"
                    class="love-theme-avatar"
                  >
                    <v-icon 
                      :icon="theme.icon" 
                      size="22" 
                      color="white"
                    ></v-icon>
                  </v-avatar>
                </div>

                <!-- Loving Theme Info -->
                <div class="love-theme-info">
                  <h4 class="text-subtitle-1 font-weight-medium mb-1 text-high-emphasis">
                    {{ theme.name }}
                  </h4>
                  <p class="text-caption text-medium-emphasis mb-3" style="line-height: 1.4;">
                    {{ theme.description }}
                  </p>
                </div>

                <!-- Gentle Color Preview -->
                <div class="love-color-preview d-flex justify-center">
                  <div
                    class="love-color-dot"
                    :style="{ backgroundColor: theme.colors.primary }"
                  ></div>
                  <div
                    class="love-color-dot"
                    :style="{ backgroundColor: theme.colors.secondary }"
                  ></div>
                  <div
                    class="love-color-dot"
                    :style="{ backgroundColor: theme.colors.accent }"
                  ></div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Current Theme Love Note -->
      <div class="love-current-theme mt-6">
        <v-card
          class="gentle-section-card pa-4"
          :style="getCurrentLoveThemeStyle()"
          elevation="0"
          rounded="lg"
        >
          <div class="d-flex align-center">
            <v-avatar
              :color="themeStore.currentThemeInfo?.colors.primary"
              size="40"
              class="me-3"
            >
              <v-icon 
                :icon="themeStore.currentThemeInfo?.icon" 
                size="20" 
                color="white"
              ></v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-subtitle-1 font-weight-medium text-high-emphasis">
                Hiện tại: {{ themeStore.currentThemeInfo?.name }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{ themeStore.currentThemeInfo?.description }}
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { useTheme } from 'vuetify'
import { watch } from 'vue'

const themeStore = useThemeStore()
const vuetifyTheme = useTheme()

// Initialize theme on component mount
themeStore.initializeTheme()

// Watch for theme changes and apply to Vuetify
watch(
  () => themeStore.currentTheme,
  (newTheme) => {
    const themeName = themeStore.isDarkMode ? `dark${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}` : newTheme
    vuetifyTheme.global.name.value = themeName
  },
  { immediate: true }
)

watch(
  () => themeStore.isDarkMode,
  (isDark) => {
    const currentTheme = themeStore.currentTheme
    const themeName = isDark ? `dark${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}` : currentTheme
    vuetifyTheme.global.name.value = themeName
  }
)

const selectTheme = (themeKey: string) => {
  themeStore.setTheme(themeKey)
}

const handleDarkModeToggle = () => {
  themeStore.toggleDarkMode()
}

const getLoveThemeCardStyle = (theme: any) => {
  return {
    background: `linear-gradient(135deg, ${theme.colors.primary}08, ${theme.colors.secondary}06)`,
    border: themeStore.currentTheme === theme.key 
      ? `1.5px solid ${theme.colors.primary}40` 
      : `1px solid ${theme.colors.primary}20`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.6, 1)'
  }
}

const getCurrentLoveThemeStyle = () => {
  const colors = themeStore.currentThemeInfo?.colors
  if (!colors) return {}
  
  return {
    background: `linear-gradient(135deg, ${colors.primary}12, ${colors.secondary}08)`,
    border: `1px solid ${colors.primary}25`
  }
}

const getThemeMoodText = () => {
  const moodTexts = {
    spring: 'Tươi mát xuân về',
    summer: 'Rực rỡ mùa hè', 
    autumn: 'Ấm áp thu sang',
    winter: 'Thanh lịnh mùa đông',
    love: 'Ngọt ngào tình yêu'
  }
  return moodTexts[themeStore.currentTheme as keyof typeof moodTexts] || 'Ánh nắng ấm áp'
}
</script>

<style scoped lang="scss">
.theme-settings-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
}

.soft-divider {
  opacity: 0.3;
}

.gentle-section-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.love-theme-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
  }
  
  &.selected-love-theme {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
    
    &:hover {
      transform: translateY(-3px);
    }
  }
}

.love-selection-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.love-theme-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.love-theme-card:hover .love-theme-avatar {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.03);
}

.love-color-preview {
  gap: 6px;
}

.love-color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.9);
}

.cursor-pointer {
  cursor: pointer;
}

.love-current-theme {
  .gentle-section-card {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.6, 1);
  }
}

// Dark theme adjustments
.v-theme--dark {
  .theme-settings-card {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .gentle-section-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

// Responsive love
@media (max-width: 600px) {
  .love-theme-card:hover {
    transform: translateY(-1px);
  }
  
  .selected-love-theme {
    transform: translateY(-0.5px);
    
    &:hover {
      transform: translateY(-1.5px);
    }
  }
}
</style> 