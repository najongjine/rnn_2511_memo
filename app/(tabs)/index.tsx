import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
/**
 * import : 가져오다
 * : 다 가져오다
 * as 별명 붙이기
 * from : 어디에서?
 * "경로"
 */
import { useFocusEffect } from "expo-router";
import * as db from "../db/db";
import * as types from "../types/types";

export default function HomeScreen() {
  /*
  let memos=""
   이렇게 하니깐 화면에서 값이 안바뀜
   그래서 const [memos] =useState 이런식으로 마개조를 함
   memos 이놈이 어떻게 생겨 먹었니?
   types 안에 Memo 라는 타입이랑 같이 생겼는데, 이놈이 많아요([])
   = 기호 기준으로, 왼쪽에 있는 [memos,setMemos] 이건 변수,함수
   = 기호 오른쪽에 있는 types.Memo[] 이건 배열이란 뜻
   */
  const [memos, setMemos] = useState<types.Memo[]>([]);

  /** 초기화 함수. 화면 진입했을때, 필요한 선행 작업들을
   * 수행하는 함수에요
   */
  async function init() {
    /* 함수 설명란에 promise<> 이게 있으면 비동기란 뜻이에요
    비동기 함수는 아무리 위쪽에 써도, 맨 나중에 실행되는 특성이 있어요.
    그런데, 프로그램 만들때는 비동기 함수를 실행하고난 다음 해야되는 작업들이 많아요
    await 키워드를 붙이면 개발자가 의도한대로 순서대로 실행되요
     */

    await db.initDB();
    let memos = await db.getMemos();
    setMemos(memos);
    console.log(`2번째 코드에요`);
  }

  /** 얘는 react native expo 개발자가 만든 함수에요.
   * 화면에 진입시, 얘는 무조건 한번은 실행 되요
   */
  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  return (
    <View>
      <View>
        <Text>메모 리스트</Text>
      </View>

      <View>
        <FlatList
          data={memos}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item?.title}, ${item?.date ?? ""}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text>메모가 없습니다.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
