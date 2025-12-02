import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
/**
 * import : 가져오다
 * : 다 가져오다
 * as 별명 붙이기
 * from : 어디에서?
 * "경로"
 */
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
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

  /** 얘는 react native expo 개발자가 만든 함수에요.
   * 화면에 진입시, 얘는 무조건 한번은 실행 되요
   */
  useFocusEffect(
    useCallback(() => {
      init();
    }, [memoId])
  );

  return (
    <View>
      <View>
        <Text>메모 상세</Text>
      </View>

      <View>
        <Text>{memo?.title}</Text>
      </View>
      <View>
        <Text>{memo?.date}</Text>
      </View>
      <View>
        <Text>{memo?.content}</Text>
      </View>
      <View>
        <CustomButton
          title="목록"
          size="medium"
          color="#3060ff6d"
          position="left"
          onPress={() => {
            router.push({
              pathname: "/",
            });
          }}
        />
        <CustomButton
          title="수정"
          size="medium"
          color="#72d6a96d"
          position="right"
          onPress={() => {
            /* router.push 이용해서 MemoEdit 화면으로 이동
            parmas 에 { memoId: item?.id ?? 0 } 요거 실어주기 */
            router.push({
              pathname: "/MemoEdit",
              params: { memoId: memoId },
            });
          }}
        />
        <CustomButton
          title="삭제"
          size="small"
          color="#d653576d"
          position="right"
          onPress={() => {
            /* router.replace 
            db.deleteMemoById
            */
            db.deleteMemoById(memoId);
            router.replace({ pathname: "/" });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
