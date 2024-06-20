import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  ViewProps,
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
import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Button, Divider } from "@rneui/base";
import { useMMKVObject } from "react-native-mmkv";
import { ConstantStorage, LocalCartInfo } from "@/constants/LocalStorage";
import { FloatCartView } from "@/components/Custom/FloatCartView";
import { buttonBgColor, Colors } from "@/constants/Colors";
import { formatImageUrl, parseAddress } from "@/constants/CommonUtils";
import { Image } from "expo-image";
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
} from "@/constants/HttpUtils";
import * as Crypto from "expo-crypto";
import usePayHooks from "@/constants/PayUtils";

// 购物车
export default function cartScreen() {
  const router = useRouter();
  const { pay } = usePayHooks();

  // 购物车信息
  const [localCartList, setLocalCartList] = useMMKVObject<LocalCartInfo[]>(
    ConstantStorage.cartInfo
  );

  const [refreshing, setRefreshing] = useState(false);
  const [goodsItems, setGoodsItems] = useState<GoodsItemType[] | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>();
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

    if (ids.length == 0) {
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
      // console.log(JSON.stringify(list));

      if (list.length > 0) {
        const address = list[0];
        setAddressId(address.id);

        const { billingAddress, shippingAddress } = address;

        const sAddress = parseAddress(shippingAddress);
        const bAddress = parseAddress(billingAddress);

        if (sAddress) setShippingAddress(sAddress);
        if (bAddress) setBillingAddress(bAddress);
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
      // console.log(JSON.stringify(list));
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
      // console.log(JSON.stringify(list));
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

    const createOrderItem = localCartList.map((e): CreateOrderItemType => {
      const item: CreateOrderItemType = {
        goodsId: e.goodsId,
        payNumber: e.goodsNumber,
      };
      return item;
    });

    try {
      const response = await createOrderInterface(addressId, createOrderItem);
      const topData = response?.data;
      // console.log(topData);

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
      const { id, orderNum } = depinOrders;

      // 商品接口成功
      // console.log(JSON.stringify(depinOrders));
      DialogUtils.showSuccess(`create order success ${orderNum}`);

      // 1s之后跳转订单详情
      setTimeout(() => {
        setLocalCartList([]);
        router.push({
          pathname: "/order/[order_id]",
          params: { order_id: id },
        });
      }, 1000);
    } catch (e) {
    } finally {
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

    // console.log(tempData);
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

    // console.log(tempData);
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

  // useEffect(() => {
  //   getCartGoodsInfo();
  //   getAddressInfo();
  // }, []);

  // // 地址信息被修改之后更新
  // useEffect(() => {
  //   console.log("地址被修改: 重新请求");
  //   getAddressInfo();
  // }, [updateAddress]);

  // 地址信息被修改之后更新
  useFocusEffect(
    useCallback(() => {
      console.log("返回购物车页面: 重新请求");
      getCartGoodsInfo();
      getAddressInfo();
    }, [])
  );

  const signMessageEvent = () => {
    pay("bbb", 1);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black" }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title: `Shopping cart`,
          headerShadowVisible: true,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackTitleVisible: false,
          headerRight: (props) => (
            <RightLogoView marginRight={0}></RightLogoView>
          ),
        }}
      />
      <ScrollView style={{ backgroundColor: "black" }}>
        {goodsItems &&
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
        <ShippingAddressView
          title={"Billing address"}
          addressInfo={billingAddress}
          addressId={addressId}
          addressType={1}
        ></ShippingAddressView>
        {/* {billingAddress && <BillingAddressView ></BillingAddressView>} */}
      </ScrollView>
      <Divider></Divider>
      <OrderDetailView
        leftTitle="Order total:"
        rightTitle={`${totalPrice} Puff`}
      ></OrderDetailView>
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
              Pay Now
            </Text>
          </View>
        </View>
      </Pressable>
      <Pressable onPress={signMessageEvent}>
        <View
          style={{
            height: 50,
            backgroundColor: buttonBgColor,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 20,
            borderRadius: 25,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
              }}
            >
              Test Sign str
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
              marginBottom: 10,
            }}
          >
            {title}
          </Text>
          <Text style={{ color: "white", fontSize: 14 }}>
            {addressInfo &&
              `${addressInfo?.firstName} ${addressInfo?.lastName} ${addressInfo?.phone}`}
          </Text>

          <Text style={{ color: "white", fontSize: 14 }}>
            {addressInfo &&
              `${addressInfo?.address} ${addressInfo?.city} ${addressInfo?.country}`}
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
    <HorizonBackgroundView
      //   linearColors={[Colors.dark.leftLightLinear, Colors.dark.righLightLinear]}
      style={{ ...styles.centerCard, height: 160, width: "auto" }}
    >
      <View
        style={{
          position: "absolute",
          width: 130,
          height: "100%",
          //   backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={formatImageUrl(goodItem.pic)}
          placeholder={require("@/assets/images/shop/goods_icon.png")}
          contentFit="fill"
          style={{ width: 80, height: 110 }}
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
          style={{ fontFamily: Squealt3Regular, fontSize: 16, color: "white" }}
        >
          {goodItem.name}
        </Text>
        <Text
          style={{ fontFamily: Squealt3Regular, fontSize: 12, color: "gray" }}
        >
          Order finished
        </Text>
        <Text
          style={{ fontFamily: Squealt3Regular, fontSize: 12, color: "gray" }}
        >
          1.8% NICO
        </Text>
      </View>
      <View style={styles.rightBottom}>
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 13,
            color: "gray",
            marginLeft: 20,
          }}
        >
          {totalPrice} Puff
        </Text>
      </View>
      <View
        style={{
          //   backgroundColor: "red",
          position: "absolute",
          right: 10,
          top: 65,
          //   height: 20,
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Pressable
          style={{
            alignContent: "center",
            justifyContent: "center",
          }}
          onPress={decreaceEvent}
        >
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("@/assets/images/shop/decreace.png")}
              style={{ width: 12, height: 2 }}
            />
          </View>
        </Pressable>
        <Text
          style={{
            fontSize: 14,
            color: "white",
            width: 20,
            marginHorizontal: 10,
            textAlign: "center",
          }}
        >
          {itemNumber && itemNumber()}
        </Text>
        <Pressable
          style={{
            alignContent: "center",
            justifyContent: "center",
          }}
          onPress={increaceEvent}
        >
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("@/assets/images/shop/increace.png")}
              style={{ width: 12, height: 12, resizeMode: "contain" }}
            />
          </View>
        </Pressable>
      </View>
    </HorizonBackgroundView>
  );
};

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
    marginLeft: 20,
    marginRight: 20,
    height: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 15,
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
    margin: 10,
    marginBottom: 20,
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
