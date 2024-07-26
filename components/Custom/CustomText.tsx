import { Squealt3Regular } from "@/constants/FontUtils";
import React from "react";
import { ViewProps, Text, TextProps } from "react-native";

type CustomTextFunction = () => void;

type CustomTextProps = TextProps & {
  text?: string | null | undefined;
  callbackEvent?: CustomTextFunction | null | undefined;
};

// 自定义滚动页面
export const CustomTextView = ({ text, style }: CustomTextProps) => {
  return <Text style={[{ fontFamily: Squealt3Regular }, style]}>{text}</Text>;
};
