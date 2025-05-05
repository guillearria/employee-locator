# Employee Locator

A real-time location tracking system for organizations to manage and track their employees. This mobile application enables managers to monitor employee locations and maintain efficient communication within their organization.

## Features

- 🔐 **Role-based Authentication**: Secure login system with manager and worker roles
- 🏢 **Organization Management**: Create and manage organizations with multiple managers and workers
- 📍 **Location Tracking**: Real-time location sharing for workers
- 👥 **Team Management**: Managers can view and manage all organization members
- 📱 **Cross-platform**: Built with Expo for iOS and Android support

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Authentication, Firestore)
- **Navigation**: Expo Router
- **UI Components**: React Native core components with custom styling

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/employee-locator.git
cd employee-locator
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Set up Firestore Database
   - Add your Firebase configuration to the project

4. Start the development server
```bash
npx expo start
```

## App Structure

### Authentication
- Email/password authentication
- Role selection (Manager/Worker)
- Organization-based access control

### Manager Features
- View organization members
- Monitor worker locations
- Manage organization settings
- Access to all organization data

### Worker Features
- Check-in/out functionality
- Location sharing during active shifts
- View personal information
- Access to organization details

## Security & Privacy

- Role-based access control
- Organization-level data isolation
- Secure authentication
- Location sharing only during active shifts

## Development

The project uses Expo's file-based routing system. Main components are located in the `app` directory:

- `(tabs)`: Main application screens
- `firebaseConfig.ts`: Firebase configuration
- Components and utilities are organized in their respective directories

## Future Enhancements

- Real-time location tracking
- Push notifications
- Geofencing capabilities
- Advanced analytics
- Web dashboard for managers

## License

This project is licensed under the MIT License - see the LICENSE file for details.
