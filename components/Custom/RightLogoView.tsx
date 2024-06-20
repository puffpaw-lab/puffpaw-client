import { PropsWithChildren } from "react";
import { ViewProps } from "react-native";
import { Image } from "expo-image";
import React from "react";

type RightViewProps = ViewProps &
  PropsWithChildren<{
    marginRight?: number | null;
  }>;

const RightLogoView = ({ style, children, marginRight }: RightViewProps) => {
  return (
    <Image
      source={require("@/assets/images/common/logo_white.png")}
      style={{
        width: 35,
        height: 27,
        marginRight: marginRight ? marginRight : 10,
      }}
      contentFit="contain"
    />
  );
};
export { RightLogoView };
