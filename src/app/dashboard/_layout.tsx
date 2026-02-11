import { TabBar } from "@/components/tab-bar";
import { Slot, usePathname, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function DashboardLayout() {
  const pathname = usePathname();
  const router = useRouter();

  // Determina a tab ativa baseado no pathname
  const getActiveTab = () => {
    if (pathname?.includes("minhas-notas")) return "minhas-notas";
    if (pathname?.includes("nota-fiscal")) return "nota-fiscal";
    if (pathname?.includes("tributos")) return "tributos";
    return "home";
  };

  // Esconde o TabBar nas telas de notificações, configurações, perfil, sobre, termos-versao, documentos e glossario
  const shouldShowTabBar = 
    !pathname?.includes("notificacoes") && 
    !pathname?.includes("configuracoes") && 
    !pathname?.includes("perfil") &&
    !pathname?.includes("sobre") &&
    !pathname?.includes("termos-versao") &&
    !pathname?.includes("documentos") &&
    !pathname?.includes("glossario");

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: "home-outline" as const,
      route: "/dashboard/home",
    },
    {
      id: "nota-fiscal",
      label: "Solicitar NF",
      icon: "add-circle-outline" as const,
      route: "/dashboard/nota-fiscal",
    },
    {
      id: "minhas-notas",
      label: "Minhas Notas",
      icon: "document-text-outline" as const,
      route: "/dashboard/minhas-notas",
    },
    {
      id: "tributos",
      label: "Tributos",
      icon: "calculator-outline" as const,
      route: "/dashboard/tributos",
    },
  ];

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      {shouldShowTabBar && (
        <TabBar tabs={tabs} activeTab={getActiveTab()} onTabPress={handleTabPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
});
