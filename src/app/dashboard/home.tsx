import { useMemo } from "react";
import { useNotasFiscais } from "@/contexts/notas-fiscais-context";
import { useUser } from "@/contexts/user-context";
import { formatCurrency } from "@/utils/formatters";
import { getShortName } from "@/utils/user";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STATUS_COLORS: Record<string, string> = {
  PROCESSANDO: '#3B82F6',
  EMITIDA: '#10B981',
  CANCELADA: '#6B7280',
  ERRO: '#EF4444',
  SIMULATED: '#F59E0B',
};

export default function Home() {
  const { user } = useUser();
  const { notasFiscais } = useNotasFiscais();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };
  
  const shortName = getShortName(user);
  const ultimasNotas = notasFiscais.slice(0, 3);

  const totalFaturado = useMemo(
    () => notasFiscais.reduce((acc, nf) => acc + nf.serviceValue, 0),
    [notasFiscais]
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.greetingContainer}
          onPress={() => router.push("/dashboard/configuracoes")}
          activeOpacity={0.7}
          accessibilityLabel="Configurações"
          accessibilityHint="Pressione para acessar as configurações"
          accessibilityRole="button"
        >
          <Text style={styles.greetingText}>{getGreeting()}!</Text>
          <Text style={styles.userName}>{shortName}🖐</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.notificationButton} 
          activeOpacity={0.7}
          onPress={() => router.push("/dashboard/notificacoes")}
          accessibilityLabel="Notificações"
          accessibilityHint="Pressione para ver as notificações"
          accessibilityRole="button"
        >
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.leftSection}>
            <View style={styles.infoBlock}>
              <Text style={styles.percentageText}>0%</Text>
              <Text style={styles.regimeText}>Simples{'\n'}Nacional</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.infoBlock}>
              <Text style={styles.labelText}>Total Faturado</Text>
              <Text style={styles.valueText}>{formatCurrency(totalFaturado)}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.labelText}>Total de Impostos</Text>
              <Text style={styles.valueText}>--</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Botão Solicitar NF centralizado */}
        <View style={styles.mainActionContainer}>
          <TouchableOpacity 
            style={styles.mainActionButton} 
            activeOpacity={0.7}
            onPress={() => router.push("/dashboard/nota-fiscal")}
            accessibilityLabel="Solicitar Nota Fiscal"
            accessibilityHint="Pressione para solicitar uma nova nota fiscal"
            accessibilityRole="button"
          >
            <Ionicons name="add-circle" size={28} color="#FFFFFF" />
            <Text style={styles.mainActionText}>Solicitar Nota Fiscal</Text>
          </TouchableOpacity>
        </View>

        {/* Botões secundários */}
        <View style={styles.buttonsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            <TouchableOpacity 
              style={styles.actionButton} 
              activeOpacity={0.7}
              onPress={() => router.push("/dashboard/certidoes-negativas")}
            >
              <Ionicons name="folder-open-outline" size={24} color="#000000" />
              <Text style={styles.buttonText}>Certidões Negativas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              activeOpacity={0.7}
              onPress={() => router.push("/dashboard/documentos")}
            >
              <Ionicons name="document-text-outline" size={24} color="#000000" />
              <Text style={styles.buttonText}>Documentos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              activeOpacity={0.7}
              onPress={() => router.push("/dashboard/glossario")}
            >
              <Ionicons name="help-circle-outline" size={24} color="#000000" />
              <Text style={styles.buttonText}>Glossário</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Seção Últimas NF Emitidas */}
        <View style={styles.nfSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimas NF Emitidas</Text>
            {ultimasNotas.length > 0 && (
              <TouchableOpacity 
                onPress={() => router.push("/dashboard/minhas-notas")}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {ultimasNotas.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>
                Você ainda não possui nenhuma nota fiscal emitida
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => router.push("/dashboard/nota-fiscal")}
                activeOpacity={0.7}
              >
                <Text style={styles.emptyStateButtonText}>Solicitar primeira NF</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={ultimasNotas}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item: nota, index }) => (
                <View>
                  {index > 0 && <View style={styles.nfDivider} />}
                  <TouchableOpacity 
                    style={styles.nfItem}
                    onPress={() => router.push("/dashboard/minhas-notas")}
                    activeOpacity={0.7}
                    accessibilityLabel={`Nota fiscal de ${nota.tomadorNome || 'N/A'} no valor de ${formatCurrency(nota.serviceValue)}`}
                    accessibilityRole="button"
                  >
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: STATUS_COLORS[nota.status] || '#6B7280' }
                    ]} />
                    <View style={styles.nfItemContent}>
                      <View style={styles.nfItemText}>
                        <Text style={styles.nfItemName} numberOfLines={1}>
                          {nota.tomadorNome || 'N/A'}
                        </Text>
                        <Text style={styles.nfItemDate}>
                          {nota.createdAt.toLocaleDateString('pt-BR')}
                        </Text>
                      </View>
                      <Text style={styles.nfItemValue}>
                        {formatCurrency(nota.serviceValue)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
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
    padding: 12,
    flexDirection: 'row',
    gap: 12,
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
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  infoBlock: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 4,
  },
  percentageText: {
    fontSize: 28,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
  },
  regimeText: {
    fontSize: 11,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
    textAlign: 'center',
  },
  labelText: {
    fontSize: 11,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#333333',
  },
  valueText: {
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
  },
  mainActionContainer: {
    marginTop: 120,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  mainActionButton: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  mainActionText: {
    fontSize: 16,
    fontFamily: 'Urbanist_700Bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  horizontalScrollContent: {
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
    marginTop: 24,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Urbanist_700Bold',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#333333',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Urbanist_500Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 13,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#FFFFFF',
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
});
