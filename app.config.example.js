export default {
  expo: {
    name: "Employee Locator",
    slug: "employee-locator",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.employeelocator"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.employeelocator",
      config: {
        googleMaps: {
          apiKey: "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    },
    web: {
      favicon: "./assets/favicon.png"
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
      
      // Optional: Add any other environment variables here
      // For example:
      // API_URL: "https://api.example.com",
      // DEBUG_MODE: false
    },
    plugins: [
      "expo-location",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location.",
          locationAlwaysPermission: "Allow $(PRODUCT_NAME) to use your location.",
          locationWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location.",
          isAndroidBackgroundLocationEnabled: true
        }
      ]
    ]
  }
}; 