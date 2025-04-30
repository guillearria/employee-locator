import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword,
  UserCredential,
  User
} from 'firebase/auth';
import { 
  ref, 
  set, 
  onValue, 
  off, 
  DataSnapshot,
  update 
} from 'firebase/database';
import { auth, database } from '../config/firebase';

// Authentication functions
export const signIn = (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = (): Promise<void> => {
  return firebaseSignOut(auth);
};

export const createUser = (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Database functions
export const updateUserLocation = (userId: string, location: { 
  latitude: number, 
  longitude: number, 
  accuracy?: number,
  heading?: number,
  timestamp: number 
}): Promise<void> => {
  const locationRef = ref(database, `locations/${userId}`);
  return set(locationRef, location);
};

export const updateEmployeeStatus = (
  userId: string, 
  isCheckedIn: boolean, 
  checkInTime: string | null
): Promise<void> => {
  const employeeRef = ref(database, `employees/${userId}`);
  return set(employeeRef, {
    isCheckedIn,
    checkInTime
  });
};

export const listenToEmployeeLocation = (
  userId: string, 
  callback: (location: any) => void
): () => void => {
  const locationRef = ref(database, `locations/${userId}`);
  onValue(locationRef, (snapshot: DataSnapshot) => {
    callback(snapshot.val());
  });
  
  // Return a function to unsubscribe
  return () => off(locationRef);
};

export const listenToAllLocations = (
  callback: (locations: Record<string, any>) => void
): () => void => {
  const locationsRef = ref(database, 'locations');
  onValue(locationsRef, (snapshot: DataSnapshot) => {
    callback(snapshot.val() || {});
  });
  
  // Return a function to unsubscribe
  return () => off(locationsRef);
};

// For demo purposes - create and pre-populate mock data
export const setupMockData = async (): Promise<void> => {
  // Only setup mock data if database is empty
  const mockEmployees = [
    {
      id: 'emp1',
      name: 'John Doe',
      phone: '555-123-4567',
      jobTitle: 'Chef',
      isCheckedIn: false,
      checkInTime: null
    },
    {
      id: 'emp2',
      name: 'Jane Smith',
      phone: '555-987-6543',
      jobTitle: 'Server',
      isCheckedIn: false,
      checkInTime: null
    },
    {
      id: 'emp3',
      name: 'Alex Johnson',
      phone: '555-456-7890',
      jobTitle: 'Dishwasher',
      isCheckedIn: false,
      checkInTime: null
    }
  ];
  
  // Create references
  const usersRef = ref(database, 'users');
  const employeesStatusRef = ref(database, 'employees');
  
  // Check if data already exists
  onValue(usersRef, (snapshot) => {
    if (!snapshot.exists()) {
      // Set up mock data for each employee
      mockEmployees.forEach(employee => {
        // Store user profile
        set(ref(database, `users/${employee.id}`), {
          name: employee.name,
          phone: employee.phone,
          jobTitle: employee.jobTitle,
          role: 'employee'
        });
        
        // Initial status (not checked in)
        set(ref(database, `employees/${employee.id}`), {
          isCheckedIn: false,
          checkInTime: null
        });
      });
      
      // Add a mock manager
      set(ref(database, `users/manager1`), {
        name: 'Manager Admin',
        phone: '555-111-0000',
        jobTitle: 'Kitchen Manager',
        role: 'manager'
      });
    }
  }, { onlyOnce: true });
};

export default {
  auth,
  database,
  signIn,
  signOut,
  createUser,
  getCurrentUser,
  updateUserLocation,
  updateEmployeeStatus,
  listenToEmployeeLocation,
  listenToAllLocations,
  setupMockData
}; 