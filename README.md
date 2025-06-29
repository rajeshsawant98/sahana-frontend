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

> 🆕 **Latest Updates (2025)**: This project now features a completely reorganized component structure AND dedicated routing system with semantic imports and enhanced TypeScript integration for superior developer experience!

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

### Anonymous User Experience

- ✅ **Anonymous Browsing** - Browse events without authentication
- ✅ **Public Event Access** - View event details and information without login
- ✅ **Smart Landing Page** - Authentication-aware onboarding experience
- ✅ **Context-Aware Navigation** - Dynamic navigation based on user status
- ✅ **Location Services for All** - GPS-based event discovery for anonymous users
- ✅ **Responsive Anonymous UI** - Mobile-optimized experience for all user types

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
- ✅ **Dark Mode** - Complete dark/light theme system with user preferences
- ✅ **Role-Based Access** - Admin dashboard and user role management
- ✅ **Anonymous User Support** - Full event browsing without authentication
- ✅ **Dynamic Navigation** - Context-aware UI based on authentication status
- ✅ **Friends System** - Connect and follow other users with search and friend requests
- 🆕 **Organized Architecture** - Completely reorganized component structure (2025)
- 🆕 **Clean Routing System** - Dedicated routing structure with organized route management
- 🆕 **Developer Experience** - Enhanced with semantic imports and better maintainability

### Upcoming Features

- 🔄 **Calendar Integration** - Sync events with Google Calendar
- 🔄 **Push Notifications** - Real-time event updates
- 🔄 **Event Chat** - In-app messaging for event participants

---

## 🚀 TypeScript Migration & Architecture Improvements

This project has been **fully migrated to TypeScript** and features **completely reorganized component and routing architecture** for enhanced developer experience and code reliability:

### 🎯 Component Architecture Redesign (2025)

- ✅ **Organized by Function** - Components grouped by purpose (auth, events, navigation, etc.)
- ✅ **Clean Import Structure** - Semantic imports with category-based paths
- ✅ **Index File Exports** - Centralized exports from each component category
- ✅ **Improved Maintainability** - Related components co-located for easier development
- ✅ **Team-Friendly Structure** - Clear organization for collaborative development
- ✅ **Scalable Architecture** - Easy to extend with new component categories

### 🛣️ Routing System Overhaul (2025)

- ✅ **Dedicated Routing Directory** - All routes organized in `src/routes/`
- ✅ **Clean App Component** - Reduced from 114 to 42 lines by extracting routes
- ✅ **Categorized Routes** - Public, Protected, and Admin routes clearly separated
- ✅ **Type-Safe Route Constants** - Route paths defined as TypeScript constants
- ✅ **Better Maintainability** - Easy to add, modify, or remove routes

### 🔧 TypeScript Migration Highlights

- ✅ **100% TypeScript Coverage** - All `.js`/`.jsx` files converted to `.ts`/`.tsx`
- ✅ **Type-Safe Redux** - Complete typing of actions, reducers, and state
- ✅ **API Type Safety** - Axios requests and responses fully typed
- ✅ **Component Props** - All React components with proper prop typing
- ✅ **External Library Integration** - Custom type declarations for third-party packages

### 💻 Developer Benefits

- 🔍 **IntelliSense** - Full autocomplete and code navigation
- 🛡️ **Compile-time Error Detection** - Catch bugs before runtime
- 📚 **Self-documenting Code** - Types serve as inline documentation
- 🔄 **Refactoring Confidence** - Safe large-scale code changes
- 🎯 **Better IDE Support** - Enhanced debugging and testing
- 🏗️ **Organized Codebase** - Logical component and routing structure
- 🚀 **Cleaner Architecture** - Separation of concerns with dedicated directories

---

## 📁 Project Structure

```text
src/
├── components/              # 🎯 Organized UI Components (NEW STRUCTURE!)
│   ├── 🔐 auth/            # Authentication components
│   │   ├── SignUpComponent.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── LogoutButton.tsx
│   │   └── index.ts
│   ├── 🧭 navigation/      # Navigation and routing
│   │   ├── NavBar.tsx
│   │   ├── LocationNavbar.tsx
│   │   └── index.ts
│   ├── 📅 events/          # Event-related components
│   │   ├── EventForm.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventFilters.tsx
│   │   ├── ArchivedEventsView.tsx
│   │   ├── ArchiveEventButton.tsx
│   │   ├── BulkArchiveButton.tsx
│   │   └── index.ts
│   ├── 👥 friends/         # Friend system components
│   │   ├── FriendCard.tsx
│   │   ├── FriendRequestCard.tsx
│   │   ├── FriendSearch.tsx
│   │   └── index.ts
│   ├── 🎨 ui/             # Reusable UI components
│   │   ├── DarkModeToggle.tsx
│   │   ├── PaginationControls.tsx
│   │   ├── CacheStatus.tsx
│   │   ├── AnimatedSVG.tsx
│   │   ├── AnimateSVG.tsx
│   │   └── index.ts
│   ├── 🗺️ maps/           # Location and mapping
│   │   ├── MapComponent.tsx
│   │   └── index.ts
│   ├── 👨‍💼 admin/         # Admin-specific components
│   │   ├── AdminRoute.tsx
│   │   └── index.ts
│   └── 📦 index.ts         # Main component exports
├── routes/                  # 🛣️ Routing System (NEW!)
│   ├── index.tsx           # Main AppRoutes component
│   └── types.ts            # Route constants and types
├── pages/                   # Main application pages
│   ├── admin/              # Admin dashboard pages
│   ├── CreateEvent.tsx
│   ├── Events.tsx
│   ├── Friends.tsx
│   └── ...
├── redux/                   # State management
│   ├── slices/             # Redux Toolkit slices
│   └── store.ts            # Store configuration
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions and helpers
├── apis/                    # API service functions
├── hooks/                   # Custom React hooks
├── styles/                  # Theme and styling
│   ├── theme/              # Material-UI theme configuration
│   ├── global/             # Global styles
│   └── vendor/             # Third-party styles
└── assets/                  # Static assets (images, icons)
    └── categories/         # Event category icons
```

### 🎯 Component Organization Benefits

Our **newly reorganized component structure** provides:

- **🔍 Better Discoverability** - Components grouped by functionality
- **📦 Clean Imports** - Semantic import statements like `import { NavBar } from 'components/navigation'`
- **🛠️ Improved Maintainability** - Related components co-located
- **📈 Enhanced Scalability** - Easy to add new components to appropriate categories
- **👥 Team Collaboration** - Clear structure for multiple developers

#### Component Categories

**🔐 Authentication (`auth/`)**

- `SignUpComponent` - User registration form
- `ProtectedRoute` - Route protection wrapper  
- `LogoutButton` - User logout functionality

**🧭 Navigation (`navigation/`)**

- `NavBar` - Main navigation bar
- `LocationNavbar` - Location-specific navigation

**📅 Events (`events/`)**

- `EventForm` - Create/edit event form
- `EventFilters` - Event filtering controls
- `EventCard` - Event display card
- `ArchivedEventsView`, `ArchiveEventButton`, `BulkArchiveButton` - Archive features

**👥 Friends (`friends/`)**

- `FriendCard` - Friend profile display
- `FriendRequestCard` - Friend request UI
- `FriendSearch` - Friend search functionality

**🎨 UI (`ui/`)**

- `DarkModeToggle` - Theme switching
- `PaginationControls` - Data pagination
- `CacheStatus` - Cache information display
- `AnimatedSVG`, `AnimateSVG` - SVG animations

**🗺️ Maps (`maps/`)**

- `MapComponent` - Google Maps integration

**👨‍💼 Admin (`admin/`)**

- `AdminRoute` - Admin route protection

### 🛣️ Routing System Benefits

Our **dedicated routing architecture** provides:

- **🧹 Cleaner App Component** - Reduced from 114 to 42 lines
- **📂 Organized Routes** - All routes in dedicated `src/routes/` directory
- **🏷️ Categorized Structure** - Public, Protected, and Admin routes clearly separated
- **🔧 Easy Maintenance** - Adding/modifying routes doesn't clutter App.tsx
- **🎯 Type Safety** - Route paths defined as TypeScript constants

#### Routing Structure

**🌐 Public Routes** (No authentication required)

- `/` - Landing page
- `/login` - User login  
- `/signup` - User registration
- `/nearby-events` - Events near user location (anonymous access)
- `/events/:id` - Event details (anonymous access)

**🔐 Protected Routes** (Authentication required)

- `/home` - Authenticated user home
- `/profile` - User profile management
- `/interests` - User interests configuration
- `/events` - Events listing (authenticated)
- `/events/:id/edit` - Edit event
- `/events/new` - Create new event
- `/events/my` - User's created events
- `/friends` - Friends management

**👨‍💼 Admin Routes** (Admin privileges required)

- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/events` - Event management

### 💡 Routing Architecture

```typescript
// 🎯 Clean App.tsx - Focus on app setup
<Router>
  <LoadScript>
    <InitRedux />
    <AuthBootstrap />
    <AppRoutes />  {/* Single clean import! */}
  </LoadScript>
</Router>

// 📂 Organized in src/routes/index.tsx
export const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<LandingPage />} />
    {/* Protected Routes */}
    <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
    {/* Admin Routes */}
    <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
  </Routes>
);
```

### 💡 Component Import Style

```typescript
// ✅ After reorganization - Clean & Semantic
import { NavBar } from '../components/navigation';
import { EventCard, EventForm } from '../components/events';
import { LogoutButton } from '../components/auth';
import { PaginationControls } from '../components/ui';

// ❌ Before - Flat structure
import NavBar from '../components/NavBar';
import EventCard from '../components/cards/EventCard';
import LogoutButton from '../components/buttons/LogoutButton';
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

### Project Documentation

- **[📚 Documentation Hub](./docs/README.md)** - Complete project documentation
- **[📋 JIRA Stories](./docs/JIRA_STORIES.md)** - Anonymous user enhancement stories
- **[API Architecture Guide](./docs/API_SEPARATION_GUIDE.md)** - API design patterns
- **[Dark Mode Implementation](./docs/DARK_MODE_IMPLEMENTATION.md)** - Theme system guide
- **[Documentation Guidelines](./docs/DOCUMENTATION_GUIDELINES.md)** - Contributing standards

### External Resources

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
