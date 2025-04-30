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
pnpm expo start

# Start for Android
pnpm expo start --android

# Start for iOS
pnpm expo start --ios

# Start for web
pnpm expo start --web
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
expo start -c

# Reset Metro bundler
pnpm expo start --clear
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