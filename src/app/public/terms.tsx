import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Terms() {
  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color="#2D3648" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Termos de Serviços{'\n'}e Política de Privacidade
        </Text>

        <Text style={styles.paragraph}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam placerat ante lacinia erat feugiat, vel finibus sem elementum. Nunc non dui mi. Mauris egestas elit ut enim vehicula sollicitudin. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        </Text>

        <Text style={styles.paragraph}>
          Aenean at pulvinar velit, eget tempus enim. Ut purus nunc, sagittis eu elementum vel, aliquet ut tellus. Phasellus sit amet sagittis orci. In mi odio, imperdiet eget libero ut, ornare commodo sapien. Nulla sed ante neque. Nam in nunc scelerisque est rhoncus commodo at nec sem. Cras ut augue est. Duis posuere hendrerit convallis.
        </Text>

        <Text style={styles.paragraph}>
          Nulla vitae mattis augue. Fusce vehicula velit in lorem placerat pulvinar. Maecenas odio orci, ullamcorper ac tincidunt eu, aliquam non erat. Sed mattis sem non augue tincidunt elementum. Integer eros odio, congue eget justo sit amet, dapibus luctus odio. Mauris vitae magna a ex vulputate rutrum vel vel sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque egestas sapien sed fermentum convallis. Cras congue, magna vitae sollicitudin posuere, velit nisl efficitur nunc, et accumsan lacus nulla non lacus. Quisque faucibus interdum dui. Donec pretium libero leo, nec lobortis nulla tristique at. Nunc mollis porta justo nec pulvinar. Cras in malesuada ipsum, vitae gravida ipsum.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Urbanist_700Bold',
    color: '#2D3648',
    marginBottom: 28,
    lineHeight: 36,
  },
  paragraph: {
    fontSize: 15,
    fontFamily: 'Urbanist_400Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 20,
  },
});
