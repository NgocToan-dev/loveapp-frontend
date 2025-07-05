# Memory API: Chuyển từ FormData sang JSON

## Tóm tắt thay đổi

Đã chuyển đổi Memory API từ sử dụng FormData (multipart/form-data) sang JSON (application/json).

### 🔄 Backend Changes

#### 1. Routes (`src/routes/memory.ts`)
- ❌ **Removed**: `upload.array('images', 5)` middleware từ POST và PUT routes
- ✅ **Updated**: Validation schemas để xử lý JSON thay vì FormData
  - `tags`: từ `z.string().transform()` → `z.array(z.string())`
  - `isPrivate`: từ `z.string().transform()` → `z.boolean()`
  - `images`: từ multer files → `z.array(z.string())` (URLs)

#### 2. Controller (`src/controllers/memoryController.ts`)
- ❌ **Removed**: File upload logic (`req.files`, `fileService.uploadMultipleFiles`)
- ✅ **Updated**: Debug logs để hiển thị JSON data thay vì FormData
- ✅ **Changed**: `images` field giờ nhận array of URLs thay vì upload files

### 🔄 Frontend Changes

#### 1. Types (`src/types/index.ts`)
```typescript
// OLD
images?: File[]

// NEW  
images?: string[] // Array of image URLs
```

#### 2. Services (`src/services/memories.ts`)
- ❌ **Removed**: FormData creation logic
- ❌ **Removed**: `Content-Type: multipart/form-data` headers
- ✅ **Added**: Direct JSON payload
- ✅ **Added**: `Content-Type: application/json` headers

```typescript
// OLD
const formData = new FormData()
formData.append('title', data.title)
// ... more formData.append calls

// NEW
const response = await api.post('/memories', {
  title: data.title,
  description: data.description,
  content: data.content,
  date: data.date,
  tags: data.tags || [],
  location: data.location,
  mood: data.mood,
  isPrivate: data.isPrivate || false,
  images: data.images || []
})
```

### 📝 API Usage Examples

#### Create Memory
```json
POST /api/memories
Content-Type: application/json

{
  "title": "Our first date",
  "description": "Beautiful evening at the park",
  "content": "We had such a wonderful time...",
  "date": "2025-07-05",
  "tags": ["date", "romantic", "park"],
  "location": "Central Park",
  "mood": "love",
  "isPrivate": false,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

#### Update Memory
```json
PUT /api/memories/:id
Content-Type: application/json

{
  "title": "Updated title",
  "mood": "happy",
  "isPrivate": true,
  "images": [
    "https://example.com/new-image.jpg"
  ]
}
```

### ⚠️ Breaking Changes

1. **Image Handling**: 
   - Frontend phải upload images riêng biệt qua `/upload/image` endpoint
   - Memory chỉ lưu URLs thay vì handle file upload

2. **Form Component**: 
   - Cần update MemoryForm.vue để upload images trước khi submit
   - Convert File objects thành image URLs

### 🔧 Next Steps Required

1. **Update MemoryForm.vue**: 
   - Upload images qua `uploadImage()` service
   - Convert uploaded URLs vào form data

2. **Test API**: 
   - Verify JSON payloads
   - Test create/update flows

### 📋 Migration Notes

- Backward compatibility: Giữ `imageUrl` field trong model
- Upload endpoint vẫn available tại `/upload/image` 
- Frontend cần handle image upload flow riêng biệt

## 🎯 Benefits

1. **Simpler API**: JSON thay vì multipart data
2. **Better Debugging**: Easier to inspect requests
3. **Cleaner Code**: No FormData manipulation
4. **Type Safety**: Better TypeScript support
5. **Testing**: Easier to write API tests
