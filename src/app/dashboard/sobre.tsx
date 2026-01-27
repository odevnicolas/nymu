import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Sobre() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.mainTitle}>
          Nossa missão é te ajudar em todos so passos.
        </Text>

        <Text style={styles.paragraph}>
          A Nymu nasceu em com o objetivo de te ajudar em todos os passos de sua jornada, desde a abertura da sua empresa ou apenas seu CNPJ para emissão de notas fiscais, ou até mesmo para a sua clínica. Entendemos cada momento de sua jornada.
        </Text>

        <Text style={styles.paragraph}>
          Fundada por 3 sócios aenean at pulvinar velit, eget tempus enim. Ut purus nunc, sagittis eu elementum vel, aliquet ut tellus. Phasellus sit amet sagittis orci. In mi odio, imperdiet eget libero ut, ornare commodo sapien. Nulla sed ante neque. Nam in nunc scelerisque est rhoncus commodo at nec sem. Cras ut augue est. Duis posuere hendrerit convallis.
        </Text>

        <Text style={styles.paragraph}>
          Nulla vitae mattis augue. Fusce vehicula velit in lorem placerat pulvinar. Maecenas odio orci, ullamcorper ac tincidunt eu, aliquam non erat. Sed mattis sem non augue tincidunt elementum. Integer eros odio, congue eget justo sit amet, dapibus luctus odio. Mauris vitae magna a ex vulputate rutrum vel vel sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque egestas sapien sed fermentum convallis. Cras congue, magna vitae sollicitudin posuere, velit nisl efficitur nunc, et
        </Text>

        <Text style={styles.website}>www.nymu.com.br</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
    marginBottom: 24,
    lineHeight: 32,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: "Urbanist_400Regular",
    color: "#4B5563",
    marginBottom: 20,
    lineHeight: 24,
  },
  website: {
    fontSize: 16,
    fontFamily: "Urbanist_600SemiBold",
    color: "#1F2937",
    marginTop: 8,
  },
});
