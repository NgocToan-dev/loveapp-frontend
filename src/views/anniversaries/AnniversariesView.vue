<template>
  <div class="anniversaries-view">
    <TwoColumnLayout>
      <!-- Left column: Filters + Anniversaries List -->
      <template #left>
        <!-- Quick Filters - Always visible at top -->
        <div class="quick-filters-bar mb-4">
          <v-card elevation="1" rounded="xl" class="pa-4">
            <v-row align="center">
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="searchQuery"
                  :placeholder="$t('anniversaries.search.placeholder')"
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
                  :items="anniversaryTypes"
                  :placeholder="$t('anniversaries.filter.type')"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              <v-col cols="6" sm="3" md="3">
                <v-select
                  v-model="sortBy"
                  :items="sortOptions"
                  :placeholder="$t('anniversaries.filter.sortBy')"
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
                  :title="$t('anniversaries.filter.advanced')"
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
                      :placeholder="$t('anniversaries.filter.year')"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="6" md="4">
                    <v-select
                      v-model="recurringFilter"
                      :items="recurringOptions"
                      :placeholder="$t('anniversaries.filter.recurring')"
                      variant="outlined"
                      density="compact"
                      hide-details
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
                      {{ $t("anniversaries.filter.clearAll") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card>
        </div>        <!-- Anniversary List -->
        <div v-if="isLoading" class="loading-container">
          <v-progress-circular
            indeterminate
            color="primary"
            size="60"
          />
          <p class="loading-text">{{ $t('anniversaries.loading') }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredAnniversaries.length === 0" class="empty-state">
          <v-icon size="100" color="primary" class="mb-4">mdi-calendar-heart-outline</v-icon>
          <h2 class="empty-title">{{ $t('anniversaries.empty.title') }}</h2>
          <p class="empty-subtitle">{{ $t('anniversaries.empty.description') }}</p>
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            @click="createAnniversary"
            class="mt-4"
          >
            <v-icon start>mdi-plus</v-icon>
            {{ $t('anniversaries.empty.action') }}
          </v-btn>
        </div>

        <!-- Anniversaries Grid View -->
        <div v-else-if="viewMode === 'grid'" class="anniversaries-grid">
          <v-row>
            <v-col
              v-for="anniversary in filteredAnniversaries"
              :key="anniversary.id"
              cols="12"
              sm="6"
              lg="4"
            >
              <AnniversaryCard
                :anniversary="anniversary"
                @click="handleOpenAnniversary(anniversary)"
                @edit="handleEditAnniversary(anniversary)"
                @delete="handleDeleteAnniversary(anniversary)"
              />
            </v-col>
          </v-row>
        </div>

        <!-- Anniversaries List View -->
        <div v-else class="anniversaries-list">
          <v-card rounded="xl" elevation="2">
            <v-list>
              <v-list-item
                v-for="anniversary in filteredAnniversaries"
                :key="anniversary.id"
                class="anniversary-list-item"
                @click="handleOpenAnniversary(anniversary)"
              >
                <template #prepend>
                  <v-avatar :color="getTypeColor(anniversary.type)" size="40">
                    <v-icon color="white">{{ getTypeIcon(anniversary.type) }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="anniversary-list-title">
                  {{ anniversary.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="anniversary-list-subtitle">
                  <div class="d-flex align-center">
                    <v-chip
                      size="x-small"
                      :color="getTypeColor(anniversary.type)"
                      variant="tonal"
                      class="me-2"
                    >
                      {{ getTypeLabel(anniversary.type) }}
                    </v-chip>
                    <span>{{ formatDate(anniversary.date) }}</span>
                    <v-icon
                      v-if="anniversary.isRecurring"
                      size="14"
                      color="success"
                      class="ms-2"
                      >mdi-repeat</v-icon
                    >
                  </div>
                </v-list-item-subtitle>

                <template #append>
                  <div class="list-actions">
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click.stop="handleEditAnniversary(anniversary)"
                    >
                      <v-icon size="16">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click.stop="handleCelebrate(anniversary)"
                      color="pink"
                    >
                      <v-icon size="16">mdi-party-popper</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </div>
      </template>

      <!-- Right column: Stats + Additional Info -->
      <template #right>
        <!-- Next Anniversary Countdown -->
        <v-card v-if="nextAnniversary" elevation="1" rounded="xl" class="mb-4">
          <v-card-text class="pa-4">
            <h3 class="text-h6 mb-3">
              <v-icon start color="primary">mdi-calendar-clock</v-icon>
              {{ $t("anniversaries.nextAnniversary") }}
            </h3>
            <AnniversaryCountdownWidget :anniversaries="[nextAnniversary]" />
          </v-card-text>
        </v-card>

        <!-- Quick Stats Summary -->
        <v-card elevation="1" rounded="xl" class="mb-4">
          <v-card-text class="pa-4">
            <h3 class="text-h6 mb-3">
              <v-icon start color="primary">mdi-chart-line</v-icon>
              {{ $t("anniversaries.stats.overview") }}
            </h3>
            <v-row>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-primary">
                    {{ stats.total }}
                  </div>
                  <div class="text-caption">{{ $t("anniversaries.stats.total") }}</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-warning">
                    {{ stats.upcoming }}
                  </div>
                  <div class="text-caption">
                    {{ $t("anniversaries.stats.upcoming") }}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-info">
                    {{ stats.thisMonth }}
                  </div>
                  <div class="text-caption">{{ $t("anniversaries.stats.thisMonth") }}</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-success">
                    {{ stats.recurring }}
                  </div>
                  <div class="text-caption">
                    {{ $t("anniversaries.stats.recurring") }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Anniversary Types Filter -->
        <v-card elevation="1" rounded="xl" class="mb-4">
          <v-card-text class="pa-4">
            <h3 class="text-h6 mb-3">
              <v-icon start color="info">mdi-filter</v-icon>
              {{ $t("anniversaries.quickFilters.title") }}
            </h3>
            <div class="type-chips">
              <v-chip
                v-for="type in anniversaryTypes"
                :key="type.value"
                :color="typeFilter === type.value ? 'primary' : 'default'"
                :variant="typeFilter === type.value ? 'elevated' : 'outlined'"
                class="type-chip ma-1"
                @click="filterByType(type.value)"
                clickable
              >
                {{ type.title }}
                <v-badge
                  v-if="getTypeCount(type.value)"
                  :content="getTypeCount(type.value)"
                  color="error"
                  inline
                />
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- Quick Actions -->
        <v-card elevation="1" rounded="xl">
          <v-card-text class="pa-4">
            <h3 class="text-h6 mb-3">
              <v-icon start color="orange">mdi-lightning-bolt</v-icon>
              {{ $t("anniversaries.actions.quick") }}
            </h3>
            <div class="d-flex flex-column ga-2">
              <v-btn
                color="primary"
                variant="elevated"
                size="small"
                prepend-icon="mdi-plus"
                block
                @click="createAnniversary"
              >
                {{ $t("anniversaries.actions.create") }}
              </v-btn>
              <v-btn
                color="secondary"
                variant="outlined"
                size="small"
                prepend-icon="mdi-download"
                block
                @click="exportAnniversaries"
              >
                {{ $t("anniversaries.actions.export") }}
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
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAnniversariesStore } from "@/stores/anniversaries";
import { useDialogsStore } from "@/stores/dialogs";
import type { Anniversary } from "@/types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);
import AnniversaryCard from "@/components/anniversaries/AnniversaryCard.vue";
import AnniversaryCountdownWidget from "@/components/anniversaries/AnniversaryCountdownWidget.vue";
import TwoColumnLayout from "@/components/ui/TwoColumnLayout.vue";

const { t } = useI18n();
const anniversariesStore = useAnniversariesStore();
const dialogsStore = useDialogsStore();
const router = useRouter();

// State
const searchQuery = ref("");
const typeFilter = ref("");
const yearFilter = ref("");
const recurringFilter = ref("");
const sortBy = ref("date-asc");
const showAdvancedFilters = ref(false);
const viewMode = ref<"grid" | "list">("grid");
const selectedType = ref("");

// Computed
const anniversaries = computed(() => anniversariesStore.anniversaries || []);
const isLoading = computed(() => anniversariesStore.isLoading);
const error = computed(() => anniversariesStore.error);

const anniversaryTypes = computed(() => [
  { title: t("common.all"), value: "" },
  { title: t("anniversaries.types.relationship"), value: "relationship" },
  { title: t("anniversaries.types.first-meet"), value: "first-meet" },
  { title: t("anniversaries.types.first-date"), value: "first-date" },
  { title: t("anniversaries.types.engagement"), value: "engagement" },
  { title: t("anniversaries.types.marriage"), value: "marriage" },
  { title: t("anniversaries.types.milestone"), value: "milestone" },
  { title: t("anniversaries.types.custom"), value: "custom" },
]);

const sortOptions = computed(() => [
  { title: t("anniversaries.filter.dateAsc"), value: "date-asc" },
  { title: t("anniversaries.filter.dateDesc"), value: "date-desc" },
  { title: t("anniversaries.filter.newest"), value: "created-desc" },
  { title: t("anniversaries.filter.alphabetical"), value: "title-asc" },
]);

const availableYears = computed(() => {
  const years = new Set<number>();
  anniversaries.value.forEach((anniversary) => {
    const year = new Date(anniversary.date).getFullYear();
    years.add(year);
  });

  return [
    { title: t("common.all"), value: "" },
    ...Array.from(years)
      .sort((a, b) => b - a)
      .map((year) => ({
        title: year.toString(),
        value: year.toString(),
      })),
  ];
});

const recurringOptions = computed(() => [
  { title: t("common.all"), value: "" },
  { title: t("anniversaries.filter.recurring"), value: "true" },
  { title: t("anniversaries.filter.oneTime"), value: "false" },
]);

const nextAnniversary = computed(() => {
  const now = dayjs();
  const upcoming = anniversaries.value
    .filter((anniversary) => {
      const nextDate = getNextAnniversaryDate(anniversary);
      return nextDate.isAfter(now);
    })
    .sort((a, b) => {
      const aNext = getNextAnniversaryDate(a);
      const bNext = getNextAnniversaryDate(b);
      return aNext.diff(bNext);
    });

  return upcoming[0] || null;
});

const filteredAnniversaries = computed(() => {
  let filtered = [...anniversaries.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (anniversary) =>
        anniversary.title.toLowerCase().includes(query) ||
        (anniversary.description && anniversary.description.toLowerCase().includes(query))
    );
  }

  // Apply type filter
  if (typeFilter.value) {
    filtered = filtered.filter((anniversary) => anniversary.type === typeFilter.value);
  }

  // Apply year filter
  if (yearFilter.value) {
    const year = parseInt(yearFilter.value);
    filtered = filtered.filter(
      (anniversary) => new Date(anniversary.date).getFullYear() === year
    );
  }

  // Apply recurring filter
  if (recurringFilter.value !== "") {
    const isRecurring = recurringFilter.value === "true";
    filtered = filtered.filter((anniversary) => anniversary.isRecurring === isRecurring);
  }

  // Apply sorting
  switch (sortBy.value) {
    case "date-asc":
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      break;
    case "date-desc":
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case "created-desc":
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "title-asc":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return filtered;
});

const stats = computed(() => {
  const now = dayjs();
  const thisMonthStart = now.startOf("month");
  const thisMonthEnd = now.endOf("month");

  return {
    total: anniversaries.value.length,
    upcoming: anniversaries.value.filter((anniversary) => {
      const nextDate = getNextAnniversaryDate(anniversary);
      return nextDate.isAfter(now);
    }).length,
    thisMonth: anniversaries.value.filter((anniversary) => {
      const nextDate = getNextAnniversaryDate(anniversary);
      return nextDate.isBetween(thisMonthStart, thisMonthEnd, null, "[]");
    }).length,
    recurring: anniversaries.value.filter((anniversary) => anniversary.isRecurring).length,
  };
});

// Methods
const createAnniversary = () => {
  router.push("/anniversaries/create");
};

const handleOpenAnniversary = (anniversary: Anniversary) => {
  router.push({ name: "anniversary-detail", params: { id: anniversary.id } });
};

const handleEditAnniversary = (anniversary: Anniversary) => {
  router.push({ name: "edit-anniversary", params: { id: anniversary.id } });
};

const handleDeleteAnniversary = async (anniversary: Anniversary) => {
  try {
    const confirmed = await dialogsStore.openConfirmDialog({
      title: t("anniversaries.confirmDelete.title"),
      message: t("anniversaries.confirmDelete.message", { title: anniversary.title }),
      confirmText: t("common.delete"),
      cancelText: t("common.cancel"),
    });

    if (confirmed) {
      await anniversariesStore.deleteAnniversary(anniversary.id);
    }
  } catch (error) {
    console.error("Failed to delete anniversary:", error);
  }
};

const filterByType = (type: string) => {
  typeFilter.value = type;
};

const getTypeCount = (type: string) => {
  if (!type) return anniversaries.value.length;
  return anniversaries.value.filter((anniversary) => anniversary.type === type).length;
};

const clearAllFilters = () => {
  searchQuery.value = "";
  typeFilter.value = "";
  yearFilter.value = "";
  recurringFilter.value = "";
  sortBy.value = "date-asc";
};

const exportAnniversaries = () => {
  // TODO: Implement export functionality
  console.log("Export anniversaries functionality to be implemented");
};

const getNextAnniversaryDate = (anniversary: Anniversary) => {
  const now = dayjs();
  const anniversaryDate = dayjs(anniversary.date);

  if (!anniversary.isRecurring) {
    return anniversaryDate;
  }

  // For recurring anniversaries, find the next occurrence
  let nextDate = anniversaryDate.year(now.year());

  if (nextDate.isBefore(now)) {
    nextDate = nextDate.add(1, "year");
  }

  return nextDate;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    relationship: "red",
    "first-meet": "pink",
    "first-date": "purple",
    engagement: "blue",
    marriage: "orange",
    milestone: "green",
    custom: "grey",
  };
  return colors[type] || "primary";
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    relationship: "mdi-heart",
    "first-meet": "mdi-handshake",
    "first-date": "mdi-calendar-heart",
    engagement: "mdi-ring",
    marriage: "mdi-heart-multiple",
    milestone: "mdi-star",
    custom: "mdi-calendar",
  };
  return icons[type] || "mdi-calendar";
};

const getTypeLabel = (type: string) => {
  return anniversaryTypes.value.find(t => t.value === type)?.title || type;
};

const formatDate = (date: Date | string) => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dayjs(dateObj).format("DD/MM/YYYY");
};

const handleCelebrate = (anniversary: Anniversary) => {
  // TODO: Implement celebration functionality
  console.log("Celebrating anniversary:", anniversary.title);
};

const loadAnniversaries = async () => {
  try {
    await anniversariesStore.fetchAnniversaries();
  } catch (error) {
    console.error("Failed to load anniversaries:", error);
  }
};

// Initialize
onMounted(() => {
  loadAnniversaries();
});
</script>

<style scoped>
.anniversaries-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdfbfb 0%, #f7f3f0 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
  color: white;
  padding: 80px 0 60px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  line-height: 1.2;
}

.hero-icon {
  color: rgba(255, 255, 255, 0.9);
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
}

.hero-countdown {
  flex: 1;
  max-width: 400px;
}

/* Stats Section */
.stats-section {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  margin-top: -30px;
  position: relative;
  z-index: 2;
}

.stat-card {
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  margin-bottom: 12px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  font-weight: 500;
}

/* Filter Section */
.filter-section {
  padding: 40px 0;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05) 0%,
    rgba(var(--v-theme-secondary), 0.03) 100%
  );
}

.filter-card {
  background: rgba(var(--v-theme-surface), 0.9) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  transition: all 0.3s ease;
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.filter-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
}

.filter-title h2 {
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 8px 0;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filter-title p {
  font-size: 0.95rem;
  opacity: 0.8;
}

.create-btn {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  ) !important;
  color: white !important;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 24px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(var(--v-theme-primary), 0.4);
}

.filter-controls {
  margin: 0;
}

.search-field :deep(.v-field) {
  transition: all 0.3s ease;
}

.search-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.view-toggle {
  background: rgba(var(--v-theme-surface), 0.9);
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  overflow: hidden;
}

.view-toggle .v-btn {
  transition: all 0.3s ease;
}

.view-toggle .v-btn:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

.quick-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.quick-filters-label {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
  flex-shrink: 0;
}

.quick-filter-chips {
  flex: 1;
  min-width: 0;
}

.quick-filter-chip {
  transition: all 0.3s ease;
  margin: 2px;
}

.quick-filter-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.quick-filter-chip.v-chip--selected {
  background: rgba(var(--v-theme-primary), 0.15) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

/* Content Section */
.content-section {
  padding: 20px 0 80px;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.loading-text {
  margin-top: 24px;
  font-size: 1.125rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  margin-bottom: 32px;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 16px;
}

.empty-subtitle {
  font-size: 1.125rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* Grid View */
.anniversaries-grid {
  margin-top: 20px;
}

/* List View */
.anniversaries-list {
  margin-top: 20px;
}

.anniversary-list-item {
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.anniversary-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.02);
}

.anniversary-list-item:last-child {
  border-bottom: none;
}

.anniversary-list-title {
  font-weight: 600;
  font-size: 1.125rem;
  color: rgb(var(--v-theme-on-surface));
}

.anniversary-list-subtitle {
  margin-top: 8px;
}

.list-actions {
  display: flex;
  gap: 8px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.anniversary-list-item:hover .list-actions {
  opacity: 1;
}

/* Responsive */
@media (max-width: 960px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .controls-header {
    flex-direction: column;
    align-items: stretch;
  }

  .section-title {
    text-align: center;
  }

  .filter-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .filter-title h2 {
    font-size: 1.75rem;
  }

  .create-btn {
    width: 100%;
    margin-top: 16px;
  }

  .quick-filters {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .quick-filters-label {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 12px;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .view-toggle {
    justify-self: center;
  }

  .filter-title h2 {
    font-size: 1.5rem;
  }

  .filter-controls {
    gap: 16px;
  }

  .quick-filter-chips {
    justify-content: center;
  }
}
</style>
