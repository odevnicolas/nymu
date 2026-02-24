import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Documentos() {
  const [showDocumentoVazio, setShowDocumentoVazio] = useState(false);

  const empresaDocuments = [
    "CNPJ",
    "Contrato Social",
    "Inscrição Municipal",
    "Simples Nacional",
    "E-CNPJ",
    "Termo",
  ];

  const pessoaFisicaDocuments = [
    "CNH",
    "CRM",
    "Título de Eleitor",
  ];

  const handleDocumentPress = () => {
    setShowDocumentoVazio(true);
  };

  // Tela branca com mensagem de nenhum documento enviado
  if (showDocumentoVazio) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowDocumentoVazio(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Documento</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.emptyDocumentScreen}>
          <View style={styles.emptyDocumentIcons}>
            <Ionicons name="document-text-outline" size={64} color="#E5E7EB" />
            <View style={styles.emptyDocumentIconSmall}>
              <Ionicons name="cloud-upload-outline" size={32} color="#FAB41B" />
            </View>
          </View>
          <Text style={styles.emptyDocumentTitle}>Nenhum documento enviado no momento</Text>
          <Text style={styles.emptyDocumentSubtitle}>
            Quando você enviar um documento, ele aparecerá aqui
          </Text>
        </View>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Documentos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Seção Empresa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empresa</Text>
          <View style={styles.yellowLine} />
          
          {empresaDocuments.map((doc, index) => (
            <View key={doc}>
              <TouchableOpacity
                style={styles.documentItem}
                activeOpacity={0.7}
                onPress={handleDocumentPress}
              >
                <Ionicons name="document-text-outline" size={20} color="#1F2937" />
                <Text style={styles.documentText}>{doc}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {index < empresaDocuments.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Seção Pessoa Física */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pessoa Física</Text>
          <View style={styles.yellowLine} />
          
          {pessoaFisicaDocuments.map((doc, index) => (
            <View key={doc}>
              <TouchableOpacity
                style={styles.documentItem}
                activeOpacity={0.7}
                onPress={handleDocumentPress}
              >
                <Ionicons name="document-text-outline" size={20} color="#1F2937" />
                <Text style={styles.documentText}>{doc}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {index < pessoaFisicaDocuments.length - 1 && <View style={styles.divider} />}
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
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  yellowLine: {
    height: 4,
    backgroundColor: "#FAB41B",
    marginBottom: 16,
    borderRadius: 2,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  documentText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist_500Medium",
    color: "#1F2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 32,
  },
  emptyDocumentScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyDocumentIcons: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  emptyDocumentIconSmall: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FAB41B",
  },
  emptyDocumentTitle: {
    fontSize: 18,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyDocumentSubtitle: {
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
