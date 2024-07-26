import { StyleSheet, View, Text, ViewProps, Pressable } from "react-native";

import React, { useEffect, useRef, useState } from "react";
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv";
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
  percent30WinHeight,
  percent5WinHeight,
} from "@/constants/CommonUtils";
import { Squealt3Regular } from "@/constants/FontUtils";
import { buttonBgColor } from "@/constants/Colors";
import { DialogUtils } from "@/constants/DialogUtils";
import { useLoginWithSMS } from "@privy-io/expo";
import { CLOG } from "@/constants/LogUtils";

type GreetFunction = () => void;

type NFTViewProps = ViewProps & {
  callbackEvent: GreetFunction;
};

// 验证码确认页面
export default function comfirmationScreen() {
  const { phone, extra, other } = useLocalSearchParams<{
    phone: string;
    extra?: string;
    other?: string;
  }>();

  // 本地登录信息
  const [tempLogin, setTempLogin] = useMMKVObject<boolean>(
    ConstantStorage.tempLogin
  );

  const inputRef01 = useRef<TextInput>(null);
  const inputRef02 = useRef<TextInput>(null);
  const inputRef03 = useRef<TextInput>(null);
  const inputRef04 = useRef<TextInput>(null);
  const inputRef05 = useRef<TextInput>(null);
  const inputRef06 = useRef<TextInput>(null);

  const [text01, setText01] = useState("7");
  const [text02, setText02] = useState("4");
  const [text03, setText03] = useState("5");
  const [text04, setText04] = useState("2");
  const [text05, setText05] = useState("5");
  const [text06, setText06] = useState("7");
  const [fullCode, setFullCode] = useState("745257");

  const submit = () => {
    // inputRef01.current.

    CLOG.info("开始验证验证码...");
  };

  const onConfirmEvent = () => {
    loginWithCode({ code: fullCode });

    // setTempLogin(true);
    // router.replace("(tabs)");
  };

  const { state, sendCode, loginWithCode } = useLoginWithSMS({
    onLoginSuccess(user, isNewUser) {
      // show a toast, send analytics event, etc...
      CLOG.info("onLoginSuccess " + JSON.stringify(user));
      CLOG.info("onLoginSuccess2 " + isNewUser);
      DialogUtils.showSuccess("Login success " + user.id);

      setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
        }
      }, 1000);
    },

    onError(error) {
      CLOG.info("onError " + error);
      DialogUtils.showError("Login Failed " + error.message);
    },
  });

  // 输入变化
  useEffect(() => {
    setFullCode(`${text01}${text02}${text03}${text04}${text05}${text06}`);
  }, [text01, text02, text03, text04, text05, text06]);

  return (
    <CustomBaseScrollView title={""}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          paddingHorizontal: 20,
        }}
      >
        {/* 标题 */}
        <CustomTextView
          style={{
            color: "white",
            fontSize: 20,
            marginTop: percent10WinHeight,
          }}
          text={"Enter confirmation code"}
        ></CustomTextView>

        {/* 提示信息 */}
        <CustomTextView
          style={{
            color: "white",
            fontSize: 14,
            marginTop: percent5WinHeight,
          }}
          text={"Enter the 6-digit code we sent to ****** ***77."}
        ></CustomTextView>

        {/* 验证码输入框 */}
        <View
          style={{
            flexDirection: "row",
            // alignContent: "center",
            justifyContent: "space-between",
            // alignItems: "center",
            // backgroundColor: "green",
            paddingVertical: 20,
            marginHorizontal: 0,
            width: "100%",
          }}
        >
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef01}
              style={styles.inputText}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={(text) => {
                if (text !== "") {
                  inputRef02.current?.focus();
                }
                setText01(text);
              }}
              value={text01}
            ></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef02}
              style={styles.inputText}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={(text) => {
                if (text !== "") {
                  inputRef03.current?.focus();
                } else {
                  inputRef01.current?.focus();
                }
                setText02(text);
              }}
              value={text02}
            ></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef03}
              style={styles.inputText}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={(text) => {
                if (text !== "") {
                  inputRef04.current?.focus();
                } else {
                  inputRef02.current?.focus();
                }
                setText03(text);
              }}
              value={text03}
            ></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef04}
              style={styles.inputText}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={(text) => {
                if (text !== "") {
                  inputRef05.current?.focus();
                } else {
                  inputRef03.current?.focus();
                }
                setText04(text);
              }}
              value={text04}
            ></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef05}
              style={styles.inputText}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={(text) => {
                if (text !== "") {
                  inputRef06.current?.focus();
                } else {
                  inputRef04.current?.focus();
                }
                setText05(text);
              }}
              value={text05}
            ></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef06}
              style={styles.inputText}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={(text) => {
                setText06(text);

                if (text !== "") {
                  inputRef06.current?.blur();
                  submit();
                } else {
                  inputRef05.current?.focus();
                }
              }}
              value={text06}
            ></TextInput>
          </View>
        </View>

        {/* 红色提示信息 */}
        <View style={{ flexDirection: "row" }}>
          {/* 提示信息 */}
          <CustomTextView
            style={{
              color: "rgb(111,111,111)",
              fontSize: 12,
              // marginTop: percent10WinHeight,
            }}
            text={"Didn't receive your code? "}
          ></CustomTextView>

          {/* 提示信息 */}
          <CustomTextView
            style={{
              color: "rgb(255,67,53)",
              fontSize: 12,
              textDecorationLine: "underline",
              // marginTop: percent10WinHeight,
            }}
            text={"Resend code"}
          ></CustomTextView>
        </View>

        <Pressable onPress={onConfirmEvent}>
          <View
            style={{
              height: 40,
              backgroundColor: buttonBgColor,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginHorizontal: 35,
              borderRadius: 20,
              marginBottom: 10,
              marginTop: percent30WinHeight,
            }}
          >
            <View
              style={{
                // backgroundColor: "yellow",
                // width: "90%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",

                width: "100%",
              }}
            >
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  color: "white",
                  fontSize: 14,
                }}
              >
                Confirm
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    </CustomBaseScrollView>
  );
}

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
