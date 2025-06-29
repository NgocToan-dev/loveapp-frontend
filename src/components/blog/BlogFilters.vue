<template>
  <div class="blog-filters bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <Input
          v-model="localFilters.search"
          :label="t('blog.filters.search')"
          :placeholder="t('blog.filters.searchPlaceholder')"
          leadingIcon="MagnifyingGlassIcon"
          @input="debouncedUpdateFilters"
        />
      </div>

      <!-- Status Filter -->
      <div>
        <Dropdown
          :label="t('blog.filters.status')"
          v-model="localFilters.status"
          @change="updateFilters"
        >
          <template #trigger="{ open }">
            <span>{{
              statusOptions.find((o) => o.value === localFilters.status)?.text
            }}</span>
          </template>
          <template #default="{ close }">
            <DropdownItem
              v-for="option in statusOptions"
              :key="option.value"
              @click="
                () => {
                  localFilters.status = option.value;
                  close();
                  updateFilters();
                }
              "
            >
              {{ option.text }}
            </DropdownItem>
          </template>
        </Dropdown>
      </div>

      <!-- Privacy Filter -->
      <div>
        <Dropdown
          :label="t('blog.filters.privacy')"
          v-model="localFilters.privacy"
          @change="updateFilters"
        >
          <template #trigger="{ open }">
            <span>{{
              privacyOptions.find((o) => o.value === localFilters.privacy)?.text
            }}</span>
          </template>
          <template #default="{ close }">
            <DropdownItem
              v-for="option in privacyOptions"
              :key="option.value"
              @click="
                () => {
                  localFilters.privacy = option.value;
                  close();
                  updateFilters();
                }
              "
            >
              {{ option.text }}
            </DropdownItem>
          </template>
        </Dropdown>
      </div>

      <!-- Sort By -->
      <div>
        <Dropdown
          :label="t('blog.filters.sortBy')"
          v-model="localFilters.sortBy"
          @change="updateFilters"
        >
          <template #trigger="{ open }">
            <span>{{
              sortByOptions.find((o) => o.value === localFilters.sortBy)?.text
            }}</span>
          </template>
          <template #default="{ close }">
            <DropdownItem
              v-for="option in sortByOptions"
              :key="option.value"
              @click="
                () => {
                  localFilters.sortBy = option.value;
                  close();
                  updateFilters();
                }
              "
            >
              {{ option.text }}
            </DropdownItem>
          </template>
        </Dropdown>
      </div>
    </div>

    <!-- Tags Filter -->
    <div v-if="availableTags.length > 0" class="mt-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        {{ $t("blog.filters.tags") }}
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in availableTags"
          :key="tag"
          @click="toggleTag(tag)"
          class="px-3 py-1 text-sm rounded-full transition-colors"
          :class="
            isTagSelected(tag)
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
        >
          #{{ tag }}
        </button>
      </div>
    </div>

    <!-- Active Filters & Clear -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600"
            >{{ $t("blog.filters.activeFilters") }}:</span
          >

          <!-- Active search -->
          <span
            v-if="localFilters.search"
            class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            "{{ localFilters.search }}"
          </span>

          <!-- Active status -->
          <span
            v-if="localFilters.status !== 'all'"
            class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
          >
            {{ $t(`blog.filters.${localFilters.status}`) }}
          </span>

          <!-- Active privacy -->
          <span
            v-if="localFilters.privacy !== 'all'"
            class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
          >
            {{ $t(`blog.privacy.${localFilters.privacy}`) }}
          </span>

          <!-- Active tags -->
          <span
            v-for="tag in localFilters.tags"
            :key="tag"
            class="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
          >
            #{{ tag }}
          </span>
        </div>

        <button
          @click="clearAllFilters"
          class="text-sm text-gray-500 hover:text-red-500 font-medium"
        >
          {{ $t("blog.filters.clearAll") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { BlogPostFilters } from "@/types";
// Common form components
import Input from "@/components/common/Input.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropdownItem from "@/components/common/DropdownItem.vue";

interface Props {
  filters: BlogPostFilters;
  availableTags: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateFilters: [filters: Partial<BlogPostFilters>];
  clearFilters: [];
}>();

const { t } = useI18n();

// Local filters for immediate UI updates
const localFilters = ref<BlogPostFilters>({ ...props.filters });

// Debounced search update
let searchTimeout: number | null = null;

const debouncedUpdateFilters = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = (setTimeout(() => {
    updateFilters();
  }, 300) as unknown) as number;
};

const updateFilters = () => {
  emit("updateFilters", localFilters.value);
};

const toggleTag = (tag: string) => {
  const currentTags = localFilters.value.tags || [];
  if (currentTags.includes(tag)) {
    localFilters.value.tags = currentTags.filter((t) => t !== tag);
  } else {
    localFilters.value.tags = [...currentTags, tag];
  }
  updateFilters();
};

const isTagSelected = (tag: string) => {
  return localFilters.value.tags?.includes(tag) || false;
};

const hasActiveFilters = computed(() => {
  return (
    localFilters.value.search !== "" ||
    localFilters.value.status !== "all" ||
    localFilters.value.privacy !== "all" ||
    (localFilters.value.tags && localFilters.value.tags.length > 0)
  );
});

const clearAllFilters = () => {
  localFilters.value = {
    search: "",
    tags: [],
    privacy: "all",
    status: "all",
    sortBy: "latest",
  };
  emit("clearFilters");
};

// Filter option definitions
const statusOptions: { value: "all" | "published" | "draft"; text: string }[] = [
  { value: "all", text: t("blog.filters.allStatus") },
  { value: "published", text: t("blog.filters.published") },
  { value: "draft", text: t("blog.filters.draft") },
];
const privacyOptions: {
  value: "all" | "public" | "couple" | "private";
  text: string;
}[] = [
  { value: "all", text: t("blog.filters.allPrivacy") },
  { value: "public", text: t("blog.privacy.public") },
  { value: "couple", text: t("blog.privacy.couple") },
  { value: "private", text: t("blog.privacy.private") },
];
const sortByOptions: {
  value: "latest" | "oldest" | "popular" | "views";
  text: string;
}[] = [
  { value: "latest", text: t("blog.filters.latest") },
  { value: "oldest", text: t("blog.filters.oldest") },
  { value: "popular", text: t("blog.filters.popular") },
  { value: "views", text: t("blog.filters.mostViewed") },
];

// Watch for external filter changes
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters };
  },
  { deep: true }
);
</script>
