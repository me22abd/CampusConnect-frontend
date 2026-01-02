# Frontend Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

## Installation

```bash
cd frontend
npm install
```

## Configuration

### API URL Configuration

Update `src/services/api.ts` with your backend URL:

**For iOS Simulator:**
```typescript
return 'http://localhost:3000/api';
```

**For Android Emulator:**
```typescript
return 'http://10.0.2.2:3000/api';
```

**For Physical Device:**
1. Find your computer's IP address:
   - Mac/Linux: `ifconfig | grep "inet "`
   - Windows: `ipconfig`
2. Update API URL: `http://YOUR_IP:3000/api`
   - Example: `http://192.168.1.100:3000/api`

**For Production:**
```typescript
return 'https://your-backend-url.com/api';
```

## Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Project Structure

```
frontend/
├── src/
│   ├── screens/          # Screen components
│   │   ├── auth/        # Login, Register
│   │   └── ...          # Main app screens
│   ├── navigation/      # Navigation setup
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── components/      # Reusable components
│   ├── theme/           # Colors, styles
│   └── types/           # TypeScript types
└── App.tsx              # Main entry point
```

## Features Implemented

✅ **Authentication**
- Login screen
- Register screen
- JWT token storage (SecureStore)
- Auto-login on app start

✅ **Navigation**
- Bottom tab navigation
- Auth stack navigation
- Auto-navigation based on auth state

✅ **State Management**
- Zustand store for auth
- Global state management

✅ **UI Components**
- Reusable Button component
- Reusable Input component
- Dark theme

## Next Steps

1. Connect Discover screen to backend API
2. Implement user card display
3. Connect Likes screen to GET /api/likes/received
4. Connect Matches screen to GET /api/matches
5. Add profile editing functionality

## Troubleshooting

**API Connection Issues:**
- Ensure backend is running on correct port
- Check API URL matches your platform
- Verify CORS settings on backend

**Token Issues:**
- Clear app data and re-login
- Check SecureStore permissions

**Navigation Issues:**
- Ensure all screens are properly registered
- Check navigation stack setup

