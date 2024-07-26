import {
  StyleSheet,
  View,
  Text,
  ViewProps,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";

import { BarChart, ruleTypes } from "react-native-gifted-charts";
import { FlashList } from "@shopify/flash-list";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import { buttonBgColor } from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";
import { Image } from "expo-image";
import { formatMoney } from "@/constants/CommonUtils";
import { PageSize } from "@/constants/HttpUtils";
import { CLOG } from "@/constants/LogUtils";
import { Nft, useNFTList } from "@/constants/NodeUtil";

// 历史信息列表
export default function historyScreen() {
  // 【首页】-> total earnings 数据列表
  const [historyDatas, setHistoryDatas] = useState<(string | HistoryItem)[]>(
    []
  );

  const [refreshing, setRefreshing] = React.useState(false);
  const [pageIndex, setPageIndex] = useState(1);

  const { getNFTList } = useNFTList();

  const onRefresh = React.useCallback(() => {
    setPageIndex(1);
    getHistoryListInfo(true);
    CLOG.info(`history列表下拉刷新`);
  }, []);

  // TODO: 【connect 页面 - Vape Details - History】-> 获取当前设备的历史记录信息
  const getHistoryListInfo = async (isClean: boolean) => {
    setRefreshing(true);

    try {
      const response = await getNFTList(
        "0x60139e5076a7d5121d597e3a3a1647d716cd7fd9",
        pageIndex,
        PageSize
      );

      // const tempMockDatas = mockHistorys.filter((e) => typeof e !== "string");
      if (isClean) {
        setHistoryDatas(mockHistorys);
      } else {
        const items = [...historyDatas, ...mockHistorys];
        setHistoryDatas(items);
      }
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };

  const renderFooter = () => {
    // 显示加载更多指示器
    return refreshing ? <ActivityIndicator size="small" color="white" /> : null;
  };

  const handleEndReached = () => {
    // 当滚动到底部时触发加载更多
    if (!refreshing) {
      setPageIndex((index) => index + 1);
    }
  };

  const keyExtractor = useCallback(
    (item: any, i: number) => `${i}-${item.id}`,
    []
  );

  // 分页加载
  useEffect(() => {
    getHistoryListInfo(pageIndex <= 1);
  }, [pageIndex]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "History",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: Squealt3Regular,
          },
          headerTitleAlign: "center",

          headerBackTitleVisible: false,
          headerRight: (props) => (
            <RightLogoView marginRight={-5}></RightLogoView>
          ),
          headerLeft: (props) => (
            <HeaderLeftBackView
              callback={() => {
                if (router.canGoBack()) router.back();
              }}
            ></HeaderLeftBackView>
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
        <FlashList
          // ListHeaderComponent={TrendHeader}
          // ListHeaderComponent={<View style={{ height: 20 }}></View>}
          // numColumns={2}
          data={historyDatas}
          renderItem={({ item, index }) => {
            if (typeof item === "string") {
              // Rendering header
              return (
                <Text
                  style={{
                    fontFamily: Squealt3Regular,
                    fontSize: 16,
                    color: "white",
                    marginLeft: 30,
                    // height: 30,
                    marginVertical: 20,
                    // textAlign: "center",
                    // backgroundColor: "black",
                  }}
                >
                  {item}
                </Text>
              );
            }
            return (
              <HistoryItemView
                item={item}
                callbackEvent={() => {}}
              ></HistoryItemView>
            );
          }}
          // stickyHeaderIndices={stickyHeaderIndices}
          getItemType={(item) => {
            // To achieve better performance, specify the type based on the item
            return typeof item === "string" ? "sectionHeader" : "row";
          }}
          estimatedItemSize={150}
          keyExtractor={keyExtractor} //{(item) => `${item.id}`}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1} // 触发加载更多的阈值
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"white"}
              progressBackgroundColor={"white"}
              style={{ backgroundColor: "black" }}
            />
          }
        />
      </BackgroundView>
    </View>
  );
}

// 历史信息
type HistoryItemViewProps = ViewProps & {
  item: HistoryItem;
  callbackEvent: () => void;
};

const HistoryItemView = ({ callbackEvent, item }: HistoryItemViewProps) => {
  return (
    <Pressable
      onPress={() => {
        // router.push({
        //   pathname: "/goods/[goods_id]",
        //   params: { goods_id: item.title },
        // });
      }}
    >
      <View
        style={{
          paddingLeft: 30,
          paddingRight: 30,
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
              // backgroundColor: "black",
              borderRadius: 30,
              // marginLeft: 15,
              borderWidth: 0.5,
              borderColor: "rgb(52,37,37)",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={
                item.type === "recasted"
                  ? require("@/assets/images/index/trade_out.png")
                  : require("@/assets/images/index/trade_in.png")
              }
              style={{
                // width: item.type === "recasted" ? 25 : 34,
                // height: item.type === "recasted" ? 25 : 34,
                width: "100%",
                height: "100%",
              }}
              contentFit="fill"
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
                {item.name}
              </Text>
              <View style={{ flex: 1 }}></View>
              <Text
                style={{
                  marginLeft: 10,
                  color: "white",
                  fontSize: 18,
                }}
              >
                {item.money}
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
                {item.date}
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
                PUFF
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// 类型
type HistoryItemType = "collected" | "received" | "recasted";

interface HistoryItem {
  type: HistoryItemType;
  name: string | null;
  date: string | null;
  money: string | null;
}

const mockHistorys: (string | HistoryItem)[] = [
  "May, 2024",
  {
    type: "collected",
    name: "Collected",
    date: "May 3 17:26",
    money: "+1,000",
  },
  { type: "received", name: "Received", date: "May 2 10:31", money: "+400" },
  { type: "recasted", name: "Recasted", date: "May 1 10:26", money: "-14,000" },
  {
    type: "collected",
    name: "Collected",
    date: "May 1 10:26",
    money: "+1,000",
  },
  {
    type: "collected",
    name: "Collected",
    date: "May 1 10:26",
    money: "+1,000",
  },
  {
    type: "collected",
    name: "Collected",
    date: "May 1 10:26",
    money: "+1,000",
  },
  {
    type: "collected",
    name: "Collected",
    date: "May 1 10:26",
    money: "+1,000",
  },
  "April, 2024",
  {
    type: "collected",
    name: "Collected",
    date: "April 30 10:26",
    money: "+1,000",
  },
  // { type: "received", name: "Received", date: "April 26 10:26", money: "+400" },
  // {
  //   type: "recasted",
  //   name: "Recasted",
  //   date: "April 23 10:21",
  //   money: "-14,000",
  // },
];

const stickyHeaderIndices = mockHistorys
  .map((item, index) => {
    if (typeof item === "string") {
      return index;
    } else {
      return null;
    }
  })
  .filter((item) => item !== null) as number[];

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
