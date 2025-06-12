# Project Frontend - Vue 3 + TypeScript + Vite

## 🏗️ Kiến trúc Frontend
- **Framework**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **UI Framework**: Vuetify 3
- **HTTP Client**: Axios
- **Authentication**: Firebase Auth
- **Storage**: MinIO integration
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

### Next Steps 📋
- [ ] Setup Pinia stores
- [ ] Implement authentication pages
- [ ] Create file management interface
- [ ] Setup API services with Axios
- [ ] Configure Firebase Auth integration
- [ ] Setup MinIO client integration

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

### To be added
- Axios (HTTP client)
- Firebase SDK
- MinIO client
- VueUse utilities
- Form validation library

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `src/plugins/vuetify.ts` - Vuetify theme configuration
- `src/plugins/i18n.ts` - Internationalization setup
- `src/router/index.ts` - Vue Router configuration

## 🎨 Design System

Current project includes a custom "love theme" with pink color palette. This will be adapted for the main project requirements.

## 📝 Next Development Phase

Following the 6-week plan, the next steps involve:
1. Setting up backend repository
2. Firebase project configuration
3. MinIO setup with Docker
4. Authentication system implementation
5. File management system
6. Testing and deployment
