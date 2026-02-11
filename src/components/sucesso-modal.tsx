/**
 * Modal de sucesso com animação
 */

import React, { useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface SucessoModalProps {
  visible: boolean;
  onClose: () => void;
  tipo?: 'cadastro' | 'nota-fiscal';
  titulo?: string;
  mensagem?: string;
  autoCloseDelay?: number; // em milissegundos
}

const { width } = Dimensions.get('window');

export function SucessoModal({
  visible,
  onClose,
  tipo = 'cadastro',
  titulo,
  mensagem,
  autoCloseDelay = 3000,
}: SucessoModalProps) {
  // Definir título e mensagem baseado no tipo, se não fornecidos
  const defaultTitulo = tipo === 'nota-fiscal'
    ? 'Sua nota fiscal foi solicitada com sucesso!'
    : 'Cadastro Efetuado com Sucesso!';
  
  const defaultMensagem = tipo === 'nota-fiscal'
    ? 'Em breve você irá receber sua Nota Fiscal em seu e-mail e no seu whatsapp.'
    : 'Agora você já pode utilizar o tomador de serviço cadastrado para solicitar Notas Fiscais';
  
  const tituloFinal = titulo || defaultTitulo;
  const mensagemFinal = mensagem || defaultMensagem;
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Animação de entrada
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto-fechar após delay
      if (autoCloseDelay > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      // Animação de saída
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, autoCloseDelay]);

  const handleClose = () => {
    scale.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
    opacity.value = withTiming(0, { duration: 200 });
  };

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
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
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />

        {/* Conteúdo do Modal */}
        <Animated.View style={[styles.content, animatedContentStyle]}>
          {/* Botão Fechar */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Ícone de Sucesso */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={48} color="#000000" />
            </View>
            {/* Pontos decorativos */}
            <View style={[styles.dot, styles.dotYellow, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotBlack, styles.dotTopRight]} />
            <View style={[styles.dot, styles.dotYellow, styles.dotBottomLeft]} />
            <View style={[styles.dot, styles.dotBlack, styles.dotBottomRight]} />
          </View>

          {/* Título */}
          <Text style={styles.titulo}>{tituloFinal}</Text>

          {/* Mensagem */}
          <Text style={styles.mensagem}>{mensagemFinal}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    width: width - 48,
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotYellow: {
    backgroundColor: '#FAB41B',
  },
  dotBlack: {
    backgroundColor: '#343A40',
  },
  dotTopLeft: {
    top: 10,
    left: 10,
  },
  dotTopRight: {
    top: 20,
    right: 5,
  },
  dotBottomLeft: {
    bottom: 15,
    left: 5,
  },
  dotBottomRight: {
    bottom: 10,
    right: 15,
  },
  titulo: {
    fontSize: 20,
    fontFamily: 'Urbanist_700Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  mensagem: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
});
