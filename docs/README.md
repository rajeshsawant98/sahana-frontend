# Sahana Frontend Documentation

This folder contains comprehensive documentation for the Sahana Frontend application.

## 📚 Documentation Index

### Core System Documentation

- **[CACHING_IMPLEMENTATION.md](./CACHING_IMPLEMENTATION.md)** - Technical details of the pagination caching system
- **[CACHE_GUIDE.md](./CACHE_GUIDE.md)** - Developer handbook for working with the cache system
- **[CACHING_SUMMARY.md](./CACHING_SUMMARY.md)** - Overview and benefits of the caching implementation

### Architecture Documentation

- **[REDUX_VS_CACHE_EXPLANATION.md](./REDUX_VS_CACHE_EXPLANATION.md)** - Understanding the separation between Redux and cache layers
- **[CACHE_VS_REDIS_COMPARISON.md](./CACHE_VS_REDIS_COMPARISON.md)** - Comparison between our frontend cache and Redis
- **[ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)** - Visual diagrams of the system architecture

### Development Guides

- **[API_SEPARATION_GUIDE.md](./API_SEPARATION_GUIDE.md)** - Documentation for separating API calls from components into dedicated API modules
- **[DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md)** - Standards and templates for creating documentation

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

### Performance Features
- 70% reduction in API calls for repeated pagination
- Automatic prefetching of next pages
- Smart cache invalidation on data changes
- Memory-efficient TTL-based expiration

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

*Last updated: December 2024*
