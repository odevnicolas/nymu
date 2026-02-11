/**
 * Modal de opções para foto (Tirar ou Escolher)
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

interface FotoOpcoesModalProps {
  visible: boolean;
  onClose: () => void;
  onTirarFoto: () => void;
  onEscolherFoto: () => void;
}

export function FotoOpcoesModal({
  visible,
  onClose,
  onTirarFoto,
  onEscolherFoto,
}: FotoOpcoesModalProps) {
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY }],
                },
              ]}
            >
              {/* Handle */}
              <View style={styles.handle} />

              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>

              {/* Opções */}
              <View style={styles.opcoesContainer}>
                <TouchableOpacity
                  style={styles.opcaoButton}
                  onPress={() => {
                    console.log('📷 [MODAL] Tirar foto pressionado');
                    onTirarFoto();
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera" size={24} color="#3B82F6" />
                  <Text style={styles.opcaoText}>Tirar foto</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.opcaoButton}
                  onPress={() => {
                    console.log('📷 [MODAL] Escolher foto pressionado');
                    onEscolherFoto();
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="image" size={24} color="#3B82F6" />
                  <Text style={styles.opcaoText}>Escolher foto</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  opcoesContainer: {
    paddingTop: 24,
  },
  opcaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  opcaoText: {
    fontSize: 16,
    fontFamily: 'Urbanist_500Medium',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
});
