<template>
  <AppLayout>
    <div class="reminder-page">
      <!-- Couple Time Banner -->
      <CoupleTimeBanner />

      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>{{ $t("reminders.title") }}</h1>
          <p class="page-description">{{ $t("reminders.description") }}</p>
        </div>

        <div class="header-actions">
          <!-- Filter Dropdown -->
          <select 
            v-if="isConnected"
            v-model="selectedFilter" 
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mr-3"
          >
            <option value="all">{{ $t('reminders.filters.all') }}</option>
            <option value="overdue">{{ $t('reminders.filters.overdue') }}</option>
            <option value="upcoming">{{ $t('reminders.filters.upcoming') }}</option>
            <option value="future">{{ $t('reminders.filters.future') }}</option>
            <option value="completed">{{ $t('reminders.filters.completed') }}</option>
            <option value="pending">{{ $t('reminders.filters.pending') }}</option>
          </select>
          
          <Button
            v-if="isConnected"
            @click="handleCreateClick"
            variant="primary"
            class="create-button"
          >
            <span class="button-icon">⏰</span>
            {{ $t("reminders.create.title") }}
          </Button>
          <Button
            v-else
            variant="outline"
            class="create-button"
            disabled
          >
            <span class="button-icon">⏰</span>
            {{ $t("reminders.create.title") }}
          </Button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div v-if="isConnected" class="stats-section">
        <div class="stats-grid">
          <QuickActionCard
            :title="$t('reminders.stats.total')"
            :description="remindersCount.toString()"
            icon="📝"
            color="primary"
          />

          <QuickActionCard
            :title="$t('reminders.stats.completed')"
            :description="completedReminders.length.toString()"
            icon="✅"
            color="success"
          />

          <QuickActionCard
            :title="$t('reminders.stats.upcoming')"
            :description="upcomingReminders.length.toString()"
            icon="⏰"
            color="warning"
          />

          <QuickActionCard
            :title="$t('reminders.stats.overdue')"
            :description="overdueReminders.length.toString()"
            icon="⚠️"
            color="danger"
          />
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <!-- No Connection State -->
        <div v-if="!isConnected" class="no-connection">
          <div class="empty-state">
            <div class="empty-icon">💕</div>
            <h3>{{ $t("reminders.no_connection_title") }}</h3>
            <p>{{ $t("reminders.no_connection_message") }}</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="isLoading && reminders.length === 0" class="loading-state">
          <LoadingSpinner />
          <p>{{ $t("common.status.loading") }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading && filteredReminders.length === 0" class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>{{ getEmptyStateTitle() }}</h3>
          <p>{{ getEmptyStateMessage() }}</p>
          <Button @click="showCreateForm = true" variant="primary">
            {{ $t("reminders.create_first") }}
          </Button>
        </div>

        <!-- Reminders List -->
        <div v-else class="reminders-container">
          <!-- Filter Results Header -->
          <div v-if="selectedFilter !== 'all'" class="mb-4">
            <h2 class="text-lg font-medium text-gray-900">
              {{ getFilterTitle() }} ({{ filteredReminders.length }})
            </h2>
          </div>

          <!-- All Reminders View - Organized by Sections -->
          <div v-if="selectedFilter === 'all'">
            <!-- Overdue Reminders -->
            <div v-if="overdueReminders.length > 0" class="reminders-section">
              <h2 class="section-title overdue">
                ⚠️ {{ $t("reminders.overdue") }} ({{ overdueReminders.length }})
              </h2>
              <div class="reminders-grid">
                <ReminderCard
                  v-for="reminder in overdueReminders"
                  :key="reminder.id"
                  :reminder="reminder"
                  :is-updating="updatingId === reminder.id"
                  @edit="editReminder"
                  @delete="deleteReminder"
                  @toggle-complete="toggleComplete"
                  @snooze="snoozeReminder"
                />
              </div>
            </div>

            <!-- Upcoming Reminders -->
            <div v-if="upcomingReminders.length > 0" class="reminders-section">
              <h2 class="section-title upcoming">
                ⏰ {{ $t("reminders.upcoming") }} ({{ upcomingReminders.length }})
              </h2>
              <div class="reminders-grid">
                <ReminderCard
                  v-for="reminder in upcomingReminders"
                  :key="reminder.id"
                  :reminder="reminder"
                  :is-updating="updatingId === reminder.id"
                  @edit="editReminder"
                  @delete="deleteReminder"
                  @toggle-complete="toggleComplete"
                  @snooze="snoozeReminder"
                />
              </div>
            </div>

            <!-- Future Reminders -->
            <div v-if="futureReminders.length > 0" class="reminders-section">
              <h2 class="section-title future">
                📅 {{ $t("reminders.future") }} ({{ futureReminders.length }})
              </h2>
              <div class="reminders-grid">
                <ReminderCard
                  v-for="reminder in futureReminders"
                  :key="reminder.id"
                  :reminder="reminder"
                  :is-updating="updatingId === reminder.id"
                  @edit="editReminder"
                  @delete="deleteReminder"
                  @toggle-complete="toggleComplete"
                  @snooze="snoozeReminder"
                />
              </div>
            </div>

            <!-- Completed Reminders -->
            <div v-if="completedReminders.length > 0" class="reminders-section">
              <h2 class="section-title completed">
                ✅ {{ $t("reminders.completed") }} ({{ completedReminders.length }})
              </h2>
              <div class="reminders-grid">
                <ReminderCard
                  v-for="reminder in completedReminders"
                  :key="reminder.id"
                  :reminder="reminder"
                  :is-updating="updatingId === reminder.id"
                  @edit="editReminder"
                  @delete="deleteReminder"
                  @toggle-complete="toggleComplete"
                  @snooze="snoozeReminder"
                />
              </div>
            </div>
          </div>

          <!-- Filtered Results (when specific filter is selected) -->
          <div v-else class="reminders-grid">
            <ReminderCard
              v-for="reminder in filteredReminders"
              :key="reminder.id"
              :reminder="reminder"
              :is-updating="updatingId === reminder.id"
              @edit="editReminder"
              @delete="deleteReminder"
              @toggle-complete="toggleComplete"
              @snooze="snoozeReminder"
            />
          </div>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <Modal
        v-if="showCreateForm"
        v-model="showCreateForm"
        :title="
          editingReminder ? $t('reminders.edit.title') : $t('reminders.create.title')
        "
        size="lg"
      >
        <ReminderForm
          :reminder="editingReminder || undefined"
          :is-submitting="isLoading"
          @submit="handleFormSubmit"
          @cancel="closeForm"
        />
      </Modal>

      <!-- Error Display -->
      <div v-if="error" class="error-banner">
        <div class="error-content">
          <span class="error-icon">❌</span>
          <span class="error-message">{{ error }}</span>
          <Button @click="clearError" variant="ghost" size="sm">
            {{ $t("common.dismiss") }}
          </Button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCouple } from "@/composables/useCouple";
import { useReminders } from "@/composables/useReminders";
import type { Reminder, CreateReminderRequest, UpdateReminderRequest } from "@/types";

import AppLayout from "@/components/layout/AppLayout.vue";
import CoupleTimeBanner from "@/components/couple/CoupleTimeBanner.vue";
import QuickActionCard from "@/components/common/QuickActionCard.vue";
import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import ReminderCard from "@/components/reminders/ReminderCard.vue";
import ReminderForm from "@/components/reminders/ReminderForm.vue";

const { t } = useI18n();
const { isConnected } = useCouple();

const {
  reminders,
  upcomingReminders,
  overDueReminders: overdueReminders,
  completedReminders,
  remindersCount,
  isLoading,
  error,
  fetchReminders,
  createReminder,
  updateReminder,
  deleteReminder: deleteReminderFromStore,
  markCompleted,
  markIncomplete,
  snoozeReminder,
  clearError,
} = useReminders();

// Local state
const showCreateForm = ref(false);
const editingReminder = ref<Reminder | null>(null);
const updatingId = ref<string | null>(null);
const selectedFilter = ref<'all' | 'overdue' | 'upcoming' | 'future' | 'completed' | 'pending'>('all');

// Computed properties for filtering
const futureReminders = computed(() => {
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return reminders.value.filter(reminder => 
    !reminder.isCompleted && new Date(reminder.datetime) > nextWeek
  );
});

const pendingReminders = computed(() => {
  return reminders.value.filter(reminder => !reminder.isCompleted);
});

const filteredReminders = computed(() => {
  switch (selectedFilter.value) {
    case 'overdue':
      return overdueReminders.value;
    case 'upcoming':
      return upcomingReminders.value;
    case 'future':
      return futureReminders.value;
    case 'completed':
      return completedReminders.value;
    case 'pending':
      return pendingReminders.value;
    case 'all':
    default:
      return reminders.value;
  }
});

// Helper methods for empty state and filters
const getEmptyStateTitle = () => {
  switch (selectedFilter.value) {
    case 'overdue':
      return t('reminders.no_overdue_title');
    case 'upcoming':
      return t('reminders.no_upcoming_title');
    case 'future':
      return t('reminders.no_future_title');
    case 'completed':
      return t('reminders.no_completed_title');
    case 'pending':
      return t('reminders.no_pending_title');
    default:
      return t('reminders.no_reminders_title');
  }
};

const getEmptyStateMessage = () => {
  switch (selectedFilter.value) {
    case 'overdue':
      return t('reminders.no_overdue_message');
    case 'upcoming':
      return t('reminders.no_upcoming_message');
    case 'future':
      return t('reminders.no_future_message');
    case 'completed':
      return t('reminders.no_completed_message');
    case 'pending':
      return t('reminders.no_pending_message');
    default:
      return t('reminders.no_reminders_message');
  }
};

const getFilterTitle = () => {
  switch (selectedFilter.value) {
    case 'overdue':
      return t('reminders.overdue');
    case 'upcoming':
      return t('reminders.upcoming');
    case 'future':
      return t('reminders.future');
    case 'completed':
      return t('reminders.completed');
    case 'pending':
      return t('reminders.pending');
    default:
      return t('reminders.all');
  }
};

// Methods
const handleCreateClick = () => {
  console.log("Create button clicked");
  showCreateForm.value = true;
};

const showReminderDetail = (reminder: Reminder) => {
  // Functionality removed - clicking on reminder card does nothing
};

const editReminder = (reminder: Reminder) => {
  // Không cho phép sửa reminder đã hoàn thành
  if (reminder.isCompleted) {
    console.log("Cannot edit completed reminder");
    return;
  }
  
  editingReminder.value = reminder;
  showCreateForm.value = true;
};

const closeForm = () => {
  showCreateForm.value = false;
  editingReminder.value = null;
};

const handleFormSubmit = async (data: CreateReminderRequest | UpdateReminderRequest) => {
  try {
    if (editingReminder.value) {
      await updateReminder(data as UpdateReminderRequest);
    } else {
      await createReminder(data as CreateReminderRequest);
    }
    closeForm();
  } catch (error) {
    // Error handled in composable
  }
};

const deleteReminder = async (id: string) => {
  try {
    await deleteReminderFromStore(id);
  } catch (error) {
    // Error handled in composable
  }
};

const toggleComplete = async (id: string) => {
  updatingId.value = id;
  try {
    const reminder = reminders.value.find((r: any) => r.id === id);
    if (reminder) {
      if (reminder.isCompleted) {
        await markIncomplete(id);
      } else {
        await markCompleted(id);
      }
    }
  } catch (error) {
    // Error handled in composable
    console.error('Toggle complete error:', error);
  } finally {
    updatingId.value = null;
  }
};

// Lifecycle
onMounted(async () => {
  await fetchReminders();
});

// Debug watcher for modal state
watch(showCreateForm, (newValue) => {
  console.log("showCreateForm changed to:", newValue);
});
</script>

<style scoped>
.reminder-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
}

.header-content {
  flex: 1;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.page-description {
  color: #666;
  margin: 0;
  font-size: 1.125rem;
}

.create-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
}

.button-icon {
  font-size: 1.125rem;
}

.stats-section {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.content-area {
  min-height: 400px;
}

.no-connection,
.loading-state,
.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.empty-state p {
  color: #666;
  margin: 0 0 24px 0;
  font-size: 1.125rem;
}

.reminders-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #2c3e50;
}

.section-title.upcoming {
  color: #4caf50;
}

.section-title.overdue {
  color: #f44336;
}

.section-title.future {
  color: #9c27b0;
}

.section-title.completed {
  color: #9e9e9e;
}

.reminders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.error-banner {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #ffebee;
  border: 1px solid #f44336;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #c62828;
}

.error-icon {
  font-size: 1.125rem;
}

.error-message {
  flex: 1;
  font-weight: 500;
}

@media (max-width: 768px) {
  .reminder-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .reminders-grid {
    grid-template-columns: 1fr;
  }

  .error-banner {
    bottom: 16px;
    right: 16px;
    left: 16px;
  }
}
</style>
