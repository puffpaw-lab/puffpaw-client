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
import { buttonBgColor, buttonGrayBgColor } from "@/constants/Colors";
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

const FriendSearchbar = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <View style={{ flex: 1, marginVertical: 10 }}>
      <SearchBar
        placeholder="Search"
        // iconColor="white"
        placeholderTextColor={"gray"}
        // traileringIcon={() => {
        //   return (
        //     <Icon
        //       size={20}
        //       source={require("@/assets/images/mine/search.png")}
        //     ></Icon>
        //   );
        // }}
        containerStyle={{ backgroundColor: "black", borderRadius: 10 }}
        // clearButtonMode="always"
        // rightIcon={<Text>Cancel</Text>}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{
          flex: 1,
          marginHorizontal: 10,
          backgroundColor: "rgb(50,50,50)",
          color: "white",
          borderRadius: 10,
        }}
      />
    </View>
  );
};

type GreetFunction = () => void;
type NFTViewProps = ViewProps & {
  callbackEvent: GreetFunction;
};

const AddNFTView = (callback: NFTViewProps) => {
  return (
    <Pressable
      onPress={() => {
        if (callback.callbackEvent) callback.callbackEvent();
      }}
    >
      <View style={styles.addFriendContainer}>
        <Image
          source={require("@/assets/images/mine/add_nft.png")}
          style={styles.headerSubIcon}
        />
        <View style={{ width: 20 }}></View>
        <Text style={{ color: "black" }}>Add NTF</Text>
      </View>
    </Pressable>
  );
};

const DATA = [
  {
    title: "First Item",
  },
  {
    title: "Second Item",
  },
  {
    title: "Third Item",
  },
  {
    title: "5 Item",
  },
  {
    title: "6 Item",
  },
  {
    title: "7 Item",
  },
  {
    title: "5 Item",
  },
  {
    title: "6 Item",
  },
  {
    title: "7 Item",
  },
];

type NFTRefreshProps = ReactElement<
  RefreshControlProps,
  string | JSXElementConstructor<any>
>;

const MyNFTList = (callback: NFTViewProps) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
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
      numColumns={2}
      data={DATA}
      renderItem={({ item, index }) => {
        // if (index == 1) {
        //   return (
        //     <AddNFTView
        //       callbackEvent={() => {
        //         if (callback.callbackEvent) callback.callbackEvent();
        //       }}
        //     ></AddNFTView>
        //   );
        // }

        return (
          <Pressable
            onPress={() => {
              // router.push({
              //   pathname: "/goods/[goods_id]",
              //   params: { goods_id: item.title },
              // });
            }}
          >
            <MyNTFView></MyNTFView>
          </Pressable>
        );
      }}
      estimatedItemSize={150}
    />
  );
};

const MyNTFView = () => {
  const [showOperate, setShowOperate] = React.useState(false);

  const onCardOperateEvent = () => {
    setShowOperate(true);
  };

  return (
    <View
      style={{
        flex: 1,
        // width: 80,
        height: 200,
        // backgroundColor: "gray",
        padding: 10,
      }}
    >
      <HorizonBackgroundView
        style={{
          borderRadius: 15,
          borderColor: "rgb(150,150,150)",
          borderWidth: 3,
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: "100%", height: "100%" }}
          source={require("@/assets/images/mine/default_ntf_01.png")}
        ></Image>
      </HorizonBackgroundView>
      <View
        style={{
          position: "absolute",
          right: 20,
          bottom: 30,
          width: 25,
          height: 25,
        }}
      >
        <Pressable onPress={onCardOperateEvent}>
          <Image
            style={{ width: "100%", height: "100%" }}
            source={require("@/assets/images/mine/ntf_operate.png")}
          ></Image>
        </Pressable>
      </View>
      {showOperate && (
        <View
          style={{
            position: "absolute",
            right: 15,
            bottom: 20,
            backgroundColor: "black",
            borderRadius: 10,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              flex: 1,
              color: "gray",
              fontSize: 13,
              height: 30,
              marginTop: 10,
              // backgroundColor: "red",
            }}
          >
            Set as background
          </Text>
          <Divider style={{}}></Divider>
          <Text
            style={{
              flex: 1,
              color: "gray",
              fontSize: 13,
              height: 30,
              // backgroundColor: "green",
            }}
          >
            Set as avatar
          </Text>
        </View>
      )}
    </View>
  );
};

const MyFriendList = (callback: NFTViewProps) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <FlashList
      ListHeaderComponent={FriendSearchbar}
      // numColumns={2}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={"white"}
          progressBackgroundColor={"white"}
          style={{ backgroundColor: "black" }}
        />
      }
      data={DATA}
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
            <FriendView></FriendView>
          </Pressable>
        );
      }}
      estimatedItemSize={150}
    />
  );
};

const FriendView = () => (
  <>
    <View
      style={{
        // height: 100,
        backgroundColor: "rgb(30,30,30)",
        borderColor: "rgb(50,50,50)",
        borderWidth: 1,
        borderRadius: 30,
        margin: 10,
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
            backgroundColor: "green",
            borderRadius: 20,
            marginLeft: 20,
          }}
        >
          <Image
            source={require("@/assets/images/mine/default_icon.png")}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <Text style={{ flex: 1, marginLeft: 15, color: "white" }}>
          My Friend 00001
        </Text>
        <Image
          source={require("@/assets/images/mine/telegram.png")}
          style={{ width: 25, height: 25, marginRight: 15 }}
        ></Image>
        <Image
          source={require("@/assets/images/mine/tuite.png")}
          style={{ width: 25, height: 25, marginRight: 25 }}
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
          title: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: (props) => (
            <Pressable
              onPress={() => {
                // router.push("/setting");
                router.push("/order");
              }}
            >
              <RightLogoView></RightLogoView>
            </Pressable>
          ),
          headerLeft: (props) => (
            <Pressable
              onPress={() => {
                router.push("/setting");
              }}
            >
              <Image
                source={require("@/assets/images/mine/setting_icon.png")}
                style={{ width: 25, height: 25, marginLeft: 15 }}
              />
            </Pressable>
          ),
        }}
      />

      <BackgroundView x={"100%"} y={"100%"} rx={"70%"} ry={"30%"}>
        <UserHeaderView></UserHeaderView>
        <MineTabView></MineTabView>
      </BackgroundView>
    </View>
    // </PaperProvider>
  );
}

const renderScene = SceneMap({
  All: MyNFTList,
  Processing: MyFriendList,
  Shiped: OrdersListAllView,
});

type RenderTabBarProp = SceneRendererProps & {
  navigationState: NavigationState<{
    key: string;
    title: string;
  }>;
};

const renderTabBar = (
  props: RenderTabBarProp,
  callbackEvent?: FunctionWithNumber
) => {
  const currentIndex = props.navigationState.index;

  const windowDimensions = Dimensions.get("window");
  const screenDimensions = Dimensions.get("screen");
  const itemWidth = windowDimensions.width / 3 - 40;

  const renderTabBarItem = (
    itemProps: TabBarItemProps<any> & { key: string },
    callbackEvent?: FunctionWithNumber
  ) => {
    const windowDimensions = Dimensions.get("window");
    const screenDimensions = Dimensions.get("screen");
    const itemWidth = (windowDimensions.width - 60) / 3;

    let index = 0;
    let title = "";
    if (itemProps.key == "All") {
      title = "NFT";
      index = 0;
    } else if (itemProps.key == "Processing") {
      title = "Friends";
      index = 1;
    }
    if (itemProps.key == "Shiped") {
      title = "Orders";
      index = 2;
    }

    const isSelected = currentIndex == index;

    return (
      <Pressable
        onPress={() => {
          if (callbackEvent) callbackEvent(index);
        }}
      >
        <View
          // style={{}}
          // mode="contained"
          // buttonColor="red"
          style={{
            borderRadius: 20,
            height: 40,
            width: itemWidth,
            marginHorizontal: 5,
            backgroundColor: isSelected ? buttonBgColor : buttonGrayBgColor,
            borderWidth: isSelected ? 0 : 1,
            borderColor: isSelected ? buttonBgColor : buttonBgColor,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
          // color={buttonBgColor}
        >
          <Text
            style={{
              color: isSelected ? "black" : buttonBgColor,
              fontFamily: Squealt3Regular,
              fontSize: 15,
              // height: 30,
              width: itemWidth,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <TabBar
      {...props}
      scrollEnabled={false}
      indicatorStyle={{
        backgroundColor: "red",
        width: 0,
        borderRadius: 0,
        height: 0,
      }}
      // style={{ backgroundColor: "black", marginHorizontal: 0 }}
      tabStyle={{
        borderRadius: 12,
      }}
      labelStyle={{
        fontSize: 16,
        color: "white",
        textTransform: "none",
        textAlign: "center",
        // height: 20,
        backgroundColor: "green",
        // width: itemWidth,
      }}
      contentContainerStyle={{ backgroundColor: "black" }}
      // indicatorContainerStyle={{
      //   marginHorizontal: 35,
      //   paddingHorizontal: 80,
      //   marginBottom: 3,
      // }}
      renderTabBarItem={(e) => renderTabBarItem(e, callbackEvent)}
      style={{ marginLeft: 15, marginVertical: 10 }}
    />
  );
};

function MineTabView() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "All", title: "My NFT" },
    { key: "Processing", title: "My Friend" },
    { key: "Shiped", title: "My Order" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy={true}
      renderTabBar={(e) =>
        renderTabBar(e, (index) => {
          setIndex(index);
        })
      }
      style={{ width: "100%" }}
    />
  );
}

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
