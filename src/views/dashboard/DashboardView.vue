<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useMemoriesStore } from "@/stores/memories";
import { useNotesStore } from "@/stores/notes";

import { useI18n } from "vue-i18n";
import dayjs from "dayjs";

// Import new dashboard components
import HeroSection from "@/components/dashboard/HeroSection.vue";
import LoveQuoteWidget from "@/components/dashboard/LoveQuoteWidget.vue";
import AnniversaryCountdown from "@/components/dashboard/AnniversaryCountdown.vue";
import QuickActions from "@/components/dashboard/QuickActions.vue";
import ResponsiveContainer from "@/components/ui/ResponsiveContainer.vue";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const memoriesStore = useMemoriesStore();
const notesStore = useNotesStore();


// Helper function to safely convert dates
const safeDate = (
  date: Date | { _seconds: number; _nanoseconds: number } | string
): Date => {
  if (date instanceof Date) return date;
  if (typeof date === "string") return new Date(date);
  if (date && typeof date === "object" && "_seconds" in date) {
    return new Date(date._seconds * 1000 + (date._nanoseconds || 0) / 1000000);
  }
  return new Date();
};

// Get real stats from stores
const stats = computed(() => ({
  memories: memoriesStore.totalMemories,
  notes: notesStore.totalNotes,
  reminders: 0, // No reminders store yet
  anniversaries: 0, // No anniversaries store yet
}));

interface RecentItem {
  id: string;
  title: string;
  type: "memory" | "note" | "reminder" | "anniversary";
  updatedAt: Date;
}

interface UpcomingEvent {
  id: string;
  title: string;
  type: "reminder" | "anniversary";
  date: Date;
}

// Get recent items from stores
const recentItems = computed(() => {
  const items: RecentItem[] = [];

  // Add recent memories (with null check)
  if (memoriesStore.memories && Array.isArray(memoriesStore.memories)) {
    memoriesStore.memories.slice(0, 3).forEach((memory) => {
      items.push({
        id: memory.id,
        title: memory.title,
        type: "memory",
        updatedAt: safeDate(memory.updatedAt),
      });
    });
  }

  // Add recent notes (with null check)
  if (notesStore.notes && Array.isArray(notesStore.notes)) {
    notesStore.notes.slice(0, 3).forEach((note) => {
      items.push({
        id: note.id,
        title: note.title,
        type: "note",
        updatedAt: safeDate(note.updatedAt),
      });
    });
  }

  // Sort by updated date
  return items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5);
});

const upcomingEvents = ref<UpcomingEvent[]>([]); // Will be populated when reminders/anniversaries are available
const isLoading = computed(
  () => memoriesStore.isLoading || notesStore.isLoading
);

// Navigation methods
const navigateTo = (route: string) => {
  router.push({ name: route });
};

const createReminder = () => {
  // TODO: Open reminder creation dialog
  console.log("Create reminder");
};

const createAnniversary = () => {
  // TODO: Open anniversary creation dialog
  console.log("Create anniversary");
};

const openItem = (item: any) => {
  // Navigate to item detail page based on type
  switch (item.type) {
    case "memory":
      router.push({ name: "memory-detail", params: { id: item.id } });
      break;
    case "note":
      router.push({ name: "note-detail", params: { id: item.id } });
      break;
    default:
      console.log("Open item:", item);
  }
};

const getItemColor = (type: string) => {
  const colors: Record<string, string> = {
    memory: "pink",
    note: "primary",
    reminder: "orange",
    anniversary: "success",
  };
  return colors[type] || "grey";
};

const getItemIcon = (type: string) => {
  const icons: Record<string, string> = {
    memory: "mdi-heart",
    note: "mdi-note-text",
    reminder: "mdi-bell",
    anniversary: "mdi-calendar-heart",
  };
  return icons[type] || "mdi-file";
};

const formatDate = (date: Date) => {
  return dayjs(date).format("MMM D, YYYY");
};

onMounted(async () => {
  // Load real data from APIs
  try {
    await Promise.all([
      memoriesStore.fetchMemories({ limit: 10 }),
      notesStore.fetchNotes({ limit: 10 }),
    ]);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
});
</script>

<template>
  <div class="dashboard-view">
    <!-- Hero Section với background gradient -->
    <section class="hero-section">
      <ResponsiveContainer class="hero-container">
        <HeroSection
          :height="400"
          @create-memory="navigateTo('create-memory')"
        />
      </ResponsiveContainer>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <ResponsiveContainer>
        <div class="widgets-grid">
          <!-- Left Column - Primary Widgets -->
          <div class="widget-column primary-column">
            <div class="widget-row">
              <LoveQuoteWidget class="widget-card" />
              <AnniversaryCountdown
                anniversary-date="2024-02-14"
                class="widget-card"
              />
            </div>
            <QuickActions class="widget-card full-width" />
          </div>

          <!-- Right Column - Stats & Activity -->
          <div class="widget-column secondary-column">
            <!-- Love Stats Grid -->
            <div class="stats-grid">
              <div 
                class="stat-card hover-lift"
                @click="navigateTo('memories')"
              >
                <div class="stat-icon">
                  <v-icon icon="mdi-heart" color="pink" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ isLoading ? "..." : stats.memories }}</div>
                  <div class="stat-label">Memories</div>
                </div>
              </div>

              <div 
                class="stat-card hover-lift"
                @click="navigateTo('notes')"
              >
                <div class="stat-icon">
                  <v-icon icon="mdi-note-text" color="primary" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ isLoading ? "..." : stats.notes }}</div>
                  <div class="stat-label">Notes</div>
                </div>
              </div>

              <div 
                class="stat-card hover-lift"
                @click="navigateTo('reminders')"
              >
                <div class="stat-icon">
                  <v-icon icon="mdi-bell" color="orange" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ isLoading ? "..." : stats.reminders }}</div>
                  <div class="stat-label">Reminders</div>
                </div>
              </div>

              <div 
                class="stat-card hover-lift"
                @click="navigateTo('anniversaries')"
              >
                <div class="stat-icon">
                  <v-icon icon="mdi-calendar-heart" color="success" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ isLoading ? "..." : stats.anniversaries }}</div>
                  <div class="stat-label">Anniversaries</div>
                </div>
              </div>
            </div>

            <!-- Recent Activity Card -->
            <v-card class="recent-activity-card widget-card rounded-lg">
              <v-card-title class="recent-activity-title">
                <v-icon icon="mdi-clock-outline" color="primary" size="20" class="mr-2" />
                Recent Activity
              </v-card-title>

              <v-card-text class="recent-activity-content">
                <v-list v-if="recentItems.length > 0" class="bg-transparent">
                  <v-list-item
                    v-for="item in recentItems"
                    :key="item.id"
                    @click="openItem(item)"
                    class="recent-item hover-lift"
                    density="compact"
                  >
                    <template #prepend>
                      <v-avatar :color="getItemColor(item.type)" size="32" class="mr-3">
                        <v-icon :icon="getItemIcon(item.type)" size="16" />
                      </v-avatar>
                    </template>

                    <v-list-item-title class="recent-item-title">
                      {{ item.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="recent-item-date">
                      {{ formatDate(item.updatedAt) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>

                <div v-else class="empty-state">
                  <v-icon icon="mdi-inbox" size="48" color="grey-lighten-2" class="mb-3" />
                  <p class="empty-state-text">No recent activity</p>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </ResponsiveContainer>
    </main>
  </div>
</template>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--v-theme-background) 0%, var(--v-theme-surface) 100%);
}

.hero-section {
  padding: 48px 0;
  background: linear-gradient(135deg, var(--v-theme-primary-lighten-5) 0%, var(--v-theme-surface) 100%);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 32px 0;
  }
}

.hero-container {
  position: relative;
  z-index: 2;
}

.main-content {
  padding: 48px 0;
  position: relative;
  z-index: 1;
  margin-top: -24px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 32px 0;
    margin-top: -16px;
  }
}

.widgets-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

@media (max-width: 1024px) {
  .widgets-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.widget-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.primary-column .widget-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .primary-column .widget-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.primary-column .full-width {
  grid-column: 1 / -1;
}

.widget-card {
  background: var(--v-theme-surface);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--v-theme-outline-variant), 0.12);
}

.widget-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--v-theme-surface);
  border-radius: 12px;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(var(--v-theme-outline-variant), 0.08);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--v-theme-primary-lighten-4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--v-theme-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--v-theme-on-surface-variant);
  line-height: 1.5;
  margin-top: 2px;
}

.recent-activity-card :deep(.v-card-title) {
  padding: 20px 20px 8px 20px !important;
}

.recent-activity-card :deep(.v-card-text) {
  padding: 8px 20px 20px 20px !important;
}

.recent-activity-title {
  font-size: 1.125rem !important;
  font-weight: 600 !important;
  color: var(--v-theme-on-surface) !important;
  display: flex;
  align-items: center;
}

.recent-activity-content :deep(.v-list) {
  padding: 0 !important;
}

.recent-item {
  border-radius: 8px !important;
  margin-bottom: 8px !important;
  padding: 8px !important;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.recent-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
  transform: translateX(4px);
}

.recent-item:last-child {
  margin-bottom: 0 !important;
}

.recent-item-title {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  color: var(--v-theme-on-surface) !important;
}

.recent-item-date {
  font-size: 0.75rem !important;
  color: var(--v-theme-on-surface-variant) !important;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-state-text {
  font-size: 0.875rem;
  color: var(--v-theme-on-surface-variant);
  margin: 0;
}

@media (max-width: 768px) {
  .stats-grid {
    gap: 12px;
  }
  
  .stat-card {
    padding: 16px 12px;
    gap: 10px;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .recent-item {
    padding: 12px 8px !important;
  }
}

.v-theme--dark .dashboard-view {
  background: linear-gradient(135deg, var(--v-theme-background) 0%, var(--v-theme-surface-variant) 100%);
}

.v-theme--dark .hero-section {
  background: linear-gradient(135deg, var(--v-theme-surface-variant) 0%, var(--v-theme-surface) 100%);
}

.v-theme--dark .widget-card {
  border-color: rgba(var(--v-theme-outline), 0.12);
}

.v-theme--dark .stat-card {
  border-color: rgba(var(--v-theme-outline), 0.08);
}

@media (prefers-reduced-motion: reduce) {
  .widget-card,
  .stat-card,
  .recent-item {
    transition: none !important;
  }
  
  .hover-lift:hover {
    transform: none !important;
  }
}

.stat-card:focus-visible,
.recent-item:focus-visible {
  outline: 2px solid var(--v-theme-primary);
  outline-offset: 2px;
}
</style>
