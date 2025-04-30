import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, Linking, Alert, TouchableOpacity } from 'react-native';
import { Appbar, Surface, Title, Text, List, Button, Avatar, Modal, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define types for employee data
type EmployeeLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  timestamp: number;
};

type Employee = {
  id: string;
  name: string;
  phone: string;
  jobTitle: string;
  location: EmployeeLocation;
  isCheckedIn: boolean;
  checkInTime: string | null;
};

// Define type for the root navigation
type RootStackParamList = {
  RoleSelection: undefined;
  Employee: undefined;
  Manager: undefined;
};

type ManagerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Manager'
>;

const ManagerScreen = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [managerLocation, setManagerLocation] = useState<Location.LocationObject | null>(null);
  const [isEmployeeListVisible, setIsEmployeeListVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<ManagerScreenNavigationProp>();
  
  // Get the current manager from Firebase
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  
  // Get the manager's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is needed to show your position on the map.');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      setManagerLocation(location);
    })();
  }, []);
  
  // Listen for changes to employee locations
  useEffect(() => {
    // For the demo, we'll use a hardcoded list of employees to populate the map
    // In a real app, you would fetch this from a proper user database
    const mockEmployees = [
      {
        id: 'emp1',
        name: 'John Doe',
        phone: '555-123-4567',
        jobTitle: 'Chef',
        isCheckedIn: false,
        checkInTime: null,
      },
      {
        id: 'emp2',
        name: 'Jane Smith',
        phone: '555-987-6543',
        jobTitle: 'Server',
        isCheckedIn: false,
        checkInTime: null,
      },
      {
        id: 'emp3',
        name: 'Alex Johnson',
        phone: '555-456-7890',
        jobTitle: 'Dishwasher',
        isCheckedIn: false,
        checkInTime: null,
      },
    ];
    
    // Listen for location updates for all employees
    const locationsRef = ref(db, 'locations');
    const unsubscribeLocations = onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      
      // Map through our mock employees and add real-time location data if available
      const updatedEmployees = mockEmployees.map(emp => {
        const locationData = data[emp.id];
        const employeeStatusRef = ref(db, `employees/${emp.id}`);
        
        // Get the check-in status
        onValue(employeeStatusRef, (statusSnapshot) => {
          const statusData = statusSnapshot.val();
          if (statusData) {
            emp.isCheckedIn = statusData.isCheckedIn || false;
            emp.checkInTime = statusData.checkInTime;
          }
        }, { onlyOnce: true });
        
        // If we have location data for this employee, add it
        if (locationData) {
          return {
            ...emp,
            location: {
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              accuracy: locationData.accuracy,
              heading: locationData.heading,
              timestamp: locationData.timestamp,
            },
          };
        }
        
        // Otherwise, for the demo, let's place them at random positions near the manager
        if (managerLocation && emp.isCheckedIn) {
          // Generate a random offset for demo purposes
          const latOffset = (Math.random() - 0.5) * 0.01; // About 1km max
          const lngOffset = (Math.random() - 0.5) * 0.01;
          
          return {
            ...emp,
            location: {
              latitude: managerLocation.coords.latitude + latOffset,
              longitude: managerLocation.coords.longitude + lngOffset,
              timestamp: Date.now(),
            },
          };
        }
        
        return emp;
      });
      
      // Filter out employees without location data or not checked in
      const activeEmployees = updatedEmployees.filter(
        emp => emp.location && emp.isCheckedIn
      );
      
      setEmployees(activeEmployees);
    });
    
    return () => {
      // Clean up the listener
      unsubscribeLocations();
    };
  }, [db, managerLocation]);
  
  // Handle contacting an employee
  const handleContact = (employee: Employee, method: 'call' | 'text') => {
    if (!employee.phone) {
      Alert.alert('Error', 'No phone number available for this employee');
      return;
    }
    
    if (method === 'call') {
      Linking.openURL(`tel:${employee.phone}`);
    } else {
      Linking.openURL(`sms:${employee.phone}`);
    }
  };
  
  // Select an employee when their marker is tapped
  const handleMarkerPress = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };
  
  // Handle going back to role selection
  const handleBack = () => {
    navigation.navigate('RoleSelection');
  };
  
  // Format time for display
  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Manager View" />
        <Appbar.Action 
          icon="account-group" 
          onPress={() => setIsEmployeeListVisible(!isEmployeeListVisible)} 
        />
      </Appbar.Header>
      
      <View style={styles.content}>
        {/* Main Map View */}
        <Surface style={[styles.mapContainer, isEmployeeListVisible && styles.mapContainerSplit]}>
          {managerLocation ? (
            <MapView
              style={styles.map}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              initialRegion={{
                latitude: managerLocation.coords.latitude,
                longitude: managerLocation.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
              {/* Marker for the manager's position */}
              <Marker
                coordinate={{
                  latitude: managerLocation.coords.latitude,
                  longitude: managerLocation.coords.longitude,
                }}
                title="You (Manager)"
                pinColor="blue"
              />
              
              {/* Markers for each employee */}
              {employees.map((employee) => (
                employee.location && (
                  <Marker
                    key={employee.id}
                    coordinate={{
                      latitude: employee.location.latitude,
                      longitude: employee.location.longitude,
                    }}
                    title={employee.name}
                    description={employee.jobTitle}
                    pinColor="red"
                    onPress={() => handleMarkerPress(employee)}
                  />
                )
              ))}
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text>Loading map...</Text>
            </View>
          )}
        </Surface>
        
        {/* Employee List Panel */}
        {isEmployeeListVisible && (
          <Surface style={styles.employeeListContainer}>
            <Title style={styles.listTitle}>
              Active Employees ({employees.length})
            </Title>
            {employees.length === 0 ? (
              <Text style={styles.noEmployeesText}>
                No employees are currently checked in.
              </Text>
            ) : (
              <List.Section>
                {employees.map((employee) => (
                  <List.Item
                    key={employee.id}
                    title={employee.name}
                    description={employee.jobTitle}
                    left={() => (
                      <Avatar.Text 
                        size={40} 
                        label={employee.name.split(' ').map(n => n[0]).join('')} 
                      />
                    )}
                    right={() => (
                      <View style={styles.employeeActions}>
                        <TouchableOpacity 
                          onPress={() => handleContact(employee, 'call')}
                          style={styles.actionButton}
                        >
                          <List.Icon icon="phone" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleContact(employee, 'text')}
                          style={styles.actionButton}
                        >
                          <List.Icon icon="message-text" />
                        </TouchableOpacity>
                      </View>
                    )}
                    onPress={() => handleMarkerPress(employee)}
                  />
                ))}
              </List.Section>
            )}
            <Button
              icon="chevron-right"
              mode="text"
              onPress={() => setIsEmployeeListVisible(false)}
              style={styles.hideListButton}
            >
              Hide List
            </Button>
          </Surface>
        )}
        
        {/* Employee Detail Modal */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            {selectedEmployee && (
              <>
                <Avatar.Text 
                  size={60} 
                  label={selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                  style={styles.modalAvatar}
                />
                <Title style={styles.modalTitle}>{selectedEmployee.name}</Title>
                <Text style={styles.modalSubtitle}>{selectedEmployee.jobTitle}</Text>
                
                {selectedEmployee.checkInTime && (
                  <Text style={styles.modalInfo}>
                    Checked in at: {formatTime(selectedEmployee.checkInTime)}
                  </Text>
                )}
                
                <View style={styles.modalActions}>
                  <Button
                    icon="phone"
                    mode="contained"
                    onPress={() => handleContact(selectedEmployee, 'call')}
                    style={styles.modalButton}
                  >
                    Call
                  </Button>
                  <Button
                    icon="message-text"
                    mode="contained"
                    onPress={() => handleContact(selectedEmployee, 'text')}
                    style={styles.modalButton}
                  >
                    Text
                  </Button>
                </View>
                
                <Button
                  mode="text"
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  Close
                </Button>
              </>
            )}
          </Modal>
        </Portal>
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
    flexDirection: 'row',
  },
  mapContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
  },
  mapContainerSplit: {
    flex: 0.6, // Reduce size when employee list is visible
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  employeeListContainer: {
    flex: 0.4,
    margin: 8,
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  listTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  noEmployeesText: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  employeeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
  },
  hideListButton: {
    marginTop: 'auto',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalAvatar: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  modalInfo: {
    marginBottom: 16,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 16,
  },
  modalButton: {
    width: '45%',
  },
  closeButton: {
    marginTop: 8,
  },
});

export default ManagerScreen; 