# Memory API - cURL Examples & Responses

This document provides comprehensive cURL examples for all Memory API endpoints along with their expected responses.

## Table of Contents
- [Authentication](#authentication)
- [Create Memory](#create-memory)
- [Get Memories List](#get-memories-list)
- [Get Memory Statistics](#get-memory-statistics)
- [Get Shared Memories](#get-shared-memories)
- [Get Specific Memory](#get-specific-memory)
- [Update Memory](#update-memory)
- [Delete Memory](#delete-memory)
- [Share Memory](#share-memory)
- [Toggle Favorite](#toggle-favorite)
- [Add File to Memory](#add-file-to-memory)

## Authentication

All endpoints require Bearer token authentication. Replace `<your_token>` with your actual JWT token.

---

## Create Memory

**Endpoint:** `POST /api/v1/memories`

### cURL Command
```bash
curl -X POST http://localhost:3000/api/v1/memories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "title": "Our First Date",
    "content": "We went to the park and had a wonderful time together. The weather was perfect and we talked for hours.",
    "date": "2024-01-15",
    "location": "Central Park, NYC",
    "tags": ["date", "romantic", "park"],
    "isShared": false
  }'
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "memory": {
      "id": "memory_64f8a1b2c3d4e5f6789",
      "title": "Our First Date",
      "content": "We went to the park and had a wonderful time together. The weather was perfect and we talked for hours.",
      "date": "2024-01-15",
      "location": "Central Park, NYC",
      "tags": ["date", "romantic", "park"],
      "isShared": false,
      "isFavorite": false,
      "userId": "user_123456789",
      "createdAt": "2024-01-16T10:30:00.000Z",
      "updatedAt": "2024-01-16T10:30:00.000Z"
    }
  },
  "message": "Memory created successfully"
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

---

## Get Memories List

**Endpoint:** `GET /api/v1/memories`

### cURL Command (Basic)
```bash
curl -X GET http://localhost:3000/api/v1/memories \
  -H "Authorization: Bearer <your_token>"
```

### cURL Command (With Filters)
```bash
curl -X GET "http://localhost:3000/api/v1/memories?page=1&limit=5&search=park&tags=romantic,date&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer <your_token>"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "memories": [
      {
        "id": "memory_64f8a1b2c3d4e5f6789",
        "title": "Our First Date",
        "content": "We went to the park and had a wonderful time...",
        "date": "2024-01-15",
        "location": "Central Park, NYC",
        "tags": ["date", "romantic", "park"],
        "isShared": false,
        "isFavorite": true,
        "fileCount": 3,
        "createdAt": "2024-01-16T10:30:00.000Z",
        "updatedAt": "2024-01-16T10:30:00.000Z"
      },
      {
        "id": "memory_64f8a1b2c3d4e5f6790",
        "title": "Anniversary Dinner",
        "content": "Celebrated our 1-year anniversary at that fancy restaurant...",
        "date": "2024-02-14",
        "location": "Le Bernardin, NYC",
        "tags": ["anniversary", "dinner", "romantic"],
        "isShared": true,
        "isFavorite": false,
        "fileCount": 1,
        "createdAt": "2024-02-15T20:15:00.000Z",
        "updatedAt": "2024-02-15T20:15:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 15,
      "totalItems": 73,
      "itemsPerPage": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## Get Memory Statistics

**Endpoint:** `GET /api/v1/memories/stats`

### cURL Command
```bash
curl -X GET http://localhost:3000/api/v1/memories/stats \
  -H "Authorization: Bearer <your_token>"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "totalMemories": 150,
    "sharedMemories": 45,
    "favoriteMemories": 25,
    "memoriesThisMonth": 8,
    "memoriesThisYear": 89,
    "averageMemoriesPerMonth": 12.5,
    "mostUsedTags": [
      {
        "tag": "romantic",
        "count": 32
      },
      {
        "tag": "date",
        "count": 28
      },
      {
        "tag": "anniversary",
        "count": 15
      },
      {
        "tag": "travel",
        "count": 12
      },
      {
        "tag": "family",
        "count": 8
      }
    ],
    "memoryCountByMonth": {
      "2024-01": 12,
      "2024-02": 15,
      "2024-03": 10,
      "2024-04": 14,
      "2024-05": 16,
      "2024-06": 8
    }
  }
}
```

---

## Get Shared Memories

**Endpoint:** `GET /api/v1/memories/shared`

### cURL Command
```bash
curl -X GET "http://localhost:3000/api/v1/memories/shared?page=1&limit=10" \
  -H "Authorization: Bearer <your_token>"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "memories": [
      {
        "id": "memory_64f8a1b2c3d4e5f6790",
        "title": "Anniversary Dinner",
        "content": "Celebrated our 1-year anniversary at that fancy restaurant...",
        "date": "2024-02-14",
        "location": "Le Bernardin, NYC",
        "tags": ["anniversary", "dinner", "romantic"],
        "isShared": true,
        "isFavorite": false,
        "sharedBy": {
          "id": "user_partner123",
          "fullName": "Jane Smith",
          "avatar": "https://example.com/avatars/jane.jpg"
        },
        "sharedAt": "2024-02-15T21:00:00.000Z",
        "createdAt": "2024-02-15T20:15:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## Get Specific Memory

**Endpoint:** `GET /api/v1/memories/:id`

### cURL Command
```bash
curl -X GET http://localhost:3000/api/v1/memories/memory_64f8a1b2c3d4e5f6789 \
  -H "Authorization: Bearer <your_token>"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "memory": {
      "id": "memory_64f8a1b2c3d4e5f6789",
      "title": "Our First Date",
      "content": "We went to the park and had a wonderful time together. The weather was perfect and we talked for hours. I knew from that moment that you were special.",
      "date": "2024-01-15",
      "location": "Central Park, NYC",
      "tags": ["date", "romantic", "park", "first"],
      "isShared": false,
      "isFavorite": true,
      "files": [
        {
          "id": "file_123abc",
          "filename": "first_date_selfie.jpg",
          "mimeType": "image/jpeg",
          "size": 1024000,
          "url": "https://minio.example.com/memories/first_date_selfie.jpg",
          "uploadedAt": "2024-01-16T10:35:00.000Z"
        },
        {
          "id": "file_456def",
          "filename": "park_view.jpg",
          "mimeType": "image/jpeg",
          "size": 2048000,
          "url": "https://minio.example.com/memories/park_view.jpg",
          "uploadedAt": "2024-01-16T10:37:00.000Z"
        }
      ],
      "userId": "user_123456789",
      "createdAt": "2024-01-16T10:30:00.000Z",
      "updatedAt": "2024-01-16T11:45:00.000Z"
    }
  }
}
```

### Error Response (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "MEMORY_NOT_FOUND",
    "message": "Memory not found"
  }
}
```

---

## Update Memory

**Endpoint:** `PUT /api/v1/memories/:id`

### cURL Command
```bash
curl -X PUT http://localhost:3000/api/v1/memories/memory_64f8a1b2c3d4e5f6789 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "title": "Our Amazing First Date",
    "content": "We went to the park and had a wonderful time together. The weather was perfect and we talked for hours. I knew from that moment that you were special to me.",
    "location": "Central Park, New York City",
    "tags": ["date", "romantic", "park", "first", "special"]
  }'
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "memory": {
      "id": "memory_64f8a1b2c3d4e5f6789",
      "title": "Our Amazing First Date",
      "content": "We went to the park and had a wonderful time together. The weather was perfect and we talked for hours. I knew from that moment that you were special to me.",
      "date": "2024-01-15",
      "location": "Central Park, New York City",
      "tags": ["date", "romantic", "park", "first", "special"],
      "isShared": false,
      "isFavorite": true,
      "userId": "user_123456789",
      "createdAt": "2024-01-16T10:30:00.000Z",
      "updatedAt": "2024-01-16T14:22:00.000Z"
    }
  },
  "message": "Memory updated successfully"
}
```

---

## Delete Memory

**Endpoint:** `DELETE /api/v1/memories/:id`

### cURL Command
```bash
curl -X DELETE http://localhost:3000/api/v1/memories/memory_64f8a1b2c3d4e5f6789 \
  -H "Authorization: Bearer <your_token>"
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Memory deleted successfully"
}
```

### Error Response (403 Forbidden)
```json
{
  "success": false,
  "error": {
    "code": "ACCESS_DENIED",
    "message": "You don't have permission to delete this memory"
  }
}
```

---

## Share Memory

**Endpoint:** `POST /api/v1/memories/:id/share`

### cURL Command
```bash
curl -X POST http://localhost:3000/api/v1/memories/memory_64f8a1b2c3d4e5f6789/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "partnerId": "user_partner123",
    "message": "I wanted to share this special memory with you. It was such a perfect day!"
  }'
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "memory": {
      "id": "memory_64f8a1b2c3d4e5f6789",
      "isShared": true,
      "sharedWith": "user_partner123",
      "sharedAt": "2024-01-16T15:30:00.000Z"
    }
  },
  "message": "Memory shared successfully"
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "MEMORY_ALREADY_SHARED",
    "message": "This memory is already shared with the specified partner"
  }
}
```

---

## Toggle Favorite

**Endpoint:** `POST /api/v1/memories/:id/favorite`

### cURL Command
```bash
curl -X POST http://localhost:3000/api/v1/memories/memory_64f8a1b2c3d4e5f6789/favorite \
  -H "Authorization: Bearer <your_token>"
```

### Response (200 OK) - Adding to Favorites
```json
{
  "success": true,
  "data": {
    "isFavorite": true
  },
  "message": "Memory added to favorites"
}
```

### Response (200 OK) - Removing from Favorites
```json
{
  "success": true,
  "data": {
    "isFavorite": false
  },
  "message": "Memory removed from favorites"
}
```

---

## Add File to Memory

**Endpoint:** `POST /api/v1/memories/:id/files`

### cURL Command
```bash
curl -X POST http://localhost:3000/api/v1/memories/memory_64f8a1b2c3d4e5f6789/files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "fileId": "file_789ghi",
    "description": "A beautiful sunset photo from our walk in the park"
  }'
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_789ghi",
      "filename": "sunset_walk.jpg",
      "mimeType": "image/jpeg",
      "size": 1536000,
      "description": "A beautiful sunset photo from our walk in the park",
      "addedAt": "2024-01-16T16:15:00.000Z"
    }
  },
  "message": "File added to memory successfully"
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "FILE_ALREADY_ATTACHED",
    "message": "This file is already attached to the memory"
  }
}
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "ACCESS_DENIED",
    "message": "You don't have permission to access this resource"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found"
  }
}
```

### 422 Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title must be between 1 and 200 characters"
      },
      {
        "field": "content",
        "message": "Content is required"
      }
    ]
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Notes

1. **Base URL**: Replace `http://localhost:3000` with your actual server URL in production.

2. **Authentication**: All endpoints require a valid JWT token in the Authorization header.

3. **Content-Type**: Use `application/json` for JSON requests.

4. **Pagination**: List endpoints support pagination with `page` and `limit` query parameters.

5. **Filtering**: The memories list endpoint supports various filters including search, tags, and date ranges.

6. **File Management**: Files must be uploaded separately using the File API before being attached to memories.

7. **Rate Limiting**: API may have rate limiting in place. Check response headers for rate limit information.

8. **Error Handling**: Always check the `success` field in responses to determine if the request was successful.
