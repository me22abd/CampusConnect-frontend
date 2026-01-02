# CampusConnect Frontend

React Native (Expo) frontend for CampusConnect dating app.

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── screens/        # Screen components
│   │   ├── auth/       # Login, Register
│   │   ├── DiscoverScreen.tsx
│   │   ├── LikesScreen.tsx
│   │   ├── MatchesScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/     # Navigation setup
│   ├── services/       # API services
│   ├── store/          # Zustand stores
│   ├── components/     # Reusable components
│   ├── theme/          # Colors, styles
│   ├── types/          # TypeScript types
│   └── utils/          # Utilities
├── App.tsx             # Main app component
└── package.json
```

## Features

- ✅ Authentication (Login/Register)
- ✅ JWT token storage (SecureStore)
- ✅ Bottom tab navigation
- ✅ Dark theme
- ✅ API integration ready
- ✅ TypeScript
- ✅ Zustand state management

## API Configuration

Update `src/services/api.ts` with your backend URL:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'  // Local development
  : 'https://your-backend-url.com/api';  // Production
```

**Note:** For iOS simulator, use `http://localhost:3000`
**Note:** For Android emulator, use `http://10.0.2.2:3000`
**Note:** For physical device, use your computer's IP address

## Navigation

- **Auth Stack**: Login → Register
- **Main Tabs**: Discover | Likes | Matches | Profile

## State Management

Using Zustand for global state:
- `useAuthStore` - Authentication state and actions

## Next Steps

1. Implement Discover screen with user cards
2. Implement Likes screen with received likes
3. Implement Matches screen with match list
4. Add profile editing
5. Connect to dating APIs (likes, matches)

