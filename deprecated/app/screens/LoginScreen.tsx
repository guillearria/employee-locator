import React, { useState } from 'react';
import { StyleSheet, View, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from '@firebase/util';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener in App.js will handle the navigation
    } catch (error: unknown) {
      const errorMessage = error instanceof FirebaseError ? error.message : 'An unknown error occurred';
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, you can use these test accounts
  const loginAsManager = () => {
    setEmail('manager@test.com');
    setPassword('manager123');
  };

  const loginAsEmployee = () => {
    setEmail('employee@test.com');
    setPassword('employee123');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/logo-placeholder.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Title style={styles.title}>Employee Locator</Title>
        <Text style={styles.subtitle}>Track and connect with your team</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />
        <Button 
          mode="contained" 
          onPress={handleLogin} 
          loading={loading}
          style={styles.button}
        >
          Login
        </Button>

        {/* Demo shortcuts - remove in production */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoText}>For demo purposes:</Text>
          <View style={styles.demoButtonsContainer}>
            <Button 
              mode="outlined" 
              onPress={loginAsManager} 
              style={styles.demoButton}
            >
              Manager Demo
            </Button>
            <Button 
              mode="outlined" 
              onPress={loginAsEmployee} 
              style={styles.demoButton}
            >
              Employee Demo
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 6,
  },
  demoContainer: {
    marginTop: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  demoText: {
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  demoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoButton: {
    width: '48%',
  }
});

export default LoginScreen; 