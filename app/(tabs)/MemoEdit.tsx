import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
  // [추가] 키보드 상태 관리
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
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

  // [추가] 키보드 이벤트 리스너 등록
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // 키보드 열림 -> 버튼 숨김
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // 키보드 닫힘 -> 버튼 보임
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // 안드로이드에서 키보드가 헤더를 가리지 않게 살짝 보정
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <View style={[styles.container, { backgroundColor: theme.container }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.headerTitle }]}>
            {memoId ? "메모 수정" : "새 메모 작성"}
          </Text>
        </View>

        <View style={styles.formContainer}>
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

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={[styles.label, { color: theme.label }]}>내용</Text>
            <TextInput
              style={[
                styles.input,
                styles.contentInput,
                { backgroundColor: theme.inputBg, color: theme.text },
                { paddingBottom: 20 },
              ]}
              placeholder="내용을 자유롭게 입력하세요"
              placeholderTextColor={theme.placeholder}
              value={content}
              onChangeText={setContent}
              multiline={true}
              textAlignVertical="top"
              scrollEnabled={true}
            />
          </View>
        </View>

        {/* [핵심 수정] 키보드가 없을 때만 버튼(Footer)을 보여줍니다 */}
        {!isKeyboardVisible && (
          <View style={[styles.footer, { backgroundColor: theme.container }]}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.push("/")}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>저장하기</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 0,
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
    flex: 1,
    lineHeight: 24,
    // 키보드 열렸을 때 버튼이 사라진 자리를 입력창이 다 차지하게 됨
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    paddingBottom: 30, // 아이폰 홈바 고려해서 조금 넉넉히
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    gap: 10,
  },
  button: {
    flex: 1,
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
    backgroundColor: "#4E7EDD",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
