import { Text, TextInput, View, StyleSheet, Button } from "react-native";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const placeholderImage = require("../../assets/images/react-logo.png");

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createEmailUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        setUser(user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(`ERROR CODE: ${errorCode}\nERROR MESSAGE: ${errorMessage}`);
      });
  };

  return (
    <View
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.text}>Email</Text>
        <TextInput 
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.text}>Password</Text>
        <TextInput 
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Sign Up" onPress={() => createEmailUser()} />
      </View>
      {user && (
        <View style={styles.userContainer}>
          <Text style={styles.userText}>{user}</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    color: '#fff',
    marginBottom: 10,
  },
  link: {
    fontSize: 20,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  input: {
    width: "70%",
    height: 40,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  formContainer: {
    width: "70%",
    height: 40,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  errorContainer: {
    width: "70%",
    height: 40,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  errorText: {
    color: "#fff",
    marginBottom: 10,
  },
  userContainer: {
    width: "70%",
    height: 40,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  userText: {
    color: "#fff",
    marginBottom: 10,
  }
});
