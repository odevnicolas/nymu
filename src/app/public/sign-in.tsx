import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
            <Text style={styles.subtitleText}>Faça login para continuar</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.codeInputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.codeInput}
                placeholder="Digite aqui seu email"
                value={code}
                onChangeText={setCode}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Digite sua senha</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.codeActionsContainer}>
              <Text style={styles.forgotCodeText}>Esqueci minha senha. Recuperar senha!</Text>
              
              <View style={styles.codeButtonsContainer}>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  activeOpacity={0.8}
                  onPress={() => router.push('/dashboard/' as any)}
                >
                  <Text style={styles.primaryButtonText}>Fazer login</Text>
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
    marginBottom: 10,
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
  inputWrapper: {
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6B7280',
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#2D3648',
    paddingVertical: 8,
  },
  eyeIcon: {
    padding: 4,
  },
});
