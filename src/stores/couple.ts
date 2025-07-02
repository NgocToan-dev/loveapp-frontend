import { defineStore } from "pinia";
import { coupleService } from "@/services/couple";
import type { ICoupleConnection, CoupleInvitation } from "@/types";

interface CoupleState {
  coupleConnection: ICoupleConnection | undefined;
  pendingInvitations: CoupleInvitation[];
  isLoading: boolean;
  isSendingInvitation: boolean;
  isAcceptingInvitation: boolean;
  error: string | null;
  successMessage: string | null;
  isInitialized: boolean;
}

export const useCoupleStore = defineStore("couple", {
  state: (): CoupleState => ({
    coupleConnection: undefined,
    pendingInvitations: [],
    isLoading: false,
    isSendingInvitation: false,
    isAcceptingInvitation: false,
    error: null,
    successMessage: null,
    isInitialized: false,
  }),

  getters: {
    isConnected: (state) => state.coupleConnection?.status === "accepted",
    
    isPending: (state) => state.coupleConnection?.status === "pending",
    
    partner: (state) => {
      if (!state.coupleConnection || state.coupleConnection.status !== "accepted") return null;
      
      // Get current user ID from user store - using dynamic import to avoid circular dependency
      // For now, we'll handle this in the component/composable where user context is available
      // This getter will be enhanced when used with user context
      return null;
    },
    
    relationshipDuration: (state) => {
      if (!state.coupleConnection?.anniversaryDate && !state.coupleConnection?.createdAt) {
        return null;
      }

      // Use anniversaryDate if available, otherwise use createdAt
      const startDate = state.coupleConnection.anniversaryDate || state.coupleConnection.createdAt;
      const start = new Date(startDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        days: diffDays,
        years: Math.floor(diffDays / 365),
        months: Math.floor((diffDays % 365) / 30),
        remainingDays: diffDays % 30,
      };
    },
    
    nextAnniversary: (state) => {
      if (!state.coupleConnection?.anniversaryDate && !state.coupleConnection?.createdAt) {
        return null;
      }

      // Use anniversaryDate if available, otherwise use createdAt
      const startDate = state.coupleConnection.anniversaryDate || state.coupleConnection.createdAt;
      const start = new Date(startDate);
      const now = new Date();
      const currentYear = now.getFullYear();

      let anniversary = new Date(currentYear, start.getMonth(), start.getDate());

      if (anniversary < now) {
        anniversary = new Date(currentYear + 1, start.getMonth(), start.getDate());
      }

      return anniversary;
    },

    formattedRelationshipDuration(): string {
      if (!this.relationshipDuration) return "";

      const { years, months, remainingDays } = this.relationshipDuration;

      if (years > 0) {
        return `${years} năm ${months} tháng ${remainingDays} ngày`;
      } else if (months > 0) {
        return `${months} tháng ${remainingDays} ngày`;
      } else {
        return `${remainingDays} ngày`;
      }
    },

    daysUntilAnniversary(): number {
      if (!this.nextAnniversary) return 0;

      const now = new Date();
      const diffTime = this.nextAnniversary.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
  },

  actions: {
    async fetchCoupleConnection(force = false) {
      // If already initialized and not forcing, skip fetch
      if (this.isInitialized && !force) {
        return this.coupleConnection;
      }

      // Prevent multiple simultaneous requests
      if (this.isLoading) return this.coupleConnection;

      this.isLoading = true;
      this.error = null;

      try {
        const connectionData = await coupleService.getCoupleConnection();
        // Only assign after successfully getting data
        this.coupleConnection = connectionData;
        this.isInitialized = true;
        return connectionData;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch couple connection";
        console.error("Error fetching couple connection:", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async sendInvitation(email: string) {
      this.isSendingInvitation = true;
      this.error = null;
      this.successMessage = null;

      try {
        const result = await coupleService.sendInvitation(email);
        // If we get a couple connection back, it means the connection was established
        this.coupleConnection = result;
        this.successMessage = "Connection successful!";
        return result;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to send invitation";
        throw err;
      } finally {
        this.isSendingInvitation = false;
      }
    },

    async acceptInvitation(coupleId: string) {
      this.isAcceptingInvitation = true;
      this.error = null;
      this.successMessage = null;

      try {
        const result = await coupleService.acceptInvitation(coupleId);
        this.coupleConnection = result;

        // Remove from pending invitations
        this.pendingInvitations = this.pendingInvitations.filter(
          (inv) => (inv._id || inv.id) !== coupleId
        );

        // Set success message
        this.successMessage = "Connection successful!";

        return this.coupleConnection;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to accept invitation";
        throw err;
      } finally {
        this.isAcceptingInvitation = false;
      }
    },

    async rejectInvitation(coupleId: string) {
      this.isLoading = true;
      this.error = null;

      try {
        await coupleService.rejectInvitation(coupleId);

        // Remove from pending invitations
        this.pendingInvitations = this.pendingInvitations.filter(
          (inv) => (inv._id || inv.id) !== coupleId
        );
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to reject invitation";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPendingInvitations(force = false) {
      // If already have invitations and not forcing, skip fetch unless empty
      if (this.pendingInvitations.length > 0 && !force) {
        return this.pendingInvitations;
      }

      this.isLoading = true;
      this.error = null;

      try {
        this.pendingInvitations = await coupleService.getPendingInvitations();
        return this.pendingInvitations;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to load invitations";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateRelationshipStart(date: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const result = await coupleService.updateRelationshipStart(date);
        this.coupleConnection = result;
        return result;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to update date";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async searchUserByEmail(email: string) {
      try {
        return await coupleService.searchUserByEmail(email);
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to search user";
        throw err;
      }
    },

    async generateInvitationCode() {
      try {
        return await coupleService.generateInvitationCode();
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to generate invitation code";
        throw err;
      }
    },

    // Initialize connection data - to be called once when app starts
    async initializeCoupleData() {
      try {
        await Promise.all([this.fetchCoupleConnection(), this.fetchPendingInvitations()]);
      } catch (error) {
        console.error("Failed to initialize couple data:", error);
      }
    },

    setCoupleConnection(connection: ICoupleConnection | undefined) {
      this.coupleConnection = connection;
    },

    clearError() {
      this.error = null;
    },

    clearSuccess() {
      this.successMessage = null;
    },

    async disconnectCouple() {
      this.isLoading = true;
      this.error = null;

      try {
        await coupleService.disconnectCouple();
        this.coupleConnection = undefined;
        this.isInitialized = false; // Reset initialization flag
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to disconnect couple";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // Reset store state
    $reset() {
      this.coupleConnection = undefined;
      this.pendingInvitations = [];
      this.isLoading = false;
      this.isSendingInvitation = false;
      this.isAcceptingInvitation = false;
      this.error = null;
      this.successMessage = null;
      this.isInitialized = false;
    },
  },
});
