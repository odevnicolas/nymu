import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Glossario() {
  const glossaryItems = [
    {
      id: "1",
      title: "Imposto sobre Circulação de Mercadorias e Serviços (ICMS)",
    },
    {
      id: "2",
      title: "Imposto sobre Serviços (ISS)",
    },
    {
      id: "3",
      title: "Contribuição para o Financiamento da Seguridade Social (COFINS)",
    },
    {
      id: "4",
      title: "Programa de Integração Social (PIS)",
    },
    {
      id: "5",
      title: "Contribuição Social sobre o Lucro Líquido (CSLL)",
    },
    {
      id: "6",
      title: "Simples Nacional",
    },
    {
      id: "7",
      title: "Lucro Presumido",
    },
    {
      id: "8",
      title: "Lucro Real",
    },
    {
      id: "9",
      title: "Declaração de Débitos e Créditos Tributários Federais (DCTF)",
    },
  ];

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
        <Text style={styles.headerTitle}>Glossário</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Lista de termos */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {glossaryItems.map((item, index) => (
          <View key={item.id}>
            <TouchableOpacity style={styles.glossaryItem} activeOpacity={0.7}>
              <Text style={styles.glossaryText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            {index < glossaryItems.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
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
    paddingTop: 8,
  },
  glossaryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  glossaryText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#1F2937",
    paddingRight: 16,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 24,
  },
});
