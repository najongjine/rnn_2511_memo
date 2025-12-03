import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "../component/CustomButton";
import * as db from "../db/db";
import * as types from "../types/types";

export default function MemoDetail() {
  const queryString = useLocalSearchParams();
  const memoId = Number(queryString?.memoId ?? 0);
  const [memo, setMemo] = useState<types.Memo>({});

  async function init() {
    if (memoId) {
      let data = await db.getMemoById(memoId);
      if (data) setMemo(data);
    } else {
      setMemo({});
    }
  }

  useFocusEffect(
    useCallback(() => {
      init();
    }, [memoId])
  );

  const handleDelete = async () => {
    Alert.alert("메모 삭제", "정말로 이 메모를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await db.deleteMemoById(memoId);
          router.replace({ pathname: "/" });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>메모 상세</Text>
      </View>

      {/* 본문 영역 (카드 스타일 적용) */}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{memo?.title}</Text>
          <Text style={styles.date}>{memo?.date}</Text>

          <View style={styles.divider} />

          <Text style={styles.contentText}>{memo?.content}</Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 영역 */}
      <View style={styles.footer}>
        <View style={styles.leftBtn}>
          <CustomButton
            title="목록"
            size="medium"
            color="#9e9e9e"
            position="left"
            onPress={() => router.push("/")}
          />
        </View>

        <View style={styles.rightBtns}>
          <CustomButton
            title="수정"
            size="medium"
            color="#4CAF50"
            position="right"
            onPress={() => {
              router.push({
                pathname: "/MemoEdit",
                params: { memoId: memoId },
              });
            }}
          />
          <View style={{ width: 10 }} />
          <CustomButton
            title="삭제"
            size="medium"
            color="#FF5252"
            position="right"
            onPress={handleDelete}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F8", // 눈이 편안한 밝은 쿨그레이
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  contentContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    minHeight: 300, // 내용이 적어도 카드가 너무 작아지지 않게
    // 그림자 효과
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: "#888",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26, // 줄간격 여유있게
    color: "#444",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  leftBtn: {
    flex: 1,
    alignItems: "flex-start", // 왼쪽 정렬
  },
  rightBtns: {
    flexDirection: "row",
    alignItems: "center",
  },
});
