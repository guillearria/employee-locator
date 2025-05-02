import { Text, View, StyleSheet, ScrollView } from "react-native";

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>About Employee Locator</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Purpose</Text>
          <Text style={styles.text}>
            Employee Locator is designed to help organizations maintain efficient communication and coordination while respecting employee privacy. Our platform enables secure location sharing during work hours, helping teams stay connected and productive.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For Workers</Text>
          <View style={styles.listContainer}>
            <Text style={styles.text}>As a worker, you have full control over your location sharing. You can:</Text>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Choose when to share your location</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>See who can view your location</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Access your location history</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Control your privacy settings</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For Managers</Text>
          <View style={styles.listContainer}>
            <Text style={styles.text}>Managers can use this platform to:</Text>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Coordinate team activities efficiently</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Ensure worker safety during shifts</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Optimize work assignments</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Maintain clear communication channels</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.listContainer}>
            <Text style={styles.text}>We take your privacy seriously. All location data is:</Text>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Encrypted during transmission</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Stored securely</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Accessible only to authorized personnel</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Deleted according to your organization's retention policy</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Getting Started</Text>
          <View style={styles.listContainer}>
            <Text style={styles.text}>To begin using Employee Locator:</Text>
            <View style={styles.listItem}>
              <Text style={styles.number}>1.</Text>
              <Text style={styles.listText}>Sign up with your organization</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.number}>2.</Text>
              <Text style={styles.listText}>Choose your role (worker or manager)</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.number}>3.</Text>
              <Text style={styles.listText}>Set up your profile</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.number}>4.</Text>
              <Text style={styles.listText}>Configure your privacy preferences</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#2c2c2e',
    padding: 15,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  text: {
    color: '#e5e5ea',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  listContainer: {
    marginTop: 5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    color: '#e5e5ea',
    fontSize: 16,
    marginRight: 8,
    lineHeight: 24,
  },
  number: {
    color: '#e5e5ea',
    fontSize: 16,
    marginRight: 8,
    lineHeight: 24,
    fontWeight: '600',
  },
  listText: {
    color: '#e5e5ea',
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
});