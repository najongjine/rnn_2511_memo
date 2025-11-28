import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as db from "../db/db";

export default function MemoEdit() {
  const queryString = useLocalSearchParams();
  const memoId = Number(queryString?.memoId ?? 0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function init() {
    let data = await db.getMemoById(memoId);
  }

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  function onSave() {}

  return (
    <ScrollView>
      <View>
        <Text>메모 작성</Text>
      </View>
      <View>
        <TextInput placeholder="제목 입력" />
      </View>
      <View>
        <TextInput placeholder="내용입력" multiline={true} />
      </View>
      <View>
        <Button title="저장" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
