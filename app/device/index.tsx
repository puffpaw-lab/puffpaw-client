import {
  StyleSheet,
  View,
  Text,
  ViewProps,
  Pressable,
  Modal,
} from "react-native";

import React, { useState } from "react";
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";
import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";

import { FlashList } from "@shopify/flash-list";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { Squealt3Light, Squealt3Regular } from "@/constants/FontUtils";
import { buttonBgColor, buttonGrayBgColor } from "@/constants/Colors";
import { percent10WinHeight, percent5WinHeight } from "@/constants/CommonUtils";
import { Image, ImageBackground } from "expo-image";
import { TextInput } from "react-native-gesture-handler";

export default function deviceScreen() {
  const { show_vape, extra, other } = useLocalSearchParams<{
    show_vape: string;
    extra?: string;
    other?: string;
  }>();

  const showVape = show_vape === "1";

  const [vapeVisible, setVapeVisible] = useState(false);

  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            // fontWeight: "bold",
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
        style={styles.container}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <FlashList
          ListHeaderComponent={DeviceHeader}
          // numColumns={2}
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
                <View
                  style={{
                    paddingHorizontal: 20,
                    marginTop: 5,
                  }}
                >
                  <HorizonBackgroundView
                    style={{
                      height: 50,
                      alignItems: "center",
                      flexDirection: "row",
                      borderRadius: 15,
                      paddingHorizontal: 15,
                    }}
                  >
                    <Text style={{ flex: 1, color: "white" }}>
                      {item.title}
                    </Text>
                    <Pressable
                      onPress={() => {
                        if (showVape) {
                          setVapeVisible(true);
                        } else {
                          router.push("/device/link");
                        }
                      }}
                    >
                      <View
                        style={{
                          width: 90,
                          height: 30,
                          // marginRight: 15,
                          backgroundColor: buttonBgColor,
                          borderRadius: 15,
                          alignContent: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Squealt3Regular,
                            color: "white",
                            fontSize: 12,
                          }}
                        >
                          Pair
                        </Text>
                      </View>
                    </Pressable>
                  </HorizonBackgroundView>
                </View>
              </Pressable>
            );
          }}
          estimatedItemSize={150}
        />
      </BackgroundView>

      {/* 输入Vape code 页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={vapeVisible}
        onRequestClose={() => {
          setVapeVisible(!vapeVisible);
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
          <View style={{ width: 300, height: 220 / (427.0 / 470) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 18,
                  color: "rgb(193,193,193)",
                  textAlign: "center",
                  marginTop: 35,
                }}
              >
                Vape ID : BSAGSDSADA
              </Text>

              {/* 输入框 */}
              <View
                style={{
                  paddingHorizontal: 25,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "black",
                    width: "100%",
                    height: 40,
                    borderRadius: 12,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    marginTop: 35,
                  }}
                >
                  <TextInput
                    style={{
                      color: "white",
                      fontSize: 14,
                      height: "100%",
                      flex: 1,
                    }}
                    placeholder="Click to enter code"
                    placeholderTextColor={"rgb(85,85,85)"}
                  ></TextInput>
                  {/* <Image
                    style={{ width: 43 * 0.5, height: 24 * 0.5 }}
                    contentFit="contain"
                    source={require("@/assets/images/login/create_wallet_eye_close.png")}
                    // style={styles.centeredView1}
                  ></Image> */}
                </View>
              </View>

              {/* 提示信息 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 11,
                  color: "rgb(68,68,68)",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                *You must have a rental code from the node
              </Text>
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 11,
                  color: "rgb(68,68,68)",
                  textAlign: "center",
                }}
              >
                holder in order to rent their vape
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
                  onPress={() => {
                    if (showVape) {
                      setVapeVisible(false);
                    }
                    router.push("device/link");
                  }}
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
                    Rent
                  </Text>
                </Pressable>
                <View style={{ width: 15 }}></View>
                <Pressable
                  onPress={() => setVapeVisible(false)}
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
      </Modal>
    </View>
    // </BottomSheetModalProvider>
  );
}

const DeviceHeader = () => {
  return (
    <View
      style={{
        marginLeft: 20,
        marginTop: percent5WinHeight,
        marginBottom: 15,
      }}
    >
      <Text
        style={{
          fontFamily: Squealt3Regular,
          fontSize: 20,
          color: "gray",
          // fontWeight: "500",
        }}
      >
        Other Vapes:
      </Text>
    </View>
  );
};

type GreetFunction = () => void;

type NFTViewProps = ViewProps & {
  callbackEvent: GreetFunction;
};
const DeviceList = (callback: NFTViewProps) => {
  return (
    <FlashList
      ListHeaderComponent={DeviceHeader}
      // numColumns={2}
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
            <View
              style={{
                paddingHorizontal: 20,
                marginTop: 5,
              }}
            >
              <HorizonBackgroundView
                style={{
                  height: 50,
                  alignItems: "center",
                  flexDirection: "row",
                  borderRadius: 15,
                  paddingHorizontal: 15,
                }}
              >
                <Text style={{ flex: 1, color: "white" }}>{item.title}</Text>
                <Pressable
                  onPress={() => {
                    router.push("/device/link");
                  }}
                >
                  <View
                    style={{
                      width: 90,
                      height: 30,
                      // marginRight: 15,
                      backgroundColor: buttonBgColor,
                      borderRadius: 15,
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        color: "white",
                        fontSize: 12,
                      }}
                    >
                      Pair
                    </Text>
                  </View>
                </Pressable>
              </HorizonBackgroundView>
            </View>
          </Pressable>
        );
      }}
      estimatedItemSize={150}
    />
  );
};

const FriendView = () => (
  <View
    style={{
      paddingHorizontal: 20,
      marginTop: 10,
    }}
  >
    <HorizonBackgroundView
      style={{
        height: 50,
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 15,
      }}
    >
      <Text style={{ flex: 1, marginLeft: 15, color: "rgb(200,200,200)" }}>
        Device 00001
      </Text>
      <Pressable
        onPress={() => {
          router.push("/device/link");
        }}
      >
        <View
          style={{
            width: 100,
            height: 30,
            marginRight: 15,
            backgroundColor: buttonBgColor,
            borderRadius: 15,
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: Squealt3Regular, color: "white" }}>
            Pair
          </Text>
        </View>
      </Pressable>
    </HorizonBackgroundView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "flex-start",
    backgroundColor: "black",
  },
  topContainer: {
    // height: 250,
    backgroundColor: "gray",
    margin: 10,
    // marginLeft: 30,
    borderRadius: 20,
  },
  chartContainer: { height: 300, margin: 140 },
  image: {
    width: 200,
    height: 200,
  },
  logo: {
    width: 60,
    height: 30,
    position: "absolute",
    marginTop: 30,
    right: 20,
  },
  pagerView: {
    flex: 1,
    width: 300,
    height: 300,
    backgroundColor: "gray",
  },
  contentContainer: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "green",
  },
  card: {
    // width: "90%",
    height: 180,
    // backgroundColor: "rgb(20,20,20)",
    backgroundColor: "red",
    // margin: 5,
    // top: 10,
    // marginBottom: 20,
    // left: 20,
    // right: 20,
    // borderRadius: 25,
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
});

const DATA = [
  {
    title: "BSAGSDSADA",
  },
  {
    title: "CBGRTSDFHJ",
  },
];
