import { useUser } from "@/contexts/user-context";
import { useAuthEventEmitter } from "@/hooks/use-auth-event";
import { login } from "@/lib/api/auth";
import { saveToken } from "@/lib/storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const { setUser } = useUser();
  const { emitLogin } = useAuthEventEmitter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        // Resetar scroll para o topo quando o teclado fechar
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      },
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    // Limpa erro de autenticação ao tentar novamente
    setAuthError(null);

    // Validação básica
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, digite seu email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Erro", "Por favor, digite sua senha");
      return;
    }

    setIsLoading(true);

    try {
      const { token, user } = await login(email.trim(), password);

      // Salvar token no storage (se falhar, não impede o login)
      try {
        await saveToken(token);
      } catch (storageError) {
        const msg =
          storageError instanceof Error
            ? storageError.message
            : String(storageError);
        console.warn("Falha ao salvar token, seguindo sem persistir:", msg);
      }

      // Salvar dados do usuário no contexto
      setUser(user);

      // Emitir evento de login para notificar os providers
      emitLogin();

      // Navegar para o dashboard após login bem-sucedido
      router.replace("/dashboard/" as any);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao fazer login. Tente novamente.";

      const normalized = errorMessage.toLowerCase();

      // Erro de storage não deve marcar credenciais como inválidas
      if (normalized.includes("storage não configurado")) {
        Alert.alert(
          "Configurar armazenamento",
          "Para salvar o login de forma segura, instale:\n\n- expo-secure-store (recomendado)\nou\n- @react-native-async-storage/async-storage",
        );
        return;
      }

      // Erro de conexão / rede
      if (
        normalized.includes("conexão") ||
        normalized.includes("network request failed") ||
        normalized.includes("failed to fetch") ||
        normalized.includes("networkerror")
      ) {
        Alert.alert(
          "Erro de conexão",
          "Não foi possível conectar ao servidor.\n\nVerifique:\n- Se o backend está rodando\n- Se o IP/porta da API está correto\n- Se o iPhone está na mesma rede Wi-Fi",
        );
        return;
      }

      // Qualquer outro erro tratamos como credenciais inválidas
      setAuthError("Email ou senha incorretos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 20}
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
            source={require("@/assets/images/logoNymu-01.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/loginPerson.png")}
            style={styles.personImage}
            resizeMode="contain"
          />

          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Seja bem-vindo</Text>
            <Text style={styles.subtitleText}>Faça login para continuar</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <View
              style={[
                styles.codeInputContainer,
                authError && styles.inputErrorBorder,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.codeInput, authError && styles.inputErrorText]}
                placeholder="Digite aqui seu email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (authError) setAuthError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Digite sua senha</Text>
              <View
                style={[
                  styles.inputContainer,
                  authError && styles.inputErrorBorder,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, authError && styles.inputErrorText]}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (authError) setAuthError(null);
                  }}
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
              <TouchableOpacity onPress={() => router.push('/public/forgot-password' as any)}>
                <Text style={styles.forgotCodeText}>
                  <Text style={{ color: '#6B7280', fontFamily: 'Urbanist_400Regular' }}>Esqueceu a senha? </Text>
                  Recuperar!
                </Text>
              </TouchableOpacity>
              {authError && (
                <Text style={styles.authErrorText}>{authError}</Text>
              )}

              <View style={styles.codeButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    isLoading && styles.primaryButtonDisabled,
                  ]}
                  activeOpacity={0.8}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLoading ? "Entrando..." : "Fazer login"}
                  </Text>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 120,
    height: 60,
  },
  imageContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  personImage: {
    width: "100%",
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: -50,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "Urbanist_600SemiBold",
    color: "#2D3648",
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: 24,
    gap: 15,
  },
  primaryButton: {
    backgroundColor: "#333333",
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: "Urbanist_600SemiBold",
    color: "#FFFFFF",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  outlineButtonText: {
    fontSize: 16,
    fontFamily: "Urbanist_600SemiBold",
    color: "#2D3648",
  },
  codeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#6B7280",
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  codeInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#2D3648",
    paddingVertical: 8,
  },
  codeActionsContainer: {
    width: "100%",
  },
  forgotCodeText: {
    fontSize: 16,
    fontFamily: "Urbanist_600SemiBold",
    color: "#2D3648",
    marginBottom: 10,
  },
  codeButtonsContainer: {
    width: "100%",
    gap: 15,
  },
  authErrorText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#EF4444",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 24,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#6B7280",
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#2D3648",
    paddingVertical: 8,
  },
  eyeIcon: {
    padding: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  inputErrorBorder: {
    borderBottomColor: "#EF4444",
  },
  inputErrorText: {
    color: "#EF4444",
  },
});
