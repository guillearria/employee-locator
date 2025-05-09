import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type RegistrationFormData = {
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  phoneNumber: string;
  role: 'manager' | 'worker';
  organizationIds: string[];
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    phoneNumber: '',
    role: 'worker',
    organizationIds: [],
  });

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleChange = (role: 'manager' | 'worker') => {
    setFormData(prev => ({
      ...prev,
      role
    }));
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

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
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
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
}); 