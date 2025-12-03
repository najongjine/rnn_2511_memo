import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import CustomButton from "../component/CustomButton";
import * as db from "../db/db";
import * as types from "../types/types";

export default function HomeScreen() {
  const [memos, setMemos] = useState<types.Memo[]>([]);

  const isDarkMode = useColorScheme() === "dark";

  const theme = {
    container: isDarkMode ? "#121212" : "#F5F7FA",
    text: isDarkMode ? "#FFFFFF" : "#333333",
    cardBg: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    dateText: isDarkMode ? "#A0A0A0" : "#888888",
    headerTitle: isDarkMode ? "#FFFFFF" : "#1A1A1A",
  };

  async function init() {
    await db.initDB();
    let memos = await db.getMemos();
    memos.sort((a, b) => (b.id || 0) - (a.id || 0));
    setMemos(memos);
  }

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.container }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.headerTitle }]}>
          나의 메모장
        </Text>
      </View>

      <FlatList
        data={memos}
        // 핵심 수정: 버튼에 가려지지 않게 하단 여백을 충분히 늘렸습니다 (100 -> 150)
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: theme.cardBg },
              !isDarkMode && styles.shadow,
            ]}
            activeOpacity={0.7}
            onPress={() => {
              router.push({
                pathname: "/MemoDetail",
                params: { memoId: item?.id ?? 0 },
              });
            }}
          >
            <View style={styles.cardContent}>
              <Text
                style={[styles.cardTitle, { color: theme.text }]}
                numberOfLines={1}
              >
                {item?.title || "제목 없음"}
              </Text>
              <Text style={[styles.cardDate, { color: theme.dateText }]}>
                {item?.date ?? "날짜 없음"}
              </Text>
            </View>
            <Text style={{ color: theme.dateText, fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: theme.dateText }}>
              작성된 메모가 없습니다.
            </Text>
          </View>
        }
      />

      <View style={styles.fabContainer}>
        <CustomButton
          title="+ 작성"
          color="#4E7EDD"
          position="right"
          onPress={() => {
            router.push({
              pathname: "/MemoEdit",
              params: {
                memoId: 0,
              },
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  listContent: {
    padding: 20,
    // [수정됨] 여백을 150으로 늘려서 마지막 아이템이 버튼 위로 완전히 올라오게 함
    paddingBottom: 150,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    // (선택사항) 버튼 자체에 그림자를 줘서 리스트 위에 떠있는 느낌을 더 줄 수 있습니다.
    // elevation: 5,
  },
});
