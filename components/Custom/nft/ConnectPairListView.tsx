import {
  StyleSheet,
  View,
  Text,
  ViewProps,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";

import React, { useState } from "react";
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import {
  ConstantStorage,
  LocalBLEPairedDeviceInfo,
} from "@/constants/LocalStorage";
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
import {
  buttonBgColor,
  buttonGray150Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import { percent10WinHeight, percent5WinHeight } from "@/constants/CommonUtils";
import { Image, ImageBackground } from "expo-image";
import { TextInput } from "react-native-gesture-handler";
import { CustomDialog } from "@/constants/DialogUtils";

type ConnectPairListViewProp = ViewProps & {
  pairSuccessCallback: (pairedDeviceInfo: LocalBLEPairedDeviceInfo) => void; // 配对成功
  callback: () => void;
};

export const ConnectPairListView = ({
  callback,
  pairSuccessCallback,
}: ConnectPairListViewProp) => {
  const { show_vape, extra, other } = useLocalSearchParams<{
    show_vape: string;
    extra?: string;
    other?: string;
  }>();

  const showVape = show_vape === "1";

  const [vapeVisible, setVapeVisible] = useState(false);

  // 配对失败
  const [pairFailedVisible, setPairFailedVisible] = useState(false);

  // 配对一个Vape失败
  const onPairFailedVapeEvent = async () => {
    setPairFailedVisible(false);
  };

  // 创建取消配对
  const onCancelPairVapeEvent = async () => {
    setPairFailedVisible(false);
  };

  // 配对列表数据
  const [pairDatas, setPairDatas] = useState<PairDeviceInfo[] | null>(
    mockPairDatas
  );

  // TODO: 【Connect页面】配对蓝牙设备
  // 配对中事件
  const onPairingEvent = (item: PairDeviceInfo) => {
    if (!pairDatas) {
      return;
    }

    const tempDatas = pairDatas.map((e) => {
      if (e.name === item.name) {
        let tempData = { ...e };
        tempData.status = "pairing";
        return tempData;
      }
      return e;
    });

    setPairDatas(tempDatas);

    // // 模拟配对成功
    setTimeout(() => {
      onPairedSuccessEvent(item);
    }, 1500);

    // 模拟配对失败
    // setTimeout(() => {
    //   // onPairFailedEvent(item);
    // }, 1500);
  };

  // 配对成功事件
  const onPairedSuccessEvent = (item: PairDeviceInfo) => {
    if (!pairDatas) {
      return;
    }

    const tempDatas = pairDatas.map((e) => {
      if (e.name === item.name) {
        let tempData = { ...e };
        tempData.status = "paired";
        return tempData;
      }
      return e;
    });

    setPairDatas(tempDatas);

    // 更新设备信息
    pairSuccessCallback({
      deviceId: "BAKSSJKKAKS", // 设备名称
      deviceType: "1", // 设备类型
      latestConnectTime: "", // 最后更新时间
      bindWalletAddress: "0x1239801238123", // 绑定的钱包地址
      hashPower: "1.2", // 当前算力
      currendPod: "A", // TODO: 当前烟弹类型
      leaseCode: "98673736", // 出租码
    });
  };

  // 配对失败事件
  const onPairFailedEvent = (item: PairDeviceInfo) => {
    setPairFailedVisible(true);

    if (!pairDatas) {
      return;
    }

    const tempDatas = pairDatas.map((e) => {
      if (e.name === item.name) {
        let tempData = { ...e };
        tempData.status = "unpaired";
        return tempData;
      }
      return e;
    });

    setPairDatas(tempDatas);
  };

  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      {/* <BackgroundView
        style={styles.container}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      > */}
      <FlashList
        ListHeaderComponent={DeviceHeader}
        // numColumns={2}
        data={pairDatas}
        renderItem={({ item, index }) => {
          return (
            <PairListItemView
              item={item}
              onClickCallback={callback}
              onPairCallback={onPairingEvent}
            ></PairListItemView>
          );
        }}
        estimatedItemSize={150}
      />
      {/* </BackgroundView> */}

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

      {/* 租Vape失败 【区分首次租赁】 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pairFailedVisible}
        onRequestClose={() => {
          setPairFailedVisible(!pairFailedVisible);
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
          <View style={{ width: 300, height: 180 / (427.0 / 470) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <Pressable
                onPress={onCancelPairVapeEvent}
                style={{
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <Image
                  style={{ width: 20, height: 20, marginRight: 20 }}
                  contentFit="contain"
                  source={require("@/assets/images/nft/dialog/close.png")}
                  // style={styles.centeredView1}
                ></Image>
              </Pressable>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Image
                  style={{ width: 40, height: 40 }}
                  contentFit="contain"
                  source={require("@/assets/images/nft/none_vape_dialog_icon.png")}
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
                  marginTop: 15,
                }}
              >
                Please connect the correct vape device
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
                  onPress={onCancelPairVapeEvent}
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
                      fontSize: 13,
                      color: buttonBgColor,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </Pressable>
                <View style={{ width: 15 }}></View>

                <Pressable
                  onPress={onCancelPairVapeEvent}
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
                      fontSize: 13,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Got it
                  </Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </View>
        <CustomDialog />
      </Modal>
    </View>
    // </BottomSheetModalProvider>
  );
};

type PairDeviceStatus = "unpaired" | "pairing" | "paired";

type PairDeviceInfo = {
  name: string | null;
  status: PairDeviceStatus;
};

const mockPairDatas: PairDeviceInfo[] = [
  {
    name: "BSAGSDSADA",
    status: "unpaired",
  },
  {
    name: "CBGRTSDFHJ",
    status: "unpaired",
  },
];

// 链接选项
type PairListItemViewProp = ViewProps & {
  item: PairDeviceInfo;
  onClickCallback: (item: PairDeviceInfo) => void; // 点击
  onPairCallback: (item: PairDeviceInfo) => void; // 配对回调
};

const PairListItemView = ({
  item,
  onClickCallback,
  onPairCallback,
}: PairListItemViewProp) => {
  // 配对事件
  const onPairEvent = () => {
    if (item.status !== "unpaired") {
      return;
    }

    onPairCallback(item);

    // // 模拟配对成功
    // setTimeout(() => {
    // }, 1000);
  };

  return (
    <Pressable
      onPress={() => {
        // router.push({
        //   pathname: "/goods/[goods_id]",
        //   params: { goods_id: item.title },
        // });

        onClickCallback(item);
      }}
      style={{ width: "100%" }}
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
          <Text style={{ flex: 1, color: "white" }}>{item.name}</Text>
          <Pressable onPress={onPairEvent}>
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
              {item.status === "unpaired" && (
                <Text
                  style={{
                    fontFamily: Squealt3Regular,
                    color: "white",
                    fontSize: 12,
                  }}
                >
                  Pair
                </Text>
              )}
              {item.status === "paired" && (
                <Text
                  style={{
                    fontFamily: Squealt3Regular,
                    color: "white",
                    fontSize: 12,
                  }}
                >
                  Paired
                </Text>
              )}
              {item.status === "pairing" && (
                <ActivityIndicator
                  style={{}}
                  color={"white"}
                ></ActivityIndicator>
              )}
            </View>
          </Pressable>
        </HorizonBackgroundView>
      </View>
    </Pressable>
  );
};

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "flex-start",
    backgroundColor: "black",
    width: "100%",
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
