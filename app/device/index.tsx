import { StyleSheet, View, Text, ViewProps, Pressable } from "react-native";

import React from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";
import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";

import { FlashList } from "@shopify/flash-list";
import { RightLogoView } from "@/components/Custom/RightLogoView";

export default function deviceScreen() {
  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Device List",
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
      <BackgroundView
        style={styles.container}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <DeviceList callbackEvent={() => {}}></DeviceList>
      </BackgroundView>
    </View>
    // </BottomSheetModalProvider>
  );
}

const DeviceHeader = () => {
  return (
    <View style={{ height: 50, marginLeft: 20, marginTop: 30 }}>
      <Text style={{ fontSize: 24, color: "gray", fontWeight: "500" }}>
        ECigarettes Devices
      </Text>
    </View>
  );
};

type GreetFunction = () => void;

type NFTViewProps = ViewProps & {
  callbackEvent: GreetFunction;
};
const DeviceList = (callback: NFTViewProps) => {
  return (
    <FlashList
      ListHeaderComponent={DeviceHeader}
      // numColumns={2}
      data={DATA}
      renderItem={({ item, index }) => {
        return (
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/goods/[goods_id]",
                params: { goods_id: item.title },
              });
            }}
          >
            <FriendView></FriendView>
          </Pressable>
        );
      }}
      estimatedItemSize={150}
    />
  );
};

const FriendView = () => (
  <View
    style={{
      paddingHorizontal: 20,
      marginTop: 10,
    }}
  >
    <HorizonBackgroundView
      style={{
        height: 50,
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 15,
      }}
    >
      <Text style={{ flex: 1, marginLeft: 15, color: "white" }}>
        Device 00001
      </Text>
      <Pressable
        onPress={() => {
          router.push("/device/link");
        }}
      >
        <View
          style={{
            width: 70,
            height: 30,
            marginRight: 15,
            backgroundColor: "red",
            borderRadius: 10,
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Match</Text>
        </View>
      </Pressable>
    </HorizonBackgroundView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "flex-start",
    backgroundColor: "black",
  },
  topContainer: {
    // height: 250,
    backgroundColor: "gray",
    margin: 10,
    // marginLeft: 30,
    borderRadius: 20,
  },
  chartContainer: { height: 300, margin: 140 },
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
  card: {
    // width: "90%",
    height: 180,
    // backgroundColor: "rgb(20,20,20)",
    backgroundColor: "red",
    // margin: 5,
    // top: 10,
    // marginBottom: 20,
    // left: 20,
    // right: 20,
    // borderRadius: 25,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconImage: {
    width: "100%",
    height: "100%",
    flex: 1,
    margin: 0,
  },
});

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
