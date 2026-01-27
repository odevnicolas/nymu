import { usePathname, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { TabBar } from "@/components/tab-bar";
import { Slot } from "expo-router";

export default function DashboardLayout() {
  const pathname = usePathname();
  const router = useRouter();

  // Determina a tab ativa baseado no pathname
  const getActiveTab = () => {
    if (pathname?.includes("nota-fiscal")) return "nota-fiscal";
    if (pathname?.includes("tributos")) return "tributos";
    return "home";
  };

  // Esconde o TabBar nas telas de notificações, configurações, sobre, termos-versao e documentos
  const shouldShowTabBar = 
    !pathname?.includes("notificacoes") && 
    !pathname?.includes("configuracoes") && 
    !pathname?.includes("sobre") &&
    !pathname?.includes("termos-versao") &&
    !pathname?.includes("documentos");

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: "home-outline" as const,
      route: "/dashboard/home",
    },
    {
      id: "nota-fiscal",
      label: "Nota Fiscal",
      icon: "document-text-outline" as const,
      route: "/dashboard/nota-fiscal",
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
