import {
  Pressable,
  StyleSheet,
  View,
  Text,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  useWindowDimensions,
  Dimensions,
  ViewProps,
  Modal,
} from "react-native";

import React, { useCallback, useEffect, useState } from "react";
import { Stack, useFocusEffect } from "expo-router";

import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { router } from "expo-router";
import { Image } from "expo-image";
import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import {
  CustomDialog,
  DialogUtils,
  toastConfig,
} from "@/constants/DialogUtils";
import { goodsListInterface, PageSize } from "@/constants/HttpUtils";
import { ListEmptyView } from "@/components/Custom/ListEmptyView";
import { Squealt3Regular } from "@/constants/FontUtils";
import {
  formatImageUrl,
  formatMoney,
  windowWidth,
} from "@/constants/CommonUtils";
import { AxiosResponse } from "axios";
import { GoodsItemType } from "@/constants/ViewProps";
import { FloatCartView } from "@/components/Custom/FloatCartView";
import { buttonGray200Color, buttonGray50Color } from "@/constants/Colors";
import PagerView from "react-native-pager-view";
import { CLOG } from "@/constants/LogUtils";
import Toast from "react-native-toast-message";

const GoodsListView = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [goodsImageVisible, setGoodsImageVisible] = React.useState(false);
  const [goodsImageUrl, setGoodsImageUrl] = React.useState<string | null>("");

  const onRefresh = React.useCallback(() => {
    setPageIndex(1);
    getGoodsList(true);
    CLOG.info(`商品列表下拉刷新`);
  }, []);

  const [goodsItems, setGoodsItems] = useState<GoodsItemType[]>([]);

  // 商品信息成功
  const goodsListSuccess = (
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
      DialogUtils.showSuccess(`No goods`);
      return;
    }

    // 商品接口成功
    // CLOG.info(JSON.stringify(data));

    if (isClean) {
      const items = [...list];
      setGoodsItems(items);
    } else {
      const items = [...goodsItems, ...list];
      setGoodsItems(items);
    }
  };

  // 获取商品数据
  const getGoodsList = async (isClean: boolean) => {
    setRefreshing(true);

    try {
      const response = await goodsListInterface(pageIndex, PageSize);
      goodsListSuccess(response, isClean);
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

  // 展示商品照片
  const onSelectedArrowEvent = (item: GoodsItemType) => {
    CLOG.info("click " + item);
    setGoodsImageUrl(item.pic);
    setGoodsImageVisible(true);
  };

  // 分页加载
  useEffect(() => {
    getGoodsList(pageIndex <= 1);
  }, [pageIndex]);

  useEffect(() => {
    // getGoodsList(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        ListEmptyComponent={ListEmptyView}
        ListHeaderComponent={GoodsHeaderView}
        data={goodsItems}
        // data={mockGoodsDatas}
        renderItem={(item) => (
          <GoodsItemView
            item={item.item}
            arrowCallback={onSelectedArrowEvent}
          ></GoodsItemView>
        )}
        keyExtractor={keyExtractor} //{(item) => `${item.id}`}
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
    </View>
  );
};

type GoodsItemPropType = ViewProps & {
  item: GoodsItemType;
  arrowCallback: (item: GoodsItemType) => void;
};

const GoodsItemView = ({ item, arrowCallback }: GoodsItemPropType) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const itemHeight = (windowWidth - 40) * 1.05;

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/goods/[goods_id]",
          params: { goods_id: item.id },
        });
      }}
    >
      <View
        style={{
          // width: "90%",
          height: itemHeight,
          backgroundColor: "rgb(20,20,20)",
          // top: 10,
          // marginBottom: 20,
          // left: 20,
          // right: 20,
          margin: 20,
          borderRadius: 25,
        }}
      >
        {/* <View
          style={{
            position: "absolute",
            left: 25,
            alignContent: "flex-start",
            alignItems: "flex-start",
            top: 20,
          }}
        >
          <Text style={{ color: buttonGray50Color }}>1.8% NICO</Text>
          <Text style={{ color: buttonGray50Color }}>
            {formatMoney("30")} PFF
          </Text>
        </View> */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            // position: "absolute",
            // left: 60,
            // top: 30,
            // backgroundColor: "yellow",
          }}
        >
          <Image
            source={formatImageUrl(item.pic)}
            placeholder={require("@/assets/images/shop/shop_default_icon.png")}
            style={styles.cardIconImage}
            contentFit="contain"
            placeholderContentFit="contain"
          />
        </View>

        <HorizonBackgroundView
          style={{
            position: "absolute",
            alignContent: "flex-start",
            alignItems: "flex-start",
            // backgroundColor: "rgb(86,28,29)",
            flex: 1,
            width: "100%",
            height: 70,
            // bottom: -20,
            // top: 240,
            // right: 0,
            // left: 0,
            bottom: 0,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            paddingLeft: 30,
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 16,
              color: "white",
              // marginLeft: 30,
              marginTop: 10,
              // backgroundColor: "red",
              width: "90%",
              height: 18,
            }}
            ellipsizeMode={"tail"}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 12,
              color: "white",
              // marginLeft: 30,
            }}
          >
            {formatMoney(item.price)} PFF
          </Text>
          {/* </View> */}
        </HorizonBackgroundView>
        <View
          style={{
            position: "absolute",
            // width: 25,
            // height: 25,
            right: 25,
            bottom: 90,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "green",
          }}
        >
          <Pressable
            onPress={() => {
              if (arrowCallback) arrowCallback(item);
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
      </View>
    </Pressable>
  );
};

const GoodsHeaderView = () => {
  return (
    <View style={styles.headerContainer}>
      <Text
        style={{
          fontFamily: Squealt3Regular,
          fontSize: 22,
          color: "white",
          marginLeft: 20,
          marginTop: 5,
        }}
      >
        E-cigarette
      </Text>
      <Text
        style={{
          fontFamily: Squealt3Regular,
          fontSize: 22,
          color: "white",
          marginLeft: 20,
        }}
      >
        Pods
      </Text>
    </View>
  );
};

export default function shopScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"}></StatusBar>

      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            // fontWeight: "bold",
          },
          headerRight: (props) => <RightLogoView></RightLogoView>,
        }}
      />

      <BackgroundView x={"100%"} y={"100%"} rx={"70%"} ry={"30%"}>
        <GoodsListView></GoodsListView>
        <FloatCartView right={16} bottom={20}></FloatCartView>
      </BackgroundView>
    </View>
  );
}

const mockGoodsDatas = [
  {
    id: 1,
    createdAt: "2024-06-02T20:45:40.731Z",
    updatedAt: "2024-06-02T20:45:40.731Z",
    name: "Green Grape Flavor",
    goodsCateId: 1,
    price: "3000,000,000",
    pic: "",
    feature: "22",
    brief: "",
    status: 0,
  },
  {
    id: 2,
    createdAt: "2024-06-02T20:45:40Z",
    updatedAt: "2024-06-02T20:45:40Z",
    name: "Green Grape Flavor",
    goodsCateId: 1,
    price: "3000000000",
    pic: "/uploads/file/5ae0c1c8a5260bc7b6648f6fbd115c35_20240608085121.jpg",
    feature: "111111",
    brief: "",
    status: 1,
  },
  {
    id: 3,
    createdAt: "2024-06-02T20:45:40Z",
    updatedAt: "2024-06-02T20:45:40Z",
    name: "Green Grape Flavor",
    goodsCateId: 1,
    price: "3000000000",
    pic: "/uploads/file/5ae0c1c8a5260bc7b6648f6fbd115c35_20240608085121.jpg",
    feature: "222222",
    brief: "",
    status: 1,
  },
  {
    id: 4,
    createdAt: "2024-06-02T20:45:40Z",
    updatedAt: "2024-06-02T20:45:40Z",
    name: "Green Grape Flavor",
    goodsCateId: 1,
    price: "3000000000",
    pic: "/uploads/file/5ae0c1c8a5260bc7b6648f6fbd115c35_20240608085121.jpg",
    feature: "333333",
    brief: "",
    status: 1,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
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
    right: 15,
  },
  card: {
    // width: "90%",
    height: 300,
    backgroundColor: "rgb(20,20,20)",
    // top: 10,
    // marginBottom: 20,
    // left: 20,
    // right: 20,
    margin: 10,
    borderRadius: 25,
  },
  cardContent: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardIconImage: {
    width: "65%",
    height: "65%",
    // marginTop: 10,
    marginBottom: "15%",
    marginRight: 20,
    // backgroundColor: "red",
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
    // backgroundColor: "rgb(86,28,29)",
    flex: 1,
    width: "100%",
    height: 80,
    // bottom: -20,
    top: "80%",
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
    // flex: 1,
    // objectFit: "contain",
    width: 16,
    height: 16,
    // right: 0,
  },
  headerContainer: {
    // flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "black",
    // height: 120,
  },
});
