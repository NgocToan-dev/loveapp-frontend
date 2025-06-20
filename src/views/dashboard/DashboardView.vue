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
  <ResponsiveContainer>
    <v-container fluid class="dashboard-container pa-6">
      <!-- Hero Section -->
      <HeroSection
        :height="400"
        @create-memory="navigateTo('create-memory')"
        class="mb-6"
      />

      <!-- Main Dashboard Content -->
      <v-row>
        <!-- Left Column - Primary Content -->
        <v-col cols="12" lg="8">
        <v-row>
          <!-- Love Quote Widget -->
          <v-col cols="12" md="6">
            <LoveQuoteWidget :height="300" class="mb-4" />
          </v-col>

          <!-- Anniversary Countdown -->
          <v-col cols="12" md="6">
            <AnniversaryCountdown
              :height="300"
              anniversary-date="2024-02-14"
              class="mb-4"
            />
          </v-col>

          <!-- Quick Actions -->
          <v-col cols="12">
            <QuickActions :height="280" class="mb-4" />
          </v-col>
        </v-row>
      </v-col>

      <!-- Right Column - Stats & Activity -->
      <v-col cols="12" lg="4">
        <!-- Love Stats Cards -->
        <v-row class="mb-4">
          <v-col cols="6" sm="6">
            <v-card
              class="text-center pa-4 love-stat-card"
              elevation="2"
              @click="navigateTo('memories')"
            >
              <v-icon size="40" color="pink" class="mb-2"> mdi-heart </v-icon>
              <div class="text-h5 font-weight-bold text-pink mb-1">
                {{ isLoading ? "..." : stats.memories }}
              </div>
              <div class="text-caption text-medium-emphasis">Kỷ niệm</div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6">
            <v-card
              class="text-center pa-4 love-stat-card"
              elevation="2"
              @click="navigateTo('notes')"
            >
              <v-icon size="40" color="primary" class="mb-2"> mdi-note-text </v-icon>
              <div class="text-h5 font-weight-bold text-primary mb-1">
                {{ isLoading ? "..." : stats.notes }}
              </div>
              <div class="text-caption text-medium-emphasis">Ghi chú</div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6">
            <v-card
              class="text-center pa-4 love-stat-card"
              elevation="2"
              @click="navigateTo('reminders')"
            >
              <v-icon size="40" color="orange" class="mb-2"> mdi-bell </v-icon>
              <div class="text-h5 font-weight-bold text-orange mb-1">
                {{ isLoading ? "..." : stats.reminders }}
              </div>
              <div class="text-caption text-medium-emphasis">Nhắc nhở</div>
            </v-card>
          </v-col>

          <v-col cols="6" sm="6">
            <v-card
              class="text-center pa-4 love-stat-card"
              elevation="2"
              @click="navigateTo('anniversaries')"
            >
              <v-icon size="40" color="success" class="mb-2"> mdi-calendar-heart </v-icon>
              <div class="text-h5 font-weight-bold text-success mb-1">
                {{ isLoading ? "..." : stats.anniversaries }}
              </div>
              <div class="text-caption text-medium-emphasis">Kỷ niệm</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Activity -->
        <v-card class="recent-activity-card mb-4" elevation="2" rounded="xl">
          <v-card-title class="font-heading text-h6 pb-2">
            <v-icon start color="primary" size="20">mdi-clock-outline</v-icon>
            Hoạt động gần đây
          </v-card-title>

          <v-card-text class="py-2">
            <v-list v-if="recentItems.length > 0" class="bg-transparent py-0">
              <v-list-item
                v-for="item in recentItems"
                :key="item.id"
                @click="openItem(item)"
                class="px-2 mb-1 rounded-lg hover-item"
                density="compact"
              >
                <template #prepend>
                  <v-avatar :color="getItemColor(item.type)" size="32" class="mr-3">
                    <v-icon :icon="getItemIcon(item.type)" size="16"></v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="text-body-2 font-weight-medium">
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ formatDate(item.updatedAt) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <div v-else class="text-center py-6">
              <v-icon
                icon="mdi-inbox"
                size="32"
                color="grey-lighten-2"
                class="mb-2"
              ></v-icon>
              <p class="text-body-2 text-medium-emphasis">Chưa có hoạt động nào</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>    </v-container>
  </ResponsiveContainer>
</template>

<style scoped>
.dashboard-container {
  background: rgb(var(--v-theme-background));
  min-height: 100vh;
}

.love-stat-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 16px;
  height: 100px;
}

.love-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.15);
}

.recent-activity-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.95)
  );
  transition: all 0.3s ease;
}

.recent-activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.1);
}

.hover-item {
  transition: all 0.2s ease;
  cursor: pointer;
  border-radius: 8px;
}

.hover-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.text-pink {
  color: rgb(233, 30, 99) !important;
}

.text-orange {
  color: rgb(255, 152, 0) !important;
}

/* Typography improvements */
.font-heading {
  font-family: "Playfair Display", Georgia, serif !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px !important;
  }

  .love-stat-card {
    height: 80px;
  }

  .love-stat-card .v-icon {
    size: 32px;
  }

  .love-stat-card .text-h5 {
    font-size: 1.25rem !important;
  }
}

/* Dark mode adjustments */
.v-theme--dark .recent-activity-card {
  background: linear-gradient(145deg, rgba(30, 30, 30, 0.95), rgba(40, 40, 40, 0.95));
}

/* Animation classes */
.stagger-fade-in {
  animation: romanticFadeIn 0.6s ease-out;
}

.stagger-fade-in:nth-child(1) {
  animation-delay: 0.1s;
}
.stagger-fade-in:nth-child(2) {
  animation-delay: 0.2s;
}
.stagger-fade-in:nth-child(3) {
  animation-delay: 0.3s;
}
.stagger-fade-in:nth-child(4) {
  animation-delay: 0.4s;
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

.text-orange {
  color: rgb(255, 152, 0) !important;
}
</style>
