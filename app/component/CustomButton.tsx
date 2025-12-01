import React from "react";
import {
  FlexAlignType,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// 1. Props 타입 정의
// 지정된 문자열만 받을 수 있도록 Union Type을 사용했습니다.
type ButtonSize = "small" | "medium" | "big";
type ButtonPosition = "left" | "middle" | "right";

interface CustomButtonProps {
  title: string;
  onPress?: () => void; // 필수가 아닐 수도 있으므로 ? 처리
  size?: ButtonSize; // 기본값이 있으므로 ? 처리
  color?: string;
  position?: ButtonPosition;
  textColor?: string;
}

const CustomButton = ({
  title,
  onPress,
  size = "medium",
  color = "#007AFF",
  position = "middle",
  textColor = "#FFFFFF",
}: CustomButtonProps) => {
  // 2. 스타일 객체 타입 설정
  // Record<Key, Value> 유틸리티 타입을 사용하여 키와 값의 타입을 명시합니다.

  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    small: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    medium: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
    big: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 },
  };

  const textStyles: Record<ButtonSize, TextStyle> = {
    small: { fontSize: 12, fontWeight: "500" },
    medium: { fontSize: 16, fontWeight: "600" },
    big: { fontSize: 20, fontWeight: "700" },
  };

  // position prop을 FlexAlignType('flex-start' | 'center' | 'flex-end')으로 매핑
  const positionStyles: Record<ButtonPosition, FlexAlignType> = {
    left: "flex-start",
    middle: "center",
    right: "flex-end",
  };

  return (
    <View style={[styles.container, { alignItems: positionStyles[position] }]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.button, sizeStyles[size], { backgroundColor: color }]}
      >
        <Text style={[styles.text, textStyles[size], { color: textColor }]}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    textAlign: "center",
  },
});

export default CustomButton;
