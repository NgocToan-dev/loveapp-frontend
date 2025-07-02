import { defineStore } from "pinia";
import { authService, type AuthResponse } from "@/services/auth";
import { storage } from "@/utils/helpers";
import type { LoginCredentials, RegisterCredentials } from "@/types";
import { UserEntity } from "@/types/model/user/UserEntity";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: storage.get<UserEntity>("user") as UserEntity | null,
    token: storage.get<string>("auth_token") as string | null,
    refreshToken: storage.get<string>("refresh_token") as string | null,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,

    hasPartner: (state) => !!state.user?.coupleId,

    userDisplayName: (state) => {
      if (!state.user) return "";
      if (state.user.displayName) return state.user.displayName;
      if (state.user.firstName && state.user.lastName) {
        return `${state.user.firstName} ${state.user.lastName}`.trim();
      }
      return state.user.email; // Fallback to email
    },

    userInitials: (state) => {
      if (!state.user) return "";
      if (state.user.firstName && state.user.lastName) {
        return `${state.user.firstName.charAt(0)}${state.user.lastName.charAt(0)}`.toUpperCase();
      }
      if (state.user.displayName) {
        const names = state.user.displayName.split(" ");
        if (names.length >= 2) {
          return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
        }
        return state.user.displayName.substring(0, 2).toUpperCase();
      }
      return state.user.email.substring(0, 2).toUpperCase();
    },

    relationshipDuration: () => {
      // TODO: Calculate relationship duration from coupleId data
      return 0;
    },
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true;
      this.error = null;
      try {
        const response: AuthResponse = await authService.login(credentials);

        // Transform backend user to frontend User format
        const transformedUser: UserEntity = {
          _id: response.user.id,
          id: response.user.id,
          email: response.user.email,
          displayName: response.user.displayName,
          avatarUrl: response.user.avatarUrl,
          createdAt: response.user.createdAt,
          username: "", // Default values for optional fields
          firstName: "",
          lastName: "",
          isEmailVerified: false,
        };

        this.user = transformedUser;
        this.token = response.token;

        // Store in localStorage
        storage.set("user", transformedUser);
        storage.set("auth_token", response.token);

        if (response.refreshToken) {
          this.refreshToken = response.refreshToken;
          storage.set("refresh_token", response.refreshToken);
        }

        if (credentials.rememberMe) {
          storage.set("remember_user", true);
        }

        return response;
      } catch (err: any) {
        console.error("UserStore: Login error:", err);
        this.error = err.message || "Login failed";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async register(credentials: RegisterCredentials) {
      this.isLoading = true;
      this.error = null;

      try {
        // Ensure displayName is set if not provided
        const registerData = {
          ...credentials,
          displayName:
            credentials.displayName ||
            `${credentials.firstName} ${credentials.lastName}`.trim(),
        };

        const response: AuthResponse = await authService.register(registerData);

        // Transform backend user to frontend User format
        const transformedUser: UserEntity = {
          _id: response.user.id,
          id: response.user.id,
          email: response.user.email,
          displayName: response.user.displayName,
          avatarUrl: response.user.avatarUrl,
          createdAt: response.user.createdAt,
          username: credentials.username || "",
          firstName: credentials.firstName || "",
          lastName: credentials.lastName || "",
          isEmailVerified: false,
        };

        this.user = transformedUser;
        this.token = response.token;

        // Store in localStorage
        storage.set("user", transformedUser);
        storage.set("auth_token", response.token);

        if (response.refreshToken) {
          this.refreshToken = response.refreshToken;
          storage.set("refresh_token", response.refreshToken);
        }

        return response;
      } catch (err: any) {
        this.error = err.message || "Registration failed";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.isLoading = true;

      try {
        if (this.token) {
          await authService.logout();
        }

        this.user = null;
        this.token = null;
        this.refreshToken = null;
        this.error = null;

        // Clear localStorage
        storage.remove("user");
        storage.remove("auth_token");
        storage.remove("refresh_token");
        storage.remove("remember_user");
      } catch (err: any) {
        this.error = err.message || "Logout failed";
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile(updates: Partial<UserEntity>) {
      if (!this.user) throw new Error("User not authenticated");

      this.isLoading = true;
      this.error = null;

      try {
        const updatedUser = await authService.updateProfile(updates);
        this.user = updatedUser;
        storage.set("user", updatedUser);
        return updatedUser;
      } catch (err: any) {
        this.error = err.message || "Update failed";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async connectPartner(partnerEmail: string) {
      if (!this.user) throw new Error("User not authenticated");

      this.isLoading = true;
      this.error = null;

      try {
        // TODO: Implement partner connection API
        // For now, update coupleId locally
        const updatedUser = {
          ...this.user,
          coupleId: "temp-couple-id", // This should come from API
          updatedAt: new Date().toISOString(),
        };

        this.user = updatedUser;
        storage.set("user", updatedUser);
        return updatedUser;
      } catch (err: any) {
        this.error = err.message || "Connection failed";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    initializeAuth() {
      const storedUser = storage.get<UserEntity>("user");
      const storedToken = storage.get<string>("auth_token");

      if (storedUser && storedToken) {
        this.user = storedUser;
        this.token = storedToken;

        const storedRefreshToken = storage.get<string>("refresh_token");
        if (storedRefreshToken) {
          this.refreshToken = storedRefreshToken;
        }
      } else {
        console.log("UserStore: No stored auth data found");
      }
    },

    clearError() {
      this.error = null;
    },

    async forgotPassword(email: string) {
      this.isLoading = true;
      this.error = null;

      try {
        await authService.forgotPassword(email);
        return { success: true, message: "Password reset email sent" };
      } catch (err: any) {
        this.error = err.message || "Password reset failed";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async resetPassword(token: string, newPassword: string) {
      this.isLoading = true;
      this.error = null;

      try {
        await authService.resetPassword(token, newPassword);
        return { success: true, message: "Password reset successfully" };
      } catch (err: any) {
        this.error = err.message || "Password reset failed";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
