<template>
  <div class="memory-list">
    <!-- List Header -->
    <div class="list-header mb-6">
      <div class="d-flex justify-space-between align-center">
        <div>
          <h2 class="font-heading text-h4 mb-2">
            <v-icon start color="primary" size="28">mdi-camera-burst</v-icon>
            {{ $t("memories.title") }}
          </h2>
          <p class="text-body-1 text-medium-emphasis">
            {{ $t("memories.subtitle") }}
          </p>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            prepend-icon="mdi-plus"
            @click="$emit('createMemory')"
          >
            {{ $t("memories.create") }}
          </v-btn>
        </div>
      </div>
    </div>
    <!-- Memory Content -->
    <div class="memory-content">
      <!-- Grid View (Only view available) -->
      <div class="memory-grid-view" v-if="memories.length > 0">
        <div class="memory-grid">
          <MemoryCard
            v-for="memory in memories"
            :key="memory.id"
            :memory="memory"
            :compact="false"
            :image-height="240"
            @click="openMemory"
            @toggle-favorite="toggleFavorite"
            @open-comments="openComments"
            @share-memory="shareMemory"
            @edit-memory="editMemory"
            @delete-memory="deleteMemory"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="memories.length === 0" class="empty-state">
        <div class="text-center py-12">
          <v-icon icon="mdi-camera-off" size="64" color="grey-lighten-2" class="mb-4" />
          <h4 class="text-h6 mb-2">{{ $t("memories.noMemories") }}</h4>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ $t("memories.noMemoriesDescription") }}
          </p>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore && memories.length > 0" class="load-more text-center mt-8">
        <v-btn
          color="primary"
          variant="outlined"
          size="large"
          :loading="loading"
          @click="$emit('loadMore')"
        >
          {{ $t("memories.gallery.loadMore") }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MemoryCard from "./MemoryCard.vue";
import type { Memory } from "@/types";

interface Props {
  memories: Memory[];
  loading?: boolean;
  hasMore?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  memories: () => [],
  loading: false,
  hasMore: false,
});

const emit = defineEmits<{
  openMemory: [memory: Memory];
  toggleFavorite: [memory: Memory];
  openComments: [memory: Memory];
  shareMemory: [memory: Memory];
  editMemory: [memory: Memory];
  deleteMemory: [memory: Memory];
  createMemory: [];
  loadMore: [];
}>();

const { t } = useI18n();

// Event handlers
const openMemory = (memory: Memory) => {
  emit("openMemory", memory);
};

const toggleFavorite = (memory: Memory) => {
  emit("toggleFavorite", memory);
};

const openComments = (memory: Memory) => {
  emit("openComments", memory);
};

const shareMemory = (memory: Memory) => {
  emit("shareMemory", memory);
};

const editMemory = (memory: Memory) => {
  emit("editMemory", memory);
};

const deleteMemory = (memory: Memory) => {
  emit("deleteMemory", memory);
};
</script>

<style scoped>
.memory-list {
  padding: 0;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.02) 0%,
    rgba(var(--v-theme-secondary-rgb, 255, 193, 7), 0.01) 50%,
    rgba(var(--v-theme-surface-rgb, 255, 255, 255), 0.03) 100%
  );
  border-radius: 20px;
  min-height: 100vh;
}

.list-header {
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.1);
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.view-info {
  display: flex;
  justify-content: center;
  padding: 0 24px;
}

/* Grid View Styles */
.memory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  min-height: 400px; /* Minimum height for each card area */
}

.memory-grid :deep(.memory-card) {
  min-height: 350px; /* Minimum height for each memory card */
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.memory-grid :deep(.memory-card:hover) {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.2);
  border-color: rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.3);
}

.memory-grid :deep(.memory-card .v-img) {
  min-height: 240px !important;
}

/* Empty State */
.empty-state {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 2px dashed rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.3);
  margin: 40px 0;
}

.load-more {
  padding: 20px 0;
}

/* Text utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 768px) {
  .memory-list {
    border-radius: 0;
    min-height: auto;
  }

  .list-header {
    margin: 0 0 24px 0;
    padding: 20px;
    border-radius: 0 0 20px 20px;
  }

  .list-header .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .quick-actions {
    width: 100%;
    justify-content: stretch;
  }

  .quick-actions .v-btn {
    flex: 1;
  }

  .memory-content {
    padding: 0 16px 16px;
  }

  .memory-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .memory-grid :deep(.memory-card) {
    min-height: 300px;
  }

  .view-info {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .memory-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .memory-grid :deep(.memory-card) {
    min-height: 280px;
  }

  .list-header {
    padding: 16px;
  }

  .memory-content {
    padding: 0 12px 12px;
  }
}

/* Dark theme adjustments */
.v-theme--dark .memory-list {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.03) 0%,
    rgba(var(--v-theme-secondary-rgb, 255, 193, 7), 0.02) 50%,
    rgba(var(--v-theme-surface-rgb, 18, 18, 18), 0.05) 100%
  );
}

.v-theme--dark .list-header {
  background: rgba(var(--v-theme-surface-rgb, 18, 18, 18), 0.8);
  border: 1px solid rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.2);
}

.v-theme--dark .memory-grid :deep(.memory-card) {
  background: rgba(var(--v-theme-surface-rgb, 18, 18, 18), 0.9);
  border: 1px solid rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .memory-grid :deep(.memory-card:hover) {
  box-shadow: 0 12px 40px rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.3);
  border-color: rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.4);
}

.v-theme--dark .empty-state {
  background: rgba(var(--v-theme-surface-rgb, 18, 18, 18), 0.8);
  border: 2px dashed rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.4);
}

/* Animation */
.memory-grid :deep(.memory-card) {
  animation: fadeInUp 0.6s ease-out;
}

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

/* Enhanced card appearance */
.memory-grid :deep(.memory-card) {
  position: relative;
  overflow: hidden;
}

.memory-grid :deep(.memory-card::before) {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(var(--v-theme-primary-rgb, 76, 175, 80), 0.6) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.memory-grid :deep(.memory-card:hover::before) {
  transform: translateX(100%);
}
</style>
