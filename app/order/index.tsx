import { Image, Pressable, StyleSheet, View, Text } from "react-native";

import React from "react";
import { Stack } from "expo-router";

import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";
import { useWindowDimensions } from "react-native";
import {
  TabView,
  SceneMap,
  TabBar,
  NavigationState,
  SceneRendererProps,
} from "react-native-tab-view";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import {
  OrdersListAllView,
  OrdersListProcessingView,
  OrdersListShipedView,
  OrdersListDeliveredView,
  OrdersListDoneView,
} from "@/components/Custom/OrderListView";

function OrdersListAllScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Your Orders",
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
        style={{ flex: 1, width: "100%", height: "100%" }}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <OrdersListAllView></OrdersListAllView>
      </BackgroundView>
    </View>
  );
}

function OrdersListProcessingScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Your Orders",
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
        style={{ flex: 1, width: "100%", height: "100%" }}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <OrdersListProcessingView></OrdersListProcessingView>
      </BackgroundView>
    </View>
  );
}

function OrdersListShipedScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Your Orders",
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
        style={{ flex: 1, width: "100%", height: "100%" }}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <OrdersListShipedView></OrdersListShipedView>
      </BackgroundView>
    </View>
  );
}

function OrdersListDeliveredScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Your Orders",
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
        style={{ flex: 1, width: "100%", height: "100%" }}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <OrdersListDeliveredView></OrdersListDeliveredView>
      </BackgroundView>
    </View>
  );
}

function OrdersListDoneScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Your Orders",
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
        style={{ flex: 1, width: "100%", height: "100%" }}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <OrdersListDoneView></OrdersListDoneView>
      </BackgroundView>
    </View>
  );
}

const renderScene = SceneMap({
  All: OrdersListAllScreen,
  Processing: OrdersListProcessingScreen,
  Shiped: OrdersListShipedScreen,
  Delivered: OrdersListDeliveredScreen,
  Done: OrdersListDoneScreen,
});

type Prop = SceneRendererProps & {
  navigationState: NavigationState<{
    key: string;
    title: string;
  }>;
};

const renderTabBar = (props: Prop) => (
  <TabBar
    {...props}
    scrollEnabled={true}
    indicatorStyle={{
      backgroundColor: "red",
      width: 20,
      borderRadius: 3,
      height: 3,
    }}
    style={{ backgroundColor: "black" }}
    tabStyle={{
      width: 120,
    }}
    labelStyle={{
      fontSize: 16,
      color: "white",
      textTransform: "capitalize",
    }}
    indicatorContainerStyle={{
      marginHorizontal: 35,
      paddingHorizontal: 80,
      marginBottom: 3,
    }}
  />
);

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "All", title: "All" },
    { key: "Processing", title: "Processing" },
    { key: "Shiped", title: "Shiped" },
    { key: "Delivered", title: "Delivered" },
    { key: "Done", title: "Done" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy={true}
      style={{ width: "auto" }}
      renderTabBar={renderTabBar}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    width: 200,
    height: 200,
  },
  logo: {
    width: 60,
    height: 30,
    position: "absolute",
    marginTop: 30,
    right: 15,
  },
  card: {
    marginTop: 20,
    // width: "90%",
    width: "auto",
    height: 150,
    // marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 25,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    // backgroundColor: "red",
    marginTop: -10,
  },
  rightContainer: {
    marginTop: -30,

    // position: "absolute",
    // left: "40%",
    // alignContent: "flex-start",
    // alignItems: "center",
    // top: 20,
    // backgroundColor: "green",
    flex: 2,
  },
  cardIconImage: {
    width: 120,
    height: 120,
  },
  arrowButton: {
    position: "absolute",
    // width: 25,
    // height: 25,
    right: 30,
    top: 180,
    // backgroundColor: "red",
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
  goodsItemArrow: {
    flex: 1,
    objectFit: "contain",
    width: 25,
    height: 25,
    right: 0,
  },
  headerContainer: {
    // flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "black",
    height: 60,
  },
  rightBottom: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
  pagerView: {
    flex: 1,
    width: "100%",
    // height: '300',
    backgroundColor: "black",
  },
});
