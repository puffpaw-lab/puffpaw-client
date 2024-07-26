import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ViewProps,
  ActivityIndicator,
  DimensionValue,
} from "react-native";
import { Image, ImageBackground } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import {
  Redirect,
  router,
  Stack,
  useFocusEffect,
  useNavigation,
} from "expo-router";
import { useMMKVBoolean, useMMKVObject } from "react-native-mmkv";
import {
  ConnectVapeViewState,
  ConnectViewState,
  ConstantStorage,
  LocalBLEPairedDeviceInfo,
  LocalMyVapeNodeInfo,
  LocalSmokeInfo,
} from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import {
  buttonBgColor,
  buttonGray150Color,
  buttonGray200Color,
  buttonGray30Color,
  buttonGray50Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";
import { OneDayMinPuff, percent10WinHeight } from "@/constants/CommonUtils";
import { CurrentNodeView } from "./CurrentNodeView";
import { CurrentVapeDetailView } from "./CurrentVapeDetailView";
import { CLOG } from "@/constants/LogUtils";
import { CustomDialog, DialogUtils } from "@/constants/DialogUtils";

type NodeOrVapeState = "node" | "vape";

type ConnectedViewProp = ViewProps & {
  localPairedVapeInfo: LocalBLEPairedDeviceInfo | null | undefined;
  callback: () => void;
  unPairedCallback: () => void;
};

// 已经连接上的视图
export const ConnectedView = ({
  callback,
  localPairedVapeInfo,
  unPairedCallback,
}: ConnectedViewProp) => {
  const [nodeOrVapeState, setNodeOrVapeState] =
    useState<NodeOrVapeState>("node");

  // 抽烟状态
  const [currentSmokeInfo, setCurrentSmokeInfo] = useState<LocalSmokeInfo>({
    state: "Inactive",
  });

  // curent node 页面状态
  const [connectViewState, setConnectViewState] =
    useState<ConnectViewState>("idle");

  // vape detail 页面状态切换
  const [connectVapeState, setConnectVapeState] =
    useState<ConnectVapeViewState>("idle");
  const [vapeCodeVisible, setVapeCodeVisible] = useState(false);

  // 算力
  const [hashPower, setHashPower] = useState<string | null>(null);
  // 烟弹加成
  const [currentPodIncreace, setCurrentPodIncreace] = useState<string | null>(
    null
  );

  // 剩余口数
  const [remainingPff, setRemainingPff] = useState<number | null>(null);

  // 剩余口数百分比
  const [remainingPffPercent, setRemainingPffPercent] = useState<
    DimensionValue | undefined
  >("0%");

  // Connect - Current Node 信息
  const [localConnectNodeInfo, setLocalConnectNodeInfo] =
    useState<LocalMyVapeNodeInfo | null>(null);

  // 算力和pff的转换关系
  const [currentCapacityRatio, setCurrentCapacityRatio] = useState<
    number | null
  >(null);

  // 临时修改
  const onTempPuffStateEvent = () => {
    let tempSmokeInfo: LocalSmokeInfo | null = null;

    switch (currentSmokeInfo.state) {
      case "Inactive":
        tempSmokeInfo = {
          state: "NoneCompliance",
          remainingTime: 1100,
          current: 20,
          currentCapacity: 3.2,
        };
        break;
      case "NoneCompliance":
        tempSmokeInfo = {
          state: "Compliance",
          remainingTime: 1000,
          current: 60,
          currentCapacity: 1.2,
        };
        break;
      case "Compliance":
        tempSmokeInfo = {
          state: "OverPuffed",
          remainingTime: 800,
          current: 140,
          currentCapacity: 12,
        };
        break;
      case "OverPuffed":
        tempSmokeInfo = { state: "Inactive" };
        break;
    }

    CLOG.info(tempSmokeInfo);
    setCurrentSmokeInfo(tempSmokeInfo);
  };

  // 页面连接状态
  const onConnectViewStateEvent = (state: ConnectVapeViewState) => {
    if (connectViewState === "idle") {
      setConnectViewState("pairing");
      onPairWithNode();
    }
  };

  // 页面连接状态
  const onConnectVapeStateEvent = (state: ConnectVapeViewState) => {
    setConnectVapeState(state);
  };

  // TODO:【Connect - current node 页面】Pair with a node 信息,此时蓝牙连接上的设备没有绑定Nft
  const onPairWithNode = () => {
    // 模拟绑定nft成功事件
    setTimeout(() => {
      // 获取nft信息

      setLocalConnectNodeInfo({
        tokenId: "0781",
        rareRate: "12",
        rareRatePff: "50-100", //
        pairedPods: "A/B/C",
        plusModel: "A",
        icon: require("@/assets/images/nft/nft_bear.png"), // 图标

        ownedBy: "01xkjlsdjflsdfj123213",
        stakingStatus: true,
      });

      setConnectViewState("paired");
    }, 1500);

    // 模拟绑定nft失败事件
    // setTimeout(() => {
    //   //
    //   setConnectViewState("idle");
    //   DialogUtils.showError("NFT bind error");
    // }, 1500);
  };

  // TODO:【Connect - current node 页面】Unbind Node
  const onUnBindNodeEvent = () => {
    // 模拟取消绑定Node成功事件
    setTimeout(() => {
      // 获取nft信息

      setLocalConnectNodeInfo(null);
      setConnectViewState("idle");
      DialogUtils.showSuccess("Unbind node success");
    }, 1000);

    // 模拟取消绑定Node失败事件
    setTimeout(() => {
      //
      // DialogUtils.showError("NFT bind error");
    }, 1500);
  };

  // TODO:【Connect页面】获取 Current Pod 加成 信息
  const getCurrentPodPlus = () => {
    setTimeout(() => {
      setCurrentPodIncreace("1.2333");
    }, 1500);
  };

  // TODO:【Connect页面】获取 hash power 信息
  const getHashPowerInfo = () => {
    setTimeout(() => {
      setHashPower("1.3");
    }, 500);
  };

  // TODO:【Connect页面】获取 remaining pff 信息
  const getRemainingPffInfo = () => {
    setTimeout(() => {
      setRemainingPff(10);
    }, 1000);
  };

  // TODO:【Connect - node 页面】获取 当前连接的设备绑定nft 信息
  const getCurrentNodeBindStatusInfo = () => {
    setTimeout(() => {
      setConnectViewState("idle");
    }, 1000);
  };

  // TODO:【Connect - Vape Details 页面】获取 是否是当vape的owner
  const getVapeDetailsBindStatusInfo = () => {
    // 如果是vape的拥有者
    setTimeout(() => {
      setConnectVapeState("paired");

      // 更新进度信息
      getVapeDetailsProgressInfo();
    }, 1000);

    // 如果不是vape的拥有者
    setTimeout(() => {
      setConnectVapeState("idle");
    }, 500);
  };

  // TODO:【Connect - Vape Details 页面】获取 当前Progress
  const getVapeDetailsProgressInfo = () => {
    // 模拟获取到了进度信息
    setTimeout(() => {
      // 抽烟状态
      // const [currentSmokeInfo, setCurrentSmokeInfo] = useState<LocalSmokeInfo>({
      //   state: "Inactive",
      // });

      // LocalSmokeInfo

      // state: VapeSmokingState;
      // remainingTime?: number | null;
      // currentCapacity?: number | null;
      // // total?: number | null;
      // current?: number | null;

      // 获取算力和pff的转换关系
      getVapeDetailsProgressCapacityInfo();

      // 参考上述字段
      // TODO: 【Connect - Vape Details 页面】服务端 模拟获取到了具体的信息
      onTempPuffStateEvent();
    }, 1000);
  };

  // TODO:【Connect - Vape Details 页面】获取 当前Progress 的Current Capacity 转换
  const getVapeDetailsProgressCapacityInfo = () => {
    // 模拟获取到了capacity 和pff转换
    setTimeout(() => {
      setCurrentCapacityRatio(286);
    }, 1000);
  };

  // 页面可见时
  useFocusEffect(
    useCallback(() => {
      getHashPowerInfo();
      getCurrentPodPlus();
      getRemainingPffInfo();

      // current node 页面状态
      getCurrentNodeBindStatusInfo();

      // current node 页面状态
      getVapeDetailsBindStatusInfo();
    }, [localPairedVapeInfo])
  );

  // 计算剩余口数展示
  useEffect(() => {
    if (remainingPff) {
      let percent = ((OneDayMinPuff - remainingPff) / OneDayMinPuff) * 100;
      if (percent > 100) {
        percent = 100;
      }

      setRemainingPffPercent(`${percent}%`);
    }
  }, [remainingPff]);

  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <ScrollView
        style={{ width: "100%", height: "100%", paddingHorizontal: 20 }}
      >
        <TopView
          localPairedVapeInfo={localPairedVapeInfo}
          hashPower={hashPower}
          currentPodIncreace={currentPodIncreace}
          remainingPff={remainingPff}
          callback={() => {}}
          unPairedCallback={unPairedCallback}
        ></TopView>
        {/* <CenterView></CenterView> */}

        {/* 设备大图 */}
        <View
          style={{
            borderRadius: 20,
            padding: 10,
            paddingBottom: 20,
            // backgroundColor: buttonGrayBgColor,
            marginTop: 10,
          }}
        >
          <View
            style={{
              alignSelf: "center",
              alignContent: "center",
            }}
          >
            <Image
              style={{ width: 150, height: 150 * (327 / 210.0) }}
              source={require("@/assets/images/nft/nft_device_02.png")}
            ></Image>
          </View>
          <View
            style={{
              marginTop: 50,
              //   width: 180,
            }}
          >
            <Text
              style={{
                fontFamily: Squealt3Regular,
                fontSize: 13,
                color: "gray",
              }}
            >
              Remaining: {remainingPff ?? 0} pffs
            </Text>

            <View
              style={{
                marginTop: 5,
                backgroundColor: buttonGray30Color,
                width: "100%",
                borderRadius: 3.5,
              }}
            >
              <View
                style={{
                  // marginTop: 5,
                  height: 7,
                  backgroundColor: buttonGray30Color,
                  width: "100%",
                  borderRadius: 3.5,
                }}
              ></View>
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  // marginTop: 5,
                  borderRadius: 3.5,
                  height: 7,
                  backgroundColor: buttonBgColor,
                  width: remainingPffPercent,
                }}
              ></View>
            </View>

            {/* <View style={{ margin: 0, marginTop: 5 }}>
              <Image
                style={{
                  height: 8,
                  width: "100%",
                  borderRadius: 5,
                  // flex: 1,
                }}
                source={require("@/assets/images/nft/nft_progress.png")}
              ></Image>
            </View> */}
          </View>
          <Pressable
            onPress={() => setVapeCodeVisible(true)}
            style={{
              // width: 30,
              // height: 30,
              right: 30,
              bottom: 70,
              // backgroundColor: "red",
              position: "absolute",
            }}
          >
            <Image
              style={{ width: 25, height: 20 }}
              source={require("@/assets/images/nft/scan.png")}
            ></Image>
          </Pressable>
        </View>

        {/* Node 和 Vape切换按钮 */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 5,
            marginBottom: 30,
            padding: 5,
            backgroundColor: buttonGrayBgColor,
            borderRadius: 15,
            // backgroundColor: "green",
          }}
        >
          <Pressable
            onPress={() => {
              setNodeOrVapeState("node");
            }}
            style={{
              flex: 1,
              backgroundColor:
                nodeOrVapeState === "node" ? buttonBgColor : buttonGrayBgColor,
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
                fontFamily: Squealt3Regular,
                fontSize: 14,
                color: nodeOrVapeState === "node" ? "white" : "gray",
                textAlign: "center",
              }}
            >
              Node
            </Text>
          </Pressable>
          <View style={{ width: 15 }}></View>
          <Pressable
            onPress={() => {
              setNodeOrVapeState("vape");
            }}
            style={{
              flex: 1,
              backgroundColor:
                nodeOrVapeState === "vape" ? buttonBgColor : buttonGrayBgColor,
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
                fontFamily: Squealt3Regular,
                fontSize: 14,
                color: nodeOrVapeState === "vape" ? "white" : "gray",
                textAlign: "center",
              }}
            >
              Vape Details
            </Text>
          </Pressable>
        </View>

        {/* 当前是 Node View */}
        {nodeOrVapeState === "node" && (
          <CurrentNodeView
            connectState={connectViewState}
            localPairedVapeInfo={localPairedVapeInfo}
            localConnectNodeInfo={localConnectNodeInfo}
            callback={() => {}}
            onConnectStateCallback={onConnectViewStateEvent}
            unBindNodeCallback={onUnBindNodeEvent}
          ></CurrentNodeView>
        )}

        {/* 当前是 Vape View */}
        {nodeOrVapeState === "vape" && (
          <CurrentVapeDetailView
            currentSmokeInfo={currentSmokeInfo}
            connectState={connectVapeState}
            localPairedVapeInfo={localPairedVapeInfo}
            currentCapacityRatio={currentCapacityRatio}
            callback={() => {}}
            onTempPuffStateCallback={onTempPuffStateEvent}
            onConnectStateCallback={onConnectVapeStateEvent}
          ></CurrentVapeDetailView>
        )}

        {/* <LinkedView></LinkedView> */}
        {/* <UnLinkedView></UnLinkedView> */}
        <View style={{ height: 30 }}></View>
      </ScrollView>

      {/* 输入Vape code 页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={vapeCodeVisible}
        onRequestClose={() => {
          setVapeCodeVisible(!vapeCodeVisible);
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
          <View style={{ width: 300, height: 130 / (427.0 / 470) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <Pressable
                onPress={() => setVapeCodeVisible(false)}
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

              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 18,
                  color: "rgb(193,193,193)",
                  textAlign: "center",
                  marginTop: 5,
                }}
              >
                Lease code:
              </Text>

              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 18,
                  color: "rgb(193,193,193)",
                  textAlign: "center",
                  marginTop: 30,
                }}
              >
                {localPairedVapeInfo?.leaseCode ?? "--"}
              </Text>
            </ImageBackground>
          </View>
        </View>
      </Modal>
    </View>
    // </BottomSheetModalProvider>
  );
};

type TopViewProps = ViewProps & {
  localPairedVapeInfo: LocalBLEPairedDeviceInfo | null | undefined;
  hashPower: string | null; // 算力
  currentPodIncreace: string | null; // 烟弹加成
  remainingPff: number | null; // 剩余口数
  callback: () => void;
  unPairedCallback: () => void;
};

const TopView = ({
  callback,
  localPairedVapeInfo,
  hashPower,
  currentPodIncreace,
  remainingPff,
  unPairedCallback,
}: TopViewProps) => {
  // 取消蓝牙配对
  const [unbindVisible, setUnbindVisible] = useState(false); // 取消绑定设备
  const [removeLeasing, setRemoveLeasing] = useState(false); // 取消绑定中

  const onPairedEvent = () => {
    setUnbindVisible(true);
  };

  // 取消蓝牙设备配对
  const onConfirmUnPairedEvent = () => {
    setUnbindVisible(false);

    setTimeout(() => {
      unPairedCallback();
    }, 1000);
  };
  const onCancelUnbindEvent = () => {
    setUnbindVisible(false);
  };

  return (
    <View
      style={{
        borderRadius: 20,
        padding: 10,
        paddingBottom: 20,
        // backgroundColor: "green",
      }}
    >
      <View
        style={{
          flex: 1,
          //   height: 100,
          backgroundColor: "gray",
          borderRadius: 15,
        }}
      ></View>

      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: buttonGray200Color,
            // marginTop: 30,
            fontWeight: "500",
          }}
        >
          Current Vape
        </Text>
        <Pressable
          onPress={onPairedEvent}
          style={{
            // width: 50,
            paddingHorizontal: 7,
            paddingVertical: 1,
            // height: 16,
            backgroundColor: buttonGrayBgColor,
            borderRadius: 8,
            marginLeft: 10,
            borderWidth: 1,
            borderColor: buttonGray50Color,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Image
            style={{ width: 13, height: 13, marginRight: 3 }}
            source={require("@/assets/images/nft/nft_unbind.png")}
            contentFit="contain"
          ></Image>

          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: buttonGray150Color,
              fontSize: 10,
              // marginHorizontal: 15,
            }}
          >
            Unpaired
          </Text>
        </Pressable>
      </View>
      <Text
        style={{
          fontFamily: Squealt3Regular,

          fontSize: 13,
          fontWeight: "bold",
          color: "white",
          marginTop: 8,
        }}
      >
        {localPairedVapeInfo?.deviceId ?? "--"}
      </Text>
      <Text
        style={{
          fontFamily: Squealt3Regular,
          fontSize: 13,
          fontWeight: "bold",
          color: "white",
          marginTop: 5,
        }}
      >
        Hash power : {localPairedVapeInfo?.hashPower ?? "--"}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          // alignContent: "flex-start",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 13,
            color: "white",
          }}
        >
          {`Current Pod : ${localPairedVapeInfo?.currendPod ?? "--"}`}
        </Text>
        <Image
          style={{ width: 15, height: 15, marginLeft: 8 }}
          source={require("@/assets/images/nft/arrow_up.png")}
          contentFit="contain"
        ></Image>

        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 13,
            // fontWeight: "bold",
            color: buttonBgColor,
            marginLeft: 2,
            textAlign: "center",
            // height: 10,
          }}
        >
          {currentPodIncreace ?? "--"}
        </Text>
      </View>

      {/* 移除Lease页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={unbindVisible}
        onRequestClose={() => {
          setUnbindVisible(!unbindVisible);
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
                onPress={() => setUnbindVisible(false)}
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
                  marginTop: 10,
                }}
              >
                Sure to unbind node?
              </Text>

              {/* 操作按钮 */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 30,
                  // marginBottom: 30,
                  paddingHorizontal: 20,
                  // backgroundColor: "green",
                }}
              >
                <Pressable
                  onPress={onCancelUnbindEvent}
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
                <View style={{ width: 15 }}></View>
                <Pressable
                  onPress={onConfirmUnPairedEvent}
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
                  {removeLeasing && (
                    <ActivityIndicator
                      style={{ marginRight: 10 }}
                      color={"white"}
                    ></ActivityIndicator>
                  )}
                  <Text
                    style={{
                      fontSize: 10,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Yes
                  </Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </View>
        <CustomDialog />
      </Modal>
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
    // flex: 1,
    // height: 300,
    // backgroundColor: "gray",
    // margin: 10,
    // marginLeft: 30,
  },
  chartContainer: { height: 300, backgroundColor: "gray", margin: 10 },
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
    // backgroundColor: "green",
  },
});
