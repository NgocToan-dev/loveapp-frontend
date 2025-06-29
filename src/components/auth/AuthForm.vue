<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 px-4"
  >
    <div class="max-w-md w-full space-y-8">
      <!-- Logo/Header -->
      <div class="text-center">
        <div
          class="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
        >
          <HeartIcon class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900">
          {{ isLogin ? $t("auth.login.title") : $t("auth.register.title") }}
        </h2>
        <p class="mt-2 text-gray-600">
          {{ isLogin ? $t("auth.login.subtitle") : $t("auth.register.subtitle") }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="bg-white rounded-lg p-6 shadow-lg space-y-4">
          <!-- Name fields (register only) -->
          <div v-if="!isLogin" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <Input
                v-model:modelValue="form.firstName"
                :label="$t('auth.form.firstName')"
                :placeholder="$t('auth.form.firstNamePlaceholder')"
                required
              />
              <Input
                v-model:modelValue="form.lastName"
                :label="$t('auth.form.lastName')"
                :placeholder="$t('auth.form.lastNamePlaceholder')"
                required
              />
            </div>
            <Input
              v-model:modelValue="form.username"
              :label="$t('auth.form.username')"
              :placeholder="$t('auth.form.usernamePlaceholder')"
              required
            />
          </div>

          <!-- Email field -->
          <Input
            v-model:modelValue="form.email"
            type="email"
            :label="$t('auth.form.email')"
            :placeholder="$t('auth.form.emailPlaceholder')"
            required
          />

          <!-- Password field -->
          <Input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :label="$t('auth.form.password')"
            :placeholder="$t('auth.form.passwordPlaceholder')"
            required
          >
            <template #trailing-icon>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-gray-400 hover:text-gray-600"
              >
                <EyeIcon v-if="showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </template>
          </Input>

          <!-- Confirm Password field (register only) -->
          <div v-if="!isLogin">
            <Input
              v-model:modelValue="form.confirmPassword"
              type="password"
              :label="$t('auth.form.confirmPassword')"
              :placeholder="$t('auth.form.confirmPasswordPlaceholder')"
              required
            />
          </div>

          <!-- Remember me / Forgot password -->
          <div v-if="isLogin" class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
              />
              <span class="ml-2 text-sm text-gray-600">
                {{ $t("auth.form.rememberMe") }}
              </span>
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              @click="showForgotPassword = true"
            >
              {{ $t("auth.form.forgotPassword") }}
            </Button>
          </div>

          <!-- Submit button -->
          <Button type="submit" variant="primary" block :loading="isLoading">
            {{ isLogin ? $t("auth.login.submit") : $t("auth.register.submit") }}
          </Button>
        </div>
      </form>

      <!-- Switch mode -->
      <div class="text-center">
        <p class="text-gray-600">
          {{ isLogin ? $t("auth.login.noAccount") : $t("auth.register.hasAccount") }}
          <Button @click="toggleMode" variant="ghost-link" size="sm">
            {{ isLogin ? $t("auth.register.submit") : $t("auth.login.submit") }}
          </Button>
        </p>
      </div>

      <!-- Social login -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span
              class="px-2 bg-gradient-to-br from-pink-50 to-purple-100 text-gray-500"
            >
              {{ $t("auth.social.divider") }}
            </span>
          </div>
        </div>

        <div class="my-6 grid grid-cols-2 gap-3">
          <Button
            @click="handleGoogleLogin"
            variant="secondary"
            block
            size="md"
          >
            <template #icon>
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285f4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </template>
            Google
          </Button>

          <Button
            @click="handleFacebookLogin"
            variant="secondary"
            block
            size="md"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="#1877f2" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </template>
            Facebook
          </Button>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <Modal v-if="showForgotPassword" @close="showForgotPassword = false">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ $t("auth.forgotPassword.title") }}
        </h3>
        <p class="text-gray-600 mb-4">
          {{ $t("auth.forgotPassword.description") }}
        </p>
        <form @submit.prevent="handleForgotPassword">
          <Input
            v-model:modelValue="forgotPasswordEmail"
            type="email"
            :placeholder="$t('auth.form.emailPlaceholder')"
            required
            class="mb-4"
          />
          <div class="flex space-x-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              @click="showForgotPassword = false"
            >
              {{ $t("common.buttons.cancel") }}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              :loading="isLoadingForgotPassword"
            >
              {{ $t("auth.forgotPassword.submit") }}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { HeartIcon, EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import Modal from "@/components/common/Modal.vue";
import Input from "@/components/common/Input.vue";
import Button from "@/components/common/Button.vue";

interface Props {
  mode?: "login" | "register";
}

const props = withDefaults(defineProps<Props>(), {
  mode: "login",
});

const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const uiStore = useUIStore();

const isLogin = ref(props.mode === "login");
const showPassword = ref(false);
const isLoading = ref(false);
const showForgotPassword = ref(false);
const isLoadingForgotPassword = ref(false);
const forgotPasswordEmail = ref("");

const form = reactive({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  rememberMe: false,
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  // Reset form
  Object.assign(form, {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });
};

const validateForm = () => {
  if (!isLogin.value) {
    if (!form.firstName.trim()) {
      uiStore.showErrorToast(t("common.validation.required"), t("auth.form.firstName"));
      return false;
    }
    if (!form.lastName.trim()) {
      uiStore.showErrorToast(t("common.validation.required"), t("auth.form.lastName"));
      return false;
    }
    if (!form.username.trim()) {
      uiStore.showErrorToast(t("common.validation.required"), t("auth.form.username"));
      return false;
    }
    if (form.password !== form.confirmPassword) {
      uiStore.showErrorToast(t("common.validation.passwordMatch"));
      return false;
    }
  }

  if (form.password.length < 6) {
    uiStore.showErrorToast(t("common.validation.minLength", { min: 6 }));
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    if (isLogin.value) {
      const response = await userStore.login({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
      });
      uiStore.showSuccessToast(t("auth.login.success"));
    } else {
      const response = await userStore.register({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      uiStore.showSuccessToast(t("auth.register.success"));
    }

    // Redirect to home page
    router.push("/");
  } catch (error) {
    console.error("Auth error:", error);
    const message = error instanceof Error ? error.message : t("auth.errors.generic");
    uiStore.showErrorToast(t("common.status.error"), message);
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = async () => {
  try {
    // TODO: Implement Google OAuth
    uiStore.showErrorToast(t("common.status.error"), "Google login not implemented yet");
  } catch (error) {
    const message = error instanceof Error ? error.message : t("auth.errors.generic");
    uiStore.showErrorToast(t("common.status.error"), message);
  }
};

const handleFacebookLogin = async () => {
  try {
    // TODO: Implement Facebook OAuth
    uiStore.showErrorToast(
      t("common.status.error"),
      "Facebook login not implemented yet"
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : t("auth.errors.generic");
    uiStore.showErrorToast(t("common.status.error"), message);
  }
};

const handleForgotPassword = async () => {
  if (!forgotPasswordEmail.value) return;

  isLoadingForgotPassword.value = true;

  try {
    await userStore.forgotPassword(forgotPasswordEmail.value);
    uiStore.showSuccessToast(t("auth.forgotPassword.success"));
    showForgotPassword.value = false;
    forgotPasswordEmail.value = "";
  } catch (error) {
    const message = error instanceof Error ? error.message : t("auth.errors.generic");
    uiStore.showErrorToast(t("common.status.error"), message);
  } finally {
    isLoadingForgotPassword.value = false;
  }
};
</script>
