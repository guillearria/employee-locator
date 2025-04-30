import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Platform } from 'react-native';
import { Button, Title, Text, Appbar, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define a constant for the background task name
const LOCATION_TRACKING = 'location-tracking';

// Root stack param list for TypeScript
type RootStackParamList = {
  RoleSelection: undefined;
  Employee: undefined;
  Manager: undefined;
};

type EmployeeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Employee'
>;

// Define the task for location tracking in the background
TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.error('Error in background location task:', error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];
    
    // Get the current user and update their location in Firebase
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const db = getDatabase();
      const locationRef = ref(db, `locations/${user.uid}`);
      
      // Update the location in Firebase
      await set(locationRef, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        heading: location.coords.heading,
        timestamp: location.timestamp,
      });
    }
  }
});

const EmployeeScreen = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const navigation = useNavigation<EmployeeScreenNavigationProp>();
  
  // Get the current user from Firebase
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  
  // Check the initial status when the component mounts
  useEffect(() => {
    if (user) {
      const statusRef = ref(db, `employees/${user.uid}/isCheckedIn`);
      onValue(statusRef, (snapshot) => {
        const isActive = snapshot.val();
        setIsCheckedIn(isActive === true);
      });
      
      const checkInTimeRef = ref(db, `employees/${user.uid}/checkInTime`);
      onValue(checkInTimeRef, (snapshot) => {
        const timeValue = snapshot.val();
        if (timeValue) {
          setCheckInTime(new Date(timeValue));
        } else {
          setCheckInTime(null);
        }
      });
    }
    
    return () => {
      // Clean up any listeners
    };
  }, [user, db]);
  
  // Request location permissions when the component mounts
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
      // Get the initial location to show on the map
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
    
    return () => {
      // Clean up any location tracking when unmounting
      if (isCheckedIn) {
        stopLocationTracking();
      }
    };
  }, []);
  
  // Function to start tracking location
  const startLocationTracking = async () => {
    // Request background location permissions
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'This app needs background location permission to track your location during your shift.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Start the background location tracking
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10000, // Update every 10 seconds
      distanceInterval: 50, // Or every 50 meters
      foregroundService: {
        notificationTitle: 'Employee Locator',
        notificationBody: 'Tracking your location during your shift',
      },
    });
    
    // Update the user's status in Firebase
    if (user) {
      const now = new Date();
      const statusRef = ref(db, `employees/${user.uid}`);
      await set(statusRef, {
        isCheckedIn: true,
        checkInTime: now.toISOString(),
      });
      
      setIsCheckedIn(true);
      setCheckInTime(now);
    }
  };
  
  // Function to stop tracking location
  const stopLocationTracking = async () => {
    // Stop the background location tracking
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
    if (isRegistered) {
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }
    
    // Update the user's status in Firebase
    if (user) {
      const statusRef = ref(db, `employees/${user.uid}`);
      await set(statusRef, {
        isCheckedIn: false,
        checkInTime: null,
      });
      
      // Remove the user's location from the locations list
      const locationRef = ref(db, `locations/${user.uid}`);
      await set(locationRef, null);
      
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };
  
  // Handle the check-in/check-out button press
  const handleCheckInOut = async () => {
    try {
      if (isCheckedIn) {
        await stopLocationTracking();
        Alert.alert('Success', 'You have checked out successfully');
      } else {
        await startLocationTracking();
        Alert.alert('Success', 'You have checked in successfully');
      }
    } catch (error) {
      console.error('Error handling check in/out:', error);
      Alert.alert('Error', 'There was an error processing your request');
    }
  };
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle going back to role selection
  const handleBack = () => {
    navigation.navigate('RoleSelection');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Employee View" />
      </Appbar.Header>
      
      <View style={styles.content}>
        <Surface style={styles.mapContainer}>
          {location ? (
            <MapView
              style={styles.map}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
                description="This is your current position"
              />
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text>{errorMsg || 'Loading map...'}</Text>
            </View>
          )}
        </Surface>
        
        <Surface style={styles.statusContainer}>
          <Title style={styles.statusTitle}>
            Status: {isCheckedIn ? 'Checked In' : 'Checked Out'}
          </Title>
          
          {isCheckedIn && checkInTime && (
            <Text style={styles.checkInTime}>
              Checked in at {formatTime(checkInTime)}
            </Text>
          )}
          
          <Text style={styles.statusDescription}>
            {isCheckedIn
              ? 'Your location is being shared with managers. When you finish your shift, please check out.'
              : 'Check in to start sharing your location with managers during your shift.'}
          </Text>
          
          <Button
            mode="contained"
            onPress={handleCheckInOut}
            style={[
              styles.checkButton,
              { backgroundColor: isCheckedIn ? '#e53935' : '#4caf50' },
            ]}
            contentStyle={styles.buttonContent}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </Button>
        </Surface>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  statusContainer: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  statusTitle: {
    fontSize: 22,
    marginBottom: 8,
  },
  checkInTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statusDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  checkButton: {
    paddingVertical: 8,
  },
  buttonContent: {
    height: 48,
  },
});

export default EmployeeScreen; 