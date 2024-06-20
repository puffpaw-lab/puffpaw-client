import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, Pressable } from "react-native";
import {
  Stack,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import { DialogUtils } from "@/constants/DialogUtils";
import { goodsInfoInterface, PageSize } from "@/constants/HttpUtils";
import { AxiosResponse } from "axios";
import { GoodsItemPicType, GoodsItemType } from "@/constants/ViewProps";
import { formatImageUrl } from "@/constants/CommonUtils";
import { Image } from "expo-image";
import { FloatCartView } from "@/components/Custom/FloatCartView";
import { buttonBgColor, buttonGrayBgColor } from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";
import { LocalCartInfo, ConstantStorage } from "@/constants/LocalStorage";
import { useMMKVObject } from "react-native-mmkv";
import PagerView from "react-native-pager-view";
import Index from "../../scripts/reset-project";

export default function goodsItemScreen() {
  // 购物车信息
  const [localCartList, setLocalCartList] = useMMKVObject<LocalCartInfo[]>(
    ConstantStorage.cartInfo
  );

  const { goods_id, extra, other } = useLocalSearchParams<{
    goods_id: string;
    extra?: string;
    other?: string;
  }>();

  const pathname = usePathname();

  const router = useRouter();
  const [count, setCount] = useState(0);

  const onAddToBasket = () => {};

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    // setPageIndex(0);
    // getGoodsList();
  }, []);

  const [goodsInfo, setGoodsInfo] = useState<GoodsItemType | null>(null);
  const [goodsPicList, setGoodsPicList] = useState<GoodsItemPicType[] | null>(
    null
  );

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

    const { depinGoods, goodsPic } = data;
    // if (depinGoods == null) {
    //   DialogUtils.showSuccess(`No goods`);
    //   return;
    // }

    // // 商品接口成功
    // console.log(JSON.stringify(goodsPic));

    setGoodsInfo(depinGoods);
    setGoodsPicList(goodsPic);
  };

  // 获取商品数据
  const getGoodsInfo = async () => {
    setRefreshing(true);

    try {
      const response = await goodsInfoInterface(parseInt(goods_id ?? ""));
      goodsInfoSuccess(response);
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };

  // 添加购物车
  const addCartEvent = () => {
    const goodId = parseInt(goods_id ?? "");

    // 存储本地
    const item: LocalCartInfo = { goodsId: goodId, goodsNumber: 1 };
    if (localCartList) {
      let exist = false;

      const tempData = localCartList.map((e) => {
        if (e.goodsId == goodId) {
          if (e.goodsNumber) {
            e.goodsNumber++;
          } else {
            e.goodsNumber = 1;
          }
          exist = true;
        }

        return e;
      });

      if (exist) {
        setLocalCartList([...tempData]);
      } else {
        setLocalCartList([...localCartList, item]);
      }
    } else {
      setLocalCartList([item]);
    }

    router.push({
      pathname: "/goods/cart",
      params: { goods_id: goods_id },
    });
  };

  useEffect(() => {
    getGoodsInfo();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black" }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title: `Goods ${goods_id}`,
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
        <View style={styles.container}>
          <View style={styles.topItem}>
            {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={formatImageUrl(goodsInfo?.pic ?? "")}
                placeholder={require("@/assets/images/shop/goods_icon.png")}
                style={styles.cardIconImage}
                contentFit="contain"
                placeholderContentFit="contain"
              />
            </View> */}

            {goodsPicList && (
              <PagerView
                style={{
                  // flex: 1,
                  height: 200,
                  width: "100%",
                  backgroundColor: "green",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                initialPage={0}
                useNext={false}
              >
                {goodsPicList &&
                  goodsPicList.map((e, index) => (
                    <View
                      key={`${index}`}
                      style={{
                        // width: 300,
                        // height: 200,
                        backgroundColor: buttonGrayBgColor,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        // key={`${index}`}
                        source={formatImageUrl(e.url ?? "")}
                        placeholder={require("@/assets/images/shop/goods_icon.png")}
                        style={styles.cardIconImage}
                        contentFit="contain"
                        placeholderContentFit="contain"
                      />
                    </View>
                  ))}
              </PagerView>
            )}

            {/* <View style={styles.topAbsItem}>
              <Text
                style={{
                  color: "white",
                  marginLeft: 20,
                  marginTop: 5,
                  height: 30,
                }}
              >
                1.8% NICO{" "}
              </Text>
              <Text style={{ color: "white", marginLeft: 20 }}>30 PUFF</Text>
            </View> */}
          </View>

          <View style={{ backgroundColor: buttonGrayBgColor }}>
            <View
              style={{
                position: "absolute",
                // width: 25,
                // height: 25,
                right: 30,
                bottom: 40,
                // backgroundColor: "red",
              }}
            >
              <Image
                source={require("@/assets/images/shop/goods_item_arrow.png")}
                style={{ width: 16, height: 16 }}
                contentFit="contain"
              ></Image>
            </View>
            <Text
              style={{
                color: "white",
                marginLeft: 20,
                marginTop: 5,
                height: 30,
              }}
            >
              1.8% NICO{" "}
            </Text>
            <Text style={{ color: "white", marginLeft: 20, marginBottom: 20 }}>
              30 PUFF
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text
              style={{
                color: "white",
                marginLeft: 20,
                marginTop: 15,
                fontWeight: "bold",
              }}
            >
              Detail
            </Text>
            <Text style={{ color: "gray", marginLeft: 20, marginTop: 10 }}>
              Detail Info
            </Text>
            <Text
              style={{
                color: "white",
                marginLeft: 20,
                marginTop: 25,
                fontWeight: "bold",
              }}
            >
              Features
            </Text>
            <Text style={{ color: "gray", marginLeft: 20, marginTop: 10 }}>
              {goodsInfo?.brief ?? ""}
              {/* Just to add clarity for others, I'm using a bottom tab navigator
                (from react-navigation-material-bottom-tabs) and two of my tabs
                have their own stack navigators. Setting the headerStyle didn't
                remove the shadow for me, but setting cardStyle did. Here's the
                source of the whole file just so it's totally clear. The only
                lines added were the two styles in cardStyle in the stack
                function. */}
            </Text>
          </View>
        </View>
      </ScrollView>
      <Pressable onPress={addCartEvent}>
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
                fontSize: 14,
              }}
            >
              Add to Basket
            </Text>
          </View>
        </View>
      </Pressable>

      <FloatCartView right={20} bottom={70}></FloatCartView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    // width: "100%",
  },
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "black",
    // width: "100%",
  },
  scrollView: {
    // flex: 1,
    // backgroundColor: "red",
    // width: "100%",
    // height: "100%",
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
  topItem: { width: "100%", backgroundColor: "rgb(23,23,23)" },
  topAbsItem: {
    bottom: 20,
    left: 20,
    height: 60,
    width: 200,
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
  pagerView: {
    flex: 1,
  },
});
