import { useUser } from "@/contexts/user-context";
import { getShortName } from "@/utils/user";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Configuracoes() {
  const { user, logout } = useUser();
  
  const handleLogout = async () => {
    await logout();
    router.replace('/public/login' as any);
  };
  
  const shortName = getShortName(user);
  const avatarUri = user?.foto || user?.avatar;
  
  return (
    <View style={styles.container}>
      {/* Header com círculo e nome */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image 
                source={{ uri: avatarUri }} 
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons name="person" size={40} color="#000000" />
            )}
          </View>
          <Text style={styles.userName}>{shortName}</Text>
          {user?.email && (
            <Text style={styles.userEmail}>{user.email}</Text>
          )}
        </View>
      </View>

      {/* Lista de opções */}
      <ScrollView style={styles.content}>
        <View style={styles.menuList}>
          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.7}
            onPress={() => router.push("/dashboard/perfil")}
          >
            <Ionicons name="person-outline" size={20} color="#1F2937" />
            <Text style={styles.menuText}>Perfil</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.7}
            onPress={() => router.push("/dashboard/documentos")}
          >
            <Ionicons name="document-text-outline" size={20} color="#1F2937" />
            <Text style={styles.menuText}>Documentos</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="folder-outline" size={20} color="#1F2937" />
            <Text style={styles.menuText}>Certidões Negativas</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.7}
            onPress={() => router.push("/dashboard/sobre")}
          >
            <Ionicons name="information-circle-outline" size={20} color="#1F2937" />
            <Text style={styles.menuText}>Sobre</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Ionicons name="help-circle-outline" size={20} color="#1F2937" />
            <Text style={styles.menuText}>Ajuda e Feedback</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity> */}

          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.7}
            onPress={() => router.push("/dashboard/termos-versao")}
          >
            <Ionicons name="document-outline" size={20} color="#1F2937" />
            <Text style={styles.menuText}>Termos e Versão</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Botão de sair */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#1F2937" />
          <Text style={styles.logoutText}>Sair do aplicativo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    backgroundColor: "#333333",
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 24,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  profileSection: {
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FAB41B",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 20,
    fontFamily: "Urbanist_600SemiBold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  userEmail: {
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#E5E7EB",
    marginTop: -8,
  },
  content: {
    flex: 1,
  },
  menuList: {
    marginTop: 24,
    gap: 12,
    paddingHorizontal: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist_500Medium",
    color: "#1F2937",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: 20,
    gap: 8,
    marginTop: 32,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: "Urbanist_500Medium",
    color: "#1F2937",
  },
});
