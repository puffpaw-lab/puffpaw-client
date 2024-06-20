import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";

import React, { PropsWithChildren, useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";
import { buttonBgColor, Colors } from "@/constants/Colors";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Squealt3Regular } from "@/constants/FontUtils";
import { AxiosResponse } from "axios";
import { DialogUtils } from "@/constants/DialogUtils";
import {
  cardGoodsListInterface,
  orderDetailInterface,
} from "@/constants/HttpUtils";
import {
  GoodsItemType,
  OrderDetailItemType,
  OrderItemType,
} from "@/constants/ViewProps";

export default function detailScreen() {
  // 参数
  const { order_id, extra, other } = useLocalSearchParams<{
    order_id: string;
    extra?: string;
    other?: string;
  }>();

  const [visible, setVisible] = React.useState(false);
  const [buttonEnable, setButtonEnable] = React.useState(true);
  const hideDialog = () => setVisible(false);
  const [refreshing, setRefreshing] = useState(false);
  const [orderItem, setOrderItem] = useState<OrderItemType | null>(null);
  const [orderDetailItem, setOrderDetailItem] = useState<
    OrderDetailItemType[] | null
  >(null);
  const [goodsItems, setGoodsItems] = useState<GoodsItemType[]>([]);

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

    const { depinOrder, depinOrderDetail, depinGoods } = data;
    if (depinOrder == null) {
      DialogUtils.showSuccess(`No cart goods`);
    }

    // 订单详情接口成功
    // console.log(JSON.stringify(data));
    setOrderDetailItem(depinOrderDetail);
    setGoodsItems(depinGoods);
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

  // 创建订单事件
  const createOrderEvent = () => {
    // createOrderInfo();
  };

  // 拉取接口
  useEffect(() => {
    getOrderDetailInfo();
  }, []);

  return (
    // <PaperProvider>
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black" }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title: `Order Detail ${order_id}`,
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
        style={styles.commonBGImage}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <ScrollView style={styles.scrollView}>
          <EditCardView></EditCardView>
          <TrackingCardView></TrackingCardView>
          <OrderStatusView></OrderStatusView>
          <OrderDetailView
            leftTitle="Order #"
            rightTitle={`${orderItem?.orderNum}`}
          ></OrderDetailView>
          <OrderDetailView
            leftTitle="Worth"
            rightTitle={`${orderItem?.payMoney}`}
          ></OrderDetailView>
          <OrderDetailView
            leftTitle="Amount"
            rightTitle={`${orderItem?.payMoney}`}
          ></OrderDetailView>
          <OrderDetailView
            leftTitle="Total worth"
            rightTitle={`${orderItem?.orderMoney}`}
          ></OrderDetailView>
          <OrderDetailView
            leftTitle="Order time"
            rightTitle={`${orderItem?.createdAt}`}
          ></OrderDetailView>
          <OrderDetailView
            leftTitle="Payment time"
            rightTitle={`${orderItem?.payTime}`}
          ></OrderDetailView>

          <Pressable
            onPress={() => {
              setVisible(!visible);
            }}
          >
            <View
              style={{
                marginVertical: 40,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "red", flex: 1 }}>
                Any question about this order? {">"}
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </BackgroundView>

      <Pressable onPress={createOrderEvent}>
        <View
          style={{
            height: 50,
            backgroundColor: buttonEnable ? buttonBgColor : "gray",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 20,
            borderRadius: 25,
          }}
        >
          <View
            style={{
              // backgroundColor: "yellow",
              // width: "90%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: Squealt3Regular,
                color: "white",
                fontSize: 18,
              }}
            >
              Confirm Receipt
            </Text>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
    // </PaperProvider>
  );
}

type Props = PropsWithChildren<{
  leftTitle: string;
  rightTitle: string;
}>;

const OrderDetailView = (item: Props) => {
  return (
    <View style={styles.orderDetailItem}>
      <Text style={styles.orderDetailLeft}>{item.leftTitle}</Text>
      <View style={{ flex: 1 }}></View>
      <Text style={styles.orderDetailRight}>{item.rightTitle}</Text>
    </View>
  );
};

const ConfirmButton = () => {
  return null;

  // return (
  //   <View
  //     style={{
  //       // marginHorizontal: 30,
  //       justifyContent: "center",
  //       alignContent: "center",
  //       alignItems: "center",
  //       // backgroundColor: "red",
  //     }}
  //   >
  //     <View
  //       style={{
  //         marginHorizontal: 20,
  //         backgroundColor: "red",
  //         justifyContent: "center",
  //         alignContent: "center",
  //         alignItems: "center",
  //         height: 45,
  //         width: "90%",
  //         borderRadius: 20,
  //       }}
  //     >
  //       <Text style={{ color: "black", fontSize: 16 }}>Confirm Receipt</Text>
  //     </View>
  //   </View>
  // );
};

const EditCardView = () => {
  return (
    <Pressable
      onPress={() => {
        router.push("/address/add");
      }}
    >
      <HorizonBackgroundView
        style={{ ...styles.topCard, height: "auto", width: "auto" }}
      >
        <View style={{ ...styles.leftContainer, margin: 20 }}>
          <Text style={{ color: "white", fontSize: 14 }}>
            DAVID STAR +(212)555-0100
          </Text>
          <Text style={{ color: "white", fontSize: 14 }}>350 5th Ave</Text>
          <Text style={{ color: "white", fontSize: 14 }}>
            New York, NY 10018
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.editTitle}>Edit</Text>
          <Image
            source={require("@/assets/images/mine/right_arrow.png")}
            style={styles.goodsItemArrow}
          ></Image>
        </View>
      </HorizonBackgroundView>
    </Pressable>
  );
};

const TrackingCardView = () => {
  return (
    <Pressable
      onPress={() => {
        router.push("/order/tracking");
      }}
    >
      <View
        style={{
          ...styles.topCard,
          height: "auto",
          width: "auto",
          backgroundColor: "rgb(30,30,30)",
        }}
      >
        <View style={{ ...styles.leftContainer, margin: 20 }}>
          <Text style={{ color: "white", fontSize: 16, marginVertical: 20 }}>
            Order Tracking
          </Text>
          <Text style={{ color: "gray", fontSize: 14 }}>
            DAVID STAR +(212)555-0100
          </Text>

          <Text style={{ color: "gray", fontSize: 14 }}>
            Package arrived at an Amazon facility Swanton, Ohio US
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.editTitle}>{"      "}</Text>
          <Image
            source={require("@/assets/images/mine/right_arrow.png")}
            style={styles.goodsItemArrow}
          ></Image>
        </View>
      </View>
    </Pressable>
  );
};

const OrderStatusView = () => {
  return (
    <HorizonBackgroundView
      linearColors={[Colors.dark.leftLightLinear, Colors.dark.righLightLinear]}
      style={{ ...styles.centerCard, height: "auto", width: "auto" }}
    >
      <View style={styles.leftCardContainer}>
        <Image
          source={require("@/assets/images/shop/goods_icon.png")}
          style={styles.cardIconImage}
        />
      </View>
      <View style={styles.rightCardContainer}>
        <Text style={{ color: "white" }}>Order finished</Text>
        <Text style={{ color: "gray" }}>1.8% NICO</Text>
      </View>
      <View style={styles.rightBottom}>
        <Text style={{ color: "gray", marginLeft: 20 }}>300000000 Worth</Text>
      </View>
      {/* <View style={styles.arrowButton}>
      <Image
        source={require("@/assets/images/shop/goods_item_arrow.png")}
        style={styles.goodsItemArrow}
      ></Image>
    </View> */}
      {/* </ImageBackground> */}
    </HorizonBackgroundView>
  );
};

const ConfirmModelView = () => {
  return (
    // <View style={{ flex: 1 }}>
    <BackgroundView style={{}} x={"0%"} y={"100%"} rx={"50%"} ry={"50%"}>
      <Text style={{ color: "red" }}>sdfjslkdfj</Text>
      <Text>sdfjslkdfj</Text>
      <Text>sdfjslkdfj</Text>
      <Text>sdfjslkdfj</Text>
    </BackgroundView>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
  },
  scrollView: { flex: 1, backgroundColor: "black" },
  logo: {
    width: 60,
    height: 30,
    position: "absolute",
    marginTop: 30,
    right: 20,
  },
  topCard: {
    // width: "100%",
    height: 80,
    // marginLeft: 10,
    // marginRight: 10,
    // margin: 5,
    // width: "100%",
    // backgroundColor: "rgb(86,28,29)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 20,
    flex: 1,
    borderColor: "rgb(50,50,50)",
    // borderWidth: 1,
    top: 10,
    marginBottom: 20,
    margin: 10,
    // left: 10,
    // right: 10,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sectionContainer: {
    // position: "absolute",
    left: 0,
    alignContent: "center",
    alignItems: "flex-start",
    // backgroundColor: "rgb(20,20,20)",
    height: 25,
    color: "white",
    marginTop: 20,
  },
  sectionTitle: {
    // position: "absolute",
    left: 20,
    alignContent: "center",
    alignItems: "flex-start",
    marginTop: 5,
    // backgroundColor: "rgb(20,20,20)",
    height: 30,
    color: "white",
    fontSize: 14,
  },
  leftContainer: {
    // position: "absolute",
    alignContent: "center",
    alignItems: "flex-start",
    // backgroundColor: "green",
    flex: 5,
    // height: 80,
  },
  leftTitle: {
    top: 5,
    left: 15,
    // backgroundColor: "rgb(20,20,20)",
    // height: 30,
    color: "white",
    fontSize: 14,
  },
  editTitle: {
    // top: 15,
    // left: 15,
    // backgroundColor: "rgb(20,20,20)",
    // height: 30,
    color: "white",
    fontSize: 14,
  },
  rightContainer: {
    flex: 1,
    // width: 100,
    height: 30,
    flexDirection: "row",
    alignContent: "flex-end",
    // backgroundColor: "red",
    alignItems: "center",
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
  goodsItemArrow: {
    // flex: 1,
    // top: 17,
    objectFit: "contain",
    width: 15,
    height: 15,
    resizeMode: "contain",
    right: 0,
  },
  headerContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "black",
    height: 120,
  },
  logoutButton: {
    // position: "absolute",
    // width: "60%",
    height: 45,
    // bottom: 0,
    // left: "20%",
  },
  centerCard: {
    // width: "90%",
    height: 130,
    backgroundColor: "rgb(20,20,20)",
    // backgroundColor: "rgb(86,28,29)",
    // top: 10,
    margin: 10,
    marginBottom: 20,
    // left: 20,
    // right: 20,
    borderRadius: 25,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  leftCardContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    // backgroundColor: "red",
    marginTop: -10,
  },
  rightCardContainer: {
    marginTop: -50,
    flex: 2,
  },
  cardIconImage: {
    width: 120,
    height: 120,
  },
  rightBottom: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
  orderDetailItem: {
    // width: "100%",
    marginLeft: 10,
    marginRight: 10,
    height: 25,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  orderDetailLeft: {
    color: "white",
    fontSize: 12,
  },
  orderDetailRight: {
    color: "white",
    fontSize: 12,
  },
  linkButton: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  commonBGImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
});
