# LoveApp Frontend - Project Brief

## Project Overview
LoveApp is a Vue.js-based frontend application for managing memories, notes, reminders, and anniversaries in romantic relationships. It provides a secure, user-friendly interface for couples to store and share their special moments.

## Core Requirements
- **Authentication System**: Secure login/register with JWT tokens
- **Memory Management**: Create, view, edit memories with file attachments
- **Notes System**: Personal and shared notes
- **Reminders**: Date-based reminders for important events
- **Anniversaries**: Track relationship milestones
- **File Management**: Upload and organize photos/documents
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack
- **Frontend**: Vue 3 + TypeScript + Vite
- **UI Framework**: Vuetify 3
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Routing**: Vue Router
- **Authentication**: JWT with refresh tokens
- **File Storage**: MinIO integration

## Current Status
The application has a complete authentication system that handles:
- User registration and login
- JWT access/refresh token management
- Automatic token refresh on API calls
- Secure token storage in localStorage
- User session management

## Key Features Implemented
1. **Authentication Flow**
   - Login/Register with email and password
   - JWT token-based authentication
   - Automatic token refresh
   - Session persistence

2. **Core Views**
   - Dashboard with user stats
   - Memory management (CRUD operations)
   - Notes system
   - File upload/management
   - User profile management

3. **Backend Integration**
   - RESTful API integration
   - Proper error handling
   - File upload with progress tracking
   - Automatic retry mechanisms