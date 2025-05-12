import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

type RegistrationFormData = {
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  phoneNumber: string;
  role: 'manager' | 'worker';
  organizationName: string;
  organizationPassword?: string;
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: '',
    role: 'worker',
    organizationName: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidatingOrg, setIsValidatingOrg] = useState(false);

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleRoleChange = (role: 'manager' | 'worker') => {
    setFormData(prev => ({
      ...prev,
      role,
      organizationPassword: role === 'worker' ? undefined : prev.organizationPassword
    }));
    setError(null);
  };

  const validateOrganization = async () => {
    if (!formData.organizationName.trim()) {
      setError('Organization name is required');
      return false;
    }

    setIsValidatingOrg(true);
    try {
      const orgQuery = await getDocs(query(collection(db, "organizations"), where("organizationName", "==", formData.organizationName)));
      
      if (formData.role === 'worker') {
        if (orgQuery.empty) {
          setError('Organization not found. Please enter a valid organization name.');
          return false;
        }
      } else {
        // For managers, we allow creating new organizations
        if (!orgQuery.empty && !formData.organizationPassword) {
          setError('This organization already exists. Please enter the organization password.');
          return false;
        }
      }
      return true;
    } catch (err) {
      setError('Error validating organization. Please try again.');
      return false;
    } finally {
      setIsValidatingOrg(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Validate all required fields
      if (!formData.email || !formData.firstName || !formData.lastName || 
          !formData.jobTitle || !formData.phoneNumber || !formData.organizationName) {
        setError('All fields are required');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Validate organization
      const isOrgValid = await validateOrganization();
      if (!isOrgValid) {
        return;
      }

      // TODO: Implement the actual registration logic here
      // This would involve creating the user in Firebase Auth
      // and storing the user data in Firestore

    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
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
        placeholder="Job Title"
        placeholderTextColor="#9CA3AF"
        value={formData.jobTitle}
        onChangeText={(value) => handleInputChange('jobTitle', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#9CA3AF"
        value={formData.phoneNumber}
        onChangeText={(value) => handleInputChange('phoneNumber', value)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Organization Name"
        placeholderTextColor="#9CA3AF"
        value={formData.organizationName}
        onChangeText={(value) => handleInputChange('organizationName', value)}
        autoCapitalize="words"
      />

      {formData.role === 'manager' && (
        <TextInput
          style={styles.input}
          placeholder="Organization Password (if joining existing)"
          placeholderTextColor="#9CA3AF"
          value={formData.organizationPassword}
          onChangeText={(value) => handleInputChange('organizationPassword', value)}
          secureTextEntry
        />
      )}

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Role:</Text>
        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              formData.role === 'manager' && styles.roleButtonActive
            ]}
            onPress={() => handleRoleChange('manager')}
          >
            <Text style={[
              styles.roleButtonText,
              formData.role === 'manager' && styles.roleButtonTextActive
            ]}>Manager</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              formData.role === 'worker' && styles.roleButtonActive
            ]}
            onPress={() => handleRoleChange('worker')}
          >
            <Text style={[
              styles.roleButtonText,
              formData.role === 'worker' && styles.roleButtonTextActive
            ]}>Worker</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading || isValidatingOrg}
      >
        {isLoading || isValidatingOrg ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
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
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#60A5FA',
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  roleButtonActive: {
    backgroundColor: '#2563EB',
  },
  roleButtonText: {
    color: '#60A5FA',
    fontSize: 16,
    fontWeight: '600',
  },
  roleButtonTextActive: {
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