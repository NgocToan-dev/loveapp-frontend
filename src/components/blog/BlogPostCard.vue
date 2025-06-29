<template>
  <article
    class="blog-post-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
  >
    <!-- Cover Image -->
    <div v-if="post.coverImageUrl" class="relative overflow-hidden">
      <img
        :src="post.coverImageUrl"
        :alt="post.title"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        @click="$emit('click')"
      />

      <!-- Reading Time Badge -->
      <div
        class="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs"
      >
        {{ post.readingTime || estimatedReadingTime }} {{ $t("blog.readingTime") }}
      </div>

      <!-- Status Badge -->
      <div
        v-if="post.status === 'draft'"
        class="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        {{ $t("blog.draft") }}
      </div>

      <!-- Privacy Badge -->
      <div
        class="absolute bottom-4 left-4 text-white px-3 py-1 rounded-full text-xs font-medium"
        :class="privacyBadgeClass"
      >
        {{ privacyLabel }}
      </div>
    </div>

    <!-- No Image Placeholder -->
    <div
      v-else
      class="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="text-4xl mb-2">📝</div>
        <span class="text-primary-600 font-medium">{{ $t("blog.noImage") }}</span>
      </div>

      <!-- Status Badge for no-image posts -->
      <div
        v-if="post.status === 'draft'"
        class="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        {{ $t("blog.draft") }}
      </div>

      <!-- Privacy Badge for no-image posts -->
      <div
        class="absolute bottom-4 left-4 text-white px-3 py-1 rounded-full text-xs font-medium"
        :class="privacyBadgeClass"
      >
        {{ privacyLabel }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Title -->
      <h3
        class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer"
        @click="$emit('click')"
      >
        {{ post.title }}
      </h3>

      <!-- Excerpt -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>

      <!-- Tags -->
      <div v-if="post.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full font-medium"
        >
          #{{ tag }}
        </span>
        <span v-if="post.tags.length > 3" class="text-xs text-gray-400">
          +{{ post.tags.length - 3 }}
        </span>
      </div>

      <!-- Author & Date -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <img
            :src="post.author.avatarUrl || '/default-avatar.png'"
            :alt="post.author.displayName"
            class="w-8 h-8 rounded-full object-cover"
          />
          <span class="text-sm text-gray-700 font-medium">{{
            post.author.displayName
          }}</span>
        </div>
        <time class="text-xs text-gray-500">
          {{ formatDate(post.createdAt) }}
        </time>
      </div>

      <!-- Stats & Actions -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <!-- Stats -->
        <div class="flex items-center space-x-4">
          <button
            @click.stop="$emit('like')"
            class="flex items-center space-x-1 text-sm transition-colors"
            :class="post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'"
          >
            <svg
              class="w-4 h-4"
              :fill="post.isLiked ? 'currentColor' : 'none'"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{{ post.likesCount }}</span>
          </button>

          <div class="flex items-center space-x-1 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>{{ post.views }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-2">
          <button
            @click.stop="$emit('edit')"
            class="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
            :title="$t('common.edit')"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            @click.stop="$emit('delete')"
            class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            :title="$t('common.delete')"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { BlogPost } from "@/types";

interface Props {
  post: BlogPost;
}

const props = defineProps<Props>();


const { t } = useI18n();

const estimatedReadingTime = computed(() => {
  const wordsPerMinute = 200;
  const wordCount = props.post.content.split(" ").length;
  return Math.ceil(wordCount / wordsPerMinute);
});

const privacyLabel = computed(() => {
  switch (props.post.privacy) {
    case "public":
      return t("blog.privacy.public");
    case "couple":
      return t("blog.privacy.couple");
    case "private":
      return t("blog.privacy.private");
    default:
      return "";
  }
});

const privacyBadgeClass = computed(() => {
  switch (props.post.privacy) {
    case "public":
      return "bg-green-500";
    case "couple":
      return "bg-blue-500";
    case "private":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-post-card {
  transition: all 0.3s ease;
}

.blog-post-card:hover {
  transform: translateY(-2px);
}
</style>
