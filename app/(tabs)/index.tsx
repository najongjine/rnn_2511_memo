import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
    db.initDB();
    console.log();
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
      <Text>메모 리스트</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
