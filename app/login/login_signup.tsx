import { StyleSheet, View, Text, ViewProps, Pressable } from "react-native";

import React, { useRef, useState } from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { BackgroundView } from "@/components/Custom/BackgroundView";

import { FlashList } from "@shopify/flash-list";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { ConstantStorage } from "@/constants/LocalStorage";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { CustomBaseScrollView } from "@/components/Custom/CustomBaseView";
import { CustomTextView } from "@/components/Custom/CustomText";
import {
  percent10WinHeight,
  percent20WinHeight,
  percent30WinHeight,
  percent40WinHeight,
  windowHeight,
} from "@/constants/CommonUtils";
import { Squealt3Regular } from "@/constants/FontUtils";
import { Image } from "expo-image";
import { Divider } from "@rneui/base";
import { buttonGray30Color } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CLOG } from "@/constants/LogUtils";

type GreetFunction = () => void;

type NFTViewProps = ViewProps & {
  callbackEvent: GreetFunction;
};

// 验证码确认页面
export default function comfirmationScreen() {
  const submit = () => {
    // inputRef01.current.

    CLOG.info("开始验证验证码...");
  };

  const onConfirmEvent = (index: number) => {
    router.replace("(tabs)");
  };

  const addtionView: React.ReactNode = (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
        // backgroundColor: "red",
        // height: 60,
        marginTop: 15,
        marginBottom: 30,
      }}
    >
      <Image
        style={{ width: 124, height: 18 }}
        source={require("@/assets/images/login/login_protect.png")}
        contentFit="contain"
      ></Image>
    </View>
  );

  return (
    <CustomBaseScrollView title={"Log in or sign up"} addtionView={addtionView}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        {/* <View style={{ height: percent10WinHeight }}></View> */}
        {loginItems.map((item, index) => (
          <Pressable
            onPress={() => onConfirmEvent(index)}
            key={`${item.type}${index}`}
            style={{
              // height: 44,
              width: "100%",
              borderRadius: 12,
              marginVertical: 5,
              borderWidth: 1,
              borderColor: "rgb(35,35,35)",
            }}
          >
            <View>
              <View
                style={{
                  justifyContent: "flex-start",
                  // alignContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  height: 44,
                  width: "100%",
                  paddingHorizontal: 5,
                  // backgroundColor: "red",
                }}
              >
                {item.icon && (
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      marginHorizontal: 10,
                      marginLeft: 20,
                    }}
                    source={item.icon}
                    contentFit="contain"
                  ></Image>
                )}
                <Text
                  style={{
                    color: "rgb(180,180,180)",
                    fontSize: 14,
                    marginLeft: 5,
                    flex: 1,
                  }}
                >
                  {item.type}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
        {/* <View style={{ height: percent30WinHeight }}></View> */}
        {/* 保护信息 */}
        {/* <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            // flexDirection: "row",
          }}
        >
          <Image
            style={{ width: 124, height: 18, marginTop: 30 }}
            source={require("@/assets/images/login/login_protect.png")}
            contentFit="contain"
          ></Image>
        </View> */}
        {/* <View style={{ height: percent10WinHeight }}></View> */}
      </View>
    </CustomBaseScrollView>
  );
}

const loginItems = [
  {
    type: "Metamask",
    icon: require("@/assets/images/login/login_metamask.png"),
  },
  {
    type: "Coinbase Wallet",
    icon: require("@/assets/images/login/login_coinbasewallet.png"),
  },
  {
    type: "Rainbow",
    icon: require("@/assets/images/login/login_rainbow.png"),
  },
  {
    type: "Metamask",
    icon: require("@/assets/images/login/login_metamask2.png"),
  },
];

const styles = StyleSheet.create({
  inputContainer: {
    height: 50,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // alignContent: "space-between",
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "rgb(12,12,12)",
    borderColor: "rgb(35,35,35)",
    borderWidth: 1,
    // marginHorizontal: 5,
    // paddingHorizontal: 10,
  },
  inputText: {
    flex: 1,
    color: "white",
    fontFamily: Squealt3Regular,
    fontSize: 25,
    textAlign: "center",
    // backgroundColor: "red",
    height: "80%",
    // flex: 1,
    // borderColor: "rgb(35,35,35)",
    // borderWidth: 1,
  },
});
