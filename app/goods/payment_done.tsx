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
  percent25WinHeight,
  percent30WinHeight,
  percent40WinHeight,
} from "@/constants/CommonUtils";
import { Squealt3Regular } from "@/constants/FontUtils";
import { Image } from "expo-image";
import { Divider } from "@rneui/base";
import { buttonBgColor, buttonGray30Color } from "@/constants/Colors";
import {
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";

type GreetFunction = () => void;

type NFTViewProps = ViewProps & {
  callbackEvent: GreetFunction;
};

// 支付成功页面
export default function payDoneScreen() {
  // 参数
  const { order_id, paySuccess, extra, other } = useLocalSearchParams<{
    order_id: string;
    paySuccess: string;
    extra?: string;
    other?: string;
  }>();

  const submit = () => {
    // inputRef01.current.
  };

  const isPaySuccess =
    paySuccess !== null && paySuccess !== undefined && paySuccess?.length > 0;
  const image = isPaySuccess
    ? require("@/assets/images/shop/pay_done.png")
    : require("@/assets/images/shop/pay_failed.png");

  return (
    <CustomBaseScrollView title={"Payment"} hideRightLogo={false}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ height: percent30WinHeight }}></View>

        <Image
          style={{
            width: 169 * 0.5,
            height: 109 * 0.5,
          }}
          source={image}
          contentFit="contain"
        ></Image>

        <Text
          style={{
            color: "rgb(114,114,114)",
            fontSize: 12,
            // marginLeft: 5,
            // flex: 1,
            width: "40%",
            height: 20,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Payment Completed
        </Text>

        <Pressable
          onPress={() => {
            router.replace({
              pathname: "/order/[order_id]",
              params: { order_id: order_id },
            });
          }}
        >
          <View
            style={{
              height: 40,
              backgroundColor: buttonBgColor,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              // marginHorizontal: 20,
              borderRadius: 20,
              // marginBottom: 10,
              marginTop: percent20WinHeight,
              width: "40%",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                // backgroundColor: "yellow",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  color: "white",
                  fontSize: 12,
                  // backgroundColor: "green",
                }}
              >
                Check Details
              </Text>
            </View>
          </View>
        </Pressable>
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
