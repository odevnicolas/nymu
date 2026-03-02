/**
 * Modal Bottom Sheet para cadastro de tomadores (PF/PJ)
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  validateCPF,
  validateCNPJ,
  formatCPF,
  formatCNPJ,
  formatPhone,
  formatCEP,
  cleanDocument,
} from '@/utils/validators';
import { TomadorFormData } from '@/lib/api/types';

interface CadastroTomadorModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: TomadorFormData) => Promise<void>;
  initialTipo?: 'PF' | 'PJ';
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.9;

export function CadastroTomadorModal({
  visible,
  onClose,
  onSave,
  initialTipo = 'PJ',
}: CadastroTomadorModalProps) {
  const translateY = useSharedValue(MODAL_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  // Estado do formulário
  const [tipo, setTipo] = useState<'PF' | 'PJ'>(initialTipo);
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [telefone, setTelefone] = useState('');

  // Estados de erro
  const [nomeError, setNomeError] = useState('');
  const [documentoError, setDocumentoError] = useState('');
  const [logradouroError, setLogradouroError] = useState('');
  const [numeroError, setNumeroError] = useState('');
  const [cepError, setCepError] = useState('');
  const [bairroError, setBairroError] = useState('');
  const [cidadeError, setCidadeError] = useState('');
  const [ufError, setUfError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animações (subida suave na abertura, sem bounce)
  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
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
    setTipo(initialTipo);
    setNome('');
    setDocumento('');
    setInscricaoMunicipal('');
    setLogradouro('');
    setNumero('');
    setCep('');
    setBairro('');
    setCidade('');
    setUf('');
    setTelefone('');
    clearErrors();
  };

  const clearErrors = () => {
    setNomeError('');
    setDocumentoError('');
    setLogradouroError('');
    setNumeroError('');
    setCepError('');
    setBairroError('');
    setCidadeError('');
    setUfError('');
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
        translateY.value = withTiming(0, { duration: 200 });
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

  // Validações
  const validateForm = (): boolean => {
    let isValid = true;
    clearErrors();

    // Nome
    if (!nome.trim()) {
      setNomeError('Campo obrigatório');
      isValid = false;
    }

    // Documento (CPF ou CNPJ)
    const cleanedDoc = cleanDocument(documento);
    if (!cleanedDoc) {
      setDocumentoError('Campo obrigatório');
      isValid = false;
    } else if (tipo === 'PF' && !validateCPF(cleanedDoc)) {
      setDocumentoError('CPF inválido');
      isValid = false;
    } else if (tipo === 'PJ' && !validateCNPJ(cleanedDoc)) {
      setDocumentoError('CNPJ inválido');
      isValid = false;
    }

    // Endereço
    if (!logradouro.trim()) {
      setLogradouroError('Campo obrigatório');
      isValid = false;
    }

    if (!numero.trim()) {
      setNumeroError('Campo obrigatório');
      isValid = false;
    }

    const cleanedCep = cleanDocument(cep);
    if (!cleanedCep || cleanedCep.length !== 8) {
      setCepError('CEP inválido');
      isValid = false;
    }

    if (!bairro.trim()) {
      setBairroError('Campo obrigatório');
      isValid = false;
    }

    if (!cidade.trim()) {
      setCidadeError('Campo obrigatório');
      isValid = false;
    }

    if (!uf.trim() || uf.length !== 2) {
      setUfError('UF inválido (ex: SP)');
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: TomadorFormData = {
        tipo,
        nome: nome.trim(),
        documento: cleanDocument(documento),
        inscricaoMunicipal: tipo === 'PJ' && inscricaoMunicipal.trim() 
          ? inscricaoMunicipal.trim() 
          : undefined,
        logradouro: logradouro.trim(),
        numero: numero.trim(),
        cep: cleanDocument(cep),
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        uf: uf.trim().toUpperCase(),
        telefone: telefone.trim() ? cleanDocument(telefone) : undefined,
      };

      await onSave(formData);
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar tomador:', error);
      Alert.alert('Erro', 'Não foi possível salvar o tomador. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers de formatação
  const handleDocumentoChange = (text: string) => {
    const formatted = tipo === 'PF' ? formatCPF(text) : formatCNPJ(text);
    setDocumento(formatted);
    
    // Validação em tempo real
    const cleaned = cleanDocument(formatted);
    if (cleaned.length > 0) {
      if (tipo === 'PF' && cleaned.length === 11) {
        if (!validateCPF(cleaned)) {
          setDocumentoError('CPF inválido');
        } else {
          setDocumentoError('');
        }
      } else if (tipo === 'PJ' && cleaned.length === 14) {
        if (!validateCNPJ(cleaned)) {
          setDocumentoError('CNPJ inválido');
        } else {
          setDocumentoError('');
        }
      } else {
        setDocumentoError('');
      }
    }
  };

  const handleTipoChange = (newTipo: 'PF' | 'PJ') => {
    setTipo(newTipo);
    setDocumento('');
    setInscricaoMunicipal('');
    setDocumentoError('');
  };

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.5,
  }));

  if (!visible) return null;

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
                <Text style={styles.headerTitle}>Cadastrar Tomador</Text>
              </View>

              {/* Toggle PF/PJ */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, tipo === 'PF' && styles.toggleButtonActive]}
                  onPress={() => handleTipoChange('PF')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toggleText, tipo === 'PF' && styles.toggleTextActive]}>
                    Pessoa Física
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.toggleButton, tipo === 'PJ' && styles.toggleButtonActive]}
                  onPress={() => handleTipoChange('PJ')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toggleText, tipo === 'PJ' && styles.toggleTextActive]}>
                    Pessoa Jurídica
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Formulário */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              >
                {/* Nome */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    {tipo === 'PF' ? 'Nome' : 'Razão Social ou Nome'} <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, nomeError && styles.inputError]}
                    value={nome}
                    onChangeText={(text) => {
                      setNome(text);
                      if (text.trim()) setNomeError('');
                    }}
                    placeholder={tipo === 'PF' ? 'Digite o nome completo' : 'Digite a razão social'}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                  {nomeError ? <Text style={styles.errorText}>{nomeError}</Text> : null}
                </View>

                {/* CPF ou CNPJ */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    {tipo === 'PF' ? 'CPF' : 'CNPJ'} <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, documentoError && styles.inputError]}
                    value={documento}
                    onChangeText={handleDocumentoChange}
                    placeholder={tipo === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={tipo === 'PF' ? 14 : 18}
                    returnKeyType="next"
                  />
                  {documentoError ? <Text style={styles.errorText}>{documentoError}</Text> : null}
                </View>

                {/* Inscrição Municipal (apenas PJ) */}
                {tipo === 'PJ' && (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Inscrição Municipal</Text>
                    <TextInput
                      style={styles.input}
                      value={inscricaoMunicipal}
                      onChangeText={setInscricaoMunicipal}
                      placeholder="Digite a inscrição municipal"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      returnKeyType="next"
                    />
                  </View>
                )}

                {/* Endereço */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Endereço <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, logradouroError && styles.inputError]}
                    value={logradouro}
                    onChangeText={(text) => {
                      setLogradouro(text);
                      if (text.trim()) setLogradouroError('');
                    }}
                    placeholder="Rua, Avenida, etc."
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                  {logradouroError ? <Text style={styles.errorText}>{logradouroError}</Text> : null}
                </View>

                {/* Número e CEP (lado a lado) */}
                <View style={styles.rowContainer}>
                  <View style={[styles.fieldContainer, styles.fieldHalf]}>
                    <Text style={styles.label}>
                      Número <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, numeroError && styles.inputError]}
                      value={numero}
                      onChangeText={(text) => {
                        setNumero(text);
                        if (text.trim()) setNumeroError('');
                      }}
                      placeholder="Nº"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="number-pad"
                      returnKeyType="next"
                    />
                    {numeroError ? <Text style={styles.errorText}>{numeroError}</Text> : null}
                  </View>

                  <View style={[styles.fieldContainer, styles.fieldHalf]}>
                    <Text style={styles.label}>
                      CEP <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, cepError && styles.inputError]}
                      value={cep}
                      onChangeText={(text) => {
                        setCep(formatCEP(text));
                        if (cleanDocument(text).length === 8) setCepError('');
                      }}
                      placeholder="00000-000"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="number-pad"
                      maxLength={9}
                      returnKeyType="next"
                    />
                    {cepError ? <Text style={styles.errorText}>{cepError}</Text> : null}
                  </View>
                </View>

                {/* Bairro */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Bairro <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, bairroError && styles.inputError]}
                    value={bairro}
                    onChangeText={(text) => {
                      setBairro(text);
                      if (text.trim()) setBairroError('');
                    }}
                    placeholder="Digite o bairro"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                  {bairroError ? <Text style={styles.errorText}>{bairroError}</Text> : null}
                </View>

                {/* Cidade/UF */}
                <View style={styles.rowContainer}>
                  <View style={[styles.fieldContainer, { flex: 2 }]}>
                    <Text style={styles.label}>
                      Cidade <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, cidadeError && styles.inputError]}
                      value={cidade}
                      onChangeText={(text) => {
                        setCidade(text);
                        if (text.trim()) setCidadeError('');
                      }}
                      placeholder="Digite a cidade"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                    {cidadeError ? <Text style={styles.errorText}>{cidadeError}</Text> : null}
                  </View>

                  <View style={[styles.fieldContainer, { flex: 1 }]}>
                    <Text style={styles.label}>
                      UF <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, ufError && styles.inputError]}
                      value={uf}
                      onChangeText={(text) => {
                        setUf(text.toUpperCase());
                        if (text.trim().length === 2) setUfError('');
                      }}
                      placeholder="SP"
                      placeholderTextColor="#9CA3AF"
                      maxLength={2}
                      autoCapitalize="characters"
                      returnKeyType="next"
                    />
                    {ufError ? <Text style={styles.errorText}>{ufError}</Text> : null}
                  </View>
                </View>

                {/* Telefone */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Telefone</Text>
                  <TextInput
                    style={styles.input}
                    value={telefone}
                    onChangeText={(text) => setTelefone(formatPhone(text))}
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    maxLength={15}
                    returnKeyType="done"
                  />
                </View>
              </ScrollView>

              {/* Botão Salvar */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
                  onPress={handleSave}
                  disabled={isSubmitting}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
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
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#333333',
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHalf: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
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
  saveButton: {
    backgroundColor: '#333333',
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
    color: '#FFFFFF',
  },
});
