import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Pressable,
  Text,
  Modal,
  ActivityIndicator,
  TextInput,
  ViewProps,
} from "react-native";
import { router, Stack } from "expo-router";
import React from "react";

import { BackgroundView } from "@/components/Custom/BackgroundView";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image, ImageBackground } from "expo-image";
import { Squealt3Regular } from "@/constants/FontUtils";
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabBarItemProps,
  TabView,
} from "react-native-tab-view";
import { OrdersListAllView } from "@/components/Custom/OrderListView";
import {
  buttonBgColor,
  buttonGray150Color,
  buttonGray200Color,
  buttonGray30Color,
  buttonGray50Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import {
  formatAccount,
  percent10WinHeight,
  windowWidth,
} from "@/constants/CommonUtils";
import { FunctionWithNumber } from "@/constants/ViewProps";
import { CustomDialog, toastConfig } from "@/constants/DialogUtils";
import Toast from "react-native-toast-message";
import {
  ConnectViewState,
  LocalBLEPairedDeviceInfo,
  LocalMyVapeNodeInfo,
} from "@/constants/LocalStorage";

type CurrentNodeViewProp = ViewProps & {
  connectState: ConnectViewState;
  localPairedVapeInfo: LocalBLEPairedDeviceInfo | null | undefined;
  localConnectNodeInfo: LocalMyVapeNodeInfo | null; // 当前设备绑定的node信息
  callback: () => void;
  onConnectStateCallback: (state: ConnectViewState) => void;
  unBindNodeCallback: () => void; // 取消绑定Node事件
};

// 当前的 Node View
export const CurrentNodeView = ({
  connectState,
  localPairedVapeInfo,
  localConnectNodeInfo,
  callback,
  onConnectStateCallback,
  unBindNodeCallback,
}: CurrentNodeViewProp) => {
  // 移除lease
  const [unbindVisible, setUnbindVisible] = useState(false); // 取消绑定设备
  const [removeLeasing, setRemoveLeasing] = useState(false); // 取消绑定中

  const onUnBindEvent = () => {
    setUnbindVisible(true);
  };
  const onStakeEvent = () => {};

  // 取消绑定
  const onConfirmUnbindEvent = () => {
    setUnbindVisible(false);

    unBindNodeCallback();
  };
  const onCancelUnbindEvent = () => {
    setUnbindVisible(false);
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
        // flexDirection: "row",
        flex: 1,
        width: "100%",
      }}
    >
      {connectState === "idle" && (
        <UnPairedView
          callback={() => onConnectStateCallback("pairing")}
        ></UnPairedView>
      )}

      {connectState === "pairing" && (
        <PairingView
          callback={() => {
            // onConnectStateCallback("paired")
          }}
        ></PairingView>
      )}

      {connectState === "paired" && (
        <PairedView
          localConnectNodeInfo={localConnectNodeInfo}
          callback={() => {
            // onConnectStateCallback("idle")
          }}
          unBindCallback={onUnBindEvent}
          unStakeCallback={onStakeEvent}
        ></PairedView>
      )}

      {/* 取消node绑定页面 */}
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
                  onPress={onConfirmUnbindEvent}
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

type UnPairedViewProp = ViewProps & { callback: () => void };

// 未配对视图
const UnPairedView = ({ callback }: UnPairedViewProp) => {
  return (
    <View style={{ ...styles.topContainer }}>
      <View
        style={{
          borderRadius: 20,
          padding: 20,
          paddingBottom: 20,
          backgroundColor: "rgb(30,30,30)",
        }}
      >
        <View
          style={{
            flex: 1,
            //   height: 100,
            // backgroundColor: "gray",
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
              fontFamily: Squealt3Regular,
              fontSize: 16,
              color: buttonGray200Color,
              // marginTop: 30,
              // fontWeight: "500",
            }}
          >
            Current Node
          </Text>
        </View>

        <View
          style={{
            // flexDirection: "row",
            justifyContent: "flex-start",
            // alignContent: "flex-start",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,

              fontSize: 14,
              color: "white",
              marginTop: 40,
              fontWeight: "500",
            }}
          >
            You don't hava a node yet.
          </Text>
          <Pressable
            onPress={() => {
              callback();
            }}
            style={{
              height: 40,
              width: 170,
              backgroundColor: buttonBgColor,
              borderRadius: 20,
              justifyContent: "center",
              // alignContent: "flex-start",
              alignItems: "center",
              marginVertical: 30,
            }}
          >
            <Text
              style={{
                fontFamily: Squealt3Regular,

                fontSize: 14,
                color: "white",
                // marginTop: 30,
                fontWeight: "500",
              }}
            >
              Pair with a node
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

type PairingViewProp = ViewProps & { callback: () => void };

// 配对中 View
export const PairingView = ({ callback }: PairingViewProp) => {
  useEffect(() => {
    const clear = setTimeout(() => {
      callback();
    }, 2000);
    return () => {
      clearTimeout(clear);
    };
  }, []);

  return (
    <View style={{ ...styles.topContainer }}>
      <View
        style={{
          borderRadius: 20,
          padding: 20,
          paddingBottom: 20,
          backgroundColor: "rgb(30,30,30)",
        }}
      >
        <View
          style={{
            flex: 1,
            //   height: 100,
            // backgroundColor: "gray",
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
              fontFamily: Squealt3Regular,
              fontSize: 16,
              color: buttonGray200Color,
              // marginTop: 30,
              // fontWeight: "500",
            }}
          >
            Current Node
          </Text>
        </View>

        <View
          style={{
            // flexDirection: "row",
            justifyContent: "flex-start",
            // alignContent: "flex-start",
            alignItems: "center",
            marginTop: 30,
            marginBottom: 50,
          }}
        >
          <ActivityIndicator
            style={{ marginRight: 10 }}
            color={"red"}
            size={"large"}
          ></ActivityIndicator>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 14,
              color: buttonGray200Color,
              textAlign: "center",
              marginTop: 10, // windowHeight * 0.2,
            }}
          >
            Searching
          </Text>
        </View>
      </View>
    </View>
  );
};

type PairedViewProp = ViewProps & {
  localConnectNodeInfo: LocalMyVapeNodeInfo | null; // 当前设备绑定的node信息

  callback: () => void;
  unBindCallback: () => void; // 取消绑定事件
  unStakeCallback: () => void; // stake事件
};

// 已经配对视图
const PairedView = ({
  localConnectNodeInfo,
  callback,
  unBindCallback,
  unStakeCallback,
}: PairedViewProp) => {
  return (
    <View
      style={{
        borderRadius: 20,
        padding: 20,
        paddingBottom: 25,
        backgroundColor: buttonGrayBgColor,
        borderColor: buttonGray30Color,
        borderWidth: 1,
        // backgroundColor: "rgb(30,30,30)",
        // backgroundColor: "yellow",
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 16,
            color: "white",
            flex: 1,
          }}
        >
          Current Node
        </Text>
        <Pressable
          onPress={unBindCallback}
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
            source={require("@/assets/images/nft/unbind.png")}
            contentFit="contain"
          ></Image>

          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: buttonGray200Color,
              fontSize: 10,
              // marginHorizontal: 15,
            }}
          >
            Unbind
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          // alignContent: "flex-start",
          alignItems: "center",
          marginTop: 8,
          // backgroundColor: "red",
        }}
      >
        <View
          style={{
            borderRadius: 10,
            // width: 100,
            // height: 100,
            // backgroundColor: "red",
            borderColor: "rgb(203,155,99)",
            borderWidth: 2,
            // marginLeft: 22,
            // marginTop: 7,
            // flex: 1,
            width: 120,
            height: 120,
          }}
        >
          <Image
            source={require("@/assets/images/nft/nft_bear.png")}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
          />
        </View>
        <View style={{ flex: 1, marginLeft: 20 }}>
          {/* Owned by */}
          <View style={styles.vapeItemContainer}>
            <Text style={[styles.vapeItemLeftText]}>Owned by</Text>
            <Text
              style={[styles.vapeItemRightText, { flex: 1 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {`${formatAccount(localConnectNodeInfo?.ownedBy ?? "--")}`}
            </Text>
          </View>

          {/* Rare Rate */}
          <View style={styles.vapeItemContainer}>
            <Text style={[styles.vapeItemLeftText]}>Rare Rate</Text>
            <Text
              style={[styles.vapeItemRightText, { flex: 1 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {localConnectNodeInfo?.rareRate} (
              {localConnectNodeInfo?.rareRatePff} pffs)
            </Text>
          </View>

          {/* Paired Pods */}
          <View style={styles.vapeItemContainer}>
            <Text style={styles.vapeItemLeftText}>Paired Pods</Text>

            <Text
              style={[styles.vapeItemRightText, { flex: 1 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {localConnectNodeInfo?.pairedPods ?? "--"}
            </Text>
          </View>

          <View></View>

          {/* Plus Model */}
          <View style={styles.vapeItemContainer}>
            <Text style={[styles.vapeItemLeftText]}>Plus Model</Text>

            <Pressable
              // onPress={onLeaseCodeEvent}
              style={{ flex: 1 }}
            >
              <Text
                style={[styles.vapeItemRightText, { flex: 1 }]}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                A
              </Text>
            </Pressable>
          </View>

          {/* Staking status */}
          {localConnectNodeInfo?.stakingStatus && (
            <View style={styles.vapeItemContainer}>
              <Text style={[styles.vapeItemLeftText, { flex: 1 }]}>
                Staking status
              </Text>
              <Pressable
                style={[styles.vapeRightImageContainer, { marginRight: 3 }]}
                onPress={unStakeCallback}
              >
                <Image
                  style={styles.vapeRightImage}
                  source={require("@/assets/images/nft/stake.png")}
                  contentFit="contain"
                ></Image>
              </Pressable>
              <Pressable
                style={{}}

                // onPress={onLeaseCodeEvent}
              >
                <Text
                  style={[styles.vapeItemRightText]}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  Staking
                </Text>
              </Pressable>
            </View>
          )}

          {/* unStaking */}
          {!localConnectNodeInfo?.stakingStatus && (
            <View style={styles.vapeItemContainer}>
              <Text style={[styles.vapeItemLeftText, { flex: 1 }]}>
                Staking status
              </Text>
              <Pressable
                style={[styles.vapeRightImageContainer, { marginRight: 3 }]}
                onPress={unStakeCallback}
              >
                <Image
                  style={styles.vapeRightImage}
                  source={require("@/assets/images/nft/nft_no_leasse.png")}
                  contentFit="contain"
                ></Image>
              </Pressable>
              <Pressable
              // style={{ flex: 1 }}

              // onPress={onLeaseCodeEvent}
              >
                <Text
                  style={[styles.vapeItemRightText, { flex: 1 }]}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  Unstake
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
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
    width: "100%",
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

  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "flex-start",
  //   backgroundColor: "black",
  // },
  vapeItemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 7,
  },
  vapeItemLeftText: {
    fontFamily: Squealt3Regular,
    fontSize: 12,
    color: buttonGray150Color,
    textAlign: "left",
  },
  vapeItemRightText: {
    fontFamily: Squealt3Regular,
    fontSize: 12,
    color: "white",
    textAlign: "right",
    flex: 1,
  },
  vapeLeftImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  vapeLeftImage: { width: 15, height: 15 },
  vapeRightImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  vapeRightImage: { width: 15, height: 15 },
  nodeItemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
});
