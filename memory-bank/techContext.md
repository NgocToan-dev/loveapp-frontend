# Technical Context - LoveApp Frontend

## Authentication System

### Backend Response Format
The backend returns authentication responses in this format:
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

### Token Management
- **Access Token**: Short-lived (15 minutes), used for API authentication
- **Refresh Token**: Long-lived (7 days), used to get new access tokens
- **Automatic Refresh**: API service automatically refreshes expired tokens
- **Storage**: Tokens stored in localStorage with expiry tracking

### Frontend Implementation

#### Token Storage Keys
- `accessToken`: Current access token
- `refreshToken`: Refresh token for getting new access tokens
- `tokenExpiry`: Timestamp when access token expires
- `authToken`: Backward compatibility (same as accessToken)

#### Authentication Service Features
1. **Token Management**
   - `setTokens()`: Store tokens with expiry calculation
   - `clearTokens()`: Remove all authentication data
   - `isTokenExpired()`: Check if access token needs refresh
   - `refreshAccessToken()`: Get new tokens using refresh token

2. **User Data Processing**
   - Maps backend field `isEmailVerified` to frontend `emailVerified`
   - Converts date strings to Date objects
   - Handles optional fields like `displayName`, `lastLoginAt`

3. **API Integration**
   - Automatic token refresh on 401 errors
   - Retry failed requests with new tokens
   - Clear tokens and redirect on refresh failure

### API Service Configuration
- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Timeout**: 10 seconds for all requests
- **Headers**: Automatic Bearer token attachment
- **Error Handling**: Standardized ApiError format
- **File Upload**: Progress tracking and multipart/form-data support

### User Data Structure
The User interface supports both backend format and frontend compatibility:
```typescript
interface User {
  id: string
  email: string
  name: string
  displayName?: string
  isEmailVerified: boolean
  emailVerified?: boolean // Backward compatibility
  role: string
  createdAt: string | Date
  updatedAt: string | Date
  lastLoginAt?: string | Date
  // ... other optional fields
}
```

### State Management (Pinia)
- **Reactive State**: User data, loading states, errors
- **Computed Properties**: Authentication status, email verification
- **Actions**: Login, register, logout, profile updates
- **Token Refresh**: Exposed method for manual token refresh
- **Auto-initialization**: Restore user session on app start