import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { File, Paths } from "expo-file-system";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useDocumentos } from "@/contexts/documentos-context";
import {
  ALL_DOCUMENT_TYPES,
  documentTypeLabels,
  type Document,
  type DocumentType,
} from "@/lib/api/documentos";
import {
  isImageDataUrl,
  isPdfDataUrl,
  isRemoteHttpUrl,
} from "@/lib/documentos/data-url";

const { width: SCREEN_W } = Dimensions.get("window");

function isLikelyRemotePdf(url: string): boolean {
  return /\.pdf($|\?)/i.test(url);
}

async function openPdfDataUrl(
  dataUrl: string,
  filename: string,
  onIosFileReady: (fileUri: string) => void,
): Promise<void> {
  try {
    const base64 = dataUrl.replace(/^data:[^;]+;base64,/i, "");
    const safeFilename = filename.replace(/[^a-z0-9._-]/gi, "_");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const file = new File(Paths.cache, safeFilename);
    file.write(bytes);
    if (Platform.OS === "ios") {
      onIosFileReady(file.uri);
    } else {
      await Linking.openURL(file.uri);
    }
  } catch {
    Alert.alert("Erro", "Não foi possível abrir o documento PDF.");
  }
}

function formatUploadedAt(iso?: string): string {
  if (!iso) {
    return "—";
  }
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function DocumentosPorTipoScreen() {
  const { height: winH } = useWindowDimensions();
  const { tipo: tipoParam } = useLocalSearchParams<{ tipo: string | string[] }>();
  const tipoRaw = Array.isArray(tipoParam) ? tipoParam[0] : tipoParam;
  const tipo = decodeURIComponent(tipoRaw ?? "") as DocumentType;

  const { documentos, carregarDocumentosDoTipo, loadingTipo, isRefreshing } = useDocumentos();
  const [viewer, setViewer] = useState<Document | null>(null);
  const [pdfFileUri, setPdfFileUri] = useState<string | null>(null);

  const tipoValido = useMemo(
    () => Boolean(tipoRaw && ALL_DOCUMENT_TYPES.includes(tipo as DocumentType)),
    [tipo, tipoRaw]
  );

  useEffect(() => {
    if (!tipoValido) {
      return;
    }
    carregarDocumentosDoTipo(tipo as DocumentType);
  }, [tipoValido, tipo, carregarDocumentosDoTipo]);

  const lista = useMemo(
    () => documentos.filter((d) => d.type === tipo),
    [documentos, tipo]
  );

  const titulo = tipoValido ? documentTypeLabels[tipo as DocumentType] ?? tipo : "Documentos";

  const onRefresh = useCallback(async () => {
    if (tipoValido) {
      await carregarDocumentosDoTipo(tipo as DocumentType);
    }
  }, [carregarDocumentosDoTipo, tipo, tipoValido]);

  const loading = tipoValido && loadingTipo === tipo;

  if (!tipoValido) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Documento</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Tipo inválido</Text>
          <Text style={styles.emptySubtitle}>Volte e selecione novamente.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {titulo}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {loading && lista.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FAB41B" />
          <Text style={styles.loadingText}>Carregando documentos…</Text>
        </View>
      ) : lista.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyScroll}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.emptyIcons}>
            <Ionicons name="document-text-outline" size={64} color="#E5E7EB" />
            <View style={styles.emptyIconSmall}>
              <Ionicons name="cloud-upload-outline" size={32} color="#FAB41B" />
            </View>
          </View>
          <Text style={styles.emptyTitle}>Nenhum documento enviado no momento</Text>
          <Text style={styles.emptySubtitle}>
            Quando você enviar um documento deste tipo, ele aparecerá aqui.
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => {
                const url = item.url ?? "";
                const filename = item.filename ?? item.name ?? "documento.pdf";
                if (isPdfDataUrl(url)) {
                  openPdfDataUrl(url, filename, setPdfFileUri);
                  return;
                }
                setViewer(item);
              }}
              accessibilityLabel={`Abrir ${item.filename ?? item.name}`}
            >
              <View style={styles.cardThumbWrap}>
                {item.url && isImageDataUrl(item.url) ? (
                  <Image
                    source={{ uri: item.url }}
                    style={styles.cardThumb}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={styles.cardThumbPlaceholder}>
                    <Ionicons name="document-text" size={32} color="#9CA3AF" />
                  </View>
                )}
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardFilename} numberOfLines={2}>
                  {item.filename ?? item.name}
                </Text>
                <Text style={styles.cardDate}>{formatUploadedAt(item.uploadedAt)}</Text>
                <Text style={styles.cardHint}>Toque para visualizar</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        />
      )}

      <Modal
        visible={viewer != null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {}}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setViewer(null)}
              accessibilityRole="button"
              accessibilityLabel="Fechar visualização"
            >
              <Ionicons name="close" size={26} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {viewer?.filename ?? viewer?.name ?? "Documento"}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {viewer?.url ? (
            // PDFs data URL são tratados via pdfFileUri — só chegam aqui imagens e URLs remotas
            isRemoteHttpUrl(viewer.url) && isLikelyRemotePdf(viewer.url) ? (
              <WebView
                source={{ uri: viewer.url }}
                style={[styles.webView, { height: winH - 100 }]}
                originWhitelist={["*"]}
              />
            ) : isImageDataUrl(viewer.url) || isRemoteHttpUrl(viewer.url) ? (
              <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
                <Image
                  source={{ uri: viewer.url }}
                  style={[styles.fullImage, { width: SCREEN_W }]}
                  contentFit="contain"
                  transition={200}
                />
              </ScrollView>
            ) : (
              <View style={styles.unsupported}>
                <Ionicons name="document-outline" size={48} color="#9CA3AF" />
                <Text style={styles.unsupportedText}>
                  Pré-visualização não disponível para este formato.
                </Text>
                <Text style={styles.unsupportedHint} numberOfLines={2}>
                  {viewer.filename ?? viewer.name}
                </Text>
              </View>
            )
          ) : (
            <View style={styles.centered}>
              <Text style={styles.emptySubtitle}>Arquivo não disponível.</Text>
            </View>
          )}
        </View>
      </Modal>

      {/* Modal de PDF para iOS — carrega arquivo temporário em WebView */}
      <Modal
        visible={pdfFileUri != null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setPdfFileUri(null)}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setPdfFileUri(null)}
              accessibilityRole="button"
              accessibilityLabel="Fechar visualização"
            >
              <Ionicons name="close" size={26} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Documento</Text>
            <View style={styles.placeholder} />
          </View>
          {pdfFileUri && (
            <WebView
              source={{ uri: pdfFileUri }}
              style={[styles.webView, { height: winH - 100 }]}
              originWhitelist={["*"]}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const PREVIEW_H = 220;

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
    fontSize: 18,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Urbanist_500Medium",
    color: "#6B7280",
  },
  listContent: {
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  cardThumbWrap: {
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  cardThumb: {
    width: 72,
    height: 72,
  },
  cardThumbPlaceholder: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardFilename: {
    fontSize: 15,
    fontFamily: "Urbanist_600SemiBold",
    color: "#1F2937",
  },
  cardDate: {
    fontSize: 13,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
    marginTop: 4,
  },
  cardHint: {
    fontSize: 12,
    fontFamily: "Urbanist_500Medium",
    color: "#FAB41B",
    marginTop: 6,
  },
  emptyScroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 48,
  },
  emptyIcons: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  emptyIconSmall: {
    position: "absolute",
    bottom: -8,
    right: "35%",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FAB41B",
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  modalRoot: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist_600SemiBold",
    color: "#1F2937",
    textAlign: "center",
    marginHorizontal: 8,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  fullImage: {
    minHeight: PREVIEW_H,
  },
  webView: {
    width: SCREEN_W,
    backgroundColor: "#F3F4F6",
  },
  unsupported: {
    padding: 32,
    alignItems: "center",
  },
  unsupportedText: {
    marginTop: 16,
    fontSize: 15,
    fontFamily: "Urbanist_500Medium",
    color: "#4B5563",
    textAlign: "center",
  },
  unsupportedHint: {
    marginTop: 8,
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
