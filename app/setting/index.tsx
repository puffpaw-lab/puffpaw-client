import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
  Text,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";

import React, { useEffect, useState } from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv";
import { ConstantStorage, LocalUserInfo } from "@/constants/LocalStorage";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { BackgroundView } from "@/components/Custom/BackgroundView";

import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import {
  getUserEmbeddedWallet,
  isConnected,
  isNotCreated,
  needsRecovery,
  useEmbeddedWallet,
  useLinkSMS,
  useLinkWithOAuth,
  usePrivy,
} from "@privy-io/expo";
import * as Clipboard from "expo-clipboard";
import {
  CustomDialog,
  DialogUtils,
  toastConfig,
} from "@/constants/DialogUtils";
import {
  addressListInterface,
  loginInterface,
  LoginParams,
  requestInstance,
  updateUserHeader,
  updateUserInfoInterface,
  userInfoInterface,
  userLogout,
} from "@/constants/HttpUtils";
import { HeaderIconView } from "@/components/Custom/UserHeaderView";
import { formatAccount, formatMoney } from "@/constants/CommonUtils";
import {
  buttonBgColor,
  buttonGray150Color,
  buttonGray25Color,
  buttonGray30Color,
  buttonGray50Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import { Image, ImageBackground, ImageSource } from "expo-image";
import { Squealt3Regular } from "@/constants/FontUtils";
import { Divider } from "@rneui/base";
import { TextInput } from "react-native-gesture-handler";
import { AxiosResponse } from "axios";
import { CLOG } from "@/constants/LogUtils";
import Toast from "react-native-toast-message";
import * as Application from "expo-application";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 更新类型
type SettingEditType =
  | "none"
  | "name"
  | "phone"
  | "google"
  | "x"
  | "farcaster"
  | "telegram";

type BalanceModel = {
  type: BalanceType;
  icon: ImageSource | null;
  balance: string | null; // 余额
  dollar: string | null; // 美元
};

// 更新类型
type BalanceType = "ETH" | "PFF";

const ethBalanceItems: BalanceModel[] = [
  {
    type: "ETH",
    icon: require("@/assets/images/mine/ethereum_eth_icon.png"),
    balance: "0",
    dollar: "0",
  },
  {
    type: "PFF",
    icon: require("@/assets/images/mine/pff_icon.png"),
    balance: "0",
    dollar: "0",
  },
];

// 设置页面
export default function settingScreen() {
  const { isReady, user, logout } = usePrivy();
  const account = getUserEmbeddedWallet(user);
  const [logouting, setLogouting] = React.useState(false); // 退出登录中

  const [switchWalletVisible, setSwitchWalletVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const [localUser, setLocalUser] = useMMKVObject<LocalUserInfo | null>(
    ConstantStorage.localUser
  );

  // 地址信息
  const [addressId, setAddressId] = React.useState<number | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const [editType, setEditType] = useState<SettingEditType>("none");
  const [editViewVisible, setEditViewVisible] = useState(false);
  const [editViewText, setEditViewText] = useState("");

  // app 版本信息
  const [newAppVersion, setNewAppVersion] = useState(false);
  const [appVersion, setAppVersion] = useState(
    Application.nativeApplicationVersion
  );

  const { bottom } = useSafeAreaInsets();

  // 余额
  const [balanceItems, setBalanceItems] =
    useState<BalanceModel[]>(ethBalanceItems);

  const updateUserInfo = async () => {
    const inputText = editViewText ?? "";

    if (inputText.length <= 0) {
      return;
    }

    let params = {};
    switch (editType) {
      case "none":
        break;
      case "name":
        params = {
          name: inputText,
        };
        break;
      case "phone":
        params = {
          phone: inputText,
        };
        break;
      case "google":
        params = {
          google: inputText,
        };
        break;
      case "x":
        params = {
          twitter: inputText,
        };
        break;
      case "farcaster":
        params = {
          farcaster: inputText,
        };
        break;
      case "telegram":
        params = {
          telegram: inputText,
        };
        break;
    }
    const response = await updateUserInfoInterface(params);
    userInfoSuccess(response);
  };

  // 修改用户信息成功
  const userInfoSuccess = (response: AxiosResponse<any, any> | null) => {
    const topData = response?.data;
    if (topData == null) {
      return;
    }

    const { code, msg, data } = topData;
    if (code != 0) {
      DialogUtils.showError(`${msg}`);
      return;
    }

    const { depinUser } = data;
    if (depinUser !== null) {
      setEditType("none");
      setEditViewVisible(false);
      DialogUtils.showSuccess(`Update success`);

      getUserInfo();
    }
  };

  // 重新获取用户信息
  const getUserInfo = async () => {
    const response = await userInfoInterface();
    const topData = response?.data;
    if (topData == null) {
      return;
    }

    const { code, msg, data } = topData;
    if (code != 0) {
      DialogUtils.showError(`${msg}`);
      return;
    }

    const { depinUser } = data;
    if (depinUser !== null) {
      setLocalUser(depinUser);
    }
  };

  // 获取地址信息
  const getAddressInfo = async () => {
    setAddressLoading(true);

    try {
      const response = await addressListInterface();
      const topData = response?.data;
      setAddressLoading(false);

      if (topData == null) {
        return;
      }

      const { code, msg, data } = topData;
      if (code != 0) {
        DialogUtils.showError(`${msg}`);
        return;
      }

      const { list } = data;
      if (list == null) {
        DialogUtils.showSuccess(`No address info`);
        return;
      }

      // 地址接口成功
      // CLOG.info(JSON.stringify(list));

      if (list.length > 0) {
        const address = list[0];
        setAddressId(address.id);
      }
    } catch (e) {
    } finally {
      setAddressLoading(false);
    }
  };

  // 退出登录
  const onLogout = async () => {
    setLogouting(true);

    const response = await userLogout();

    const topData = response?.data;
    if (topData == null) {
      setLogouting(false);
      return;
    }

    const { code, msg, data } = topData;
    if (code != 0) {
      setLogouting(false);
      DialogUtils.showError(`${msg}`);
      return;
    }

    const { isLogout } = data;
    if (isLogout == 0) {
      setLogouting(false);
      DialogUtils.showError(`${msg}`);
    }

    // 退出登录接口成功
    CLOG.info("logout success");

    if (user) {
      await logout();
    }

    setLogouting(false);

    setLogoutVisible(false);

    updateUserHeader(null);
    setLocalUser(null);

    // setIsLogin(false);
    setTimeout(() => {
      router.replace("/");
    }, 1000);
  };

  // 编辑视图保存事件
  const onEditViewSave = () => {
    updateUserInfo();
  };

  // 编辑视图取消事件
  const onEditViewCancel = () => {
    setEditType("none");
    setEditViewVisible(false);
  };

  // Privy绑定信息
  const { link } = useLinkWithOAuth({
    onError(error) {
      CLOG.info("onError " + error.message);
      DialogUtils.showError("Linked Error " + error.message);
    },
    onSuccess(user, isNewUser) {
      CLOG.info("onSuccess " + JSON.stringify(user));
      DialogUtils.showSuccess("Linked success");

      // 更新用户信息
      onUpdateUserInfo();
    },
  });

  // 绑定手机账户
  const onLinkSMSEvent = async () => {
    // link({ provider: "google" });
    router.push("login/link_sms");
  };

  // 绑定google账户
  const onLinkGoogleEvent = async () => {
    link({ provider: "google" });
  };

  // 绑定x账户
  const onLinkTwitterEvent = async () => {
    link({ provider: "twitter" });
  };

  useEffect(() => {
    let defaultText: string | null | undefined = null;
    switch (editType) {
      case "none":
        break;
      case "name":
        defaultText = localUser?.name;
        break;
      case "telegram":
        defaultText = localUser?.telegram;
        break;
    }

    if (defaultText !== null && defaultText !== undefined) {
      setEditViewText(defaultText);
    } else {
      setEditViewText("");
    }
  }, [editType]);

  // 已经绑定的手机号
  const [linkedPhone, setLinkedPhone] = useState<string | null>(null);

  // 已经绑定的google
  const [linkedGoogle, setLinkedGoogle] = useState<string | null>(null);

  // 已经绑定的twitter
  const [linkedTwitter, setLinkedTwitter] = useState<string | null>(null);

  // 更新用户信息
  const onUpdateUserInfo = async () => {
    if (!user) {
      return;
    }

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
    }
  };

  // 登录成功
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

    // 用户登陆成功
    const { token } = depinUser;
    updateUserHeader(token);

    setLocalUser(depinUser);
  };

  // 去新版本
  const onNewVersionEvent = () => {
    DialogUtils.showInfo("New version available");
  };

  useEffect(() => {
    if (!isReady || !user) {
      return;
    }

    CLOG.info(`本地账户信息: ${JSON.stringify(user)}`);
    user.linked_accounts.forEach(async (item) => {
      if (item.type == "phone") {
        setLinkedPhone(item.phoneNumber);
      } else if (item.type == "google_oauth") {
        setLinkedGoogle(item.email ?? item.name);
      } else if (item.type == "twitter_oauth") {
        setLinkedTwitter(item.username ?? item.name);
      }
    });
  }, [isReady, user]);

  useEffect(() => {
    getAddressInfo();
  }, []);

  // 模拟更新余额
  useEffect(() => {
    const timeout = setTimeout(() => {
      setNewAppVersion(true);
      const tempBalanceItems = balanceItems.map((e) => {
        const item = { ...e };
        if (item.type === "ETH") {
          item.balance = "983623";
          item.dollar = "8346737364";
        }
        if (item.type === "PFF") {
          item.balance = "12312353454";
          item.dollar = "34354357575";
        }

        return item;
      });
      setBalanceItems(tempBalanceItems);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Settings",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: Squealt3Regular,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
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
        <ScrollView style={styles.scrollView}>
          <HeaderIconView></HeaderIconView>
          <View style={{ height: 10 }}></View>

          {/* <WalletAddressView></WalletAddressView> */}
          <CardSectionView title="Wallet Address"></CardSectionView>
          <CardItemView
            title={`${account?.address}`}
            // titleColor="rgb(106,106,106)"
            isEye={true}
            callbackEvent={async () => {
              await Clipboard.setStringAsync(`${account?.address}`);
              DialogUtils.showSuccess("Wallet address has copied");
            }}
          ></CardItemView>
          <CardItemView
            title="Switch wallets"
            isEye={false}
            callbackEvent={() => {
              setSwitchWalletVisible(true);
            }}
          ></CardItemView>

          {/* 余额 */}
          <CardSectionView title="Balances"></CardSectionView>

          {balanceItems.map((e) => (
            <BalanceView balanceInfo={e} key={e.type}></BalanceView>
          ))}

          {/* <AccountView></AccountView> */}
          {/* 账户信息 */}
          <CardSectionView title="Account"></CardSectionView>
          <CardItemView
            title="Name"
            rightText={
              localUser?.name === "" ? "Not Setup" : `${localUser?.name}`
            }
            callbackEvent={() => {
              setEditType("name");
              setEditViewVisible(true);
            }}
          ></CardItemView>
          <CardItemView
            title="Phone number"
            rightText={`${linkedPhone ?? "Not Setup"}`}
            callbackEvent={() => {
              if (!linkedPhone) {
                onLinkSMSEvent();
              } else {
                DialogUtils.showInfo(linkedPhone);
              }
            }}
          ></CardItemView>
          <CardItemView
            title="Google"
            rightText={`${linkedGoogle ?? "Not Setup"}`}
            callbackEvent={() => {
              if (!linkedGoogle) onLinkGoogleEvent();
              else {
                DialogUtils.showInfo(linkedGoogle);
              }
            }}
          ></CardItemView>
          <CardItemView
            title="X"
            rightText={`${linkedTwitter ?? "Not Setup"}`}
            callbackEvent={() => {
              if (!linkedTwitter) onLinkTwitterEvent();
              else {
                DialogUtils.showInfo(linkedTwitter);
              }
            }}
          ></CardItemView>
          <CardItemView
            title="Farcaster"
            rightText={`${localUser?.farcaster ?? "Not Setup"}`}
            callbackEvent={() => {
              // setEditType("farcaster");
              // setEditViewVisible(true);
            }}
          ></CardItemView>
          <CardItemView
            title="Telegram"
            rightText={
              localUser?.telegram === ""
                ? "Not Setup"
                : `${localUser?.telegram}`
            }
            callbackEvent={() => {
              setEditType("telegram");
              setEditViewVisible(true);
            }}
          ></CardItemView>

          {/* <AddressView></AddressView> */}
          <CardSectionView title="Address"></CardSectionView>
          <CardItemView
            title="Manage Address"
            callbackEvent={() => {
              if (addressLoading) {
                DialogUtils.showInfo("please waiting ...");
                return;
              }

              router.push({
                pathname: "/address/add",
                params: { addressId: addressId, addressType: "0" },
              });
            }}
          ></CardItemView>

          {/* <AboutView></AboutView> */}
          <View style={{ height: 15 }}></View>

          <AppVersionView
            title="App Version"
            rightText={appVersion ? `V${appVersion}` : ""}
            isEye={newAppVersion}
            callbackEvent={onNewVersionEvent}
          ></AppVersionView>
          <View style={{ height: 20 }}></View>

          {/* 退出登录按钮 */}
          <Pressable
            onPress={() => setLogoutVisible(true)}
            style={{
              // marginHorizontal: 30,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 20,
              borderRadius: 8,
              // flex: 1,
              borderColor: "rgb(50,50,50)",
              borderWidth: 1,
              // height
              // backgroundColor: "red",
            }}
          >
            <View
              style={{
                flex: 1,
                // marginHorizontal: 40,
                backgroundColor: "rgb(20,20,20)",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                height: 45,
                // width: "90%",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  color: "white",
                  fontSize: 16,
                }}
              >
                Log out
              </Text>
            </View>
          </Pressable>

          <View style={{ height: 30 }}></View>
        </ScrollView>
      </BackgroundView>

      {/* 切换钱包页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={switchWalletVisible}
        onRequestClose={() => {
          setSwitchWalletVisible(!switchWalletVisible);
        }}
      >
        <Pressable
          onPress={() => setSwitchWalletVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",

            // marginTop: 22,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          {/* 登录选项选择 */}
          <Pressable
            style={{ width: "100%", height: "70%" }}
            onPress={() => {
              setSwitchWalletVisible(false);
              // setConfirmRationVisible(true);
            }}
          >
            <View style={{ width: "100%", height: "100%" }}></View>
          </Pressable>

          <ImageBackground
            // style={{
            //   width: "100%",
            //   height: "110%",
            //   paddingTop: 15,
            //   paddingHorizontal: 15,
            // }}
            style={{
              paddingTop: 15,
              paddingHorizontal: 15,
              width: "90%",
              height: "30%",
              marginBottom: bottom + 20,
              borderRadius: 15,
            }}
            contentFit="fill"
            source={require("@/assets/images/nft/dialog/short_bg.png")}
            // style={styles.centeredView1}
          >
            <View
              style={{
                backgroundColor: buttonGray25Color,
                borderRadius: 12,
                width: "100%",
                // height: 40,
                // marginTop: 80,
                paddingHorizontal: 10,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* 钱包1 */}
              <Pressable
                onPress={() => setSwitchWalletVisible(false)}
                style={{
                  justifyContent: "flex-start",
                  // alignContent: "flex-start",
                  alignItems: "center",
                  // flexDirection: "row",
                  height: 50,
                  width: "100%",
                  // backgroundColor: "red",
                  paddingHorizontal: 5,
                }}
                // onPress={() => onMockLoginEvent(index)}
              >
                <View>
                  <View
                    style={{
                      justifyContent: "flex-start",
                      // alignContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      height: 50,
                      width: "100%",
                      // backgroundColor: "red",
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,

                        color: "white",
                        fontSize: 14,
                        marginLeft: 5,
                        flex: 1,
                        fontWeight: "200",
                      }}
                    >
                      {formatAccount(account?.address)}
                    </Text>

                    <Image
                      style={{
                        width: 20,
                        height: 20,
                        marginLeft: 5,
                        // marginRight: 5,
                      }}
                      source={require("@/assets/images/mine/wallet_selected.png")}
                      contentFit="contain"
                    ></Image>
                  </View>
                </View>
              </Pressable>
              <Divider
                style={{ flex: 1, height: 1, width: "100%" }}
                color={buttonGray50Color}
              ></Divider>

              {/* 钱包2 */}
              {/* <Pressable
                  onPress={() => setSwitchWalletVisible(false)}
                  style={{
                    justifyContent: "flex-start",
                    // alignContent: "flex-start",
                    alignItems: "center",
                    // flexDirection: "row",
                    height: 50,
                    width: "100%",
                    // backgroundColor: "red",
                    paddingHorizontal: 5,
                  }}
                  // onPress={() => onMockLoginEvent(index)}
                >
                  <View>
                    <View
                      style={{
                        justifyContent: "flex-start",
                        // alignContent: "flex-start",
                        alignItems: "center",
                        flexDirection: "row",
                        height: 50,
                        width: "100%",
                        // backgroundColor: "red",
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Squealt3Regular,

                          color: "white",
                          fontSize: 14,
                          marginLeft: 5,
                          flex: 1,
                        }}
                      >
                        0x12xxxxxxx7344
                      </Text>

                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          marginLeft: 5,
                          // marginRight: 5,
                        }}
                        source={require("@/assets/images/mine/wallet_unselected.png")}
                        contentFit="contain"
                      ></Image>
                    </View>
                  </View>
                </Pressable> */}
            </View>

            {/* 创建钱包 */}
            <View
              style={{
                backgroundColor: buttonGray25Color,
                borderRadius: 12,
                width: "100%",
                // height: 40,
                // marginTop: 80,
                // paddingHorizontal: 10,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 10,
              }}
            >
              {/* 创建钱包 */}
              <Pressable
                onPress={() => setSwitchWalletVisible(false)}
                style={{
                  justifyContent: "flex-start",
                  // alignContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  height: 50,
                  width: "100%",
                  // backgroundColor: "red",
                  paddingHorizontal: 5,
                }}
                // onPress={() => onMockLoginEvent(index)}
              >
                <Text
                  style={{
                    fontFamily: Squealt3Regular,

                    color: "white",
                    fontSize: 14,
                    marginLeft: 5,
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  Create new account
                </Text>
              </Pressable>
            </View>

            {/* 导入钱包 */}
            <View
              style={{
                backgroundColor: buttonGray25Color,
                borderRadius: 12,
                width: "100%",
                // height: 40,
                // marginTop: 80,
                // paddingHorizontal: 10,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Pressable
                onPress={() => setSwitchWalletVisible(false)}
                style={{
                  justifyContent: "flex-start",
                  // alignContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  height: 50,
                  width: "100%",
                  // backgroundColor: "red",
                  paddingHorizontal: 5,
                }}
                // onPress={() => onMockLoginEvent(index)}
              >
                <Text
                  style={{
                    fontFamily: Squealt3Regular,
                    color: "white",
                    fontSize: 14,
                    marginLeft: 5,
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  Import existing wallet
                </Text>
              </Pressable>
            </View>
          </ImageBackground>
          {/* </View> */}
        </Pressable>
        <CustomDialog />
      </Modal>

      {/* 退出登录页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutVisible}
        onRequestClose={() => {
          setLogoutVisible(!logoutVisible);
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
          <View style={{ width: 290, height: 290 * (290.0 / 427) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Image
                  style={{ width: 35 * 1.2, height: 27 * 1.2 }}
                  contentFit="contain"
                  source={require("@/assets/images/common/dialog_logo.png")}
                  // style={styles.centeredView1}
                ></Image>
              </View>

              {/* <Text style={styles.modalText}>Hello World!</Text> */}
              {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable> */}

              {/* 文本内容 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 14,
                  color: "white",
                  textAlign: "center",
                  marginTop: 30,
                }}
              >
                Are you sure logout?
              </Text>
              {/* <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 14,
                  color: "white",
                  textAlign: "center",
                }}
              >
                Confirm to recast?
              </Text> */}

              {/* 操作按钮 */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 25,
                  marginBottom: 30,
                  paddingHorizontal: 20,
                  // backgroundColor: "green",
                }}
              >
                <Pressable
                  onPress={onLogout}
                  style={{
                    flex: 1,
                    backgroundColor: buttonBgColor,
                    borderRadius: 15,
                    height: 30,
                    width: "40%",
                    // marginRight: 3,
                    // marginLeft: 30,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  {logouting && (
                    <ActivityIndicator
                      style={{ marginRight: 10 }}
                      color={"white"}
                    ></ActivityIndicator>
                  )}
                  <Text
                    style={{
                      fontSize: 10,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Yes
                  </Text>
                </Pressable>
                <View style={{ width: 15 }}></View>
                <Pressable
                  onPress={() => {
                    setLogouting(false);
                    setLogoutVisible(false);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: buttonGrayBgColor,
                    borderRadius: 15,
                    height: 30,
                    width: "40%",
                    // marginRight: 30,
                    // marginLeft: 3,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: buttonBgColor,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </View>
        <CustomDialog />
      </Modal>

      {/* 修改用户信息页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editViewVisible}
        onRequestClose={() => {
          setEditViewVisible(!editViewVisible);
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
          <View style={{ width: 300, height: 220 / (427.0 / 470) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Image
                  style={{ width: 35 * 1.2, height: 27 * 1.2 }}
                  contentFit="contain"
                  source={require("@/assets/images/common/dialog_logo.png")}
                  // style={styles.centeredView1}
                ></Image>
              </View>

              {/* <Text style={styles.modalText}>Hello World!</Text> */}
              {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable> */}

              {/* 文本内容 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 14,
                  color: "white",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Update account info
              </Text>

              {/* 输入框 */}
              <View
                style={{
                  paddingHorizontal: 25,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "black",
                    width: "100%",
                    height: 40,
                    borderRadius: 12,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    marginTop: 35,
                  }}
                >
                  <TextInput
                    style={{
                      color: "white",
                      fontSize: 14,
                      height: "100%",
                      flex: 1,
                    }}
                    maxLength={20}
                    placeholder={`Click to enter ${editType}`}
                    placeholderTextColor={"rgb(59,59,59)"}
                    value={editViewText}
                    onChangeText={setEditViewText}
                  ></TextInput>
                  {/* <Image
                    style={{ width: 43 * 0.5, height: 24 * 0.5 }}
                    contentFit="contain"
                    source={require("@/assets/images/login/create_wallet_eye_close.png")}
                    // style={styles.centeredView1}
                  ></Image> */}
                </View>
              </View>

              {/* 操作按钮 */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 25,
                  marginBottom: 30,
                  paddingHorizontal: 20,
                  // backgroundColor: "green",
                }}
              >
                <Pressable
                  onPress={onEditViewCancel}
                  style={{
                    flex: 1,
                    backgroundColor: buttonGrayBgColor,
                    borderRadius: 15,
                    height: 30,
                    width: "40%",
                    // marginRight: 30,
                    // marginLeft: 3,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: buttonBgColor,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <View style={{ width: 15 }}></View>

                <Pressable
                  onPress={onEditViewSave}
                  style={{
                    flex: 1,
                    backgroundColor:
                      editViewText && editViewText.length > 0
                        ? buttonBgColor
                        : "gray",
                    borderRadius: 15,
                    height: 30,
                    width: "40%",
                    // marginRight: 3,
                    // marginLeft: 30,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Save
                  </Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </View>
        <CustomDialog />
      </Modal>
    </View>
  );
}

type BalanceViewProps = ViewProps & {
  balanceInfo: BalanceModel;
  callbackEvent?: GreetFunction;
};

// 余额
const BalanceView = ({ balanceInfo }: BalanceViewProps) => {
  const copyToClipboard = async (text?: string) => {
    // if (text) {
    //   await Clipboard.setStringAsync(text);
    // }
  };

  return (
    <View
      key={balanceInfo.type}
      style={{
        borderRadius: 5,
        borderColor: "rgb(50,50,50)",
        borderWidth: 0.5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
        paddingLeft: 5,
        paddingRight: 10,
        backgroundColor: "rgb(20,20,20)",
        paddingVertical: 5,
        marginTop: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Image source={balanceInfo.icon} style={{ width: 25, height: 25 }} />
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 14,
            color: "white",
            marginLeft: 5,
          }}
        >
          {balanceInfo.type}
        </Text>
      </View>

      <View
        style={{
          // flexDirection: "row",
          justifyContent: "center",
          flex: 4,
        }}
      >
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 14,
            color: "white",
            width: "100%",
            textAlign: "right",
            fontWeight: "bold",
          }}
        >
          {formatMoney(balanceInfo.balance)}
        </Text>
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 14,
            color: buttonGray150Color,
            width: "100%",
            textAlign: "right",
          }}
        >
          ${formatMoney(balanceInfo.dollar)}
        </Text>
      </View>
    </View>
  );
};

const AccountView = () => {
  // const { user } = usePrivy();
  // let email = "";
  // const emailUser = user?.linked_accounts.filter(
  //   (item) => item.type == "email"
  // );
  // if (emailUser && emailUser?.length > 0) {
  //   email = emailUser[0].address;
  // }

  // let phone = "";
  // const phoneUser = user?.linked_accounts.filter(
  //   (item) => item.type == "phone"
  // );
  // if (phoneUser && phoneUser?.length > 0) {
  //   phone = phoneUser[0].phoneNumber;
  // }

  // let google = "";
  // const googleUser = user?.linked_accounts.filter(
  //   (item) => item.type == "google_oauth"
  // );
  // if (googleUser && googleUser?.length > 0) {
  //   google = googleUser[0].email + " " + googleUser[0].name || "";
  // }

  // let twitter = "";
  // const twitterUser = user?.linked_accounts.filter(
  //   (item) => item.type == "twitter_oauth"
  // );
  // if (twitterUser && twitterUser?.length > 0) {
  //   twitter = twitterUser[0].name || "";
  // }

  // let farcaster = "";
  // const farcasterUser = user?.linked_accounts.filter(
  //   (item) => item.type == "farcaster"
  // );
  // if (farcasterUser && farcasterUser?.length > 0) {
  //   farcaster = farcasterUser[0].username || "";
  // }

  return (
    <>
      <CardSectionView title="Account"></CardSectionView>
      <CardItemView title="Name" rightText={"0xii37idn"}></CardItemView>
      <CardItemView title="Phone number" rightText={"Not Setup"}></CardItemView>
      <CardItemView title="Google" rightText={"Not Setup"}></CardItemView>
      <CardItemView title="X" rightText={"Not Setup"}></CardItemView>
      <CardItemView title="Farcaster" rightText={"Not Setup"}></CardItemView>
      <CardItemView title="Telegram" rightText={"Tom75p"}></CardItemView>
    </>
  );
};

const AddressView = () => {
  return (
    <>
      <CardSectionView title="Address"></CardSectionView>
      <CardItemView
        title="Manage Address"
        callbackEvent={() => {
          router.push("/address/add");
        }}
      ></CardItemView>
    </>
  );
};

const AboutView = () => {
  return (
    <>
      <CardSectionView title="About"></CardSectionView>
      <CardItemView title="About PUFFPAW"></CardItemView>
    </>
  );
};

type GreetFunction = () => void;

type SettingProps = ViewProps & {
  title: string;
  titleColor?: string;
  rightText?: string;
  isEye?: boolean;
  callbackEvent?: GreetFunction;
};

const CardSectionView = ({ title }: SettingProps) => {
  return (
    <View
      style={[
        styles.sectionContainer,
        {
          // height: 20,
          marginTop: 20,
          marginLeft: 25,
        },
      ]}
    >
      <Text
        // variant="bodyMedium"
        style={{
          fontFamily: Squealt3Regular,
          color: "white",
          fontSize: 14,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const CardItemView = ({
  title,
  rightText,
  isEye,
  titleColor,
  callbackEvent,
}: SettingProps) => {
  const [eyeClose, setEyeClose] = useState(true);
  let eyeTitle = title;

  let rightIcon = isEye
    ? require("@/assets/images/mine/eye_hide.png")
    : require("@/assets/images/mine/right_arrow.png");

  if (isEye) {
    rightIcon = eyeClose
      ? require("@/assets/images/mine/eye_hide.png")
      : require("@/assets/images/login/create_wallet_eye_open.png");

    eyeTitle = eyeClose ? formatAccount(title) : title;
  } else {
    rightIcon = require("@/assets/images/mine/right_arrow.png");
  }
  let width = 7,
    height = 15;
  if (isEye) {
    width = 20;
    height = 20;

    if (!eyeClose) {
      width = 20;
      height = 20;
    }
  }

  return (
    <Pressable
      onPress={callbackEvent}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginHorizontal: 10,
      }}
    >
      <View
        style={{
          // marginLeft: 10,
          // marginRight: 10,
          // marginTop: 5,
          backgroundColor: "rgb(20,20,20)",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "row",
          borderRadius: 8,
          // flex: 1,
          borderColor: "rgb(50,50,50)",
          borderWidth: 1,
          // height: 50,
          paddingVertical: 15,
        }}
      >
        <Text
          // variant="bodyMedium"
          style={{
            backgroundColor: "rgb(20,20,20)",
            // height: 30,
            color: titleColor ? titleColor : "white",
            fontSize: 14,
            paddingHorizontal: 10,
            maxWidth: "70%",
          }}
        >
          {eyeTitle}
        </Text>
        {/* <View style={{ flex: 1 }}></View> */}
        <Text
          // variant="bodyMedium"
          style={{
            backgroundColor: "rgb(20,20,20)",
            color: "gray",
            fontSize: 14,
            marginRight: 0,
            flex: 1,
            textAlign: "right",
          }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {rightText}
        </Text>
        <Pressable
          onPress={() => {
            setEyeClose(!eyeClose);
          }}
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Image
            source={rightIcon}
            style={{
              width: width,
              height: height,
            }}
            contentFit="contain"
          ></Image>
        </Pressable>
      </View>
    </Pressable>
  );
};

// app 版本
const AppVersionView = ({
  title,
  rightText,
  titleColor,
  isEye,
  callbackEvent,
}: SettingProps) => {
  const [eyeClose, setEyeClose] = useState(true);
  let eyeTitle = title;

  let rightIcon = require("@/assets/images/mine/right_arrow.png");

  let width = 7,
    height = 15;

  return (
    <Pressable
      onPress={callbackEvent}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginHorizontal: 10,
      }}
    >
      <View
        style={{
          backgroundColor: "rgb(20,20,20)",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "row",
          borderRadius: 8,
          // flex: 1,
          borderColor: "rgb(50,50,50)",
          borderWidth: 1,
          // height: 50,
          paddingVertical: 15,
        }}
      >
        <Text
          style={{
            backgroundColor: "rgb(20,20,20)",
            // height: 30,
            color: titleColor ? titleColor : "white",
            fontSize: 14,
            paddingHorizontal: 10,
            // maxWidth: "70%",
            flex: 1,
          }}
        >
          {eyeTitle}
        </Text>
        {/* <View style={{ flex: 1 }}></View> */}
        {isEye && (
          <Image
            source={require("@/assets/images/mine/update_version.png")}
            style={{
              width: 152 * 0.5,
              height: 40 * 0.5,
              marginRight: 5,
            }}
            contentFit="contain"
          ></Image>
        )}
        <Text
          style={{
            backgroundColor: "rgb(20,20,20)",
            color: "gray",
            fontSize: 14,
            marginRight: 10,
            textAlign: "right",
          }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {rightText}
        </Text>
      </View>
    </Pressable>
  );
};

const BottomButtonView = () => {
  const [localUser, setLocalUser] = useMMKVObject<LocalUserInfo | null>(
    ConstantStorage.localUser
  );
  // const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);

  // const { user, logout } = usePrivy();

  const onLogout = async () => {
    // const response = await userLogout();

    // const topData = response?.data;
    // if (topData == null) {
    //   return;
    // }

    // const { code, msg, data } = topData;
    // if (code != 0) {
    //   DialogUtils.showError(`${msg}`);
    //   return;
    // }

    // const { isLogout } = data;
    // if (isLogout == 0) {
    //   DialogUtils.showError(`${msg}`);
    //   return;
    // }

    // // 退出登录接口成功
    // CLOG.info("logout success");

    // if (user) {
    //   logout();
    // }

    // updateUserHeader(null);
    // setLocalUser(null);

    // setIsLogin(false);
    router.replace("/");
  };

  return (
    <Pressable
      onPress={onLogout}
      style={{
        // marginHorizontal: 30,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: "10%",
        // height
        // backgroundColor: "red",
      }}
    >
      <View
        style={{
          flex: 1,
          // marginHorizontal: 40,
          backgroundColor: buttonBgColor,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          height: 45,
          // width: "90%",
          borderRadius: 20,
        }}
      >
        <Text
          style={{ fontFamily: Squealt3Regular, color: "black", fontSize: 16 }}
        >
          Log out
        </Text>
      </View>
    </Pressable>
  );
};

const WalletView = () => (
  <>
    <View
      style={{
        // height: 100,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 8,
        margin: 10,
      }}
    >
      <View
        style={{
          // width: "100%",
          height: 50,
          // backgroundColor: "green",
          alignItems: "center",
          flexDirection: "row",
          // borderColor: "gray",
          // borderWidth: 1,
          // borderRadius: 5,
          // margin: 5,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            backgroundColor: "green",
            borderRadius: 15,
            marginLeft: 15,
          }}
        ></View>
        <Text style={{ flex: 1, marginLeft: 15 }}>0x123834598934599548</Text>
        <Image
          source={require("@/assets/images/mine/right_arrow.png")}
          style={{ width: 30, height: 30, marginRight: 15 }}
        ></Image>
      </View>
      <View
        style={{
          // width: "100%",
          height: 50,
          // backgroundColor: "green",
          alignItems: "center",
          flexDirection: "row",
          // borderColor: "gray",
          // borderWidth: 1,
          // borderRadius: 5,
          // margin: 5,
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            backgroundColor: "yellow",
            borderRadius: 15,
            marginLeft: 15,
          }}
        ></View>
        <Text style={{ flex: 1, marginLeft: 15 }}>0x123834598934599548</Text>
        <Image
          source={require("@/assets/images/mine/right_arrow.png")}
          style={{ width: 30, height: 30, marginRight: 15 }}
        ></Image>
      </View>
    </View>
    <View
      style={{
        // height: 100,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 8,
        margin: 10,
      }}
    >
      <View
        style={{
          height: 50,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: 30,
            height: 30,
            backgroundColor: "green",
            borderRadius: 15,
            marginLeft: 15,
          }}
        ></View>
        <Text style={{ flex: 1, marginLeft: 15 }}>Import Wallet</Text>
        <Image
          source={require("@/assets/images/mine/right_arrow.png")}
          style={{ width: 30, height: 30, marginRight: 15 }}
        ></Image>
      </View>
    </View>
  </>
);

const loginItems = [
  {
    type: "Google",
    icon: require("@/assets/images/login/login_google.png"),
  },
  {
    type: "X",
    icon: require("@/assets/images/login/login_x.png"),
  },
  {
    type: "Farcaster",
    icon: require("@/assets/images/login/login_farcaster.png"),
  },
  {
    type: "Telegram",
    icon: require("@/assets/images/login/login_telegram.png"),
  },
  {
    type: "Continue with wallet",
    icon: null,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
  },
  scrollView: { flex: 1 },
  logo: {
    width: 60,
    height: 30,
    position: "absolute",
    marginTop: 30,
    right: 20,
  },
  card: {
    // width: "100%",
    height: 50,
    // marginLeft: 10,
    // marginRight: 10,
    margin: 5,
    backgroundColor: "rgb(20,20,20)",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    borderRadius: 8,
    flex: 1,
    borderColor: "rgb(50,50,50)",
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sectionContainer: {
    // position: "absolute",
    left: 0,
    alignContent: "center",
    alignItems: "flex-start",
    // backgroundColor: "rgb(20,20,20)",
    height: 25,
    color: "white",
    marginTop: 20,
  },
  sectionTitle: {
    // position: "absolute",
    left: 20,
    alignContent: "center",
    alignItems: "flex-start",
    marginTop: 5,
    // backgroundColor: "rgb(20,20,20)",
    height: 30,
    color: "red",
    fontSize: 14,
  },
  leftContainer: {
    // position: "absolute",
    alignContent: "center",
    alignItems: "flex-start",
    // backgroundColor: "green",
    flex: 8,
    height: 50,
  },
  leftTitle: {
    top: 15,
    left: 15,
    backgroundColor: "rgb(20,20,20)",
    // height: 30,
    color: "white",
    fontSize: 14,
  },
  rightContainer: {
    width: 30,
    height: 50,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
  goodsItemArrow: {
    // flex: 1,
    top: 17,
    objectFit: "contain",
    width: 15,
    height: 15,
    resizeMode: "contain",
    right: 0,
  },
  headerContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "black",
    height: 120,
  },
  logoutButton: {
    position: "absolute",
    width: "60%",
    height: 45,
    bottom: 0,
    left: "20%",
  },
  contentContainer: {
    flex: 1,
    // alignItems: "center",
    // backgroundColor: "red",
  },
  walletCard: {
    // width: "100%",
    height: 40,
    // marginLeft: 10,
    // marginRight: 10,
    margin: 5,
    backgroundColor: "rgb(20,20,20)",
    alignItems: "center",
    justifyContent: "center",
    // flexDirection: "row",
    borderRadius: 8,
    flex: 1,
    // borderColor: "rgb(50,50,50)",
    // borderWidth: 1,
  },

  defaultIcon: {
    width: 70,
    height: 70,
  },
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headerSubIcon: {
    width: 20,
    height: 20,
  },
});
