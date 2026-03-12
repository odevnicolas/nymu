import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDocumentos } from "@/contexts/documentos-context";
import { documentCategories, documentTypeLabels, DocumentType } from "@/lib/api/documentos";

export default function Documentos() {
  const { documentos, isLoading, refreshDocumentos } = useDocumentos();
  const [showDocumentoVazio, setShowDocumentoVazio] = useState(false);

  // Filtrar documentos por categoria
  const documentosEmpresa = useMemo(() => {
    return documentos.filter(doc => documentCategories.EMPRESA.includes(doc.type as any));
  }, [documentos]);

  const documentosPessoaFisica = useMemo(() => {
    return documentos.filter(doc => documentCategories.PESSOA_FISICA.includes(doc.type as any));
  }, [documentos]);

  // Verificar se um tipo de documento já foi enviado
  const isDocumentSent = (type: string) => {
    return documentos.some(doc => doc.type === type);
  };

  const handleDocumentPress = (type: DocumentType) => {
    // Se o documento já foi enviado, mostra detalhes
    if (isDocumentSent(type)) {
      // TODO: Implementar visualização do documento
      return;
    }
    // Se não foi enviado, mostra tela de upload
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

  // Renderiza um item de documento
  const renderDocumentItem = (type: DocumentType) => {
    const sent = isDocumentSent(type);
    const label = documentTypeLabels[type] || type;

    return (
      <View key={type}>
        <TouchableOpacity
          style={styles.documentItem}
          activeOpacity={0.7}
          onPress={() => handleDocumentPress(type)}
          accessibilityLabel={`Documento ${label}`}
          accessibilityRole="button"
        >
          <View style={[styles.iconContainer, sent && styles.iconContainerSent]}>
            <Ionicons 
              name={sent ? "checkmark-circle" : "document-text-outline"} 
              size={20} 
              color={sent ? "#10B981" : "#1F2937"} 
            />
          </View>
          <Text style={[styles.documentText, sent && styles.documentTextSent]}>
            {label}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
    );
  };

  // Renderiza uma seção de documentos
  const renderSection = (title: string, types: readonly string[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.yellowLine} />
      
      {types.map(type => renderDocumentItem(type as DocumentType))}
    </View>
  );

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
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => refreshDocumentos()} />
        }
      >
        {renderSection('Empresa', documentCategories.EMPRESA)}
        {renderSection('Pessoa Física', documentCategories.PESSOA_FISICA)}
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
