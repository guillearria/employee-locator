import { View, StyleSheet, Text } from "react-native";
import { Link, Stack } from "expo-router"; 

export default function NotFoundScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>This page doesn't exist.</Text>
            <Link href="/" style={styles.link}>Take me home.</Link>
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
    title: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    link: {
        color: '#fff',
        textDecorationLine: 'underline',
    },
});
