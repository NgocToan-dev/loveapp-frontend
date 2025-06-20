<template>
  <v-container class="pa-6">
    <div class="text-center mb-8">
      <h1 class="font-heading text-3xl text-primary mb-4">
        💕 Love App Theme Showcase
      </h1>
      <p class="text-lg text-on-surface-variant font-script">
        "Tình yêu là bài thơ đẹp nhất của cuộc đời"
      </p>
    </div>

    <!-- Theme Selector -->
    <v-card class="mb-6 love-card-hover" rounded="xl">
      <v-card-title class="font-heading text-xl">
        🎨 Chọn Theme Yêu Thích
      </v-card-title>
      <v-card-text>
        <v-row>          <v-col cols="12" md="6">
            <v-select
              v-model="selectedTheme"
              :items="themes"
              item-title="name"
              item-value="value"
              label="Theme"
              variant="outlined"
              rounded="lg"
              @update:model-value="changeTheme"
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <span class="mr-3">{{ item.raw.emoji }}</span>
                  </template>
                  <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Theme Preview Cards -->
    <v-row>
      <!-- Typography Showcase -->
      <v-col cols="12" md="6">
        <v-card class="love-card-hover" rounded="xl" height="400">
          <v-card-title class="font-heading">
            ✨ Typography Showcase
          </v-card-title>
          <v-card-text>
            <div class="mb-4">
              <h1 class="font-heading text-2xl mb-2">Playfair Display</h1>
              <p class="font-script text-lg text-primary mb-2">Dancing Script</p>
              <p class="text-base">Montserrat Regular Text</p>
            </div>
            
            <v-divider class="my-4" />
            
            <div>
              <p class="text-sm text-on-surface-variant mb-2">Font Weights:</p>
              <p class="font-weight-light">Light (300)</p>
              <p class="font-weight-regular">Regular (400)</p>
              <p class="font-weight-medium">Medium (500)</p>
              <p class="font-weight-bold">Bold (700)</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Color Palette -->
      <v-col cols="12" md="6">
        <v-card class="love-card-hover" rounded="xl" height="400">
          <v-card-title class="font-heading">
            🎨 Color Palette
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="4" v-for="color in colorPalette" :key="color.name">
                <div class="text-center">
                  <div 
                    :class="`bg-${color.value} rounded-lg mb-2`"
                    style="height: 60px; width: 100%;"
                  ></div>
                  <small class="text-caption">{{ color.name }}</small>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Components Demo -->
      <v-col cols="12" md="6">
        <v-card class="love-card-hover" rounded="xl" height="400">
          <v-card-title class="font-heading">
            🧩 Components Demo
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-column gap-4">
              <v-btn color="primary" rounded="lg" class="romantic-button-hover">
                Primary Button
              </v-btn>
              <v-btn color="secondary" variant="outlined" rounded="lg">
                Secondary Button
              </v-btn>
              <v-text-field
                label="Your Message"
                placeholder="Write something romantic..."
                variant="outlined"
                rounded="lg"
              />
              <v-chip color="primary" variant="elevated" rounded="lg">
                Love Chip
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Animation Demo -->
      <v-col cols="12" md="6">
        <v-card class="love-card-hover" rounded="xl" height="400">
          <v-card-title class="font-heading">
            💫 Animation Demo
          </v-card-title>
          <v-card-text class="text-center">
            <div class="mb-4">
              <v-icon 
                size="48" 
                color="primary" 
                class="animate-gentle-pulse"
              >
                mdi-heart
              </v-icon>
            </div>
            
            <v-btn 
              color="primary" 
              rounded="lg"
              class="romantic-button-hover mb-4"
              @click="triggerHeartAnimation"
            >
              💕 Send Love
            </v-btn>
            
            <div v-if="showHearts" class="heart-container">
              <v-icon 
                v-for="n in 5" 
                :key="n"
                size="24" 
                color="primary" 
                class="floating-heart animate-heart-float"
                :style="{ 
                  left: `${Math.random() * 80 + 10}%`,
                  animationDelay: `${n * 0.2}s`
                }"
              >
                mdi-heart
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Message -->
    <v-alert
      v-if="showSuccessMessage"
      type="success"
      rounded="lg"
      class="mt-4 animate-romantic-fade-in"
      closable
      @click:close="showSuccessMessage = false"
    >
      <template #prepend>
        <v-icon>mdi-heart</v-icon>
      </template>
      <strong>Thành công!</strong> Theme {{ currentThemeName }} đã được áp dụng với typography mới.
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const selectedTheme = ref('love')
const showHearts = ref(false)
const showSuccessMessage = ref(false)

const themes = [
  // Original themes
  { name: '💕 Love (Original)', value: 'love', emoji: '💕', description: 'Classic romantic pink' },
  { name: '🌸 Spring', value: 'spring', emoji: '🌸', description: 'Fresh green vibes' },
  { name: '☀️ Summer', value: 'summer', emoji: '☀️', description: 'Bright and energetic' },
  { name: '🍂 Autumn', value: 'autumn', emoji: '🍂', description: 'Warm autumn colors' },
  { name: '❄️ Winter', value: 'winter', emoji: '❄️', description: 'Cool and elegant' },
  
  // New minimalist themes
  { name: '🌸 Pastel Romance (NEW)', value: 'pastelRomance', emoji: '🌸', description: 'Hồng pastel tối giản' },
  { name: '🌿 Mint Elegance (NEW)', value: 'mintElegance', emoji: '🌿', description: 'Xanh mint thanh lịch' },
  { name: '✨ Golden Hour (NEW)', value: 'goldenHour', emoji: '✨', description: 'Vàng đồng sang trọng' }
]

const colorPalette = computed(() => [
  { name: 'Primary', value: 'primary' },
  { name: 'Secondary', value: 'secondary' },
  { name: 'Accent', value: 'accent' },
  { name: 'Background', value: 'background' },
  { name: 'Surface', value: 'surface' },
  { name: 'Success', value: 'success' }
])

const currentThemeName = computed(() => {
  const current = themes.find(t => t.value === selectedTheme.value)
  return current?.name || 'Unknown'
})

const changeTheme = (newTheme: string) => {
  theme.global.name.value = newTheme
  showSuccessMessage.value = true
  
  // Auto hide success message
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

const triggerHeartAnimation = () => {
  showHearts.value = true
  setTimeout(() => {
    showHearts.value = false
  }, 2000)
}

onMounted(() => {
  // Set initial theme
  changeTheme(selectedTheme.value)
})
</script>

<style scoped>
/* Import animation styles */
@import '@/assets/styles/animations.scss';

.heart-container {
  position: relative;
  height: 100px;
  overflow: hidden;
}

.floating-heart {
  position: absolute;
  bottom: 0;
}

.font-heading {
  font-family: 'Playfair Display', Georgia, serif !important;
}

.font-script {
  font-family: 'Dancing Script', cursive !important;
}

/* Override Vuetify classes for demo */
.text-3xl {
  font-size: clamp(2rem, 1.7rem + 1.5vw, 3rem) !important;
}

.text-2xl {
  font-size: clamp(1.5rem, 1.3rem + 1vw, 2rem) !important;
}

.text-xl {
  font-size: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem) !important;
}

.text-lg {
  font-size: clamp(1.125rem, 1rem + 0.625vw, 1.25rem) !important;
}

/* Card hover effect */
.love-card-hover {
  transition: all 0.3s ease;
  cursor: pointer;
}

.love-card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(255, 182, 193, 0.2);
}

/* Button hover effect */
.romantic-button-hover {
  transition: all 0.15s ease-in-out;
}

.romantic-button-hover:hover {
  transform: translateY(-2px);
}

/* Animation utility classes */
.animate-gentle-pulse {
  animation: gentlePulse 2s ease-in-out infinite;
}

.animate-heart-float {
  animation: heartFloat 2s ease-in-out;
}

.animate-romantic-fade-in {
  animation: romanticFadeIn 0.6s ease-out;
}

/* Keyframes */
@keyframes gentlePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

@keyframes heartFloat {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-40px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes romanticFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
