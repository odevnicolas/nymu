import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDocumentos } from "@/contexts/documentos-context";
import { documentCategories, documentTypeLabels, DocumentType } from "@/lib/api/documentos";

export default function Documentos() {
  const { documentos, loadingTipo, isRefreshing, refreshDocumentos } = useDocumentos();

  const isDocumentSent = (type: string) => {
    return documentos.some((doc) => doc.type === type);
  };

  const handleDocumentPress = (type: DocumentType) => {
    router.push(`/dashboard/documentos/${encodeURIComponent(type)}` as Href);
  };

  const renderDocumentItem = (type: DocumentType) => {
    const sent = isDocumentSent(type);
    const loading = loadingTipo === type;
    const label = documentTypeLabels[type] || type;

    return (
      <View key={type}>
        <TouchableOpacity
          style={styles.documentItem}
          activeOpacity={0.7}
          onPress={() => handleDocumentPress(type)}
          disabled={loading}
          accessibilityLabel={`Documento ${label}`}
          accessibilityRole="button"
        >
          <View style={[styles.iconContainer, sent && styles.iconContainerSent]}>
            {loading ? (
              <ActivityIndicator size="small" color="#FAB41B" />
            ) : (
              <Ionicons
                name={sent ? "checkmark-circle" : "document-text-outline"}
                size={20}
                color={sent ? "#10B981" : "#1F2937"}
              />
            )}
          </View>
          <Text style={[styles.documentText, sent && styles.documentTextSent]}>{label}</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
    );
  };

  const renderSection = (title: string, types: readonly string[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.yellowLine} />

      {types.map((type) => renderDocumentItem(type as DocumentType))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documentos</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => refreshDocumentos()} />}
      >
        {renderSection("Empresa", documentCategories.EMPRESA)}
        {renderSection("Pessoa Física", documentCategories.PESSOA_FISICA)}
        {renderSection("Certidões e declarações", documentCategories.CERTIDOES)}
        {renderSection("Outros", documentCategories.OUTROS)}
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
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerSent: {
    backgroundColor: "#D1FAE5",
  },
  documentText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Urbanist_500Medium",
    color: "#1F2937",
    lineHeight: 20,
  },
  documentTextSent: {
    color: "#10B981",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 44,
  },
});
