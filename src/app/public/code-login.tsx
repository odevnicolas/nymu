import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Image, Keyboard, KeyboardAvoidingView, Modal, PanResponder, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CodeLogin() {
  const [code, setCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Resetar scroll para o topo quando o teclado fechar
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (modalVisible) {
      // Animar o bottom sheet para cima com animação mais suave
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animar o bottom sheet para baixo com animação mais suave
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          // Animar suavemente para fechar
          Animated.timing(slideAnim, {
            toValue: SCREEN_HEIGHT,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }).start(() => {
            closeModal();
          });
        } else {
          // Animar suavemente de volta para a posição inicial
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 40,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logoNymu-01.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={require('@/assets/images/loginPerson.png')}
            style={styles.personImage}
            resizeMode="contain"
          />
          
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Seja bem-vindo</Text>
            <Text style={styles.subtitleText}>Do que você precisa hoje?</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.codeInputContainer}>
              <Ionicons name="person-outline" size={24} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.codeInput}
                placeholder="Digite o código recebido"
                value={code}
                onChangeText={setCode}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.codeActionsContainer}>
              <Text style={styles.forgotCodeText}>Esqueceu seu código?</Text>
              
              <View style={styles.codeButtonsContainer}>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  activeOpacity={0.8}
                  onPress={() => router.push('/public/sign-up')}
                >
                  <Text style={styles.primaryButtonText}>Verificar Código</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.outlineButton}
                  activeOpacity={0.8}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.outlineButtonText}>Não possui código? Solicite conosco</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão de voltar */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={24} color="#2D3648" />
      </TouchableOpacity>

      {/* Bottom Sheet de solicitação de código */}
      {modalVisible && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="none"
          onRequestClose={closeModal}
        >
          <Animated.View 
            style={[
              styles.bottomSheetOverlay,
              { opacity: overlayOpacity }
            ]}
          >
            <TouchableOpacity 
              style={styles.overlayTouchable}
              activeOpacity={1}
              onPress={closeModal}
            />
            <Animated.View
              style={[
                styles.bottomSheetContainer,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
              {...panResponder.panHandlers}
            >
              {/* Handle bar */}
              <View style={styles.handleBar} />
              
              <View style={styles.bottomSheetContent}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={closeModal}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={24} color="#2D3648" />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Solicitação de código</Text>
                
                <Text style={styles.modalSubtitle}>
                  Para solicitar seu código de acesso é necessário entrar em contato conosco para fazer a solicitação!
                </Text>
                
                <Text style={styles.modalSubtitle}>
                  Escolha o meio de comunicação abaixo:
                </Text>

                <View style={styles.socialIconsContainer}>
                  <TouchableOpacity style={styles.socialItem} activeOpacity={0.8}>
                    <Image 
                      source={require('@/assets/images/instagramIcon.png')}
                      style={styles.socialIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialText}>Instagram</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialItem} activeOpacity={0.8}>
                    <Image 
                      source={require('@/assets/images/whatsappIcon.png')}
                      style={styles.socialIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialText}>Whatsapp</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.modalButton}
                  activeOpacity={0.8}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonText}>Entrar em contato e solicitar código!</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 120,
    height: 60,
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  personImage: {
    width: '100%',
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: -50,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#2D3648',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280', 
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#333333',
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#2D3648',
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6B7280',
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  codeInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#2D3648',
    paddingVertical: 8,
  },
  codeActionsContainer: {
    width: '100%',
  },
  forgotCodeText: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#2D3648',
    marginBottom: 16,
  },
  codeButtonsContainer: {
    width: '100%',
    gap: 15,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#2D3648',
    marginBottom: 16,
    textAlign: 'left',
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'left',
    lineHeight: 24,
  },
  socialIconsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  socialIcon: {
    width: 34,
    height: 34,
  },
  socialText: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#2D3648',
  },
  modalButton: {
    backgroundColor: '#333333',
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
  },
});
