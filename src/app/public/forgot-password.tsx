import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRecover = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, digite seu e-mail");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: integrar com API de recuperação de senha
      Alert.alert("E-mail enviado", "Verifique sua caixa de entrada.");
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
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/forgotpass.png")}
            style={styles.personImage}
            resizeMode="contain"
          />

          <View style={styles.textContainer}>
            <Text style={styles.titleText}>Recupere seu código</Text>
            <Text style={styles.subtitleText}>
              Digite seu e-mail para recuperar seu código.
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
              activeOpacity={0.8}
              onPress={handleRecover}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? "Enviando..." : "Recuperar Código"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
    marginTop: -300,
  },
  titleText: {
    fontSize: 24,
    fontFamily: "Urbanist_600SemiBold",
    color: "#2D3648",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
  },
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#6B7280",
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#2D3648",
    paddingVertical: 8,
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
  primaryButtonDisabled: {
    opacity: 0.6,
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
});
