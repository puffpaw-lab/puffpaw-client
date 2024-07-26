import { StyleSheet, View, Text, ViewProps, Pressable } from "react-native";

import React, { useEffect, useState } from "react";
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { BackgroundView } from "@/components/Custom/BackgroundView";

import { FlashList } from "@shopify/flash-list";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { ConstantStorage } from "@/constants/LocalStorage";
import { Squealt3Regular } from "@/constants/FontUtils";
import {
  formatLocalTime,
  parseAddress,
  percent5WinHeight,
} from "@/constants/CommonUtils";
import { buttonBgColor } from "@/constants/Colors";
import { DialogUtils } from "@/constants/DialogUtils";
import { orderDetailInterface } from "@/constants/HttpUtils";
import {
  OrderItemType,
  OrderDetailItemType,
  GoodsItemType,
  AddressDetailType,
  OrderTrackingItemType,
} from "@/constants/ViewProps";
import { AxiosResponse } from "axios";

export default function deviceScreen() {
  // 参数
  const { order_id, extra, other } = useLocalSearchParams<{
    order_id: string;
    extra?: string;
    other?: string;
  }>();

  const [orderItem, setOrderItem] = useState<OrderItemType | null>(null);

  const [trackingItems, setTrackingItems] = useState<
    OrderTrackingItemType[] | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);

  // 订单信息成功
  const orderInfoSuccess = (response: AxiosResponse<any, any> | null) => {
    const topData = response?.data;
    if (topData == null) {
      return;
    }

    const { code, msg, data } = topData;
    if (code != 0) {
      DialogUtils.showError(`${msg}`);
      return;
    }

    const { depinOrder, log } = data;
    if (log !== null) {
      setTrackingItems(log);
    }

    setOrderItem(depinOrder);
  };

  // 获取商品数据
  const getOrderDetailInfo = async () => {
    setRefreshing(true);

    try {
      const response = await orderDetailInterface(parseInt(order_id ?? "0"));
      orderInfoSuccess(response);
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };

  // 拉取接口
  useEffect(() => {
    getOrderDetailInfo();
  }, []);

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
          ListHeaderComponent={() => (
            <TrackingHeaderView orderItem={orderItem}></TrackingHeaderView>
          )}
          ListFooterComponent={TrackingFooterView}
          // numColumns={2}
          data={trackingItems}
          renderItem={({ item, index }) => {
            // if (typeof item === "string") {
            //   // Rendering header
            //   return (
            //     <Text
            //       style={{
            //         fontFamily: Squealt3Regular,
            //         fontSize: 16,
            //         color: "rgb(172,172,172)",
            //         marginLeft: 30,
            //         // height: 30,
            //         marginVertical: 20,
            //         // textAlign: "center",
            //         // backgroundColor: "black",
            //       }}
            //     >
            //       {item}
            //     </Text>
            //   );
            // }

            return (
              <Pressable
                onPress={() => {
                  // router.push({
                  //   pathname: "/goods/[goods_id]",
                  //   params: { goods_id: item.title },
                  // });
                }}
              >
                <TrackingItemView trackingItem={item}></TrackingItemView>
              </Pressable>
            );
          }}
          getItemType={(item) => {
            // To achieve better performance, specify the type based on the item
            return typeof item === "string" ? "sectionHeader" : "row";
          }}
          estimatedItemSize={150}
        />
      </BackgroundView>
    </View>
    // </BottomSheetModalProvider>
  );
}

type OrderItemProps = ViewProps & {
  orderItem: OrderItemType | null;
};

const TrackingHeaderView = ({ orderItem }: OrderItemProps) => (
  <View
    style={{
      paddingHorizontal: 20,
      // marginTop: 10,
      // flex: 1,
    }}
  >
    <View
      style={{
        marginTop: percent5WinHeight,
        // height: 60,
        // backgroundColor: "red",
      }}
    >
      <Text
        style={{ fontFamily: Squealt3Regular, color: "white", fontSize: 14 }}
        ellipsizeMode="tail"
        numberOfLines={2}
      >
        Shipped with {orderItem?.deliveryCompany}
      </Text>
      <Text
        style={{
          fontFamily: Squealt3Regular,
          color: "white",
          fontSize: 14,
          marginTop: 10,
        }}
        ellipsizeMode="tail"
        numberOfLines={2}
      >
        Tracking ID: {orderItem?.deliveryNo}
      </Text>
    </View>
    {/* <View
      style={{
        marginTop: percent5WinHeight,
        height: 30,
        // backgroundColor: "red",
      }}
    >
      <Text
        style={{
          fontFamily: Squealt3Regular,
          color: "gray",
          fontSize: 14,
          marginLeft: 10,
        }}
      >
        Monday, April 24
      </Text>
    </View> */}
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
      <Text
        style={{
          fontFamily: Squealt3Regular,
          color: "rgb(206,206,206)",
          fontSize: 12,
          marginTop: 10,
        }}
      >
        Times are shown in the local timezone
      </Text>
    </View>
  </View>
);

type TrackItemProps = ViewProps & {
  trackingItem: OrderTrackingItemType;
};

const TrackingItemView = ({ trackingItem }: TrackItemProps) => (
  <View
    style={{
      paddingHorizontal: 30,
      marginTop: 10,
    }}
  >
    <View
      style={{
        minHeight: 50,
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
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 12,
            width: 75,
            // height: 20,
            color: "rgb(172,172,172)",
            marginTop: 5,
          }}
        >
          {formatLocalTime(trackingItem?.createTime)}
        </Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <View
        style={{ width: 1, height: "80%", backgroundColor: "rgb(236,90,65)" }}
      ></View>
      <View
        style={{
          alignContent: "flex-start",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 12,
              // flex: 1,
              // height: 20,
              color: "rgb(172,172,172)",
              marginTop: 5,
              textAlign: "left",
            }}
          >
            {trackingItem.detail}
          </Text>
        </View>
        <View style={{ flex: 1 }}></View>
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 12,
              flex: 1,
              // height: 20,
              color: "rgb(172,172,172)",
              marginTop: 5,
              textAlign: "left",
            }}
          >
            {trackingItem.detail}
          </Text>
        </View> */}
      </View>
    </View>
  </View>
);

interface HistoryItem {
  name: string | null;
  address: string | null;
  date: string | null;
}

const contacts: (string | HistoryItem)[] = [
  "Monday, April 24",
  {
    name: "Package arrived at an Amazon facility.",
    address: "Swanton, Ohio US",
    date: "12:59 PM",
  },
  {
    name: "Package arrived at an Amazon facility.",
    address: "Haslet, TX US",
    date: "9:34 AM",
  },
  {
    name: "Package arrived at an Amazon facility.",
    address: "Wyadotte, MI US",
    date: "7:52 AM",
  },
  {
    name: "Package arrived at an Amazon facility.",
    address: "Haslet, TX US",
    date: "6:13 AM",
  },
  {
    name: "Carrier picked up the package.",
    address: "",
    date: "",
  },
  // {
  //   name: "Package arrived at an Amazon facility Swanton, Ohio US",
  //   date: "May 1 10:26",
  // },
  // {
  //   name: "Package arrived at an Amazon facility Swanton, Ohio US",
  //   date: "May 1 10:26",
  // },
  // "Monday, April 24",
  // {
  //   name: "Package arrived at an Amazon facility Swanton, Ohio US",
  //   date: "April 30 10:26",
  // },
];

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
