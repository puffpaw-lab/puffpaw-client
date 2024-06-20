import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  ActivityIndicator,
} from "react-native";

import React, { useState } from "react";
import {
  Link,
  Redirect,
  router,
  Stack,
  useLocalSearchParams,
} from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";
import { ImageBackground } from "expo-image";

import { BackgroundView } from "@/components/Custom/BackgroundView";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import {
  usePrivy,
  useEmbeddedWallet,
  getUserEmbeddedWallet,
} from "@privy-io/expo";
import { DialogUtils } from "@/constants/DialogUtils";

export default function changePasswordScreen() {
  // const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);
  const [text, onChangeText] = React.useState("privy-login");
  const [retext, onChangeReText] = React.useState("privy-login");

  const { isReady, user } = usePrivy();

  const wallet = useEmbeddedWallet({
    onCreateWalletError(error) {
      console.log("create wallet error " + error.message);
      DialogUtils.showError("create wallet error " + error.message);
    },
    onCreateWalletSuccess(wallet) {
      console.log("onCreateWalletSuccess " + wallet.toJSON);
      DialogUtils.showSuccess("create wallet success ");

      setTimeout(() => {
        router.dismiss();
      }, 1000);
    },
    // onRecoverWalletError(error) {
    //   console.log("onRecoverWalletError " + error);
    //   DialogUtils.showError("Login Error " + error.message);
    // },
    // onRecoverWalletSuccess(wallet) {
    //   console.log("onRecoverWalletSuccess ");
    //   DialogUtils.showSuccess("Login Error " + error.message);
    // },
  });

  // const account = getUserEmbeddedWallet(user);

  // if (!isReady) return null;
  // if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Create Wallet",
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
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Wallet Password</Text>
          </View>
          <Pressable
            onPress={() => {
              // router.push({
              //   pathname: "/goods/[goods_id]",
              //   // params: { goods_id: item.title },
              // });
            }}
          >
            <View style={styles.card}>
              <View style={styles.leftContainer}>
                <Text style={styles.leftTitle}> </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChangeText}
                  value={text}
                  placeholder="please input password"
                />
              </View>
            </View>
          </Pressable>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Wallet RePassword</Text>
          </View>
          <Pressable
            onPress={() => {
              // router.push({
              //   pathname: "/goods/[goods_id]",
              //   // params: { goods_id: item.title },
              // });
            }}
          >
            <View style={styles.card}>
              <View style={styles.leftContainer}>
                <Text style={styles.leftTitle}> </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChangeReText}
                  value={retext}
                  placeholder="please reinput password"
                />
              </View>
              <View style={styles.rightContainer}>
                {/* <Image
                  source={require("@/assets/images/mine/right_arrow.png")}
                  style={styles.goodsItemArrow}
                ></Image> */}
              </View>
            </View>
          </Pressable>
          <Button
            // icon="camera"
            // mode="contained"
            // buttonColor="red"
            containerStyle={{
              height: 40,
              backgroundColor: "red",
              marginTop: 40,
              marginBottom: 20,
              marginHorizontal: 10,
              borderRadius: 5,
              // flexDirection: "row",
            }}
            onPress={() => {
              wallet.create({
                recoveryMethod: "user-passcode",
                password: "privy-login",
              });
            }}
            // style={styles.saveButton}
          >
            {/* {wallet.status === "creating" && (
              // Shows only while the login is being attempted
              <ActivityIndicator
                style={{ marginHorizontal: 10 }}
                color={"white"}
              ></ActivityIndicator>
            )} */}
            {/* <Text> Create Wallet</Text> */}
            Create Wallet
          </Button>
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
          </View>
        </ScrollView>
      </BackgroundView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
  },
  scrollView: { flex: 1, backgroundColor: "black" },
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
    marginBottom: 10,
    // backgroundColor: "rgb(20,20,20)",
    height: 30,
    color: "white",
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
    top: 0,
    left: 15,
    backgroundColor: "rgb(20,20,20)",
    // height: 30,
    color: "white",
    fontSize: 14,
  },
  input: {
    height: 25,
    // width: 200,
    // margin: 12,
    borderWidth: 1,
    // padding: 10,
    marginLeft: 15,
    color: "white",
    fontSize: 16,
    // backgroundColor: "red",
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
  saveButton: {
    position: "absolute",
    width: "90%",
    height: 45,
    bottom: 0,
    left: "5%",
  },
});
