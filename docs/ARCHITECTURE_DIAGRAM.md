# Redux + Cache Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                        REACT COMPONENT                     │
│                                                             │
│  const { events, loading, error } = useSelector(...)       │
│  dispatch(fetchEvents({ page: 1 }))                        │
│                                                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ (Redux actions/selectors)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                        REDUX STORE                         │
│                                                             │
│  State: { events: [], loading: false, currentPage: 1 }     │
│  Actions: fetchEvents, setPage, setFilters                  │
│  Reducers: Update UI state based on actions                │
│                                                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ (async thunks)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                     CACHE LAYER                            │
│                                                             │
│  getCachedData(key, apiCall, ttl)                          │
│  ├─ Check if data exists in cache                          │
│  ├─ Return cached data if valid                            │
│  └─ Call API and cache result if not                       │
│                                                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ (HTTP requests when cache miss)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                        API SERVER                          │
│                                                             │
│  GET /events?page=1&category=tech                          │
│  Returns: { items: [...], total_count: 100, ... }          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Component Interaction

```text
Component ─────► Redux Store
    │              │
    │              │ (state updates trigger re-renders)
    │              │
    └──────────────▼
   Component Re-renders
```

### 2. Data Fetching (Behind the Scenes)

```text
Redux Thunk ────► Cache Layer ────► API Server
     │               │                   │
     │               │ (cache miss)      │
     │               │                   │
     │               ◄───────────────────┘
     │            (cache data)
     │
     ▼
Redux State Update ────► Component Re-render
```

## Key Points

- **Components** only interact with Redux (via useSelector/dispatch)
- **Redux** manages UI state and triggers data fetching
- **Cache** transparently optimizes data fetching
- **API** is only called when cache doesn't have valid data

This separation means:

- Components get predictable state management (Redux)
- Data fetching is automatically optimized (Cache)
- No changes needed to existing component code
- Better performance without complexity
