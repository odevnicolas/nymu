/**
 * Modal para cancelar nota fiscal
 */

import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotaFiscal } from '@/lib/api/types';

interface CancelarNFModalProps {
  visible: boolean;
  onClose: () => void;
  notaFiscal: NotaFiscal | null;
  onConfirm: (reason: string) => Promise<void>;
}

export function CancelarNFModal({
  visible,
  onClose,
  notaFiscal,
  onConfirm,
}: CancelarNFModalProps) {
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setReason('');
    setReasonError('');
    onClose();
  };

  const handleConfirm = async () => {
    // Validar motivo
    if (!reason.trim() || reason.trim().length < 15) {
      setReasonError('O motivo deve ter no mínimo 15 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      await onConfirm(reason.trim());
      handleClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cancelar a nota fiscal. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!notaFiscal) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
          handleClose();
        }}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Modal Content */}
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Ionicons name="warning" size={32} color="#EF4444" />
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerTitle}>Cancelar Nota Fiscal</Text>
            <Text style={styles.headerSubtitle}>
              Nota #{notaFiscal.invoiceNumber || notaFiscal.id.substring(0, 8)}
            </Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.warningText}>
              Esta ação é <Text style={styles.warningBold}>irreversível</Text>. A nota fiscal
              será cancelada e não poderá ser utilizada.
            </Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Motivo do cancelamento <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, reasonError && styles.inputError]}
                value={reason}
                onChangeText={(text) => {
                  setReason(text);
                  if (text.trim().length >= 15) setReasonError('');
                }}
                placeholder="Digite o motivo do cancelamento (mínimo 15 caracteres)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                autoCapitalize="sentences"
                maxLength={255}
              />
              {reasonError ? <Text style={styles.errorText}>{reasonError}</Text> : null}
              <Text style={styles.helperText}>
                {reason.length}/255 caracteres
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>
                {isSubmitting ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Urbanist_500Medium',
    color: '#6B7280',
  },
  content: {
    padding: 24,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  warningBold: {
    fontFamily: 'Urbanist_700Bold',
    color: '#EF4444',
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
  },
});
