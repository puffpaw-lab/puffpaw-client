import {
  Pressable,
  StyleSheet,
  View,
  Text,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";

import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Image } from "expo-image";
import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import { DialogUtils } from "@/constants/DialogUtils";
import { goodsListInterface, PageSize } from "@/constants/HttpUtils";
import { ListEmptyView } from "@/components/Custom/ListEmptyView";
import { Squealt3Regular } from "@/constants/FontUtils";
import { formatImageUrl } from "@/constants/CommonUtils";
import { AxiosResponse } from "axios";
import { GoodsItemType } from "@/constants/ViewProps";
import { FloatCartView } from "@/components/Custom/FloatCartView";

const GoodsListView = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const onRefresh = React.useCallback(() => {
    setPageIndex(0);
    getGoodsList(true);
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
    // console.log(JSON.stringify(data));

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
      getGoodsList(false);
    }
  };

  useEffect(() => {
    // getGoodsList(false);
  }, []);

  return (
    <FlashList
      ListEmptyComponent={ListEmptyView}
      ListHeaderComponent={GoodsHeaderView}
      data={goodsItems}
      renderItem={GoodsItemView}
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

const GoodsItemView = ({ item }: { item: GoodsItemType }) => {
  return (
    <Pressable
      onPress={() => {
        // router.push({
        //   pathname: "/goods/[goods_id]",
        //   params: { goods_id: item.id },
        // });
        router.push({
          pathname: "/goods/cart",
        });
      }}
    >
      <View
        style={{
          // width: "90%",
          height: 300,
          backgroundColor: "rgb(20,20,20)",
          // top: 10,
          // marginBottom: 20,
          // left: 20,
          // right: 20,
          margin: 20,
          borderRadius: 25,
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 20,
            alignContent: "flex-start",
            alignItems: "flex-start",
            top: 20,
          }}
        >
          <Text style={{ color: "gray" }}>1.8% NICO</Text>
          <Text style={{ color: "gray" }}>30 PUFF</Text>
        </View>
        <View
          style={{
            // flex: 1,
            alignItems: "center",
            justifyContent: "center",
            // position: "absolute",
            // left: 60,
            top: 30,
          }}
        >
          <Image
            source={formatImageUrl(item.pic)}
            placeholder={require("@/assets/images/shop/goods_icon.png")}
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
            height: 60,
            // bottom: -20,
            // top: 240,
            // right: 0,
            // left: 0,
            bottom: 0,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 16,
              color: "white",
              marginLeft: 20,
              marginTop: 5,
            }}
          >
            {item.name} - {item.brief}
          </Text>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 14,
              color: "white",
              marginLeft: 20,
            }}
          >
            {item.price} Worth
          </Text>
          {/* </View> */}
        </HorizonBackgroundView>
        <View
          style={{
            position: "absolute",
            // width: 25,
            // height: 25,
            right: 30,
            bottom: 80,
            // backgroundColor: "red",
          }}
        >
          <Image
            source={require("@/assets/images/shop/goods_item_arrow.png")}
            style={styles.goodsItemArrow}
            contentFit="contain"
          ></Image>
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
          fontSize: 30,

          color: "white",
          marginLeft: 20,
          fontWeight: "bold",
          marginTop: 5,
        }}
      >
        E-cigarette
      </Text>
      <Text
        style={{
          fontFamily: Squealt3Regular,
          fontSize: 20,
          color: "white",
          marginLeft: 20,
          fontWeight: "bold",
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
            fontWeight: "bold",
          },
          headerRight: (props) => <RightLogoView></RightLogoView>,
        }}
      />

      <BackgroundView x={"100%"} y={"100%"} rx={"70%"} ry={"30%"}>
        <GoodsListView></GoodsListView>
        <FloatCartView right={20} bottom={40}></FloatCartView>
      </BackgroundView>
    </View>
  );
}

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
    width: 180,
    height: 180,
    marginTop: 10,
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
    // flex: 1,
    // objectFit: "contain",
    width: 16,
    height: 16,
    // right: 0,
  },
  headerContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "black",
    height: 120,
  },
});
