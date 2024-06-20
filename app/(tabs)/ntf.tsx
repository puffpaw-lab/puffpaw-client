import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import React from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";

import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import { buttonBgColor } from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";

export default function nftScreen() {
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
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <ScrollView style={{ flex: 1 }}>
          {/* <NFTHeader></NFTHeader> */}
          {/* <Button onPress={handlePresentModalPress}>Present</Button> */}
          <NoNFTView></NoNFTView>
          {/* <SearchNFTView></SearchNFTView> */}
        </ScrollView>
      </BackgroundView>
    </View>
    // </BottomSheetModalProvider>
  );
}

const NFTHeader = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ ...styles.topContainer }}>
        <HorizonBackgroundView
          style={{ borderRadius: 20, padding: 10, paddingBottom: 20 }}
        >
          <View
            style={{ flex: 1, backgroundColor: "gray", borderRadius: 15 }}
          ></View>

          <View
            style={{
              flexDirection: "row",
              // justifyContent: "center",
              alignItems: "center",
              // alignContent:'center'
              marginTop: 5,
            }}
          >
            <Text style={{ fontSize: 35, fontWeight: "bold", color: "white" }}>
              4567
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                // marginTop: 30,
                width: 180,
                // backgroundColor: "yellow",
                // alignContent: "center",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  color: "white",
                  // marginTop: 30,
                  fontWeight: "500",
                }}
              >
                Statistics
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "bold", color: "gray" }}>
                Income/Qutcome
              </Text>
            </View>
            <View style={{ flex: 1 }}></View>
            <Button
              // mode="contained"
              // buttonColor="red"
              style={{ width: 230 }}
              // mode="contained"
              // buttonColor="gray"
              containerStyle={{ borderRadius: 10 }}
              color={"gray"}
              onPress={() => {
                router.push("/trend/cast");
              }}
            >
              Week
            </Button>
          </View>
        </HorizonBackgroundView>
      </View>
    </View>
  );
};

const NoNFTView = () => {
  return (
    <View style={styles.topContainer}>
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 18,
            color: "white",
            fontWeight: "500",
          }}
        >
          Show me your vape
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          flex: 1,
          height: 300,
        }}
      >
        <Button
          style={{}}
          // mode="contained"
          // buttonColor="red"
          containerStyle={{ borderRadius: 20, height: 40 }}
          color={buttonBgColor}
          onPress={() => {
            router.push("/device/link");
          }}
        >
          <Text
            style={{
              color: "black",
              fontFamily: Squealt3Regular,
              fontSize: 15,
              height: 30,
              width: 130,
              textAlign: "center",
            }}
          >
            Add a vape
          </Text>
        </Button>
        <View style={{ height: 30 }}></View>
        <Button
          style={{}}
          // mode="contained"
          // buttonColor="gray"
          containerStyle={{
            borderRadius: 20,
            // width: "70%",
            height: 40,
            borderColor: buttonBgColor,
            borderWidth: 1,
          }}
          color={"rgb(30,10,10)"}
          onPress={() => {
            router.push("/device");
          }}
        >
          <Text
            style={{
              color: buttonBgColor,
              fontFamily: Squealt3Regular,
              fontSize: 15,
              height: 30,
              width: 130,
              textAlign: "center",
            }}
          >
            Rent a vape
          </Text>
        </Button>
      </View>
    </View>
  );
};

const SearchNFTView = () => {
  return (
    <View style={styles.topContainer}>
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        <ActivityIndicator
          animating={true}
          color={"red"}
          size={"large"}
          // style={{ width: 50, height: 50 }}
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          // flex: 1,
          height: 300,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: "white",
            fontWeight: "500",
          }}
        >
          Searching for devices.
        </Text>
      </View>
    </View>
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
    flex: 1,
    // height: 300,
    // backgroundColor: "gray",
    margin: 10,
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
