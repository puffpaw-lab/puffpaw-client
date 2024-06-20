import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from "react-native";

import React from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";

import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import { Squealt3Regular } from "@/constants/FontUtils";
import { buttonBgColor, grayBGgColorList } from "@/constants/Colors";

export default function castScreen() {
  // const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);

  // if (!isLogin) {
  //   return <Redirect href="/login" />;
  // }

  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"}></StatusBar>

      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: (props) => <RightLogoView></RightLogoView>,
        }}
      />

      <BackgroundView
        style={styles.container}
        x={"50%"}
        y={"100%"}
        rx={"50%"}
        ry={"15%"}
      >
        <ScrollView style={{ flex: 1 }}>
          <TrendHeader></TrendHeader>
          <View style={{ marginHorizontal: 20 }}>
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 15,
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Total revenue
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  // justifyContent: "center",
                  alignItems: "center",
                  // alignContent:'center'
                  marginTop: 5,
                }}
              >
                <View
                  style={{
                    width: 25,
                    height: 25,
                    backgroundColor: "red",
                    marginHorizontal: 10,
                    borderRadius: 15,
                  }}
                >
                  <Image
                    source={require("@/assets/images/index/bear_icon.png")}
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: Squealt3Regular,
                    fontSize: 35,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  1,250,000
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Button
                // mode="contained"
                // buttonColor="red"
                // textColor="black"
                // style={{ height: 40 }}
                // mode="contained"
                // buttonColor="red"
                containerStyle={{ borderRadius: 20, flex: 1 }}
                color={buttonBgColor}
                onPress={() => {
                  router.push("/device/link");
                }}
              >
                <Text style={{ fontFamily: Squealt3Regular, fontSize: 14 }}>
                  Recast
                </Text>
              </Button>
              <View style={{ width: 20 }}></View>
              <Button
                // style={{ height: 40 }}
                // mode="contained"
                // buttonColor="red"
                containerStyle={{
                  borderRadius: 20,
                  flex: 1,
                  borderColor: buttonBgColor,
                  borderWidth: 0.5,
                }}
                color={"black"} // mode="contained"
                // buttonColor="rgb(50,50,50)"
                // textColor="red"
                onPress={() => {
                  router.push("/device");
                }}
              >
                <Text
                  style={{
                    fontFamily: Squealt3Regular,
                    fontSize: 14,
                    color: buttonBgColor,
                  }}
                >
                  Staking/Redemption
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </BackgroundView>
    </View>
    // </BottomSheetModalProvider>
  );
}

const TrendHeader = () => {
  return (
    <View style={{ flex: 1, ...styles.topContainer }}>
      <BackgroundView
        style={{
          // borderRadius: 20,
          // padding: 10,
          // paddingBottom: 20,
          borderColor: "rgb(80,80,80)",
          borderWidth: 3,
          // padding: 5,
        }}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
        colorList={grayBGgColorList}
      >
        <View style={{ flex: 1, backgroundColor: "gray", borderRadius: 15 }}>
          <Image
            style={{ width: "100%", height: "100%", borderRadius: 15 }}
            source={require("@/assets/images/mine/default_ntf_01.png")}
          ></Image>
        </View>

        <View
          style={{
            flexDirection: "row",
            // justifyContent: "center",
            alignItems: "center",
            // alignContent:'center'
            marginTop: 20,
            marginLeft: 10,
          }}
        >
          <Text style={{ fontSize: 20, color: "white" }}>4567</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 15,
            marginLeft: 10,

            alignContent: "center",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={
              {
                // width: 180,
                // backgroundColor: "yellow",
                // alignContent: "center",
                // justifyContent: "center",
                // alignItems: "center",
              }
            }
          >
            <Text
              style={{
                fontSize: 15,
                color: "white",
                // marginTop: 30,
                fontWeight: "500",
              }}
            >
              Rarity 8(smoke: 20)
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                // alignContent: "flex-start",
                alignItems: "center",
                marginTop: 8,
                marginBottom: 20,
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: "bold", color: "white" }}
              >
                Current Catridge: A
              </Text>
              <View
                style={{
                  // width: 80,
                  // height: 10,
                  // borderRadius: 5,
                  // backgroundColor: "red",
                  marginHorizontal: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  borderRadius: 7,
                  height: 14,
                }}
              >
                <Image
                  style={{
                    width: 70,
                    height: 14,
                    // marginLeft: 4,
                    // backgroundColor: "white",
                  }}
                  source={require("@/assets/images/center/overweight.png")}
                ></Image>
              </View>
            </View>
          </View>
          {/* <View style={{ flex: 1 }}></View> */}
        </View>
      </BackgroundView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "flex-start",
    // backgroundColor: "black",
  },
  topContainer: {
    height: 400,
    // backgroundColor: "gray",
    margin: 40,
    borderRadius: 20,

    // width: 300,
    // marginLeft: 30,
  },
  chartContainer: { height: 300, backgroundColor: "gray", margin: 10 },
  image: {
    width: 200,
    height: 200,
  },
  logo: {
    width: 60,
    height: 30,
    position: "absolute",
    marginTop: 30,
    right: 20,
  },
  pagerView: {
    flex: 1,
    width: 300,
    height: 300,
    backgroundColor: "gray",
  },
  contentContainer: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "green",
  },
});
