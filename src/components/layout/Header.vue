<template>
  <header class="bg-white shadow-sm border-b border-primary-100 w-full shrink-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="text-2xl">💕</div>
            <span
              class="font-romantic text-2xl bg-gradient-to-r from-primary-600 to-spring-green bg-clip-text"
              >LoveApp</span
            >
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link
            v-for="item in navigation"
            :key="item.href"
            :to="item.href"
            class="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            active-class="border-b-2 border-pink-600"
          >
            {{ $t(item.labelKey) }}
          </router-link>
        </nav>

        <!-- User section -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Language Switcher -->
          <LanguageSwitcher />

          <!-- Notifications -->
          <Button
            variant="ghost"
            size="md"
            class="relative"
            @click="showNotifications = !showNotifications"
            :title="t('common.notifications.title')"
          >
            <template #icon>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-3.5-3.5L15 9a6 6 0 10-12 0l1.5 4-3.5 3.5H6M11 20a2 2 0 01-4 0"
                />
              </svg>
            </template>
            <span
              v-if="upcomingRemindersCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ upcomingRemindersCount }}
            </span>
          </Button>

          <!-- User avatar -->
          <Dropdown position="right">
            <template #trigger>
              <div class="flex items-center gap-1">
                <Avatar
                  :src="userStore.user?.avatarUrl"
                  :initials="userStore.userInitials"
                  size="sm"
                />
                <span v-if="userStore.user" class="text-sm font-medium text-gray-700">
                  {{ userStore.userDisplayName }}
                </span>
              </div>
            </template>

            <DropdownItem :icon="UserIcon" @click="$router.push('/profile')">
              {{ $t("navigation.profile") }}
            </DropdownItem>
            <DropdownItem :icon="CogIcon" @click="$router.push('/preferences')">
              {{ $t("navigation.settings") }}
            </DropdownItem>
            <DropdownItem :icon="LogoutIcon" danger @click="handleLogout">
              {{ $t("common.actions.signOut") }}
            </DropdownItem>
          </Dropdown>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <Button
            variant="ghost"
            size="md"
            class="text-gray-600 hover:text-pink-600 p-2"
            @click="uiStore.toggleMobileMenu"
          >
            <template #icon>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </template>
          </Button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="uiStore.isMobileMenuOpen" class="md:hidden py-2">
        <div class="flex flex-col space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.href"
            :to="item.href"
            class="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium"
            @click="uiStore.closeMobileMenu"
            active-class="!text-primary-600 !bg-primary-50"
          >
            {{ $t(item.labelKey) }}
          </router-link>

          <!-- Mobile user section -->
          <div class="border-t border-gray-200 pt-4 mt-4">
            <div class="flex items-center px-3 py-2">
              <Avatar
                :src="userStore.user?.avatarUrl"
                :initials="userStore.userInitials"
                size="sm"
              />
              <span
                v-if="userStore.user"
                class="ml-3 text-base font-medium text-gray-700"
              >
                {{ userStore.userDisplayName }}
              </span>
            </div>
            <router-link
              to="/profile"
              class="block text-gray-600 hover:text-pink-600 px-3 py-2 rounded-md text-base font-medium"
              @click="uiStore.closeMobileMenu"
              active-class="!text-primary-600 !bg-primary-50"
            >
              {{ $t("navigation.profile") }}
            </router-link>
            <Button
              variant="error"
              size="md"
              block
              class="text-left"
              @click="handleLogout"
            >
              {{ $t("common.actions.signOut") }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import { useRemindersStore } from "@/stores/reminders";
import Avatar from "@/components/common/Avatar.vue";
import Button from "@/components/common/Button.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropdownItem from "@/components/common/DropdownItem.vue";
import LanguageSwitcher from "@/components/common/LanguageSwitcher.vue";
import CoupleTimeWidget from "@/components/couple/CoupleTimeWidget.vue";
import UserIcon from "@/components/icons/UserIcon.vue";
import CogIcon from "@/components/icons/CogIcon.vue";
import LogoutIcon from "@/components/icons/LogoutIcon.vue";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const uiStore = useUIStore();
const remindersStore = useRemindersStore();

const showNotifications = ref(false);

const isDev = computed(() => import.meta.env.DEV);

const navigation = [
  { href: "/", labelKey: "navigation.home" },
  { href: "/blog", labelKey: "navigation.blog" },
  { href: "/memories", labelKey: "navigation.memories" },
  { href: "/reminders", labelKey: "navigation.reminders" },
  { href: "/timeline", labelKey: "navigation.timeline" },
];

const upcomingRemindersCount = computed(() => remindersStore.upcomingReminders.length);

const handleLogout = async () => {
  try {
    await userStore.logout();
    uiStore.showSuccessToast("Logged out successfully");
    router.push("/login");
  } catch (error) {
    uiStore.showErrorToast("Logout failed", error as string);
  }
};
</script>
