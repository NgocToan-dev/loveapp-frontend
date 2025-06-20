<template>
  <v-container class="pa-6" max-width="800">
    <div class="text-center mb-8">
      <h1 class="font-heading text-3xl mb-4" :style="{ color: 'rgb(var(--v-theme-on-surface))' }">
        ✏️ Chỉnh sửa Nhắc nhở
      </h1>
      <p class="text-lg font-script" :style="{ color: 'rgb(var(--v-theme-on-surface-variant))' }">
        "Đừng để những điều quan trọng bị lãng quên..."
      </p>
    </div>

    <v-card rounded="xl" class="love-card-hover" elevation="0" :style="{ backgroundColor: 'rgb(var(--v-theme-surface))' }">
      <v-card-text class="pa-8">
        <v-form ref="reminderForm" @submit.prevent="updateReminder">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="reminderData.title"
                label="Tiêu đề nhắc nhở"
                variant="outlined"
                rounded="lg"
                :rules="[v => !!v || 'Vui lòng nhập tiêu đề']"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="reminderData.description"
                label="Mô tả"
                variant="outlined"
                rounded="lg"
                rows="4"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12" md="6">              <v-text-field
                v-model="reminderData.reminderDate"
                label="Ngày nhắc nhở"
                type="date"
                variant="outlined"
                rounded="lg"
                :rules="[v => !!v || 'Vui lòng chọn ngày']"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="reminderData.time"
                label="Thời gian"
                type="time"
                variant="outlined"
                rounded="lg"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="reminderData.priority"
                :items="priorityOptions"
                label="Mức độ ưu tiên"
                variant="outlined"
                rounded="lg"
                item-title="label"
                item-value="value"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon :color="item.raw.color">{{ item.raw.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ item.raw.label }}</v-list-item-title>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12" md="6">              <v-select
                v-model="reminderData.repeat"
                :items="repeatOptions"
                label="Lặp lại"
                variant="outlined"
                rounded="lg"
                item-title="label"
                item-value="value"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12">
              <v-switch
                v-model="reminderData.isCompleted"
                label="Đã hoàn thành"
                color="success"
                hide-details
              />
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <div class="d-flex justify-space-between flex-wrap gap-3">
            <v-btn
              variant="outlined"
              rounded="lg"
              size="large"
              @click="goBack"
              :style="{ color: 'rgb(var(--v-theme-on-surface))' }"
            >
              <v-icon start>mdi-arrow-left</v-icon>
              Hủy bỏ
            </v-btn>
            
            <v-btn
              color="primary"
              variant="flat"
              rounded="lg"
              size="large"
              type="submit"
              :loading="loading"
            >
              <v-icon start>mdi-content-save</v-icon>
              Cập nhật nhắc nhở
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRemindersStore } from '@/stores/reminders'
import type { Reminder } from '@/types'

const route = useRoute()
const router = useRouter()
const remindersStore = useRemindersStore()

const reminderForm = ref()
const loading = ref(false)

const reminderData = ref({
  title: '',
  description: '',
  reminderDate: '',
  time: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  repeat: 'none' as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none',
  isCompleted: false
})

const priorityOptions = [
  { value: 'low', label: 'Thấp', icon: 'mdi-arrow-down', color: 'success' },
  { value: 'medium', label: 'Trung bình', icon: 'mdi-minus', color: 'warning' },
  { value: 'high', label: 'Cao', icon: 'mdi-arrow-up', color: 'error' }
]

const repeatOptions = [
  { value: 'none', label: 'Không lặp lại' },
  { value: 'daily', label: 'Hàng ngày' },
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'yearly', label: 'Hàng năm' }
]

const loadReminder = async () => {
  const reminderId = route.params.id as string
  const reminder = remindersStore.reminders.find(r => r.id === reminderId)
  
  if (reminder) {    reminderData.value = {
      title: reminder.title,
      description: reminder.description || '',
      reminderDate: typeof reminder.reminderDate === 'string' ? reminder.reminderDate.split('T')[0] : reminder.reminderDate.toISOString().split('T')[0],
      time: '', // Note: Reminder interface doesn't have separate time field
      priority: reminder.priority,
      repeat: reminder.repeat || 'none',
      isCompleted: reminder.isCompleted
    }
  } else {
    // Try to fetch from API if not in store
    await remindersStore.fetchReminders()
    const fetchedReminder = remindersStore.reminders.find(r => r.id === reminderId)
    if (fetchedReminder) {      reminderData.value = {
        title: fetchedReminder.title,
        description: fetchedReminder.description || '',
        reminderDate: typeof fetchedReminder.reminderDate === 'string' ? fetchedReminder.reminderDate.split('T')[0] : fetchedReminder.reminderDate.toISOString().split('T')[0],
        time: '', // Note: Reminder interface doesn't have separate time field
        priority: fetchedReminder.priority,
        repeat: fetchedReminder.repeat || 'none',
        isCompleted: fetchedReminder.isCompleted
      }
    } else {
      // Reminder not found, redirect to reminders list
      router.push('/reminders')
    }
  }
}

const updateReminder = async () => {
  const { valid } = await reminderForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const reminderId = route.params.id as string    // Combine date and time into a Date object for reminderDate
    const dateTimeString = reminderData.value.time 
      ? `${reminderData.value.reminderDate}T${reminderData.value.time}`
      : `${reminderData.value.reminderDate}T00:00`
    
    const updatedReminder = {
      id: reminderId,
      title: reminderData.value.title,
      description: reminderData.value.description,
      reminderDate: new Date(dateTimeString),
      priority: reminderData.value.priority,
      repeat: reminderData.value.repeat === 'none' ? undefined : reminderData.value.repeat as 'daily' | 'weekly' | 'monthly' | 'yearly',
      isCompleted: reminderData.value.isCompleted
    }

    await remindersStore.updateReminder(reminderId, updatedReminder)
    router.push('/reminders')
  } catch (error) {
    console.error('Failed to update reminder:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/reminders')
}

onMounted(() => {
  loadReminder()
})
</script>

<style scoped>
.love-card-hover {
  transition: all 0.3s ease;
  border: 1px solid rgb(var(--v-theme-outline-variant));
}

.love-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.15);
}
</style>
