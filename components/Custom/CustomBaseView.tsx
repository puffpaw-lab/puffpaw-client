import { Stack, router } from "expo-router";
import React, { ReactNode } from "react";
import { ScrollView, View, ViewProps } from "react-native";
import { BackgroundView } from "./BackgroundView";
import { RightLogoView, HeaderLeftBackView } from "./RightLogoView";
import { Squealt3Regular } from "@/constants/FontUtils";
import { SafeAreaView } from "react-native-safe-area-context";

type GreetFunction = () => void;

type CustomBaseViewProps = ViewProps & {
  title?: string | null | undefined;
  hideRightLogo?: boolean;
  addtionView?: ReactNode;
  callbackEvent?: GreetFunction | null | undefined;
};

// 自定义滚动页面
export const CustomBaseScrollView = ({
  title,
  hideRightLogo,
  addtionView,
  children,
  style,
}: CustomBaseViewProps) => {
  return (
    <BackgroundView
      x={"0%"}
      y={"100%"}
      rx={"50%"}
      ry={"50%"}
      style={{ flex: 1, backgroundColor: "black" }}
    >
      <Stack.Screen
        options={{
          title: title === null ? "" : title,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: Squealt3Regular,
          },
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerRight: (props) => {
            if (hideRightLogo === undefined || hideRightLogo === true) {
              return null;
            }

            return <RightLogoView marginRight={-5}></RightLogoView>;
          },
          headerLeft: (props) => (
            <HeaderLeftBackView
              callback={() => {
                if (router.canGoBack()) router.back();
              }}
            ></HeaderLeftBackView>
          ),
        }}
      />
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <ScrollView
          style={[{ width: "100%", height: "100%" }, style]}
          keyboardShouldPersistTaps={"always"}
        >
          {children}
        </ScrollView>
        {addtionView}
      </SafeAreaView>
    </BackgroundView>
  );
};

// 自定义滚动页面
export const CustomBaseView = ({ title, children }: CustomBaseViewProps) => {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Stack.Screen
        options={{
          title: title === null ? "" : title,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: Squealt3Regular,
          },
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerRight: (props) => (
            <RightLogoView marginRight={-5}></RightLogoView>
          ),
          headerLeft: (props) => (
            <HeaderLeftBackView
              callback={() => {
                if (router.canGoBack()) router.back();
              }}
            ></HeaderLeftBackView>
          ),
        }}
      />
      <BackgroundView x={"0%"} y={"100%"} rx={"50%"} ry={"50%"}>
        {children}
      </BackgroundView>
    </View>
  );
};
