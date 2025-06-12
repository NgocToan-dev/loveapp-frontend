import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth'
import type { User as FirebaseUser } from 'firebase/auth'
import type { User } from '@/types'
import ApiService from './api'

export class AuthService {
  private auth = getAuth()

  // Convert Firebase User to our User type
  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || undefined,
      emailVerified: firebaseUser.emailVerified,
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
      updatedAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
    }
  }

  // Register new user
  async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName })
      
      // Send email verification
      await sendEmailVerification(userCredential.user)
      
      // Create user profile in backend
      const userData = this.mapFirebaseUser(userCredential.user)
      await ApiService.post('/auth/register', userData)
      
      return userData
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken()
      
      // Store token for API requests
      localStorage.setItem('authToken', idToken)
      
      // Sync with backend
      const userData = this.mapFirebaseUser(userCredential.user)
      await ApiService.post('/auth/login', { idToken })
      
      return userData
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(this.auth)
      localStorage.removeItem('authToken')
      await ApiService.post('/auth/logout')
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed')
    }
  }

  // Get current user
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (firebaseUser) => {
        unsubscribe()
        if (firebaseUser) {
          resolve(this.mapFirebaseUser(firebaseUser))
        } else {
          resolve(null)
        }
      })
    })
  }

  // Update user profile
  async updateUserProfile(updates: {
    displayName?: string
    photoURL?: string
  }): Promise<void> {
    try {
      const user = this.auth.currentUser
      if (!user) throw new Error('No authenticated user')
      
      await updateProfile(user, updates)
      
      // Sync with backend
      await ApiService.put('/auth/profile', updates)
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed')
    }
  }

  // Change password
  async changePassword(newPassword: string): Promise<void> {
    try {
      const user = this.auth.currentUser
      if (!user) throw new Error('No authenticated user')
      
      await updatePassword(user, newPassword)
    } catch (error: any) {
      throw new Error(error.message || 'Password change failed')
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email)
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed')
    }
  }

  // Resend email verification
  async resendEmailVerification(): Promise<void> {
    try {
      const user = this.auth.currentUser
      if (!user) throw new Error('No authenticated user')
      
      await sendEmailVerification(user)
    } catch (error: any) {
      throw new Error(error.message || 'Email verification failed')
    }
  }

  // Get fresh ID token
  async getIdToken(forceRefresh = false): Promise<string | null> {
    try {
      const user = this.auth.currentUser
      if (!user) return null
      
      return await user.getIdToken(forceRefresh)
    } catch (error: any) {
      console.error('Failed to get ID token:', error)
      return null
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        callback(this.mapFirebaseUser(firebaseUser))
      } else {
        callback(null)
      }
    })
  }
}

export default new AuthService()