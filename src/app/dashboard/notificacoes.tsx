import { listNotifications, markNotificationAsRead } from "@/lib/api/notifications";
import type { Notification } from "@/lib/api/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PAGE_SIZE = 20;

export default function Notificacoes() {
  const [data, setData] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const loadPage = useCallback(
    async (pageNum: number, append: boolean, unreadOnlyFilter: boolean) => {
      if (append) setLoadingMore(true);
      else if (pageNum === 1) setLoading(true);
      setError(null);
      try {
        const res = await listNotifications({
          page: pageNum,
          limit: PAGE_SIZE,
          unreadOnly: unreadOnlyFilter || undefined,
        });
        setTotalPages(res.totalPages);
        setUnreadCount(res.unreadCount);
        if (append) {
          setData((prev) => (pageNum === 1 ? res.data : [...prev, ...res.data]));
        } else {
          setData(res.data);
        }
        setPage(pageNum);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        const is404 = msg.includes("404") || /not found/i.test(msg);
        if (is404) {
          setData([]);
          setTotalPages(0);
          setUnreadCount(0);
          setPage(1);
          setError(null);
        } else {
          setError(msg || "Erro ao carregar notificações.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const refresh = useCallback(() => {
    setRefreshing(true);
    loadPage(1, false, unreadOnly);
  }, [loadPage, unreadOnly]);

  useEffect(() => {
    loadPage(1, false, unreadOnly);
  }, [unreadOnly]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;
    loadPage(page + 1, true, unreadOnly);
  }, [loadPage, loading, loadingMore, page, totalPages, unreadOnly]);

  const handleMarkAsRead = useCallback(
    async (item: Notification) => {
      if (item.read) return;
      try {
        await markNotificationAsRead(item.id);
        setData((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
        if (unreadOnly) {
          setData((prev) => prev.filter((n) => n.id !== item.id));
        }
      } catch {
        // Silencioso; pode mostrar toast depois
      }
    },
    [unreadOnly]
  );

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => {
      const text = item.body ?? item.text ?? "";
      return (
        <TouchableOpacity
          style={[styles.notificationItem, item.read && styles.notificationItemRead]}
          onPress={() => handleMarkAsRead(item)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={item.read ? "mail-open-outline" : "mail-unread-outline"}
              size={24}
              color="#6B7280"
            />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.notificationText} numberOfLines={2}>
              {text || "Sem conteúdo"}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [handleMarkAsRead]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filtro: só não lidas */}
      <TouchableOpacity
        style={styles.filterRow}
        onPress={() => setUnreadOnly((v) => !v)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={unreadOnly ? "checkbox" : "square-outline"}
          size={22}
          color="#6366F1"
        />
        <Text style={styles.filterLabel}>Só não lidas</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons
              name="notifications-off-outline"
              size={56}
              color="#9CA3AF"
            />
          </View>
          <Text style={styles.emptyStateTitle}>Nenhuma notificação no momento</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.scrollContent,
            data.length === 0 && styles.scrollContentEmpty,
          ]}
          ListEmptyComponent={null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#6366F1" />
              </View>
            ) : null
          }
        />
      )}
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterLabel: {
    fontSize: 15,
    fontFamily: "Urbanist_500Medium",
    color: "#374151",
  },
  badge: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Urbanist_600SemiBold",
    color: "#FFFFFF",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  scrollContentEmpty: {
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  notificationItemRead: {
    opacity: 0.85,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: "Urbanist_700Bold",
    color: "#1F2937",
  },
  notificationText: {
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#6B7280",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontFamily: "Urbanist_500Medium",
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 280,
  },
  errorText: {
    fontSize: 15,
    fontFamily: "Urbanist_400Regular",
    color: "#DC2626",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#6366F1",
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 15,
    fontFamily: "Urbanist_600SemiBold",
    color: "#FFFFFF",
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
