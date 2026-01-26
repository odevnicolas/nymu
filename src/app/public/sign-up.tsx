import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Função simples para verificar se a senha é forte
  const isPasswordStrong = () => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Só mais alguns dados</Text>
          <Text style={styles.subtitle}>Insira mais alguns dados par ao seu cadastro.</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Confirme o e-mail cadastrado</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="livionymu@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Password Input */}
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

          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Confirme sua senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <View style={styles.passwordStrengthContainer}>
              <Ionicons 
                name={isPasswordStrong() ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={isPasswordStrong() ? "#22C55E" : "#EF4444"} 
              />
              <Text style={[
                styles.passwordStrengthText,
                { color: isPasswordStrong() ? "#22C55E" : "#EF4444" }
              ]}>
                {isPasswordStrong() ? "Ótimo! Você tem uma senha forte!" : "Senha fraca"}
              </Text>
            </View>
          )}

          {/* Terms Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.checkboxText}>
              Eu concordo com os <Text style={styles.linkText}>Termos de Serviços</Text> e{'\n'}
              <Text style={styles.linkText}>Política de Privacidade</Text>
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            activeOpacity={0.8}
            onPress={() => router.push('/dashboard/' as any)}
          >
            <Text style={styles.submitButtonText}>Acessar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Back Button */}
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
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Urbanist_700Bold',
    color: '#2D3648',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular', 
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
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
  inputIcon: {
    marginRight: 12,
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
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  passwordStrengthText: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    marginLeft: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  linkText: {
    color: '#2D3648',
    fontFamily: 'Urbanist_600SemiBold',
  },
  submitButton: {
    backgroundColor: '#333333',
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
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
});
