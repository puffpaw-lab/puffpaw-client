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
  useEffect,
  useState,
} from "react";
import { router, Stack, useRouter } from "expo-router";
import { Image, ImageBackground } from "expo-image";

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
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { RefreshControl, TextInput } from "react-native-gesture-handler";

import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";

// import { Searchbar } from "react-native-elements";
import { Divider, SearchBar } from "@rneui/themed";
import {
  buttonBgColor,
  buttonGray150Color,
  buttonGray25Color,
  buttonGray30Color,
  buttonGray50Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";
import { Button } from "@rneui/base";
import { UserHeaderView } from "@/components/Custom/UserHeaderView";
import {
  FunctionWithNumber,
  GoodsItemType,
  LoginFunction,
} from "@/constants/ViewProps";
import { DialogUtils } from "@/constants/DialogUtils";
import { goodsListInterface, PageSize } from "@/constants/HttpUtils";
import { AxiosResponse } from "axios";
import {
  OrdersListAllView,
  OrdersListView,
} from "@/components/Custom/OrderListView";
import { windowHeight, windowWidth } from "@/constants/CommonUtils";
import { CLOG } from "@/constants/LogUtils";
import { useNFTList } from "@/constants/NodeUtil";

type GreetFunction = () => void;
type NFTViewProps = ViewProps & {
  callbackEvent: GreetFunction;
};

// 我的Node视图
const MyNodeView = (callback: NFTViewProps) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const { getNFTList } = useNFTList();

  useEffect(() => {
    CLOG.info("查询nft");
    // getNFTList("0x60139e5076a7d5121d597e3a3a1647d716cd7fd9", 1, 5);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const onSetAsBackgroundEvent = (url: string) => {
    CLOG.info(`onSetAsBackgroundEvent ${url}`);
  };

  const onSetAsAvstarEvent = (url: string) => {
    CLOG.info(`onSetAsAvstarEvent ${url}`);
  };

  return (
    <View style={{ marginLeft: 20, marginRight: 10, height: "100%" }}>
      <MasonryFlashList
        // refreshControl
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"white"}
            progressBackgroundColor={"white"}
            style={{ backgroundColor: "black" }}
          />
        }
        ListEmptyComponent={MyNodeEmptyView}
        numColumns={2}
        // 获取NFT列表
        // useNFTList()
        // data={myNodeItems}
        data={myNodeItems}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onPress={() => {
                // router.push({
                //   pathname: "/goods/[goods_id]",
                //   params: { goods_id: item.title },
                // });
              }}
            >
              <MyNTFView
                myNodeInfo={item}
                setAsBackground={onSetAsBackgroundEvent}
                setAsAvstar={onSetAsAvstarEvent}
              ></MyNTFView>
            </Pressable>
          );
        }}
        estimatedItemSize={150}
      />
    </View>
  );
};

type MyNodeInfo = ViewProps & {
  type: string | null;
  icon: any | null;
  idNumber: string | null;
};

type MyNodeTypeView = ViewProps & {
  myNodeInfo: MyNodeInfo | null;
  setAsBackground: (url: string) => void;
  setAsAvstar: (url: string) => void;
};

const MyNTFView = ({
  myNodeInfo,
  setAsBackground,
  setAsAvstar,
}: MyNodeTypeView) => {
  const [showOperate, setShowOperate] = React.useState(false);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const itemWidth = (windowWidth - 30) / 2;

  // const itemHeight = (windowWidth - 40) * 0.9;

  const onCardOperateEvent = () => {
    setShowOperate(true);
  };

  return (
    <View
      style={{
        flex: 1,
        // width: 80,
        height: 180,
        // backgroundColor: "gray",
        padding: 5,
        // paddingRight: 10,
        borderRadius: 10,
        borderColor: buttonGray50Color,
        borderWidth: 1,
        marginHorizontal: 5,
        marginTop: 5,
      }}
    >
      <View
        style={{
          borderRadius: 10,
          borderColor: buttonGray50Color,
          borderWidth: 1,
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageBackground
          style={{ width: "100%", height: "100%" }}
          contentFit="fill"
          source={myNodeInfo?.icon}
        >
          {showOperate && (
            <View
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                left: 0,
                bottom: 0,
                backgroundColor: buttonGray25Color,
                borderRadius: 10,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 0,
                paddingVertical: 5,
                // width: "80%",
              }}
            >
              <Pressable
                onPress={() => {
                  setAsBackground(myNodeInfo?.icon);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgb(37,37,37)",
                  borderRadius: 15,
                  height: 30,
                  marginHorizontal: 10,
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    color: "rgb(200,200,200)",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  Set as background
                </Text>
              </Pressable>
              {/* <Divider
                style={{ height: 1, width: "100%" }}
                color={buttonGray30Color}
              ></Divider> */}
              <Pressable
                onPress={() => {
                  setAsAvstar(myNodeInfo?.icon);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: "rgb(37,37,37)",
                  alignItems: "center",

                  borderRadius: 15,
                  height: 30,
                  marginHorizontal: 10,
                  marginTop: 15,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    color: "rgb(200,200,200)",
                    fontSize: 12,
                    textAlign: "center",

                    // backgroundColor: "green",
                  }}
                >
                  Set as avatar
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowOperate(false)}
                style={{
                  width: "100%",
                  height: 40,
                  marginTop: 10,
                  paddingRight: 10,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("@/assets/images/mine/node/node_close.png")}
                  contentFit="contain"
                ></Image>
              </Pressable>
            </View>
          )}
        </ImageBackground>
      </View>
      {!showOperate && (
        <View
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            width: 20,
            height: 20,
          }}
        >
          <Pressable onPress={onCardOperateEvent}>
            <Image
              style={{ width: "100%", height: "100%" }}
              source={require("@/assets/images/mine/node/node_more.png")}
              contentFit="contain"
            ></Image>
          </Pressable>
        </View>
      )}
      {!showOperate && (
        <View
          style={{
            position: "absolute",
            bottom: 20,
            left: 15,
            // width: 25,
            height: 15,
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            #{myNodeInfo?.idNumber}
          </Text>
        </View>
      )}
    </View>
  );
};

// 空Node占位
const MyNodeEmptyView = () => {
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
          style={{ width: windowWidth * 0.7, height: windowWidth * 0.6 }}
          source={require("@/assets/images/mine/node/node_empty.png")}
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

const MyFriendList = (callback: NFTViewProps) => {
  return <View></View>;
};

type FriendViewType = {
  name: string;
  icon: any;
};

const mockFriendItems: FriendViewType[] = [
  {
    name: "Abby05547",
    icon: require("@/assets/images/mine/friends/friend_01.png"),
  },
  {
    name: "Aveeeee",
    icon: require("@/assets/images/mine/friends/friend_02.png"),
  },
  {
    name: "BestNFT",
    icon: require("@/assets/images/mine/friends/friend_03.png"),
  },
  {
    name: "Cargocargo",
    icon: require("@/assets/images/mine/friends/friend_01.png"),
  },
  {
    name: "Abby05547",
    icon: require("@/assets/images/mine/friends/friend_02.png"),
  },
];

const FriendView = ({ name, icon }: FriendViewType) => (
  <>
    <View
      style={{
        // height: 100,
        backgroundColor: buttonGrayBgColor,
        borderColor: buttonGray30Color,
        borderWidth: 1,
        borderRadius: 30,
        marginHorizontal: 20,
        marginVertical: 5,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          height: 60,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            // backgroundColor: "green",
            borderRadius: 20,
            // marginLeft: 20,
          }}
        >
          <Image source={icon} style={{ width: "100%", height: "100%" }} />
        </View>
        <Text style={{ flex: 1, marginLeft: 15, color: "white" }}>{name}</Text>
        <Image
          source={require("@/assets/images/login/login_x.png")}
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: buttonGray50Color,
          }}
        ></Image>
        <Image
          source={require("@/assets/images/login/login_telegram.png")}
          style={{
            width: 20,
            height: 20,
            // marginRight: 25,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: buttonGray50Color,
          }}
        ></Image>
      </View>
    </View>
  </>
);

export default function mineScreen() {
  const router = useRouter();
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"}></StatusBar>
      <Stack.Screen
        options={{
          title: "Set NFT as avatar",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: Squealt3Regular,
          },
          headerRight: (props) => (
            <Pressable
              onPress={() => {
                // router.push("/setting");
                // router.push("/order");
              }}
            >
              <RightLogoView marginRight={-5}></RightLogoView>
            </Pressable>
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

      <BackgroundView x={"100%"} y={"100%"} rx={"70%"} ry={"30%"}>
        {/* <UserHeaderView></UserHeaderView>
        <View style={{ height: 10 }}></View> */}
        <MyNodeView
          callbackEvent={function (): void {
            throw new Error("Function not implemented.");
          }}
        ></MyNodeView>
      </BackgroundView>
    </View>
    // </PaperProvider>
  );
}

const myNodeItems: MyNodeInfo[] = [
  {
    type: "Google",
    icon: require("@/assets/images/mine/node/node_01.png"),
    idNumber: "0719",
  },
  {
    type: "X",
    icon: require("@/assets/images/mine/node/node_02.png"),
    idNumber: "5481",
  },
  {
    type: "Farcaster",
    icon: require("@/assets/images/mine/node/node_03.png"),
    idNumber: "7652",
  },
  {
    type: "Telegram",
    icon: require("@/assets/images/mine/node/node_04.png"),
    idNumber: "7653",
  },
  {
    type: "Continue with wallet",
    icon: require("@/assets/images/mine/node/node_05.png"),
    idNumber: "7658",
  },
  {
    type: "X",
    icon: require("@/assets/images/mine/node/node_06.png"),
    idNumber: "7658",
  },
];

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
