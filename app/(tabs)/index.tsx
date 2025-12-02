import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList, // 다크모드 감지
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme, // 다크모드 감지
} from "react-native";
import CustomButton from "../component/CustomButton";
import * as db from "../db/db";
import * as types from "../types/types";

export default function HomeScreen() {
  const [memos, setMemos] = useState<types.Memo[]>([]);

  // 1. 다크모드 감지
  const isDarkMode = useColorScheme() === "dark";

  // 2. 테마 색상 정의
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
    // 최신순 정렬
    memos.sort((a, b) => (b.id || 0) - (a.id || 0));
    setMemos(memos);
    console.log(`메모 로딩 완료`);
  }

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  return (
    // SafeAreaView 제거 -> 일반 View 사용
    <View style={[styles.container, { backgroundColor: theme.container }]}>
      {/* 상태바 글자 색상은 화면 배경색에 맞춰야 하므로 남겨둠 */}
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.headerTitle }]}>
          나의 메모장
        </Text>
      </View>

      {/* 리스트 영역 */}
      <FlatList
        data={memos}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: theme.cardBg },
              !isDarkMode && styles.shadow, // 라이트모드만 그림자
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

      {/* FAB 버튼 영역 */}
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
    flex: 1, // 상위 레이아웃 안에서 꽉 차게
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    // 상위 레이아웃 때문에 위쪽 패딩이 너무 넓어 보이면
    // 여기 paddingVertical을 조금 줄이셔도 됩니다.
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
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
  },
});
