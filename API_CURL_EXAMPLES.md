# API cURL Examples

Replace `{{TOKEN}}` with your actual Bearer token.

---

## Auth

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","fullName":"John Doe"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your_refresh_token"}'
```

### Reset Password
```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Verify Firebase Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{"token":"firebase_token_here"}'
```

### Logout
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"everywhere":false}'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"New Name"}'
```

---

## Anniversaries

### Health Check
```bash
curl -X GET http://localhost:3000/api/v1/anniversaries/health
```

### Get Stats
```bash
curl -X GET http://localhost:3000/api/v1/anniversaries/stats \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Upcoming Anniversaries
```bash
curl -X GET "http://localhost:3000/api/v1/anniversaries/upcoming?days=30&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Anniversaries by Type
```bash
curl -X GET "http://localhost:3000/api/v1/anniversaries/type/relationship?page=1&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### List Anniversaries
```bash
curl -X GET "http://localhost:3000/api/v1/anniversaries?page=1&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Create Anniversary
```bash
curl -X POST http://localhost:3000/api/v1/anniversaries \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Our First Date","date":"2023-02-14","type":"relationship"}'
```

### Get Anniversary by ID
```bash
curl -X GET http://localhost:3000/api/v1/anniversaries/{anniversaryId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Update Anniversary
```bash
curl -X PUT http://localhost:3000/api/v1/anniversaries/{anniversaryId} \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'
```

### Delete Anniversary
```bash
curl -X DELETE http://localhost:3000/api/v1/anniversaries/{anniversaryId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

## Memories

### Create Memory
```bash
curl -X POST http://localhost:3000/api/v1/memories \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Our First Date","content":"We went to the park..."}'
```

### List Memories
```bash
curl -X GET "http://localhost:3000/api/v1/memories?page=1&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Memory Stats
```bash
curl -X GET http://localhost:3000/api/v1/memories/stats \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Shared Memories
```bash
curl -X GET http://localhost:3000/api/v1/memories/shared \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Memory by ID
```bash
curl -X GET http://localhost:3000/api/v1/memories/{id} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Update Memory
```bash
curl -X PUT http://localhost:3000/api/v1/memories/{id} \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Memory"}'
```

### Delete Memory
```bash
curl -X DELETE http://localhost:3000/api/v1/memories/{id} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Share Memory
```bash
curl -X POST http://localhost:3000/api/v1/memories/{id}/share \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"partnerId":"partner123","message":"I wanted to share this memory"}'
```

### Toggle Favorite
```bash
curl -X POST http://localhost:3000/api/v1/memories/{id}/favorite \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Add File to Memory
```bash
curl -X POST http://localhost:3000/api/v1/memories/{id}/files \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"fileId":"file123"}'
```

---

## Notes

### Health Check
```bash
curl -X GET http://localhost:3000/api/v1/notes/health
```

### Get Notes Stats
```bash
curl -X GET http://localhost:3000/api/v1/notes/stats \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Search Notes
```bash
curl -X GET "http://localhost:3000/api/v1/notes/search?q=important&page=1&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Notes by Category
```bash
curl -X GET "http://localhost:3000/api/v1/notes/category/personal?page=1&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### List Notes
```bash
curl -X GET "http://localhost:3000/api/v1/notes?page=1&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Create Note
```bash
curl -X POST http://localhost:3000/api/v1/notes \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Sample Note","content":"This is a note."}'
```

### Get Note by ID
```bash
curl -X GET http://localhost:3000/api/v1/notes/{noteId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Update Note
```bash
curl -X PUT http://localhost:3000/api/v1/notes/{noteId} \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Note"}'
```

### Delete Note
```bash
curl -X DELETE http://localhost:3000/api/v1/notes/{noteId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

## Reminders

### Health Check
```bash
curl -X GET http://localhost:3000/api/v1/reminders/health
```

### Get Reminders Stats
```bash
curl -X GET http://localhost:3000/api/v1/reminders/stats \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Upcoming Reminders
```bash
curl -X GET "http://localhost:3000/api/v1/reminders/upcoming?hours=24&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Overdue Reminders
```bash
curl -X GET "http://localhost:3000/api/v1/reminders/overdue?page=1&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### List Reminders
```bash
curl -X GET "http://localhost:3000/api/v1/reminders?page=1&limit=10" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Create Reminder
```bash
curl -X POST http://localhost:3000/api/v1/reminders \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Anniversary Dinner","dueDate":"2025-02-14T18:00:00Z"}'
```

### Get Reminder by ID
```bash
curl -X GET http://localhost:3000/api/v1/reminders/{reminderId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Update Reminder
```bash
curl -X PUT http://localhost:3000/api/v1/reminders/{reminderId} \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Reminder"}'
```

### Mark Reminder as Completed
```bash
curl -X PATCH http://localhost:3000/api/v1/reminders/{reminderId}/complete \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"completedAt":"2025-02-14T20:00:00Z"}'
```

### Delete Reminder
```bash
curl -X DELETE http://localhost:3000/api/v1/reminders/{reminderId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

## Couple Invitations

### Get Received Invitations
```bash
curl -X GET http://localhost:3000/api/v1/couple-invitations \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Sent Invitations
```bash
curl -X GET http://localhost:3000/api/v1/couple-invitations/sent \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Send Invitation
```bash
curl -X POST http://localhost:3000/api/v1/couple-invitations \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"toUserId":"user123","message":"Would you like to be my partner?"}'
```

### Accept Invitation
```bash
curl -X POST http://localhost:3000/api/v1/couple-invitations/{invitationId}/accept \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Reject Invitation
```bash
curl -X POST http://localhost:3000/api/v1/couple-invitations/{invitationId}/reject \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Not ready"}'
```

### Get Invitation Details
```bash
curl -X GET http://localhost:3000/api/v1/couple-invitations/{invitationId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Cancel Invitation
```bash
curl -X DELETE http://localhost:3000/api/v1/couple-invitations/{invitationId}/cancel \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Invitation Stats
```bash
curl -X GET http://localhost:3000/api/v1/couple-invitations/stats \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

## Couples

### Get Couple Profile
```bash
curl -X GET http://localhost:3000/api/v1/couple/profile \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Update Couple Profile
```bash
curl -X PUT http://localhost:3000/api/v1/couple/profile \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"coupleNickname":"The Dream Team"}'
```

### Get Partner Info
```bash
curl -X GET http://localhost:3000/api/v1/couple/partner \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Couple Stats
```bash
curl -X GET http://localhost:3000/api/v1/couple/stats \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Couple Status
```bash
curl -X GET http://localhost:3000/api/v1/couple/status \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Disconnect Couple
```bash
curl -X POST http://localhost:3000/api/v1/couple/disconnect \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Need some space"}'
```

### Reconnect Couple
```bash
curl -X POST http://localhost:3000/api/v1/couple/reconnect \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"message":"I miss you"}'
```

### Update Couple Preferences
```bash
curl -X PUT http://localhost:3000/api/v1/couple/preferences \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"notifications":{"anniversaryReminders":true}}'
```

---

## Files

### Upload File
```bash
curl -X POST http://localhost:3000/api/v1/files/upload \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "file=@/path/to/your/file.jpg"
```

### Upload Multiple Files
```bash
curl -X POST http://localhost:3000/api/v1/files/upload/multiple \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "files=@/path/to/file1.jpg" \
  -F "files=@/path/to/file2.jpg"
```

### Upload File via Stream
```bash
curl -X POST http://localhost:3000/api/v1/files/upload/stream \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "file=@/path/to/largefile.zip"
```

### Upload Files by Fields
```bash
curl -X POST http://localhost:3000/api/v1/files/upload/fields \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "images=@/path/to/image1.jpg" \
  -F "documents=@/path/to/doc1.pdf"
```

### List Files
```bash
curl -X GET http://localhost:3000/api/v1/files \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Search Files
```bash
curl -X GET "http://localhost:3000/api/v1/files/search?q=photo" \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get File Stats
```bash
curl -X GET http://localhost:3000/api/v1/files/stats \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get User Files
```bash
curl -X GET http://localhost:3000/api/v1/files/user/{userId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get File by ID
```bash
curl -X GET http://localhost:3000/api/v1/files/{id} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Update File
```bash
curl -X PUT http://localhost:3000/api/v1/files/{id} \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated File"}'
```

### Delete File
```bash
curl -X DELETE http://localhost:3000/api/v1/files/{id} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Share File
```bash
curl -X POST http://localhost:3000/api/v1/files/{id}/share \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Access Shared File
```bash
curl -X GET http://localhost:3000/api/v1/files/shared/{token}"
```

### Batch File Operations
```bash
curl -X POST http://localhost:3000/api/v1/files/batch \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"operation":"delete","fileIds":["id1","id2"]}'
```

### Process Image
```bash
curl -X POST http://localhost:3000/api/v1/files/{id}/process \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Upload Progress
```bash
curl -X GET http://localhost:3000/api/v1/files/upload/progress/{uploadId}
```

### View File (Public)
```bash
curl -X GET http://localhost:3000/api/v1/files/view/{id}
```

### Download File
```bash
curl -X GET http://localhost:3000/api/v1/files/{id}/download \
  -H "Authorization: Bearer {{TOKEN}}" \
  -o output_file
```

### Stream File
```bash
curl -X GET http://localhost:3000/api/v1/files/{id}/stream \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Temporary Download URL
```bash
curl -X GET http://localhost:3000/api/v1/files/{id}/url \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

## Notifications

### Get Notifications
```bash
curl -X GET http://localhost:3000/api/v1/notifications \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Unread Count
```bash
curl -X GET http://localhost:3000/api/v1/notifications/unread-count \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Notification Stats
```bash
curl -X GET http://localhost:3000/api/v1/notifications/stats \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Mark All as Read
```bash
curl -X PATCH http://localhost:3000/api/v1/notifications/mark-all-read \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Notifications by Type
```bash
curl -X GET http://localhost:3000/api/v1/notifications/type/{type} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Pending Notifications (Admin)
```bash
curl -X GET http://localhost:3000/api/v1/notifications/pending \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Create Notification (Admin)
```bash
curl -X POST http://localhost:3000/api/v1/notifications \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Notification"}'
```

### Get Notification by ID
```bash
curl -X GET http://localhost:3000/api/v1/notifications/{notificationId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Mark Notification as Read
```bash
curl -X PATCH http://localhost:3000/api/v1/notifications/{notificationId}/read \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Archive Notification
```bash
curl -X PUT http://localhost:3000/api/v1/notifications/{notificationId}/archive \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Delete Notification
```bash
curl -X DELETE http://localhost:3000/api/v1/notifications/{notificationId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Update Delivery Status (Admin)
```bash
curl -X PUT http://localhost:3000/api/v1/notifications/{notificationId}/delivery-status \
  -H "Authorization: Bearer {{TOKEN}}"
```

---

## Partnerships

### Get Partnerships
```bash
curl -X GET http://localhost:3000/api/v1/partnerships \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Create Partnership
```bash
curl -X POST http://localhost:3000/api/v1/partnerships \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"partnerUserId":"user456"}'
```

### Update Partnership Settings
```bash
curl -X PUT http://localhost:3000/api/v1/partnerships/settings \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"shareCalendar":true}'
```

### Update Partnership Status
```bash
curl -X PATCH http://localhost:3000/api/v1/partnerships/status \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"status":"paused"}'
```

### Get Partnership Activities
```bash
curl -X GET http://localhost:3000/api/v1/partnerships/activities \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Partnership Statistics
```bash
curl -X GET http://localhost:3000/api/v1/partnerships/statistics \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get Partnership Milestones
```bash
curl -X GET http://localhost:3000/api/v1/partnerships/milestones \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Leave Partnership
```bash
curl -X POST http://localhost:3000/api/v1/partnerships/{partnershipId}/leave \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Moving on"}'
```

---

## Users

### Health Check
```bash
curl -X GET http://localhost:3000/api/v1/users/health
```

### Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Updated Name"}'
```

### Update Preferences
```bash
curl -X PUT http://localhost:3000/api/v1/users/preferences \
  -H "Authorization: Bearer {{TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"theme":"dark"}'
```

### Upload Profile Picture
```bash
curl -X POST http://localhost:3000/api/v1/users/profile-picture \
  -H "Authorization: Bearer {{TOKEN}}" \
  -F "profilePicture=@/path/to/avatar.jpg"
```

### Delete Profile Picture
```bash
curl -X DELETE http://localhost:3000/api/v1/users/profile-picture \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get User Stats
```bash
curl -X GET http://localhost:3000/api/v1/users/stats \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Get User by ID
```bash
curl -X GET http://localhost:3000/api/v1/users/{userId} \
  -H "Authorization: Bearer {{TOKEN}}"
```

### Delete Account
```bash
curl -X DELETE http://localhost:3000/api/v1/users/account \
  -H "Authorization: Bearer {{TOKEN}}"
