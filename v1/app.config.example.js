export default {
  expo: {
    name: "Employee Locator",
    slug: "employee-locator",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./app/assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./app/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.employeelocator",
      infoPlist: {
        UIBackgroundModes: [
          "location",
          "fetch"
        ],
        NSLocationWhenInUseUsageDescription: "We need your location to track your position during your work shift.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "We need to track your location during your work shift, even when the app is in the background.",
        NSLocationAlwaysUsageDescription: "We need to track your location during your work shift, even when the app is in the background."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./app/assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.employeelocator",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ],
      config: {
        googleMaps: {
          apiKey: "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    },
    web: {
      favicon: "./app/assets/favicon.png"
    },
    extra: {
      // Firebase Configuration
      // Replace these values with your Firebase project configuration
      API_KEY: "your-firebase-api-key",
      AUTH_DOMAIN: "your-project.firebaseapp.com",
      PROJECT_ID: "your-project-id",
      STORAGE_BUCKET: "your-project.appspot.com",
      MESSAGING_SENDER_ID: "your-messaging-sender-id",
      APP_ID: "your-app-id",
      
      // Google Maps API Key (for Android)
      // This is also used in the Android config above
      GOOGLE_MAPS_API_KEY: "your-google-maps-api-key",
      
      // Development Settings
      // Set to true to enable development features
      EAS_BUILD: process.env.EAS_BUILD,
      
      // EAS Project ID
      eas: {
        projectId: "your-project-id"
      }
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow Employee Locator to use your location to track your position during your work shift.",
          isAndroidBackgroundLocationEnabled: true
        }
      ]
    ]
  }
}; 