<template>
  <v-container class="love-demo-container">
    <v-row>
      <v-col cols="12">
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-medium text-high-emphasis mb-3">
            🎨 Cảm Nhận Tình Yêu Qua Màu Sắc
          </h2>
          <p class="text-h6 text-medium-emphasis">
            Mỗi gam màu là một câu chuyện, mỗi sắc thái là một cảm xúc
          </p>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <!-- Gentle Theme Cards -->
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="theme in availableThemes"
        :key="theme.key"
      >
        <v-card 
          :class="[
            'love-demo-card',
            'love-theme-card',
            getThemeClass('demo-card'),
            { 'current-love-demo-theme': currentTheme === theme.key }
          ]"
          :style="getLoveDemoCardStyle(theme)"
          elevation="0"
          rounded="xl"
          @click="setTheme(theme.key)"
        >
          <v-card-text class="pa-6 text-center">
            <!-- Gentle Animated Icon -->
            <div 
              :class="[
                'love-demo-icon-container',
                'mb-4',
                getAnimationClass(theme.key)
              ]"
            >
              <v-avatar
                :color="theme.colors.primary"
                size="56"
                class="love-demo-avatar"
              >
                <v-icon :icon="theme.icon" size="28" color="white"></v-icon>
              </v-avatar>
            </div>

            <!-- Loving Theme Info -->
            <h3 class="text-h6 font-weight-medium mb-2 text-high-emphasis">
              {{ theme.name }}
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-4" style="line-height: 1.5;">
              {{ theme.description }}
            </p>

            <!-- Gentle Color Palette -->
            <div class="love-demo-color-palette mb-4">
              <div class="d-flex justify-center">
                <div
                  v-for="(color, index) in Object.values(theme.colors)"
                  :key="index"
                  class="love-demo-color-swatch"
                  :style="{ backgroundColor: color }"
                  :title="Object.keys(theme.colors)[index]"
                ></div>
              </div>
            </div>

            <!-- Soft Sample Elements -->
            <div class="love-sample-elements mb-3">
              <v-btn
                color="primary"
                variant="elevated"
                size="small"
                class="mb-2 mr-2"
                prepend-icon="mdi-plus"
                to="/memories"
              >
                Thêm Kỷ Niệm
              </v-btn>
              <v-chip
                color="secondary"
                variant="elevated"
                size="small"
                class="mb-2"
                elevation="0"
              >
                <v-icon start :icon="theme.icon"></v-icon>
                Ghi Chú
              </v-chip>
            </div>

            <!-- Gentle Current Theme Indicator -->
            <v-fade-transition>
              <v-chip
                v-if="currentTheme === theme.key"
                color="success"
                variant="elevated"
                class="mt-2"
                size="small"
                elevation="0"
              >
                <v-icon start size="14">mdi-heart</v-icon>
                Đang yêu thích
              </v-chip>
            </v-fade-transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Current Love Theme Display -->
    <v-row class="mt-10">
      <v-col cols="12">
        <v-card 
          class="love-theme-card love-current-display"
          :style="getCurrentLoveDemoStyle()"
          elevation="0"
          rounded="xl"
        >
          <v-card-text class="pa-8 text-center">
            <div :class="['love-current-icon', getAnimationClass(currentTheme)]">
              <v-avatar
                :color="currentThemeInfo?.colors.primary"
                size="72"
                class="mb-4 love-main-avatar"
              >
                <v-icon 
                  :icon="currentThemeInfo?.icon" 
                  size="36" 
                  color="white"
                ></v-icon>
              </v-avatar>
            </div>
            
            <h2 class="text-h3 font-weight-medium mb-3 text-primary">
              {{ currentThemeInfo?.name }}
            </h2>
            <p class="text-h6 text-medium-emphasis mb-6" style="line-height: 1.4;">
              {{ currentThemeInfo?.description }}
            </p>
            
            <div class="d-flex justify-center align-center flex-wrap gap-3">
              <v-chip
                color="orange-lighten-1"
                variant="elevated"
                class="ma-1"
                elevation="0"
              >
                <v-icon start size="16">mdi-weather-sunny</v-icon>
                {{ getThemeMoodText() }}
              </v-chip>
              
              <v-chip
                color="secondary"
                variant="elevated"
                class="ma-1"
                elevation="0"
              >
                <v-icon start size="16">mdi-palette-outline</v-icon>
                Gam màu tình yêu
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAppTheme } from '@/composables/useAppTheme'

const {
  currentTheme,
  currentThemeInfo,
  availableThemes,
  setTheme,
  getThemeClass,
  getSeasonalAnimation
} = useAppTheme()

const getAnimationClass = (themeKey: string) => {
  const animations = {
    spring: 'spring-sway',
    summer: 'summer-glow',
    autumn: 'autumn-fall', 
    winter: 'winter-shimmer',
    love: 'love-heartbeat'
  }
  return animations[themeKey as keyof typeof animations] || 'theme-bounce'
}

const getLoveDemoCardStyle = (theme: any) => {
  return {
    background: `linear-gradient(135deg, ${theme.colors.primary}06, ${theme.colors.secondary}04, ${theme.colors.accent}03)`,
    border: currentTheme.value === theme.key 
      ? `1.5px solid ${theme.colors.primary}50` 
      : `1px solid ${theme.colors.primary}25`,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.6, 1)'
  }
}

const getCurrentLoveDemoStyle = () => {
  const colors = currentThemeInfo.value?.colors
  if (!colors) return {}
  
  return {
    background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}08, ${colors.accent}06)`,
    border: `2px solid ${colors.primary}40`
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

  return moodTexts[currentTheme.value as keyof typeof moodTexts] || 'Ánh nắng ấm áp'
}

// Clean functions removed - using global CSS for contrast
</script>

<style scoped lang="scss">
.love-demo-container {
  padding: 2rem 0;
}

.love-demo-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
  }
  
  &.current-love-demo-theme {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1) !important;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
    }
  }
}

.love-demo-avatar {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.love-demo-card:hover .love-demo-avatar {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transform: scale(1.04);
}

.love-main-avatar {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.love-demo-color-swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.9);
  margin: 0 3px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.15);
  }
}

.love-demo-color-palette {
  margin-bottom: 1rem;
}

.love-current-display {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.6, 1);
}

.love-demo-icon-container {
  transition: all 0.3s ease;
}

// Clean component styling

// Clean styling without contrast hacks - let Vuetify themes handle it
.love-demo-container {
  // Gentle shadows and animations
  .v-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
      transform: translateY(-1px);
    }
  }
  
  .v-chip {
    box-shadow: none !important;
  }
}

// Removed manual color overrides - Vuetify themes handle this automatically

// Gentle seasonal animation classes
.spring-sway {
  animation: gentleSway 4s ease-in-out infinite;
}

.summer-glow {
  animation: gentleGlow 3s ease-in-out infinite alternate;
}

.autumn-fall {
  animation: gentleFall 5s ease-in-out infinite;
}

.winter-shimmer {
  animation: gentleShimmer 4s linear infinite;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,0.2) 50%,
      transparent 100%
    );
    animation: gentleShimmer 4s linear infinite;
    border-radius: inherit;
  }
}

.love-heartbeat {
  animation: gentleHeartbeat 2s ease-in-out infinite;
}

// Gentler keyframes
@keyframes gentleSway {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(2px) rotate(0.5deg); }
  75% { transform: translateX(-2px) rotate(-0.5deg); }
}

@keyframes gentleGlow {
  0% { box-shadow: 0 0 5px rgba(255, 193, 7, 0.2); }
  100% { box-shadow: 0 0 15px rgba(255, 193, 7, 0.4), 0 0 20px rgba(255, 152, 0, 0.3); }
}

@keyframes gentleFall {
  0% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(2px) rotate(1deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(-1px) rotate(-1deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

@keyframes gentleShimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes gentleHeartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

// Responsive love
@media (max-width: 960px) {
  .love-demo-card:hover {
    transform: translateY(-2px);
  }
  
  .current-love-demo-theme {
    transform: translateY(-1px);
    
    &:hover {
      transform: translateY(-3px);
    }
  }
}

@media (max-width: 600px) {
  .love-demo-container {
    padding: 1rem 0;
  }
  
  .love-demo-card:hover {
    transform: translateY(-1px);
  }
  
  .current-love-demo-theme {
    transform: translateY(-0.5px);
    
    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style> 