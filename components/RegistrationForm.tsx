import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

type RegistrationFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.phoneNumber) {
      setError('All fields are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Check if email already exists
      const emailQuery = await getDocs(query(collection(db, "users"), where("email", "==", formData.email)));
      if (!emailQuery.empty) {
        throw new Error('Email already exists. Please use a different email address.');
      }

      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Create user document
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        organizations: [], // Empty array to be populated when user joins organizations
        createdAt: new Date().toISOString()
      });

      // Registration successful
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#9CA3AF"
        value={formData.firstName}
        onChangeText={(value) => handleInputChange('firstName', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#9CA3AF"
        value={formData.lastName}
        onChangeText={(value) => handleInputChange('lastName', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#9CA3AF"
        value={formData.phoneNumber}
        onChangeText={(value) => handleInputChange('phoneNumber', value)}
        keyboardType="phone-pad"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 10,
    textAlign: 'center',
  },
}); 