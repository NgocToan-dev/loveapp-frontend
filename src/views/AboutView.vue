<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const team = ref([
  {
    nameKey: 'about.team.sarah.name',
    roleKey: 'about.team.sarah.role',
    avatar: 'https://via.placeholder.com/120x120/ff4081/ffffff?text=SJ',
    bioKey: 'about.team.sarah.bio'
  },
  {
    nameKey: 'about.team.michael.name',
    roleKey: 'about.team.michael.role',
    avatar: 'https://via.placeholder.com/120x120/e91e63/ffffff?text=MC',
    bioKey: 'about.team.michael.bio'
  },
  {
    nameKey: 'about.team.emily.name',
    roleKey: 'about.team.emily.role',
    avatar: 'https://via.placeholder.com/120x120/ff80ab/ffffff?text=ER',
    bioKey: 'about.team.emily.bio'
  }
])

const values = ref([
  {
    icon: 'mdi-heart-outline',
    titleKey: 'about.values.authentic.title',
    descriptionKey: 'about.values.authentic.description'
  },
  {
    icon: 'mdi-shield-heart',
    titleKey: 'about.values.safety.title',
    descriptionKey: 'about.values.safety.description'
  },
  {
    icon: 'mdi-account-group',
    titleKey: 'about.values.inclusive.title',
    descriptionKey: 'about.values.inclusive.description'
  },
  {
    icon: 'mdi-lightbulb-on',
    titleKey: 'about.values.innovation.title',
    descriptionKey: 'about.values.innovation.description'
  }
])
</script>

<template>
  <div class="about-page">
    <!-- Hero Section -->
    <v-container fluid class="hero-section pa-0">
      <v-row no-gutters class="min-height-50 align-center">
        <v-col cols="12">
          <v-container class="py-16">
            <v-row justify="center">
              <v-col cols="12" md="8" class="text-center">
                <v-icon
                  size="80"
                  color="primary"
                  class="mb-6"
                >
                  mdi-information-outline
                </v-icon>
                
                <h1 class="text-h2 text-md-h1 font-weight-bold text-primary mb-4">
                  {{ t('about.title') }}
                </h1>
                
                <p class="text-h6 text-medium-emphasis mb-8">
                  {{ t('about.subtitle') }}
                </p>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>

    <!-- Story Section -->
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="pa-8" variant="elevated">
            <v-card-title class="text-h4 font-weight-bold text-primary mb-6 text-center">
              {{ t('about.story.title') }}
            </v-card-title>
            
            <v-card-text class="text-body-1 text-medium-emphasis">
              <p class="mb-4">
                {{ t('about.story.content1') }}
              </p>
              
              <p class="mb-4">
                {{ t('about.story.content2') }}
              </p>
              
              <p class="mb-0">
                {{ t('about.story.content3') }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Values Section -->
    <v-container fluid class="values-section py-16 bg-surface">
      <v-container>
        <v-row justify="center" class="mb-12">
          <v-col cols="12" md="8" class="text-center">
            <h2 class="text-h3 font-weight-bold text-primary mb-4">
              {{ t('about.values.title') }}
            </h2>
            <p class="text-h6 text-medium-emphasis">
              {{ t('about.values.subtitle') }}
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="(value, index) in values"
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
                color="primary"
                class="mb-4"
              >
                <v-icon size="40" color="white">
                  {{ value.icon }}
                </v-icon>
              </v-avatar>
              
              <v-card-title class="text-h6 font-weight-bold mb-2">
                {{ t(value.titleKey) }}
              </v-card-title>
              
              <v-card-text class="text-body-2 text-medium-emphasis">
                {{ t(value.descriptionKey) }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Team Section -->
    <v-container class="py-16">
      <v-row justify="center" class="mb-12">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="text-h3 font-weight-bold text-primary mb-4">
            {{ t('about.team.title') }}
          </h2>
          <p class="text-h6 text-medium-emphasis">
            {{ t('about.team.subtitle') }}
          </p>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col
          v-for="(member, index) in team"
          :key="index"
          cols="12"
          md="4"
          class="d-flex"
        >
          <v-card
            class="h-100 text-center pa-6"
            variant="elevated"
            hover
          >
            <v-avatar
              size="120"
              class="mb-4"
            >
              <v-img :src="member.avatar" :alt="t(member.nameKey)" />
            </v-avatar>
            
            <v-card-title class="text-h6 font-weight-bold mb-1">
              {{ t(member.nameKey) }}
            </v-card-title>
            
            <v-card-subtitle class="text-primary font-weight-medium mb-3">
              {{ t(member.roleKey) }}
            </v-card-subtitle>
            
            <v-card-text class="text-body-2 text-medium-emphasis">
              {{ t(member.bioKey) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Contact Section -->
    <v-container fluid class="contact-section py-16 bg-primary">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6" class="text-center">
            <h2 class="text-h3 font-weight-bold text-white mb-4">
              {{ t('about.contact.title') }}
            </h2>
            
            <p class="text-h6 text-white mb-8 opacity-90">
              {{ t('about.contact.subtitle') }}
            </p>
            
            <div class="d-flex flex-column flex-sm-row gap-4 justify-center">
              <v-btn
                size="large"
                color="white"
                variant="elevated"
                disabled
                class="px-8"
              >
                <v-icon start>mdi-email</v-icon>
                {{ t('about.contact.support') }}
              </v-btn>
              
              <v-btn
                size="large"
                variant="outlined"
                color="white"
                disabled
                class="px-8"
              >
                <v-icon start>mdi-help-circle</v-icon>
                {{ t('about.contact.faq') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, rgba(255, 64, 129, 0.1) 0%, rgba(233, 30, 99, 0.1) 100%);
}

.min-height-50 {
  min-height: 50vh;
}

.values-section {
  background: rgba(248, 187, 217, 0.3);
}

.contact-section {
  background: linear-gradient(135deg, #ff4081 0%, #e91e63 100%);
}

.gap-4 {
  gap: 1rem;
}

.v-card {
  transition: transform 0.3s ease;
}

.v-card:hover {
  transform: translateY(-4px);
}
</style>
