# Love App Backend API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Most endpoints require Bearer token authentication:
```bash
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Routes (`/api/v1/auth`)

### Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseIdToken": "your-firebase-id-token",
    "deviceInfo": {
      "platform": "web",
      "version": "1.0.0",
      "deviceId": "device-123"
    }
  }'
```

### Login User
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseIdToken": "your-firebase-id-token",
    "deviceInfo": {
      "platform": "web",
      "version": "1.0.0",
      "deviceId": "device-123"
    }
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token"
  }'
```

### Reset Password
```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "redirectUrl": "https://yourapp.com/reset"
  }'
```

### Verify Firebase Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseIdToken": "your-firebase-id-token"
  }'
```

### Logout (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token",
    "allDevices": false
  }'
```

### Get Profile (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Update Profile (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "bio": "New bio"
  }'
```

### Get Session Info (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/auth/session \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Revoke All Sessions (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/auth/revoke-sessions \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Auth Stats (Admin Only)
```bash
curl -X GET http://localhost:3000/api/v1/auth/stats \
  -H "Authorization: Bearer <admin-jwt-token>"
```

### Health Check
```bash
curl -X GET http://localhost:3000/api/v1/auth/health
```

---

## 👤 User Routes (`/api/v1/users`)

### Health Check
```bash
curl -X GET http://localhost:3000/api/v1/users/health
```

### Get Current User Profile (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Update User Profile (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "bio": "Love sharing memories",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }'
```

### Update User Preferences (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/users/preferences \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "en",
    "timezone": "UTC",
    "dateFormat": "DD/MM/YYYY",
    "timeFormat": "24h",
    "notifications": {
      "email": {
        "enabled": true,
        "reminders": true,
        "anniversaries": true
      },
      "push": {
        "enabled": true,
        "reminders": true
      }
    }
  }'
```

### Upload Profile Picture (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/users/profile-picture \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "profilePicture=@/path/to/image.jpg"
```

### Delete Profile Picture (Protected)
```bash
curl -X DELETE http://localhost:3000/api/v1/users/profile-picture \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get User Statistics (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/users/stats \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get User by ID (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/users/user-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Delete User Account (Protected)
```bash
curl -X DELETE http://localhost:3000/api/v1/users/account \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## 💭 Memory Routes (`/api/v1/memories`)

### Create Memory (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/memories \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Our First Date",
    "description": "Amazing dinner at the beach",
    "memoryDate": "2023-02-14",
    "location": "Beach Restaurant",
    "tags": ["romantic", "dinner", "beach"],
    "isPrivate": false
  }'
```

### Get Memories List (Protected)
```bash
# Basic list
curl -X GET http://localhost:3000/api/v1/memories \
  -H "Authorization: Bearer <your-jwt-token>"

# With filters
curl -X GET "http://localhost:3000/api/v1/memories?page=1&limit=10&tags=romantic&startDate=2023-01-01&endDate=2023-12-31" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Memory Statistics (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/memories/stats \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Shared Memories (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/memories/shared \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Memory by ID (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/memories/memory-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Update Memory (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/memories/memory-123 \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Memory Title",
    "description": "Updated description",
    "tags": ["updated", "memory"]
  }'
```

### Delete Memory (Protected)
```bash
curl -X DELETE http://localhost:3000/api/v1/memories/memory-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Share Memory with Partner (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/memories/memory-123/share \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "partnerId": "partner-user-id",
    "message": "Sharing this beautiful memory with you!"
  }'
```

### Toggle Memory Favorite (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/memories/memory-123/favorite \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Add File to Memory (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/memories/memory-123/files \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "file-123",
    "description": "Photo from our date"
  }'
```

---

## 📝 Note Routes (`/api/v1/notes`)

### Health Check
```bash
curl -X GET http://localhost:3000/api/v1/notes/health
```

### Get Notes Statistics (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/notes/stats \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Search Notes (Protected)
```bash
curl -X GET "http://localhost:3000/api/v1/notes/search?q=love&category=personal" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Notes by Category (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/notes/category/personal \
  -H "Authorization: Bearer <your-jwt-token>"
```

### List Notes (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/notes \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Create Note (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/notes \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Love Note",
    "content": "Just wanted to tell you how much I love you",
    "category": "romantic",
    "tags": ["love", "romantic", "sweet"],
    "isPrivate": false
  }'
```

### Get Note by ID (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/notes/note-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Update Note (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/notes/note-123 \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Love Note",
    "content": "Updated content with more love",
    "tags": ["updated", "love"]
  }'
```

### Delete Note (Protected)
```bash
curl -X DELETE http://localhost:3000/api/v1/notes/note-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## 🔔 Reminder Routes (`/api/v1/reminders`)

### Health Check
```bash
curl -X GET http://localhost:3000/api/v1/reminders/health
```

### Get Reminders Statistics (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/reminders/stats \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Upcoming Reminders (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/reminders/upcoming \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Overdue Reminders (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/reminders/overdue \
  -H "Authorization: Bearer <your-jwt-token>"
```

### List Reminders (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/reminders \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Create Reminder (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/reminders \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Anniversary Reminder",
    "description": "Remember to plan something special",
    "reminderDate": "2024-02-14T18:00:00Z",
    "priority": "high",
    "repeat": "yearly"
  }'
```

### Get Reminder by ID (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/reminders/reminder-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Update Reminder (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/reminders/reminder-123 \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Reminder",
    "priority": "medium",
    "reminderDate": "2024-02-14T19:00:00Z"
  }'
```

### Mark Reminder as Completed (Protected)
```bash
curl -X PATCH http://localhost:3000/api/v1/reminders/reminder-123/complete \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Delete Reminder (Protected)
```bash
curl -X DELETE http://localhost:3000/api/v1/reminders/reminder-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## 🎉 Anniversary Routes (`/api/v1/anniversaries`)

### Health Check
```bash
curl -X GET http://localhost:3000/api/v1/anniversaries/health
```

### Get Anniversaries Statistics (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/anniversaries/stats \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Upcoming Anniversaries (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/anniversaries/upcoming \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Anniversaries by Type (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/anniversaries/type/relationship \
  -H "Authorization: Bearer <your-jwt-token>"
```

### List Anniversaries (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/anniversaries \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Create Anniversary (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/anniversaries \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Our First Anniversary",
    "description": "The day we officially became a couple",
    "date": "2023-02-14",
    "type": "relationship",
    "isRecurring": true,
    "frequency": "yearly"
  }'
```

### Get Anniversary by ID (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/anniversaries/anniversary-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Update Anniversary (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/anniversaries/anniversary-123 \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Anniversary Title",
    "description": "Updated description",
    "type": "milestone"
  }'
```

### Delete Anniversary (Protected)
```bash
curl -X DELETE http://localhost:3000/api/v1/anniversaries/anniversary-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## 📁 File Routes (`/api/v1/files`)

### Upload Single File (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/files/upload \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "file=@/path/to/your/file.jpg"
```

### Upload Multiple Files (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/files/upload/multiple \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "files=@/path/to/file1.jpg" \
  -F "files=@/path/to/file2.png" \
  -F "files=@/path/to/file3.pdf"
```

### Upload with Streaming (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/files/upload/stream \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "file=@/path/to/large-file.mp4"
```

### Upload Multiple Field Types (Protected)
```bash
curl -X POST http://localhost:3000/api/v1/files/upload/fields \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.png" \
  -F "documents=@/path/to/doc.pdf" \
  -F "avatar=@/path/to/avatar.jpg"
```

### View/Stream File (Public)
```bash
curl -X GET http://localhost:3000/api/v1/files/view/file-123
```

### Download File (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/files/file-123/download \
  -H "Authorization: Bearer <your-jwt-token>" \
  -o downloaded-file.jpg
```

### Stream File (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/files/file-123/stream \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Download URL (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/files/file-123/url \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get File Info (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/files/file-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get User Files (Protected)
```bash
curl -X GET http://localhost:3000/api/v1/files/user/user-123 \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Search Files (Protected)
```bash
curl -X GET "http://localhost:3000/api/v1/files/search?type=image&limit=10&page=1" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Update File Metadata (Protected)
```bash
curl -X PUT http://localhost:3000/api/v1/files/file-123 \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated File Name",
    "description": "Updated description",
    "tags": ["updated", "photo"]
  }'
```

---

## 🏥 Health Check

### Global Health Check
```bash
curl -X GET http://localhost:3000/health
```

---

## 📋 Common Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "statusCode": 400
  }
}
```

---

## 🔑 Authentication Flow

1. **Register/Login**: Get Firebase ID token and exchange for JWT
2. **Store JWT**: Use the returned access token for protected routes
3. **Refresh**: Use refresh token when access token expires
4. **Logout**: Invalidate tokens when done

## 📝 Notes

- All protected routes require `Authorization: Bearer <token>` header
- File uploads use `multipart/form-data` content type
- Dates should be in ISO 8601 format
- Rate limiting is applied on upload, download, and sharing endpoints
- Large files support streaming upload/download 