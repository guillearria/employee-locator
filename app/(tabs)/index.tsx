import { Text, TextInput, View, StyleSheet, Button } from "react-native";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";

const placeholderImage = require("../../assets/images/react-logo.png");

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image
          source={placeholderImage}
          style={styles.image}
          contentFit="cover"
        />
      </View>
      <Text style={styles.text}>Email</Text>
      <TextInput 
        style={styles.input}
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.text}>Password</Text>
      <TextInput 
        style={styles.input}
        placeholder="Password" 
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={() => {}} />
      <Link href="/broken" style={styles.link}>Broken Link (FIX)</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
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
});
