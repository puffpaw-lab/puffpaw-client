import {
  StyleSheet,
  View,
  Pressable,
  ViewProps,
  RefreshControlProps,
  Text,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Dimensions } from "react-native";
import React, {
  JSXElementConstructor,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { router, Stack, useFocusEffect, useRouter } from "expo-router";

import { FlashList, MasonryFlashList } from "@shopify/flash-list";
import { useWindowDimensions } from "react-native";
import {
  TabView,
  SceneMap,
  TabBar,
  NavigationState,
  SceneRendererProps,
  TabBarItemProps,
} from "react-native-tab-view";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import { RefreshControl } from "react-native-gesture-handler";

import { Image, ImageBackground } from "expo-image";
import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";

// import { Searchbar } from "react-native-elements";
import { Divider, SearchBar } from "@rneui/themed";
import { buttonBgColor, buttonGray150Color } from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";
import { Button } from "@rneui/base";
import { UserHeaderView } from "@/components/Custom/UserHeaderView";
import {
  FunctionWithNumber,
  GoodsItemType,
  LoginFunction,
  OrderItemType,
} from "@/constants/ViewProps";
import { DialogUtils } from "@/constants/DialogUtils";
import {
  goodsListInterface,
  orderListInterface,
  PageSize,
} from "@/constants/HttpUtils";
import { AxiosResponse } from "axios";
import { ListEmptyView } from "./ListEmptyView";
import {
  formatImageUrl,
  formatMoney,
  formatOrderStatus,
  windowHeight,
  windowWidth,
} from "@/constants/CommonUtils";
import { CLOG } from "@/constants/LogUtils";

// 订单类型
export type OrdersListTypeProps =
  | "all"
  | "processing"
  | "shiped"
  | "delivered"
  | "done";

// 全部订单
export const OrdersListAllView = () => OrdersListView("all");
export const OrdersListProcessingView = () => OrdersListView("processing");
export const OrdersListShipedView = () => OrdersListView("shiped");
export const OrdersListDeliveredView = () => OrdersListView("delivered");
export const OrdersListDoneView = () => OrdersListView("done");

// 获取订单状态
// 0:待支付，1:待确认，2已支付，3：已完成，4:已取消
const getOrderStatus = (type: OrdersListTypeProps) => {
  let status: number | null = null;

  switch (type) {
    case "all":
      break;
    case "processing":
      status = 1;
      break;
    case "shiped":
      status = 2;
      break;
    case "delivered":
      status = 3;
      break;
    case "done":
      status = 3;
      break;
  }
  return status;
};

export const OrdersListView = (type: OrdersListTypeProps) => {
  const status = getOrderStatus(type);

  const [refreshing, setRefreshing] = React.useState(false);
  const [pageIndex, setPageIndex] = useState(1);

  const onRefresh = React.useCallback(() => {
    setPageIndex(1);
    getOrderList(true);
  }, []);

  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);

  // 订单信息成功
  const orderListSuccess = (
    response: AxiosResponse<any, any> | null,
    isClean: boolean
  ) => {
    const topData = response?.data;
    if (topData == null) {
      return;
    }

    const { code, msg, data } = topData;
    if (code != 0) {
      DialogUtils.showError(`${msg}`);
      return;
    }

    const { list, goods, details } = data;
    if (list === null || list === undefined) {
      // DialogUtils.showSuccess(`No orders`);
      return;
    }

    // 订单接口成功
    // CLOG.info(JSON.stringify(data));

    // 解析商品信息
    const orderListWithGoods = list.map((item: OrderItemType) => {
      let tempItem = { ...item };
      const goodsItem: GoodsItemType[] = goods[`${item.id}`];
      tempItem.goods = goodsItem;
      return tempItem;
    });

    if (isClean) {
      const items = [...orderListWithGoods];
      setOrderItems(items);
    } else {
      const items = [...orderItems, ...orderListWithGoods];
      setOrderItems(items);
    }
  };

  // 获取订单数据
  const getOrderList = async (isClean: boolean) => {
    setRefreshing(true);

    try {
      const response = await orderListInterface(pageIndex, PageSize, status);
      orderListSuccess(response, isClean);
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
    getOrderList(pageIndex <= 1);
  }, [pageIndex]);

  useEffect(() => {
    // getOrderList(true);
  }, []);

  // 页面可见时
  useFocusEffect(
    useCallback(() => {
      getOrderList(pageIndex <= 1);
    }, [])
  );

  return (
    <FlashList
      ListEmptyComponent={MyOrderEmptyView}
      data={orderItems}
      // data={mockOrderList}
      renderItem={OrderItemView}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1} // 触发加载更多的阈值
      estimatedItemSize={300}
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
  );
};

// 订单item
const OrderItemView = ({ item }: { item: OrderItemType }) => {
  const { goods } = item;
  let goodInfo: GoodsItemType | null = null;
  // 获取订单追踪第一条记录
  if (goods !== null && goods !== undefined) {
    if (goods.length > 0) {
      const [lastValue] = goods.slice(-1);
      goodInfo = lastValue;
    }
  }

  return (
    <Pressable
      style={{
        marginVertical: 5,
        marginHorizontal: 20,
        height: 160,
        // backgroundColor: "green",
      }}
      onPress={() => {
        // CLOG.info({ order_id: item.id });
        router.push({
          pathname: "/order/[order_id]",
          params: { order_id: item.id },
        });
      }}
    >
      <ImageBackground
        style={{ width: "100%", height: "100%" }}
        source={require("@/assets/images/order/order_background.png")}
        contentFit="contain"
      >
        <View
          style={{
            flex: 1,
            borderRadius: 25,
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            // backgroundColor: "green",
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: windowWidth * 0.35,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: "red",
            }}
          >
            <Image
              source={formatImageUrl(goodInfo?.pic)}
              placeholder={require("@/assets/images/shop/shop_default_icon.png")}
              style={{ width: 90, height: 90 }}
              contentFit="contain"
              placeholderContentFit="contain"
            />
            {/* <Image
              source={require("@/assets/images/shop/shop_default_icon.png")}
              style={{ width: 90, height: 90 }}
              contentFit="contain"
            /> */}
          </View>
          {/* <View style={{ position: "absolute", right: 20, top: 60 }}>
            <Image
              source={require("@/assets/images/mine/right_arrow.png")}
              style={{ width: 7, height: 7 / 0.66 }}
              contentFit="contain"
            />
          </View> */}
          <View
            style={{ position: "absolute", left: "40%", top: 20, right: 25 }}
          >
            <Text
              style={{
                fontFamily: Squealt3Regular,
                fontSize: 16,
                color: "white",
                marginBottom: 5,
              }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {formatOrderStatus(item.status)}
            </Text>

            {goods &&
              goods.map((e, index) => {
                if (index > 2) {
                  return null;
                }
                return (
                  <View
                    key={`${index}`}
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      // width: "40%",
                      // backgroundColor: "red",
                      // marginRight: 10,
                      marginTop: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 13,
                        color: "rgb(84,84,84)",
                        // flex: 1,
                        textAlign: "left",
                        // maxWidth: "30%",
                      }}
                      ellipsizeMode={"tail"}
                      numberOfLines={1}
                    >
                      {e?.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 13,
                        color: "rgb(84,84,84)",
                        // marginLeft: 5,
                        // flex: 1,
                      }}
                    >{`* ${e.payNumber}`}</Text>
                  </View>
                );
              })}
          </View>

          <View
            style={{
              position: "absolute",
              left: "40%",
              bottom: 20,
              right: 25,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: Squealt3Regular,
                fontSize: 13,
                color: "rgb(84,84,84)",
                marginRight: 10,
              }}
            >
              Subtotal
            </Text>
            <Text
              style={{
                fontFamily: Squealt3Regular,
                fontSize: 13,
                color: "white",
              }}
            >
              {formatMoney(`$${item.orderMoney}`)} PFF
            </Text>
          </View>
          {/* </BackgroundView> */}
        </View>
      </ImageBackground>
      {/* </HorizonBackgroundView> */}
    </Pressable>
  );
};

// 空Node占位
const MyOrderEmptyView = () => {
  return (
    <View
      style={{
        width: "100%",
        height: windowHeight * 0.7,
        flex: 1,
        // backgroundColor: "green",
        justifyContent: "flex-start",
      }}
    >
      <View
        style={{
          margin: 20,
          // backgroundColor: "green",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: windowWidth * 0.6, height: windowWidth * 0.6 }}
          source={require("@/assets/images/order/order_empty.png")}
          contentFit="contain"
        ></Image>
      </View>
      <View style={{ justifyContent: "center", flexDirection: "row" }}>
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 14,
            color: buttonGray150Color,
            // marginLeft: 20,
            // marginTop: 35,
            fontWeight: "bold",
            // marginTop: 5,
          }}
        >
          There is nothing!
        </Text>
      </View>
    </View>
  );
};

// const mockOrderList: OrderItemType[] = [
//   {
//     id: 1,
//     orderNum: 0,
//     userId: 0,
//     userAddressId: 0,
//     payMoney: "300000000",
//     orderMoney: "300000000",
//     status: 0,
//     hash: "Shipping",
//     from: "string",
//     to: "string",
//     deliveryNo: "string",
//     remark: "string",
//     payTime: 0,
//     billingAddress: "string",
//     shippingAddress: "string",
//     createdAt: "null",
//     updatedAt: "null",
//     finishTime: 1,
//   },
//   {
//     id: 2,
//     orderNum: 0,
//     userId: 0,
//     userAddressId: 0,
//     payMoney: "300000000",
//     orderMoney: "300000000",
//     status: 0,
//     hash: "Order Delivered",
//     from: "string",
//     to: "string",
//     deliveryNo: "string",
//     remark: "string",
//     payTime: 0,
//     billingAddress: "string",
//     shippingAddress: "string",
//     createdAt: "null",
//     updatedAt: "null",
//     finishTime: 1,
//   },
//   {
//     id: 3,
//     orderNum: 0,
//     userId: 0,
//     userAddressId: 0,
//     payMoney: "300000000",
//     orderMoney: "300000000",
//     status: 0,
//     hash: "Done",
//     from: "string",
//     to: "string",
//     deliveryNo: "string",
//     remark: "string",
//     payTime: 0,
//     billingAddress: "string",
//     shippingAddress: "string",
//     createdAt: "null",
//     updatedAt: "null",
//     finishTime: 1,
//   },
//   {
//     id: 4,
//     orderNum: 0,
//     userId: 0,
//     userAddressId: 0,
//     payMoney: "300000000",
//     orderMoney: "300000000",
//     status: 0,
//     hash: "Shipping",
//     from: "string",
//     to: "string",
//     deliveryNo: "string",
//     remark: "string",
//     payTime: 0,
//     billingAddress: "string",
//     shippingAddress: "string",
//     createdAt: "null",
//     updatedAt: "null",
//     finishTime: 1,
//   },
//   {
//     id: 5,
//     orderNum: 0,
//     userId: 0,
//     userAddressId: 0,
//     payMoney: "300000000",
//     orderMoney: "300000000",
//     status: 0,
//     hash: "Shipping",
//     from: "string",
//     to: "string",
//     deliveryNo: "string",
//     remark: "string",
//     payTime: 0,
//     billingAddress: "string",
//     shippingAddress: "string",
//     createdAt: "null",
//     updatedAt: "null",
//     finishTime: 1,
//   },
// ];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
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
    marginLeft: "80%",
  },
  card: {
    height: 180,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconImage: {
    width: "100%",
    height: "100%",
    // width: 80,
    // height: 100,
    flex: 1,
    margin: 0,
  },
  topItem: {
    position: "absolute",
    left: 20,
    alignContent: "flex-start",
    alignItems: "flex-start",
    top: 20,
  },
  bottomItem: {
    position: "absolute",
    alignContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgb(86,28,29)",
    flex: 1,
    width: "100%",
    height: 60,
    // bottom: -20,
    top: 240,
    right: 0,
    left: 0,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "black",
    // height: 130,
    // marginBottom: 10,
  },
  defaultIcon: {
    width: 80,
    height: 80,
  },
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headerSubIcon: {
    width: 20,
    height: 20,
  },
  headerSelected: {
    height: 40,
    bottom: 0,
    margin: 10,
    fontSize: 14,
    // flex: 1,
  },
  headerUnSelected: {
    height: 40,
    bottom: 0,
    margin: 10,
    backgroundColor: "rgb(20,20,20)",
    fontSize: 14,
    flex: 1,
  },
  pagerView: {
    flex: 1,
    width: "100%",
    // height: "300",
    // backgroundColor: "black",
  },
  addFriendContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 40,
    backgroundColor: "red",
    borderRadius: 12,
    margin: 10,
  },
  orderCard: {
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
    // flex: 2,
    alignItems: "flex-start",
    justifyContent: "center",
    // backgroundColor: "red",
    // marginTop: -10,
  },
  rightContainer: {
    // marginTop: -30,

    // position: "absolute",
    // left: "40%",
    // alignContent: "flex-start",
    // alignItems: "center",
    // top: 20,
    backgroundColor: "green",
    // flex: 3,
  },
  rightBottom: {
    position: "absolute",
    right: 15,
    bottom: 20,
  },
});
