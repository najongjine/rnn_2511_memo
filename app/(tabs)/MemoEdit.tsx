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
  /* 화면 전환할때, 데이터를 같이 보낼수 있음
  그때 이 화면에 전달된 데이터 뽑아오는 코드
   */
  const queryString = useLocalSearchParams();
  const memoId = Number(queryString?.memoId ?? 0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function init() {
    let data = await db.getMemoById(memoId);
  }
  function onSave() {}

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

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
