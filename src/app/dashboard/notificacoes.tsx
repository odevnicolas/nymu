import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Notificacoes() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Lista de notificações */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={24} color="#6B7280" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Titulo teste</Text>
            <Text style={styles.notificationText}>Teste de notificação</Text>
          </View>
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={24} color="#6B7280" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Titulo teste</Text>
            <Text style={styles.notificationText}>Teste de notificação</Text>
          </View>
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={24} color="#6B7280" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Titulo teste</Text>
            <Text style={styles.notificationText}>Teste de notificação</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
  },
  notificationText: {
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
  },
});
