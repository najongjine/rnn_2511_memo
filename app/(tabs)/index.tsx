import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as types from "../types/types";

export default function HomeScreen() {
  const [memos, setMemos] = useState<types.Memo[]>([]);

  return (
    <View>
      <Text>메모 리스트</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
