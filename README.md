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

### Production

Set the `EXPO_PUBLIC_API_URL` environment variable:

```bash
# In your .env file (see .env.example)
EXPO_PUBLIC_API_URL=https://campusconnect-production-0aed.up.railway.app/api
```

Or set it when running Expo:
```bash
EXPO_PUBLIC_API_URL=https://campusconnect-production-0aed.up.railway.app/api expo start
```

### Development

The app automatically uses:
- iOS Simulator: `http://localhost:3000/api`
- Android Emulator: `http://10.0.2.2:3000/api`
- Physical Device: Use your computer's IP address

**Note:** 
- Environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible
- Never commit `.env` files (they're in `.gitignore`)
- Copy `.env.example` to `.env` and set your production URL

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

