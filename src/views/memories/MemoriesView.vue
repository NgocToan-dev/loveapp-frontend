<template>
  <div class="memories-view">
    <TwoColumnLayout>
      <!-- Left column: Filters + Memory List -->
      <template #left>
        <!-- Quick Filters - Always visible at top -->
        <div class="quick-filters-bar mb-4">
          <v-card elevation="1" rounded="xl" class="pa-4">
            <v-row align="center">
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="searchQuery"
                  :placeholder="$t('memories.search.placeholder')"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="6" sm="3" md="3">
                <v-select
                  v-model="typeFilter"
                  :items="memoryTypes"
                  :placeholder="$t('memories.filter.category')"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="6" sm="3" md="3">
                <v-select
                  v-model="sortBy"
                  :items="sortOptions"
                  :placeholder="$t('memories.filter.sortBy')"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="12" md="2" class="d-flex justify-center">
                <v-btn
                  icon="mdi-tune"
                  variant="outlined"
                  @click="showAdvancedFilters = !showAdvancedFilters"
                  :color="showAdvancedFilters ? 'primary' : ''"
                  :title="$t('memories.filter.advanced')"
                />
              </v-col>
            </v-row>

            <!-- Advanced Filters - Collapsible -->
            <v-expand-transition>
              <div v-if="showAdvancedFilters" class="mt-4 pt-4 border-t">
                <v-row>
                  <v-col cols="6" md="4">
                    <v-select
                      v-model="yearFilter"
                      :items="availableYears"
                      :placeholder="$t('memories.filter.year')"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="6" md="4">
                    <v-autocomplete
                      v-model="tagFilter"
                      :items="availableTags"
                      :placeholder="$t('memories.filter.tags')"
                      variant="outlined"
                      density="compact"
                      hide-details
                      multiple
                      chips
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-btn
                      color="error"
                      variant="outlined"
                      size="small"
                      @click="clearAllFilters"
                      block
                    >
                      <v-icon start>mdi-filter-off</v-icon>
                      {{ $t("memories.filter.clearAll") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card>
        </div>

        <!-- Memory List -->
        <MemoryList
          :memories="filteredMemories"
          :loading="isLoading"
          @createMemory="openCreateMemory"
        />
      </template>

      <!-- Right column: Stats + Additional Info -->
      <template #right>
        <!-- Quick Stats Summary -->
        <v-card elevation="1" rounded="xl" class="mb-4">
          <v-card-text class="pa-4">
            <h3 class="text-h6 mb-3">
              <v-icon start color="primary">mdi-chart-line</v-icon>
              {{ $t("memories.memoryStats.overview") }}
            </h3>
            <v-row>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-primary">
                    {{ memories.length }}
                  </div>
                  <div class="text-caption">{{ $t("memories.memoryStats.total") }}</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-pink">
                    {{ favoriteCount }}
                  </div>
                  <div class="text-caption">
                    {{ $t("memories.memoryStats.favorites") }}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              block
              class="mt-3"
              @click="showDetailedStats = !showDetailedStats"
            >
              <v-icon start>mdi-chart-bar</v-icon>
              {{ showDetailedStats ? $t("common.hide") : $t("common.show") }}
              {{ $t("memories.memoryStats.detailed") }}
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Detailed Stats - Collapsible -->
        <v-expand-transition>
          <div v-if="showDetailedStats">
            <MemoryStatsWidget :memories="memories" />
          </div>
        </v-expand-transition>

        <!-- Quick Actions -->
        <v-card elevation="1" rounded="xl">
          <v-card-text class="pa-4">
            <h3 class="text-h6 mb-3">
              <v-icon start color="orange">mdi-lightning-bolt</v-icon>
              {{ $t("memories.actions.quick") }}
            </h3>
            <div class="d-flex flex-column ga-2">
              <v-btn
                color="secondary"
                variant="outlined"
                size="small"
                prepend-icon="mdi-download"
                block
                @click="exportMemories"
              >
                {{ $t("memories.actions.export") }}
              </v-btn>
              <v-btn
                color="info"
                variant="outlined"
                size="small"
                prepend-icon="mdi-timeline"
                @click="$router.push('/memories/timeline')"
                block
              >
                {{ $t("memories.actions.timeline") }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </TwoColumnLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useMemoriesStore } from "@/stores/memories";
import { useDialogsStore } from "@/stores/dialogs";
import type { Memory } from "@/types";

// Components
import ResponsiveContainer from "@/components/ui/ResponsiveContainer.vue";
import TwoColumnLayout from "@/components/ui/TwoColumnLayout.vue";
import MemoryList from "@/components/memories/MemoryList.vue";
import MemoryStatsWidget from "@/components/memories/MemoryStatsWidget.vue";
import MemoryFilterPanel from "@/components/memories/MemoryFilterPanel.vue";

// Composables
const { t } = useI18n();
const router = useRouter();
const memoriesStore = useMemoriesStore();
const dialogsStore = useDialogsStore();

// Reactive state
const searchQuery = ref("");
const typeFilter = ref("");
const yearFilter = ref("");
const sortBy = ref("newest");
const showAdvancedFilters = ref(false);
const showDetailedStats = ref(false);
const tagFilter = ref<string[]>([]);

// Computed
const memories = computed(() => memoriesStore.memories);
const isLoading = computed(() => memoriesStore.isLoading);

const memoryTypes = computed(() => [
  { value: "", title: t("common.all") },
  { value: "first-meet", title: t("memories.types.first-meet") },
  { value: "date", title: t("memories.types.date") },
  { value: "travel", title: t("memories.types.travel") },
  { value: "special-moment", title: t("memories.types.special-moment") },
  { value: "celebration", title: t("memories.types.celebration") },
  { value: "milestone", title: t("memories.types.milestone") },
  { value: "everyday", title: t("memories.types.everyday") },
  { value: "other", title: t("memories.types.other") },
]);

const availableYears = computed(() => {
  const years = new Set<number>();
  memories.value.forEach((memory) => {
    const year = new Date(memory.createdAt).getFullYear();
    years.add(year);
  });

  return [
    { value: "", title: t("common.all") },
    ...Array.from(years)
      .sort((a, b) => b - a)
      .map((year) => ({
        value: year.toString(),
        title: year.toString(),
      })),
  ];
});

const sortOptions = computed(() => [
  { value: "newest", title: t("memories.filter.newest") },
  { value: "oldest", title: t("memories.filter.oldest") },
  { value: "alphabetical", title: t("memories.filter.alphabetical") },
]);

const availableTags = computed(() => {
  const allTags = new Set<string>();
  memories.value.forEach((memory) => {
    memory.tags?.forEach((tag) => allTags.add(tag));
  });
  return Array.from(allTags).map((tag) => ({ value: tag, title: `#${tag}` }));
});

const favoriteCount = computed(() => memories.value.filter((m) => m.isFavorite).length);

const recentActivities = computed(() => [
  {
    id: 1,
    title: t("memories.activity.created"),
    time: t("common.time.hoursAgo", { count: 2 }),
    icon: "mdi-plus",
    color: "primary",
  },
  {
    id: 2,
    title: t("memories.activity.liked"),
    time: t("common.time.daysAgo", { count: 1 }),
    icon: "mdi-heart",
    color: "pink",
  },
  {
    id: 3,
    title: t("memories.activity.shared"),
    time: t("common.time.daysAgo", { count: 3 }),
    icon: "mdi-share",
    color: "blue",
  },
]);

const filteredMemories = computed(() => {
  let filtered = [...memories.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (memory) =>
        memory.title.toLowerCase().includes(query) ||
        memory.description.toLowerCase().includes(query) ||
        (memory.content && memory.content.toLowerCase().includes(query)) ||
        memory.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Apply type filter (using category instead of type)
  if (typeFilter.value) {
    filtered = filtered.filter((memory) => memory.category === typeFilter.value);
  }

  // Apply year filter
  if (yearFilter.value) {
    const year = parseInt(yearFilter.value);
    filtered = filtered.filter(
      (memory) => new Date(memory.createdAt).getFullYear() === year
    );
  }

  // Apply tag filter
  if (tagFilter.value.length > 0) {
    filtered = filtered.filter((memory) =>
      memory.tags?.some((tag) => tagFilter.value.includes(tag))
    );
  }

  // Apply sorting
  switch (sortBy.value) {
    case "newest":
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "oldest":
      filtered.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "alphabetical":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }

  return filtered;
});

// Methods
const openCreateMemory = () => {
  router.push("/memories/create");
};

const clearAllFilters = () => {
  searchQuery.value = "";
  typeFilter.value = "";
  yearFilter.value = "";
  tagFilter.value = [];
  sortBy.value = "newest";
};

const exportMemories = () => {
  // TODO: Implement export functionality
  console.log("Export memories functionality to be implemented");
};

// Lifecycle
onMounted(async () => {
  await memoriesStore.fetchMemories();
});
</script>

<style scoped>
.memories-view {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(var(--primary-rgb), 0.02) 0%,
    rgba(var(--secondary-rgb), 0.01) 100%
  );
}

/* Hero Section Styles */
.hero-section {
  position: relative;
  padding: 80px 0 60px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(var(--primary-rgb), 0.08) 0%,
    rgba(var(--secondary-rgb), 0.06) 50%,
    rgba(var(--accent-rgb), 0.04) 100%
  );
}

.floating-hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.heart {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.heart:before,
.heart:after {
  content: "";
  width: 10px;
  height: 16px;
  position: absolute;
  left: 10px;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
  border-radius: 10px 10px 0 0;
  background: rgb(var(--primary-rgb));
}

.heart:after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
}

.heart:nth-child(1) {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}
.heart:nth-child(2) {
  top: 20%;
  left: 80%;
  animation-delay: 1s;
}
.heart:nth-child(3) {
  top: 60%;
  left: 15%;
  animation-delay: 2s;
}
.heart:nth-child(4) {
  top: 80%;
  left: 70%;
  animation-delay: 3s;
}
.heart:nth-child(5) {
  top: 30%;
  left: 90%;
  animation-delay: 4s;
}
.heart:nth-child(6) {
  top: 70%;
  left: 45%;
  animation-delay: 5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.hero-container {
  position: relative;
  z-index: 1;
}

.hero-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: rgb(var(--primary-rgb));
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.title-icon {
  font-size: 3rem !important;
  color: rgb(var(--accent-rgb));
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgb(var(--text-secondary-rgb));
  margin-bottom: 2rem;
  line-height: 1.6;
}

.create-memory-btn {
  font-size: 1.1rem;
  padding: 12px 32px;
  background: linear-gradient(135deg, rgb(var(--primary-rgb)), rgb(var(--secondary-rgb)));
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.create-memory-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .title-icon {
    font-size: 2rem !important;
  }

  .hero-subtitle {
    font-size: 1rem;
  }
}

/* Quick Filters Styles */
.quick-filters-bar {
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
}

.quick-filters-bar .v-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
}

/* Stats Cards */
.recent-activities {
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.recent-activities::-webkit-scrollbar {
  width: 4px;
}

.recent-activities::-webkit-scrollbar-track {
  background: transparent;
}

.recent-activities::-webkit-scrollbar-thumb {
  background: rgba(var(--primary-rgb), 0.3);
  border-radius: 2px;
}

/* Advanced filters animation */
.border-t {
  border-top: 1px solid rgba(var(--primary-rgb), 0.1);
}

/* Hover effects */
.v-card:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.15);
}

/* Filter tags */
.v-chip {
  margin: 2px;
}

/* Quick actions spacing */
.ga-2 > * + * {
  margin-top: 8px;
}
</style>
