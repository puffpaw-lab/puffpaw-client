import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  ViewProps,
  Pressable,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Link, router, Stack, useNavigation, useRouter } from "expo-router";
import React from "react";
import { Redirect } from "expo-router";
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv";
import { ConstantStorage, LocalUserInfo } from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";
import { SafeAreaView } from "react-native-safe-area-context";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import { BottomSheet } from "@rneui/themed";
import { PrivyLoginView } from "@/components/Custom/PrivyLoginView";
import {
  getUserEmbeddedWallet,
  isConnected,
  isDisconnected,
  isNotCreated,
  needsRecovery,
  useEmbeddedWallet,
  usePrivy,
} from "@privy-io/expo";
import { Button } from "@rneui/base";
import { DialogUtils } from "@/constants/DialogUtils";
import {
  LoginParams,
  loginWithGoogle,
  loginWithSms,
  loginWithTwitter,
} from "@/constants/HttpUtils";
import { AxiosResponse } from "axios";
import { CLOG } from "@/constants/LogUtils";

export default function loginScreen() {
  // 1, 在privy ready之后才开始处理逻辑,
  // 2, 获取privy的user和wallet信息，
  //    2.1, user未登录 -> 展示登录界面
  //    2.2, user已登录,但是wallet未创建或者wallet可以恢复 -> 展示wallet创建或者恢复页面
  // 3, 监听钱包创建或者恢复成功并且是连接成功状态,调用接口去登录, 登录成功之后,返回的信息存储本地，自动进入首页

  // 本地登录信息
  // const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);
  const [localUser, setLocalUser] = useMMKVObject<LocalUserInfo | null>(
    ConstantStorage.localUser
  );

  const [checkStatus, setCheckStatus] = useState(false);
  const [checkLoginStatus, setCheckLoginStatus] = useState(true);
  const { user, isReady } = usePrivy();

  // 钱包注册信息
  const wallet = useEmbeddedWallet({
    onCreateWalletSuccess(wallet) {
      CLOG.info("onCreateWalletSuccess " + wallet.toJSON);
      DialogUtils.showSuccess("Create wallet success");
    },
    onRecoverWalletSuccess(wallet) {
      CLOG.info("onRecoverWalletSuccess " + wallet.toJSON);
      DialogUtils.showSuccess("Recover wallet success");
    },
    onCreateWalletError(error) {
      CLOG.info("onCreateWalletError " + error.message);
      DialogUtils.showError("Create wallet error");
    },
    onRecoverWalletError(error) {
      CLOG.info("onRecoverWalletError " + error.message);
      DialogUtils.showError("Recover wallet error");
    },
  });

  const account = getUserEmbeddedWallet(user);

  const onCreateWallet = () => {
    router.push("/wallet/create");
    // wallet.create({ recoveryMethod: "user-passcode", password: "privy-login" });
  };

  useEffect(() => {
    const show = isReady && !user;
  }, []);

  const onLogin = () => {
    // setIsVisible(true);
    router.push("/modal");
  };

  const onEnterHome = async () => {
    if (!user) {
      return;
    }

    const uid = user.id.replace("did:privy:", "");
    const address = account?.address ?? "";

    let params: LoginParams = {
      privId: uid,
      address: address,
      platForm: "",
    };

    const phoneInfo = user.linked_accounts.map((item) => item.type == "phone");
    const googleInfo = user.linked_accounts.map(
      (item) => item.type == "google_oauth"
    );
    const twitterInfo = user.linked_accounts.map(
      (item) => item.type == "twitter_oauth"
    );

    user.linked_accounts.forEach(async (item) => {
      if (item.type == "phone") {
        const phoneNumber = item.phoneNumber.replace(" ", "");
        params.phone = phoneNumber;

        const response = await loginWithSms(params);
        loginSuccess(response);
      } else if (item.type == "google_oauth") {
        params.google = item.email;

        const response = await loginWithGoogle(params);
        loginSuccess(response);
      } else if (item.type == "twitter_oauth") {
        params.twitter = item.name;

        const response = await loginWithTwitter(params);
        loginSuccess(response);
      }
    });
  };

  const loginSuccess = (response: AxiosResponse<any, any> | null) => {
    const topData = response?.data;
    if (topData == null) {
      return;
    }

    const { code, msg, data } = topData;
    if (code != 0) {
      return;
    }

    const { depinUser } = data;
    if (depinUser == null) {
      return;
    }

    setLocalUser(depinUser);
    jumpToHome();
  };

  const onRecoveryEvent = () => {
    router.push("/wallet/recovery");
  };

  const jumpToHome = () => {
    CLOG.info("跳转到首页");

    // router.push("/(tabs)/index");
  };

  useEffect(() => {
    CLOG.info(`isReady=${isReady}`);
    CLOG.info(`localUser=${localUser}`);

    // 钱包已经连接上,两秒之后跳转到首页
    if (isConnected(wallet) && localUser != null) {
      CLOG.info("钱包已经连接上");
    }
  }, [isReady, wallet, user, localUser]);

  if (!isReady) {
    return <UnReadyView></UnReadyView>;
  }

  return (
    <BackgroundView
      style={{ flex: 1 }}
      x={"50%"}
      y={"0%"}
      rx={"100%"}
      ry={"70%"}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle={"light-content"}></StatusBar>
      <SafeAreaView
        style={{
          flex: 1,
          // justifyContent: "center",
          // alignContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 220, height: 70, marginTop: "30%" }}
          source={require("@/assets/images/login/login_logo.png")}
        ></Image>
        <Image
          style={{ width: 300, height: 20, marginTop: 50 }}
          source={require("@/assets/images/login/login_vapes.png")}
        ></Image>
        <View style={{ flex: 1 }}></View>

        {!user && (
          <Pressable onPress={onLogin}>
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
                  flexDirection: "row",
                  height: 45,
                  width: 250,
                  borderRadius: 20,
                }}
              >
                {checkStatus && (
                  <ActivityIndicator
                    style={{ marginRight: 10 }}
                    color={"white"}
                  ></ActivityIndicator>
                )}
                <Text style={{ color: "white", fontSize: 16 }}>
                  Login With Privy
                </Text>
              </View>
            </View>
          </Pressable>
        )}

        {user && isConnected(wallet) && (
          <Pressable onPress={onEnterHome}>
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
                  flexDirection: "row",
                  height: 45,
                  width: 250,
                  borderRadius: 20,
                }}
              >
                {checkStatus && (
                  <ActivityIndicator
                    style={{ marginRight: 10 }}
                    color={"white"}
                  ></ActivityIndicator>
                )}
                <Text style={{ color: "black", fontSize: 16 }}>Enter Home</Text>
              </View>
            </View>
          </Pressable>
        )}

        {user && isNotCreated(wallet) && (
          <Pressable onPress={onCreateWallet}>
            <View
              style={{
                marginVertical: 20,
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
                  flexDirection: "row",
                  height: 45,
                  width: 250,
                  borderRadius: 20,
                }}
              >
                {checkStatus && (
                  <ActivityIndicator
                    style={{ marginRight: 10 }}
                    color={"white"}
                  ></ActivityIndicator>
                )}
                <Text style={{ color: "black", fontSize: 16 }}>
                  Create Privy Wallet
                </Text>
              </View>
            </View>
          </Pressable>
        )}

        {needsRecovery(wallet) &&
          account?.recovery_method == "user-passcode" && (
            <Pressable onPress={onRecoveryEvent}>
              <View
                style={{
                  marginVertical: 20,
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
                    flexDirection: "row",
                    height: 45,
                    width: 250,
                    borderRadius: 20,
                  }}
                >
                  {checkStatus && (
                    <ActivityIndicator
                      style={{ marginRight: 10 }}
                      color={"white"}
                    ></ActivityIndicator>
                  )}
                  <Text style={{ color: "black", fontSize: 16 }}>
                    Recovery Privy Wallet
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

        <ScrollView style={{}}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {isReady && user && (
              <Text style={{ color: "white" }}>
                UserInfo: {JSON.stringify(user)}
              </Text>
            )}

            {isReady && user && wallet && (
              <Text style={{ color: "white", margin: 10 }}>
                Wallet Status: {wallet.status}
                {wallet.status == "error" ? wallet.error : ""}
              </Text>
            )}
            {localUser && (
              <Text style={{ color: "white" }}>
                LocalUserInfo: {JSON.stringify(localUser)}
              </Text>
            )}
          </View>
        </ScrollView>

        {/* <View style={{ flex: 1 }}></View> */}
      </SafeAreaView>
    </BackgroundView>
  );
}

const UnReadyView = () => {
  return (
    <BackgroundView
      style={{ flex: 1 }}
      x={"50%"}
      y={"0%"}
      rx={"100%"}
      ry={"70%"}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle={"light-content"}></StatusBar>
      <SafeAreaView
        style={{
          flex: 1,
          // justifyContent: "center",
          // alignContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 220, height: 70, marginTop: "30%" }}
          source={require("@/assets/images/login/login_logo.png")}
        ></Image>
        <Image
          style={{ width: 300, height: 20, marginTop: 50 }}
          source={require("@/assets/images/login/login_vapes.png")}
        ></Image>
        <View style={{ flex: 1 }}></View>

        {
          <View style={{ flexDirection: "row", margin: 20 }}>
            <ActivityIndicator
              style={{ marginRight: 10 }}
              color={"white"}
            ></ActivityIndicator>
            <Text style={{ color: "white" }}>Checking Privy Status</Text>
          </View>
        }

        {/* <View style={{ flex: 1 }}></View> */}
      </SafeAreaView>
    </BackgroundView>
  );
};

type GreetFunction = () => void;

type LoginProps = ViewProps & {
  title: string;
  iconName: string;
  rightText?: string;
  showRightIcon?: boolean;
  callbackEvent?: GreetFunction;
};

const BottomButtonView = ({ title, callbackEvent }: LoginProps) => {
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
            flexDirection: "row",
            height: 45,
            width: 250,
            borderRadius: 20,
          }}
        >
          {
            <ActivityIndicator
              style={{ margin: 20 }}
              color={"white"}
            ></ActivityIndicator>
          }
          <Text style={{ color: "black", fontSize: 16 }}>{title}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    // width: "100%",
    // height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  logo: {
    width: 220,
    height: 70,
    marginTop: "30%",
  },
  vapes: {
    width: 300,
    height: 20,
    // marginTop: "-30%",
  },
  button: {
    width: 250,
    height: 40,
    marginTop: "80%",
  },
  contentContainer: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "green",
  },
});
