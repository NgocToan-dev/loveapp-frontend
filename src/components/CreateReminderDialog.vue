<template>
  <v-card
    rounded="xl"
    elevation="0"
    class="reminder-form-card"
    :style="{
      backgroundColor: 'rgb(var(--v-theme-surface))',
      border: '1px solid rgb(var(--v-theme-outline-variant))',
    }"
  >
    <!-- Header -->
    <v-card-title class="reminder-form-header">
      <div class="header-content">
        <div class="header-icon">
          <v-icon color="warning" size="32">mdi-bell-plus</v-icon>
        </div>
        <div class="header-text">
          <h2 class="form-title">{{ t('reminders.createNew') }}</h2>
          <p class="form-subtitle">{{ t('reminders.createSubtitle') }}</p>
        </div>
      </div>
    </v-card-title>
    <v-card-text class="reminder-form-content">
      <!-- Error Alert -->
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-6"
        rounded="xl"
        closable
        @click:close="errorMessage = ''"
      >
        {{ errorMessage }}
      </v-alert>

      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="handleSubmit"
        :disabled="isLoading"
      >
        <!-- Title Section -->
        <div class="form-section mb-6">
          <div class="section-header">
            <v-icon size="20" color="warning" class="mr-2">mdi-format-title</v-icon>
            <h3 class="section-title">{{ t('reminders.details') }}</h3>
          </div>
          <v-card variant="outlined" rounded="xl" class="section-card">
            <v-card-text class="pa-6">
              <v-text-field
                v-model="formData.title"
                label="Bạn muốn được nhắc về điều gì?"
                placeholder="Ví dụ: Kỷ niệm ngày hẹn hò đầu tiên"
                :rules="titleRules"
                variant="outlined"
                rounded="xl"
                density="comfortable"
                required
                counter="100"
                maxlength="100"
                hide-details="auto"
                prepend-inner-icon="mdi-heart"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-card-text>
          </v-card>
        </div>

        <!-- Date & Time Section -->
        <div class="form-section mb-6">
          <div class="section-header">
            <v-icon size="20" color="warning" class="mr-2">mdi-calendar-clock</v-icon>
            <h3 class="section-title">Thời gian & Mức độ quan trọng</h3>
          </div>
          <v-card variant="outlined" rounded="xl" class="section-card">
            <v-card-text class="pa-6">
              <v-text-field
                v-model="formData.reminderDate"
                label="Khi nào bạn muốn được nhắc?"
                :rules="dateRules"
                variant="outlined"
                rounded="xl"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
                type="datetime-local"
                required
                hide-details="auto"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
              <div class="priority-section">
                <v-chip-group
                  v-model="formData.priority"
                  selected-class="priority-selected"
                  mandatory
                  variant="elevated"
                  class="priority-chips"
                >
                  <v-chip
                    v-for="option in priorityOptions"
                    :key="option.value"
                    :value="option.value"
                    :color="
                      option.value === 'high'
                        ? 'error'
                        : option.value === 'medium'
                        ? 'warning'
                        : 'success'
                    "
                    variant="outlined"
                    size="default"
                    rounded="xl"
                    class="priority-chip"
                  >
                    <v-icon
                      start
                      size="16"
                      :icon="getPriorityIcon(option.value)"
                    ></v-icon>
                    {{ option.title }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Additional Options Section -->
        <div class="form-section mb-6">
          <div class="section-header">
            <v-icon size="20" color="warning" class="mr-2">mdi-cog</v-icon>
            <h3 class="section-title">Tùy chọn bổ sung</h3>
          </div>
          <v-card variant="outlined" rounded="xl" class="section-card">
            <v-card-text class="pa-6">
              <v-select
                v-model="formData.repeat"
                :items="repeatOptions"
                label="Lặp lại lời nhắc này"
                variant="outlined"
                rounded="xl"
                density="comfortable"
                prepend-inner-icon="mdi-repeat"
                clearable
                hide-details="auto"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
              <v-textarea
                class="mt-4"
                v-model="formData.description"
                label="Thêm ghi chú (tùy chọn)"
                placeholder="Thêm chi tiết về lời nhắc này..."
                variant="outlined"
                rounded="xl"
                density="comfortable"
                rows="3"
                counter
                no-resize
                hide-details="auto"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-card-text>
          </v-card>
        </div>
      </v-form>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions class="reminder-form-actions">
      <v-spacer />
      <v-btn
        variant="outlined"
        rounded="xl"
        size="large"
        @click="$emit('cancel')"
        class="cancel-btn"
      >
        <v-icon start>mdi-close</v-icon>
        Hủy bỏ
      </v-btn>
      <v-btn
        color="warning"
        variant="flat"
        rounded="xl"
        size="large"
        :loading="isLoading"
        :disabled="!valid"
        @click="handleSubmit"
        class="submit-btn"
      >
        <v-icon start>mdi-bell</v-icon>
        Tạo lời nhắc
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRemindersStore } from "@/stores/reminders";

const { t } = useI18n();
const remindersStore = useRemindersStore();

// Form references
const form = ref();
const valid = ref(false);

// Helper function to format date for datetime-local input
const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Reactive data
const formData = ref({
  title: "",
  description: "",
  reminderDate: formatDateTimeLocal(new Date()), // Default to current date/time in correct format
  priority: "medium" as "low" | "medium" | "high",
  repeat: "" as "" | "daily" | "weekly" | "monthly" | "yearly",
});

const isLoading = ref(false);
const errorMessage = ref("");

// Computed
const priorityOptions = computed(() => [
  { title: "Thấp", value: "low" },
  { title: "Trung bình", value: "medium" },
  { title: "Cao", value: "high" },
]);

const repeatOptions = computed(() => [
  { title: "Hàng ngày", value: "daily" },
  { title: "Hàng tuần", value: "weekly" },
  { title: "Hàng tháng", value: "monthly" },
  { title: "Hàng năm", value: "yearly" },
]);

// Validation rules
const titleRules = [
  (v: string) => !!v || "Trường này là bắt buộc",
  (v: string) => (v && v.length <= 100) || "Tối đa 100 ký tự",
];

const dateRules = [
  (v: string) => !!v || "Trường này là bắt buộc",
  (v: string) => {
    if (!v) return true;
    const selectedDate = new Date(v);
    const now = new Date();
    return selectedDate >= now || "Ngày nhắc phải là thời gian trong tương lai";
  },
];

// Helper functions
const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return "mdi-flag";
    case "medium":
      return "mdi-flag-outline";
    case "low":
      return "mdi-flag-variant";
    default:
      return "mdi-flag-outline";
  }
};

// Events
const emit = defineEmits<{
  confirm: [data: any];
  cancel: [];
}>();

// Methods
const handleSubmit = async () => {
  if (!valid.value) return;

  try {
    isLoading.value = true;
    // Create reminder using store
    const newReminder = await remindersStore.createReminder({
      title: formData.value.title,
      description: formData.value.description,
      reminderDate: new Date(formData.value.reminderDate), // Convert string to Date
      priority: formData.value.priority,
      repeat: formData.value.repeat || undefined,
    });

    // Emit success with the created reminder
    emit("confirm", newReminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    // Could show error toast here
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.reminder-form-card {
  max-width: 800px !important;
  margin: 0 auto;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08) !important;
  backdrop-filter: blur(10px);
}

/* Header Styles */
.reminder-form-header {
  padding: 32px 32px 24px !important;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-warning), 0.1) 0%,
    rgba(var(--v-theme-primary), 0.05) 100%
  );
  border-bottom: 1px solid rgba(var(--v-theme-outline-variant), 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-warning), 0.2),
    rgba(var(--v-theme-warning), 0.1)
  );
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(var(--v-theme-warning), 0.2);
}

.form-title {
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: rgb(var(--v-theme-warning));
  margin: 0;
  line-height: 1.2;
}

.form-subtitle {
  font-family: "Montserrat", sans-serif;
  font-size: 0.95rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 4px 0 0;
  line-height: 1.4;
}

/* Content Styles */
.reminder-form-content {
  padding: 32px !important;
}

.form-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
}

.section-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.7)
  ) !important;
  border: 1px solid rgba(var(--v-theme-outline-variant), 0.5) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
  border-color: rgba(var(--v-theme-warning), 0.3) !important;
}

/* Priority Section */
.priority-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.priority-chips {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.priority-chip {
  font-family: "Montserrat", sans-serif !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  border-width: 2px !important;
}

.priority-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.priority-selected {
  border-width: 2px !important;
  box-shadow: 0 4px 15px rgba(var(--v-theme-warning), 0.3) !important;
  transform: scale(1.02);
}

/* Actions Styles */
.reminder-form-actions {
  padding: 24px 32px 32px !important;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-surface), 0.9) 0%,
    rgba(var(--v-theme-surface), 0.7) 100%
  );
  border-top: 1px solid rgba(var(--v-theme-outline-variant), 0.3);
  gap: 16px;
}

.cancel-btn {
  font-family: "Montserrat", sans-serif !important;
  font-weight: 600 !important;
  padding: 12px 24px !important;
  border: 2px solid rgba(var(--v-theme-on-surface), 0.2) !important;
  transition: all 0.3s ease !important;
}

.cancel-btn:hover {
  border-color: rgba(var(--v-theme-on-surface), 0.4) !important;
  background: rgba(var(--v-theme-on-surface), 0.05) !important;
}

.submit-btn {
  font-family: "Montserrat", sans-serif !important;
  font-weight: 600 !important;
  padding: 12px 24px !important;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-warning)),
    rgba(var(--v-theme-warning), 0.8)
  ) !important;
  box-shadow: 0 4px 15px rgba(var(--v-theme-warning), 0.3) !important;
  transition: all 0.3s ease !important;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--v-theme-warning), 0.4) !important;
}

.submit-btn:disabled {
  background: rgba(var(--v-theme-on-surface), 0.2) !important;
  box-shadow: none !important;
  transform: none !important;
}

/* Form Field Styles */
:deep(.v-field) {
  border-radius: 16px !important;
  font-family: "Montserrat", sans-serif !important;
}

:deep(.v-field--focused) {
  border-color: rgba(var(--v-theme-warning), 0.6) !important;
  box-shadow: 0 0 0 2px rgba(var(--v-theme-warning), 0.1) !important;
}

:deep(.v-label) {
  font-family: "Montserrat", sans-serif !important;
  font-weight: 500 !important;
}

:deep(.v-input__details) {
  font-family: "Montserrat", sans-serif !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .reminder-form-header {
    padding: 24px 20px 16px !important;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .header-icon {
    width: 50px;
    height: 50px;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .reminder-form-content {
    padding: 24px 20px !important;
  }

  .reminder-form-actions {
    padding: 20px !important;
    flex-direction: column;
  }

  .priority-chips {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .section-card {
    border-radius: 12px !important;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
