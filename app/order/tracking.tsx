import { StyleSheet, View, Text, ViewProps, Pressable } from "react-native";

import React from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { BackgroundView } from "@/components/Custom/BackgroundView";

import { FlashList } from "@shopify/flash-list";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import { ConstantStorage } from "@/constants/LocalStorage";

export default function deviceScreen() {
  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Order Tracking",
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
        <TrackingList callbackEvent={() => {}}></TrackingList>
      </BackgroundView>
    </View>
    // </BottomSheetModalProvider>
  );
}

type GreetFunction = () => void;

type NFTViewProps = ViewProps & {
  callbackEvent: GreetFunction;
};

const TrackingHeaderView = () => (
  <View
    style={{
      paddingHorizontal: 20,
      // marginTop: 10,
      // flex: 1,
    }}
  >
    <View
      style={{
        marginTop: 50,
        height: 60,
        // backgroundColor: "red",
      }}
    >
      <Text style={{ color: "white", fontSize: 16 }}>Shipped with USPS</Text>
      <Text style={{ color: "white", fontSize: 16, marginTop: 10 }}>
        Tracking ID: 11238172938912371283764
      </Text>
    </View>
    <View
      style={{
        marginTop: 50,
        height: 30,
        // backgroundColor: "red",
      }}
    >
      <Text style={{ color: "gray", fontSize: 14 }}>Monday,April 24</Text>
    </View>
  </View>
);

const TrackingFooterView = () => (
  <View
    style={{
      paddingHorizontal: 20,
      // marginTop: 10,
      // flex: 1,
    }}
  >
    <View
      style={{
        marginTop: 20,
        marginBottom: 20,
        height: 60,
        // backgroundColor: "red",
      }}
    >
      <Text style={{ color: "gray", fontSize: 16, marginTop: 10 }}>
        Times are shown in the local timezone
      </Text>
    </View>
  </View>
);
const TrackingList = (callback: NFTViewProps) => {
  return (
    <FlashList
      ListHeaderComponent={TrackingHeaderView}
      ListFooterComponent={TrackingFooterView}
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
            <TrackingItemView></TrackingItemView>
          </Pressable>
        );
      }}
      estimatedItemSize={150}
    />
  );
};

const TrackingItemView = () => (
  <View
    style={{
      paddingHorizontal: 20,
      marginTop: 10,
    }}
  >
    <View
      style={{
        height: 50,
        alignItems: "center",
        flexDirection: "row",
        // borderRadius: 15,
        marginRight: 10,
      }}
    >
      <View
        style={{
          alignContent: "flex-start",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ width: 80, height: 20, color: "gray", marginTop: 5 }}>
          12:45 pm
        </Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={{ width: 2, height: "80%", backgroundColor: "red" }}></View>
      <View
        style={{
          alignContent: "flex-start",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            flex: 1,
            height: 20,
            color: "gray",
            marginHorizontal: 20,
            marginTop: 5,
          }}
        >
          Package arrived at an Amazon facility Swanton, Ohio US
        </Text>
        {/* <View style={{ flex: 1 }}></View> */}
      </View>
    </View>
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
