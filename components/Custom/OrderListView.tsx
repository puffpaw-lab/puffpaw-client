import {
  Image,
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
  useEffect,
  useState,
} from "react";
import { router, Stack, useRouter } from "expo-router";

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

import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";

// import { Searchbar } from "react-native-elements";
import { Divider, SearchBar } from "@rneui/themed";
import { buttonBgColor } from "@/constants/Colors";
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
  const [pageIndex, setPageIndex] = useState(0);

  const onRefresh = React.useCallback(() => {
    setPageIndex(0);
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

    const { list } = data;
    if (list == null) {
      DialogUtils.showSuccess(`No orders`);
      return;
    }

    // 订单接口成功
    // console.log(JSON.stringify(data));

    if (isClean) {
      const items = [...list];
      setOrderItems(items);
    } else {
      const items = [...orderItems, ...list];
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
      getOrderList(false);
    }
  };

  useEffect(() => {
    // getGoodsList(false);
  }, []);

  return (
    <FlashList
      ListEmptyComponent={ListEmptyView}
      data={orderItems}
      renderItem={OrderItemView}
      // keyExtractor={(item) => `${item.id}`}
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
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/order/[order_id]",
          params: { order_id: item.id },
        });
      }}
    >
      <HorizonBackgroundView
        // style={styles.card}
        style={{ ...styles.orderCard }}
        // start={{ x: 0, y: 0 }}
        // end={{ x: 1, y: 0 }}
        // colors={["#4c329f", "#3b1398", "#19236a"]}
      >
        {/* <View style={styles.card}> */}
        <View style={styles.leftContainer}>
          <Image
            source={require("@/assets/images/shop/goods_icon.png")}
            style={styles.cardIconImage}
          />
        </View>
        <View style={styles.rightContainer}>
          <Text style={{ color: "white" }}>{`OrderNum: ${item.orderNum}`}</Text>
          <Text style={{ color: "gray" }}>1.8% NICO</Text>
          <Text style={{ color: "gray" }}>30 PUFF</Text>
        </View>

        <View style={styles.rightBottom}>
          <Text style={{ color: "gray", marginLeft: 20 }}>
            {`${item.orderMoney}`} Worth
          </Text>
        </View>
      </HorizonBackgroundView>
    </Pressable>
  );
};

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
  rightBottom: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
});
