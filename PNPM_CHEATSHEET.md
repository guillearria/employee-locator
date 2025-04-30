# Employee Locator - Command Cheatsheet

## Package Management with pnpm

### Basic Commands
```bash
# Install all dependencies
pnpm install

# Add a new dependency
pnpm add <package-name>

# Add a development dependency
pnpm add -D <package-name>

# Add a global package
pnpm add -g <package-name>

# Remove a dependency
pnpm remove <package-name>

# Update dependencies
pnpm update

# Check for outdated packages
pnpm outdated
```

### Project-Specific Commands
```bash
# Start the Expo development server
npx expo start

# Start for Android
npx expo start --android

# Start for iOS
npx expo start --ios

# Start for web
npx expo start --web

# Build and run native apps
npx expo run:ios
npx expo run:android

# Generate native directories
npx expo prebuild

# Install Expo packages
npx expo install <package-name>

# Customize project
npx expo customize

# Configure project
npx expo config
```

### Expo Development Server Options
```bash
# Start with tunnel for public URL
npx expo start --tunnel

# Start in offline mode
npx expo start --offline

# Start with localhost only
npx expo start --localhost

# Start with custom port
npx expo start --port 3000

# Start with dev client
npx expo start --dev-client

# Start with Expo Go
npx expo start --go
```

### Expo Terminal UI Shortcuts
```bash
# Press these keys in the Expo development server terminal:

A - Open on Android device
Shift + A - Select Android device/emulator
I - Open in iOS Simulator
Shift + I - Select iOS Simulator
W - Open in web browser
R - Reload app
S - Switch between Expo Go and dev client
M - Open dev menu
Shift + M - More commands
J - Open React Native DevTools
O - Open project in editor
E - Show QR code
? - Show all commands
```

## Firebase Commands
```bash
# Install Firebase CLI
pnpm add -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in the project
firebase init

# Deploy to Firebase
firebase deploy
```

## Development Workflow

### Environment Setup
```bash
# Create .env file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### Git Commands
```bash
# Clone the repository
git clone <repository-url>
cd employee-locator

# Create a new branch
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "Your commit message"

# Push changes
git push origin feature/your-feature-name
```

### Testing Location Services
```bash
# For Android: Grant location permissions
adb shell pm grant com.employeelocator android.permission.ACCESS_FINE_LOCATION
adb shell pm grant com.employeelocator android.permission.ACCESS_BACKGROUND_LOCATION

# For iOS: Grant location permissions
# (Must be done through the iOS Settings app)
```

## Troubleshooting

### Common Issues and Solutions

1. **Permission Issues**
```bash
# Fix pnpm permissions
pnpm setup

# Clear pnpm cache
pnpm store prune
```

2. **Expo Issues**
```bash
# Clear Expo cache
npx expo start -c

# Reset Metro bundler
npx expo start --clear

# Check Expo CLI version
npx expo --version

# Get help with Expo commands
npx expo <command> --help
```

3. **Firebase Issues**
```bash
# Clear Firebase cache
firebase cache:clear

# Check Firebase status
firebase status
```

## Performance Tips

1. **Disk Space Management**
```bash
# Clean pnpm store
pnpm store prune

# Remove node_modules
rm -rf node_modules
pnpm install
```

2. **Development Performance**
```bash
# Use pnpm's strict mode for better performance
pnpm install --strict-peer-dependencies

# Use pnpm's frozen-lockfile for CI/CD
pnpm install --frozen-lockfile
```

## Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## Environment Variables

### Expo-specific Environment Variables
```bash
# Disable telemetry
EXPO_NO_TELEMETRY=1

# Set custom editor
EXPO_EDITOR=code

# Disable redirect page for dev client
EXPO_NO_REDIRECT_PAGE=1

# Set public folder for web
EXPO_PUBLIC_FOLDER=public

# Disable .env file loading
EXPO_NO_DOTENV=1

# Enable typed routes in Expo Router
EXPO_USE_TYPED_ROUTES=1
``` 