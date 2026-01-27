import { StyleSheet, Text, View } from "react-native";

export default function Tributos() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tributos</Text>
      <Text style={styles.subtitle}>Calcule e gerencie tributos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: "Urbanist_700Bold",
    color: "#2D3648",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
  },
});
