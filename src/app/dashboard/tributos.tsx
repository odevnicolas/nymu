import { Ionicons } from "@expo/vector-icons";
import { File, Paths } from "expo-file-system";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { WebView } from "react-native-webview";
import { Modal } from "react-native";
import { useImpostos } from "@/contexts/impostos-context";
import {
  type Imposto,
  downloadTaxDocument,
  formatCurrencyValue,
  formatVencimento,
  getStatusColor,
  getLetter
} from "@/lib/api/impostos";
import { isPdfDataUrl } from "@/lib/documentos/data-url";
import { SummaryCardSkeleton, ImpostosListSkeleton } from "@/components/ui/skeleton";

export default function Tributos() {
  const { impostos, summary, isLoading, refreshImpostos } = useImpostos();
  const [downloadingTaxId, setDownloadingTaxId] = useState<string | null>(null);
  const [pdfFileUri, setPdfFileUri] = useState<string | null>(null);

  const openTaxDocument = useCallback(async (tributo: Imposto) => {
    console.log("[tributos] item pressionado:", tributo);

    if (!tributo.url) {
      Alert.alert("Aviso", "Boleto indisponível no momento.");
      return;
    }

    // Se já temos o PDF em base64, abrir diretamente sem chamada extra à API
    if (isPdfDataUrl(tributo.url)) {
      try {
        const base64 = tributo.url.replace(/^data:[^;]+;base64,/i, "");
        const safeFilename = `tax-${tributo.id}.pdf`;
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const file = new File(Paths.cache, safeFilename);
        file.write(bytes);
        if (Platform.OS === "ios") {
          setPdfFileUri(file.uri);
        } else {
          await Linking.openURL(file.uri);
        }
      } catch (err) {
        Alert.alert("Erro", "Não foi possível abrir o documento PDF.");
      }
      return;
    }

    try {
      setDownloadingTaxId(tributo.id);
      const result = await downloadTaxDocument(tributo.id);

      if (!result) {
        Alert.alert("Aviso", "Documento não disponível para este imposto.");
        return;
      }

      const safeFilename = result.filename.replace(/[^a-z0-9._-]/gi, "_");
      const file = new File(Paths.cache, safeFilename);
      file.write(new Uint8Array(result.fileBytes));

      await Linking.openURL(file.uri);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível baixar o documento. Tente novamente.";
      Alert.alert("Erro", message);
    } finally {
      setDownloadingTaxId(null);
    }
  }, []);

  // Função para renderizar o card de resumo
  const renderSummaryCard = () => {
    if (isLoading && !summary) {
      return <SummaryCardSkeleton />;
    }

    if (!summary) {
      return (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total de Impostos</Text>
              <Text style={styles.summaryValue}>R$ 0,00</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Qtd. Boletos</Text>
              <Text style={styles.summaryValue}>0</Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>DAS</Text>
              <Text style={styles.summaryValue}>R$ 0,00</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>DARF</Text>
              <Text style={styles.summaryValue}>R$ 0,00</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total de Impostos</Text>
            <Text style={styles.summaryValue}>
              {formatCurrencyValue(summary.totalImpostos)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Qtd. Boletos</Text>
            <Text style={styles.summaryValue}>{summary.qtdBoletos}</Text>
          </View>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>DAS</Text>
            <Text style={styles.summaryValue}>
              {formatCurrencyValue(summary.das)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>DARF</Text>
            <Text style={styles.summaryValue}>
              {formatCurrencyValue(summary.darf)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Função para renderizar lista vazia
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>Nenhum imposto encontrado</Text>
      <Text style={styles.emptySubtitle}>
        Os impostos e tributos aparecerão aqui quando forem gerados pelo sistema.
      </Text>
    </View>
  );

  // Função para renderizar skeleton da lista
  const renderListSkeleton = () => (
    <View>
      <View style={styles.quickAccessContainer}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
      </View>
      <ImpostosListSkeleton count={3} />
    </View>
  );

  // Função para renderizar cada item
  const renderItem = ({ item: tributo, index }: { item: Imposto; index: number }) => (
    <View>
      <TouchableOpacity
        style={styles.tributoItem}
        activeOpacity={0.7}
        onPress={() => openTaxDocument(tributo)}
        disabled={downloadingTaxId === tributo.id}
        accessibilityLabel={`${tributo.sigla} - ${formatCurrencyValue(tributo.valor)}`}
        accessibilityRole="button"
      >
        <View style={[styles.tributoIcon, { backgroundColor: getStatusColor(tributo.status) }]}>
          <Text style={styles.tributoLetter}>{getLetter(tributo.sigla)}</Text>
        </View>
        
        <View style={styles.tributoContent}>
          <Text style={styles.tributoSigla}>{tributo.sigla}</Text>
          <Text style={styles.tributoNome} numberOfLines={2}>{tributo.nome}</Text>
          {!tributo.url && (
            <Text style={styles.tributoUnavailable}>Boleto indisponível</Text>
          )}
          <View style={styles.tributoFooter}>
            <Text style={styles.tributoVencimento}>
              {formatVencimento(tributo.dataVencimento)}
            </Text>
            <Text style={styles.tributoValor}>
              {formatCurrencyValue(tributo.valor)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {index < impostos.length - 1 && <View style={styles.divider} />}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header cinza */}
      <View style={styles.header} />

      {/* Card de resumo amarelo sobreposto */}
      <View style={styles.summaryCardContainer}>
        {renderSummaryCard()}
      </View>

      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.listContent}
        data={impostos}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshImpostos} />
        }
        ListEmptyComponent={() => {
          if (isLoading) {
            return renderListSkeleton();
          }
          return renderEmptyState();
        }}
        ListHeaderComponent={
          !isLoading && impostos.length > 0 ? (
            <View>
              {/* Acesso Rápido */}
              <View style={styles.quickAccessContainer}>
                <Text style={styles.sectionTitle}>Acesso Rápido</Text>
                <View style={styles.quickAccessButtons}>
                  <TouchableOpacity 
                    style={styles.quickButton} 
                    activeOpacity={0.7}
                    onPress={() => router.push("/dashboard/glossario")}
                    accessibilityLabel="Glossário"
                    accessibilityRole="button"
                  >
                    <Ionicons name="help-circle-outline" size={32} color="#1F2937" />
                    <Text style={styles.quickButtonText}>Glossário</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Título da seção de vencimentos */}
              <View style={styles.vencimentosContainer}>
                <Text style={styles.sectionTitle}>Vencimentos deste Mês</Text>
                <View style={styles.yellowLine} />
              </View>
            </View>
          ) : null
        }
        renderItem={renderItem}
      />

      {/* Modal de PDF para iOS */}
      <Modal
        visible={pdfFileUri != null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setPdfFileUri(null)}
      >
        <View style={styles.pdfModalRoot}>
          <TouchableOpacity
            style={styles.pdfModalClose}
            onPress={() => setPdfFileUri(null)}
            accessibilityRole="button"
            accessibilityLabel="Fechar visualização"
          >
            <Ionicons name="close" size={26} color="#1F2937" />
          </TouchableOpacity>
          {pdfFileUri && (
            <WebView
              source={{ uri: pdfFileUri }}
              style={styles.pdfWebView}
              originWhitelist={["*"]}
            />
          )}
        </View>
      </Modal>
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
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
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
    marginBottom: 16,
  },
  yellowLine: {
    height: 4,
    backgroundColor: "#FAB41B",
    marginBottom: 16,
    borderRadius: 2,
  },
  emptyState: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Urbanist_600SemiBold",
    color: "#1F2937",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 24,
  },
  tributoItem: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 16,
    backgroundColor: "#FFFFFF",
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
  tributoUnavailable: {
    fontSize: 12,
    fontFamily: "Urbanist_600SemiBold",
    color: "#D97706",
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
    marginLeft: 80,
  },
  pdfModalRoot: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  pdfModalClose: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    width: 56,
  },
  pdfWebView: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
});
