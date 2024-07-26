import React from "react";

import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
} from "react-native-toast-message";
import { halfWinWidth } from "./CommonUtils";
import { Squealt3Regular } from "./FontUtils";
import { buttonBgColor, Colors } from "./Colors";
import { View, Text, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HorizonBackgroundView } from "@/components/Custom/BackgroundView";
import { Image } from "expo-image";

/*
  1. Create the config
*/
export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: buttonBgColor,
        borderLeftWidth: 2,
        width: halfWinWidth,
        borderColor: buttonBgColor,
        borderWidth: 2,
        // borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 5,
        backgroundColor: "black",
        padding: 3,
      }}
      text1Style={{
        fontFamily: Squealt3Regular,
        fontSize: 14,
        fontWeight: "400",
        color: "white",
      }}
      text1NumberOfLines={2}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", borderLeftWidth: 10 }}
      text1Style={{
        fontSize: 17,
      }}
      text1NumberOfLines={3}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),

  pffInfo: ({
    text1,
    text2,
  }: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <CustomDialogView
      type="info"
      text1={text1}
      text2={text2}
    ></CustomDialogView>
  ),
  pffSuccess: ({
    text1,
    text2,
  }: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <CustomDialogView
      type="success"
      text1={text1}
      text2={text2}
    ></CustomDialogView>
  ),
  pffError: ({
    text1,
    text2,
  }: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <CustomDialogView
      type="error"
      text1={text1}
      text2={text2}
    ></CustomDialogView>
  ),
  pffWarning: ({
    text1,
    text2,
  }: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <CustomDialogView
      type="warning"
      text1={text1}
      text2={text2}
    ></CustomDialogView>
  ),
  pffNormal: ({
    text1,
    text2,
  }: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <CustomDialogView
      type="normal"
      text1={text1}
      text2={text2}
    ></CustomDialogView>
  ),
};

export const CustomDialog = () => <Toast config={toastConfig} />;

// 提示信息类型
type DialogType = "normal" | "info" | "success" | "error" | "warning";

type CustomDialogViewProps = ViewProps & {
  type: DialogType;
  text1?: string | undefined;
  text2?: string | undefined;
};

// 自定义
const CustomDialogView = ({ type, text1, text2 }: CustomDialogViewProps) => {
  let borderColor = "rgb(89,35,34)";
  let backgroundColor = ["rgb(22,22,22)", Colors.dark.rightLinear];
  let icon = require("@/assets/images/common/alert.png");

  switch (type) {
    case "info":
      borderColor = "rgb(44,58,82)";
      backgroundColor = ["rgb(5,26,58)", "rgb(5,10,22)"];
      icon = require("@/assets/images/common/info.png");
      break;
    case "success":
      borderColor = "rgb(31,76,59)";
      backgroundColor = ["rgb(0,39,26)", "rgb(6,17,11)"];
      icon = require("@/assets/images/common/success.png");
      break;
    case "error":
      borderColor = "rgb(89,35,34)";
      backgroundColor = ["rgb(50,6,8)", "rgb(18,7,6)"];
      icon = require("@/assets/images/common/alert.png");
      break;
    case "warning":
      borderColor = "rgb(95,58,42)";
      backgroundColor = ["rgb(50,24,14)", "rgb(20,11,6)"];
      icon = require("@/assets/images/common/warning.png");
      break;
    case "normal":
      borderColor = "rgb(39,40,42)";
      backgroundColor = ["rgb(22,22,22)", "rgb(22,22,22)"];
      icon = null;
      break;
    default:
      break;
  }

  return (
    <SafeAreaView edges={["top"]}>
      <HorizonBackgroundView
        linearColors={backgroundColor}
        style={{
          marginTop: 20,
          alignContent: "flex-start",
          alignItems: "flex-start",
          flex: 1,
          height: "100%",
          minWidth: 50,
          maxWidth: "80%",
          // backgroundColor: "gray",
          padding: 10,
          borderColor: borderColor,
          borderWidth: 1,
          borderRadius: 10,
          flexDirection: "row",
        }}
      >
        {type !== "normal" && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              height: "100%",
              marginRight: 10,
              marginLeft: 5,
            }}
          >
            <Image
              style={{ width: 25, height: 25 }}
              contentFit="contain"
              source={icon}
            ></Image>
          </View>
        )}

        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            // backgroundColor: "green",
            height: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: Squealt3Regular,
                fontSize: 12,
                fontWeight: "400",
                color: "white",
                // flex: 1,
                // paddingHorizontal: 10,
                // backgroundColor: "red",
                textAlign: "left",
                marginRight: 10,
              }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {text1}
            </Text>
          </View>

          {text2 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                // width: "100%",
                // backgroundColor: "green",
              }}
            >
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 12,
                  fontWeight: "400",
                  color: "white",
                  marginTop: 3,
                  // flex: 1,
                  textAlign: "left",
                  // paddingHorizontal: 10,
                }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {text2}
              </Text>
            </View>
          )}
        </View>
        {/* <View
          style={{ width: 10, height: "100%", backgroundColor: "yellow" }}
        ></View> */}
      </HorizonBackgroundView>
    </SafeAreaView>
  );
};

export class DialogUtils {
  static showSuccess(text1: string, text2?: string) {
    Toast.show({
      type: "pffSuccess",
      text1: text1,
      text2: text2,
    });
  }
  static showError(text1: string, text2?: string) {
    Toast.show({
      type: "pffError",
      text1: text1,
      text2: text2,
    });
  }
  static showInfo(text1: string, text2?: string) {
    Toast.show({
      type: "pffInfo",
      text1: text1,
      text2: text2,
    });
  }

  static showWarning(text1: string, text2?: string) {
    Toast.show({
      type: "pffWarning",
      text1: text1,
      text2: text2,
    });
  }

  static showNormal(text1: string, text2?: string) {
    Toast.show({
      type: "pffNormal",
      text1: text1,
      text2: text2,
    });
  }
}
