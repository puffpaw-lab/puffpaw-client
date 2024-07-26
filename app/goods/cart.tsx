import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  ViewProps,
  ActivityIndicator,
} from "react-native";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { Button, Divider } from "@rneui/base";
import { useMMKVObject } from "react-native-mmkv";
import { ConstantStorage, LocalCartInfo } from "@/constants/LocalStorage";
import { FloatCartView } from "@/components/Custom/FloatCartView";
import { buttonBgColor, Colors } from "@/constants/Colors";
import {
  formatImageUrl,
  formatMoney,
  isNetworkEnable,
  parseAddress,
} from "@/constants/CommonUtils";
import { Image, ImageBackground } from "expo-image";
import { Squealt3Regular } from "@/constants/FontUtils";
import { HorizonBackgroundView } from "@/components/Custom/BackgroundView";
import {
  AddressDetailType,
  AddressItemType,
  CreateOrderItemType,
  GoodsItemType,
  LoginFunction,
} from "@/constants/ViewProps";
import { AxiosResponse } from "axios";
import { DialogUtils } from "@/constants/DialogUtils";
import {
  addAddressInterface,
  addressListInterface,
  cardGoodsListInterface,
  createOrderInterface,
  goodsInfoInterface,
  updateAddressInterface,
  updateOrderInterface,
} from "@/constants/HttpUtils";
import * as Crypto from "expo-crypto";
import { usePayHooks } from "@/constants/ChainUtil";
import { CLOG } from "@/constants/LogUtils";

// 购物车
export default function cartScreen() {
  const router = useRouter();
  const { pay, checkPuffEnough } = usePayHooks();

  // 购物车信息
  const [localCartList, setLocalCartList] = useMMKVObject<LocalCartInfo[]>(
    ConstantStorage.cartInfo
  );

  const [refreshing, setRefreshing] = useState(false);
  const [goodsItems, setGoodsItems] = useState<GoodsItemType[] | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [buttonEnable, setButtonEnable] = useState(
    (localCartList != undefined && localCartList?.length > 0) ?? false
  );

  const [addressId, setAddressId] = React.useState<number | null>(null);

  // 用户shippingAddress地址信息
  const [shippingAddress, setShippingAddress] =
    useState<AddressDetailType | null>(null);

  // 用户billingAddress地址信息
  const [billingAddress, setBillingAddress] =
    useState<AddressDetailType | null>(null);

  const [paying, setPaying] = React.useState(false); // 支付中

  // 获取单条数量
  const getItemNumber = (goodsItem: GoodsItemType): number => {
    let itemNumber = 0;
    if (localCartList) {
      localCartList.map((e) => {
        if (e && e.goodsId == goodsItem.id) {
          itemNumber = e.goodsNumber;
        }
      });
    }

    return itemNumber;
  };

  // 商品信息成功
  const goodsInfoSuccess = (response: AxiosResponse<any, any> | null) => {
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
      DialogUtils.showSuccess(`No cart goods`);
      return;
    }

    // 商品接口成功
    setGoodsItems(list);
  };

  // 获取商品数据
  const getCartGoodsInfo = async () => {
    // 生成商品id
    let ids: number[] = [];
    if (localCartList) {
      localCartList.map((e) => {
        if (e.goodsId) ids = [...ids, e.goodsId];
      });
    }

    if (ids.length === 0) {
      return;
    }

    setRefreshing(true);

    try {
      const response = await cardGoodsListInterface(ids);
      goodsInfoSuccess(response);
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };

  // 获取地址信息
  const getAddressInfo = async () => {
    try {
      const response = await addressListInterface();
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
        DialogUtils.showSuccess(`No address info`);
        return;
      }

      // 地址接口成功
      // CLOG.info(JSON.stringify(list));

      if (list.length > 0) {
        const address = list[0];
        setAddressId(address.id);

        const {
          // billingAddress,
          shippingAddress,
        } = address;

        // CLOG.info(`shippingAddress = ${shippingAddress}`);
        if (
          shippingAddress === null ||
          shippingAddress === undefined ||
          shippingAddress === ""
        ) {
        } else {
          const sAddress = parseAddress(shippingAddress);
          if (sAddress) setShippingAddress(sAddress);
        }
      }
    } catch (e) {
    } finally {
    }
  };

  // 添加地址信息
  const addAddressInfo = async () => {
    try {
      const response = await addAddressInterface("first address", null);
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
        DialogUtils.showSuccess(`add address error`);
        return;
      }

      // 商品接口成功
      // CLOG.info(JSON.stringify(list));
    } catch (e) {
    } finally {
    }
  };

  // 更新地址信息
  const updateAddressInfo = async () => {
    const shippingItem: AddressDetailType = {
      firstName: "Mr",
      lastName: "Yang",
      phone: "+15652301876",
      phoneCallCode: "",
      country: "China",
      address: "mei lan qu",
      city: "hai kou shi",
      stateOrProvince: "hai nan",
      postCode: "100001",
    };
    const billingItem: AddressDetailType = {
      firstName: "Mr123",
      lastName: "Yang123",
      phone: "+156523018764443",
      phoneCallCode: "",
      country: "China2",
      address: "mei lan qu2",
      city: "hai kou shi3",
      stateOrProvince: "hai nan3",
      postCode: "100001123",
    };

    try {
      const shippingJsonString = JSON.stringify(shippingItem);
      var shipEncodedString = btoa(shippingJsonString);

      const billingJsonString = JSON.stringify(billingItem);
      var billingEncodedString = btoa(billingJsonString);

      const response = await updateAddressInterface(
        3,
        shipEncodedString,
        billingEncodedString
      );
      const topData = response?.data;
      if (topData == null) {
        return;
      }

      const { code, msg, data } = topData;
      if (code != 0) {
        DialogUtils.showError(`${msg}`);
        return;
      }

      const { isupdate } = data;
      if (isupdate == null) {
        DialogUtils.showError(`Update address error`);
        return;
      }

      DialogUtils.showSuccess(`Update address success`);

      // 更新地址接口成功
      // CLOG.info(JSON.stringify(list));
    } catch (e) {
    } finally {
    }
  };

  // 创建订单
  const createOrderInfo = async () => {
    if (!localCartList) {
      return;
    }

    if (addressId === null) {
      DialogUtils.showError("Please select address");
      return;
    }

    // 检测网络状态
    const networkEnable = await isNetworkEnable();
    if (!networkEnable) {
      DialogUtils.showError("Network not enable");
      return;
    }

    const createOrderItem = localCartList.map((e): CreateOrderItemType => {
      const item: CreateOrderItemType = {
        goodsId: e.goodsId,
        payNumber: e.goodsNumber,
      };
      return item;
    });

    if (paying) {
      return;
    }

    let needClean = false;
    setPaying(true);
    try {
      // 检查余额是否足够
      const checkPuffEnoughResult = await checkPuffEnough(totalPrice);
      if (!checkPuffEnoughResult) {
        return;
      }

      const response = await createOrderInterface(addressId, createOrderItem);
      const topData = response?.data;
      // CLOG.info(topData);

      if (topData == null) {
        return;
      }

      const { code, msg, data } = topData;
      if (code != 0) {
        DialogUtils.showError(`${msg}`);
        return;
      }

      const { depinOrders } = data;
      if (depinOrders == null) {
        DialogUtils.showError(`create order error`);
        return;
      }
      const { id, orderNum, orderMoney } = depinOrders;

      // 商品接口成功
      // CLOG.info(JSON.stringify(depinOrders));
      DialogUtils.showSuccess(`create order success ${orderNum}`);
      needClean = true;

      // 支付方法
      const payResult = await pay(orderNum, 1); // parseFloat(orderMoney)
      CLOG.info(`支付结果: ${payResult}`);

      if (payResult !== undefined && payResult !== null && payResult !== "") {
        DialogUtils.showSuccess("Pay success");

        // 修改订单支付状态
        await payingReceiptInfo(id);

        // 1s之后跳转订单详情
        setTimeout(() => {
          router.replace({
            pathname: "/goods/payment_done",
            params: { order_id: id, paySuccess: "1" },
          });
        }, 500);
      } else {
        DialogUtils.showError("Pay failed");

        setTimeout(() => {
          router.replace({
            pathname: "/goods/payment_done",
            params: { order_id: id },
          });
        }, 500);

        // // 1s之后跳转订单详情
        // setTimeout(() => {
        //   router.replace({
        //     pathname: "/order/[order_id]",
        //     params: { order_id: id },
        //   });
        // }, 500);
      }
    } catch (e) {
      CLOG.info(`支付状态: ${e}`);
      DialogUtils.showError(`${e}`);
    } finally {
      if (needClean) {
        setLocalCartList([]);
      }

      setPaying(false);
    }
  };

  // 订单支付中
  const payingReceiptInfo = async (orderId: number) => {
    setRefreshing(true);

    try {
      const response = await updateOrderInterface(orderId);
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
      // DialogUtils.showSuccess(`Update order success`);
    }
  };

  // 增加购物车数量
  const increaceNumber = (item: GoodsItemType) => {
    if (!localCartList) {
      return;
    }

    const tempData = localCartList.map((e) => {
      if (e.goodsId == item.id) {
        e.goodsNumber++;
      }

      return e;
    });

    // CLOG.info(tempData);
    setLocalCartList([...tempData]);
  };

  // 减少购物车数量
  const decreaceNumber = (item: GoodsItemType) => {
    if (!localCartList) {
      return;
    }

    const tempData = localCartList.filter((e) => {
      if (e.goodsId == item.id) {
        e.goodsNumber--;
      }

      // 删除商品
      if (e.goodsNumber <= 0) {
        removeGoodsItem(e.goodsId);
      }

      return e.goodsNumber > 0;
    });

    // CLOG.info(tempData);
    setLocalCartList([...tempData]);

    if (!tempData || tempData.length == 0) {
      router.back();
    }
  };

  // 删除商品
  const removeGoodsItem = (goodsId: number) => {
    if (!goodsItems) {
      return;
    }

    const tempDatas = goodsItems.filter((e) => {
      return goodsId != e.id;
    });

    setGoodsItems(tempDatas);
  };

  // 创建订单事件
  const createOrderEvent = () => {
    createOrderInfo();
    // router.push("goods/payment_done");
  };

  // 更新价格
  useEffect(() => {
    let tempPrice = 0;
    if (goodsItems) {
      goodsItems.map((e) => {
        // 计算总金额
        const { price } = e;
        if (price) {
          const localNumber = getItemNumber(e);
          const itemPrice = parseFloat(price) * localNumber;
          tempPrice += itemPrice;
        }
      });
    }

    setTotalPrice(tempPrice);

    const enable =
      (localCartList != undefined && localCartList?.length > 0) ?? false;
    setButtonEnable(enable);
  }, [goodsItems, localCartList]);

  useEffect(() => {
    if (!localCartList || localCartList?.length === 0) {
      setGoodsItems([]);
    }
  }, [localCartList]);

  // // 地址信息被修改之后更新
  // useEffect(() => {
  //   CLOG.info("地址被修改: 重新请求");
  //   getAddressInfo();
  // }, [updateAddress]);

  // 地址信息被修改之后更新
  useFocusEffect(
    useCallback(() => {
      CLOG.info("返回购物车页面: 重新请求");

      getCartGoodsInfo();
      getAddressInfo();
    }, [])
  );

  // useEffect(() => {
  //   CLOG.info("返回购物车页面: 重新请求");

  //   getCartGoodsInfo();
  //   getAddressInfo();
  // }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black" }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title: `Shopping Cart`,
          headerShadowVisible: true,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: Squealt3Regular,
          },
          headerBackTitleVisible: false,
          headerRight: (props) => <RightLogoView></RightLogoView>,
          headerLeft: (props) => (
            <HeaderLeftBackView
              callback={() => {
                if (router.canGoBack()) router.back();
              }}
            ></HeaderLeftBackView>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: "black", width: "100%", height: "100%" }}
      >
        {goodsItems &&
          goodsItems.length > 0 &&
          goodsItems.map((e) => (
            <GoodsCartItemView
              key={e.id}
              goodItem={e}
              decreaceEvent={() => decreaceNumber(e)}
              increaceEvent={() => increaceNumber(e)}
              itemNumber={() => getItemNumber(e)}
            ></GoodsCartItemView>
          ))}
        <ShippingAddressView
          title={"Shipping address"}
          addressInfo={shippingAddress}
          addressId={addressId}
          addressType={0}
        ></ShippingAddressView>
        {/* <ShippingAddressView
          title={"Billing address"}
          addressInfo={billingAddress}
          addressId={addressId}
          addressType={1}
        ></ShippingAddressView> */}
        {/* {billingAddress && <BillingAddressView ></BillingAddressView>} */}
      </ScrollView>
      <Divider></Divider>
      <OrderDetailView
        leftTitle="Order total:"
        rightTitle={formatMoney(`${totalPrice}`) + " PFF"}
      ></OrderDetailView>
      <Pressable onPress={createOrderEvent}>
        <View
          style={{
            height: 50,
            backgroundColor: buttonEnable ? buttonBgColor : "gray",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 20,
            marginBottom: 10,
            borderRadius: 25,
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
              Pay Now
            </Text>
          </View>
        </View>
      </Pressable>

      {/* <FloatCartView right={20} bottom={70}></FloatCartView> */}
    </SafeAreaView>
  );
}

type OrderDetailProps = PropsWithChildren<{
  leftTitle: string;
  rightTitle: string;
}>;

const OrderDetailView = (item: OrderDetailProps) => {
  return (
    <View style={styles.orderDetailItem}>
      <Text style={styles.orderDetailLeft}>{item.leftTitle}</Text>
      <View style={{ flex: 1 }}></View>
      <Text style={styles.orderDetailRight}>{item.rightTitle}</Text>
    </View>
  );
};

// AddressDetailType | null
export type CartAddressItemProps = ViewProps &
  PropsWithChildren<{
    title: string;
    addressInfo: AddressDetailType | null | undefined;
    addressId: number | null;
    addressType: number | null;
    callbackEvent?: LoginFunction;
  }>;

const ShippingAddressView = ({
  title,
  addressInfo,
  addressId,
  addressType,
  callbackEvent,
}: CartAddressItemProps) => {
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/address/add",
          params: { addressId: addressId, addressType: addressType },
        });
      }}
    >
      <View
        style={{
          ...styles.topCard,
          height: "auto",
          width: "auto",
          //   backgroundColor: "rgb(30,30,30)",
          marginBottom: 10,
        }}
      >
        <View style={{ flex: 5, padding: 20 }}>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "white",
              fontSize: 16,
              marginBottom: 20,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "white",
              fontSize: 13,
            }}
          >
            {addressInfo &&
              `${addressInfo?.firstName} ${addressInfo?.lastName} +${addressInfo?.phoneCallCode}${addressInfo?.phone}`}
          </Text>

          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "white",
              fontSize: 13,
            }}
          >
            {addressInfo && `${addressInfo?.address}`}
          </Text>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "white",
              fontSize: 13,
            }}
          >
            {addressInfo &&
              `${addressInfo?.city} ${addressInfo?.country} ${addressInfo?.postCode}`}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.editTitle}>{"      "}</Text>
          <Image
            source={require("@/assets/images/shop/right_arrow.png")}
            style={styles.goodsItemArrow}
          ></Image>
        </View>
      </View>
    </Pressable>
  );
};

const BillingAddressView = () => {
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
          //   backgroundColor: "rgb(30,30,30)",
        }}
      >
        <View style={{ flex: 5, padding: 20 }}>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "white",
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            Billing address
          </Text>
          <Text style={{ color: "white", fontSize: 14 }}>
            DAVID STAR +(212)555-0100
          </Text>

          <Text style={{ color: "white", fontSize: 14 }}>
            Package arrived at an Amazon facility Swanton, Ohio US
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.editTitle}>{"      "}</Text>
          <Image
            source={require("@/assets/images/shop/right_arrow.png")}
            style={styles.goodsItemArrow}
          ></Image>
        </View>
      </View>
    </Pressable>
  );
};

// 商品信息
export type CartItemFunction = () => void;
export type CartItemNumberFunction = () => number;

export type GoodsItemProps = ViewProps &
  PropsWithChildren<{
    callbackEvent?: LoginFunction;
    increaceEvent?: CartItemFunction;
    decreaceEvent?: CartItemFunction;
    goodItem: GoodsItemType;
    itemNumber: CartItemNumberFunction;
  }>;

const GoodsCartItemView = ({
  goodItem,
  callbackEvent,
  increaceEvent,
  decreaceEvent,
  itemNumber,
}: GoodsItemProps) => {
  // 购物车信息
  const [totalPrice, setTotalPrice] = React.useState<number>(0);

  useEffect(() => {
    // 计算总金额
    const { price } = goodItem;
    if (price && itemNumber()) {
      const tempData = parseFloat(price) * itemNumber();
      setTotalPrice(tempData);
    }
  }, [increaceEvent, decreaceEvent]);

  return (
    <View
      //   linearColors={[Colors.dark.leftLightLinear, Colors.dark.righLightLinear]}
      style={{ ...styles.centerCard, height: 160, width: "auto" }}
    >
      <ImageBackground
        style={{ width: "100%", height: "100%" }}
        contentFit="fill"
        source={require("@/assets/images/shop/shop_cart_item.png")}
      >
        <View
          style={{
            position: "absolute",
            width: 130,
            height: "100%",
            // backgroundColor: "red",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={formatImageUrl(goodItem.pic)}
            placeholder={require("@/assets/images/shop/shop_default_icon.png")}
            contentFit="contain"
            placeholderContentFit="contain"
            style={{ width: "75%", height: "75%" }}
          />
        </View>
        <View
          style={{
            position: "absolute",
            width: "50%",
            height: 80,
            //   backgroundColor: "green",
            left: 130,
            top: 20,
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 16,
              color: "white",
              height: 60,
            }}
            ellipsizeMode={"tail"}
            numberOfLines={2}
          >
            {goodItem.name}
          </Text>
          {/* <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 12,
              color: "rgb(155,155,155)",
            }}
          >
            1.8% NICO
          </Text>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 12,
              color: "rgb(155,155,155)",
            }}
          >
            30 Pffs
          </Text> */}
        </View>
        <View style={styles.rightBottom}>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 13,
              color: "rgb(155,155,155)",
              marginLeft: 20,
            }}
          >
            {formatMoney(`${totalPrice}`)} Pff
          </Text>
        </View>

        <View
          style={{
            //   backgroundColor: "red",
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            //   height: 20,
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pressable
              style={{
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                height: 40,
                width: 40,
                // backgroundColor: "red",
              }}
              onPress={decreaceEvent}
            >
              <Image
                source={require("@/assets/images/shop/decreace.png")}
                style={{ width: 12, height: 2 }}
                contentFit="contain"
              />
            </Pressable>

            <View
              style={{
                alignContent: "center",
                justifyContent: "center",
                flexDirection: "row",
                height: 40,
                width: 20,
                // backgroundColor: "green",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "white",
                  // width: 30,
                  // height: 40,
                  // marginHorizontal: 10,
                  textAlign: "center",
                  // backgroundColor: "yellow",
                }}
              >
                {itemNumber && itemNumber()}
              </Text>
            </View>

            <Pressable
              style={{
                alignContent: "center",
                justifyContent: "center",
                flexDirection: "row",
                height: 40,
                width: 30,
                // backgroundColor: "green",
                alignItems: "center",
              }}
              onPress={increaceEvent}
            >
              <Image
                source={require("@/assets/images/shop/increace.png")}
                style={{ width: 12, height: 12 }}
                contentFit="contain"
              />
            </Pressable>
            <View style={{ width: 10 }}></View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

// 地址详细信息
const mockShippingAddress: AddressDetailType = {
  firstName: "DAVID",
  lastName: "START",
  phone: "+(1)(212)555 0100",
  phoneCallCode: "",

  country: "NY",
  address: "350 5th Ave",
  city: "New York, ",
  stateOrProvince: "",
  postCode: "10118",
};

// 地址详细信息
const mockBillingAddress: AddressDetailType = {
  firstName: "DAVID",
  lastName: "START",
  phone: "+(1)(212)555 0100",
  phoneCallCode: "",

  country: "NY",
  address: "350 5th Ave",
  city: "New York, ",
  stateOrProvince: "",
  postCode: "10118",
};

const mockGoodsDatas = [
  {
    id: 1,
    createdAt: "2024-06-02T20:45:40.731Z",
    updatedAt: "2024-06-02T20:45:40.731Z",
    name: "Green Grape Flavor",
    goodsCateId: 1,
    price: "100000000",
    pic: "",
    feature: "22",
    brief: "",
    status: 0,
  },
  {
    id: 2,
    createdAt: "2024-06-02T20:45:40Z",
    updatedAt: "2024-06-02T20:45:40Z",
    name: "Coke Flavor",
    goodsCateId: 1,
    price: "100000000",
    pic: "/uploads/file/5ae0c1c8a5260bc7b6648f6fbd115c35_20240608085121.jpg",
    feature: "111111",
    brief: "",
    status: 1,
  },
];

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "black",
  },
  cardIconImage: {
    width: 220,
    height: 220,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 50,
  },
  addToBasketButton: {
    position: "absolute",
    width: "95%",
    height: 45,
    bottom: 0,
  },
  topItem: { height: 300, width: "100%", backgroundColor: "rgb(23,23,23)" },
  topAbsItem: {
    bottom: 20,
    height: 60,
    width: "100%",
    // backgroundColor: "gray",
    position: "absolute",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  detailItem: {
    height: 500,
    width: "100%",
    backgroundColor: "black",
    marginBottom: 60,
  },
  itemTitleText: { fontSize: 20, fontWeight: "bold", color: "white" },
  itemDetailText: { fontSize: 20, fontWeight: "bold", color: "gray" },
  leftCardContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "red",
    marginTop: -10,
  },
  rightCardContainer: {
    marginTop: -70,
    flex: 2,
    backgroundColor: "yellow",
  },
  orderDetailItem: {
    // width: "100%",
    marginLeft: 30,
    marginRight: 30,
    height: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
  },
  orderDetailLeft: {
    fontFamily: Squealt3Regular,
    color: "white",
    fontSize: 16,
  },
  orderDetailRight: {
    color: "white",
    fontSize: 16,
    fontFamily: Squealt3Regular,
  },
  centerCard: {
    // width: "90%",
    height: 130,
    backgroundColor: "rgb(20,20,20)",
    // backgroundColor: "rgb(86,28,29)",
    // top: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    // marginBottom: 15,
    // left: 20,
    // right: 20,
    borderRadius: 25,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  rightBottom: {
    position: "absolute",
    right: 20,
    bottom: 20,
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
  editTitle: {
    // top: 15,
    // left: 15,
    // backgroundColor: "rgb(20,20,20)",
    // height: 30,
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
  topCard: {
    // width: "100%",
    // height: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 20,
    // flex: 1,
    borderColor: "rgb(50,50,50)",
    // padding: 20,
    marginHorizontal: 10,
  },
});
