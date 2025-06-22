<template>
  <div class="reminders-view">
    <TwoColumnLayout>
      <!-- Left column: Filters + Reminders List -->
      <template #left>
        <!-- Advanced Filter Section -->
        <section class="filter-section">
          <v-container>
            <!-- Filter Header -->
            <div class="filter-header d-flex justify-space-between align-center mb-6">
              <div class="filter-title">
                <h3 class="text-h6 font-weight-bold text-primary">
                  <v-icon class="mr-2" color="primary">mdi-filter-variant</v-icon>
                  {{ $t("common.filters") }} & {{ $t("common.search") }}
                </h3>
                <p class="text-caption mt-1 text-medium-emphasis">
                  {{ $t("reminders.featureDescription") }}
                </p>
              </div>
              <v-btn
                color="primary"
                variant="elevated"
                rounded="xl"
                size="large"
                @click="createReminder"
                class="create-btn"
              >
                <v-icon start>mdi-plus</v-icon>
                {{ $t("reminders.create") }}
              </v-btn>
            </div>

            <!-- Search and Filters Row -->
            <v-row align="center" class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  prepend-inner-icon="mdi-magnify"
                  :label="$t('reminders.search.placeholder')"
                  variant="outlined"
                  rounded="xl"
                  clearable
                  hide-details
                  class="search-field"
                >
                  <template #append-inner>
                    <v-fade-transition>
                      <v-icon v-if="searchQuery" color="success" size="small">
                        mdi-check-circle
                      </v-icon>
                    </v-fade-transition>
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="6" md="3">
                <v-select
                  v-model="sortBy"
                  :items="sortOptions"
                  :label="$t('common.sortBy')"
                  variant="outlined"
                  rounded="xl"
                  hide-details
                  prepend-inner-icon="mdi-sort"
                  class="sort-select"
                />
              </v-col>

              <v-col cols="6" md="3" class="d-flex justify-end">
                <div class="view-toggle-wrapper">
                  <v-btn-toggle
                    v-model="viewMode"
                    mandatory
                    variant="outlined"
                    divided
                    rounded="xl"
                    class="view-toggle"
                  >
                    <v-btn value="grid" size="small">
                      <v-icon>mdi-view-grid</v-icon>
                    </v-btn>
                    <v-btn value="list" size="small">
                      <v-icon>mdi-view-list</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </section>

        <!-- Content Area -->
        <section class="content-section">
          <v-container>
            <!-- Loading State -->
            <div v-if="isLoading" class="loading-container">
              <v-progress-circular indeterminate color="primary" size="64" width="4" />
              <p class="loading-text">{{ t("reminders.loading") }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredReminders.length === 0" class="empty-state">
              <div class="empty-icon">
                <v-icon icon="mdi-bell-outline" size="120" color="grey-lighten-2" />
              </div>
              <h3 class="empty-title">{{ t("reminders.noReminders") }}</h3>
              <p class="empty-subtitle">
                {{ t("reminders.noRemindersDescription") }}
              </p>
              <v-btn color="primary" size="large" rounded @click="createReminder">
                <v-icon icon="mdi-plus" start />
                {{ t("reminders.createFirst") }}
              </v-btn>
            </div>

            <!-- Reminders Grid View -->
            <div v-else-if="viewMode === 'grid'" class="reminders-grid">
              <v-row>
                <v-col
                  v-for="reminder in filteredReminders"
                  :key="reminder.id"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <ReminderCard
                    :reminder="reminder"
                    @open-reminder="handleOpenReminder"
                    @edit-reminder="handleEditReminder"
                    @delete-reminder="handleDeleteReminder"
                    @toggle-complete="handleToggleComplete"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Reminders List View -->
            <div v-else class="reminders-list">
              <v-list>
                <v-list-item
                  v-for="reminder in filteredReminders"
                  :key="reminder.id"
                  class="reminder-list-item"
                  @click="handleOpenReminder(reminder)"
                >
                  <template #prepend>
                    <v-avatar color="primary" size="40">
                      <v-icon color="white">mdi-bell</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="reminder-list-title">
                    {{ reminder.title }}
                  </v-list-item-title>

                  <v-list-item-subtitle class="reminder-list-subtitle">
                    <div class="d-flex align-center">
                      <v-chip
                        size="x-small"
                        :color="getStatusColor(reminder)"
                        variant="tonal"
                        class="me-2"
                      >
                        {{ getStatusText(reminder) }}
                      </v-chip>
                      <span>{{ formatDateTime(reminder.reminderDate) }}</span>
                      <v-icon v-if="reminder.repeat" size="14" color="blue" class="ms-2"
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
                        @click.stop="handleToggleComplete(reminder)"
                        :color="reminder.isCompleted ? 'success' : 'grey'"
                      >
                        <v-icon size="16">
                          {{
                            reminder.isCompleted
                              ? "mdi-check-circle"
                              : "mdi-circle-outline"
                          }}
                        </v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click.stop="handleEditReminder(reminder)"
                      >
                        <v-icon size="16">mdi-pencil</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </div>
          </v-container>
        </section>
      </template>

      <!-- Right column: Stats + Additional Info -->
      <template #right>
        <!-- Quick Stats Summary -->
        <v-card elevation="1" rounded="xl" class="mb-4">
          <v-card-text class="pa-4">
            <h3 class="text-h6 mb-3">
              <v-icon start color="warning">mdi-chart-line</v-icon>
              {{ $t("reminders.stats.overview") }}
            </h3>
            <v-row>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-warning">
                    {{ totalReminders }}
                  </div>
                  <div class="text-caption">{{ $t("reminders.stats.total") }}</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-info">
                    {{ upcomingReminders }}
                  </div>
                  <div class="text-caption">
                    {{ $t("reminders.stats.upcoming") }}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-error">
                    {{ overdueReminders }}
                  </div>
                  <div class="text-caption">{{ $t("reminders.stats.overdue") }}</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-success">
                    {{ completedReminders }}
                  </div>
                  <div class="text-caption">
                    {{ $t("reminders.stats.completed") }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Status Filters -->
        <v-card elevation="1" rounded="xl" class="mb-4">
          <v-card-text class="pa-4">
            <h3 class="text-h6 mb-3">
              <v-icon start color="info">mdi-filter</v-icon>
              {{ $t("reminders.quickFilters.title") }}
            </h3>
            <div class="status-chips">
              <v-chip
                color="info"
                :variant="selectedFilter === 'all' ? 'elevated' : 'outlined'"
                class="status-chip ma-1"
                @click="filterByStatus('all')"
                clickable
              >
                {{ $t("reminders.quickFilters.all") }}
                <v-badge :content="totalReminders" color="primary" inline />
              </v-chip>
              <v-chip
                color="warning"
                :variant="selectedFilter === 'upcoming' ? 'elevated' : 'outlined'"
                class="status-chip ma-1"
                @click="filterByStatus('upcoming')"
                clickable
              >
                {{ $t("reminders.quickFilters.upcoming") }}
                <v-badge :content="upcomingReminders" color="info" inline />
              </v-chip>
              <v-chip
                color="error"
                :variant="selectedFilter === 'overdue' ? 'elevated' : 'outlined'"
                class="status-chip ma-1"
                @click="filterByStatus('overdue')"
                clickable
              >
                {{ $t("reminders.quickFilters.overdue") }}
                <v-badge :content="overdueReminders" color="error" inline />
              </v-chip>
              <v-chip
                color="success"
                :variant="selectedFilter === 'completed' ? 'elevated' : 'outlined'"
                class="status-chip ma-1"
                @click="filterByStatus('completed')"
                clickable
              >
                {{ $t("reminders.quickFilters.completed") }}
                <v-badge :content="completedReminders" color="success" inline />
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </TwoColumnLayout>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useRemindersStore } from "@/stores/reminders";
import { useDialogsStore } from "@/stores/dialogs";
import type { Reminder } from "@/types";
import ReminderCard from "@/components/reminders/ReminderCard.vue";
import TwoColumnLayout from "@/components/ui/TwoColumnLayout.vue";
import dayjs from "dayjs";

// Composables
const { t } = useI18n();

// Router
const router = useRouter();

// Stores
const remindersStore = useRemindersStore();
const dialogsStore = useDialogsStore();

// Store refs
const { reminders, isLoading } = storeToRefs(remindersStore);

// Local state
const searchQuery = ref("");
const selectedFilter = ref("all");
const selectedType = ref("");
const sortBy = ref("date");
const viewMode = ref<"grid" | "list">("grid");
const showAdvancedFilters = ref(false);

// Computed properties
const totalReminders = computed(() => reminders.value.length);

const upcomingReminders = computed(
  () =>
    reminders.value.filter((reminder) => {
      if (reminder.isCompleted) return false;
      const reminderDate = new Date(reminder.reminderDate);
      return reminderDate > new Date();
    }).length
);

const overdueReminders = computed(
  () =>
    reminders.value.filter((reminder) => {
      if (reminder.isCompleted) return false;
      const reminderDate = new Date(reminder.reminderDate);
      return reminderDate < new Date();
    }).length
);

const completedReminders = computed(
  () => reminders.value.filter((reminder) => reminder.isCompleted).length
);

const typeOptions = computed(() => [
  { title: t("common.all"), value: "" },
  { title: t("reminders.types.anniversary"), value: "anniversary" },
  { title: t("reminders.types.date"), value: "date" },
  { title: t("reminders.types.special"), value: "special" },
  { title: t("reminders.types.personal"), value: "personal" },
  { title: t("reminders.types.gift"), value: "gift" },
  { title: t("reminders.types.other"), value: "other" },
]);

const sortOptions = computed(() => [
  { title: t("reminders.filter.dateNewest"), value: "date" },
  { title: t("reminders.filter.dateOldest"), value: "date-asc" },
  { title: t("reminders.filter.priority"), value: "priority" },
  { title: t("reminders.filter.alphabetical"), value: "title-asc" },
]);

const quickFilterOptions = computed(() => [
  { title: t("common.all"), value: "all" },
  { title: t("reminders.filter.upcoming"), value: "upcoming" },
  { title: t("reminders.filter.today"), value: "today" },
  { title: t("reminders.filter.overdue"), value: "overdue" },
  { title: t("reminders.filter.completed"), value: "completed" },
]);

const viewModeOptions = computed(() => [
  { title: t("reminders.view.grid"), value: "grid" },
  { title: t("reminders.view.list"), value: "list" },
]);

// Utility function to convert date to number for comparison
const getDateTimestamp = (date: Date | string): number => {
  if (!date) return 0;
  return typeof date === "string" ? new Date(date).getTime() : date.getTime();
};

const filteredReminders = computed(() => {
  let filtered = [...reminders.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (reminder) =>
        reminder.title.toLowerCase().includes(query) ||
        (reminder.description && reminder.description.toLowerCase().includes(query))
    );
  }

  // Apply type filter (commented out since type is not in Reminder interface)
  // if (selectedType.value) {
  //   filtered = filtered.filter(reminder => reminder.type === selectedType.value)
  // }

  // Apply quick filter
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  switch (selectedFilter.value) {
    case "upcoming":
      filtered = filtered.filter((reminder) => {
        if (reminder.isCompleted) return false;
        return getDateTimestamp(reminder.reminderDate) > now.getTime();
      });
      break;
    case "today":
      filtered = filtered.filter((reminder) => {
        const reminderDate = new Date(reminder.reminderDate);
        return reminderDate >= today && reminderDate < tomorrow;
      });
      break;
    case "overdue":
      filtered = filtered.filter((reminder) => {
        if (reminder.isCompleted) return false;
        return getDateTimestamp(reminder.reminderDate) < now.getTime();
      });
      break;
    case "completed":
      filtered = filtered.filter((reminder) => reminder.isCompleted);
      break;
  }

  // Apply sorting
  switch (sortBy.value) {
    case "date":
      filtered.sort(
        (a, b) => getDateTimestamp(b.reminderDate) - getDateTimestamp(a.reminderDate)
      );
      break;
    case "date-asc":
      filtered.sort(
        (a, b) => getDateTimestamp(a.reminderDate) - getDateTimestamp(b.reminderDate)
      );
      break;
    case "priority":
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      break;
    case "title-asc":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return filtered;
});

// Methods
const createReminder = () => {
  router.push("/reminders/create");
};

const handleOpenReminder = (reminder: Reminder) => {
  router.push({ name: "reminder-detail", params: { id: reminder.id } });
};

const handleEditReminder = (reminder: Reminder) => {
  router.push({ name: "edit-reminder", params: { id: reminder.id } });
};

const handleDeleteReminder = async (reminder: Reminder) => {
  try {
    const confirmed = await dialogsStore.openConfirmDialog({
      title: "Delete Reminder",
      message: `Are you sure you want to delete "${reminder.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (confirmed) {
      await remindersStore.deleteReminder(reminder.id);
    }
  } catch (error) {
    console.error("Failed to delete reminder:", error);
  }
};

const handleToggleComplete = async (reminder: Reminder) => {
  try {
    if (!reminder.isCompleted) {
      // Mark as complete using the store method
      await remindersStore.completeReminder(reminder.id);
    } else {
      // Mark as incomplete - for now just update local state
      console.log("Marking reminder as incomplete:", reminder.id);
      // Update local state since there's no uncomplete API
      reminder.isCompleted = false;
      reminder.completedAt = null;
    }
  } catch (error) {
    console.error("Failed to toggle reminder completion:", error);
  }
};

const filterByStatus = (status: string) => {
  selectedFilter.value = status;
};

const clearAllFilters = () => {
  searchQuery.value = "";
  selectedFilter.value = "all";
  selectedType.value = "";
  sortBy.value = "date";
};

const exportReminders = () => {
  // TODO: Implement export functionality
  console.log("Export reminders functionality to be implemented");
};

const getStatusColor = (reminder: Reminder) => {
  if (reminder.isCompleted) return "success";

  const now = new Date();
  const reminderDate = new Date(reminder.reminderDate);

  if (reminderDate < now) return "error"; // overdue

  const timeDiff = reminderDate.getTime() - now.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);

  if (daysDiff <= 1) return "warning"; // due soon
  if (daysDiff <= 7) return "info"; // due this week

  return "success"; // upcoming
};

const getStatusText = (reminder: Reminder) => {
  if (reminder.isCompleted) return t("reminders.status.completed");

  const now = new Date();
  const reminderDate = new Date(reminder.reminderDate);

  if (reminderDate < now) return t("reminders.status.overdue");

  const timeDiff = reminderDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff === 0) return t("reminders.status.today");
  if (daysDiff === 1) return t("reminders.status.tomorrow");
  if (daysDiff <= 7) return t("reminders.status.inDays", { days: daysDiff });

  return t("reminders.status.upcoming");
};

const formatDateTime = (date: Date | string) => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dayjs(dateObj).format("DD/MM/YYYY HH:mm");
};

// Lifecycle
onMounted(async () => {
  if (reminders.value.length === 0) {
    await remindersStore.fetchReminders();
  }
});
</script>

<style scoped>
.reminders-view {
  min-height: 100vh;
  background: rgb(var(--v-theme-surface));
}

/* Quick Filters Styles */
.quick-filters-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
}

.quick-filters-bar .v-card {
  background: rgba(var(--v-theme-surface), 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
}

/* Advanced filters animation */
.border-t {
  border-top: 1px solid rgba(var(--v-theme-primary), 0.12);
}

.create-btn {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4);
}

/* Status Chips */
.status-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.status-chip {
  transition: all 0.3s ease;
  font-weight: 500;
}

.status-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

/* View Toggle */
.view-toggle-wrapper {
  display: flex;
  justify-content: center;
}

.view-toggle {
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
}

/* Loading container */
.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.loading-text {
  font-size: 1.1rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-top: 20px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-title {
  font-size: 2rem;
  color: rgb(var(--v-theme-primary));
  margin: 20px 0 10px;
}

.empty-subtitle {
  font-size: 1.1rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 30px;
}

/* Reminders Grid */
.reminders-grid {
  min-height: 300px;
}

/* Reminders List */
.reminders-list {
  background: rgb(var(--v-theme-surface));
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(var(--v-theme-shadow), 0.1);
}

.reminder-list-item {
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
  transition: all 0.3s ease;
  cursor: pointer;
}

.reminder-list-item:last-child {
  border-bottom: none;
}

.reminder-list-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.reminder-list-subtitle {
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.85rem;
}

.list-actions {
  display: flex;
  gap: 4px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .reminders-grid {
    margin: 0 -8px;
  }

  .status-chips {
    justify-content: center;
  }

  .quick-filters-bar {
    position: relative;
  }
}

/* Text utilities using theme colors */
.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}

.text-medium-emphasis {
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
}
</style>
