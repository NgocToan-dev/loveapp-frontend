<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>{{ greeting }}, {{ userDisplayName }}! {{ getRandomHeartEmoji() }}</h1>
      <p class="welcome-message">{{ $t("dashboard.welcome") }}</p>
    </div>

    <!-- Couple Connection Status -->
    <div class="dashboard-section">
      <CoupleInvitationCard />
    </div>

    <!-- Quick Stats -->
    <div v-if="isConnected" class="dashboard-section">
      <div class="stats-grid">
        <QuickActionCard
          :title="$t('dashboard.stats.daysTogther')"
          :description="daysTogethger.toString() + ' ' + $t('dashboard.stats.days')"
          icon="💕"
        />

        <QuickActionCard
          :title="$t('dashboard.stats.memories')"
          :description="memoriesCount.toString() + ' ' + $t('dashboard.stats.saved')"
          icon="📸"
          @click="$router.push('/memories')"
        />

        <QuickActionCard
          :title="$t('dashboard.stats.reminders')"
          :description="remindersCount.toString() + ' ' + $t('dashboard.stats.active')"
          icon="⏰"
          @click="$router.push('/reminders')"
        />

        <QuickActionCard
          v-if="upcomingReminders.length > 0"
          :title="$t('dashboard.stats.upcomingEvents')"
          :description="upcomingReminders.length.toString() + ' ' + $t('dashboard.stats.upcoming')"
          icon="🎉"
          @click="$router.push('/reminders')"
        />
      </div>
    </div>

    <!-- Recent Activity -->
    <div v-if="isConnected && recentActivity.length > 0" class="dashboard-section">
      <div class="section-header">
        <h2>{{ $t("dashboard.recentActivity") }}</h2>
        <Button @click="$router.push('/timeline')" variant="outline" size="sm">
          {{ $t("dashboard.activity.viewAll") }}
        </Button>
      </div>

      <div class="activity-list">
        <div
          v-for="activity in recentActivity.slice(0, 5)"
          :key="`${activity.type}-${activity.id}`"
          class="activity-item"
          @click="viewActivity(activity)"
        >
          <div class="activity-icon">
            {{ getActivityIcon(activity.type) }}
          </div>
          <div class="activity-content">
            <h4>{{ activity.title }}</h4>
            <p class="activity-description" v-if="activity.description">
              {{ truncateText(activity.description, 100) }}
            </p>
            <p class="activity-date">
              {{ formatDate(activity.date, 'relative') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Reminders -->
    <div v-if="isConnected && upcomingReminders.length > 0" class="dashboard-section">
      <div class="section-header">
        <h2>{{ $t("dashboard.upcomingReminders") }}</h2>
        <Button @click="$router.push('/reminders')" variant="outline" size="sm">
          {{ $t("dashboard.activity.viewAll") }}
        </Button>
      </div>

      <div class="reminders-list">
        <div
          v-for="reminder in upcomingReminders.slice(0, 3)"
          :key="reminder.id"
          class="reminder-item"
          @click="viewReminder(reminder.id)"
        >
          <div class="reminder-icon">
            {{ getReminderIcon(reminder.type) }}
          </div>
          <div class="reminder-content">
            <h4>{{ reminder.title }}</h4>
            <p class="reminder-date">
              {{ formatDateTime(reminder.reminderDate, reminder.reminderTime) }}
            </p>
          </div>
          <div class="reminder-countdown">
            {{ getDaysUntil(reminder.reminderDate) === 0 ? $t('timeline.today') : 
               getDaysUntil(reminder.reminderDate) + ' ' + $t('timeline.daysLeft') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div v-if="isConnected" class="dashboard-section">
      <div class="section-header">
        <h2>{{ $t("dashboard.quick_actions") }}</h2>
      </div>

      <div class="quick-actions-grid">
        <Button
          @click="showCreateMemory = true"
          variant="primary"
          size="lg"
          class="quick-action-btn"
        >
          <span class="action-icon">📸</span>
          {{ $t("memories.create.title") }}
        </Button>

        <Button
          @click="showCreateReminder = true"
          variant="secondary"
          size="lg"
          class="quick-action-btn"
        >
          <span class="action-icon">⏰</span>
          {{ $t("reminders.create.title") }}
        </Button>

        <Button
          @click="$router.push('/timeline')"
          variant="outline"
          size="lg"
          class="quick-action-btn"
        >
          <span class="action-icon">📅</span>
          {{ $t("navigation.timeline") }}
        </Button>
      </div>
    </div>

    <!-- Today's Quote -->
    <div class="dashboard-section">
      <div class="quote-card">
        <div class="quote-icon">💭</div>
        <blockquote>{{ todayQuote }}</blockquote>
      </div>
    </div>

    <!-- Create Memory Modal -->
    <Modal v-model="showCreateMemory" :title="$t('memories.create.title')">
      <MemoryForm 
        :isOpen="showCreateMemory"
        @success="handleCreateMemory"
        @close="showCreateMemory = false" 
      />
    </Modal>

    <!-- Create Reminder Modal -->
    <Modal v-model="showCreateReminder" :title="$t('reminders.create.title')">
      <ReminderForm 
        @submit="handleCreateReminder" 
        @cancel="showCreateReminder = false" 
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuth } from "@/composables/useAuth";
import { useCouple } from "@/composables/useCouple";
import { useMemories } from "@/composables/useMemories";
import { useReminders } from "@/composables/useReminders";
import { useStatistics } from "@/composables/useStatistics";
import {
  getRandomRomanticQuote,
  getRandomHeartEmoji,
  formatCountdown,
  formatDateTime,
  formatDate,
  getDaysUntil,
  truncateText
} from "@/utils/helpers";
import CoupleInvitationCard from "@/components/couple/CoupleInvitationCard.vue";
import QuickActionCard from "@/components/common/QuickActionCard.vue";
import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
import MemoryForm from "@/components/memories/MemoryForm.vue";
import ReminderForm from "@/components/reminders/ReminderForm.vue";

const { t } = useI18n();
const router = useRouter();

const { userDisplayName } = useAuth();
const { isConnected, coupleConnection, fetchCoupleConnection } = useCouple();
const { fetchMemories, createMemory } = useMemories();
const { createReminder, fetchReminders } = useReminders();

// Use statistics composable
const {
  memoriesCount,
  remindersCount,
  daysTogethger,
  upcomingReminders,
  recentActivity,
  greeting: timeGreeting
} = useStatistics();

// State
const showCreateMemory = ref(false);
const showCreateReminder = ref(false);
const todayQuote = ref(getRandomRomanticQuote());

// Computed
const greeting = computed(() => t(`dashboard.greeting.${timeGreeting.value}`));

// Methods
const viewActivity = (activity: any) => {
  if (activity.type === 'memory') {
    router.push('/memories');
  } else if (activity.type === 'reminder') {
    router.push('/reminders');
  }
}

const viewReminder = (id: string) => {
  router.push(`/reminders`);
};

const getActivityIcon = (type: string) => {
  const icons = {
    memory: "📸",
    reminder: "⏰",
    anniversary: "💝",
  };
  return icons[type as keyof typeof icons] || "✨";
};

const getReminderIcon = (type: string) => {
  const icons = {
    anniversary: "💝",
    birthday: "🎂",
    date: "💕",
    custom: "⭐",
  };
  return icons[type as keyof typeof icons] || "⏰";
};

const handleCreateMemory = async () => {
  try {
    showCreateMemory.value = false;
    await fetchMemories(); // Refresh memories
  } catch (error) {
    console.error("Failed to create memory:", error);
  }
};

const handleCreateReminder = async (reminderData: any) => {
  try {
    await createReminder(reminderData);
    showCreateReminder.value = false;
    await fetchReminders(); // Refresh reminders
  } catch (error) {
    console.error("Failed to create reminder:", error);
  }
};

// Lifecycle
onMounted(async () => {
  await fetchCoupleConnection();

  if (isConnected.value) {
    await Promise.all([
      fetchMemories(), // Get all memories
      fetchReminders(), // Get all reminders
    ]);
  }
});
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.dashboard-header .welcome-message {
  color: #666;
  font-size: 1.125rem;
  margin: 0;
}

.dashboard-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.activity-item:hover {
  border-color: #4caf50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
}

.activity-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-content h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
}

.activity-description {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
}

.activity-date {
  margin: 0;
  color: #999;
  font-size: 0.75rem;
}

.reminders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reminder-item:hover {
  border-color: #4caf50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
}

.reminder-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
}

.reminder-content {
  flex: 1;
}

.reminder-content h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
}

.reminder-date {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.reminder-countdown {
  color: #4caf50;
  font-weight: 600;
  font-size: 0.875rem;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  height: auto;
  min-height: 120px;
}

.action-icon {
  font-size: 2rem;
}

.quote-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
}

.quote-icon {
  font-size: 2rem;
  margin-bottom: 16px;
}

.quote-card blockquote {
  font-size: 1.125rem;
  font-style: italic;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }

  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .stats-grid,
  .memories-grid,
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .reminder-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
