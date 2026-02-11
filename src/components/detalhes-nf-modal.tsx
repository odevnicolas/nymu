/**
 * Modal de detalhes da nota fiscal
 */

import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotaFiscal } from '@/lib/api/types';
import { formatCurrency } from '@/utils/formatters';
import { formatCPF, formatCNPJ } from '@/utils/validators';

interface DetalhesNFModalProps {
  visible: boolean;
  onClose: () => void;
  notaFiscal: NotaFiscal | null;
  onCancelar?: (nota: NotaFiscal) => void;
  onDownloadXML?: (nota: NotaFiscal) => void;
  onDownloadPDF?: (nota: NotaFiscal) => void;
}

const STATUS_LABELS: Record<string, string> = {
  PROCESSANDO: 'Processando',
  EMITIDA: 'Emitida',
  CANCELADA: 'Cancelada',
  ERRO: 'Erro',
  SIMULATED: 'Simulada',
};

const STATUS_COLORS: Record<string, string> = {
  PROCESSANDO: '#3B82F6',
  EMITIDA: '#10B981',
  CANCELADA: '#6B7280',
  ERRO: '#EF4444',
  SIMULATED: '#F59E0B',
};

export function DetalhesNFModal({
  visible,
  onClose,
  notaFiscal,
  onCancelar,
  onDownloadXML,
  onDownloadPDF,
}: DetalhesNFModalProps) {
  if (!notaFiscal) return null;

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar Nota Fiscal',
      'Tem certeza que deseja cancelar esta nota fiscal? Esta ação não pode ser desfeita.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: () => {
            onClose();
            setTimeout(() => onCancelar?.(notaFiscal), 300);
          },
        },
      ]
    );
  };

  const canCancel = notaFiscal.status === 'EMITIDA' || notaFiscal.status === 'SIMULATED';
  const canDownload = notaFiscal.xmlPath || notaFiscal.pdfPath;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.backdrop} />
        </TouchableOpacity>

        {/* Modal Content */}
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Detalhes da Nota Fiscal</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {/* Status Badge */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: STATUS_COLORS[notaFiscal.status] || '#6B7280' },
              ]}
            >
              <Text style={styles.statusText}>
                {STATUS_LABELS[notaFiscal.status] || notaFiscal.status}
              </Text>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Informações da Nota */}
            {notaFiscal.invoiceNumber && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Número da Nota</Text>
                <Text style={styles.invoiceNumber}>{notaFiscal.invoiceNumber}</Text>
                {notaFiscal.series && (
                  <Text style={styles.sectionSubtitle}>Série: {notaFiscal.series}</Text>
                )}
              </View>
            )}

            {/* Tomador */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tomador de Serviço</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nome/Razão Social:</Text>
                <Text style={styles.infoValue}>{notaFiscal.tomadorNome || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CPF/CNPJ:</Text>
                <Text style={styles.infoValue}>
                  {notaFiscal.tomadorDocumento
                    ? notaFiscal.tomadorDocumento.length === 11
                      ? formatCPF(notaFiscal.tomadorDocumento)
                      : formatCNPJ(notaFiscal.tomadorDocumento)
                    : 'N/A'}
                </Text>
              </View>
            </View>

            {/* Serviço */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados do Serviço</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Descrição:</Text>
                <Text style={styles.infoValue}>{notaFiscal.serviceDescription}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Valor:</Text>
                <Text style={[styles.infoValue, styles.valueHighlight]}>
                  {formatCurrency(notaFiscal.serviceValue)}
                </Text>
              </View>
              {notaFiscal.localPrestacao && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Local de Prestação:</Text>
                  <Text style={styles.infoValue}>{notaFiscal.localPrestacao}</Text>
                </View>
              )}
              {notaFiscal.competencia && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Competência:</Text>
                  <Text style={styles.infoValue}>{notaFiscal.competencia}</Text>
                </View>
              )}
            </View>

            {/* Dados Fiscais */}
            {(notaFiscal.accessKey || notaFiscal.verificationCode || notaFiscal.protocol) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dados Fiscais</Text>
                {notaFiscal.accessKey && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Chave de Acesso:</Text>
                    <Text style={[styles.infoValue, styles.monospace]}>
                      {notaFiscal.accessKey}
                    </Text>
                  </View>
                )}
                {notaFiscal.verificationCode && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Código de Verificação:</Text>
                    <Text style={styles.infoValue}>{notaFiscal.verificationCode}</Text>
                  </View>
                )}
                {notaFiscal.protocol && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Protocolo:</Text>
                    <Text style={styles.infoValue}>{notaFiscal.protocol}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Timestamps */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Datas</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Criada em:</Text>
                <Text style={styles.infoValue}>
                  {notaFiscal.createdAt.toLocaleDateString('pt-BR')} às{' '}
                  {notaFiscal.createdAt.toLocaleTimeString('pt-BR')}
                </Text>
              </View>
              {notaFiscal.authorizedAt && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Autorizada em:</Text>
                  <Text style={styles.infoValue}>
                    {notaFiscal.authorizedAt.toLocaleDateString('pt-BR')} às{' '}
                    {notaFiscal.authorizedAt.toLocaleTimeString('pt-BR')}
                  </Text>
                </View>
              )}
              {notaFiscal.cancelledAt && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cancelada em:</Text>
                  <Text style={styles.infoValue}>
                    {notaFiscal.cancelledAt.toLocaleDateString('pt-BR')} às{' '}
                    {notaFiscal.cancelledAt.toLocaleTimeString('pt-BR')}
                  </Text>
                </View>
              )}
            </View>

            {/* Mensagem SEFAZ */}
            {notaFiscal.sefazMessage && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mensagem SEFAZ</Text>
                <Text style={styles.sefazMessage}>{notaFiscal.sefazMessage}</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            {canDownload && (
              <View style={styles.downloadButtons}>
                {notaFiscal.xmlPath && onDownloadXML && (
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => onDownloadXML(notaFiscal)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="code-download-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.downloadButtonText}>Baixar XML</Text>
                  </TouchableOpacity>
                )}
                {notaFiscal.pdfPath && onDownloadPDF && (
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => onDownloadPDF(notaFiscal)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.downloadButtonText}>Baixar PDF</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {canCancel && onCancelar && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelar}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.cancelButtonText}>Cancelar Nota Fiscal</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'Urbanist_500Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  invoiceNumber: {
    fontSize: 24,
    fontFamily: 'Urbanist_700Bold',
    color: '#333333',
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Urbanist_500Medium',
    color: '#1F2937',
  },
  valueHighlight: {
    fontSize: 18,
    fontFamily: 'Urbanist_700Bold',
    color: '#10B981',
  },
  monospace: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    fontSize: 12,
  },
  sefazMessage: {
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  downloadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    height: 48,
    borderRadius: 10,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    height: 48,
    borderRadius: 10,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
  },
});
