/**
 * Modal de solicitação de nota fiscal
 */

import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Tomador, SolicitarNotaFiscalFormData } from '@/lib/api/types';
import { formatCompetencia, formatCurrencyInput, parseCurrency } from '@/utils/formatters';

interface SolicitarNFModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: SolicitarNotaFiscalFormData) => Promise<void>;
  tomador: Tomador | null;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;

export function SolicitarNFModal({ visible, onClose, onSubmit, tomador }: SolicitarNFModalProps) {
  const translateY = useSharedValue(MODAL_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  // Estado do formulário
  const [localPrestacao, setLocalPrestacao] = useState('');
  const [competencia, setCompetencia] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [valor, setValor] = useState('R$ 0,00');
  const [descricao, setDescricao] = useState('');

  // Estados de erro
  const [localPrestacaoError, setLocalPrestacaoError] = useState('');
  const [competenciaError, setCompetenciaError] = useState('');
  const [valorError, setValorError] = useState('');
  const [descricaoError, setDescricaoError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animações
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 150,
      });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(MODAL_HEIGHT, { duration: 300 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  // Reset form ao abrir
  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setLocalPrestacao('');
    setCompetencia('');
    setSelectedDate(new Date());
    setValor('R$ 0,00');
    setDescricao('');
    clearErrors();
  };

  const clearErrors = () => {
    setLocalPrestacaoError('');
    setCompetenciaError('');
    setValorError('');
    setDescricaoError('');
  };

  // Gesture para fechar arrastando para baixo
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > MODAL_HEIGHT * 0.3) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const handleClose = () => {
    translateY.value = withTiming(MODAL_HEIGHT, { duration: 300 });
    backdropOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  };

  // Handler do date picker
  const handleDateChange = (event: any, date?: Date) => {
    // Android fecha automaticamente após selecionar
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && date) {
      setSelectedDate(date);
      setCompetencia(formatCompetencia(date));
      setCompetenciaError('');
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  // Confirmar data no iOS
  const handleConfirmDate = () => {
    setCompetencia(formatCompetencia(selectedDate));
    setCompetenciaError('');
    setShowDatePicker(false);
  };

  // Cancelar data no iOS
  const handleCancelDate = () => {
    setShowDatePicker(false);
  };

  // Handler de valor
  const handleValorChange = (text: string) => {
    const formatted = formatCurrencyInput(text);
    setValor(formatted);

    const valueInCents = parseCurrency(formatted);
    if (valueInCents > 0) {
      setValorError('');
    }
  };

  // Validações
  const validateForm = (): boolean => {
    let isValid = true;
    clearErrors();

    // Local de prestação
    if (!localPrestacao.trim() || localPrestacao.trim().length < 3) {
      setLocalPrestacaoError('Mínimo de 3 caracteres');
      isValid = false;
    }

    // Competência
    if (!competencia) {
      setCompetenciaError('Campo obrigatório');
      isValid = false;
    }

    // Valor
    const valueInCents = parseCurrency(valor);
    if (valueInCents === 0) {
      setValorError('Valor deve ser maior que zero');
      isValid = false;
    }

    // Descrição
    if (!descricao.trim() || descricao.trim().length < 10) {
      setDescricaoError('Mínimo de 10 caracteres');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: SolicitarNotaFiscalFormData = {
        localPrestacao: localPrestacao.trim(),
        competencia: competencia,
        valor: parseCurrency(valor),
        descricao: descricao.trim(),
      };

      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Erro ao solicitar nota fiscal:', error);
      Alert.alert('Erro', 'Não foi possível solicitar a nota fiscal. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.5,
  }));

  if (!visible || !tomador) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Backdrop */}
          <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            handleClose();
          }}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animatedBackdropStyle]} />
          </TouchableWithoutFeedback>

          {/* Modal Content */}
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.modalContent, animatedModalStyle]}>
              {/* Handle */}
              <View style={styles.handle} />

              {/* Header */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.headerTitle}>Solicitar Nota Fiscal</Text>
                  <Text style={styles.headerSubtitle} numberOfLines={1}>
                    {tomador.nome}
                  </Text>
                </View>
              </View>

              {/* Formulário */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              >
                {/* Local da prestação */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Local da prestação de serviço <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, localPrestacaoError && styles.inputError]}
                    value={localPrestacao}
                    onChangeText={(text) => {
                      setLocalPrestacao(text);
                      if (text.trim().length >= 3) setLocalPrestacaoError('');
                    }}
                    placeholder="Digite o local"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                  {localPrestacaoError ? (
                    <Text style={styles.errorText}>{localPrestacaoError}</Text>
                  ) : null}
                </View>

                {/* Competência */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Competência (mm/aaaa) <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[styles.input, styles.inputTouchable, competenciaError && styles.inputError]}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.inputText, !competencia && styles.placeholder]}>
                      {competencia || 'Selecione o mês/ano'}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  {competenciaError ? (
                    <Text style={styles.errorText}>{competenciaError}</Text>
                  ) : null}
                </View>

                {/* DatePicker */}
                {showDatePicker && Platform.OS === 'android' && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}

                {/* DatePicker iOS Modal */}
                {showDatePicker && Platform.OS === 'ios' && (
                  <View style={styles.iosDatePickerContainer}>
                    <View style={styles.iosDatePickerHeader}>
                      <TouchableOpacity onPress={handleCancelDate}>
                        <Text style={styles.iosDatePickerButton}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleConfirmDate}>
                        <Text style={[styles.iosDatePickerButton, styles.iosDatePickerButtonPrimary]}>
                          Confirmar
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      style={styles.iosDatePicker}
                    />
                  </View>
                )}

                {/* Valor */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Valor da nota fiscal <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, valorError && styles.inputError]}
                    value={valor}
                    onChangeText={handleValorChange}
                    placeholder="R$ 0,00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    returnKeyType="next"
                  />
                  {valorError ? <Text style={styles.errorText}>{valorError}</Text> : null}
                </View>

                {/* Descrição */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Descrição <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, styles.inputMultiline, descricaoError && styles.inputError]}
                    value={descricao}
                    onChangeText={(text) => {
                      setDescricao(text);
                      if (text.trim().length >= 10) setDescricaoError('');
                    }}
                    placeholder="Descreva os serviços prestados"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    autoCapitalize="sentences"
                    returnKeyType="done"
                    blurOnSubmit
                  />
                  {descricaoError ? <Text style={styles.errorText}>{descricaoError}</Text> : null}
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  activeOpacity={0.7}
                >
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Solicitando...' : 'Solicitar Nota Fiscal'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </GestureDetector>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Urbanist_500Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
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
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  inputTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  inputMultiline: {
    height: 120,
    paddingTop: 12,
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
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#333333',
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
    color: '#FFFFFF',
  },
  iosDatePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iosDatePickerButton: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#6B7280',
  },
  iosDatePickerButtonPrimary: {
    color: '#3B82F6',
  },
  iosDatePicker: {
    height: 200,
  },
});
