import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";

export default function Index() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <>
            <RegistrationForm />
            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => setIsLogin(true)}
            >
              <Text style={styles.switchButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  formContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#1F2937",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switchButton: {
    padding: 10,
  },
  switchButtonText: {
    color: "#60A5FA",
    textAlign: "center",
    fontSize: 16,
  },
});
