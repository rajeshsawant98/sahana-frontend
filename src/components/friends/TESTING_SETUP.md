# Testing Setup Guide for Friends System

## Current Status
The Friends system implementation includes test examples, but your project doesn't have testing dependencies installed yet.

## Quick Setup (Recommended)

### 1. Install Testing Dependencies
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2. Update vite.config.js
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  build: {
    outDir: 'dist',
  },
});
```

### 3. Create Test Setup File
Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

### 4. Update package.json Scripts
Add to your `scripts` section:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### 5. Update tsconfig.json
Add to `compilerOptions.types`:
```json
{
  "compilerOptions": {
    "types": ["vite/client", "google.maps", "vitest/globals", "@testing-library/jest-dom"]
  }
}
```

## Alternative Setup (Jest)

If you prefer Jest over Vitest:

### 1. Install Jest Dependencies
```bash
npm install --save-dev jest @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### 2. Create jest.config.js
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
```

## Running Tests

After setup, you can:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test FriendSearch

# Run with coverage
npm test -- --coverage
```

## Manual Testing

Until you set up automated testing, you can manually test the Friends system:

1. **Start the development server**: `npm run dev`
2. **Navigate to Friends page**: Add `/friends` to your router
3. **Test user search**: 
   - Type in the search box
   - Verify 500ms debounce delay
   - Check different friendship statuses
4. **Test friend requests**:
   - Send requests
   - Accept/reject requests
   - Cancel sent requests
5. **Test friends list**:
   - View friends
   - Test profile/message buttons

## Test Files Included

- `FriendSearch.test.tsx` - Component testing example
- Mock API responses
- Redux store testing
- User interaction testing

The test examples are ready to use once you install the dependencies!
