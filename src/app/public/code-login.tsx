import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CodeLogin() {
  const [code, setCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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

      {/* Modal de solicitação de código */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
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
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Entrar em contato e solicitar código!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    paddingBottom: 40,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 24,
    width: '100%',
    maxWidth: 400,
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
