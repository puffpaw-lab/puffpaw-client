import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  useWindowDimensions,
  Modal,
} from "react-native";
import {
  Stack,
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
import { Button } from "@rneui/base";
import {
  CustomDialog,
  DialogUtils,
  toastConfig,
} from "@/constants/DialogUtils";
import { goodsInfoInterface, PageSize } from "@/constants/HttpUtils";
import { AxiosResponse } from "axios";
import { GoodsItemPicType, GoodsItemType } from "@/constants/ViewProps";
import {
  formatBase64,
  formatImageUrl,
  formatMoney,
  percent10WinHeight,
  percent5WinHeight,
  windowWidth,
} from "@/constants/CommonUtils";
import { Image, ImageBackground } from "expo-image";
import { FloatCartView } from "@/components/Custom/FloatCartView";
import {
  buttonBgColor,
  buttonGray30Color,
  buttonGray50Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";
import { LocalCartInfo, ConstantStorage } from "@/constants/LocalStorage";
import { useMMKVObject } from "react-native-mmkv";
import PagerView from "react-native-pager-view";
import Index from "../../scripts/reset-project";
import RenderHtml from "react-native-render-html";
import { CLOG } from "@/constants/LogUtils";
import Toast from "react-native-toast-message";

export default function goodsItemScreen() {
  const { goods_id, extra, other } = useLocalSearchParams<{
    goods_id: string;
    extra?: string;
    other?: string;
  }>();
  const { width } = useWindowDimensions();

  // 购物车信息
  const [localCartList, setLocalCartList] = useMMKVObject<LocalCartInfo[]>(
    ConstantStorage.cartInfo
  );

  const router = useRouter();

  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [goodsImageVisible, setGoodsImageVisible] = React.useState(false);
  const [goodsImageUrl, setGoodsImageUrl] = React.useState<string | null>("");

  const onRefresh = React.useCallback(() => {
    // setPageIndex(0);
    // getGoodsList();
  }, []);

  const [goodsInfo, setGoodsInfo] = useState<GoodsItemType | null>(null);
  const [goodsPicList, setGoodsPicList] = useState<GoodsItemPicType[] | null>(
    null
  );

  const [items, setItems] = useState<string[] | null>(null);

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
    // CLOG.info(JSON.stringify(goodsPic));

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

    setTimeout(() => {
      router.push({
        pathname: "/goods/cart",
        params: { goods_id: goods_id },
      });
    }, 500);
  };

  // 图片列表
  useEffect(() => {
    if (goodsPicList !== undefined && goodsPicList !== null) {
      let tempItems = goodsPicList.map((e) => "");
      setItems(tempItems);
    }

    CLOG.info(goodsPicList);
  }, [goodsPicList]);

  useEffect(() => {
    getGoodsInfo();
  }, []);

  const setPage = (page: number) => {
    setSelectedIndex(page);
  };

  const source = {
    html: `
  <p style='text-align:center;height:10'>
  </p>`,
  };
  const MemoizedRenderHtml = React.memo(RenderHtml);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black" }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title: ``,
          headerShadowVisible: true,
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
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "black",
            width: "100%",
            height: "100%",
          }}
        >
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
                    height: 250,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  initialPage={0}
                  // useNext={false}
                  onPageSelected={(e) => {
                    setPage(e.nativeEvent.position);
                  }}
                >
                  {goodsPicList &&
                    goodsPicList.map((e, index) => (
                      <View
                        key={`${index}${e.id}`}
                        style={{
                          // width: 300,
                          // height: 200,
                          // backgroundColor: buttonGrayBgColor,
                          backgroundColor: "rgb(23,23,23)",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          // key={`${index}`}
                          source={formatImageUrl(e.url)}
                          placeholder={require("@/assets/images/shop/shop_default_icon.png")}
                          style={{
                            width: windowWidth * 0.6,
                            height: windowWidth * 0.6,
                          }}
                          contentFit="contain"
                          placeholderContentFit="contain"
                        />
                      </View>
                    ))}
                </PagerView>
              )}
            </View>

            <Pressable
              // style={{ backgroundColor: "rgb(23,23,23)" }}
              onPress={() => {
                // if (goodsPicList && selectedIndex < goodsPicList.length) {
                //   setGoodsImageUrl(goodsPicList[selectedIndex].url);
                // }
                // setGoodsImageVisible(true);
              }}
            >
              <View
                style={{
                  position: "absolute",
                  // width: 25,
                  // height: 25,
                  right: 20,
                  bottom: 20,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  // backgroundColor: "green",
                }}
              >
                <Pressable
                  onPress={() => {
                    if (goodsPicList && selectedIndex < goodsPicList.length) {
                      setGoodsImageUrl(goodsPicList[selectedIndex].url);
                    }

                    setGoodsImageVisible(true);
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "red",
                  }}
                >
                  <Image
                    source={require("@/assets/images/shop/goods_item_arrow.png")}
                    style={{ width: 16, height: 16 }}
                    contentFit="contain"
                  ></Image>
                </Pressable>
              </View>
              {/* <Text
                style={{
                  color: buttonGray50Color,
                  marginLeft: 20,
                  marginTop: 5,
                  height: 30,
                }}
              >
                1.8% NICO{" "}
              </Text>
              <Text
                style={{
                  color: buttonGray50Color,
                  marginLeft: 20,
                  marginBottom: 20,
                }}
              >
                30 PFF
              </Text> */}
            </Pressable>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              {items &&
                items.map((e, index) => (
                  <View
                    key={index}
                    style={{
                      // backgroundColor: "red",
                      // width: 6,
                      // height: 6,
                      // borderRadius: 3,
                      padding: 5,
                    }}
                  >
                    <View
                      // key={e}
                      style={{
                        backgroundColor:
                          index == selectedIndex
                            ? buttonBgColor
                            : buttonGray30Color,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                      }}
                    ></View>
                  </View>
                ))}
            </View>

            {/* 商品名称 */}
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                marginTop: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 15,
                  color: "white",
                  textAlign: "left",
                  flex: 3,
                  // maxHeight: 50,
                }}
              >
                {/* Green Grape Flavor*/}
                {goodsInfo?.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                marginTop: 15,
              }}
            >
              {/* <View style={{ flex: 1 }}></View> */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 15,
                  color: "white",
                  flex: 2,
                  textAlign: "right",
                }}
              >
                {formatMoney(goodsInfo?.price)} PFF
              </Text>
            </View>

            {/* 详情 */}
            <View style={styles.detailItem}>
              <Text
                style={{
                  fontFamily: Squealt3Regular,

                  color: "white",
                  marginLeft: 20,
                  marginTop: 20,
                  fontWeight: "bold",
                }}
              >
                Details
              </Text>
              {/* <Text
                style={{
                  fontFamily: Squealt3Regular,
                  color: "gray",
                  marginLeft: 20,
                  marginTop: 10,
                }}
              >
                {goodsInfo?.brief}
              </Text> */}
              <View style={{ marginHorizontal: 20 }}>
                <MemoizedRenderHtml
                  contentWidth={width - 40}
                  source={{ html: `${formatBase64(goodsInfo?.brief)}` }}
                  baseStyle={{ marginTop: 10 }}
                />
              </View>
              <Text
                style={{
                  fontFamily: Squealt3Regular,

                  color: "white",
                  marginLeft: 20,
                  marginTop: 25,
                  fontWeight: "bold",
                }}
              >
                Features
              </Text>
              <Text
                style={{
                  fontFamily: Squealt3Regular,

                  color: "gray",
                  marginLeft: 20,
                  marginTop: 20,
                  paddingHorizontal: 20,
                }}
              >
                {/* {goodsInfo?.brief} */}
                {/* Savor the sour-sweet flavors of fresh green grapes in this pod.
                It's like a burst of summer in your mouth, where the grapes are
                ripe and ready to be popped. Enjoy a fun and creative vaping
                experience that'll leave you feeling refreshed and ready to
                tackle the day! RELX Pod Pro, compatible with RELX Essential,
                Infinity, Phantom, and Artisan, offers exceptional taste,
                high-quality vape juice, and a smooth vaping experience with
                Super Smooth™ technology and leak-resistant design. Our Pods Pro
                collection boasts a diverse range of flavors, tested by over
                10K+ consumers on 145 flavors, ensuring the perfect fit for
                every vaper. From watermelon to tobacco, jasmine green tea to
                double mint, find your perfect flavor! */}
              </Text>
              <View style={{ marginHorizontal: 30 }}>
                <MemoizedRenderHtml
                  contentWidth={width - 40}
                  source={{
                    html: `${formatBase64(goodsInfo?.feature)}`,
                  }}
                  baseStyle={{}}
                />
              </View>
            </View>

            <View style={{ height: percent10WinHeight }}></View>
          </View>
        </ScrollView>
        <FloatCartView right={20} bottom={20}></FloatCartView>
      </View>
      <Pressable onPress={addCartEvent}>
        <View
          style={{
            height: 50,
            backgroundColor: buttonBgColor,
            justifyContent: "center",
            alignItems: "center",
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
            }}
          >
            <Text
              style={{
                fontFamily: Squealt3Regular,
                color: "white",
                fontSize: 14,
              }}
            >
              Add to Cart
            </Text>
          </View>
        </View>
      </Pressable>

      {/* 商品照片页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={goodsImageVisible}
        onRequestClose={() => {
          setGoodsImageVisible(!goodsImageVisible);
        }}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // marginTop: 22,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Pressable
            onPress={() => {
              setGoodsImageVisible(false);
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "50%",
            }}
          >
            <Image
              // key={`${index}`}
              source={formatImageUrl(goodsImageUrl)}
              placeholder={require("@/assets/images/shop/shop_default_icon.png")}
              style={{
                width: windowWidth,
                height: windowWidth,
              }}
              contentFit="contain"
              placeholderContentFit="contain"
            />
          </Pressable>
          {/* </View> */}
          {/* </View> */}
        </Pressable>
        <CustomDialog />
      </Modal>
    </SafeAreaView>
  );
}

// // 模拟商品数据
// const mockGoodsDatas: GoodsItemType = {
//   id: 1,
//   createdAt: "2024-06-02T20:45:40.731Z",
//   updatedAt: "2024-06-02T20:45:40.731Z",
//   name: "Green Grape Flavor",
//   goodsCateId: 1,
//   price: "3000000000",
//   pic: "",
//   feature: "22",
//   brief: "",
//   status: 0,
// };

// const mockGoodsItemPic: GoodsItemPicType[] = [
//   { goodsId: "1", type: "", name: "", url: "", content: "" },
//   { goodsId: "1", type: "", name: "", url: "", content: "" },
//   { goodsId: "1", type: "", name: "", url: "", content: "" },
//   { goodsId: "1", type: "", name: "", url: "", content: "" },
// ];

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    // width: "100%",
  },
  container: {
    flex: 1,
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
    width: windowWidth * 0.6,
    height: windowWidth * 0.6,
    backgroundColor: "red",
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
  topItem: {
    width: "100%",
    backgroundColor: "rgb(23,23,23)",
    paddingTop: percent5WinHeight,
  },
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
    // height: 500,
    // width: "100%",
    backgroundColor: "black",
    marginTop: 10,
    marginBottom: 60,
  },
  itemTitleText: { fontSize: 20, fontWeight: "bold", color: "white" },
  itemDetailText: { fontSize: 20, fontWeight: "bold", color: "gray" },
  pagerView: {
    flex: 1,
  },
});
