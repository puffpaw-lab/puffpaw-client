import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  StatusBar,
} from "react-native";

import React from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv";
import { ConstantStorage, LocalUserInfo } from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";

import { RightLogoView } from "@/components/Custom/RightLogoView";
import { HomeChartView } from "@/components/Custom/ChartView";
import { buttonBgColor } from "@/constants/Colors";
import { Squealt3Light, Squealt3Regular } from "@/constants/FontUtils";

export default function homeScreen() {
  return (
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
          headerRight: (props) => (
            // <Pressable onPress={() => router.push("/address/add")}>
            <RightLogoView></RightLogoView>
            // </Pressable>
          ),
        }}
      />

      <BackgroundView
        style={styles.container}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <ScrollView style={{ flex: 1 }}>
          <TopView></TopView>
          <HomeChartView style={styles.chartContainer}></HomeChartView>
        </ScrollView>
      </BackgroundView>
    </View>
  );
}

const TopView = () => {
  return (
    <View style={styles.topContainer}>
      <Text
        style={{
          fontFamily: Squealt3Regular,
          fontSize: 15,
          color: "white",
          fontWeight: "500",
        }}
      >
        Total revenue{" >"}
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
            // backgroundColor: "red",
            // borderRadius: 15,
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
            marginLeft: 10,
          }}
        >
          1,250,000
        </Text>
      </View>
      <Text
        style={{
          fontFamily: Squealt3Regular,

          fontSize: 15,
          color: "white",
          marginTop: 20,
          fontWeight: "500",
        }}
      >
        Unclaimed
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <View
          style={{
            width: 25,
            height: 25,
            // backgroundColor: "red",
            // borderRadius: 15,
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
            marginLeft: 10,
          }}
        >
          10,000
        </Text>
      </View>

      <CollectButtonView></CollectButtonView>
    </View>
  );
};

const CollectButtonView = () => {
  return (
    <Pressable
      onPress={() => {
        router.push("/trend");
      }}
    >
      <View
        style={{
          marginTop: 5,
          // marginHorizontal: 30,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          flexDirection: "row",
          // backgroundColor: "red",
        }}
      >
        <View
          style={{
            // marginHorizontal: 20,
            backgroundColor: buttonBgColor,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            height: 25,
            width: 85,
            borderRadius: 15,
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "black",
              fontSize: 14,
            }}
          >
            Collect
          </Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "flex-start",
    backgroundColor: "black",
  },
  topContainer: {
    height: 250,
    // backgroundColor: "gray",
    margin: 10,
    marginLeft: 30,
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
