import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {

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
            onPress={() => router.push('/public/code-login')}
          >
            <Text style={styles.outlineButtonText}>Primeiro acesso! Acessar com o código</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});
