import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

// 1. Props 타입 정의
type ButtonSize = "small" | "medium" | "big";
// position prop은 부모 컴포넌트(MemoDetail)에서 레이아웃을 잡으므로
// 버튼 내부에서는 굳이 필요 없으나, 기존 코드 호환성을 위해 타입은 유지합니다.
type ButtonPosition = "left" | "middle" | "right";

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  size?: ButtonSize;
  color?: string;
  position?: ButtonPosition;
  textColor?: string;
}

const CustomButton = ({
  title,
  onPress,
  size = "medium",
  color = "#007AFF",
  // position prop은 사용하지 않고 부모 레이아웃에 맡깁니다.
  textColor = "#FFFFFF",
}: CustomButtonProps) => {
  // 2. 스타일 객체 설정
  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    small: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    medium: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    big: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  };

  const textStyles: Record<ButtonSize, TextStyle> = {
    small: { fontSize: 12, fontWeight: "500" },
    medium: { fontSize: 15, fontWeight: "600" },
    big: { fontSize: 18, fontWeight: "700" },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, sizeStyles[size], { backgroundColor: color }]}
    >
      <Text style={[styles.text, textStyles[size], { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    // width: '100%' 제거함 -> 이제 내용물 크기만큼만 자리를 차지합니다.
    // 불필요한 margin 제거 -> 부모(MemoDetail)에서 간격 조절
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    textAlign: "center",
  },
});

export default CustomButton;
