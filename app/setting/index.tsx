import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
  Text,
} from "react-native";

import React, { useState } from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv";
import { ConstantStorage, LocalUserInfo } from "@/constants/LocalStorage";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { BackgroundView } from "@/components/Custom/BackgroundView";

import { RightLogoView } from "@/components/Custom/RightLogoView";
import {
  getUserEmbeddedWallet,
  isConnected,
  isNotCreated,
  needsRecovery,
  useEmbeddedWallet,
  usePrivy,
} from "@privy-io/expo";
import * as Clipboard from "expo-clipboard";
import { DialogUtils } from "@/constants/DialogUtils";
import {
  requestInstance,
  updateUserHeader,
  userLogout,
} from "@/constants/HttpUtils";
import { HeaderIconView } from "@/components/Custom/UserHeaderView";
import { formatAccount } from "@/constants/CommonUtils";

export default function settingScreen() {
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const options = ["Delete", "Save", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case 1:
            // Save
            break;

          case destructiveButtonIndex:
            // Delete
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Setting",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackTitleVisible: false,
          headerRight: (props) => <RightLogoView></RightLogoView>,
        }}
      />
      <BackgroundView x={"0%"} y={"100%"} rx={"50%"} ry={"50%"}>
        <ScrollView style={styles.scrollView}>
          <HeaderIconView></HeaderIconView>
          <WalletAddressView></WalletAddressView>
          <AccountView></AccountView>
          <AddressView></AddressView>
          <AboutView></AboutView>
          <View style={{ height: 30 }}></View>
          <BottomButtonView></BottomButtonView>
          <View style={{ height: 30 }}></View>
        </ScrollView>
      </BackgroundView>

      {/* <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <BottomSheetView style={styles.contentContainer}>
              <WalletView></WalletView>
            </BottomSheetView>
          </BottomSheetModal> */}
    </View>
    // </BottomSheetModalProvider>
  );
}

const WalletAddressView = () => {
  const copyToClipboard = async (text?: string) => {
    if (text) {
      await Clipboard.setStringAsync(text);
    }
  };

  const wallet = useEmbeddedWallet();
  const { user, isReady, getAccessToken } = usePrivy();
  const account = getUserEmbeddedWallet(user);

  if (!isReady) {
    return <></>;
  }

  return (
    <>
      <CardSectionView title="Wallet Address"></CardSectionView>
      {user && isNotCreated(wallet) && (
        <CardItemView
          title="Create wallet"
          isEye={false}
          callbackEvent={() => router.push("/wallet/create")}
        ></CardItemView>
      )}

      {user && isConnected(wallet) && account && (
        <CardItemView
          title={account.address}
          isEye={true}
          callbackEvent={() => {
            copyToClipboard(account?.address);
            DialogUtils.showSuccess("Address has copy to clipboard");
          }}
        ></CardItemView>
      )}

      {(user &&
        needsRecovery(wallet) &&
        account?.recovery_method == "user-passcode") || (
        <CardItemView
          title="Recovery Wallet"
          isEye={false}
          callbackEvent={() => router.push("/wallet/recovery")}
        ></CardItemView>
      )}
    </>
  );
};

const AccountView = () => {
  const { user } = usePrivy();
  let email = "";
  const emailUser = user?.linked_accounts.filter(
    (item) => item.type == "email"
  );
  if (emailUser && emailUser?.length > 0) {
    email = emailUser[0].address;
  }

  let phone = "";
  const phoneUser = user?.linked_accounts.filter(
    (item) => item.type == "phone"
  );
  if (phoneUser && phoneUser?.length > 0) {
    phone = phoneUser[0].phoneNumber;
  }

  let google = "";
  const googleUser = user?.linked_accounts.filter(
    (item) => item.type == "google_oauth"
  );
  if (googleUser && googleUser?.length > 0) {
    google = googleUser[0].email + " " + googleUser[0].name || "";
  }

  let twitter = "";
  const twitterUser = user?.linked_accounts.filter(
    (item) => item.type == "twitter_oauth"
  );
  if (twitterUser && twitterUser?.length > 0) {
    twitter = twitterUser[0].name || "";
  }

  let farcaster = "";
  const farcasterUser = user?.linked_accounts.filter(
    (item) => item.type == "farcaster"
  );
  if (farcasterUser && farcasterUser?.length > 0) {
    farcaster = farcasterUser[0].username || "";
  }

  return (
    <>
      <CardSectionView title="Account"></CardSectionView>
      <CardItemView title="Name" rightText={user?.id}></CardItemView>
      <CardItemView title="Phone" rightText={phone}></CardItemView>
      <CardItemView title="E-mail" rightText={email}></CardItemView>
      <CardItemView title="Google" rightText={google}></CardItemView>
      <CardItemView title="X" rightText={twitter}></CardItemView>
      <CardItemView title="Farcaster" rightText={farcaster}></CardItemView>
    </>
  );
};

const AddressView = () => {
  return (
    <>
      <CardSectionView title="Address"></CardSectionView>
      <CardItemView
        title="Edit Billing Address"
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
          marginLeft: 20,
        },
      ]}
    >
      <Text
        // variant="bodyMedium"
        style={{
          color: "red",
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
  callbackEvent,
}: SettingProps) => {
  const [eyeClose, setEyeClose] = useState(true);
  let eyeTitle = title;

  let rightIcon = isEye
    ? require("@/assets/images/mine/eye_off.png")
    : require("@/assets/images/mine/right_arrow.png");

  if (isEye) {
    rightIcon = eyeClose
      ? require("@/assets/images/mine/right_arrow.png")
      : require("@/assets/images/mine/eye_off.png");

    eyeTitle = eyeClose ? formatAccount(title) : title;
  } else {
    rightIcon = require("@/assets/images/mine/right_arrow.png");
  }
  let width = 5,
    height = 12;
  if (isEye) {
    width = 20;
    height = 12;
  }

  return (
    <Pressable
      onPress={callbackEvent}
      style={{ paddingHorizontal: 10, paddingVertical: 5 }}
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
          height: 50,
          padding: 10,
        }}
      >
        <Text
          // variant="bodyMedium"
          style={{
            backgroundColor: "rgb(20,20,20)",
            // height: 30,
            color: "white",
            fontSize: 14,
          }}
        >
          {eyeTitle}
        </Text>
        <View style={{ flex: 1 }}></View>
        <Text
          // variant="bodyMedium"
          style={{
            backgroundColor: "rgb(20,20,20)",
            color: "gray",
            fontSize: 14,
            marginRight: 10,
          }}
        >
          {rightText}
        </Text>
        <Pressable
          onPress={() => {
            setEyeClose(!eyeClose);
          }}
        >
          <Image
            source={rightIcon}
            style={{
              width: width,
              height: height,
            }}
          ></Image>
        </Pressable>
      </View>
    </Pressable>
  );
};

const BottomButtonView = () => {
  const [localUser, setLocalUser] = useMMKVObject<LocalUserInfo | null>(
    ConstantStorage.localUser
  );
  // const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);

  const { user, logout } = usePrivy();

  const onLogout = async () => {
    const response = await userLogout();

    const topData = response?.data;
    if (topData == null) {
      return;
    }

    const { code, msg, data } = topData;
    if (code != 0) {
      DialogUtils.showError(`${msg}`);
      return;
    }

    const { isLogout } = data;
    if (isLogout == 0) {
      DialogUtils.showError(`${msg}`);
      return;
    }

    // 退出登录接口成功
    console.log("logout success");

    if (user) {
      logout();
    }

    updateUserHeader(null);
    setLocalUser(null);
    // setIsLogin(false);
    router.replace("/");
  };

  return (
    <Pressable onPress={onLogout}>
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
            width: "90%",
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "black", fontSize: 16 }}>Logout</Text>
        </View>
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
