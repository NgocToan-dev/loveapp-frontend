# Troubleshooting Guide

## Common Issues and Solutions

### 1. Translation Warnings (Fixed)

**Issue**: Console shows warnings about missing translation keys:
```
[intlify] Not found 'nav.notes' key in 'vi' locale messages.
[intlify] Not found 'nav.reminders' key in 'vi' locale messages.
[intlify] Not found 'nav.anniversaries' key in 'vi' locale messages.
```

**Solution**: ✅ Fixed - Added missing translation keys to `src/plugins/i18n.ts`

### 2. API 404 Errors (Improved)

**Issue**: Console shows 404 errors when trying to fetch data:
```
GET http://localhost:3000/api/v1/files 404 (Not Found)
Error: Failed to fetch files
```

**Cause**: Backend server is not running or not available.

**Solutions**:

#### Option 1: Start the Backend Server
1. Make sure you have the backend server running on `http://localhost:3000`
2. The backend should provide the following endpoints:
   - `GET /api/v1/files` - Get files list
   - `POST /api/v1/files/upload` - Upload files
   - `GET /api/v1/memories` - Get memories
   - `GET /api/v1/notes` - Get notes
   - etc.

#### Option 2: Use Frontend in Demo Mode
✅ **Improved** - The application now gracefully handles backend unavailability:
- Files store sets empty state instead of crashing
- Error message indicates backend is unavailable
- Application continues to function for other features

#### Option 3: Mock the Backend
You can use tools like:
- **json-server**: Create a mock REST API
- **MSW (Mock Service Worker)**: Mock API calls in the browser
- **Postman Mock Server**: Create mock endpoints

### 3. Environment Configuration

**Check your `.env` file**:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**Verify the API base URL matches your backend server**:
- If backend runs on different port, update the URL
- If backend uses different API path, update accordingly

### 4. CORS Issues

If you see CORS errors, make sure your backend server:
1. Accepts requests from `http://localhost:5173` (Vite dev server)
2. Includes proper CORS headers
3. Allows the HTTP methods used by the frontend (GET, POST, PUT, DELETE)

### 5. Development Setup

**To run the application**:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**The application will work with limited functionality if backend is not available**:
- ✅ Navigation works
- ✅ Authentication UI works (though login won't work without backend)
- ✅ Static pages work (Home, About)
- ⚠️ Dynamic features require backend (Files, Memories, Notes, etc.)

### 6. Network Issues

If you're experiencing connection issues:

1. **Check if the backend is accessible**:
   ```bash
   curl http://localhost:3000/api/v1/health
   ```

2. **Verify network configuration**:
   - Make sure no firewall is blocking the connection
   - Check if any proxy settings are interfering

3. **Check browser console** for detailed error messages

### 7. Browser Compatibility

**Recommended browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**If you're using an older browser**:
- Update to a newer version
- Check browser console for JavaScript errors

## Quick Fixes Applied

✅ **Translation Keys**: Added missing navigation keys for notes, reminders, and anniversaries  
✅ **API Base URL**: Fixed version mismatch in API configuration  
✅ **Error Handling**: Improved error handling in files store to prevent app crashes  
✅ **Graceful Degradation**: App now works with limited functionality when backend is unavailable  

## Getting Help

If you continue to experience issues:
1. Check the browser console for errors
2. Verify your `.env` configuration
3. Ensure the backend server is running and accessible
4. Check network connectivity