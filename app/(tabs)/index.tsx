import React from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [role, setRole] = useState<"manager" | "worker">("worker");
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user.email);
        // Fetch user data from Firestore
        const userDoc = await getDocs(query(collection(db, "users"), where("email", "==", user.email)));
        if (!userDoc.empty) {
          const data = userDoc.docs[0].data();
          setUserData(data);
          
          // If user is a manager, fetch their organization's workers
          if (data.role === "manager") {
            const workersQuery = await getDocs(query(collection(db, "users"), where("organizationName", "==", data.organizationName)));
            const workersList = workersQuery.docs.map(doc => doc.data());
            setWorkers(workersList.filter(worker => worker.role === "worker"));
          }
        }
      } else {
        setUser(null);
        setUserData(null);
        setWorkers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    setError(null);
    setIsLoading(true);
    
    if (isLogin) {
      // Handle login
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUser(user.email);
          router.replace("/(tabs)");
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Handle signup
      try {
        // Check if organization name already exists (only for managers)
        if (role === "manager") {
          const orgQuery = await getDocs(query(collection(db, "users"), where("organizationName", "==", organizationName)));
          if (!orgQuery.empty) {
            setError("Organization name already exists. Please choose a different name.");
            setIsLoading(false);
            return;
          }
        } else {
          // For workers, verify that the organization exists
          const orgQuery = await getDocs(query(collection(db, "users"), where("organizationName", "==", organizationName)));
          if (orgQuery.empty) {
            setError("Organization not found. Please enter a valid organization name.");
            setIsLoading(false);
            return;
          }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`
        });

        // Store additional user data in Firestore
        try {
          await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            phoneNumber,
            email,
            role,
            organizationName,
            createdAt: new Date().toISOString()
          });

          // After successful signup and Firestore document creation, set the user state
          setUser(user.email);
          
          // Fetch the newly created user data
          const userDoc = await getDocs(query(collection(db, "users"), where("email", "==", user.email)));
          if (!userDoc.empty) {
            const data = userDoc.docs[0].data();
            setUserData(data);
            
            // If user is a manager, fetch their organization's workers
            if (data.role === "manager") {
              const workersQuery = await getDocs(query(collection(db, "users"), where("organizationName", "==", data.organizationName)));
              const workersList = workersQuery.docs.map(doc => doc.data());
              setWorkers(workersList.filter(worker => worker.role === "worker"));
            }
          }
          
          // Navigate to the tabs screen
          router.replace("/(tabs)");
        } catch (error) {
          console.error("Error creating user:", error);
          setError("Error creating user profile. Please try again.");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  if (user && userData) {
    return (
      <View style={styles.container}>
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>Welcome, {userData.firstName} {userData.lastName}</Text>
          <Text style={styles.organizationText}>Organization: {userData.organizationName}</Text>
          <Text style={styles.roleText}>Role: {userData.role}</Text>
          
          {userData.role === "manager" && (
            <View style={styles.workersContainer}>
              <Text style={styles.workersTitle}>Workers in your organization:</Text>
              {workers.length > 0 ? (
                workers.map((worker, index) => (
                  <View key={index} style={styles.workerCard}>
                    <Text style={styles.workerName}>{worker.firstName} {worker.lastName}</Text>
                    <Text style={styles.workerEmail}>{worker.email}</Text>
                    <Text style={styles.workerPhone}>{worker.phoneNumber}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noWorkersText}>No workers found in your organization</Text>
              )}
            </View>
          )}

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>
          
          {!isLogin && (
            <React.Fragment>
              <Text style={styles.label}>First Name</Text>
              <TextInput 
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
              
              <Text style={styles.label}>Last Name</Text>
              <TextInput 
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
              
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Organization Name</Text>
              <TextInput 
                style={styles.input}
                value={organizationName}
                onChangeText={setOrganizationName}
                placeholder="Enter your organization name"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />

              <Text style={styles.label}>Role</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[styles.roleButton, role === "worker" && styles.selectedRole]}
                  onPress={() => setRole("worker")}
                >
                  <Text style={[styles.roleText, role === "worker" && styles.selectedRoleText]}>Worker</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleButton, role === "manager" && styles.selectedRole]}
                  onPress={() => setRole("manager")}
                >
                  <Text style={[styles.roleText, role === "manager" && styles.selectedRoleText]}>Manager</Text>
                </TouchableOpacity>
              </View>
            </React.Fragment>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#666"
            secureTextEntry
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            disabled={isLoading}
          >
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  loggedInContainer: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 10,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: '#007AFF',
  },
  roleText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedRoleText: {
    color: '#fff',
  },
  organizationText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  workersContainer: {
    width: '100%',
    marginTop: 20,
  },
  workersTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  workerCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workerEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  workerPhone: {
    fontSize: 14,
    color: '#666',
  },
  noWorkersText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
