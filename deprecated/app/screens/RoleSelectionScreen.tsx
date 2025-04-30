import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Title, Text, Card } from 'react-native-paper';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  RoleSelection: undefined;
  Employee: undefined;
  Manager: undefined;
  Login: undefined;
};

type RoleSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RoleSelection'
>;

const RoleSelectionScreen = () => {
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>();
  const auth = getAuth();

  const handleRoleSelection = (role: 'Employee' | 'Manager') => {
    navigation.navigate(role);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener in App.tsx will handle returning to the login screen
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/logo-placeholder.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Title style={styles.title}>Employee Locator</Title>
        <Text style={styles.subtitle}>Select your role</Text>
      </View>

      <View style={styles.cardsContainer}>
        <Card style={styles.card} onPress={() => handleRoleSelection('Manager')}>
          <Card.Cover source={require('../assets/manager-placeholder.png')} />
          <Card.Content>
            <Title style={styles.cardTitle}>Manager</Title>
            <Text>View and contact employees on a live map</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => handleRoleSelection('Manager')}>
              Continue as Manager
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card} onPress={() => handleRoleSelection('Employee')}>
          <Card.Cover source={require('../assets/employee-placeholder.png')} />
          <Card.Content>
            <Title style={styles.cardTitle}>Employee</Title>
            <Text>Check in/out and share your location during shifts</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => handleRoleSelection('Employee')}>
              Continue as Employee
            </Button>
          </Card.Actions>
        </Card>
      </View>

      <Button 
        mode="outlined" 
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
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
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  card: {
    marginBottom: 15,
    elevation: 4,
  },
  cardTitle: {
    marginTop: 10,
    marginBottom: 5,
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default RoleSelectionScreen; 