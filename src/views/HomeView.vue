<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const features = ref([
  {
    icon: 'mdi-heart-multiple',
    titleKey: 'home.features.smartMatching.title',
    descriptionKey: 'home.features.smartMatching.description',
    color: 'primary'
  },
  {
    icon: 'mdi-shield-check',
    titleKey: 'home.features.safe.title',
    descriptionKey: 'home.features.safe.description',
    color: 'secondary'
  },
  {
    icon: 'mdi-chat-heart',
    titleKey: 'home.features.meaningful.title',
    descriptionKey: 'home.features.meaningful.description',
    color: 'accent'
  },
  {
    icon: 'mdi-star-circle',
    titleKey: 'home.features.premium.title',
    descriptionKey: 'home.features.premium.description',
    color: 'info'
  }
])

const stats = ref([
  { number: '50K+', labelKey: 'home.stats.happyCouples' },
  { number: '500K+', labelKey: 'home.stats.activeUsers' },
  { number: '95%', labelKey: 'home.stats.successRate' },
  { number: '24/7', labelKey: 'home.stats.support' }
])
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <v-container fluid class="hero-section pa-0">
      <v-row no-gutters class="min-height-screen align-center">
        <v-col cols="12">
          <v-container class="py-16">
            <v-row justify="center">
              <v-col cols="12" md="8" lg="6" class="text-center">
                <!-- Hero Icon -->
                <div class="mb-8">
                  <v-icon
                    size="120"
                    color="primary"
                    class="hero-icon"
                  >
                    mdi-heart-multiple
                  </v-icon>
                </div>
                
                <!-- Hero Title -->
                <h1 class="text-h2 text-md-h1 font-weight-bold text-primary mb-4">
                  {{ t('home.title') }}
                </h1>
                
                <!-- Hero Subtitle -->
                <p class="text-h5 text-md-h4 text-medium-emphasis mb-8">
                  {{ t('home.subtitle') }}
                </p>
                
                <!-- Hero Description -->
                <p class="text-body-1 text-medium-emphasis mb-12 mx-auto" style="max-width: 600px;">
                  {{ t('home.description') }}
                </p>
                
                <!-- CTA Buttons -->
                <div class="d-flex flex-column flex-sm-row gap-4 justify-center">
                  <v-btn
                    size="x-large"
                    color="primary"
                    variant="elevated"
                    disabled
                    class="px-8"
                  >
                    <v-icon start>mdi-heart-plus</v-icon>
                    {{ t('home.cta.start') }}
                  </v-btn>
                  
                  <v-btn
                    size="x-large"
                    variant="outlined"
                    color="secondary"
                    disabled
                    class="px-8"
                  >
                    <v-icon start>mdi-play-circle</v-icon>
                    {{ t('home.cta.howItWorks') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>

    <!-- Features Section -->
    <v-container class="py-16">
      <v-row justify="center" class="mb-12">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="text-h3 font-weight-bold text-primary mb-4">
            {{ t('home.features.title') }}
          </h2>
          <p class="text-h6 text-medium-emphasis">
            {{ t('home.features.subtitle') }}
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(feature, index) in features"
          :key="index"
          cols="12"
          md="6"
          lg="3"
        >
          <v-card
            class="h-100 text-center pa-6"
            variant="elevated"
            hover
          >
            <v-avatar
              size="80"
              :color="feature.color"
              class="mb-4"
            >
              <v-icon size="40" color="white">
                {{ feature.icon }}
              </v-icon>
            </v-avatar>
            
            <v-card-title class="text-h6 font-weight-bold mb-2">
              {{ t(feature.titleKey) }}
            </v-card-title>
            
            <v-card-text class="text-body-2 text-medium-emphasis">
              {{ t(feature.descriptionKey) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Stats Section -->
    <v-container fluid class="stats-section py-16 bg-surface">
      <v-container>
        <v-row justify="center" class="mb-8">
          <v-col cols="12" class="text-center">
            <h2 class="text-h3 font-weight-bold text-primary mb-4">
              {{ t('home.stats.title') }}
            </h2>
            <p class="text-h6 text-medium-emphasis">
              {{ t('home.stats.subtitle') }}
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="(stat, index) in stats"
            :key="index"
            cols="6"
            md="3"
            class="text-center"
          >
            <div class="stat-item">
              <div class="text-h2 font-weight-bold text-primary mb-2">
                {{ stat.number }}
              </div>
              <div class="text-body-1 text-medium-emphasis">
                {{ t(stat.labelKey) }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- CTA Section -->
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6" class="text-center">
          <v-card
            class="pa-8"
            color="primary"
            variant="elevated"
          >
            <v-card-title class="text-h4 font-weight-bold text-white mb-4">
              {{ t('home.cta2.title') }}
            </v-card-title>
            
            <v-card-text class="text-h6 text-white mb-6 opacity-90">
              {{ t('home.cta2.subtitle') }}
            </v-card-text>
            
            <v-btn
              size="x-large"
              color="white"
              variant="elevated"
              disabled
              class="px-8"
            >
              <v-icon start>mdi-account-plus</v-icon>
              {{ t('home.cta2.signUp') }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, rgba(255, 64, 129, 0.1) 0%, rgba(233, 30, 99, 0.1) 100%);
}

.min-height-screen {
  min-height: 70vh;
}

.hero-icon {
  animation: heartbeat 2s ease-in-out infinite;
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.1);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(1);
  }
}

.gap-4 {
  gap: 1rem;
}

.stat-item {
  padding: 1rem;
}

.stats-section {
  background: rgba(248, 187, 217, 0.3);
}

.v-card {
  transition: transform 0.3s ease;
}

.v-card:hover {
  transform: translateY(-4px);
}
</style>
