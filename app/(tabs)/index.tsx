import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";

const placeholderImage = require("../../assets/images/react-logo.png");

export default function Index() {
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
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/about" style={styles.link}>About Page</Link>
      <Link href="/broken" style={styles.link}>Broken Link</Link>
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
});
