# Project Frontend - Vue 3 + TypeScript + Vite

## 🏗️ Kiến trúc Frontend
- **Framework**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **UI Framework**: Vuetify 3
- **HTTP Client**: Axios
- **Authentication**: JWT Token-based
- **Internationalization**: Vue I18n

## 📁 Cấu trúc dự án

```
src/
├── components/          # Reusable components
│   ├── ui/             # Basic UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── views/              # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── files/          # File management pages
├── stores/             # Pinia stores
│   ├── auth.ts         # Authentication store
│   ├── files.ts        # File management store
│   └── user.ts         # User management store
├── router/             # Vue Router configuration
├── services/           # API services
│   ├── api.ts          # Base API client
│   ├── auth.ts         # Auth API
│   └── files.ts        # File API
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── plugins/            # Vue plugins
│   ├── vuetify.ts      # Vuetify configuration
│   └── i18n.ts         # Internationalization
└── assets/             # Static assets
```

## 🚀 Phase 1: Frontend Foundation Setup

### Completed ✅
- [x] Vue 3 + TypeScript + Vite project
- [x] Vuetify 3 integration với love theme
- [x] Vue I18n setup với Vietnamese/English
- [x] Basic routing structure
- [x] Component architecture foundation
- [x] JWT-based authentication system
- [x] API service with Axios
- [x] Pinia stores setup
- [x] Docker configuration

### Next Steps 📋
- [ ] Complete missing views implementation
- [ ] Add comprehensive error handling
- [ ] Implement file upload components
- [ ] Add loading states for all operations
- [ ] Setup unit tests
- [ ] Add form validation

## 🛠️ Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Docker development
docker-compose --profile dev up

# Docker production
docker-compose --profile production up
```

## 📦 Dependencies

### Core Dependencies
- Vue 3.3+
- TypeScript
- Vite
- Vue Router 4
- Pinia
- Vuetify 3
- Vue I18n
- Axios
- VueUse utilities

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `src/plugins/vuetify.ts` - Vuetify theme configuration
- `src/plugins/i18n.ts` - Internationalization setup
- `src/router/index.ts` - Vue Router configuration
- `env.example` - Environment variables template

## 🎨 Design System

Current project includes a custom "love theme" with pink color palette optimized for a romantic couple app.

## 📝 API Integration

The frontend is designed to work with a REST API backend:
- JWT token-based authentication
- Automatic token refresh
- Request/response interceptors
- Error handling
- File upload support

## 🔐 Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent with all API requests
5. Automatic logout on token expiration

## 📱 Features

- ✅ Responsive design
- ✅ Multi-language support (Vietnamese/English)
- ✅ Dark/Light theme toggle
- ✅ PWA ready
- ✅ Authentication system
- ✅ File upload preparation
- ✅ Dashboard with statistics
- ✅ Profile management

## 🚀 Ready for Backend Integration

The frontend is fully prepared to integrate with any REST API backend that provides:
- Authentication endpoints (`/auth/login`, `/auth/register`, etc.)
- User management endpoints
- File upload endpoints
- Application-specific endpoints
