import { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Pressable,
  Text,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import React from "react";

import { BackgroundView } from "@/components/Custom/BackgroundView";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image, ImageBackground } from "expo-image";
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
import {
  buttonBgColor,
  buttonGray150Color,
  buttonGray200Color,
  buttonGray50Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import { percent10WinHeight, windowWidth } from "@/constants/CommonUtils";
import { FunctionWithNumber } from "@/constants/ViewProps";
import { toastConfig } from "@/constants/DialogUtils";
import Toast from "react-native-toast-message";
import { ConnectNoneView, ConnectingView } from "./ConnectNoneView";
import { VapeNoneView } from "./VapeNoneView";
import { VapeBindView } from "./VapeBindView";
import { ConnectPairListView } from "./ConnectPairListView";
import { ConnectedView } from "./ConnectedView";
import {
  ConstantStorage,
  LocalBLEPairedDeviceInfo,
  LocalMyVapeInfo,
  LocalMyVapeNodeInfo,
} from "@/constants/LocalStorage";
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv";

// NFT页面
export const NFTHomeScreen = () => {
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
          headerShown: false,
          gestureEnabled: false, // 禁用IOS的左滑返回
        }}
      />
      <StatusBar barStyle={"light-content"} translucent={true}></StatusBar>

      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <NFTTabView></NFTTabView>
        {/* <BindVapeView></BindVapeView> */}

        {/* <ScrollView style={{ width: "100%", height: "100%" }}>
          <BindVapeView></BindVapeView>
        </ScrollView> */}

        {/* <ScrollView
        style={{
          // paddingHorizontal: "13%",
          width: "100%",
          height: "100%",
          flex: 1,
          // backgroundColor: "red",
        }}
      >
        <NFTTabView></NFTTabView>
      </ScrollView> */}
      </SafeAreaView>
    </BackgroundView>
  );
};

// 连接视图状态
type ConnectViewState = "idle" | "searching" | "pairList" | "connected";

// 我的连接设备
const MyConnectView = () => {
  // 本地已经配对的信息 LocalBLEPairedDeviceInfo
  const [localPairedVapeInfo, setLocalPairedVapeInfo] = useMMKVObject<
    LocalBLEPairedDeviceInfo | null | undefined
  >(ConstantStorage.localBLEPairedDeviceInfo);

  const [connectState, setConnectState] = useState<ConnectViewState>("idle");

  // 配对成功设置本地信息并且更新对应的数据
  const onPairedSuccessEvent = (pairedInfo: LocalBLEPairedDeviceInfo) => {
    setLocalPairedVapeInfo(pairedInfo);
  };

  // TODO:【Connect页面 - 前端】取消蓝牙配对事件
  const onUnPairedEvent = () => {
    setLocalPairedVapeInfo(null);

    // 同时修改node合同vape页面
    setConnectState("idle");
  };

  // TODO:【Connect页面 - 前端】获取本地蓝牙和设备连接信息
  const getBLEConnectInfo = () => {
    // setTimeout(() => {
    //   setConnectState("connected");
    // }, 1000);

    if (localPairedVapeInfo !== null && localPairedVapeInfo !== undefined) {
      setConnectState("connected");
    } else {
      setConnectState("idle");
    }
  };

  // 页面可见时
  useFocusEffect(
    useCallback(() => {
      getBLEConnectInfo();
    }, [localPairedVapeInfo])
  );

  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
        // flexDirection: "row",
        flex: 1,
      }}
    >
      {connectState == "idle" && (
        <ConnectNoneView
          callback={() => setConnectState("searching")}
        ></ConnectNoneView>
      )}
      {connectState == "searching" && (
        <ConnectingView
          callback={() => setConnectState("pairList")}
        ></ConnectingView>
      )}
      {connectState == "pairList" && (
        <ConnectPairListView
          callback={() => {}}
          pairSuccessCallback={onPairedSuccessEvent}
        ></ConnectPairListView>
      )}

      {connectState == "connected" && (
        <ConnectedView
          localPairedVapeInfo={localPairedVapeInfo}
          callback={() => setConnectState("idle")}
          unPairedCallback={onUnPairedEvent}
        ></ConnectedView>
      )}

      {/* <ConnectingView></ConnectingView> */}
      {/* <ScrollView style={{ width: "100%", height: "100%" }}>
      <NoneConnectView></NoneConnectView>
    </ScrollView> */}
    </View>
  );
};

// Vape视图状态
type VapeViewState = "idle" | "searching" | "connected";

// 我的 Vape View
const MyVapeView = () => {
  const [vapeViewState, setVapeViewState] = useState<VapeViewState>("idle");

  // MyVape 信息
  const [localMyVapeInfo, setLocalMyVapeInfo] =
    useState<LocalMyVapeInfo | null>(null);

  // MyVape Current Node 信息
  const [localMyVapeNodeInfo, setLocalMyVapeNodeInfo] =
    useState<LocalMyVapeNodeInfo | null>(null);

  // TODO:【My Vape页面】获取 My Vape Bind 状态 和信息
  const getMyVapeBindStatusInfo = () => {
    setTimeout(() => {
      setVapeViewState("connected");

      getMyVapeInfo();
      getMyVapeNodeInfo();
    }, 1000);
  };

  // TODO:【My Vape页面】获取 MyVape 具体信息
  const getMyVapeInfo = () => {
    setTimeout(() => {
      setLocalMyVapeInfo({
        vapeId: "DZ1234567890",
        leastCode: "1546851",
        sharingRate: "20", //
        lesseeStatus: true, // 出租状态,是否已经出租
        lessee: "", // 出租人
      });
    }, 1000);
  };

  // TODO:【My Vape页面】获取 MyVape Current Node 信息
  const getMyVapeNodeInfo = () => {
    setTimeout(() => {
      setLocalMyVapeNodeInfo({
        tokenId: "0781",
        rareRate: "12",
        rareRatePff: "50-100", //
        pairedPods: "A/B/C",
        plusModel: "A",
        icon: require("@/assets/images/nft/nft_bear.png"), // 图标
      });
    }, 2000);
  };

  // TODO:【My Vape页面】获取 MyVape detach vape事件
  const onDetachVapeEvent = () => {
    setLocalMyVapeNodeInfo(null);
    setVapeViewState("idle");
  };

  // MyVape信息发生了改变,重新请求相关信息
  const onMyVapeInfoChangedEvent = () => {
    getMyVapeBindStatusInfo();
  };

  // 页面可见时
  useFocusEffect(
    useCallback(() => {
      getMyVapeBindStatusInfo();
    }, [])
  );

  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
        // flexDirection: "row",
        flex: 1,
      }}
    >
      {vapeViewState === "idle" && (
        <VapeNoneView
          callback={() => {
            setVapeViewState("connected");
          }}
        ></VapeNoneView>
      )}

      {vapeViewState === "connected" && (
        <ScrollView style={{ width: "100%", height: "100%" }}>
          <VapeBindView
            myVapeInfo={localMyVapeInfo}
            myVapeNodeInfo={localMyVapeNodeInfo}
            myVapeInfoChanged={onMyVapeInfoChangedEvent}
            detachVapeCallback={onDetachVapeEvent}
          ></VapeBindView>
        </ScrollView>
      )}
    </View>
  );
};

type RenderTabBarProp = SceneRendererProps & {
  navigationState: NavigationState<{
    key: string;
    title: string;
  }>;
};

// NFT tabview
const NFTTabView = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "one", title: "My vape" },
    { key: "second", title: "Connect" },
  ]);

  const renderScene = SceneMap({
    one: MyVapeView,
    second: MyConnectView,
  });

  const renderTabBar = (
    props: RenderTabBarProp,
    callbackEvent?: FunctionWithNumber
  ) => {
    const currentIndex = props.navigationState.index;

    const renderTabBarItem = (
      itemProps: TabBarItemProps<any> & { key: string },
      callbackEvent?: FunctionWithNumber
    ) => {
      const itemWidth = 100; // (windowDimensions.width - 60) / 3;

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
                fontWeight: isSelected ? "bold" : "100",
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
    const indicatorWidth = 70;
    const itemWidth = 110; // (windowDimensions.width - 60) / 3;

    return (
      <TabBar
        {...props}
        scrollEnabled={false}
        indicatorStyle={{
          backgroundColor: buttonBgColor,
          // width: 30,
          // marginLeft: 20,
          width: indicatorWidth,
          left: (itemWidth - indicatorWidth) / 2,
          borderRadius: 0,
          height: 2,
        }}
        indicatorContainerStyle={{
          // marginHorizontal: 35,
          // paddingHorizontal: 80,
          // backgroundColor: "yellow",
          marginBottom: -3,
        }}
        // style={{ backgroundColor: "black", marginHorizontal: 0 }}
        tabStyle={{
          borderRadius: 12,
          width: itemWidth,
        }}
        labelStyle={{
          fontSize: 16,
          color: "white",
          textTransform: "none",
          textAlign: "center",
          // height: 20,
          // backgroundColor: "green",
          // width: itemWidth,
        }}
        contentContainerStyle={{
          backgroundColor: "black",
          justifyContent: "flex-start",
        }}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
  },
});
