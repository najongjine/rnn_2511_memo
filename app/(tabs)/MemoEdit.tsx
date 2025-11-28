import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function MemoEdit() {
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
