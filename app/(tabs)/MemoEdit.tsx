import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import * as db from "../db/db";

export default function MemoEdit() {
  const queryString = useLocalSearchParams();
  const memoId = Number(queryString?.memoId ?? 0);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 1. 다크모드 및 테마 설정
  const isDarkMode = useColorScheme() === "dark";
  const theme = {
    container: isDarkMode ? "#121212" : "#F5F7FA",
    inputBg: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#333333",
    placeholder: isDarkMode ? "#666666" : "#A0A0A0",
    headerTitle: isDarkMode ? "#FFFFFF" : "#1A1A1A",
    label: isDarkMode ? "#BBBBBB" : "#555555",
  };

  async function init() {
    console.log(`# memoedit init memoid: `, memoId);
    if (memoId) {
      let data = await db.getMemoById(memoId);
      setTitle(data?.title ?? "");
      setContent(data?.content ?? "");
    } else {
      setTitle("");
      setContent("");
    }
  }

  async function onSave() {
    // 간단한 유효성 검사 (제목 없으면 저장 안함)
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    await db.updateMemo(memoId, title, content);
    router.replace("/");
  }

  useFocusEffect(
    useCallback(() => {
      init();
    }, [memoId])
  );

  return (
    // KeyboardAvoidingView: 키보드가 올라올 때 화면이 가려지지 않게 도와줍니다.
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { backgroundColor: theme.container }]}>
        {/* 헤더 영역 */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.headerTitle }]}>
            {memoId ? "메모 수정" : "새 메모 작성"}
          </Text>
        </View>

        <ScrollView
          style={styles.formContainer}
          contentContainerStyle={{ paddingBottom: 100 }} // 하단 버튼 가림 방지
          keyboardShouldPersistTaps="handled"
        >
          {/* 제목 입력 */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.label }]}>제목</Text>
            <TextInput
              style={[
                styles.input,
                styles.titleInput,
                { backgroundColor: theme.inputBg, color: theme.text },
              ]}
              placeholder="제목을 입력하세요"
              placeholderTextColor={theme.placeholder}
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>

          {/* 내용 입력 */}
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={[styles.label, { color: theme.label }]}>내용</Text>
            <TextInput
              style={[
                styles.input,
                styles.contentInput,
                { backgroundColor: theme.inputBg, color: theme.text },
              ]}
              placeholder="내용을 자유롭게 입력하세요"
              placeholderTextColor={theme.placeholder}
              value={content}
              onChangeText={setContent}
              multiline={true}
              textAlignVertical="top" // 안드로이드에서 텍스트 위쪽 정렬
            />
          </View>
        </ScrollView>

        {/* 하단 버튼 영역 */}
        <View style={[styles.footer, { backgroundColor: theme.container }]}>
          {/* 목록(취소) 버튼: 기존 로직 유지, 스타일은 터치 영역 확보 */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              router.push("/"); // 목록으로 이동
            }}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>

          {/* 저장 버튼: 눈에 띄게 디자인 */}
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={onSave}
          >
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    // 그림자 효과 (Input에 입체감)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  titleInput: {
    fontWeight: "600",
  },
  contentInput: {
    minHeight: 250, // 내용 입력창 기본 높이 확보
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    paddingBottom: 30, // 아이폰 하단 바 고려
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    gap: 10, // 버튼 사이 간격
  },
  button: {
    flex: 1, // 버튼 크기 50:50 분할
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#A0A0A0",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888888",
  },
  saveButton: {
    backgroundColor: "#4E7EDD", // 메인 테마 컬러
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
