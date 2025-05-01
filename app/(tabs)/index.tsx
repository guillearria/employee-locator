import { Text, TextInput, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.email);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = () => {
    setError(null);
    const authFunction = isLogin ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
    
    authFunction(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user.email);
        router.replace("/(tabs)");
      })
      .catch((error) => {
        setError(error.message);
      });
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

  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>Welcome, {user}</Text>
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
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>
        
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
          style={styles.button}
          onPress={handleAuth}
        >
          <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
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
});
