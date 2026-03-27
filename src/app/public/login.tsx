import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Animated, Dimensions, Easing, Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const INSTAGRAM_URL = 'https://www.instagram.com/nymusolucoes?igsh=MXc4anRmbDY1YTZodQ==';
const WHATSAPP_URL = 'https://api.whatsapp.com/send?phone=5585985150813&text=Ol%C3%A1,%20Estou%20vindo%20do%20app%20da%20Nymu%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.';

export default function Login() {
  const [isCodeModalVisible, setIsCodeModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openCodeModal = () => {
    setIsCodeModalVisible(true);
    slideAnim.setValue(SCREEN_HEIGHT);
    overlayOpacity.setValue(0);

    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 45,
          friction: 9,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeCodeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 280,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 280,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsCodeModalVisible(false);
    });
  };

  const openExternalLink = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert('Não foi possível abrir o link', 'Tente novamente em instantes.');
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert('Erro ao abrir o link', 'Tente novamente em instantes.');
    }
  };

  return (
    <View style={styles.container}>
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
          <TouchableOpacity 
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => router.push('/public/sign-in')}
          >
            <Text style={styles.primaryButtonText}>Já tenho uma conta! Fazer login</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.outlineButton}
            activeOpacity={0.8}
            onPress={openCodeModal}
          >
            <Text style={styles.outlineButtonText}>Solicitar código</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent
        visible={isCodeModalVisible}
        animationType="none"
        onRequestClose={closeCodeModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeCodeModal}
          />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.modalTitle}>Solicitação de código</Text>
            <Text style={styles.modalSubtitle}>
              Para solicitar seu código de acesso, entre em contato conosco.
            </Text>
            <Text style={styles.modalSubtitle}>
              Escolha o meio de comunicação abaixo:
            </Text>

            <View style={styles.socialIconsContainer}>
              <TouchableOpacity
                style={styles.socialItem}
                activeOpacity={0.8}
                onPress={() => openExternalLink(INSTAGRAM_URL)}
              >
                <Image
                  source={require('@/assets/images/instagramIcon.png')}
                  style={styles.socialIcon}
                  resizeMode="contain"
                />
                <Text style={styles.socialText}>Instagram</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialItem}
                activeOpacity={0.8}
                onPress={() => openExternalLink(WHATSAPP_URL)}
              >
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
              onPress={closeCodeModal}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#2D3648',
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  socialIconsContainer: {
    marginTop: 8,
    marginBottom: 16,
    gap: 14,
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
