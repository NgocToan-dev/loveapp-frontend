# 🔐 LOVE APP FRONTEND - AUTHENTICATION IMPLEMENTATION PLAN

## 📋 Current Status Analysis

### ✅ Đã có sẵn (Partially Implemented)
- **AuthForm Component**: UI form hoàn chỉnh cho login/register
- **useAuth Composable**: Auth logic với token management
- **authService**: API service methods
- **Router Guards**: Route protection logic
- **API Interceptors**: Token injection và error handling
- **Storage Utilities**: LocalStorage wrapper
- **User Store**: Pinia store structure (mock data)

### ❌ Chưa hoàn thành (Missing Implementation)
- **API Integration**: Services vẫn đang mock data
- **Token Refresh**: Auto refresh token mechanism
- **User Persistence**: Restore user from storage on app init
- **Error Handling**: Comprehensive error messages
- **Loading States**: Proper loading UI feedback
- **Validation**: Form validation với proper error display

---

## 🎯 Implementation Plan

### Phase 1: Core Authentication Integration (Priority: HIGH)

#### 1.1 Fix API Service Integration
**File**: `src/services/auth.ts`

**Current Issues**:
- Backend endpoints có format khác với frontend expectations
- Response structure cần align với backend

**Changes Needed**:
```typescript
// Update response interfaces để match backend
interface AuthResponse {
  success: boolean
  data: {
    user: User
    token: string
    refreshToken?: string
    couple?: CoupleConnection
  }
  message?: string
}

// Cập nhật error handling
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data // Backend trả về { success, data, message }
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Login failed')
    }
  }
}
```

#### 1.2 Update User Store 
**File**: `src/stores/user.ts`

**Changes Needed**:
- Remove mock data, integrate real API calls
- Add proper error handling
- Implement token refresh logic
- Add user persistence on app init

```typescript
// Replace mock implementation
const login = async (credentials: LoginCredentials) => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await authService.login(credentials)
    
    if (response.success) {
      user.value = response.data.user
      isAuthenticated.value = true
      
      // Store tokens
      storage.set('auth_token', response.data.token)
      storage.set('user', response.data.user)
      
      if (response.data.refreshToken) {
        storage.set('refresh_token', response.data.refreshToken)
      }
    }
    
    return response
  } catch (err: any) {
    error.value = err.message
    isAuthenticated.value = false
    throw err
  } finally {
    isLoading.value = false
  }
}
```

#### 1.3 User Types Alignment
**File**: `src/types/index.ts`

**Update User interface** để match với backend User model:
```typescript
export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  avatarUrl?: string
  coupleId?: string
  isEmailVerified: boolean
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}
```

#### 1.4 App Initialization 
**File**: `src/main.ts`

**Add user restoration logic**:
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Restore user session on app init
const userStore = useUserStore()
await userStore.initializeAuth()

app.mount('#app')
```

### Phase 2: Enhanced Features (Priority: MEDIUM)

#### 2.1 Token Refresh Mechanism
**File**: `src/services/api.ts`

**Add auto token refresh**:
```typescript
// Add refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = storage.get<string>('refresh_token')
      
      if (refreshToken) {
        try {
          const response = await axios.post('/auth/refresh', { 
            refreshToken 
          })
          
          const newToken = response.data.data.token
          storage.set('auth_token', newToken)
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${newToken}`
          return api.request(error.config)
        } catch (refreshError) {
          // Refresh failed, logout user
          storage.clear()
          window.location.href = '/login'
        }
      } else {
        // No refresh token, logout
        storage.clear()
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)
```

#### 2.2 Form Validation Enhancement
**File**: `src/components/auth/AuthForm.vue`

**Add comprehensive validation**:
```vue
<script setup lang="ts">
import { z } from 'zod'

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const formErrors = ref<Record<string, string>>({})

const validateForm = () => {
  try {
    if (isLogin.value) {
      loginSchema.parse(form.value)
    } else {
      registerSchema.parse(form.value)
    }
    formErrors.value = {}
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      formErrors.value = error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message
        return acc
      }, {})
    }
    return false
  }
}
</script>
```

#### 2.3 Better Error Handling
**File**: `src/composables/useAuth.ts`

**Enhanced error handling**:
```typescript
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message
  }
  
  switch (error.response?.status) {
    case 400:
      return t('auth.errors.invalid_credentials')
    case 401:
      return t('auth.errors.unauthorized')
    case 422:
      return t('auth.errors.validation_failed')
    case 429:
      return t('auth.errors.too_many_attempts')
    case 500:
      return t('auth.errors.server_error')
    default:
      return t('auth.errors.generic')
  }
}
```

### Phase 3: Advanced Features (Priority: LOW)

#### 3.1 Social Login Integration
**Files**: `src/services/auth.ts`, `src/components/auth/AuthForm.vue`

**Google OAuth implementation**:
```typescript
// Add to authService
async loginWithGoogle(): Promise<AuthResponse> {
  // Integrate with Google OAuth API
  const googleUser = await google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: 'email profile'
  })
  
  const response = await api.post('/auth/google', {
    token: googleUser.access_token
  })
  
  return response.data
}
```

#### 3.2 Email Verification
**Add email verification flow**:
```typescript
// New service methods
async sendVerificationEmail(): Promise<void> {
  await api.post('/auth/send-verification')
}

async verifyEmail(token: string): Promise<void> {
  await api.post('/auth/verify-email', { token })
}
```

#### 3.3 Two-Factor Authentication
**Add 2FA support** (optional):
```typescript
// 2FA methods
async enable2FA(): Promise<{ qrCode: string; secret: string }> {
  const response = await api.post('/auth/2fa/enable')
  return response.data
}

async verify2FA(code: string): Promise<void> {
  await api.post('/auth/2fa/verify', { code })
}
```

---

## 🔧 Implementation Steps

### Step 1: Backend API Verification
1. ✅ **Verify backend endpoints** are working:
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

2. ✅ **Check response format** matches frontend expectations

### Step 2: Update Frontend Types & Interfaces  
1. **Update User interface** trong `src/types/index.ts`
2. **Update AuthResponse interface** trong `src/services/auth.ts`
3. **Add proper error types** for better error handling

### Step 3: Fix API Integration
1. **Remove mock data** từ User Store
2. **Update authService methods** để call real backend APIs
3. **Update response handling** để match backend format

### Step 4: Test Authentication Flow
1. **Test login flow** với real backend
2. **Test registration flow** với validation
3. **Test token persistence** and restoration
4. **Test route protection** với authenticated/unauthenticated states

### Step 5: Add Advanced Features
1. **Token refresh mechanism**
2. **Enhanced error handling**
3. **Form validation** với proper error display
4. **Loading states** improvement

---

## 🧪 Testing Checklist

### Basic Authentication
- [ ] User can register with valid data
- [ ] User can login with valid credentials  
- [ ] User cannot login with invalid credentials
- [ ] User session persists across browser refresh
- [ ] User can logout successfully
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Public routes redirect to home when authenticated

### Token Management
- [ ] Token is stored in localStorage
- [ ] Token is sent with API requests
- [ ] Token refresh works on 401 errors
- [ ] User is logged out when refresh fails
- [ ] Multiple tab synchronization works

### Error Handling
- [ ] Network errors show appropriate messages
- [ ] Server errors show user-friendly messages
- [ ] Validation errors show field-specific messages
- [ ] Loading states work correctly

### Form Validation
- [ ] Email format validation
- [ ] Password strength requirements
- [ ] Password confirmation matching
- [ ] Required field validation
- [ ] Real-time validation feedback

---

## 📁 Files to Create/Modify

### Create New Files
1. `src/types/auth.ts` - Authentication-specific types
2. `src/composables/useTokenRefresh.ts` - Token refresh logic
3. `src/utils/validation.ts` - Validation schemas
4. `src/composables/useFormValidation.ts` - Form validation composable

### Modify Existing Files
1. ✅ `src/stores/user.ts` - Remove mock data, add real API integration
2. ✅ `src/services/auth.ts` - Update API methods and error handling
3. ✅ `src/components/auth/AuthForm.vue` - Add validation and better error display
4. ✅ `src/services/api.ts` - Add token refresh interceptor
5. ✅ `src/main.ts` - Add user session restoration
6. ✅ `src/types/index.ts` - Update User interface
7. ✅ `src/router/index.ts` - Enhance route guards

---

## 🎯 Success Metrics

### Phase 1 Complete When:
- ✅ User can successfully login/register với backend
- ✅ Token is properly stored and used for API calls
- ✅ Route protection works correctly
- ✅ User session persists across browser refresh

### Phase 2 Complete When:
- ✅ Token refresh works automatically
- ✅ Form validation provides clear feedback
- ✅ Error messages are user-friendly
- ✅ Loading states enhance UX

### Phase 3 Complete When:
- ✅ Social login works (if implemented)
- ✅ Email verification flow works
- ✅ Advanced security features function

---

## 🚀 Quick Start Implementation

### Immediate Actions (Next 30 minutes):
1. **Update User interface** trong `types/index.ts`
2. **Remove mock data** từ `stores/user.ts`
3. **Test backend login endpoint** với Postman/curl
4. **Update authService.login()** method

### Short Term (Today):
1. **Complete basic login/register flow**
2. **Test với real backend**
3. **Fix any immediate issues**
4. **Add basic error handling**

### Medium Term (This Week):
1. **Add token refresh mechanism**
2. **Enhance form validation**
3. **Improve error messages**
4. **Add loading states**

---

*This plan ensures a systematic approach to implementing authentication with proper error handling, validation, and user experience considerations.*
