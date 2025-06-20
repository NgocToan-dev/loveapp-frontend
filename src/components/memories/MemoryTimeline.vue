<template>
  <div class="memory-timeline">
    <div class="timeline-container">
      <!-- Timeline Header -->
      <div class="timeline-header">
        <h3 class="font-heading text-h5 mb-2">
          <v-icon start color="primary" size="24">mdi-timeline-heart</v-icon>
          Dòng thời gian tình yêu
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Những khoảnh khắc đáng nhớ trong hành trình của chúng ta
        </p>
      </div>

      <!-- Timeline Items -->
      <div class="timeline-track">
        <div 
          v-for="(memory, index) in memories" 
          :key="memory.id"
          class="timeline-item"
          :class="{ 'timeline-item--left': index % 2 === 0, 'timeline-item--right': index % 2 === 1 }"
        >
          <!-- Timeline Node -->
          <div class="timeline-node">
            <div class="timeline-node-inner">              <v-icon :color="getMemoryColor(memory.category)" size="16">
                {{ getMemoryIcon(memory.category) }}
              </v-icon>
            </div>
          </div>

          <!-- Memory Card -->
          <v-card 
            class="memory-card"
            elevation="3"
            rounded="xl"
            @click="$emit('openMemory', memory)"
          >            <!-- Memory Image -->
            <div v-if="getMemoryImage(memory)" class="memory-image-container">
              <v-img
                :src="getMemoryImage(memory)"
                height="200"
                cover
                class="memory-image"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="primary"
                      indeterminate
                      size="24"
                    ></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </div>

            <v-card-text class="pa-4">
              <!-- Memory Title -->
              <h4 class="memory-title text-h6 font-weight-bold mb-2">
                {{ memory.title }}
              </h4>

              <!-- Memory Date -->
              <div class="memory-date d-flex align-center mb-3">
                <v-icon size="16" color="text-medium-emphasis" class="me-2">
                  mdi-calendar
                </v-icon>
                <span class="text-body-2 text-medium-emphasis">
                  {{ formatDate(memory.date) }}
                </span>
              </div>

              <!-- Memory Description -->
              <p class="memory-description text-body-2 mb-3" v-if="memory.description">
                {{ truncateText(memory.description, 120) }}
              </p>

              <!-- Memory Tags -->
              <div v-if="memory.tags && memory.tags.length > 0" class="memory-tags mb-3">
                <v-chip
                  v-for="tag in memory.tags.slice(0, 3)"
                  :key="tag"
                  size="small"
                  color="primary"
                  variant="tonal"
                  class="me-1 mb-1"
                >
                  {{ tag }}
                </v-chip>
                <v-chip
                  v-if="memory.tags.length > 3"
                  size="small"
                  variant="outlined"
                  class="me-1 mb-1"
                >
                  +{{ memory.tags.length - 3 }}
                </v-chip>
              </div>

              <!-- Memory Actions -->
              <div class="memory-actions d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <v-btn
                    size="small"
                    variant="text"
                    color="pink"
                    @click.stop="toggleLike(memory)"
                  >
                    <v-icon start size="16">                      {{ memory.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
                    </v-icon>
                    0
                  </v-btn>
                </div>
                
                <v-btn
                  size="small"
                  variant="outlined"
                  color="primary"
                  @click.stop="$emit('openMemory', memory)"
                >
                  Xem chi tiết
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Timeline Date Badge -->
          <div class="timeline-date-badge">
            <span class="text-caption font-weight-bold">
              {{ formatMonthYear(memory.date) }}
            </span>
          </div>
        </div>

        <!-- Timeline End -->
        <div class="timeline-end">
          <div class="timeline-node timeline-node--end">
            <div class="timeline-node-inner">
              <v-icon color="pink" size="20">mdi-infinity</v-icon>
            </div>
          </div>
          <div class="timeline-end-text">
            <p class="text-body-2 text-medium-emphasis text-center">
              Câu chuyện của chúng ta vẫn tiếp tục...
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

import type { Memory } from '@/types'

interface Props {
  memories: Memory[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  memories: () => [],
  loading: false
})

const emit = defineEmits<{
  openMemory: [memory: Memory]
  toggleLike: [memory: Memory]
}>()

const getMemoryColor = (type: string) => {
  const colors: Record<string, string> = {
    'first-meet': 'pink',
    'date': 'purple', 
    'travel': 'indigo',
    'milestone': 'success',
    'celebration': 'orange',
    'general': 'primary'
  }
  return colors[type] || 'primary'
}

const getMemoryIcon = (type: string) => {
  const icons: Record<string, string> = {
    'first-meet': 'mdi-heart-flash',
    'date': 'mdi-heart',
    'travel': 'mdi-airplane-takeoff', 
    'milestone': 'mdi-trophy',
    'celebration': 'mdi-party-popper',
    'general': 'mdi-camera'
  }
  return icons[type] || 'mdi-camera'
}

const getMemoryImage = (memory: Memory) => {
  const imageFile = memory.files?.find(file => 
    file.type?.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '')
  )
  return imageFile?.url
}

const formatDate = (date: Date | string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const formatMonthYear = (date: Date | string) => {
  return dayjs(date).format('MM/YYYY')
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

const toggleLike = (memory: Memory) => {
  emit('toggleLike', memory)
}
</script>

<style scoped>
.memory-timeline {
  position: relative;
  padding: 24px 0;
}

.timeline-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

.timeline-header {
  text-align: center;
  margin-bottom: 48px;
}

.timeline-track {
  position: relative;
  padding: 0 20px;
}

/* Main Timeline Line - "Sợi chỉ đỏ" */
.timeline-track::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(
    to bottom,
    rgba(233, 30, 99, 0.8),
    rgba(233, 30, 99, 0.6),
    rgba(233, 30, 99, 0.4)
  );
  border-radius: 2px;
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(233, 30, 99, 0.3);
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.6s ease-out;
}

.timeline-item--left {
  flex-direction: row;
}

.timeline-item--right {
  flex-direction: row-reverse;
}

/* Timeline Node */
.timeline-node {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  background: white;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.timeline-node-inner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(233, 30, 99, 0.1), rgba(233, 30, 99, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(233, 30, 99, 0.3);
  transition: all 0.3s ease;
}

.timeline-node:hover .timeline-node-inner {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(233, 30, 99, 0.4);
}

/* Memory Card */
.memory-card {
  width: 45%;
  margin: 0 5%;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.memory-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.memory-image-container {
  position: relative;
  overflow: hidden;
}

.memory-image {
  transition: transform 0.3s ease;
}

.memory-card:hover .memory-image {
  transform: scale(1.05);
}

.memory-title {
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.4;
}

.memory-description {
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.5;
}

.memory-date {
  color: rgb(var(--v-theme-on-surface-variant));
}

.memory-tags .v-chip {
  font-size: 0.75rem;
}

.memory-actions {
  margin-top: 12px;
}

/* Timeline Date Badge */
.timeline-date-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(233, 30, 99, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(233, 30, 99, 0.2);
  z-index: 2;
}

/* Timeline End */
.timeline-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

.timeline-node--end {
  position: static;
  transform: none;
  margin-bottom: 20px;
}

.timeline-node--end .timeline-node-inner {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(233, 30, 99, 0.2), rgba(233, 30, 99, 0.1));
}

.timeline-end-text {
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .timeline-track::before {
    left: 30px;
  }
  
  .timeline-item {
    flex-direction: row !important;
    margin-left: 60px;
  }
  
  .timeline-node {
    left: 30px;
  }
  
  .memory-card {
    width: calc(100% - 20px);
    margin: 0;
  }
  
  .timeline-date-badge {
    left: 30px;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark theme adjustments */
.v-theme--dark .memory-card {
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .timeline-node {
  background: rgb(var(--v-theme-surface));
}

.v-theme--dark .timeline-date-badge {
  background: rgba(233, 30, 99, 0.2);
  border: 1px solid rgba(233, 30, 99, 0.3);
}
</style>
