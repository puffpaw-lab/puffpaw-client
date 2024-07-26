import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from "react-native";

import React from "react";
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import { FlashList } from "@shopify/flash-list";
import { BackgroundView } from "@/components/Custom/BackgroundView";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import { Squealt3Regular } from "@/constants/FontUtils";

const DATA = [
  {
    title: "First Item",
  },
  {
    title: "Second Item",
  },
  {
    title: "Third Item",
  },
  {
    title: "5 Item",
  },
  {
    title: "6 Item",
  },
  {
    title: "7 Item",
  },
];

const AddressList = () => {
  return (
    <FlashList
      data={DATA}
      renderItem={({ item }) => {
        return (
          <Pressable
            onPress={() => {
              // router.push({
              //   pathname: "/address/add",
              //   params: { address_id: item.title },
              // });
            }}
          >
            <View style={styles.card}>
              <View style={styles.leftContainer}>
                <View style={styles.leftContent}>
                  <Text style={styles.leftTitle}>{item.title} David Name</Text>
                  <Text style={styles.leftDetail}>
                    David Name address nation us cha
                  </Text>
                </View>
              </View>
              <View style={styles.rightContainer}>
                <Image
                  source={require("@/assets/images/mine/right_arrow.png")}
                  style={styles.goodsItemArrow}
                ></Image>
              </View>
            </View>
          </Pressable>
        );
      }}
      estimatedItemSize={300}
    />
  );
};

export default function addressScreen() {
  // const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);

  // if (!isLogin) {
  //   return <Redirect href="/login" />;
  // }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Manage Address",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: Squealt3Regular,
          },
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerRight: (props) => <RightLogoView></RightLogoView>,
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
        <AddressList></AddressList>
        <Button
          // icon="camera"
          // mode="contained"
          // buttonColor="red"
          onPress={() => {
            // router.push({
            //   pathname: "/address/add",
            //   // params: { goods_id: goods_id },
            // });
          }}
          style={styles.addAddressButton}
        >
          Add address
        </Button>
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
    height: 100,
    // marginLeft: 10,
    // marginRight: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
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
  leftContent: {
    flex: 1,
    alignContent: "space-between",
    alignItems: "flex-start",
  },
  leftTitle: {
    // top: 15,
    left: 15,
    backgroundColor: "rgb(20,20,20)",
    // height: 30,
    color: "white",
    fontSize: 14,
  },
  leftDetail: {
    // top: 15,
    left: 15,
    backgroundColor: "rgb(20,20,20)",
    // height: 30,
    color: "gray",
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
  addAddressButton: {
    position: "absolute",
    width: "60%",
    height: 45,
    bottom: 0,
    left: "20%",
  },
});
