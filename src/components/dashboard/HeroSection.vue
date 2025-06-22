<template>
  <v-container fluid class="hero-section pa-0">
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          class="hero-card position-relative overflow-hidden"
          :height="heroHeight"
          rounded="xl"
          elevation="0"
        >
          <!-- Background Image with Overlay -->
          <div class="hero-background" :style="backgroundStyle">
            <div class="hero-overlay"></div>
          </div>

          <!-- Content -->
          <v-card-text
            class="hero-content d-flex flex-column justify-center align-center text-center pa-8"
          >
            <!-- Couple Image -->
            <div class="couple-avatar-container mb-6 animate-romantic-fade-in">
              <v-avatar size="120" class="couple-avatar elevation-8">
                <v-img
                  :src="coupleImage || defaultCoupleImage"
                  :alt="`${userName} & ${partnerName}`"
                  cover
                />
              </v-avatar>

              <!-- Love Icon -->
              <div class="love-icon-container">
                <v-icon size="24" color="white" class="love-icon animate-gentle-pulse">
                  mdi-heart
                </v-icon>
              </div>
            </div>

            <!-- Welcome Message -->
            <div class="welcome-text mb-4">
              <h1 class="hero-title font-heading text-white mb-2">
                {{ welcomeMessage }}
              </h1>
              <p class="hero-subtitle font-script text-white opacity-90">
                {{ loveSubtitle }}
              </p>
            </div>

            <!-- Quick Stats -->
            <div class="quick-stats-container">
              <v-row justify="center" no-gutters>
                <v-col cols="auto" class="mx-2">
                  <div class="stat-item text-center">
                    <div class="stat-number font-heading text-white">
                      {{ daysTogether }}
                    </div>
                    <div class="stat-label text-white opacity-75">
                      {{ $t("dashboard.hero.daysTogether") }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="auto" class="mx-2">
                  <div class="stat-divider"></div>
                </v-col>
                <v-col cols="auto" class="mx-2">
                  <div class="stat-item text-center">
                    <div class="stat-number font-heading text-white">
                      {{ totalMemories }}
                    </div>
                    <div class="stat-label text-white opacity-75">
                      {{ $t("dashboard.hero.memories") }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="auto" class="mx-2"> <div class="stat-divider"></div> </v-col>
              </v-row>
            </div>

            <!-- Action Button -->
            <v-btn
              color="white"
              variant="elevated"
              rounded="xl"
              size="large"
              class="hero-action-btn mt-6 romantic-button-hover"
              @click="$emit('createMemory')"
            >
              <v-icon start>mdi-plus</v-icon>
              {{ $t("dashboard.hero.createNewMemory") }}
            </v-btn>
          </v-card-text>

          <!-- Floating Hearts Animation -->
          <div v-if="showFloatingHearts" class="floating-hearts-container">
            <v-icon
              v-for="n in 6"
              :key="n"
              size="16"
              color="white"
              class="floating-heart animate-floating-hearts"
              :style="{
                left: `${Math.random() * 90 + 5}%`,
                animationDelay: `${n * 1.5}s`,
                opacity: 0.6,
              }"
            >
              mdi-heart
            </v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useMemoriesStore } from "@/stores/memories";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

// Props
interface Props {
  coupleImage?: string;
  backgroundImage?: string;
  height?: string | number;
}

const props = withDefaults(defineProps<Props>(), {});

// Emits
defineEmits<{
  createMemory: [];
}>();

// Stores
const authStore = useAuthStore();
const memoriesStore = useMemoriesStore();

// Router
const router = useRouter();

// I18n
const { t } = useI18n();

// Refs
const showFloatingHearts = ref(false);

// Computed
const heroHeight = computed(() => {
  return typeof props.height === "number" ? `${props.height}px` : props.height;
});

const userName = computed(
  () => authStore.user?.displayName || t("dashboard.hero.defaultUser")
);
const partnerName = computed(() => t("dashboard.hero.defaultPartner")); // TODO: Get from couples store

const welcomeMessage = computed(() => {
  const hour = new Date().getHours();
  let greeting = t("dashboard.hero.greetings.evening");

  if (hour < 12) greeting = t("dashboard.hero.greetings.morning");
  else if (hour < 18) greeting = t("dashboard.hero.greetings.afternoon");

  return `${greeting}, ${userName.value}! 💕`;
});

const loveSubtitle = computed(() => {
  const messageKey = "dashboard.hero.loveSubtitles";
  const messages = (t(messageKey, { returnObjects: true }) as unknown) as string[];
  if (Array.isArray(messages)) {
    const today = new Date().getDate();
    return messages[today % messages.length];
  }
  return t("dashboard.hero.loveSubtitles.0"); // Fallback
});

const daysTogether = computed(() => {
  // TODO: Get from couples store - anniversary date
  const startDate = dayjs("2024-01-01"); // Placeholder
  return dayjs().diff(startDate, "day");
});

const totalMemories = computed(() => memoriesStore.totalMemories || 0);

const defaultCoupleImage = computed(() => {
  return "/src/assets/images/default-couple.jpg"; // Placeholder
});

const backgroundStyle = computed(() => {
  const defaultBg = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  if (props.backgroundImage) {
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return {
    background: defaultBg,
  };
});

// Methods
const startFloatingHearts = () => {
  showFloatingHearts.value = true;
  setTimeout(() => {
    showFloatingHearts.value = false;
  }, 8000);
};

const handleCreateMemory = () => {
  router.push("/memories/create");
};

// Lifecycle
onMounted(() => {
  // Start floating hearts animation periodically
  setInterval(() => {
    if (Math.random() > 0.7) {
      startFloatingHearts();
    }
  }, 15000);
});
</script>

<style scoped>
.hero-section {
  margin-bottom: 24px;
}

.hero-card {
  position: relative;
  min-height: 300px;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
  text-align: center;
  padding: 0 24px;
}

.couple-avatar-container {
  position: relative;
  display: inline-block;
}

.couple-avatar {
  border: 4px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.couple-avatar:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 1);
}

.love-icon-container {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: rgba(255, 64, 129, 0.9);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
}

.hero-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  margin-bottom: 16px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
}

.quick-stats-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  min-width: 80px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 16px;
}

.hero-action-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: var(--primary-gradient) !important;
  color: white !important;
  text-transform: none;
  padding: 0 32px;
  height: 56px;
  transition: all 0.3s ease;
}

.hero-action-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(var(--primary-rgb), 0.4);
}

.floating-hearts-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-heart {
  position: absolute;
  bottom: -20px;
}

/* Animations */
.animate-gentle-pulse {
  animation: gentlePulse 2s ease-in-out infinite;
}

.animate-romantic-fade-in {
  animation: romanticFadeIn 1s ease-out;
}

.animate-floating-hearts {
  animation: floatingHearts 8s linear infinite;
}

.romantic-button-hover {
  transition: all 0.3s ease;
}

.romantic-button-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* Keyframes */
@keyframes gentlePulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes romanticFadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes floatingHearts {
  0% {
    transform: translateY(100px) translateX(-10px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-120px) translateX(10px) rotate(360deg);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    padding: 32px 16px !important;
  }

  .couple-avatar-container {
    margin-bottom: 24px !important;
  }

  .quick-stats-container {
    padding: 12px 16px;
  }

  .stat-divider {
    margin: 0 8px;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-btn {
    height: 48px;
    padding: 0 24px;
  }

  .bg-circle-1,
  .bg-circle-2 {
    display: none;
  }
}
</style>
