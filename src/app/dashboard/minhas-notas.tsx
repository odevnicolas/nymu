/**
 * Tela de listagem de notas fiscais emitidas
 */

import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  Linking,
} from 'react-native';
import { File, Paths } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useNotasFiscais } from '@/contexts/notas-fiscais-context';
import { DetalhesNFModal } from '@/components/detalhes-nf-modal';
import { CancelarNFModal } from '@/components/cancelar-nf-modal';
import { FiltroDataModal } from '@/components/filtro-data-modal';
import { NotaFiscal } from '@/lib/api/types';
import { formatCurrency } from '@/utils/formatters';
import { cancelNotaFiscal, downloadPdf, downloadXml } from '@/lib/api/notas-fiscais';

const STATUS_COLORS: Record<string, string> = {
  PROCESSANDO: '#3B82F6',
  EMITIDA: '#10B981',
  CANCELADA: '#6B7280',
  ERRO: '#EF4444',
  SIMULATED: '#F59E0B',
};

const STATUS_LABELS: Record<string, string> = {
  PROCESSANDO: 'Processando',
  EMITIDA: 'Emitida',
  CANCELADA: 'Cancelada',
  ERRO: 'Erro',
  SIMULATED: 'Simulada',
};

export default function MinhasNotas() {
  const { notasFiscais, isLoading, refreshNotasFiscais } = useNotasFiscais();
  const [notaSelecionada, setNotaSelecionada] = useState<NotaFiscal | null>(null);
  const [detalhesVisible, setDetalhesVisible] = useState(false);
  const [cancelarVisible, setCancelarVisible] = useState(false);
  const [filtroVisible, setFiltroVisible] = useState(false);
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);

  const notasFiltradas = useMemo(() => {
    if (!dataInicio && !dataFim) {
      return notasFiscais;
    }

    const start = dataInicio ? new Date(dataInicio) : null;
    const end = dataFim ? new Date(dataFim) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    return notasFiscais.filter((nota) => {
      const createdAt = nota.createdAt instanceof Date ? nota.createdAt : new Date(nota.createdAt);
      if (start && createdAt < start) return false;
      if (end && createdAt > end) return false;
      return true;
    });
  }, [dataFim, dataInicio, notasFiscais]);

  // Calcular total faturado
  const totalFaturado = notasFiltradas.reduce((acc, nota) => {
    if (nota.status === 'EMITIDA' || nota.status === 'SIMULATED') {
      return acc + nota.serviceValue;
    }
    return acc;
  }, 0);

  const handleRefresh = async () => {
    try {
      await refreshNotasFiscais();
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar as notas fiscais.');
    }
  };

  const handleNotaPress = (nota: NotaFiscal) => {
    setNotaSelecionada(nota);
    setDetalhesVisible(true);
  };

  const handleCancelarPress = (nota: NotaFiscal) => {
    setNotaSelecionada(nota);
    setCancelarVisible(true);
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!notaSelecionada) return;

    try {
      await cancelNotaFiscal(notaSelecionada.id, reason);
      await refreshNotasFiscais();
      Alert.alert('Sucesso', 'Nota fiscal cancelada com sucesso!');
    } catch (error: any) {
      throw error; // Re-throw para o modal tratar
    }
  };

  const openDownloadedBlob = async (blob: Blob, filename: string) => {
    const arrayBuffer = await blob.arrayBuffer();
    const file = new File(Paths.cache, filename);
    file.write(new Uint8Array(arrayBuffer));
    await Linking.openURL(file.uri);
  };

  const handleDownloadXML = async (nota: NotaFiscal) => {
    try {
      const blob = await downloadXml(nota.id);
      await openDownloadedBlob(blob, `nota-${nota.invoiceNumber || nota.id}.xml`);
    } catch {
      Alert.alert('Erro', 'Não foi possível baixar o XML desta nota.');
    }
  };

  const handleDownloadPDF = async (nota: NotaFiscal) => {
    try {
      const blob = await downloadPdf(nota.id);
      await openDownloadedBlob(blob, `nota-${nota.invoiceNumber || nota.id}.pdf`);
    } catch {
      Alert.alert('Erro', 'Não foi possível baixar o PDF desta nota.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notas Fiscais</Text>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setFiltroVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="filter" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Cards de Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total de NFs Emitidas</Text>
            <Text style={styles.statValue}>{formatCurrency(totalFaturado)}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Qtd. de NFs</Text>
            <Text style={styles.statValue}>{notasFiltradas.length}</Text>
          </View>
        </View>
      </View>

      {/* Acesso Rápido */}
      <View style={styles.quickAccessContainer}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => router.push('/dashboard/nota-fiscal')}
          activeOpacity={0.7}
        >
          <Ionicons name="document-text-outline" size={24} color="#1F2937" />
          <Text style={styles.quickAccessText}>Solicitar Emissão de NF</Text>
        </TouchableOpacity>
      </View>

      {/* Histórico */}
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Histórico de Notas Fiscais</Text>
      </View>

      {/* Lista */}
      <FlatList
        data={notasFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Nenhuma nota fiscal emitida</Text>
            <Text style={styles.emptySubtitle}>
              {dataInicio || dataFim
                ? 'Nenhuma nota encontrada no período selecionado.'
                : 'As notas fiscais que você solicitar aparecerão aqui.'}
            </Text>
          </View>
        }
        renderItem={({ item: nota }) => (
          <TouchableOpacity
            style={styles.notaCard}
            onPress={() => handleNotaPress(nota)}
            activeOpacity={0.7}
            accessibilityLabel={`Nota fiscal de ${nota.tomadorNome || 'N/A'} no valor de ${formatCurrency(nota.serviceValue)}`}
            accessibilityRole="button"
          >
            {/* Título */}
            <Text style={styles.notaTomador}>{nota.tomadorNome || 'N/A'}</Text>
            
            {/* Info */}
            <View style={styles.notaInfo}>
              <Text style={styles.notaDate}>
                Emitida em {nota.createdAt.toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.notaValue}>
                {formatCurrency(nota.serviceValue)}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: STATUS_COLORS[nota.status] || '#6B7280' },
                ]}
              />
              <Text style={styles.statusText}>
                {STATUS_LABELS[nota.status] || nota.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modals */}
      <DetalhesNFModal
        visible={detalhesVisible}
        onClose={() => {
          setDetalhesVisible(false);
          setNotaSelecionada(null);
        }}
        notaFiscal={notaSelecionada}
        onCancelar={handleCancelarPress}
        onDownloadXML={handleDownloadXML}
        onDownloadPDF={handleDownloadPDF}
      />

      <CancelarNFModal
        visible={cancelarVisible}
        onClose={() => {
          setCancelarVisible(false);
          setNotaSelecionada(null);
        }}
        notaFiscal={notaSelecionada}
        onConfirm={handleConfirmCancel}
      />

      <FiltroDataModal
        visible={filtroVisible}
        onClose={() => setFiltroVisible(false)}
        dataInicio={dataInicio}
        dataFim={dataFim}
        onFilter={(inicio, fim) => {
          setDataInicio(inicio);
          setDataFim(fim);
          setFiltroVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#333333',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist_700Bold',
    color: '#FFFFFF',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  statsCard: {
    backgroundColor: '#FAB41B',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
  },
  quickAccessContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  quickAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickAccessText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
  },
  historyHeader: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#FAB41B',
  },
  historyTitle: {
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  notaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notaTomador: {
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  notaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notaDate: {
    fontSize: 14,
    fontFamily: 'Urbanist_500Medium',
    color: '#6B7280',
  },
  notaValue: {
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#374151',
  },
});
