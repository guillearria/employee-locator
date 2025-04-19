# Employee Locator

A real-time location tracking system for kitchen managers on a university campus. This mobile MVP enables managers to see where employees are and contact them instantly when needed.

## Purpose

Kitchen managers on large university campuses need to quickly locate and communicate with staff members in real-time. This app allows:

- **Employees** to check-in/out for work shifts and share their location only when on duty
- **Managers** to view all on-duty employees on a live map and contact them with one tap

## Features

- 🔄 **Real-time tracking**: See employee locations update live on the map
- 📱 **Simple check-in/out**: Employees control when they're being tracked
- 🗺️ **Interactive map**: Managers can pan/zoom to see all employees
- 📞 **Quick contact**: Call or text employees directly from the app
- 🔒 **Privacy-focused**: Tracking only happens during work hours

## Tech Stack

- **Frontend**: React Native with Expo
- **Maps**: react-native-maps (Apple Maps on iOS, Google Maps on Android)
- **Backend**: Firebase (Authentication, Realtime Database)
- **Location**: expo-location for GPS tracking
- **UI Components**: React Native Paper

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
# or
yarn install
```

3. Create a `.env` file in the project root with your Firebase config:
```
API_KEY=your-firebase-api-key
AUTH_DOMAIN=your-project.firebaseapp.com
PROJECT_ID=your-project-id
STORAGE_BUCKET=your-project.appspot.com
MESSAGING_SENDER_ID=your-messaging-sender-id
APP_ID=your-app-id
```

4. Start the development server
```bash
expo start
```

## App Structure

- **Authentication**: Simple login differentiating between employee and manager roles
- **Employee View**: Check-in button, status indicator, current location display  
- **Manager View**: Live map showing all on-duty employees with contact options

## Privacy Considerations

This app respects employee privacy by:
- Only tracking location during work hours (when checked in)
- Requiring explicit consent before location sharing begins
- Not storing historical location data in the MVP
- Clearly indicating tracking status to employees

## Future Enhancements

- Geofencing to alert when employees leave designated areas
- Web dashboard for managers
- Push notifications for important events
- Historical location data with appropriate retention policies
- Integration with scheduling systems

## Legal Notice

Before deployment, ensure compliance with:
- State laws regarding employee location tracking
- Labor regulations for personal device usage
- Data privacy regulations
- Appropriate consent and notification requirements

## License

This project is licensed under the MIT License - see the LICENSE file for details.
