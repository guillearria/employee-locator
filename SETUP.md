# Employee Locator - Setup Guide

## Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (v14+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. Add a web app to your Firebase project and copy the Firebase configuration

3. Update the configuration in the following files:
   - `App.tsx`: Replace the Firebase config object
   - `app/services/firebaseService.ts`: Replace the Firebase config object

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

2. Add the API key to `app.json`:
   - Update the `"android" → "config" → "googleMaps" → "apiKey"` field

## Environment Setup

1. Create a `.env` file in the project root:
```
API_KEY=your-firebase-api-key
AUTH_DOMAIN=your-project.firebaseapp.com
PROJECT_ID=your-project-id
STORAGE_BUCKET=your-project.appspot.com
MESSAGING_SENDER_ID=your-messaging-sender-id
APP_ID=your-app-id
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## Running the App

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start the development server:
```bash
expo start
```

3. Run on a device or emulator:
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