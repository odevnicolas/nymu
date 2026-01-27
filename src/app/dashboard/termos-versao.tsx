import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TermosVersao() {
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
        <Text style={styles.headerTitle}>Termos & Versão</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={20} color="#1F2937" />
          <Text style={styles.menuText}>Termo de Uso</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={20} color="#1F2937" />
          <Text style={styles.menuText}>Política de Privacidade</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.versionItem}>
          <Text style={styles.versionLabel}>Versão do Aplicativo</Text>
          <Text style={styles.versionValue}>7.10.69</Text>
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
  headerTitle: {
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
  content: {
    paddingTop: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist_500Medium",
    color: "#1F2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 24,
  },
  versionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  versionLabel: {
    fontSize: 16,
    fontFamily: "Urbanist_500Medium",
    color: "#1F2937",
  },
  versionValue: {
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
  },
});
