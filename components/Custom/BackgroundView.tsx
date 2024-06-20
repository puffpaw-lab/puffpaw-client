import { StyleSheet, View, ViewProps, Text } from "react-native";

import React, { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { bgColorList, Colors } from "@/constants/Colors";

import { RadialGradient } from "react-native-gradients";

type RadialGradientProps = ViewProps &
  PropsWithChildren<{
    x: string;
    y: string;
    rx: string;
    ry: string;
    colorList?: {
      offset: string;
      color: string;
      opacity: string;
    }[];
  }>;

const BackgroundView = ({
  style,
  children,
  x,
  y,
  rx,
  ry,
  colorList,
}: RadialGradientProps) => {
  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      <View style={[styles.gradientBg, style]}>
        <RadialGradient
          colorList={colorList ? colorList : bgColorList}
          x={x}
          y={y}
          rx={rx}
          ry={ry}
        />
      </View>
      {children}
    </View>
  );
};

type Props = ViewProps &
  PropsWithChildren<{
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    linearColors?: string[];
  }>;

const HorizonBackgroundView = ({
  style,
  children,
  start,
  end,
  linearColors,
}: Props) => {
  let startX = 0,
    startY = 0,
    endX = 1,
    endY = 0;
  if (start) {
    startX = start.x;
    startY = start.y;
  }
  if (end) {
    endX = end.x;
    endY = end.y;
  }
  return (
    <LinearGradient
      style={[styles.container, style]}
      start={{ x: startX, y: startY }}
      end={{ x: endX, y: endY }}
      colors={
        linearColors
          ? linearColors
          : [Colors.dark.leftLinear, Colors.dark.rightLinear]
      }
    >
      {children}
    </LinearGradient>
  );
};

// const RadialBackgroundView = ({
//   style,
//   children,
//   start,
//   end,
//   linearColors,
// }: Props) => {
//   let startX = 0,
//     startY = 0,
//     endX = 1,
//     endY = 0;
//   if (start) {
//     startX = start.x;
//     startY = start.y;
//   }
//   if (end) {
//     endX = end.x;
//     endY = end.y;
//   }
//   const colorList = [
//     { offset: "0%", color: "#231557", opacity: "1" },
//     { offset: "29%", color: "#44107A", opacity: "1" },
//     { offset: "67%", color: "#FF1361", opacity: "1" },
//     { offset: "100%", color: "#FFF800", opacity: "1" },
//   ];
//   return (
//     <View style={[styles.gradientBg, style]}>
//       <RNRadialGradient
//         x="50%"
//         y="50%"
//         rx="50%"
//         ry="50%"
//         colorList={colorList}
//       />
//       {children}
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "green",
  },
});

export { BackgroundView, HorizonBackgroundView };
