# Employee Locator - Setup Guide

## Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (v14+)
- pnpm (recommended), npm, or yarn
- Expo CLI: `pnpm add -g expo-cli`

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. Add a web app to your Firebase project and copy the Firebase configuration

3. Configure Firebase in your project:
   - Create or update `app.config.js` in your project root:
   ```javascript
   export default {
     expo: {
       // ... other Expo config
       extra: {
         API_KEY: "your-firebase-api-key",
         AUTH_DOMAIN: "your-project.firebaseapp.com",
         PROJECT_ID: "your-project-id",
         STORAGE_BUCKET: "your-project.appspot.com",
         MESSAGING_SENDER_ID: "your-messaging-sender-id",
         APP_ID: "your-app-id"
       }
     }
   };
   ```
   - The configuration will be automatically loaded from `app.config.js` into `app/config/firebase.ts`
   - For development, you can also use `app.config.local.js` (gitignored) to store your local configuration

4. Enable Authentication:
   - Go to the Firebase console → Authentication → Sign-in method
   - Enable Email/Password authentication
   - Create test users:
     - `manager@test.com` with password `manager123`
     - `employee@test.com` with password `employee123`

5. Enable Realtime Database:
   - Go to the Firebase console → Realtime Database
   - Create a database in test mode (for development only)
   - Set up the security rules (example below):

```
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'manager'"
      }
    },
    "employees": {
      ".read": "auth != null",
      "$uid": {
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'manager'"
      }
    },
    "locations": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'manager'",
      "$uid": {
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Google Maps Setup (For Android Only)

1. Create a Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Maps SDK for Android
   - Create an API key with appropriate restrictions

2. Add the API key to `app.config.js`:
   ```javascript
   export default {
     expo: {
       // ... other Expo config
       extra: {
         // ... Firebase config
         GOOGLE_MAPS_API_KEY: "your-google-maps-api-key"
       }
     }
   };
   ```

## Development Setup

1. Install dependencies:
```bash
pnpm install
# or
npm install
# or
yarn install
```

2. Configure your development environment:
   - Copy `app.config.example.js` to `app.config.local.js` (if available)
   - Update the values in `app.config.local.js` with your Firebase and Google Maps credentials
   - This file is gitignored, so your credentials won't be committed

3. Start the development server:
```bash
npx expo start
```

4. Run on a device or emulator:
   - Scan the QR code with the Expo Go app on your device
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on an iOS simulator (macOS only)

## Testing Location Services

For the best experience testing location tracking:

1. Use a physical device when possible
2. Ensure location services are enabled on your device
3. For Android: Grant "Allow all the time" permission for location
4. For iOS: Grant "Allow While Using App" or "Always" permission
5. Test outdoors for better GPS accuracy

## Notes for Development

- The Firebase service is set up with mock data in `firebaseService.ts`
- Background location tracking requires special permissions on both iOS and Android
- To test the manager view with multiple employees, you'll need multiple devices or you can use simulated employees
- Changes to Firebase rules may take a few minutes to propagate
- For production deployment, make sure to:
  - Use a production Firebase project
  - Set up proper security rules
  - Configure environment variables in your deployment platform
  - Never commit sensitive credentials to version control 