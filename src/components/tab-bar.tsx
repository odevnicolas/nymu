import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TabItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

type TabBarProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (route: string) => void;
};

export function TabBar({ tabs, activeTab, onTabPress }: TabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCenter = index === 1; // Nota Fiscal no centro

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabPress(tab.route)}
              activeOpacity={0.7}
            >
              {isCenter ? (
                // Tab central com círculo laranja destacado
                <View style={styles.centerTabContainer}>
                  <View style={styles.centerIconCircle}>
                    <Ionicons name={tab.icon} size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.centerTabLabel}>{tab.label}</Text>
                </View>
              ) : (
                // Tabs laterais
                <View style={styles.sideTabContainer}>
                  <Ionicons
                    name={tab.icon}
                    size={24}
                    color={isActive ? "#FAB41B" : "#9CA3AF"}
                  />
                  <Text
                    style={[
                      styles.sideTabLabel,
                      isActive && styles.sideTabLabelActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
    paddingTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sideTabContainer: {
    alignItems: "center",
    gap: 4,
  },
  centerTabContainer: {
    alignItems: "center",
    gap: 4,
    marginTop: -20, // Eleva o círculo acima da linha
  },
  centerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FAB41B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sideTabLabel: {
    fontSize: 12,
    fontFamily: "Urbanist_400Regular",
    color: "#9CA3AF",
    marginTop: 4,
  },
  sideTabLabelActive: {
    color: "#1F2937",
    fontFamily: "Urbanist_500Medium",
  },
  centerTabLabel: {
    fontSize: 12,
    fontFamily: "Urbanist_400Regular",
    color: "#9CA3AF",
    marginTop: 4,
  },
});
