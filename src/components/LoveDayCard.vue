<template>
  <v-card 
    class="love-day-card"
    :color="getCardColor()"
    variant="tonal"
    rounded="xl"
    elevation="0"
  >
    <v-card-text class="pa-6">
      <!-- Type Icon and Date -->
      <div class="d-flex align-center justify-space-between mb-4">
        <v-avatar
          :color="getTypeColor()"
          size="48"
          class="love-day-avatar"
        >
          <v-icon color="white" size="24">{{ getTypeIcon() }}</v-icon>
        </v-avatar>
        
        <div class="text-right">
          <v-chip
            :color="getTypeColor()"
            variant="elevated"
            size="small"
            class="mb-1"
          >
            {{ getTypeLabel() }}
          </v-chip>
          <div class="text-body-2 text-medium-emphasis">
            {{ formatDate(loveDay.date) }}
          </div>
        </div>
      </div>

      <!-- Title and Description -->
      <h4 class="text-h6 font-weight-medium mb-2">
        {{ loveDay.title }}
      </h4>
      <p 
        v-if="loveDay.description" 
        class="text-body-2 text-medium-emphasis mb-4"
        style="line-height: 1.4;"
      >
        {{ loveDay.description }}
      </p>

      <!-- Days Until/Since -->
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="d-flex align-center">
          <v-icon 
            :color="daysUntil > 0 ? 'success' : 'info'" 
            size="16" 
            class="mr-1"
          >
            {{ daysUntil > 0 ? 'mdi-calendar-clock' : 'mdi-calendar-check' }}
          </v-icon>
          <span class="text-body-2">
            {{ getDaysText() }}
          </span>
        </div>
        
        <v-chip
          v-if="loveDay.isRecurring"
          color="primary"
          variant="outlined"
          size="x-small"
        >
          <v-icon start size="12">mdi-repeat</v-icon>
          Hàng năm
        </v-chip>
      </div>

      <!-- Reminder -->
      <div 
        v-if="loveDay.reminderDays" 
        class="d-flex align-center mb-4"
      >
        <v-icon color="warning" size="16" class="mr-1">mdi-bell</v-icon>
        <span class="text-body-2 text-medium-emphasis">
          Nhắc nhở {{ loveDay.reminderDays }} ngày trước
        </span>
      </div>

      <v-divider class="my-4"></v-divider>

      <!-- Actions -->
      <div class="d-flex justify-end">
        <v-btn
          variant="text"
          size="small"
          color="primary"
          @click="$emit('edit', loveDay)"
          class="mr-2"
        >
          <v-icon start size="16">mdi-pencil</v-icon>
          Sửa
        </v-btn>
        <v-btn
          variant="text"
          size="small"
          color="error"
          @click="$emit('delete', loveDay.id)"
        >
          <v-icon start size="16">mdi-delete</v-icon>
          Xóa
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { LoveDay } from '@/services/couples'

interface Props {
  loveDay: LoveDay
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [loveDay: LoveDay]
  delete: [loveDayId: string]
}>()

const daysUntil = computed(() => {
  const today = dayjs()
  const loveDate = dayjs(props.loveDay.date)
  
  if (props.loveDay.isRecurring) {
    // For recurring events, calculate days until next occurrence
    const thisYear = today.year()
    let nextOccurrence = loveDate.year(thisYear)
    
    if (nextOccurrence.isBefore(today)) {
      nextOccurrence = nextOccurrence.add(1, 'year')
    }
    
    return nextOccurrence.diff(today, 'day')
  }
  
  return loveDate.diff(today, 'day')
})

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const getTypeIcon = () => {
  const icons = {
    anniversary: 'mdi-heart',
    first_date: 'mdi-calendar-heart',
    proposal: 'mdi-ring',
    wedding: 'mdi-church',
    milestone: 'mdi-trophy',
    other: 'mdi-star'
  }
  return icons[props.loveDay.type] || icons.other
}

const getTypeColor = () => {
  const colors = {
    anniversary: 'pink',
    first_date: 'purple',
    proposal: 'orange',
    wedding: 'red',
    milestone: 'green',
    other: 'blue'
  }
  return colors[props.loveDay.type] || colors.other
}

const getCardColor = () => {
  return getTypeColor()
}

const getTypeLabel = () => {
  const labels = {
    anniversary: 'Kỷ niệm',
    first_date: 'Hẹn hò đầu tiên',
    proposal: 'Cầu hôn',
    wedding: 'Cưới',
    milestone: 'Mốc quan trọng',
    other: 'Khác'
  }
  return labels[props.loveDay.type] || labels.other
}

const getDaysText = () => {
  if (daysUntil.value > 0) {
    return `Còn ${daysUntil.value} ngày`
  } else if (daysUntil.value === 0) {
    return 'Hôm nay!'
  } else {
    return `${Math.abs(daysUntil.value)} ngày trước`
  }
}
</script>

<style scoped lang="scss">
.love-day-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  border: 1px solid rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
}

.love-day-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.v-btn {
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 600px) {
  .love-day-card:hover {
    transform: translateY(-1px);
  }
  
  .v-btn:hover {
    transform: none;
  }
}
</style> 