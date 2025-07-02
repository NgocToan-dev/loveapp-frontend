<template>
  <AppLayout>
    <div class="blog-detail-page">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb mb-6">
        <RouterLink to="/blog" class="breadcrumb-link text-blue-600 hover:text-blue-800">
          {{ $t("blog.title") }}
        </RouterLink>
        <ChevronRightIcon class="w-4 h-4 text-gray-400 mx-2" />
        <span class="breadcrumb-current text-gray-900">
          {{ currentPost?.title || $t("blog.detail.title") }}
        </span>
      </nav>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="loading-container flex flex-col items-center justify-center py-12"
      >
        <LoadingSpinner size="lg" />
        <p class="mt-4 text-gray-600">{{ $t("common.loading") }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div
          class="error-content bg-red-50 border border-red-200 rounded-lg p-6 text-center"
        >
          <div class="error-icon text-4xl mb-4">❌</div>
          <h2 class="text-xl font-semibold text-red-800 mb-2">
            {{ $t("common.error.title") }}
          </h2>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <div class="error-actions space-x-3">
            <Button @click="handleRetry" variant="primary">
              {{ $t("common.actions.retry") }}
            </Button>
            <Button @click="$router.go(-1)" variant="outline">
              {{ $t("common.actions.go_back") }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!currentPost" class="not-found-container">
        <div
          class="not-found-content bg-gray-50 border border-gray-200 rounded-lg p-6 text-center"
        >
          <div class="not-found-icon text-4xl mb-4">🔍</div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            {{ $t("blog.detail.not_found") }}
          </h2>
          <p class="text-gray-600 mb-4">{{ $t("blog.detail.not_found_message") }}</p>
          <Button @click="$router.push('/blog')" variant="primary">
            {{ $t("blog.detail.back_to_list") }}
          </Button>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="content max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="page-header flex justify-between items-start mb-8">
          <div class="header-content flex items-center space-x-4">
            <Button @click="$router.go(-1)" variant="ghost" size="sm" class="back-button">
              <ArrowLeftIcon class="w-4 h-4 mr-2" />
              {{ $t("common.actions.back") }}
            </Button>

            <div class="header-badges flex space-x-2">
              <Badge v-if="currentPost.status === 'published'" variant="success">
                {{ $t("blog.status.published") }}
              </Badge>
              <Badge v-else variant="warning">
                {{ $t("blog.status.draft") }}
              </Badge>
            </div>
          </div>

          <div class="header-actions">
            <CrudActions
              :can-edit="canEdit"
              :can-delete="canDelete"
              :can-share="canShare && currentPost.status === 'published'"
              :is-loading="isUpdating"
              @edit="handleEdit"
              @delete="handleDelete"
              @share="handleShare"
            />
          </div>
        </div>

        <!-- Blog Post Content -->
        <article class="blog-post-content bg-white rounded-lg shadow-sm border p-8">
          <!-- Cover Image -->
          <div v-if="currentPost.coverImageUrl" class="cover-image mb-8">
            <img
              :src="currentPost.coverImageUrl"
              :alt="currentPost.title"
              class="w-full h-64 md:h-80 object-cover rounded-lg shadow-sm cursor-pointer"
              @click="openImageViewer"
            />
          </div>

          <!-- Title -->
          <header class="post-header mb-8">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {{ currentPost.title }}
            </h1>

            <!-- Excerpt -->
            <div
              v-if="currentPost.excerpt"
              class="excerpt text-xl text-gray-600 mb-6 leading-relaxed"
            >
              {{ currentPost.excerpt }}
            </div>

            <!-- Metadata -->
            <div
              class="metadata flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6"
            >
              <div class="flex items-center">
                <UserIcon class="w-4 h-4 mr-1" />
                {{
                  currentPost.author?.displayName ||
                  currentPost.author?.id ||
                  $t("blog.author.unknown")
                }}
              </div>
              <div class="flex items-center">
                <CalendarIcon class="w-4 h-4 mr-1" />
                {{ formatDate(currentPost.publishedAt || currentPost.createdAt) }}
              </div>
              <div class="flex items-center">
                <ClockIcon class="w-4 h-4 mr-1" />
                {{ estimatedReadTime }} {{ $t("blog.minute_read") }}
              </div>
              <div
                v-if="
                  currentPost.updatedAt && currentPost.updatedAt !== currentPost.createdAt
                "
                class="flex items-center"
              >
                <PencilIcon class="w-4 h-4 mr-1" />
                {{ $t("blog.updated") }}: {{ formatDate(currentPost.updatedAt) }}
              </div>
            </div>
          </header>

          <!-- Content -->
          <div class="post-content">
            <div v-if="currentPost.contentHtml" class="prose prose-lg max-w-none">
              <div v-html="currentPost.contentHtml"></div>
            </div>
            <div
              v-else-if="currentPost.content"
              class="prose prose-lg max-w-none whitespace-pre-wrap"
            >
              {{ currentPost.content }}
            </div>
            <div v-else class="text-gray-500 italic">
              {{ $t("blog.no_content") }}
            </div>
          </div>

          <!-- Tags -->
          <div
            v-if="currentPost.tags && currentPost.tags.length > 0"
            class="tags-section mt-8 pt-6 border-t border-gray-200"
          >
            <h3 class="text-sm font-medium text-gray-700 mb-3">{{ $t("blog.tags") }}</h3>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="tag in currentPost.tags"
                :key="tag"
                :label="`#${tag}`"
                variant="secondary"
                size="sm"
              />
            </div>
          </div>

          <!-- Social Share -->
          <div
            v-if="currentPost.status === 'published'"
            class="social-share mt-8 pt-6 border-t border-gray-200"
          >
            <h3 class="text-sm font-medium text-gray-700 mb-3">
              {{ $t("blog.share.title") }}
            </h3>
            <div class="flex space-x-3">
              <Button @click="shareToFacebook" variant="outline" size="sm">
                <span class="mr-2">📘</span> {{ $t("common.social.facebook") }}
              </Button>
              <Button @click="shareToTwitter" variant="outline" size="sm">
                <span class="mr-2">🐦</span> {{ $t("common.social.twitter") }}
              </Button>
              <Button @click="copyLink" variant="outline" size="sm">
                <LinkIcon class="w-4 h-4 mr-2" />
                {{ $t("common.share.copy_link") }}
              </Button>
            </div>
          </div>
        </article>

        <!-- Related Posts -->
        <div v-if="relatedPosts.length > 0" class="related-section mt-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ $t("blog.detail.related_posts") }}
          </h2>
          <div class="related-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogPostCard
              v-for="relatedPost in relatedPosts"
              :key="relatedPost.id"
              :post="relatedPost"
              @edit="handleEditRelated"
              @delete="handleDeleteRelated"
            />
          </div>
        </div>

        <!-- Comments Section (if needed) -->
        <div v-if="currentPost.status === 'published'" class="comments-section mt-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t("blog.comments") }}</h2>
          <div
            class="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500"
          >
            {{ $t("blog.comments_coming_soon") }}
          </div>
        </div>
      </div>

      <!-- Image Viewer Modal -->
      <Modal
        v-model="showImageViewer"
        :title="currentPost?.title || ''"
        size="lg"
        :close-on-backdrop="true"
      >
        <div v-if="currentPost?.coverImageUrl" class="image-viewer">
          <img
            :src="currentPost.coverImageUrl"
            :alt="currentPost.title"
            class="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>
      </Modal>

      <!-- Share Modal -->
      <Modal v-model="showShareModal" :title="$t('blog.share.title')">
        <div class="share-content">
          <p class="mb-4">{{ $t("blog.share.description") }}</p>

          <div class="share-options flex space-x-3 mb-4">
            <Button @click="handleCopyLink" variant="outline" class="share-button">
              <LinkIcon class="w-4 h-4 mr-2" />
              {{ $t("common.share.copy_link") }}
            </Button>

            <Button @click="handleShareText" variant="outline" class="share-button">
              <ShareIcon class="w-4 h-4 mr-2" />
              {{ $t("common.share.share_text") }}
            </Button>
          </div>

          <div class="share-text">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t("common.share.share_text_label") }}
            </label>
            <textarea
              v-model="shareText"
              readonly
              class="w-full p-3 border border-gray-300 rounded-md"
              rows="4"
              @click="($event.target as HTMLTextAreaElement).select()"
            />
          </div>
        </div>
      </Modal>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useBlog } from "@/composables/useBlog.ts";
import { useCouple } from "@/composables/useCouple";
import { useNotifications } from "@/composables/useNotifications";
import { formatDate } from "@/utils/helpers";
import type { BlogPostEntity } from "@/types/model/blog/BlogPostEntity";

import AppLayout from "@/components/layout/AppLayout.vue";
import BlogPostCard from "@/components/blog/BlogPostCard.vue";
import CrudActions from "@/components/common/CrudActions.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import Button from "@/components/common/Button.vue";
import Badge from "@/components/common/Badge.vue";
import Modal from "@/components/common/Modal.vue";

// Icons
import {
  ChevronRightIcon,
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  PencilIcon,
  LinkIcon,
  ShareIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { isConnected } = useCouple();
const { showSuccess, showError } = useNotifications();

const {
  posts,
  selectedPost,
  isLoading,
  error,
  fetchPost,
  deletePost,
  clearError,
} = useBlog();

// State
const isUpdating = ref(false);
const showShareModal = ref(false);
const showImageViewer = ref(false);
const shareText = ref("");

// Computed
const postId = computed(() => route.params.id as string);
const currentPost = selectedPost;

const canEdit = computed(() => {
  return !!isConnected && !!currentPost.value;
});

const canDelete = computed(() => {
  return !!isConnected && !!currentPost.value;
});

const canShare = computed(() => {
  return !!currentPost.value;
});

const estimatedReadTime = computed(() => {
  if (!currentPost.value?.content && !currentPost.value?.contentHtml) return 5;

  const content = currentPost.value.contentHtml || currentPost.value.content || "";
  const plainText = content.replace(/<[^>]*>/g, ""); // Strip HTML tags
  const wordsPerMinute = 200;
  const wordCount = plainText.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  return readTime > 0 ? readTime : 1;
});

const relatedPosts = computed(() => {
  if (!currentPost.value || !posts.value) return [];

  return posts.value
    .filter(
      (p: BlogPostEntity) =>
        p.id !== currentPost.value?.id &&
        p.status === "published" &&
        p.tags?.some((tag) => currentPost.value?.tags?.includes(tag))
    )
    .slice(0, 3);
});

// Methods
const handleRetry = async () => {
  clearError();
  await fetchPost(postId.value);
};

const handleEdit = () => {
  if (!currentPost.value) return;
  router.push(`/blog/${currentPost.value.id}/edit`);
};

const handleDelete = async () => {
  if (!currentPost.value) return;

  try {
    await deletePost(currentPost.value.id);
    showSuccess(t("blog.success.deleted"));
    router.push("/blog");
  } catch (error) {
    showError(t("blog.errors.delete_failed"));
  }
};

const handleShare = () => {
  if (!currentPost.value) return;

  shareText.value = `${currentPost.value.title}\n${currentPost.value.excerpt || ""}\n\n${
    window.location.href
  }`;
  showShareModal.value = true;
};

// Related posts handlers
const handleEditRelated = (relatedPost: BlogPostEntity) => {
  router.push(`/blog/${relatedPost.id}/edit`);
};

const handleDeleteRelated = async (id: string) => {
  try {
    await deletePost(id);
    showSuccess(t("blog.success.deleted"));
  } catch (error) {
    showError(t("blog.errors.delete_failed"));
  }
};

// Image viewer handlers
const openImageViewer = () => {
  showImageViewer.value = true;
};

// Social share handlers
const shareToFacebook = () => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(currentPost.value?.title || "");
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    "_blank"
  );
};

const shareToTwitter = () => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    `${currentPost.value?.title} - ${currentPost.value?.excerpt || ""}`
  );
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showSuccess(t("common.share.link_copied"));
  } catch (error) {
    showError(t("common.share.copy_failed"));
  }
};

// Share modal handlers
const handleCopyLink = async () => {
  try {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    showSuccess(t("common.share.link_copied"));
  } catch (error) {
    showError(t("common.share.copy_failed"));
  }
};

const handleShareText = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: currentPost.value?.title,
        text: shareText.value,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(shareText.value);
      showSuccess(t("common.share.text_copied"));
    }
  } catch (error) {
    showError(t("common.share.share_failed"));
  }
};

// Lifecycle
onMounted(async () => {
  if (postId.value) {
    await fetchPost(postId.value);
  }
});

// Watch for route changes
watch(
  () => route.params.id,
  async (newId) => {
    if (newId && newId !== currentPost.value?.id) {
      await fetchPost(newId as string);
    }
  }
);
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  font-weight: 500;
  text-decoration: none;
}

.breadcrumb-current {
  font-weight: 600;
}

.loading-container,
.error-container,
.not-found-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.blog-post-content {
  max-width: none;
}

.prose {
  line-height: 1.75;
  color: #374151;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  margin-top: 2em;
  margin-bottom: 1em;
  font-weight: 600;
  color: #111827;
}

.prose h1 {
  font-size: 2.25em;
}
.prose h2 {
  font-size: 1.875em;
}
.prose h3 {
  font-size: 1.5em;
}

.prose p {
  margin-bottom: 1.25em;
}

.prose img {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin: 2em 0;
}

.prose blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 1em;
  margin: 1.5em 0;
  font-style: italic;
  color: #6b7280;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125em 0.25em;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1em;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5em 0;
}

.cover-image img {
  transition: transform 0.2s ease-in-out;
}

.cover-image img:hover {
  transform: scale(1.02);
}

.share-content textarea {
  resize: none;
  font-family: monospace;
  font-size: 0.875rem;
}

.related-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 3rem;
}

.comments-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 3rem;
}
</style>
