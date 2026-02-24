/**
 * Tela de solicitação de nota fiscal
 */

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTomadores } from '@/contexts/tomadores-context';
import { useNotasFiscais } from '@/contexts/notas-fiscais-context';
import { CadastroTomadorModal } from '@/components/cadastro-tomador-modal';
import { TomadorOpcoesModal } from '@/components/tomador-opcoes-modal';
import { VisualizarDadosModal } from '@/components/visualizar-dados-modal';
import { SolicitarNFModal } from '@/components/solicitar-nf-modal';
import { SucessoModal } from '@/components/sucesso-modal';
import { TomadorFormData, Tomador, SolicitarNotaFiscalFormData } from '@/lib/api/types';
import { formatCPF, formatCNPJ, formatPhone } from '@/utils/validators';

export default function NotaFiscal() {
  const { tomadores, addTomador, getTomadoresByTipo } = useTomadores();
  const { solicitarNotaFiscal } = useNotasFiscais();
  
  // Estados dos modais
  const [cadastroModalVisible, setCadastroModalVisible] = useState(false);
  const [opcoesModalVisible, setOpcoesModalVisible] = useState(false);
  const [visualizarModalVisible, setVisualizarModalVisible] = useState(false);
  const [solicitarNFModalVisible, setSolicitarNFModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalTipo, setSuccessModalTipo] = useState<'cadastro' | 'nota-fiscal'>('cadastro');
  
  // Tomador selecionado
  const [tomadorSelecionado, setTomadorSelecionado] = useState<Tomador | null>(null);

  // Aba ativa (PF ou PJ)
  const [abaAtiva, setAbaAtiva] = useState<'PF' | 'PJ'>('PJ');

  // Contadores
  const tomadoresPJ = useMemo(() => getTomadoresByTipo('PJ'), [tomadores, getTomadoresByTipo]);
  const tomadoresPF = useMemo(() => getTomadoresByTipo('PF'), [tomadores, getTomadoresByTipo]);
  
  // Tomadores filtrados pela aba ativa
  const tomadoresFiltrados = useMemo(() => 
    abaAtiva === 'PJ' ? tomadoresPJ : tomadoresPF,
    [abaAtiva, tomadoresPJ, tomadoresPF]
  );

  // Handlers de cadastro de tomador
  const handleOpenCadastroModal = () => {
    setCadastroModalVisible(true);
  };

  const handleCloseCadastroModal = () => {
    setCadastroModalVisible(false);
  };

  const handleSaveTomador = async (data: TomadorFormData) => {
    await addTomador(data);

    setSuccessModalTipo('cadastro');
    setSuccessModalVisible(true);
  };

  // Handlers de interação com tomador
  const handleTomadorPress = (tomador: Tomador) => {
    setTomadorSelecionado(tomador);
    setOpcoesModalVisible(true);
  };

  const handleCloseOpcoesModal = () => {
    setOpcoesModalVisible(false);
    // Pequeno delay antes de limpar o tomador selecionado
    setTimeout(() => setTomadorSelecionado(null), 300);
  };

  const handleSolicitarNF = () => {
    setOpcoesModalVisible(false);
    // Pequeno delay para suavizar a transição entre modais
    setTimeout(() => setSolicitarNFModalVisible(true), 300);
  };

  const handleVisualizarDados = () => {
    setOpcoesModalVisible(false);
    // Pequeno delay para suavizar a transição entre modais
    setTimeout(() => setVisualizarModalVisible(true), 300);
  };

  const handleCloseVisualizarModal = () => {
    setVisualizarModalVisible(false);
    setTimeout(() => setTomadorSelecionado(null), 300);
  };

  const handleCloseSolicitarNFModal = () => {
    setSolicitarNFModalVisible(false);
    setTimeout(() => setTomadorSelecionado(null), 300);
  };

  const handleSubmitSolicitacao = async (data: SolicitarNotaFiscalFormData) => {
    if (!tomadorSelecionado) return;

    await solicitarNotaFiscal({
      tomadorId: tomadorSelecionado.id,
      localPrestacao: data.localPrestacao,
      competencia: data.competencia,
      valor: data.valor,
      descricao: data.descricao,
    });

    setSolicitarNFModalVisible(false);
    setSuccessModalTipo('nota-fiscal');
    setSuccessModalVisible(true);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    setTomadorSelecionado(null);
  };

  // Empty State
  if (tomadores.length === 0) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Solicitar Nota Fiscal</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleOpenCadastroModal}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Cards de Contadores */}
        <View style={styles.cardsContainer}>
          <View style={styles.counterCard}>
            <Text style={styles.counterLabel}>Tomadores PJ</Text>
            <Text style={styles.counterValue}>0</Text>
          </View>

          <View style={styles.counterCard}>
            <Text style={styles.counterLabel}>Tomadores PF</Text>
            <Text style={styles.counterValue}>0</Text>
          </View>
        </View>

        {/* Empty State */}
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>
            Você não possui nenhuma nota fiscal emitida
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            Para que você possa iniciar a sua jornada de emissão de notas fiscais, você deverá
            cadastrar um Tomador de Serviço primeiro.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleOpenCadastroModal}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>Iniciar Cadastro</Text>
          </TouchableOpacity>
        </View>

        {/* Modals */}
        <CadastroTomadorModal
          visible={cadastroModalVisible}
          onClose={handleCloseCadastroModal}
          onSave={handleSaveTomador}
          initialTipo="PJ"
        />

        <SucessoModal
          visible={successModalVisible}
          onClose={handleCloseSuccessModal}
          tipo={successModalTipo}
        />
      </View>
    );
  }

  // Lista de Tomadores
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solicitar Nota Fiscal</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleOpenCadastroModal}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Cards de Contadores */}
      <View style={styles.cardsContainer}>
        <View style={styles.counterCard}>
          <Text style={styles.counterLabel}>Tomadores PJ</Text>
          <Text style={styles.counterValue}>{tomadoresPJ.length}</Text>
        </View>

        <View style={styles.counterCard}>
          <Text style={styles.counterLabel}>Tomadores PF</Text>
          <Text style={styles.counterValue}>{tomadoresPF.length}</Text>
        </View>
      </View>

      {/* Abas PF/PJ */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'PF' && styles.tabActive]}
          onPress={() => setAbaAtiva('PF')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, abaAtiva === 'PF' && styles.tabTextActive]}>
            Pessoa Física
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'PJ' && styles.tabActive]}
          onPress={() => setAbaAtiva('PJ')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, abaAtiva === 'PJ' && styles.tabTextActive]}>
            Pessoa Jurídica
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Tomadores Filtrados */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {tomadoresFiltrados.length === 0 ? (
          <View style={styles.emptyList}>
            <Ionicons 
              name={abaAtiva === 'PF' ? 'person-outline' : 'business-outline'} 
              size={48} 
              color="#9CA3AF" 
            />
            <Text style={styles.emptyText}>
              Nenhum tomador de {abaAtiva === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'} cadastrado
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleOpenCadastroModal}
              activeOpacity={0.7}
            >
              <Text style={styles.emptyButtonText}>Cadastrar {abaAtiva === 'PF' ? 'PF' : 'PJ'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          tomadoresFiltrados.map((tomador) => (
            <TouchableOpacity
              key={tomador.id}
              style={styles.tomadorCard}
              activeOpacity={0.7}
              onPress={() => handleTomadorPress(tomador)}
            >
              {/* Informações */}
              <View style={styles.tomadorInfo}>
                <Text style={styles.tomadorNome} numberOfLines={1}>
                  {tomador.nome}
                </Text>
                <Text style={styles.tomadorDocumento}>
                  {tomador.tipo === 'PF'
                    ? formatCPF(tomador.documento)
                    : formatCNPJ(tomador.documento)}
                </Text>
              </View>

              {/* Seta */}
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modals */}
      <CadastroTomadorModal
        visible={cadastroModalVisible}
        onClose={handleCloseCadastroModal}
        onSave={handleSaveTomador}
        initialTipo="PJ"
      />

      <TomadorOpcoesModal
        visible={opcoesModalVisible}
        onClose={handleCloseOpcoesModal}
        onSolicitarNF={handleSolicitarNF}
        onVisualizarDados={handleVisualizarDados}
      />

      <VisualizarDadosModal
        visible={visualizarModalVisible}
        onClose={handleCloseVisualizarModal}
        tomador={tomadorSelecionado}
      />

      <SolicitarNFModal
        visible={solicitarNFModalVisible}
        onClose={handleCloseSolicitarNFModal}
        onSubmit={handleSubmitSolicitacao}
        tomador={tomadorSelecionado}
      />

      <SucessoModal
        visible={successModalVisible}
        onClose={handleCloseSuccessModal}
        tipo={successModalTipo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  counterCard: {
    flex: 1,
    backgroundColor: '#FAB41B',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  counterLabel: {
    fontSize: 12,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
    textAlign: 'center',
  },
  counterValue: {
    fontSize: 32,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#333333',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  emptyList: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Urbanist_500Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#333333',
    height: 52,
    paddingHorizontal: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  tomadorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tomadorInfo: {
    flex: 1,
    gap: 6,
  },
  tomadorNome: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
  },
  tomadorDocumento: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
  },
  tomadorTelefone: {
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
    color: '#9CA3AF',
  },
});
