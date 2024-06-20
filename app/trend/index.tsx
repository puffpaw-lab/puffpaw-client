import {
  Image,
  StyleSheet,
  View,
  Text,
  ViewProps,
  Pressable,
  RefreshControl,
} from "react-native";

import React, { PropsWithChildren } from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";

import { BarChart, ruleTypes } from "react-native-gifted-charts";
import { FlashList } from "@shopify/flash-list";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import { buttonBgColor } from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";

export default function homeScreen() {
  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
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
        <MyFriendList callbackEvent={() => {}}></MyFriendList>
      </BackgroundView>
    </View>
    // </BottomSheetModalProvider>
  );
}

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

const TrendList = (callback: NFTViewProps) => {
  return (
    <FlashList
      ListHeaderComponent={TrendHeader}
      numColumns={2}
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
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={require("@/assets/images/mine/default_ntf_01.png")}
                  style={styles.cardIconImage}
                />
              </View>

              {/* <View style={styles.arrowButton}>
                <Image
                  source={require("@/assets/images/shop/goods_item_arrow.png")}
                  style={styles.goodsItemArrow}
                ></Image>
              </View> */}
            </View>
          </Pressable>
        );
      }}
      estimatedItemSize={150}
    />
  );
};

const TrendHeader = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, ...styles.topContainer }}>
        <HorizonBackgroundView
          linearColors={["rgb(36,22,22)", "rgb(15,12,12)"]}
          style={{
            borderRadius: 20,
            padding: 20,
            borderColor: "rgb(50,50,50)",
            borderWidth: 1,
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
            Total revenue
          </Text>
          <View
            style={{
              flexDirection: "row",
              // justifyContent: "center",
              alignItems: "center",
              // alignContent:'center'
              // marginTop: 5,
            }}
          >
            <View
              style={{
                width: 25,
                height: 25,
                backgroundColor: "red",
                marginRight: 10,
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

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
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
                  fontSize: 22,
                  color: "white",
                  // marginTop: 30,
                  fontWeight: "500",
                }}
              >
                Statistics
              </Text>
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 12,
                  // fontWeight: "bold",
                  color: "gray",
                }}
              >
                Income/Qutcome
              </Text>
            </View>
            <View style={{ flex: 1 }}></View>
            <Button
              // mode="contained"
              // buttonColor="red"
              style={{
                width: 80,
              }}
              // mode="contained"
              // buttonColor="gray"
              containerStyle={{ borderRadius: 20 }}
              color={buttonBgColor}
              onPress={() => {
                // router.push("/trend/cast");
              }}
            >
              <Text style={{ color: "black" }}>Week {">"}</Text>
            </Button>
          </View>
          <View style={{ height: 20 }}></View>

          <CustomChartView style={styles.chartContainer}></CustomChartView>
        </HorizonBackgroundView>
      </View>
    </View>
  );
};

type GreetFunction = () => void;

type NFTViewProps = ViewProps & {
  callbackEvent: GreetFunction;
};
const MyFriendList = (callback: NFTViewProps) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <FlashList
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={"white"}
          progressBackgroundColor={"white"}
          style={{ backgroundColor: "black" }}
        />
      }
      ListHeaderComponent={TrendHeader}
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
  <>
    <View
      style={{
        // height: 100,
        // backgroundColor: "yellow",
        // borderColor: "gray",
        // borderWidth: 1,
        // borderRadius: 30,
        // margin: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 0,
      }}
    >
      <View
        style={{
          height: 70,
          alignItems: "center",
          flexDirection: "row",
          // backgroundColor: "red",
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: "black",
            borderRadius: 30,
            // marginLeft: 15,
            borderWidth: 1,
            borderColor: "rgb(50,50,50)",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/index/trade_in.png")}
            style={{ width: 35, height: 27 }}
          />
        </View>

        <View
          style={{
            flex: 1,
            // height: 70,
            alignItems: "center",
            // flexDirection: "row",
          }}
        >
          <View
            style={{
              // flex: 1,
              // width: 50,
              height: 25,
              // backgroundColor: "green",
              // borderRadius: 25,
              // marginLeft: 15,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontFamily: Squealt3Regular,
                marginLeft: 10,
                color: "white",
                fontSize: 18,
              }}
            >
              Collect
            </Text>
            <View style={{ flex: 1 }}></View>
            <Text style={{ marginLeft: 10, color: "white", fontSize: 18 }}>
              +1000
            </Text>
          </View>
          <View
            style={{
              // flex: 1,

              // width: 50,
              height: 20,
              // backgroundColor: "red",
              // borderRadius: 25,
              // marginLeft: 15,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontFamily: Squealt3Regular,
                marginLeft: 10,
                color: "gray",
                fontSize: 14,
              }}
            >
              May3 18:32
            </Text>
            <View style={{ flex: 1 }}></View>
            <Text
              style={{
                fontFamily: Squealt3Regular,
                marginLeft: 10,
                color: "gray",
                fontSize: 14,
              }}
            >
              Puff
            </Text>
          </View>
        </View>
      </View>
    </View>
  </>
);

type CustomChartProps = ViewProps &
  PropsWithChildren<{
    // headerImage?: ReactElement;
    // headerBackgroundColor?: { dark: string; light: string };
  }>;
const CustomChartView = ({ style, children }: CustomChartProps) => {
  const data = [
    {
      value: 500,
      frontColor: "rgb(80,80,80)",
      gradientColor: "rgb(80,80,80)",
      spacing: 6,
      label: "Sun",
    },
    {
      value: 2400,
      frontColor: buttonBgColor,
      gradientColor: buttonBgColor,
    },

    {
      value: 3500,
      frontColor: "rgb(80,80,80)",
      gradientColor: "rgb(80,80,80)",
      spacing: 6,
      label: "Mon",
    },
    {
      value: 1300,
      frontColor: buttonBgColor,
      gradientColor: buttonBgColor,
    },

    {
      value: 4500,
      frontColor: "rgb(80,80,80)",
      gradientColor: "rgb(80,80,80)",
      spacing: 6,
      label: "Tue",
    },
    {
      value: 2000,
      frontColor: buttonBgColor,
      gradientColor: buttonBgColor,
    },

    {
      value: 5200,
      frontColor: "rgb(80,80,80)",
      gradientColor: "rgb(80,80,80)",
      spacing: 6,
      label: "Wed",
    },
    {
      value: 4900,
      frontColor: buttonBgColor,
      gradientColor: buttonBgColor,
    },

    {
      value: 3000,
      frontColor: "rgb(80,80,80)",
      gradientColor: "rgb(80,80,80)",
      spacing: 6,
      label: "Thu",
    },
    {
      value: 2800,
      frontColor: buttonBgColor,
      gradientColor: buttonBgColor,
    },

    {
      value: 1000,
      frontColor: "rgb(80,80,80)",
      gradientColor: "rgb(80,80,80)",
      spacing: 6,
      label: "Fri",
    },
    {
      value: 2800,
      frontColor: buttonBgColor,
      gradientColor: buttonBgColor,
    },

    {
      value: 1000,
      frontColor: "rgb(80,80,80)",
      gradientColor: "rgb(80,80,80)",
      spacing: 6,
      label: "Sat",
    },
    {
      value: 2800,
      frontColor: buttonBgColor,
      gradientColor: buttonBgColor,
    },
  ];

  return (
    <BarChart
      data={data}
      barWidth={16}
      initialSpacing={10}
      spacing={14}
      barBorderRadius={4}
      showGradient
      yAxisThickness={0}
      xAxisType={ruleTypes.DASHED}
      xAxisColor={"lightgray"}
      yAxisTextStyle={{ color: "lightgray" }}
      stepValue={1000}
      maxValue={6000}
      hideYAxisText
      hideAxesAndRules
      noOfSections={6}
      yAxisLabelTexts={["0", "1k", "2k", "3k", "4k", "5k", "6k"]}
      labelWidth={40}
      xAxisLabelTextStyle={{ color: "lightgray", textAlign: "center" }}
      // showLine
      lineConfig={{
        color: "white",
        thickness: 13,
        curved: true,
        hideDataPoints: false,
        shiftY: 20,
        initialSpacing: -30,
      }}
    ></BarChart>
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
    backgroundColor: "gray",
    margin: 10,
    // marginLeft: 30,
    borderRadius: 20,
  },
  chartContainer: { height: 300 },
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
