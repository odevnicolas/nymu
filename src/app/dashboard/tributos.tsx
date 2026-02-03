import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Tributos() {
  const tributos = [
    {
      id: "1",
      sigla: "DAS",
      nome: "Documento de Arrecadação do Simples Nacional",
      vencimento: "Vence em 19/04/2024",
      valor: "R$ 499,00",
      color: "#E5E7EB",
      letter: "I",
    },
    {
      id: "2",
      sigla: "DARF",
      nome: "Documento de Arrecadação de Receitas Federais",
      vencimento: "Vence em 5 dias",
      valor: "R$ 1.499,00",
      color: "#FEF3C7",
      letter: "I",
    },
    {
      id: "3",
      sigla: "CSLL",
      nome: "Imposto federal que incide sobre o lucro líquido da empresa",
      vencimento: "Vence Hoje",
      valor: "R$ 2.4000,00",
      color: "#FEE2E2",
      letter: "C",
    },
    {
      id: "4",
      sigla: "ICMS - Vencido",
      nome: "Imposto estadual que incide sobre a circulação de mercadorias e alguns serviços",
      vencimento: "Vence em 19/04/2024",
      valor: "R$ 1.4000,00",
      color: "#E5E7EB",
      letter: "I",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header cinza */}
      <View style={styles.header} />

      {/* Card de resumo amarelo sobreposto */}
      <View style={styles.summaryCardContainer}>
        <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total de Impostos</Text>
            <Text style={styles.summaryValue}>R$ 4.388,00</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Qtd. Boletos</Text>
            <Text style={styles.summaryValue}>3</Text>
          </View>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>DAS</Text>
            <Text style={styles.summaryValue}>R$ 499,00</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>DARF</Text>
            <Text style={styles.summaryValue}>R$ 4.000,00</Text>
          </View>
        </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
      {/* Acesso Rápido */}
      <View style={styles.quickAccessContainer}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.quickAccessButtons}>
          <TouchableOpacity 
            style={styles.quickButton} 
            activeOpacity={0.7}
            onPress={() => router.push("/dashboard/glossario")}
          >
            <Ionicons name="help-circle-outline" size={32} color="#1F2937" />
            <Text style={styles.quickButtonText}>Glossário</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickButton} activeOpacity={0.7}>
            <Ionicons name="folder-open-outline" size={32} color="#1F2937" />
            <Text style={styles.quickButtonText}>Upload{'\n'}de Arquivos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vencimentos deste Mês */}
      <View style={styles.vencimentosContainer}>
        <Text style={styles.sectionTitle}>Vencimentos deste Mês</Text>
        <View style={styles.yellowLine} />
        
        {tributos.map((tributo, index) => (
          <View key={tributo.id}>
            <View style={styles.tributoItem}>
              <View style={[styles.tributoIcon, { backgroundColor: tributo.color }]}>
                <Text style={styles.tributoLetter}>{tributo.letter}</Text>
              </View>
              
              <View style={styles.tributoContent}>
                <Text style={styles.tributoSigla}>{tributo.sigla}</Text>
                <Text style={styles.tributoNome}>{tributo.nome}</Text>
                <View style={styles.tributoFooter}>
                  <Text style={styles.tributoVencimento}>{tributo.vencimento}</Text>
                  <Text style={styles.tributoValor}>{tributo.valor}</Text>
                </View>
              </View>
            </View>
            {index < tributos.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    backgroundColor: "#333333",
    height: 180,
    width: "100%",
  },
  summaryCardContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  summaryCard: {
    backgroundColor: "#FAB41B",
    padding: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 16,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "Urbanist_600SemiBold",
    color: "#000000",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: "Urbanist_700Bold",
    color: "#000000",
  },
  quickAccessContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    marginTop: 190,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  quickAccessButtons: {
    flexDirection: "row",
    gap: 16,
  },
  quickButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  quickButtonText: {
    fontSize: 14,
    fontFamily: "Urbanist_600SemiBold",
    color: "#1F2937",
    textAlign: "center",
  },
  vencimentosContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  yellowLine: {
    height: 4,
    backgroundColor: "#FAB41B",
    marginBottom: 16,
    borderRadius: 2,
  },
  tributoItem: {
    flexDirection: "row",
    paddingVertical: 16,
    gap: 16,
  },
  tributoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tributoLetter: {
    fontSize: 20,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
  },
  tributoContent: {
    flex: 1,
    gap: 4,
  },
  tributoSigla: {
    fontSize: 16,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
  },
  tributoNome: {
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
    lineHeight: 20,
  },
  tributoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  tributoVencimento: {
    fontSize: 12,
    fontFamily: "Urbanist_400Regular",
    color: "#9CA3AF",
  },
  tributoValor: {
    fontSize: 14,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 64,
  },
});
