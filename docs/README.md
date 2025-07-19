# Sahana Frontend Documentation

This folder contains comprehensive documentation for the Sahana Frontend application.

## 📚 Documentation Index

### Core System Documentation

- **[CACHE_GUIDE.md](./CACHE_GUIDE.md)** - Developer handbook for working with the cache system
- **[PAGINATION_CLEANUP.md](./PAGINATION_CLEANUP.md)** - Documentation of pagination API cleanup
- **[BACKEND_API_USAGE_REPORT.md](./BACKEND_API_USAGE_REPORT.md)** - API usage report for backend team

### Architecture Documentation

- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Visual diagrams of the system architecture
- **[ARCHIVE_IMPLEMENTATION.md](./ARCHIVE_IMPLEMENTATION.md)** - Event archive system implementation

### Development Guides

- **[API_SEPARATION_GUIDE.md](./API_SEPARATION_GUIDE.md)** - Documentation for separating API calls from components into dedicated API modules
- **[DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md)** - Standards and templates for creating documentation
- **[FRIENDS_FRONTEND_GUIDE.md](./FRIENDS_FRONTEND_GUIDE.md)** - Complete guide for the Friends system frontend
- **[BACKEND_COMMUNICATION_TEMPLATES.md](./BACKEND_COMMUNICATION_TEMPLATES.md)** - Templates for communicating with backend team

## 🔧 Quick Reference

### Caching System

The application features a comprehensive in-memory caching system:

- Cache utilities in `src/utils/cacheUtils.ts`
- Redux integration in all paginated slices
- React hook for cache invalidation: `useCacheInvalidation`
- Development tools in `src/components/CacheStatus.tsx`

### API Architecture

Centralized API architecture with dedicated modules:

- `src/apis/authAPI.ts` - Authentication endpoints
- `src/apis/eventsAPI.ts` - Event management endpoints  
- `src/apis/adminAPI.ts` - Admin functionality endpoints
- `src/apis/friendsAPI.ts` - Friends system endpoints

### Performance Features

- Cursor-based pagination for infinite scroll
- Offset-based pagination for admin interfaces
- Smart cache invalidation on data changes
- Streamlined API calls after technical debt cleanup

## 📝 Contributing

When adding new documentation:

1. Create descriptive filenames with appropriate extensions
2. Include implementation details and usage examples
3. Update this README with links to new documentation
4. Follow the existing documentation structure and style

## 🚀 Getting Started

For development setup and running the application, refer to the main [README.md](../README.md) in the project root.

For working with the caching system, start with [CACHE_GUIDE.md](./CACHE_GUIDE.md).

---

### Last updated: December 2024
