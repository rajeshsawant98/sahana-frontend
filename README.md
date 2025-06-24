# 🌟 Sahana Frontend

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://sahana-drab.vercel.app)  
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?logo=typescript)](https://www.typescriptlang.org/)  
[![Hosted on Vercel](https://img.shields.io/badge/hosted%20on-Vercel-black?logo=vercel)](https://sahana-drab.vercel.app)  
[![Backend API](https://img.shields.io/badge/backend-FastAPI-blue?logo=fastapi)](https://sahana-backend-856426602401.us-west1.run.app/docs)

> Sahana is a community-driven meetup and event discovery platform where users can connect, host, and attend events based on their interests and location. Built with modern TypeScript, React, and Material-UI for a seamless user experience.

---

## 🚀 Live App

🌐 **Frontend**: [https://sahana-drab.vercel.app](https://sahana-drab.vercel.app)  
🔗 **Backend API**: [https://sahana-backend-856426602401.us-west1.run.app/docs](https://sahana-backend-856426602401.us-west1.run.app/docs)

---

## 🧰 Tech Stack

### Frontend

- **TypeScript** - 100% type-safe codebase
- **React 19** + **Vite 6** - Modern development experience
- **Material-UI (MUI)** - Professional component library with custom theming
- **Redux Toolkit** - State management with TypeScript integration
- **React Router Dom** - Client-side routing
- **React Hook Form** - Form validation and handling
- **Axios** - HTTP client with interceptors
- **Firebase** - File storage and authentication
- **Google Maps API** - Location services and mapping

### Backend & Deployment

- **FastAPI** backend (Python) hosted on Google Cloud Run
- **Vercel** for frontend hosting with automatic deployments
- **PostgreSQL** database

---

## 🛠️ Getting Started

```bash
git clone https://github.com/rajeshsawant98/sahana-frontend.git
cd sahana-frontend
npm install
npm run dev
```

### 🌱 Environment Setup

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=https://sahana-backend-856426602401.us-west1.run.app/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
```

> ⚠️ Note: Vite uses `VITE_*` prefix for environment variables (not `REACT_APP_*`).

---

## 🧪 Available Scripts

```bash
npm run dev     # Start local dev server (http://localhost:5173)
npm run build   # Build for production (outputs to /dist)
npm run preview # Preview production build locally
```

---

## 🎯 Features

### Core Functionality

- ✅ **User Authentication** - Google SSO & email/password login with JWT
- ✅ **Event Management** - Create, edit, delete, and join events
- ✅ **Interest-based Recommendations** - Personalized event discovery
- ✅ **Location Services** - GPS-based nearby event discovery
- ✅ **Real-time Updates** - Live event information and participant counts
- ✅ **User Profiles** - Customizable profiles with interests and location

### Advanced Features

- ✅ **Event Categories** - Filter by interests (Sports, Art, Technology, etc.)
- ✅ **RSVP System** - Join/leave events with capacity management
- ✅ **Event Reviews** - Rate and review attended events
- ✅ **Image Upload** - Firebase-powered event banner uploads
- ✅ **Responsive Design** - Mobile-first Material-UI components
- ✅ **Type Safety** - 100% TypeScript coverage for robust development

### Upcoming Features

- 🔄 **Calendar Integration** - Sync events with Google Calendar
- 🔄 **Friend System** - Connect and follow other users
- 🔄 **Push Notifications** - Real-time event updates
- 🔄 **Event Chat** - In-app messaging for event participants

---

## 🚀 TypeScript Migration

This project has been **fully migrated to TypeScript** for enhanced developer experience and code reliability:

### Migration Highlights

- ✅ **100% TypeScript Coverage** - All `.js`/`.jsx` files converted to `.ts`/`.tsx`
- ✅ **Type-Safe Redux** - Complete typing of actions, reducers, and state
- ✅ **API Type Safety** - Axios requests and responses fully typed
- ✅ **Component Props** - All React components with proper prop typing
- ✅ **External Library Integration** - Custom type declarations for third-party packages

### Developer Benefits

- 🔍 **IntelliSense** - Full autocomplete and code navigation
- 🛡️ **Compile-time Error Detection** - Catch bugs before runtime
- 📚 **Self-documenting Code** - Types serve as inline documentation
- 🔄 **Refactoring Confidence** - Safe large-scale code changes
- 🎯 **Better IDE Support** - Enhanced debugging and testing

---

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── cards/          # Event cards and related components
│   ├── buttons/        # Custom button components
│   └── ...
├── pages/              # Main application pages
├── redux/              # State management
│   ├── slices/         # Redux Toolkit slices
│   └── store.ts        # Store configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── apis/               # API service functions
├── styles/             # Theme and styling
└── assets/             # Static assets (images, icons)
```

---

## 🛫 Deployment Notes

### Vercel Configuration

- Deployed on **Vercel** using Vite build system
- Automatic deployments from GitHub integration
- Zero-config setup with Vite optimization

### Environment Variables

Ensure these are set in Vercel → Environment Variables:

- `VITE_BACKEND_URL`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`

### Backend Integration

- CORS must be enabled on the backend for both `localhost:5173` and your Vercel domain
- JWT tokens are handled via HTTP-only cookies and localStorage
- API base URL configured via environment variables

### React Router Setup

Add `vercel.json` for React Router fallback:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Performance Optimizations

- Vite's automatic code splitting
- Material-UI tree shaking
- Image optimization via Firebase
- TypeScript compilation for smaller bundles

---

## 📖 Learn More

### Documentation

- [Vite Documentation](https://vitejs.dev/) - Build tool and dev server
- [Material-UI Documentation](https://mui.com/) - React component library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [React Hook Form](https://react-hook-form.com/) - Form validation

### API References

- [Backend API Docs](https://sahana-backend-856426602401.us-west1.run.app/docs) - FastAPI Swagger documentation
- [Google Maps API](https://developers.google.com/maps/documentation) - Location services
- [Firebase Documentation](https://firebase.google.com/docs) - File storage and auth

---

## 📬 Contact

Created by [Rajesh Sawant](https://github.com/rajeshsawant98) — feel free to reach out!

---

**🎉 Ready to explore events and connect with your community? [Launch Sahana](https://sahana-drab.vercel.app) today!**
