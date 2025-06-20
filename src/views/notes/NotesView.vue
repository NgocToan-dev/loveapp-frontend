<template>
  <ResponsiveContainer>
    <div class="notes-view">
      <!-- Hero Section -->
      <section class="notes-hero">
        <div class="hero-background">
          <div class="floating-papers">
            <div class="paper" v-for="n in 8" :key="n"></div>
          </div>
        </div>
        <div class="hero-content">
          <h1 class="hero-title">
            <v-icon icon="mdi-notebook" class="title-icon" />
            My Love Journal
          </h1>
          <p class="hero-subtitle">
            Write down your thoughts, dreams, and precious moments
          </p>
          <v-btn
            color="primary"
            size="large"
            rounded
            elevation="0"
            class="create-note-btn"
            @click="createNote"
          >
            <v-icon icon="mdi-plus" start />
            Write New Note
          </v-btn>
        </div>
      </section>

      <!-- Stats & Quick Actions -->
      <section class="stats-section">
        <v-container>
          <div class="stats-grid">
            <div class="stat-card" @click="filterByCategory('all')">
              <div class="stat-icon">
                <v-icon icon="mdi-note-text-outline" color="primary" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ totalNotes }}</div>
                <div class="stat-label">Total Notes</div>
              </div>
            </div>
            <div class="stat-card" @click="filterByCategory('private')">
              <div class="stat-icon">
                <v-icon icon="mdi-lock" color="orange" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ privateNotesCount }}</div>
                <div class="stat-label">Private Notes</div>
              </div>
            </div>
            <div class="stat-card" @click="filterByCategory('shared')">
              <div class="stat-icon">
                <v-icon icon="mdi-share-variant" color="success" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ sharedNotesCount }}</div>
                <div class="stat-label">Shared Notes</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <v-icon icon="mdi-folder" color="secondary" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ allCategories.length }}</div>
                <div class="stat-label">Categories</div>
              </div>
            </div>
          </div>
          <div class="quick-filters">
            <v-chip-group v-model="selectedFilter" mandatory>
              <v-chip value="all" variant="elevated">All</v-chip>
              <v-chip value="recent" variant="elevated">Recent</v-chip>
              <v-chip value="favorites" variant="elevated">Favorites</v-chip>
              <v-chip value="private" variant="elevated">Private</v-chip>
            </v-chip-group>
          </div>
        </v-container>
      </section>

      <!-- Advanced Filter Section -->
      <section class="filter-section">
        <v-container>
          <!-- Main Filter Card -->
          <v-card 
            rounded="xl" 
            elevation="0" 
            class="filter-card"
            :style="{ 
              backgroundColor: 'rgb(var(--v-theme-surface))',
              border: '1px solid rgb(var(--v-theme-outline-variant))'
            }"
          >
            <v-card-text class="pa-6">
              <!-- Quick Actions Header -->
              <div class="filter-header d-flex justify-space-between align-center mb-6">
                <div class="filter-title">
                  <h3 class="text-h6 font-weight-bold" :style="{ color: 'rgb(var(--v-theme-on-surface))' }">
                    <v-icon class="mr-2" color="primary">mdi-filter-variant</v-icon>
                    Bộ lọc & Tìm kiếm
                  </h3>
                  <p class="text-caption mt-1" :style="{ color: 'rgb(var(--v-theme-on-surface-variant))' }">
                    Tìm kiếm và phân loại ghi chú theo ý muốn
                  </p>
                </div>
                <v-btn
                  color="primary"
                  variant="flat"
                  rounded="xl"
                  size="large"
                  @click="createNote"
                  class="create-btn"
                >
                  <v-icon start>mdi-plus</v-icon>
                  Viết ghi chú
                </v-btn>
              </div>

              <!-- Search and Filters Row -->
              <v-row align="center" class="mb-4">
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    label="Tìm kiếm ghi chú..."
                    variant="outlined"
                    rounded="xl"
                    clearable
                    hide-details
                    class="search-field"
                    :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
                  >
                    <template #append-inner>
                      <v-fade-transition>
                        <v-icon 
                          v-if="searchQuery" 
                          color="success"
                          size="small"
                        >
                          mdi-check-circle
                        </v-icon>
                      </v-fade-transition>
                    </template>
                  </v-text-field>
                </v-col>
                
                <v-col cols="4" md="2">
                  <v-select
                    v-model="selectedCategory"
                    :items="categoryOptions"
                    label="Danh mục"
                    variant="outlined"
                    rounded="xl"
                    hide-details
                    prepend-inner-icon="mdi-tag"
                    clearable
                    class="category-select"
                    :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
                  />
                </v-col>
                
                <v-col cols="4" md="2">
                  <v-select
                    v-model="sortBy"
                    :items="sortOptions"
                    label="Sắp xếp"
                    variant="outlined"
                    rounded="xl"
                    hide-details
                    prepend-inner-icon="mdi-sort"
                    class="sort-select"
                    :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
                  />
                </v-col>
                
                <v-col cols="4" md="1">
                  <div class="view-toggle-wrapper">
                    <v-btn-toggle
                      v-model="viewMode"
                      mandatory
                      variant="outlined"
                      divided
                      rounded="xl"
                      class="view-toggle"
                    >
                      <v-btn value="grid" size="small">
                        <v-icon>mdi-view-grid</v-icon>
                      </v-btn>
                      <v-btn value="list" size="small">
                        <v-icon>mdi-view-list</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </div>
                </v-col>
                
                <v-col cols="12" md="2">
                  <div class="results-count d-flex align-center justify-center">
                    <v-chip
                      color="primary"
                      variant="tonal"
                      rounded="xl"
                      class="px-4"
                    >
                      <v-icon start size="small">mdi-notebook</v-icon>
                      {{ filteredNotes.length }} ghi chú
                    </v-chip>
                  </div>
                </v-col>
              </v-row>

              <!-- Quick Category Filters -->
              <div class="category-filters">
                <div class="filter-section-title mb-3">
                  <span class="text-caption font-weight-medium" :style="{ color: 'rgb(var(--v-theme-on-surface-variant))' }">
                    Lọc nhanh theo danh mục
                  </span>
                </div>
                <v-chip-group
                  v-model="selectedFilter"
                  selected-class="text-primary"
                  color="primary"
                  filter
                  class="category-chips"
                >
                  <v-chip 
                    value="all" 
                    @click="filterByCategory('all')"
                    variant="outlined"
                    rounded="xl"
                    class="category-chip"
                  >
                    <v-icon start size="small">mdi-note-text</v-icon>
                    Tất cả
                    <v-badge 
                      :content="totalNotes"
                      color="grey"
                      offset-x="4"
                      offset-y="4"
                    />
                  </v-chip>
                  
                  <v-chip 
                    value="private" 
                    @click="filterByCategory('private')"
                    variant="outlined"
                    rounded="xl"
                    class="category-chip"
                    color="orange"
                  >
                    <v-icon start size="small">mdi-lock</v-icon>
                    Riêng tư
                    <v-badge 
                      :content="privateNotesCount"
                      color="orange"
                      offset-x="4"
                      offset-y="4"
                    />
                  </v-chip>
                  
                  <v-chip 
                    value="shared" 
                    @click="filterByCategory('shared')"
                    variant="outlined"
                    rounded="xl"
                    class="category-chip"
                    color="info"
                  >
                    <v-icon start size="small">mdi-share</v-icon>
                    Chia sẻ
                    <v-badge 
                      :content="sharedNotesCount"
                      color="info"
                      offset-x="4"
                      offset-y="4"
                    />
                  </v-chip>
                  
                  <v-chip 
                    value="recent" 
                    @click="filterByCategory('recent')"
                    variant="outlined"
                    rounded="xl"
                    class="category-chip"
                    color="success"
                  >
                    <v-icon start size="small">mdi-clock-outline</v-icon>
                    Gần đây
                  </v-chip>

                  <!-- Dynamic category chips -->
                  <v-chip 
                    v-for="category in allCategories.slice(0, 4)"
                    :key="category"
                    :value="category"
                    @click="filterByCategory(category)"
                    variant="outlined"
                    rounded="xl"
                    class="category-chip"
                    :color="getCategoryColor(category)"
                  >
                    <v-icon start size="small">{{ getCategoryIcon(category) }}</v-icon>
                    {{ category }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </section>

      <!-- Content Area -->
      <section class="content-section">
        <v-container>
          <!-- Loading State -->
          <div v-if="isLoading" class="loading-container">
            <v-progress-circular indeterminate color="primary" size="64" width="4" />
            <p class="loading-text">Loading your beautiful notes...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredNotes.length === 0" class="empty-state">
            <div class="empty-icon">
              <v-icon icon="mdi-notebook-outline" size="120" color="grey-lighten-2" />
            </div>
            <h3 class="empty-title">No notes yet</h3>
            <p class="empty-subtitle">Start writing your thoughts and memories!</p>
            <v-btn color="primary" size="large" rounded @click="createNote">
              <v-icon icon="mdi-plus" start />
              Write Your First Note
            </v-btn>
          </div>

          <!-- Notes Grid View -->
          <div v-else-if="viewMode === 'grid'" class="notes-grid">
            <v-row>
              <v-col
                v-for="note in filteredNotes"
                :key="note.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <NoteCard
                  :note="note"
                  @open-note="handleOpenNote"
                  @edit-note="handleEditNote"
                  @delete-note="handleDeleteNote"
                  @toggle-privacy="handleTogglePrivacy"
                />
              </v-col>
            </v-row>
          </div>

          <!-- Notes List View -->
          <div v-else class="notes-list">
            <v-card rounded="xl" elevation="2">
              <v-list>
                <v-list-item
                  v-for="note in filteredNotes"
                  :key="note.id"
                  class="note-list-item"
                  @click="handleOpenNote(note)"
                >
                  <template #prepend>
                    <v-avatar :color="getCategoryColor(note.category)" size="40">
                      <v-icon color="white">{{ getCategoryIcon(note.category) }}</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="note-list-title">
                    {{ note.title }}
                  </v-list-item-title>

                  <v-list-item-subtitle class="note-list-subtitle">
                    <div class="d-flex align-center">
                      <v-chip
                        size="x-small"
                        :color="getCategoryColor(note.category)"
                        variant="tonal"
                        class="me-2"
                      >
                        {{ note.category }}
                      </v-chip>
                      <span>{{ formatDate(note.updatedAt) }}</span>
                      <v-icon v-if="note.isPrivate" size="14" color="orange" class="ms-2"
                        >mdi-lock</v-icon
                      >
                      <v-icon
                        v-if="hasAttachments(note)"
                        size="14"
                        color="blue"
                        class="ms-1"
                        >mdi-paperclip</v-icon
                      >
                    </div>
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="list-actions">
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click.stop="handleEditNote(note)"
                      >
                        <v-icon size="16">mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click.stop="handleTogglePrivacy(note)"
                      >
                        <v-icon size="16" :color="note.isPrivate ? 'orange' : 'grey'">
                          {{ note.isPrivate ? "mdi-lock" : "mdi-lock-open" }}
                        </v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </div>
        </v-container>
      </section>
    </div>
  </ResponsiveContainer>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useNotesStore } from "@/stores/notes";
import { useDialogsStore } from "@/stores/dialogs";
import type { Note } from "@/types";
import NoteCard from "@/components/notes/NoteCard.vue";
import ResponsiveContainer from "@/components/ui/ResponsiveContainer.vue";
import dayjs from "dayjs";

// Router
const router = useRouter();

// Stores
const notesStore = useNotesStore();
const dialogsStore = useDialogsStore();

// Store refs
const { notes, isLoading } = storeToRefs(notesStore);

// Local state
const searchQuery = ref("");
const selectedFilter = ref("all");
const selectedCategory = ref("");
const sortBy = ref("updated");
const viewMode = ref<"grid" | "list">("grid");

// Computed properties
const totalNotes = computed(() => notes.value.length);

const privateNotesCount = computed(
  () => notes.value.filter((note) => note.isPrivate).length
);

const sharedNotesCount = computed(
  () => notes.value.filter((note) => note.sharedWith && note.sharedWith.length > 0).length
);

const allCategories = computed(() => {
  const categories = new Set(notes.value.map((note) => note.category));
  return Array.from(categories).filter(Boolean);
});

const categoryOptions = computed(() =>
  allCategories.value.map((cat) => ({ title: cat, value: cat }))
);

const sortOptions = [
  { title: "Recently Updated", value: "updated" },
  { title: "Recently Created", value: "created" },
  { title: "Title A-Z", value: "title-asc" },
  { title: "Title Z-A", value: "title-desc" },
];

// Utility function to convert date to number for comparison
const getDateTimestamp = (
  date: Date | string | { _seconds: number; _nanoseconds: number }
): number => {
  if (!date) return 0;

  if (typeof date === "string") {
    return new Date(date).getTime();
  } else if (date instanceof Date) {
    return date.getTime();
  } else {
    // Firestore timestamp
    return date._seconds * 1000;
  }
};

const filteredNotes = computed(() => {
  let filtered = [...notes.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter((note) => note.category === selectedCategory.value);
  }

  // Apply quick filter
  switch (selectedFilter.value) {
    case "recent":
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(
        (note) => getDateTimestamp(note.updatedAt) > sevenDaysAgo.getTime()
      );
      break;
    case "favorites":
      // Assuming we add a favorites field in the future
      break;
    case "private":
      filtered = filtered.filter((note) => note.isPrivate);
      break;
  }

  // Apply sorting
  switch (sortBy.value) {
    case "updated":
      filtered.sort(
        (a, b) => getDateTimestamp(b.updatedAt) - getDateTimestamp(a.updatedAt)
      );
      break;
    case "created":
      filtered.sort(
        (a, b) => getDateTimestamp(b.createdAt) - getDateTimestamp(a.createdAt)
      );
      break;
    case "title-asc":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return filtered;
});

// Methods
const createNote = () => {
  router.push('/notes/create')
};

const handleOpenNote = (note: Note) => {
  router.push({ name: "note-detail", params: { id: note.id } });
};

const handleEditNote = (note: Note) => {
  router.push({ name: 'edit-note', params: { id: note.id } })
};

const handleDeleteNote = async (note: Note) => {
  try {
    const confirmed = await dialogsStore.openConfirmDialog({
      title: "Delete Note",
      message: `Are you sure you want to delete "${note.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (confirmed) {
      await notesStore.deleteNote(note.id);
    }
  } catch (error) {
    console.error("Failed to delete note:", error);
  }
};

const handleTogglePrivacy = async (note: Note) => {
  try {
    await notesStore.updateNote(note.id, {
      ...note,
      isPrivate: !note.isPrivate,
    });
  } catch (error) {
    console.error("Failed to toggle privacy:", error);
  }
};

const filterByCategory = (category: string) => {
  if (category === "all") {
    selectedFilter.value = "all";
    selectedCategory.value = "";
  } else if (category === "private") {
    selectedFilter.value = "private";
  } else if (category === "shared") {
    selectedFilter.value = "all";
    // Filter shared notes logic
  }
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Personal: "pink",
    Work: "blue",
    Love: "red",
    Ideas: "purple",
    Travel: "teal",
    Health: "green",
    Finance: "orange",
    Other: "grey",
  };
  return colors[category] || "grey";
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    Personal: "mdi-account-heart",
    Work: "mdi-briefcase",
    Love: "mdi-heart",
    Ideas: "mdi-lightbulb",
    Travel: "mdi-airplane",
    Health: "mdi-heart-pulse",
    Finance: "mdi-wallet",
    Other: "mdi-note-text",
  };
  return icons[category] || "mdi-note-text";
};

const hasAttachments = (note: Note) => {
  return note.attachments && note.attachments.length > 0;
};

const formatDate = (date: Date | string | { _seconds: number; _nanoseconds: number }) => {
  if (!date) return "";

  let dateObj: Date;
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    // Firestore timestamp
    dateObj = new Date(date._seconds * 1000);
  }

  return dayjs(dateObj).format("DD/MM/YYYY");
};

// Lifecycle
onMounted(async () => {
  if (notes.value.length === 0) {
    await notesStore.fetchNotes();
  }
});
</script>

<style scoped>
.notes-view {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(255, 182, 193, 0.1) 0%,
    rgba(255, 218, 185, 0.1) 50%,
    rgba(255, 228, 225, 0.1) 100%
  );
}

/* Hero Section */
.notes-hero {
  position: relative;
  padding: 80px 0 60px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1) 0%,
    rgba(var(--v-theme-secondary), 0.05) 50%,
    rgba(var(--v-theme-surface), 0.1) 100%
  );
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-papers {
  position: absolute;
  width: 100%;
  height: 100%;
}

.paper {
  position: absolute;
  width: 60px;
  height: 80px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: float 6s ease-in-out infinite;
  border-left: 3px solid rgba(var(--v-theme-primary), 0.3);
}

.paper:nth-child(1) {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}
.paper:nth-child(2) {
  top: 20%;
  right: 20%;
  animation-delay: 1s;
}
.paper:nth-child(3) {
  top: 60%;
  left: 15%;
  animation-delay: 2s;
}
.paper:nth-child(4) {
  top: 70%;
  right: 10%;
  animation-delay: 3s;
}
.paper:nth-child(5) {
  top: 40%;
  left: 5%;
  animation-delay: 0.5s;
}
.paper:nth-child(6) {
  top: 30%;
  right: 5%;
  animation-delay: 1.5s;
}
.paper:nth-child(7) {
  top: 80%;
  left: 25%;
  animation-delay: 2.5s;
}
.paper:nth-child(8) {
  top: 15%;
  right: 30%;
  animation-delay: 3.5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-family: "Playfair Display", serif;
  font-size: 3.5rem;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.title-icon {
  color: rgb(var(--v-theme-primary)) !important;
  font-size: 3rem !important;
}

.hero-subtitle {
  font-family: "Montserrat", sans-serif;
  font-size: 1.3rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 30px;
  line-height: 1.6;
}

.create-note-btn {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)),
    rgb(var(--v-theme-secondary))
  ) !important;
  color: white !important;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 12px 32px;
  border-radius: 50px;
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.create-note-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(var(--v-theme-primary), 0.4);
}

/* Stats Section */
.stats-section {
  padding-top: 40px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1),
    rgba(var(--v-theme-secondary), 0.1)
  );
}

.stat-number {
  font-family: "Montserrat", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  line-height: 1;
}

.stat-label {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-weight: 500;
}

.quick-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.quick-filters .v-chip {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  border-radius: 25px;
  transition: all 0.3s ease;
}

/* Controls Section */
.controls-section {
  padding: 30px 0;
  background: rgba(255, 255, 255, 0.3);
}

.search-field,
.category-select,
.sort-select {
  border-radius: 15px;
}

.view-toggle .v-btn {
  border-radius: 12px;
}

/* Content Section */
.content-section {
  padding: 40px 0 80px;
}

.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.loading-text {
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-title {
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: rgb(var(--v-theme-primary));
  margin: 20px 0 10px;
}

.empty-subtitle {
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 30px;
}

/* Notes Grid */
.notes-grid {
  min-height: 300px;
}

/* Notes List */
.notes-list {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.note-list-item {
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.note-list-item:hover {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05),
    rgba(var(--v-theme-secondary), 0.03)
  );
}

.note-list-item:last-child {
  border-bottom: none;
}

.note-list-title {
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.note-list-subtitle {
  font-family: "Montserrat", sans-serif;
  font-size: 0.85rem;
}

.list-actions {
  display: flex;
  gap: 4px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.note-list-item:hover .list-actions {
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 8px;
  }

  .title-icon {
    font-size: 2.5rem !important;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .notes-hero {
    padding: 60px 0 40px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .paper {
    width: 40px;
    height: 55px;
  }
}
</style>
