<template>
  <div class="timeline-container">
    <!-- Timeline Filters -->
    <div class="timeline-filters">
      <div class="filter-tabs">
        <button
          v-for="filter in filterOptions"
          :key="filter.value"
          :class="['filter-tab', { active: queryParams.type === filter.value }]"
          @click="setFilter(filter.value)"
        >
          <span class="filter-icon">{{ filter.icon }}</span>
          <span>{{ $t(filter.label) }}</span>
          <span v-if="filter.count !== undefined" class="filter-count">{{
            filter.count
          }}</span>
        </button>
      </div>

      <div class="sort-controls">
        <button
          :class="['sort-btn', { active: queryParams.sortOrder === 'desc' }]"
          @click="setSortOrder('desc')"
          :title="$t('timeline.sortDesc')"
        >
          <SortDescIcon />
        </button>
        <button
          :class="['sort-btn', { active: queryParams.sortOrder === 'asc' }]"
          @click="setSortOrder('asc')"
          :title="$t('timeline.sortAsc')"
        >
          <SortAscIcon />
        </button>
      </div>
    </div>

    <!-- Timeline Items -->
    <div v-if="isLoading" class="timeline-loading">
      <LoadingSpinner />
      <p>{{ $t("common.loading") }}</p>
    </div>

    <div v-else-if="!hasItems" class="timeline-empty">
      <div class="empty-icon">📅</div>
      <h3>{{ $t("timeline.empty.title") }}</h3>
      <p>{{ $t("timeline.empty.description") }}</p>
      <div class="empty-actions">
        <Button @click="$router.push('/memories')" variant="primary">
          {{ $t("timeline.empty.createMemory") }}
        </Button>
        <Button @click="$router.push('/reminders')" variant="outline">
          {{ $t("timeline.empty.createReminder") }}
        </Button>
        <Button @click="$router.push('/blog')" variant="outline">
          {{ $t("timeline.empty.createBlog") }}
        </Button>
      </div>
    </div>

    <div v-else class="timeline-list">
      <div
        v-for="item in items"
        :key="`${item.type}-${item.id}`"
        class="timeline-item"
        :data-type="item.type"
      >
        <div class="timeline-marker">
          <div :class="['timeline-dot', `timeline-${item.type}`]">
            <span class="timeline-icon">{{ getTypeIcon(item.type) }}</span>
          </div>
        </div>

        <div class="timeline-content">
          <div class="timeline-card">
            <div class="timeline-header">
              <div class="timeline-title">
                <h4>{{ item.title }}</h4>
                <span :class="['timeline-type', getTypeColor(item.type)]">
                  {{ $t(`timeline.types.${item.type}`) }}
                </span>
              </div>
              <div class="timeline-date">
                {{ formatDate(item.date, "relative") }}
              </div>
            </div>

            <div v-if="item.description" class="timeline-description">
              {{ truncateText(item.description, 150) }}
            </div>

            <div v-if="item.imageUrl" class="timeline-image">
              <img
                :src="item.imageUrl"
                :alt="item.title"
                @click="showImagePreview(item.imageUrl)"
                loading="lazy"
              />
            </div>

            <!-- Author info for blog posts -->
            <div v-if="item.author && item.type === 'blog'" class="timeline-author">
              <img
                v-if="item.author.avatarUrl"
                :src="item.author.avatarUrl"
                :alt="item.author.displayName"
                class="author-avatar"
              />
              <span class="author-name">{{ item.author.displayName }}</span>
            </div>

            <!-- Blog specific info -->
            <div v-if="item.type === 'blog'" class="blog-meta">
              <div class="blog-engagement">
                <span v-if="item.likes" class="engagement-item">
                  ❤️ {{ item.likes }}
                </span>
                <span v-if="item.comments" class="engagement-item">
                  💬 {{ item.comments }}
                </span>
              </div>
              <div v-if="item.tags && item.tags.length > 0" class="blog-tags">
                <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">
                  #{{ tag }}
                </span>
              </div>
            </div>

            <div class="timeline-meta">
              <div class="timeline-status">
                <!-- Memory Status -->
                <div
                  v-if="item.type === 'memory'"
                  class="status-memory flex items-center gap-1"
                >
                  <div class="status-dot status-memory-dot"></div>
                  <div>{{ $t("timeline.types.memory") }}</div>
                </div>

                <!-- Reminder Status -->
                <div
                  v-else-if="item.type === 'reminder'"
                  class="status-reminder flex items-center gap-1"
                >
                  <div
                    :class="[
                      'status-dot',
                      item.isCompleted ? 'status-completed' : 'status-pending',
                    ]"
                  ></div>
                  <div>
                    {{
                      item.isCompleted
                        ? $t("reminders.status.completed")
                        : $t("reminders.status.pending")
                    }}
                  </div>
                </div>

                <!-- Blog Status -->
                <div
                  v-else-if="item.type === 'blog'"
                  class="status-blog flex items-center gap-1"
                >
                  <div class="status-dot status-blog-dot"></div>
                  <div>{{ $t("timeline.types.blog") }}</div>
                </div>

                <!-- Anniversary Status -->
                <div
                  v-else-if="item.type === 'anniversary'"
                  class="status-anniversary flex items-center gap-1"
                >
                  <div class="status-dot status-anniversary-dot"></div>
                  <div>{{ $t("timeline.types.anniversary") }}</div>
                </div>
              </div>

              <div class="timeline-actions">
                <button
                  @click="viewItem(item)"
                  class="action-btn"
                  :title="$t('timeline.actions.view')"
                >
                  <ViewIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="canLoadMore" class="load-more-container">
        <Button
          @click="loadMore"
          :loading="isLoadingMore"
          variant="outline"
          class="load-more-btn"
        >
          {{ $t("timeline.loadMore") }}
        </Button>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <ImagePreview
      v-if="previewImage"
      :imageUrl="previewImage"
      @close="previewImage = null"
    />

    <!-- Timeline Detail Modal -->
    <TimelineDetailModal
      v-if="selectedItem"
      :item="selectedItem"
      @close="selectedItem = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useTimeline } from "@/composables/useTimeline";
import { formatDate, truncateText } from "@/utils/helpers";
import type { TimelineItem } from "@/types";

// Components
import Button from "@/components/common/Button.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import ImagePreview from "@/components/common/ImagePreview.vue";
import TimelineDetailModal from "@/components/timeline/TimelineDetailModal.vue";

// Icons
import SortDescIcon from "@/components/icons/SortDescIcon.vue";
import SortAscIcon from "@/components/icons/SortAscIcon.vue";
import ViewIcon from "@/components/icons/ViewIcon.vue";

const { t } = useI18n();
const router = useRouter();

// Timeline composable
const {
  items,
  stats,
  isLoading,
  isLoadingMore,
  queryParams,
  filterOptions,
  hasItems,
  canLoadMore,
  fetchTimeline,
  fetchTimelineStats,
  setFilter,
  setSortOrder,
  loadMore,
  getTypeIcon,
  getTypeColor,
} = useTimeline();

// State
const previewImage = ref<string | null>(null);
const selectedItem = ref<TimelineItem | null>(null);

// Methods
const showImagePreview = (imageUrl: string) => {
  previewImage.value = imageUrl;
};

const viewItem = (item: TimelineItem) => {
  selectedItem.value = item;
};

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchTimeline(), fetchTimelineStats()]);
});
</script>

<style scoped>
.timeline-container {
  margin: 0 auto;
  padding: 20px;
}

/* Timeline Stats */
.timeline-stats {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.stat-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.stat-content h3 {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.stat-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 4px 0 0 0;
}

/* Timeline Filters */
.timeline-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  position: relative;
}

.filter-tab:hover {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.05);
}

.filter-tab.active {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
}

.filter-icon {
  font-size: 16px;
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  min-width: 18px;
  text-align: center;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.sort-controls {
  display: flex;
  gap: 4px;
}

.sort-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.05);
}

.sort-btn.active {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
}

.sort-btn svg {
  width: 16px;
  height: 16px;
}

/* Timeline Loading and Empty States */
.timeline-loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.timeline-empty {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
}

/* Timeline List */
.timeline-list {
  position: relative;
}

.timeline-list::before {
  content: "";
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item {
  position: relative;
  padding-left: 64px;
  margin-bottom: 32px;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 0;
}

.timeline-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 3px solid;
  position: relative;
  z-index: 2;
}

.timeline-memory {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
}

.timeline-reminder {
  border-color: #ff9800;
  background: #ff9800;
  color: white;
}

.timeline-blog {
  border-color: #2196f3;
  background: #2196f3;
  color: white;
}

.timeline-anniversary {
  border-color: #e91e63;
  background: #e91e63;
  color: white;
}

.timeline-icon {
  font-size: 18px;
}

/* Timeline Card */
.timeline-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.2s ease;
}

.timeline-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.timeline-title h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.timeline-type {
  display: inline-block;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.timeline-date {
  color: #999;
  font-size: 14px;
  white-space: nowrap;
}

.timeline-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
}

.timeline-image {
  margin-bottom: 12px;
}

.timeline-image img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.timeline-image img:hover {
  transform: scale(1.02);
}

/* Author Info */
.timeline-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
  color: #333;
}

/* Blog Meta */
.blog-meta {
  margin-bottom: 12px;
}

.blog-engagement {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.engagement-item {
  font-size: 14px;
  color: #666;
}

.blog-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* Timeline Meta */
.timeline-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-memory-dot {
  background: #4caf50;
}

.status-completed {
  background: #4caf50;
}

.status-pending {
  background: #ff9800;
}

.status-blog-dot {
  background: #2196f3;
}

.status-anniversary-dot {
  background: #e91e63;
}

.timeline-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* Load More */
.load-more-container {
  text-align: center;
  margin-top: 32px;
}

.load-more-btn {
  padding: 12px 24px;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .timeline-container {
    padding: 16px;
  }

  .timeline-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-tabs {
    justify-content: stretch;
  }

  .filter-tab {
    flex: 1;
    justify-content: center;
    font-size: 12px;
    padding: 6px 12px;
  }

  .timeline-list::before {
    left: 16px;
  }

  .timeline-item {
    padding-left: 52px;
  }

  .timeline-dot {
    width: 32px;
    height: 32px;
  }

  .timeline-icon {
    font-size: 14px;
  }

  .timeline-header {
    flex-direction: column;
    gap: 8px;
  }

  .timeline-title h4 {
    font-size: 16px;
  }

  .empty-actions {
    flex-direction: column;
  }

  .blog-engagement {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
