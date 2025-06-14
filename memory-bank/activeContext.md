# Active Context - API Service Response Standardization

## Current Task
Standardized all service layer methods to use ApiService consistently, ensuring clean data extraction without nested response structures.

## Changes Made

### 1. Updated Type Definitions (`src/types/index.ts`)
- Modified `User` interface to match backend response:
  - Added `name`, `role`, `isEmailVerified`, `lastLoginAt`
  - Changed date fields to accept both string and Date types
  - Maintained backward compatibility with `emailVerified` and `displayName`
- Added new interfaces:
  - `AuthTokens`: Structure for access/refresh tokens
  - `AuthResponse`: Complete login response structure

### 2. Enhanced Authentication Service (`src/services/auth.ts`)
- **Token Management**:
  - Added methods for handling access/refresh tokens separately
  - Implemented token expiry tracking
  - Added automatic token refresh functionality
- **User Data Processing**:
  - Added `processUserData()` to handle field mapping and date conversion
  - Maps `isEmailVerified` to `emailVerified` for compatibility
  - Converts string dates to Date objects
- **API Updates**:
  - Updated login/register to handle new response format
  - Enhanced logout to send refresh token to backend
  - Improved `getCurrentUser()` with automatic token refresh

### 3. Updated API Service (`src/services/api.ts`)
- **Smart Token Management**:
  - Request interceptor checks both new and legacy token storage
  - Response interceptor handles 401 errors with automatic refresh
  - Prevents infinite loops on refresh endpoint failures
- **Enhanced Error Handling**:
  - Automatic retry of failed requests after token refresh
  - Proper cleanup when refresh fails
  - Graceful redirect to login page

### 4. Enhanced Auth Store (`src/stores/auth.ts`)
- Updated computed properties to handle both `isEmailVerified` and `emailVerified`
- Added `refreshTokens()` method for manual token refresh
- Added `getTokensInfo()` for token status inspection
- Exported new functionality in store interface

## Backend Response Handling
The system now properly processes this login response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6qBjTIxVX9SurecUXesr",
      "email": "pntoan@gmail.com",
      "name": "Toản",
      "isEmailVerified": false,
      "role": "user",
      "createdAt": "2025-06-13T03:25:01.418Z",
      "updatedAt": "2025-06-13T04:37:02.094Z",
      "lastLoginAt": "2025-06-13T04:37:02.094Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    },
    "isNewUser": false
  }
}
```

## Key Features
1. **Automatic Token Refresh**: API calls automatically refresh expired tokens
2. **Backward Compatibility**: Works with existing components using legacy field names
3. **Robust Error Handling**: Graceful fallback when authentication fails
4. **Secure Storage**: Proper token storage with expiry tracking
5. **Session Persistence**: User sessions survive page refreshes

## Recent Changes - API Service Standardization

### 1. Problem Identified
- **ApiService** already extracts `data` from API responses (`return response.data.data as T`)
- **Auth Service** correctly uses ApiService and gets clean data
- **Other services** (memories, notes, files, anniversaries, reminders) were using raw `api` instance
- This caused inconsistent response handling - some services returned full response objects, others returned clean data

### 2. Services Updated

#### **Memories Service** ([`src/services/memories.ts`](src/services/memories.ts:1))
- Changed import from raw `api` to `ApiService`
- Removed `ApiResponse<T>` wrappers from return types
- Updated all methods to use `ApiService` and return clean data directly

#### **Notes Service** ([`src/services/notes.ts`](src/services/notes.ts:1))
- Changed import from raw `api` to `ApiService`
- Removed `ApiResponse<T>` wrappers from return types
- Updated all methods to use `ApiService` and return clean data directly

#### **Files Service** ([`src/services/files.ts`](src/services/files.ts:1))
- Already used `ApiService` but expected nested data structure
- Fixed interface definitions to match ApiService's clean data extraction
- Removed `.data` property access from response handling

#### **Anniversaries Service** ([`src/services/anniversaries.ts`](src/services/anniversaries.ts:1))
- Changed import from raw `api` to `ApiService`
- Removed `ApiResponse<T>` wrappers from return types
- Updated all methods to use `ApiService` and return clean data directly

#### **Reminders Service** ([`src/services/reminders.ts`](src/services/reminders.ts:1))
- Changed import from raw `api` to `ApiService`
- Removed `ApiResponse<T>` wrappers from return types
- Updated all methods to use `ApiService` and return clean data directly

### 3. Benefits Achieved
1. **Consistent Response Handling**: All services now return clean data without nested structures
2. **Type Safety**: Better TypeScript support with accurate return types
3. **Simplified Usage**: Components no longer need to extract data from response wrappers
4. **Maintainability**: Single source of truth for API response handling in ApiService

## Next Steps
- Test all service methods to ensure they work correctly with updated response handling
- Update any components that might expect the old `ApiResponse<T>` format
- Consider adding JSDoc comments to clarify the new clean response format
- Verify error handling still works correctly across all services

## Testing Recommendations
1. Test each service's CRUD operations
2. Verify error handling works correctly
3. Check component integration with updated response formats
4. Ensure pagination and filtering still work properly
5. Test file upload/download functionality