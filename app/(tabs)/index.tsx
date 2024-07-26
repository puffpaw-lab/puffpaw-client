import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  StatusBar,
  ViewProps,
} from "react-native";

import React, { useCallback, useState } from "react";
import { router, Stack, useFocusEffect } from "expo-router";
import { useMMKVObject } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";

import { RightLogoView } from "@/components/Custom/RightLogoView";
import {
  HomeChartInfo,
  HomeChartView,
  mockChartData,
} from "@/components/Custom/HomeChartView";
import { buttonBgColor, buttonGrayBgColor } from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";
import {
  formatMoney,
  halfWinHeight,
  percent20WinHeight,
  percent5WinHeight,
} from "@/constants/CommonUtils";

import { Image } from "expo-image";

import { registBackgroundFetchAsync } from "@/constants/BackgroundTaskUtils";
import { DialogUtils } from "@/constants/DialogUtils";

export default function homeScreen() {
  // 本地登录信息
  const [tempLogin, setTempLogin] = useMMKVObject<boolean>(
    ConstantStorage.tempLogin
  );

  // 收入信息
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [collectCount, setCollectCount] = useState(0);

  // 列表数据信息
  const [chartDatas, setChartDatas] = useState<HomeChartInfo[] | undefined>();

  // TODO: 【首页】获取Total Earnings
  const getTotalEarningsInfo = async () => {
    const _timer = setTimeout(() => {
      setTotalEarnings((e) => e + 2);
    }, 1000);
  };

  // TODO: 【首页】获取Unclaimed信息
  const getUnclaimedInfo = async () => {
    const _timer = setTimeout(() => {
      setCollectCount((e) => e + 1);
    }, 2000);
  };

  // TODO: 【首页】获取图表信息
  const getChartInfo = async () => {
    const _timer = setTimeout(() => {
      setChartDatas(mockChartData);
    }, 3000);
  };

  // 收集事件
  const onCollectEvent = () => {
    // TODO: 【首页】触发了 collect 收集事件
    //
    setTotalEarnings(totalEarnings + collectCount);
    setCollectCount(0);

    DialogUtils.showSuccess(`Collected ${collectCount} success`);
  };

  React.useEffect(() => {
    // 注册后台事件
    registBackgroundFetchAsync();
  }, []);

  // 页面可见时
  useFocusEffect(
    useCallback(() => {
      getTotalEarningsInfo();
      getUnclaimedInfo();
      getChartInfo();
    }, [])
  );

  // 模拟增加collect
  // useEffect(() => {
  //   const _timer = setTimeout(() => {
  //     setCollectCount((e) => e + 1);
  //   }, 2000);
  //   return () => clearTimeout(_timer);
  // });

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
            fontFamily: Squealt3Regular,
          },
          headerRight: (props) => (
            <Pressable
              onPress={() => {
                // router.push({
                //   pathname: "/test/background_fetch",
                //   // params: { order_id: "1" },
                // });
              }}
            >
              <RightLogoView></RightLogoView>
            </Pressable>
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
        <ScrollView style={{ width: "100%", height: "100%" }}>
          <TopView
            totalEarnings={totalEarnings}
            collectCount={collectCount}
            collectCallback={onCollectEvent}
          ></TopView>
          <View style={{ height: 50 }}></View>
          <HomeChartView
            style={styles.chartContainer}
            chartDatas={chartDatas}
          ></HomeChartView>
          <View style={{ height: percent20WinHeight }}></View>
        </ScrollView>
      </BackgroundView>
    </View>
  );
}

type TopViewProps = ViewProps & {
  totalEarnings: number;
  collectCount: number;
  collectCallback: () => void;
};

const TopView = ({
  totalEarnings,
  collectCount,
  collectCallback,
}: TopViewProps) => {
  return (
    <View style={styles.topContainer}>
      {/* Total return */}
      <Pressable
        onPress={() => {
          router.push("/trend");
        }}
        style={{
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "center",
          flexDirection: "row",
          // marginVertical: 5,
          marginTop: percent5WinHeight,
        }}
      >
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 16,
            color: "white",
            // fontWeight: "500",
          }}
        >
          Total Earnings
        </Text>
        <Image
          source={require("@/assets/images/index/total_right_arrow.png")}
          style={{ width: 18, height: 18, marginLeft: 0, marginTop: 3 }}
        />
      </Pressable>

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
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 30,
            // fontWeight: "bold",
            color: "white",
            marginLeft: 5,
          }}
        >
          {formatMoney(`${totalEarnings}`)}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            alignContent: "center",
            marginTop: 20,
            // width: "50%",
            borderColor: "rgb(40,40,40)",
            borderWidth: 1,
            borderRadius: 15,
            padding: 15,
            backgroundColor: buttonGrayBgColor,
          }}
        >
          <View
            style={
              {
                // flexDirection: "row",
                // justifyContent: "center",
                // alignItems: "flex-start",
                // alignContent: "center",
                // flex: 1,
                // backgroundColor: "green",
              }
            }
          >
            <Text
              style={{
                fontFamily: Squealt3Regular,
                fontSize: 12,
                color: "rgb(58,58,58)",
                // marginTop: 20,
                // fontWeight: "500",
                // backgroundColor: "yellow",
                flex: 1,
                textAlign: "center",
              }}
            >
              Unclaimed
            </Text>
            <Text
              style={{
                fontFamily: Squealt3Regular,
                fontSize: 20,
                // fontWeight: "bold",
                color: "white",
                // marginLeft: 10,
                flex: 1,
                textAlign: "center",
              }}
            >
              {formatMoney(`${collectCount}`)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              alignContent: "center",
              // marginTop: 7,
              marginLeft: 15,
            }}
          >
            <Pressable onPress={collectCallback}>
              <View
                style={{
                  // marginTop: 5,
                  // marginHorizontal: 30,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  // marginLeft: 10,
                  // backgroundColor: "red",
                  // margin: 10,
                }}
              >
                <View
                  style={{
                    // marginHorizontal: 20,
                    backgroundColor: collectCount <= 0 ? "gray" : buttonBgColor,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    height: 46,
                    width: 46,
                    borderRadius: 23,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Squealt3Regular,
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    Collect
                  </Text>
                </View>
                {/* <View style={{ flex: 1 }}></View> */}
              </View>
            </Pressable>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </View>
  );
};

const CollectButtonView = () => {
  return (
    <Pressable
      onPress={() => {
        // router.push("/trend");
      }}
    >
      <View
        style={{
          // marginTop: 5,
          // marginHorizontal: 30,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          flexDirection: "row",
          // marginLeft: 10,
          // backgroundColor: "red",
          // margin: 10,
        }}
      >
        <View
          style={{
            // marginHorizontal: 20,
            backgroundColor: buttonBgColor,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            height: 46,
            width: 46,
            borderRadius: 23,
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "white",
              fontSize: 12,
            }}
          >
            Collect
          </Text>
        </View>
        {/* <View style={{ flex: 1 }}></View> */}
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
    // height: 250,
    // backgroundColor: "gray",
    // margin: 10,
    // marginLeft: 30,
    paddingHorizontal: 25,
  },
  chartContainer: { backgroundColor: "black" },
  image: {
    width: "100%",
    height: halfWinHeight,
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
