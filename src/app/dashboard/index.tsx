import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/logoNymu-01.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="construct-outline" size={80} color="#333333" />
        </View>

        <Text style={styles.title}>Em desenvolvimento</Text>
        <Text style={styles.subtitle}>
          Estamos trabalhando para trazer{'\n'}
          uma experiência incrível para você!
        </Text>

        <View style={styles.robotContainer}>
          <Ionicons name="code-slash-outline" size={40} color="#6B7280" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  logo: {
    width: 140,
    height: 70,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -80,
  },
  iconContainer: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Urbanist_700Bold',
    color: '#2D3648',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  robotContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 50,
  },
});
