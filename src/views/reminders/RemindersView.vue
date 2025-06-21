<template>
  <ResponsiveContainer>
    <div class="reminders-view">
      <!-- Hero Section -->
      <section class="reminders-hero">
        <div class="hero-background">
          <div class="floating-bells">
            <div class="bell" v-for="n in 6" :key="n"></div>
          </div>
        </div>
        <div class="hero-content">
          <h1 class="hero-title">
            <v-icon icon="mdi-bell-ring" class="title-icon" />
            {{ t("reminders.title") }}
          </h1>
          <p class="hero-subtitle">{{ t("reminders.subtitle") }}</p>            <v-btn
            color="primary"
            size="large"
            rounded
            elevation="0"
            class="create-reminder-btn"
            @click="createReminder"
          >
            <v-icon icon="mdi-plus" start />
            {{ t("reminders.create") }}
          </v-btn>
        </div>
      </section>

      <!-- Stats & Quick Actions -->
      <section class="stats-section">
        <v-container>
          <div class="stats-grid">
            <div class="stat-card" @click="filterByStatus('all')">
              <div class="stat-icon">
                <v-icon icon="mdi-bell-outline" color="primary" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ totalReminders }}</div>
                <div class="stat-label">{{ t("reminders.totalReminders") }}</div>
              </div>
            </div>
            <div class="stat-card" @click="filterByStatus('upcoming')">
              <div class="stat-icon">
                <v-icon icon="mdi-clock-outline" color="info" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ upcomingReminders }}</div>
                <div class="stat-label">{{ t("reminders.upcoming") }}</div>
              </div>
            </div>
            <div class="stat-card" @click="filterByStatus('overdue')">
              <div class="stat-icon">
                <v-icon icon="mdi-alert-circle" color="warning" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ overdueReminders }}</div>
                <div class="stat-label">{{ t("reminders.overdue") }}</div>
              </div>
            </div>
            <div class="stat-card" @click="filterByStatus('completed')">
              <div class="stat-icon">
                <v-icon icon="mdi-check-circle" color="success" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ completedReminders }}</div>
                <div class="stat-label">{{ t("reminders.completed") }}</div>
              </div>
            </div>
          </div>
        </v-container>
      </section>

      <!-- Advanced Filter Section -->
      <section class="filter-section">
        <v-container>
          <!-- Main Filter Card -->
          <v-card
            rounded="xl"
            elevation="0"
            class="filter-card"
            :style="{
              backgroundColor: 'rgb(var(--v-theme-surface))',
              border: '1px solid rgb(var(--v-theme-outline-variant))',
            }"
          >
            <v-card-text class="pa-6">
              <!-- Quick Actions Header -->
              <div class="filter-header d-flex justify-space-between align-center mb-6">
                <div class="filter-title">
                  <h3
                    class="text-h6 font-weight-bold"
                    :style="{ color: 'rgb(var(--v-theme-on-surface))' }"
                  >
                    <v-icon class="mr-2" color="warning">mdi-filter-variant</v-icon>
                    {{ t("common.filters") }} & {{ t("common.search") }}
                  </h3>
                  <p
                    class="text-caption mt-1"
                    :style="{ color: 'rgb(var(--v-theme-on-surface-variant))' }"
                  >
                    {{ t("reminders.featureDescription") }}
                  </p>
                </div>
                <v-btn
                  color="primary"
                  variant="flat"
                  rounded="xl"
                  size="large"
                  @click="createReminder"
                  class="create-btn"
                >
                  <v-icon start>mdi-plus</v-icon>
                  {{ t("reminders.create") }}
                </v-btn>
              </div>

              <!-- Search and Filters Row -->
              <v-row align="center" class="mb-4">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    :label="t('reminders.search')"
                    variant="outlined"
                    rounded="xl"
                    clearable
                    hide-details
                    class="search-field"
                    :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
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

                <v-col cols="6" md="2">
                  <v-select
                    v-model="sortBy"
                    :items="sortOptions"
                    :label="t('common.sortBy')"
                    variant="outlined"
                    rounded="xl"
                    hide-details
                    prepend-inner-icon="mdi-sort"
                    class="sort-select"
                    :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
                  />
                </v-col>

                <v-col cols="6" md="2">
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

              <!-- Quick Status Filters -->
              <div class="status-filters">
                <div class="filter-section-title mb-3">
                  <span
                    class="text-caption font-weight-medium"
                    :style="{ color: 'rgb(var(--v-theme-on-surface-variant))' }"
                  >
                    {{ t("reminders.filterByStatus") }}
                  </span>
                </div>
                <v-chip-group
                  v-model="selectedFilter"
                  selected-class="text-primary"
                  color="primary"
                  filter
                  class="status-chips"
                >
                  <v-chip
                    value="all"
                    @click="filterByStatus('all')"
                    variant="outlined"
                    rounded="xl"
                    class="status-chip"
                  >
                    <v-label class="mr-2">{{ t("common.all") }}</v-label>
                    <v-badge
                      :content="totalReminders"
                      color="grey"
                      offset-x="-2"
                      offset-y="-2"
                    />
                  </v-chip>

                  <v-chip
                    value="upcoming"
                    @click="filterByStatus('upcoming')"
                    variant="outlined"
                    rounded="xl"
                    class="status-chip"
                    color="info"
                  >
                    <v-label class="mr-2">{{ t("reminders.upcoming") }}</v-label>
                    <v-badge
                      :content="upcomingReminders"
                      color="info"
                      offset-x="-2"
                      offset-y="-2"
                    />
                  </v-chip>

                  <v-chip
                    value="today"
                    @click="filterByStatus('today')"
                    variant="outlined"
                    rounded="xl"
                    class="status-chip"
                    color="warning"
                  >
                    <v-label class="mr-2">{{ t("reminders.today") }}</v-label>
                  </v-chip>

                  <v-chip
                    value="overdue"
                    @click="filterByStatus('overdue')"
                    variant="outlined"
                    rounded="xl"
                    class="status-chip"
                    color="error"
                  >
                    <v-label class="mr-2">{{ t("reminders.overdue") }}</v-label>
                    <v-badge
                      :content="overdueReminders"
                      color="error"
                      offset-x="-2"
                      offset-y="-2"
                    />
                  </v-chip>

                  <v-chip
                    value="completed"
                    @click="filterByStatus('completed')"
                    variant="outlined"
                    rounded="xl"
                    class="status-chip"
                    color="success"
                  >
                    <v-label class="mr-2">{{ t("reminders.completed") }}</v-label>
                    <v-badge
                      :content="completedReminders"
                      color="success"
                      offset-x="-2"
                      offset-y="-2"
                    />
                  </v-chip>
                </v-chip-group>
              </div>
            </v-card-text>
          </v-card>
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
            <v-card rounded="xl" elevation="2">
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
            </v-card>
          </div>
        </v-container>
      </section>
    </div>
  </ResponsiveContainer>
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
import ResponsiveContainer from "@/components/ui/ResponsiveContainer.vue";
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

// Computed properties
const totalReminders = computed(() => reminders.value.length);

const upcomingReminders = computed(() =>
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

const typeOptions = [
  { title: "Anniversary", value: "anniversary" },
  { title: "Date", value: "date" },
  { title: "Special Occasion", value: "special" },
  { title: "Personal", value: "personal" },
  { title: "Gift", value: "gift" },
  { title: "Other", value: "other" },
];

const sortOptions = [
  { title: "Date (Newest)", value: "date" },
  { title: "Date (Oldest)", value: "date-asc" },
  { title: "Priority", value: "priority" },
  { title: "Title A-Z", value: "title-asc" },
  { title: "Title Z-A", value: "title-desc" },
];

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

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    anniversary: "red",
    date: "pink",
    special: "purple",
    personal: "blue",
    gift: "orange",
    other: "grey",
  };
  return colors[type] || "grey";
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    anniversary: "mdi-heart",
    date: "mdi-calendar-heart",
    special: "mdi-star",
    personal: "mdi-account-heart",
    gift: "mdi-gift",
    other: "mdi-bell",
  };
  return icons[type] || "mdi-bell";
};

const getStatusColor = (reminder: Reminder) => {
  if (reminder.isCompleted) return "success";

  const now = new Date();
  const reminderDate = new Date(reminder.reminderDate);

  if (reminderDate < now) return "warning"; // overdue

  const timeDiff = reminderDate.getTime() - now.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);

  if (daysDiff <= 1) return "error"; // due soon
  if (daysDiff <= 7) return "orange"; // due this week

  return "info"; // upcoming
};

const getStatusText = (reminder: Reminder) => {
  if (reminder.isCompleted) return "Completed";

  const now = new Date();
  const reminderDate = new Date(reminder.reminderDate);

  if (reminderDate < now) return "Overdue";

  const timeDiff = reminderDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff === 0) return "Today";
  if (daysDiff === 1) return "Tomorrow";
  if (daysDiff <= 7) return `In ${daysDiff} days`;

  return "Upcoming";
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
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.1) 0%,
    rgba(255, 152, 0, 0.1) 50%,
    rgba(255, 87, 34, 0.1) 100%
  );
}

/* Hero Section */
.reminders-hero {
  position: relative;
  padding: 80px 0 60px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-warning), 0.1) 0%,
    rgba(var(--v-theme-secondary), 0.05) 50%,
    rgba(var(--v-theme-surface), 0.1) 100%
  );
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-bells {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bell {
  position: absolute;
  width: 50px;
  height: 60px;
  background: linear-gradient(145deg, rgba(255, 193, 7, 0.6), rgba(255, 152, 0, 0.4));
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
  animation: ring 4s ease-in-out infinite;
}

.bell::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: rgba(255, 193, 7, 0.8);
  border-radius: 50%;
}

.bell:nth-child(1) {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}
.bell:nth-child(2) {
  top: 25%;
  right: 15%;
  animation-delay: 1s;
}
.bell:nth-child(3) {
  top: 60%;
  left: 20%;
  animation-delay: 2s;
}
.bell:nth-child(4) {
  top: 70%;
  right: 10%;
  animation-delay: 3s;
}
.bell:nth-child(5) {
  top: 40%;
  left: 5%;
  animation-delay: 0.5s;
}
.bell:nth-child(6) {
  top: 30%;
  right: 25%;
  animation-delay: 1.5s;
}

@keyframes ring {
  0%,
  100% {
    transform: rotate(-3deg) translateY(0px);
  }
  25% {
    transform: rotate(3deg) translateY(-10px);
  }
  50% {
    transform: rotate(-3deg) translateY(0px);
  }
  75% {
    transform: rotate(3deg) translateY(-5px);
  }
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-family: "Playfair Display", serif;
  font-size: 3.5rem;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-warning)),
    rgb(var(--v-theme-secondary))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.title-icon {
  color: rgb(var(--v-theme-warning)) !important;
  font-size: 3rem !important;
  animation: ring 2s ease-in-out infinite;
}

.hero-subtitle {
  font-family: "Montserrat", sans-serif;
  font-size: 1.3rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 30px;
  line-height: 1.6;
}

.create-reminder-btn {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-warning)),
    rgb(var(--v-theme-secondary))
  ) !important;
  color: white !important;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 12px 32px;
  border-radius: 50px;
  box-shadow: 0 8px 25px rgba(var(--v-theme-warning), 0.3);
  transition: all 0.3s ease;
}

.create-reminder-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(var(--v-theme-warning), 0.4);
}

/* Stats Section */
.stats-section {
  padding-top: 40px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(var(--v-theme-warning), 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  border-color: rgba(var(--v-theme-warning), 0.2);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-warning), 0.1),
    rgba(var(--v-theme-secondary), 0.1)
  );
}

.stat-number {
  font-family: "Montserrat", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--v-theme-warning));
  line-height: 1;
}

.stat-label {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-weight: 500;
}

.quick-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.quick-filters .v-chip {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  border-radius: 25px;
  transition: all 0.3s ease;
}

/* Filter Section */
.filter-section {
  padding: 0 0 40px;
  position: relative;
  z-index: 10;
}

.filter-card {
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.filter-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    rgb(var(--v-theme-warning)),
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
}

.filter-header {
  position: relative;
}

.filter-title h3 {
  font-family: "Playfair Display", serif;
  display: flex;
  align-items: center;
}

.create-btn {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-warning)),
    rgb(var(--v-theme-primary))
  ) !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 20px rgba(var(--v-theme-warning), 0.3);
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(var(--v-theme-warning), 0.4);
}

.search-field :deep(.v-field) {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.search-field :deep(.v-field:hover) {
  border-color: rgba(var(--v-theme-warning), 0.3);
}

.search-field :deep(.v-field--focused) {
  border-color: rgb(var(--v-theme-warning));
  box-shadow: 0 0 0 3px rgba(var(--v-theme-warning), 0.1);
}

.sort-select :deep(.v-field) {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
}

.view-toggle-wrapper {
  text-align: center;
}

.view-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.view-toggle {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
}

.results-count {
  height: 100%;
}

.status-filters {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(var(--v-theme-outline-variant), 0.5);
}

.filter-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-chips {
  gap: 12px;
}

.status-chip {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  min-height: 40px;
  padding: 0 16px;
  transition: all 0.3s ease;
  border-width: 2px;
  position: relative;
}

.status-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.status-chip .v-badge {
  margin-left: 8px;
}

/* Controls Section */
.controls-section {
  padding: 30px 0;
  background: rgba(255, 255, 255, 0.3);
}

.search-field,
.type-select,
.sort-select {
  border-radius: 15px;
}

/* Content Section */
.content-section {
  padding: 40px 0 80px;
}

.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.loading-text {
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-title {
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: rgb(var(--v-theme-warning));
  margin: 20px 0 10px;
}

.empty-subtitle {
  font-family: "Montserrat", sans-serif;
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.reminder-list-item {
  border-bottom: 1px solid rgba(var(--v-theme-warning), 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.reminder-list-item:hover {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-warning), 0.05),
    rgba(var(--v-theme-orange), 0.03)
  );
}

.reminder-list-item:last-child {
  border-bottom: none;
}

.reminder-list-title {
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  color: rgb(var(--v-theme-warning));
}

.reminder-list-subtitle {
  font-family: "Montserrat", sans-serif;
  font-size: 0.85rem;
}

.list-actions {
  display: flex;
  gap: 4px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.reminder-list-item:hover .list-actions {
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 8px;
  }

  .title-icon {
    font-size: 2.5rem !important;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .reminders-hero {
    padding: 60px 0 40px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bell {
    width: 35px;
    height: 45px;
  }
}
</style>
