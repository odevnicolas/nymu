/**
 * Modal para visualizar dados do tomador
 */

import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Tomador } from '@/lib/api/types';
import { formatCPF, formatCNPJ, formatPhone, formatCEP } from '@/utils/validators';
import { getTomadorById } from '@/lib/api/tomadores';

interface VisualizarDadosModalProps {
  visible: boolean;
  onClose: () => void;
  tomador: Tomador | null;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;

export function VisualizarDadosModal({ visible, onClose, tomador }: VisualizarDadosModalProps) {
  const translateY = useSharedValue(MODAL_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const [tomadorCompleto, setTomadorCompleto] = useState<Tomador | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Animações
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 150,
      });
      backdropOpacity.value = withTiming(1, { duration: 200 });
      
      // Buscar dados completos do tomador
      if (tomador?.id) {
        loadTomadorData();
      }
    } else {
      translateY.value = withTiming(MODAL_HEIGHT, { duration: 300 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, tomador?.id]);

  const loadTomadorData = async () => {
    if (!tomador?.id) return;
    
    setIsLoading(true);
    try {
      const data = await getTomadorById(tomador.id);
      setTomadorCompleto(data);
    } catch (error) {
      console.error('Erro ao carregar dados do tomador:', error);
      setTomadorCompleto(tomador);
    } finally {
      setIsLoading(false);
    }
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

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.5,
  }));

  if (!visible || !tomador) return null;

  const data = tomadorCompleto || tomador;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={styles.container}>
        {/* Backdrop */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        >
          <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
        </TouchableOpacity>

        {/* Modal Content */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.modalContent, animatedModalStyle]}>
            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Dados do Tomador</Text>
              <View style={[styles.badge, data.tipo === 'PF' ? styles.badgePF : styles.badgePJ]}>
                <Text style={styles.badgeText}>
                  {data.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                </Text>
              </View>
            </View>

            {/* Content */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333333" />
                <Text style={styles.loadingText}>Carregando dados...</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Nome/Razão Social */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    {data.tipo === 'PF' ? 'Nome Completo' : 'Razão Social'}
                  </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={data.nome}
                      editable={false}
                    />
                  </View>
                </View>

                {/* CPF/CNPJ */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{data.tipo === 'PF' ? 'CPF' : 'CNPJ'}</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={
                        data.tipo === 'PF'
                          ? formatCPF(data.documento)
                          : formatCNPJ(data.documento)
                      }
                      editable={false}
                    />
                  </View>
                </View>

                {/* Inscrição Municipal (apenas PJ) */}
                {data.tipo === 'PJ' && (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Inscrição Municipal</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={data.inscricaoMunicipal || 'Não informado'}
                        editable={false}
                      />
                    </View>
                  </View>
                )}

                {/* Endereço */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Endereço</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={data.logradouro}
                      editable={false}
                    />
                  </View>
                </View>

                {/* Número e CEP */}
                <View style={styles.rowContainer}>
                  <View style={[styles.fieldContainer, { flex: 1 }]}>
                    <Text style={styles.label}>Número</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={data.numero}
                        editable={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.fieldContainer, { flex: 1.5 }]}>
                    <Text style={styles.label}>CEP</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={formatCEP(data.cep)}
                        editable={false}
                      />
                    </View>
                  </View>
                </View>

                {/* Bairro */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Bairro</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={data.bairro}
                      editable={false}
                    />
                  </View>
                </View>

                {/* Cidade e UF */}
                <View style={styles.rowContainer}>
                  <View style={[styles.fieldContainer, { flex: 2 }]}>
                    <Text style={styles.label}>Cidade</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={data.cidade}
                        editable={false}
                      />
                    </View>
                  </View>

                  <View style={[styles.fieldContainer, { flex: 1 }]}>
                    <Text style={styles.label}>UF</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={data.uf}
                        editable={false}
                      />
                    </View>
                  </View>
                </View>

                {/* Telefone */}
                {data.telefone && (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Telefone</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={formatPhone(data.telefone)}
                        editable={false}
                      />
                    </View>
                  </View>
                )}
              </ScrollView>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.closeFooterButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={styles.closeFooterButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </GestureDetector>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgePF: {
    backgroundColor: '#3B82F6',
  },
  badgePJ: {
    backgroundColor: '#10B981',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Urbanist_500Medium',
    color: '#6B7280',
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#6B7280',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Urbanist_500Medium',
    color: '#1F2937',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  closeFooterButton: {
    backgroundColor: '#333333',
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeFooterButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
    color: '#FFFFFF',
  },
});
