import { ConstantStorage } from "@/constants/LocalStorage";
import {
  LoginFunction,
  LoginItemType,
  PrivyLoginProps,
} from "@/constants/ViewProps";
import React, { PropsWithChildren, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  View,
  ViewProps,
  Text,
  Image,
} from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import { router } from "expo-router";
import {
  getUserEmbeddedWallet,
  useEmbeddedWallet,
  useLoginWithOAuth,
  usePrivy,
} from "@privy-io/expo";
import { EmailLoginView, SmsLoginView } from "./EmailLoginView";
import Toast from "react-native-root-toast";
import { DialogUtils } from "@/constants/DialogUtils";

export const PrivyLoginView = ({
  style,
  children,
  callbackEvent,
  closeEvent,
}: PrivyLoginProps) => {
  const { login, state } = useLoginWithOAuth({
    onError(error) {
      console.log("onError " + error.message);
      DialogUtils.showError("Login Error " + error.message);
    },
    onSuccess(user, isNewUser) {
      console.log("onSuccess " + JSON.stringify(user));
      DialogUtils.showSuccess("Login success");
    },
  });
  const [loginType, setLoginType] = useState<LoginItemType>("none");

  return (
    <ScrollView
      style={{
        flex: 1,
        // height: 300,
        width: "100%",
        backgroundColor: "black",
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
      }}
    >
      {/* <CardItemView
        title="Email"
        iconName="email"
        callbackEvent={() => {
          if (loginType == "email") {
            setLoginType("none");
          } else {
            setLoginType("email");
          }
        }}
      ></CardItemView>
      {loginType == "email" && <EmailLoginView></EmailLoginView>} */}

      {/* <CreateWalletButton></CreateWalletButton> */}
      <CardItemView
        title="SMS"
        iconName="phone"
        callbackEvent={() => {
          if (loginType == "sms") {
            setLoginType("none");
          } else {
            setLoginType("sms");
          }
        }}
      ></CardItemView>
      {loginType == "sms" && <SmsLoginView></SmsLoginView>}

      <CardItemView
        title="Google"
        iconName="google"
        callbackEvent={() => {
          setLoginType("social");
          login({ provider: "google" });
          console.log("google");
        }}
      ></CardItemView>
      <CardItemView
        title="X"
        iconName="twitter"
        callbackEvent={() => {
          setLoginType("social");
          login({ provider: "twitter" });
        }}
      ></CardItemView>
      <CardItemView
        title="Other socials"
        iconName="account"
        showRightIcon={true}
        callbackEvent={() => {
          setLoginType("other");
        }}
      ></CardItemView>
      <CardItemView
        iconName="wallet"
        title="Continue with a wallet"
        showRightIcon={true}
        callbackEvent={() => {
          setLoginType("other");
        }}
      ></CardItemView>
      {/* <PrivyUserInfoView></PrivyUserInfoView> */}

      <PrivyFooterView></PrivyFooterView>
    </ScrollView>
  );
};

type LoginItemProps = ViewProps & {
  title: string;
  iconName: string;
  rightText?: string;
  showRightIcon?: boolean;
  callbackEvent?: LoginFunction;
};

const CardItemView = ({
  title,
  iconName,
  rightText,
  showRightIcon,
  callbackEvent,
}: LoginItemProps) => {
  const rightIcon = require("@/assets/images/mine/right_arrow.png");
  let width = 5,
    height = 12;

  return (
    <Pressable onPress={callbackEvent}>
      <View
        style={{
          // marginLeft: 10,
          // marginRight: 10,
          // marginTop: 5,
          marginHorizontal: 10,
          marginVertical: 10,
          backgroundColor: "rgb(20,20,20)",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "row",
          borderRadius: 12,
          // flex: 1,
          borderColor: "rgb(50,50,50)",
          borderWidth: 1,
          height: 50,
          padding: 10,
        }}
      >
        <Icons
          size={30}
          name={iconName}
          color={"rgb(120,120,120)"}
          style={{ marginLeft: 10 }}
        ></Icons>
        {/* <Image
          source={require("@/assets/images/mine/tuite.png")}
          style={{
            width: 30,
            height: 30,
            marginLeft: 10,
          }}
        ></Image> */}
        <Text
          style={{
            backgroundColor: "rgb(20,20,20)",
            // height: 30,
            color: "white",
            fontSize: 16,
            marginLeft: 15,
          }}
        >
          {title}
        </Text>
        <View style={{ flex: 1 }}></View>
        <Text
          style={{
            backgroundColor: "rgb(20,20,20)",
            color: "gray",
            fontSize: 14,
            marginRight: 10,
          }}
        >
          {rightText}
        </Text>
        {showRightIcon && (
          <Image
            source={rightIcon}
            style={{
              width: width,
              height: height,
              marginRight: 5,
            }}
          ></Image>
        )}
      </View>
    </Pressable>
  );
};

const BottomButtonView = ({ title, callbackEvent }: LoginItemProps) => {
  return (
    <Pressable onPress={callbackEvent}>
      <View
        style={{
          // marginHorizontal: 30,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          // backgroundColor: "red",
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: "red",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            height: 45,
            width: 250,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "black", fontSize: 16 }}>{title}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const PrivyUserInfoView = () => {
  const { user } = usePrivy();

  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        // paddingVertical: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
        {user && JSON.stringify(user)}
      </Text>
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View style={{ width: 10 }}></View>
        <Text style={{ color: "white", fontSize: 35, fontWeight: "bold" }}>
          Privy
        </Text>
      </View> */}
    </View>
  );
};

const PrivyFooterView = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        paddingVertical: 20,
      }}
    >
      <Text style={{ color: "rgb(90,101,238)", fontSize: 14 }}>
        I have a passkey
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <View style={{ width: 15, height: 15, backgroundColor: "gray" }}></View>
        <View style={{ width: 10 }}></View>
        <Text style={{ color: "gray", fontSize: 14, fontWeight: "bold" }}>
          Protected by Privy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: Constants.statusBarHeight,
  },
});

// const loginUrl = `https://client_web_privy_dev_build.4everland.app/`;
// // const loginUrl = `http://192.168.1.7:3000`;
// // const loginUrl = `http://172.30.66.89:3000`;

// export const PrivyLoginView = ({
//   style,
//   children,
//   callbackEvent,
// }: PrivyLoginProps) => {
//   const webViewRef = useRef<WebView>(null);
//   const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);

//   const INJECTED_JAVASCRIPT = `loginSuccess();`;

//   const onPress = () => {
//     webViewRef?.current?.postMessage("message from react native");
//   };

//   const onWebMessageListener = (event: { nativeEvent: { data: any } }) => {
//     // data 为字符串
//     const { data } = event.nativeEvent;
//     console.log(data);
//     if (data == null) {
//       return;
//     }

//     const { method } = JSON.parse(data);
//     console.log(`方法名称 ${method}`);

//     if (method == "login") {
//       setIsLogin(true);
//       // router.replace("/");
//     }
//   };
//   return (
//     <View style={{ flex: 1, backgroundColor: "white" }}>
//       <WebView
//         ref={webViewRef}
//         style={{ width: "100%", height: 500, backgroundColor: "white" }}
//         // style={styles.container}
//         originWhitelist={["*"]}
//         source={{ uri: loginUrl }}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         onMessage={onWebMessageListener}
//         // injectedJavaScript={runFirst}
//         injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
//       />
//       {/* <Button title={"button"} onPress={onPress}></Button> */}
//     </View>
//   );
// };
