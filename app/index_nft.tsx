import { useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Pressable,
  Text,
} from "react-native";
import { Stack } from "expo-router";
import React from "react";

import { BackgroundView } from "@/components/Custom/BackgroundView";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "expo-image";
import { Squealt3Regular } from "@/constants/FontUtils";
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabBarItemProps,
  TabView,
} from "react-native-tab-view";
import { OrdersListAllView } from "@/components/Custom/OrderListView";
import { buttonBgColor, buttonGrayBgColor } from "@/constants/Colors";
import { windowWidth } from "@/constants/CommonUtils";
import { FunctionWithNumber } from "@/constants/ViewProps";

// NFT页面
export const nftScreen = () => {
  useEffect(() => {}, []);

  return (
    <BackgroundView
      style={{ flex: 1 }}
      x={"0%"}
      y={"90%"}
      rx={"60%"}
      ry={"40%"}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          gestureEnabled: false, // 禁用IOS的左滑返回
        }}
      />
      <StatusBar barStyle={"light-content"} translucent={true}></StatusBar>

      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <NFTTabView></NFTTabView>

        {/* <ScrollView
          style={{
            paddingHorizontal: "13%",
            width: "100%",
            height: "100%",
            // backgroundColor: "red",
          }}
        ></ScrollView> */}
      </SafeAreaView>
    </BackgroundView>
  );
};

const AddtionView = () => (
  <View
    style={{
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      flexDirection: "row",
      // backgroundColor: "red",
      // height: 60,
      marginTop: 15,
      marginBottom: 30,
    }}
  >
    <Image
      style={{ width: 124, height: 18 }}
      source={require("@/assets/images/login/login_protect.png")}
      contentFit="contain"
    ></Image>
  </View>
);

const renderScene = SceneMap({
  one: AddtionView,
  second: AddtionView,
});

type RenderTabBarProp = SceneRendererProps & {
  navigationState: NavigationState<{
    key: string;
    title: string;
  }>;
};

const renderTabBar = (
  props: RenderTabBarProp,
  callbackEvent?: FunctionWithNumber
) => {
  const currentIndex = props.navigationState.index;

  const renderTabBarItem = (
    itemProps: TabBarItemProps<any> & { key: string },
    callbackEvent?: FunctionWithNumber
  ) => {
    const windowDimensions = Dimensions.get("window");
    const screenDimensions = Dimensions.get("screen");
    const itemWidth = 80; // (windowDimensions.width - 60) / 3;

    let index = 0;
    let title = "";
    if (itemProps.key == "one") {
      title = "My vape";
      index = 0;
    } else if (itemProps.key == "second") {
      title = "Connect";
      index = 1;
    }

    const isSelected = currentIndex == index;

    return (
      <Pressable
        onPress={() => {
          if (callbackEvent) callbackEvent(index);
        }}
      >
        <View
          // style={{}}
          // mode="contained"
          // buttonColor="red"
          style={{
            borderRadius: 20,
            height: 40,
            width: itemWidth,
            marginHorizontal: 5,
            // backgroundColor: isSelected ? buttonBgColor : buttonGrayBgColor,
            borderWidth: isSelected ? 0 : 0,
            // borderColor: isSelected ? buttonBgColor : buttonBgColor,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
          // color={buttonBgColor}
        >
          <Text
            style={{
              color: isSelected ? "white" : "gray",
              fontFamily: Squealt3Regular,
              fontSize: 18,
              // height: 30,
              width: itemWidth,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <TabBar
      {...props}
      scrollEnabled={false}
      indicatorStyle={{
        backgroundColor: "green",
        width: 80,
        borderRadius: 0,
        height: 3,
      }}
      indicatorContainerStyle={{
        // marginHorizontal: 35,
        // paddingHorizontal: 80,
        marginBottom: -3,
      }}
      // style={{ backgroundColor: "black", marginHorizontal: 0 }}
      tabStyle={{
        borderRadius: 12,
        // width: 200,
      }}
      labelStyle={{
        fontSize: 16,
        color: "white",
        textTransform: "none",
        textAlign: "center",
        // height: 20,
        backgroundColor: "green",
        // width: itemWidth,
      }}
      contentContainerStyle={{ backgroundColor: "black" }}
      // indicatorContainerStyle={{
      //   marginHorizontal: 35,
      //   paddingHorizontal: 80,
      //   marginBottom: 3,
      // }}
      renderTabBarItem={(e) => renderTabBarItem(e, callbackEvent)}
      style={{
        // marginLeft: 15,
        marginVertical: 0,
      }}
    />
  );
};

// NFT tabview
function NFTTabView() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "one", title: "My vape" },
    { key: "second", title: "Connect" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: windowWidth }}
      lazy={true}
      renderTabBar={(e) =>
        renderTabBar(e, (index) => {
          setIndex(index);
        })
      }
      style={{ width: "100%", height: "100%" }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
  },
});
