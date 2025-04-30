import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { updateUserLocation } from './firebaseService';

// Define constants
const LOCATION_TRACKING = 'location-tracking';
const UPDATE_INTERVAL = 10000; // 10 seconds
const DISTANCE_INTERVAL = 50; // 50 meters

// Define the background task handler
if (!TaskManager.isTaskDefined(LOCATION_TRACKING)) {
  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.error('Error in background location task:', error);
      return;
    }
    
    if (data) {
      const { locations } = data as { locations: Location.LocationObject[] };
      const location = locations[0];
      
      // Get the current user ID (passed when starting the task)
      try {
        // Extract the user ID from the options when the task was started
        const taskOptions = await TaskManager.getTaskOptionsAsync(LOCATION_TRACKING);
        const userId = taskOptions?.userId;
        
        if (userId) {
          // Update the location in Firebase
          await updateUserLocation(userId, {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            heading: location.coords.heading,
            timestamp: location.timestamp,
          });
        } else {
          console.error('No user ID available for location tracking');
        }
      } catch (err) {
        console.error('Failed to update location:', err);
      }
    }
  });
}

// Request location permissions for foreground use
export const requestLocationPermissions = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

// Request background location permissions
export const requestBackgroundLocationPermissions = async (): Promise<boolean> => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  return status === 'granted';
};

// Get the current location once
export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      return null;
    }
    
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

// Start tracking the user's location in the background
export const startLocationTracking = async (userId: string): Promise<boolean> => {
  try {
    // Check for foreground permissions first
    const hasForegroundPermission = await requestLocationPermissions();
    if (!hasForegroundPermission) {
      console.error('No foreground location permission');
      return false;
    }
    
    // Then check for background permissions
    const hasBackgroundPermission = await requestBackgroundLocationPermissions();
    if (!hasBackgroundPermission) {
      console.error('No background location permission');
      return false;
    }
    
    // Start the background location updates
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: UPDATE_INTERVAL,
      distanceInterval: DISTANCE_INTERVAL,
      foregroundService: {
        notificationTitle: 'Employee Locator',
        notificationBody: 'Tracking your location during your shift',
      },
      // Pass the user ID to the task
      userId,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to start location tracking:', error);
    return false;
  }
};

// Stop location tracking
export const stopLocationTracking = async (): Promise<boolean> => {
  try {
    const isTracking = await TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
    if (isTracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }
    return true;
  } catch (error) {
    console.error('Failed to stop location tracking:', error);
    return false;
  }
};

// Check if location tracking is currently active
export const isLocationTrackingActive = async (): Promise<boolean> => {
  return TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
}; 