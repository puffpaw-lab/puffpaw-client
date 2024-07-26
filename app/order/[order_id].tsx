import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Modal,
  ViewProps,
  ActivityIndicator,
} from "react-native";

import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image, ImageBackground } from "expo-image";
import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";
import { buttonBgColor, buttonGrayBgColor, Colors } from "@/constants/Colors";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { Squealt3Regular } from "@/constants/FontUtils";
import { AxiosResponse } from "axios";
import {
  CustomDialog,
  DialogUtils,
  toastConfig,
} from "@/constants/DialogUtils";
import {
  cardGoodsListInterface,
  orderDetailInterface,
  updateOrderFinishInterface,
  updateOrderInterface,
} from "@/constants/HttpUtils";
import {
  AddressDetailType,
  GoodsItemType,
  OrderDetailItemType,
  OrderItemType,
  OrderTrackingItemType,
} from "@/constants/ViewProps";
import {
  formatLocalTime,
  formatMoney,
  isNetworkEnable,
  parseAddress,
  windowWidth,
} from "@/constants/CommonUtils";
import { TextInput } from "react-native-gesture-handler";
import { usePayHooks } from "@/constants/ChainUtil";
import { CLOG } from "@/constants/LogUtils";
import Toast from "react-native-toast-message";

export default function detailScreen() {
  // 参数
  const { order_id, extra, other } = useLocalSearchParams<{
    order_id: string;
    extra?: string;
    other?: string;
  }>();

  const { pay, checkPuffEnough } = usePayHooks();

  const [confirmVisible, setConfirmVisible] = useState(false);

  const [visible, setVisible] = React.useState(false);
  const [buttonEnable, setButtonEnable] = React.useState(true);
  const hideDialog = () => setVisible(false);
  const [refreshing, setRefreshing] = useState(false);
  const [orderItem, setOrderItem] = useState<OrderItemType | null>(null);
  const [orderDetailItem, setOrderDetailItem] = useState<
    OrderDetailItemType[] | null
  >(null);
  const [goodsItems, setGoodsItems] = useState<GoodsItemType[]>([]);
  const [trackingItem, setTrackingItem] =
    useState<OrderTrackingItemType | null>(null); // 第一条追踪数据

  const [paying, setPaying] = React.useState(false); // 支付中

  // 用户shippingAddress地址信息
  const [shippingAddress, setShippingAddress] =
    useState<AddressDetailType | null>(null);

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

    const { depinOrder, depinOrderDetail, depinGoods, log } = data;
    if (depinOrder == null) {
      DialogUtils.showSuccess(`No cart goods`);
    }

    // 获取订单追踪最后一条记录
    if (log !== null && log !== undefined) {
      if (log.length > 0) {
        const [lastValue] = log.slice(-1);
        setTrackingItem(lastValue);
      }
    }

    const tempGoodsItems = Object.values<GoodsItemType>(depinGoods);

    // 订单详情接口成功
    // CLOG.info(JSON.stringify(data));
    setOrderDetailItem(depinOrderDetail);
    setGoodsItems(tempGoodsItems);
    setOrderItem(depinOrder);

    const { shippingAddress } = depinOrder;

    if (
      shippingAddress === null ||
      shippingAddress === undefined ||
      shippingAddress === ""
    ) {
    } else {
      const sAddress = parseAddress(shippingAddress);
      if (sAddress) setShippingAddress(sAddress);
    }
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

  // 订单支付中
  const payingReceiptInfo = async () => {
    setRefreshing(true);

    try {
      const response = await updateOrderInterface(parseInt(order_id ?? "0"));
      confirmReceiptSuccess(response);
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };

  // 确认订单信息
  const confirmReceiptInfo = async () => {
    setRefreshing(true);

    try {
      const response = await updateOrderFinishInterface(
        parseInt(order_id ?? "0")
      );
      confirmReceiptSuccess(response);
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };

  // 确认订单成功
  const confirmReceiptSuccess = (response: AxiosResponse<any, any> | null) => {
    const topData = response?.data;
    if (topData == null) {
      return;
    }

    const { code, msg, data } = topData;
    if (code != 0) {
      DialogUtils.showError(`${msg}`);
      return;
    }

    const { isUpdate } = data;
    if (isUpdate === 1) {
      DialogUtils.showSuccess(`Update order success`);

      // 重新请求订单状态
      getOrderDetailInfo();
    }
  };

  // 确认
  const onConfirmReceiptEvent = () => {
    setConfirmVisible(false);

    // 更新订单信息
    confirmReceiptInfo();
  };

  // 确认
  const onPayEvent = async () => {
    if (orderItem === undefined || orderItem === null) {
      return;
    }

    const { orderMoney, orderNum } = orderItem;
    if (orderNum === null || orderMoney === null) {
      return;
    }

    // 检测网络状态
    const networkEnable = await isNetworkEnable();
    if (!networkEnable) {
      DialogUtils.showError("Network not enable");
      return;
    }

    if (paying) {
      return;
    }

    setPaying(true);

    try {
      // 检查余额是否足够
      const checkPuffEnoughResult = await checkPuffEnough(
        parseFloat(orderMoney)
      );
      if (!checkPuffEnoughResult) {
        return;
      }

      // 支付方法
      const payResult = await pay(orderNum, parseFloat(orderMoney)); // parseFloat(orderMoney)
      CLOG.info(`支付结果: ${payResult}`);

      if (payResult !== undefined && payResult !== null && payResult !== "") {
        DialogUtils.showSuccess("Pay success");

        // 修改订单支付状态
        await payingReceiptInfo();

        // router.replace("/order/payment_done");
      } else {
        DialogUtils.showError("Pay failed");
      }
    } catch (e) {
      CLOG.info(`支付状态: ${e}`);
      DialogUtils.showError(`Pay failed: ${e}`);
    } finally {
      setPaying(false);
    }
  };

  // 获取商品名称
  const _getGoodsNameById = (id: number | null) => {
    const tempDatas = goodsItems.filter((e) => {
      if (e.id === id) return e;
    });

    CLOG.info(tempDatas);
    return tempDatas && tempDatas.length > 0 ? tempDatas[0].name : null;
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
          title: `Order Details`,
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
        style={styles.commonBGImage}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <ScrollView style={styles.scrollView}>
          {/* <EditCardView></EditCardView> */}
          <Pressable
            onPress={() => {
              // router.push("/address/add");
            }}
          >
            <HorizonBackgroundView
              style={{ ...styles.topCard, height: "auto", width: "auto" }}
            >
              <View
                style={{
                  ...styles.leftContainer,
                  paddingHorizontal: 25,
                  paddingVertical: 20,
                }}
              >
                <Text style={{ color: "white", fontSize: 14 }}>
                  {/* DAVID STAR +(212)555-0100 */}
                  {shippingAddress &&
                    `${shippingAddress?.firstName} ${shippingAddress?.lastName} ${shippingAddress?.phone}`}
                </Text>
                <Text style={{ color: "white", fontSize: 14 }}>
                  {/* 350 5th Ave */}
                  {shippingAddress && `${shippingAddress?.address}`}
                </Text>
                <Text style={{ color: "white", fontSize: 14 }}>
                  {/* New York, NY 10018 */}
                  {shippingAddress &&
                    `${shippingAddress?.city} ${shippingAddress?.country} ${shippingAddress?.postCode}`}
                </Text>
              </View>
            </HorizonBackgroundView>
          </Pressable>

          <TrackingCardView
            orderId={order_id}
            trackingItem={trackingItem}
          ></TrackingCardView>
          {/* <OrderStatusView></OrderStatusView> */}
          <OrderDetailView
            key={"Order List"}
            leftTitle="Order List"
            rightTitle={``}
            color="rgb(170,170,170)"
          ></OrderDetailView>

          {orderDetailItem &&
            orderDetailItem.map((item, index) => (
              <OrderDetailView
                key={`${item.orderId}${index}`}
                leftTitle={`${_getGoodsNameById(item.goodsId)}`}
                rightTitle={`${formatMoney(item.price)} PFF  x ${
                  item.payNumber
                }`}
                color="rgb(170,170,170)"
              ></OrderDetailView>
            ))}

          {/* <OrderDetailView
            leftTitle="Green Grape Flavor"
            rightTitle={`x 1`}
            color="rgb(170,170,170)"
          ></OrderDetailView>
          <OrderDetailView
            leftTitle="Coke Flavor"
            rightTitle={`x 2`}
            color="rgb(170,170,170)"
          ></OrderDetailView> */}
          <OrderDetailView
            key={"Order #"}
            leftTitle="Order #"
            rightTitle={`${orderItem?.orderNum}`}
            color="rgb(120,120,120)"
          ></OrderDetailView>
          <OrderDetailView
            key={"Total price"}
            leftTitle="Total price"
            rightTitle={`${formatMoney(orderItem?.orderMoney ?? "")} PFF`}
            color="rgb(120,120,120)"
          ></OrderDetailView>
          <OrderDetailView
            key={"Order time"}
            leftTitle="Order time"
            rightTitle={formatLocalTime(orderItem?.createTime)}
            color="rgb(120,120,120)"
          ></OrderDetailView>
          <OrderDetailView
            key={"Payment time"}
            leftTitle="Payment time"
            rightTitle={formatLocalTime(orderItem?.payTime)}
            color="rgb(120,120,120)"
          ></OrderDetailView>

          <Pressable
            onPress={() => {
              setVisible(!visible);
            }}
          >
            <View
              style={{
                marginTop: 50,
                marginBottom: 50,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  color: buttonBgColor,
                  fontFamily: Squealt3Regular,
                  fontSize: 14,
                }}
              >
                Any question? Find us on discord
              </Text>
              <Image
                source={require("@/assets/images/order/question_right_arrow.png")}
                style={{ width: 11, height: 11 }}
                contentFit="contain"
              />
            </View>
          </Pressable>
        </ScrollView>
      </BackgroundView>

      {/* 支付订单 */}
      {orderItem !== null &&
        orderItem !== undefined &&
        orderItem?.status === 0 && (
          <Pressable onPress={onPayEvent}>
            <View
              style={{
                height: 50,
                backgroundColor: buttonEnable ? buttonBgColor : "gray",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginHorizontal: 20,
                borderRadius: 25,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  // backgroundColor: "yellow",
                  // width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {paying && (
                  <ActivityIndicator
                    style={{ marginRight: 10 }}
                    color={"white"}
                  ></ActivityIndicator>
                )}
                <Text
                  style={{
                    fontFamily: Squealt3Regular,
                    color: "white",
                    fontSize: 18,
                  }}
                >
                  Pay now
                </Text>
              </View>
            </View>
          </Pressable>
        )}

      {/* 确认订单 */}
      {orderItem !== null &&
        orderItem !== undefined &&
        orderItem?.status === 3 && (
          <Pressable
            onPress={() => {
              setConfirmVisible(true);
            }}
          >
            <View
              style={{
                height: 50,
                backgroundColor: buttonEnable ? buttonBgColor : "gray",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginHorizontal: 20,
                borderRadius: 25,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  // backgroundColor: "yellow",
                  // width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: Squealt3Regular,
                    color: "white",
                    fontSize: 18,
                  }}
                >
                  Confirm receipt
                </Text>
              </View>
            </View>
          </Pressable>
        )}

      {/* 创建钱包页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmVisible}
        onRequestClose={() => {
          setConfirmVisible(!confirmVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // marginTop: 22,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View style={{ width: 300, height: 160 / (427.0 / 470) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Image
                  style={{ width: 35 * 1.2, height: 27 * 1.2 }}
                  contentFit="contain"
                  source={require("@/assets/images/common/dialog_logo.png")}
                  // style={styles.centeredView1}
                ></Image>
              </View>

              {/* 文本内容 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 14,
                  color: "white",
                  textAlign: "center",
                  marginTop: 30,
                }}
              >
                Confirm receipt?
              </Text>

              {/* 操作按钮 */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 25,
                  marginBottom: 30,
                  paddingHorizontal: 20,
                  // backgroundColor: "green",
                }}
              >
                <Pressable
                  onPress={onConfirmReceiptEvent}
                  style={{
                    flex: 1,
                    backgroundColor: buttonBgColor,
                    borderRadius: 15,
                    height: 30,
                    width: "40%",
                    // marginRight: 3,
                    // marginLeft: 30,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Yes
                  </Text>
                </Pressable>
                <View style={{ width: 15 }}></View>
                <Pressable
                  onPress={() => setConfirmVisible(false)}
                  style={{
                    flex: 1,
                    backgroundColor: buttonGrayBgColor,
                    borderRadius: 15,
                    height: 30,
                    width: "40%",
                    // marginRight: 30,
                    // marginLeft: 3,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: buttonBgColor,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </View>
        <CustomDialog />
      </Modal>
    </SafeAreaView>
    // </PaperProvider>
  );
}

type Props = PropsWithChildren<{
  leftTitle: string;
  rightTitle: string;
  color: string;
}>;

const OrderDetailView = (item: Props) => {
  return (
    <View style={styles.orderDetailItem}>
      <Text
        style={[
          styles.orderDetailLeft,
          { color: item.color, flex: 1, textAlign: "left" },
        ]}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {item.leftTitle}
      </Text>
      <Text
        style={[
          styles.orderDetailRight,
          { color: item.color, flex: 1, textAlign: "right" },
        ]}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {item.rightTitle}
      </Text>
    </View>
  );
};

type TrackItemProps = ViewProps & {
  orderId: string | null | undefined;
  trackingItem: OrderTrackingItemType | null;
};

const TrackingCardView = ({ orderId, trackingItem }: TrackItemProps) => {
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/order/tracking",
          params: {
            order_id: orderId,
          },
        });
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
        <View
          style={{
            ...styles.leftContainer,
            marginHorizontal: 25,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "white",
              fontSize: 16,
              marginVertical: 15,
            }}
          >
            Order Tracking
          </Text>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "rgb(181,181,181)",
              fontSize: 14,
            }}
          >
            {/* Monday, April 24 */}
            {formatLocalTime(trackingItem?.createTime)}
          </Text>

          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "rgb(121,121,121)",
              fontSize: 14,
            }}
          >
            {/* Package arrived at an Amazon facility. */}
            {trackingItem?.detail}
          </Text>
          {/* <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "rgb(121,121,121)",
              fontSize: 13,
            }}
          >
            Swanton, Ohio US
          </Text> */}
        </View>

        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            height: "100%",
            width: 40,
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/mine/right_arrow.png")}
            style={{ width: 7, height: 7 / 0.66 }}
            contentFit="contain"
          />
        </View>
      </View>
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
  scrollView: {
    flex: 1,
    backgroundColor: "black",
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
  },
  logo: {
    width: 60,
    height: 30,
    position: "absolute",
    marginTop: 30,
    right: 20,
  },
  topCard: {
    // width: "100%",
    // height: 80,
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
    // top: 10,
    marginTop: 10,
    marginBottom: 10,
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
    // height: 25,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 15,
  },
  orderDetailLeft: {
    color: "rgb(170,170,170)",
    fontSize: 12,
  },
  orderDetailRight: {
    color: "rgb(117,117,117)",
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
