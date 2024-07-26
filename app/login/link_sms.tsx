import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ViewProps,
  Pressable,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Alert,
  Modal,
  LogBox,
  Platform,
} from "react-native";
import {
  Link,
  router,
  Stack,
  useFocusEffect,
  useNavigation,
  useRouter,
} from "expo-router";
import React from "react";
import { Redirect } from "expo-router";
import {
  useMMKVBoolean,
  useMMKVListener,
  useMMKVObject,
} from "react-native-mmkv";
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
  useLinkSMS,
  useLinkWithOAuth,
  usePrivy,
} from "@privy-io/expo";
import { Button, Divider } from "@rneui/base";
import {
  CustomDialog,
  DialogUtils,
  toastConfig,
} from "@/constants/DialogUtils";
import {
  loginInterface,
  LoginParams,
  loginWithGoogle,
  loginWithSms,
  loginWithTwitter,
  requestInstance,
  updateUserHeader,
  userLogout,
} from "@/constants/HttpUtils";
import { AxiosResponse } from "axios";
import {
  buttonBgColor,
  buttonGray25Color,
  buttonGray30Color,
  buttonGray50Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import { TextInput } from "react-native-gesture-handler";

import { Image, ImageBackground } from "expo-image";
import {
  percent10WinHeight,
  percent30WinHeight,
  percent40WinHeight,
  percent5WinHeight,
  percent60WinHeight,
  windowHeight,
  windowWidth,
} from "@/constants/CommonUtils";
import { Squealt3Regular } from "@/constants/FontUtils";

import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { CustomTextView } from "@/components/Custom/CustomText";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { CLOG } from "@/constants/LogUtils";
import { PhoneCountryModel } from "@/constants/CountryProps";
import { FlashList } from "@shopify/flash-list";
import Toast from "react-native-toast-message";

// 登录状态
type LoginStatus =
  | "idle"
  | "privyHasLogin"
  | "needCreateWallet"
  | "needRecoveryWallet"
  | "walletConnected"
  | "serviceConnected";

// 新的登录页面
export default function PuffpawLinkView() {
  // 本地登录状态
  const [loginStatus, setLoginStatus] = useState<LoginStatus>("idle");

  const [smsSending, setSmsSending] = React.useState(false); // 发送验证码中
  const [smsConfirming, setSmsConfirming] = React.useState(false); // 验证验证码中

  // 手机号登录
  const [verifyCodeVisible, setVerifyCodeVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [fullPhone, setFullPhone] = useState(``);

  // 手机号选择国家数据
  const [defaultPhoneCountryDatas, setDefaultPhoneCountryDatas] = useState<
    PhoneCountryModel[] | null | undefined
  >(null);
  const [phoneCountryDatas, setPhoneCountryDatas] = useState<
    PhoneCountryModel[] | null | undefined
  >(null);
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState<
    PhoneCountryModel | null | undefined
  >({
    english_name: "United States",
    chinese_name: "美国",
    country_code: "US",
    phone_code: "1",
  });
  const [phoneCountryVisible, setPhoneCountryVisible] = useState(false);
  const [filterCountryText, setFilterCountryText] = useState("");
  const [phoneCountryClearVisible, setPhoneCountryClearVisible] =
    useState(false); // 搜索国家的清除按钮

  const inputRef01 = useRef<TextInput>(null);
  const inputRef02 = useRef<TextInput>(null);
  const inputRef03 = useRef<TextInput>(null);
  const inputRef04 = useRef<TextInput>(null);
  const inputRef05 = useRef<TextInput>(null);
  const inputRef06 = useRef<TextInput>(null);

  const [text01, setText01] = useState("");
  const [text02, setText02] = useState("");
  const [text03, setText03] = useState("");
  const [text04, setText04] = useState("");
  const [text05, setText05] = useState("");
  const [text06, setText06] = useState("");
  const [fullCode, setFullCode] = useState("");

  // 手机号登录
  const { sendCode, linkWithCode } = useLinkSMS({
    onSendCodeSuccess(args) {
      setSmsSending(false);

      CLOG.info("onSendCodeSuccess " + args.phone);

      setTimeout(() => {
        DialogUtils.showSuccess("Send code success " + args.phone);
      }, 500);

      setVerifyCodeVisible(true);
    },
    onLinkSuccess(user) {
      setSmsSending(false);
      setSmsConfirming(false);

      // show a toast, send analytics event, etc...
      CLOG.info("onLinkSuccess " + JSON.stringify(user));
      DialogUtils.showSuccess("Link success " + user.id);

      onUpdateUserInfo();

      setTimeout(() => {
        setVerifyCodeVisible(false);
      }, 1000);
    },
    onError(error) {
      setSmsSending(false);
      setSmsConfirming(false);

      CLOG.info("onError " + error);
      DialogUtils.showError("Login Failed " + error.message);
    },
  });

  const submit = () => {
    // inputRef01.current.

    CLOG.info("开始验证验证码...");
  };

  const onVerifyCodeEvent = async () => {
    if (fullCode.length !== 6) {
      return;
    }

    if (smsConfirming) {
      return;
    }

    // setVerifyCodeVisible(fa)
    setSmsConfirming(true);
    await linkWithCode({ code: fullCode });
    setSmsConfirming(false);
  };

  // 本地登录信息
  const [tempLogin, setTempLogin] = useMMKVObject<boolean>(
    ConstantStorage.tempLogin
  );
  const [localUser, setLocalUser] = useMMKVObject<LocalUserInfo | null>(
    ConstantStorage.localUser
  );

  // Privy信息
  const { user, isReady } = usePrivy();
  const account = getUserEmbeddedWallet(user);

  // 自定义信息
  const [checkLoginStatus, setCheckLoginStatus] = useState(false);
  const [checkStatus, setCheckStatus] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState<boolean>(!user);
  const [showEnterButton, setShowEnterButton] = useState<boolean>(false); // 是否展示进入按钮

  // 发送验证码
  const onSmsLoginEvent = async () => {
    if (phone === "") {
      DialogUtils.showError("Please input phone number");
      return;
    }

    const phoneNumber = fullPhone.replace("", "");
    CLOG.info(`phoneNumber= ${phoneNumber}`);

    setSmsSending(true);

    // 发送验证码
    await sendCode({ phone: phoneNumber });
  };

  // 重新发送验证码
  const onResendCodeEvent = async () => {
    if (phone === "") {
      DialogUtils.showError("Please input phone number");
      return;
    }

    const phoneNumber = fullPhone.replace("", "");
    CLOG.info(`phoneNumber= ${phoneNumber}`);

    // 发送验证码
    await sendCode({ phone: phoneNumber });
  };

  // 更新用户信息
  const onUpdateUserInfo = async () => {
    if (!user) {
      return;
    }

    setCheckLoginStatus(true);

    const uid = user.id.replace("did:privy:", "");
    const address = account?.address ?? "";

    let params: LoginParams = {
      privId: uid,
      address: address,
      platForm: Platform.OS,
    };

    let hasLogin = false;
    // CLOG.info(user.linked_accounts);
    user.linked_accounts.forEach(async (item) => {
      if (item.type == "phone") {
        hasLogin = true;
        const phoneNumber = item.phoneNumber.replace("", "");
        params.phone = phoneNumber;
      } else if (item.type == "google_oauth") {
        hasLogin = true;
        params.google = item.email ?? item.name;
      } else if (item.type == "twitter_oauth") {
        hasLogin = true;
        params.twitter = item.username ?? item.name;
      }
    });

    if (hasLogin) {
      const response = await loginInterface(params);
      loginSuccess(response);
      setCheckLoginStatus(false);
    }
  };

  // 登录成功
  const loginSuccess = (response: AxiosResponse<any, any> | null) => {
    const topData = response?.data;
    if (topData == null) {
      setShowEnterButton(true);
      return;
    }

    const { code, msg, data } = topData;
    if (code != 0) {
      setShowEnterButton(true);
      return;
    }

    const { depinUser } = data;
    if (depinUser == null) {
      setShowEnterButton(true);
      return;
    }

    setShowEnterButton(false);

    // 用户登陆成功
    const { token } = depinUser;
    updateUserHeader(token);

    setLocalUser(depinUser);

    // 服务已经链接上了
    setLoginStatus("serviceConnected");

    // setIsLogin(true);
  };

  // 读取手机号城市数据
  const loadPhoneRegionData = async () => {
    try {
      CLOG.info(`loadPhoneData`);
      const datas = require("@/assets/datas/country_phone_codes.json");

      // CLOG.info(datas);
      if (datas !== null && datas !== undefined) {
        // const parsedData = parseCountryData(datas);
        setPhoneCountryDatas(datas);
        setDefaultPhoneCountryDatas(datas);
      }
    } catch (e) {
      CLOG.info(`localUri: ${e}`);
    }
  };

  // 保存完整手机号
  useEffect(() => {
    setFullPhone(`+${selectedPhoneCountry?.phone_code}${phone}`);
  }, [selectedPhoneCountry, phone]);

  useEffect(() => {
    setFullCode(`${text01}${text02}${text03}${text04}${text05}${text06}`);
  }, [text01, text02, text03, text04, text05, text06]);

  // 国家手机区号搜索
  useEffect(() => {
    setPhoneCountryClearVisible(filterCountryText !== "");

    if (!defaultPhoneCountryDatas) {
      return;
    }

    if (filterCountryText === "") {
      loadPhoneRegionData();
      return;
    }

    const filterCountryDatas = defaultPhoneCountryDatas.filter((e) => {
      const exist =
        e.english_name
          ?.toLowerCase()
          .includes(filterCountryText.toLowerCase()) ||
        e.chinese_name
          ?.toLowerCase()
          .includes(filterCountryText.toLowerCase()) ||
        e.phone_code?.toLowerCase().includes(filterCountryText.toLowerCase()) ||
        e.country_code?.toLowerCase().includes(filterCountryText.toLowerCase());

      if (exist) {
        return e;
      }
      return null;
    });

    setPhoneCountryDatas(filterCountryDatas);
  }, [filterCountryText]);

  // 加载国家手机区号数据
  useEffect(() => {
    loadPhoneRegionData();
  }, []);

  // 页面可见时
  useFocusEffect(
    useCallback(() => {
      // 钱包已经连接上, 判断是否有用户信息
      if (user && !checkLoginStatus) {
        // CLOG.info("Enter Home");
      }
    }, [])
  );

  // 登录状态变化
  useEffect(() => {
    if (isReady && user != null) {
      if (loginStatus === "idle") {
        setLoginStatus("privyHasLogin");
      }
    }
  }, [isReady, user]);

  return (
    <BackgroundView
      style={{ flex: 1 }}
      x={"0%"}
      y={"90%"}
      rx={"60%"}
      ry={"40%"}
    >
      <Stack.Screen
        options={{
          title: `Link Phone`,
          headerShadowVisible: true,
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
      <StatusBar barStyle={"light-content"} translucent={true}></StatusBar>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <ScrollView
          style={{
            paddingHorizontal: "13%",
            width: "100%",
            height: "100%",
            // backgroundColor: "red",
          }}
        >
          {/* Privy加载中图标 */}
          {!isReady && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator
                style={{ marginRight: 10 }}
                color={"white"}
              ></ActivityIndicator>
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 12,
                  color: "white",
                }}
              >
                Checking Privy Status
              </Text>
            </View>
          )}
          <View style={{ height: windowHeight * 0.15 }}></View>
          {/* 图标 */}
          <View
            style={{
              // flex: 1,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
              // backgroundColor: "green",
            }}
          >
            <Image
              style={{ width: 39, height: 30, marginRight: 5 }}
              source={require("@/assets/images/login/login_red_clound.png")}
              contentFit="contain"
              onError={(e) => {
                console.warn("图片展示错误 " + e.error);
              }}
            ></Image>
            <Image
              style={{ width: 180, height: 30 }}
              source={require("@/assets/images/login/login_puffpaw.png")}
              contentFit="contain"
            ></Image>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              // flexDirection: "row",
            }}
          >
            <Image
              style={{ width: 180, height: 32, marginTop: 10 }}
              source={require("@/assets/images/login/login_martvape.png")}
              contentFit="contain"
            ></Image>
          </View>

          {/* 手机号输入框 */}
          <View
            style={{
              justifyContent: "flex-start",
              // alignContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: buttonGray25Color,
              borderRadius: 8,
              height: 40,
              marginTop: 80,
              paddingHorizontal: 5,
            }}
          >
            <Pressable
              onPress={() => {
                setFilterCountryText("");
                setPhoneCountryVisible(true);
              }}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  // height: 20,
                  color: "white",
                  fontSize: 12,
                  marginLeft: 5,
                }}
              >
                {selectedPhoneCountry?.country_code}
              </Text>
              <Text
                style={{
                  // height: 20,
                  color: "white",
                  fontSize: 12,
                  marginHorizontal: 5,
                }}
              >
                +{selectedPhoneCountry?.phone_code}
              </Text>
            </Pressable>

            {/* 国家选择 */}
            {/* <CountryPicker
              countryCode={countryCode}
              withCallingCode={true}
              withFilter={true}
              withCallingCodeButton={true}
              withCloseButton
              // withFlag
              // theme={}
              containerButtonStyle={
                {
                  // backgroundColor: "red",
                  // height: 33,
                  // borderRadius: 5,
                  // borderWidth: 1,
                  // borderColor: "rgb(130,130,130)",
                  // paddingHorizontal: 5,
                }
              }
              onSelect={(country: Country) => {
                setCountryCode(country.cca2);
                // setPhone(callingCode);

                if (country.callingCode.length > 0) {
                  setCallingCode(country.callingCode[0]);
                }
              }}
              theme={{
                // primaryColor: "red",
                // primaryColorVariant: "green",
                backgroundColor: "black",
                onBackgroundTextColor: "white",
                fontSize: 12,
                filterPlaceholderTextColor: "#aaa",
                activeOpacity: 0.7,
                // itemHeight: 30,
              }}
            /> */}

            <Image
              style={{ width: 9, height: 9, marginLeft: 3 }}
              source={require("@/assets/images/login/login_down_arrow.png")}
              contentFit="contain"
            ></Image>
            <TextInput
              style={{ marginLeft: 3, flex: 1, color: "white" }}
              keyboardType="phone-pad"
              onChangeText={setPhone}
              value={phone}
              maxLength={20}
            ></TextInput>

            <Pressable onPress={onSmsLoginEvent}>
              {smsSending && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                  }}
                >
                  <ActivityIndicator
                    style={{}}
                    color={"white"}
                  ></ActivityIndicator>
                </View>
              )}
              <Image
                style={{ width: 30, height: 30, marginRight: 5 }}
                source={require("@/assets/images/login/login_right_arrow_red.png")}
                contentFit="contain"
              ></Image>
            </Pressable>
          </View>

          {/* </Pressable> */}

          {/* 分割线 */}
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginVertical: 30,
            }}
          >
            <Divider style={{ flex: 1 }} color={buttonGray50Color}></Divider>
            <Text
              style={{
                marginHorizontal: 20,
                height: 20,
                color: buttonGray50Color,
                fontSize: 12,
              }}
            >
              or
            </Text>
            <Divider style={{ flex: 1 }} color={buttonGray50Color}></Divider>
          </View>

          <View style={{ height: windowHeight * 0.15 }}></View>
        </ScrollView>
        {addtionView}
      </SafeAreaView>

      {/* 输入验证码页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={verifyCodeVisible}
        onRequestClose={() => {
          setVerifyCodeVisible(!verifyCodeVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // marginTop: 22,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              paddingHorizontal: 20,
              marginHorizontal: 30,
              backgroundColor: "rgb(30,30,30)",
              borderRadius: 14,
            }}
          >
            {/* 关闭按钮 */}
            <Pressable
              onPress={() => {
                setVerifyCodeVisible(false);
              }}
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: 15,
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1 }}></View>
              <Image
                style={{ width: 20, height: 20, marginRight: 0 }}
                contentFit="contain"
                source={require("@/assets/images/nft/dialog/close.png")}
                // style={styles.centeredView1}
              ></Image>
            </Pressable>

            {/* 标题 */}
            <CustomTextView
              style={{
                color: "white",
                fontSize: 20,
                marginTop: 10,
              }}
              text={"Enter confirmation code"}
            ></CustomTextView>

            {/* 提示信息 */}
            <CustomTextView
              style={{
                color: "white",
                fontSize: 14,
                marginTop: 30,
              }}
              text={`Enter the 6-digit code we sent to ${fullPhone}.`}
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
                      if (text01.length > 0) {
                        inputRef01.current?.setNativeProps({
                          selection: { start: 1, end: 1 }, // 将光标位置设置为第1个字符后面
                        });
                      }
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
                      if (text02.length > 0) {
                        inputRef02.current?.setNativeProps({
                          selection: { start: 1, end: 1 }, // 将光标位置设置为第1个字符后面
                        });
                      }
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
                      if (text03.length > 0) {
                        inputRef03.current?.setNativeProps({
                          selection: { start: 1, end: 1 }, // 将光标位置设置为第1个字符后面
                        });
                      }
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
                      if (text04.length > 0) {
                        inputRef04.current?.setNativeProps({
                          selection: { start: 1, end: 1 }, // 将光标位置设置为第1个字符后面
                        });
                      }
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
                      if (text05.length > 0) {
                        inputRef05.current?.setNativeProps({
                          selection: { start: 1, end: 1 }, // 将光标位置设置为第1个字符后面
                        });
                      }
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
              <Pressable onPress={onResendCodeEvent}>
                <CustomTextView
                  style={{
                    color: "rgb(255,67,53)",
                    fontSize: 12,
                    textDecorationLine: "underline",
                    // marginTop: percent10WinHeight,
                  }}
                  text={"Resend code"}
                ></CustomTextView>
              </Pressable>
            </View>

            <Pressable onPress={onVerifyCodeEvent}>
              <View
                style={{
                  height: 40,
                  backgroundColor: buttonBgColor,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginHorizontal: 35,
                  borderRadius: 20,
                  marginBottom: 30,
                  marginTop: 40,
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
                  {smsConfirming && (
                    <ActivityIndicator
                      style={{ marginRight: 10 }}
                      color={"white"}
                    ></ActivityIndicator>
                  )}
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
        </View>
        <CustomDialog />
      </Modal>

      {/* 手机号国家选择页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={phoneCountryVisible}
        onRequestClose={() => {
          setPhoneCountryVisible(!phoneCountryVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // marginTop: 22,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View
            style={{
              marginTop: percent40WinHeight,
              width: "100%",
              height: percent60WinHeight,
            }}
          >
            {/* <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/long_bg.png")}
              // style={styles.centeredView1}
            > */}
            <Pressable
              onPress={() => setPhoneCountryVisible(false)}
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: 10,
                flexDirection: "row",
              }}
            >
              <Image
                style={{ width: 20, height: 20, marginRight: 25 }}
                contentFit="contain"
                source={require("@/assets/images/nft/dialog/close.png")}
                // style={styles.centeredView1}
              ></Image>
            </Pressable>

            {/* 文本内容 */}
            <View
              style={{
                // flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 15,
                paddingHorizontal: 0,
                // backgroundColor: "red",
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  // flex: 1,
                  borderRadius: 25,
                  height: 40,
                  width: "100%",
                  backgroundColor: "rgb(20,20,20)",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  borderColor: buttonGray50Color,
                  borderWidth: 1,
                }}
              >
                <Image
                  source={require("@/assets/images/mine/search.png")}
                  style={{ width: 18, height: 18 }}
                />
                <TextInput
                  placeholder="Search..."
                  placeholderTextColor={"gray"}
                  value={filterCountryText}
                  style={{
                    color: "white",
                    fontSize: 14,
                    flex: 1,
                    marginLeft: 10,
                  }}
                  onChangeText={setFilterCountryText}
                  maxLength={20}
                ></TextInput>
                {phoneCountryClearVisible && (
                  <Pressable
                    onPress={() => {
                      setFilterCountryText("");
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 40,
                      // backgroundColor: "red",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <Image
                        source={require("@/assets/images/login/clear.png")}
                        style={{ width: 18, height: 18 }}
                      />
                    </View>
                  </Pressable>
                )}
              </View>
            </View>

            {/* 输入框 */}
            <View
              style={{
                paddingHorizontal: 20,
                flexDirection: "row",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <FlashList
                  // numColumns={2}

                  data={phoneCountryDatas}
                  renderItem={({ item, index }) => {
                    return (
                      <Pressable
                        style={{
                          // marginHorizontal: 20,
                          backgroundColor: "rgb(17,17,17)",
                          height: 50,
                          width: "100%",
                          marginBottom: 5,
                          borderRadius: 10,
                          borderColor: "rgb(40,40,40)",
                          borderWidth: 0.5,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center",
                          paddingHorizontal: 10,
                        }}
                        onPress={() => {
                          // setCountry(item.label_en ?? "");
                          setSelectedPhoneCountry(item);
                          setPhoneCountryVisible(false);
                        }}
                      >
                        {/* <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            alignContent: "center",
                          }}
                        > */}
                        {/* 提示信息 */}
                        <Text
                          style={{
                            fontFamily: Squealt3Regular,
                            fontSize: 16,
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          {item.english_name}
                        </Text>
                        <View style={{ flex: 1 }}></View>
                        <Text
                          style={{
                            fontFamily: Squealt3Regular,
                            fontSize: 16,
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          +{item.phone_code}
                        </Text>
                        {/* </View> */}
                      </Pressable>
                    );
                  }}
                  estimatedItemSize={50}
                />
              </View>
            </View>
            {/* </ImageBackground> */}
          </View>
        </View>
        <CustomDialog />
      </Modal>
    </BackgroundView>
  );
}

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
