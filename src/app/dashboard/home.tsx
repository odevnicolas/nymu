import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "@/contexts/user-context";
import { getShortName } from "@/utils/user";

export default function Home() {
  const { user } = useUser();
  
  // Função para obter saudação baseada na hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };
  
  // Primeiro e segundo nome do usuário
  const shortName = getShortName(user);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.greetingContainer}
          onPress={() => router.push("/dashboard/configuracoes")}
          activeOpacity={0.7}
        >
          <Text style={styles.greetingText}>{getGreeting()}!</Text>
          <Text style={styles.userName}>{shortName}🖐</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.notificationButton} 
          activeOpacity={0.7}
          onPress={() => router.push("/dashboard/notificacoes")}
        >
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.leftSection}>
            <Text style={styles.percentageText}>0%</Text>
            <Text style={styles.regimeText}>Simples Nacional</Text>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.infoBlock}>
              <Text style={styles.labelText}>Total Faturado</Text>
              <Text style={styles.valueText}>R$0.000,00</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.labelText}>Total de Impostos</Text>
              <Text style={styles.valueText}>R$ 0.000,00</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Botões horizontais scrolláveis */}
      <View style={styles.buttonsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="document-text-outline" size={24} color="#000000" />
            <Text style={styles.buttonText}>Solicitar NF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="folder-open-outline" size={24} color="#000000" />
            <Text style={styles.buttonText}>Certidões Negativas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="download-outline" size={24} color="#000000" />
            <Text style={styles.buttonText}>Documentos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="help-circle-outline" size={24} color="#000000" />
            <Text style={styles.buttonText}>Glossário</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Seção Últimas NF Emitidas */}
      <View style={styles.nfSection}>
        <Text style={styles.sectionTitle}>Últimas NF Emitidas</Text>
        
        <View style={styles.nfList}>
          <View style={styles.nfItem}>
            <Ionicons name="download-outline" size={24} color="#6B7280" />
            <View style={styles.nfItemContent}>
              <View style={styles.nfItemText}>
                <Text style={styles.nfItemName}>Teste</Text>
                <Text style={styles.nfItemDate}>Emitida em 15/01/2026</Text>
              </View>
              <Text style={styles.nfItemValue}>R$ 0.000,00</Text>
            </View>
          </View>

          <View style={styles.nfDivider} />

          <View style={styles.nfItem}>
            <Ionicons name="download-outline" size={24} color="#6B7280" />
            <View style={styles.nfItemContent}>
              <View style={styles.nfItemText}>
                <Text style={styles.nfItemName}>Teste</Text>
                <Text style={styles.nfItemDate}>Emitida em 15/01/2026</Text>
              </View>
              <Text style={styles.nfItemValue}>R$ 0.000,00</Text>
            </View>
          </View>

          <View style={styles.nfDivider} />

          <View style={styles.nfItem}>
            <Ionicons name="download-outline" size={24} color="#6B7280" />
            <View style={styles.nfItemContent}>
              <View style={styles.nfItemText}>
                <Text style={styles.nfItemName}>Teste</Text>
                <Text style={styles.nfItemDate}>Emitida em 15/01/2026</Text>
              </View>
              <Text style={styles.nfItemValue}>R$ 0.000,00</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Conteúdo da página */}
      <View style={styles.content}>
        {/* Conteúdo adicional pode ser adicionado aqui */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    backgroundColor: '#333333',
    height: 250,
    width: '100%',
    paddingVertical: 50,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    gap: 4,
  },
  greetingText: {
    fontSize: 16,
    fontFamily: 'Urbanist_400Regular',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 28,
    fontFamily: 'Urbanist_700Bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  card: {
    backgroundColor: '#FAB41B',
    borderRadius: 10,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  leftSection: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  percentageText: {
    fontSize: 32,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
  },
  regimeText: {
    fontSize: 12,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
  },
  rightSection: {
    gap: 20,
    justifyContent: 'center',
  },
  infoBlock: {
    alignItems: 'flex-start',
  },
  labelText: {
    fontSize: 12,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 18,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
  },
  buttonsContainer: {
    marginTop: 100,
    paddingHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#F7F7F7',
    paddingVertical: 16,
  },
  scrollContent: {
    gap: 12,
    paddingRight: 24,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 160,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#000000',
  },
  nfSection: {
    marginTop: 30,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
    marginBottom: 16,
  },
  nfList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  nfItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  nfItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nfItemText: {
    gap: 4,
  },
  nfItemName: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
  },
  nfItemDate: {
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
    color: '#9CA3AF',
  },
  nfItemValue: {
    fontSize: 16,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1F2937',
  },
  nfDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 52,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
});
