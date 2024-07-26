import { useEffect, useMemo, useRef, useState } from "react";
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

import {
  BackgroundView,
  HorizonBackgroundView,
} from "@/components/Custom/BackgroundView";
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
  Colors,
} from "@/constants/Colors";
import {
  formatAccount,
  formatCountDownTime,
  OneDayCapacityPuff,
  OneDayMaxPuff,
  OneDayMinPuff,
  percent10WinHeight,
  windowWidth,
} from "@/constants/CommonUtils";
import { FunctionWithNumber } from "@/constants/ViewProps";
import { CustomDialog, toastConfig } from "@/constants/DialogUtils";
import Toast from "react-native-toast-message";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import CircularProgress from "react-native-circular-progress-indicator";
import {
  ConnectVapeViewState,
  LocalBLEPairedDeviceInfo,
  LocalSmokeInfo,
} from "@/constants/LocalStorage";
import { CLOG } from "@/constants/LogUtils";

type CurrentVapeDetailViewProp = ViewProps & {
  currentSmokeInfo: LocalSmokeInfo;
  connectState: ConnectVapeViewState;
  localPairedVapeInfo: LocalBLEPairedDeviceInfo | null | undefined;
  currentCapacityRatio: number | null;
  callback: () => void;
  onTempPuffStateCallback?: () => void;
  onConnectStateCallback: (state: ConnectVapeViewState) => void;
};

// 当前的 Node View
export const CurrentVapeDetailView = ({
  currentSmokeInfo,
  connectState,
  localPairedVapeInfo,
  currentCapacityRatio,
  callback,
  onTempPuffStateCallback,
  onConnectStateCallback,
}: CurrentVapeDetailViewProp) => {
  // 租用一个Vape
  const [rentVapeVisible, setRentVapeVisible] = useState(false);
  const [rentVapeEyeVisible, setRentVapeEyeVisible] = useState(false);
  const [rentVapePassword, setRentVapePassword] = useState(""); // privy-login
  const [renting, setRentVaping] = useState(false); // 创建钱包中

  // 租赁失败
  const [rentFailedVisible, setRentFailedVisible] = useState(false);

  // 是否是首次租赁失败
  const [firstRentFailed, setFirstRentFailed] = useState(false);

  // 租用一个Vape失败
  const onRentFailedVapeEvent = async () => {
    setRentFailedVisible(false);
  };

  // 创建租用一个Vape
  const onCancelRentVapeEvent = async () => {
    setRentVaping(false);
    setRentVapeVisible(false);

    setRentFailedVisible(true);

    // setRentVaping(false);
    // setRentVapeVisible(false);

    // onConnectStateCallback("pairing");
  };

  // 创建租用一个Vape
  const onRentVapeEvent = async () => {
    setRentVaping(false);
    setRentVapeVisible(false);

    onConnectStateCallback("pairing");
  };

  // 取消租用一个Vape
  const cancelRentVapeEvent = () => {
    setRentVaping(false);
    setRentVapeVisible(false);
  };

  // 临时修改
  const onTempPuffStateEvent = () => {
    if (onTempPuffStateCallback) {
      onTempPuffStateCallback();
    }
  };

  // 隐藏租用Vape失败的结果
  const onHideRentFailedEvent = () => {
    setRentFailedVisible(false);
    setFirstRentFailed(false);
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
      {connectState == "idle" && (
        <UnPairedView callback={() => setRentVapeVisible(true)}></UnPairedView>
      )}

      {connectState == "pairing" && (
        <PairingView
          callback={() => onConnectStateCallback("paired")}
        ></PairingView>
      )}

      {connectState == "paired" && (
        <PairedView
          smokeInfo={currentSmokeInfo}
          currentCapacityRatio={currentCapacityRatio}
          callback={() => onConnectStateCallback("idle")}
          puffStateCallback={onTempPuffStateEvent}
        ></PairedView>
      )}

      {/* 租一个Vape */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={rentVapeVisible}
        onRequestClose={() => {
          setRentVapeVisible(!rentVapeVisible);
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
          <View style={{ width: 300, height: 290 / (427.0 / 470) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <Pressable
                onPress={() => setRentVapeVisible(false)}
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

              {/* <Text style={styles.modalText}>Hello World!</Text> */}
              {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable> */}

              {/* 文本内容 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 16,
                  color: "white",
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                Vape ID: BSAGSDSADA
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
                    marginTop: 25,
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
                    placeholderTextColor={"rgb(59,59,59)"}
                    value={rentVapePassword}
                    onChangeText={setRentVapePassword}
                    secureTextEntry={!rentVapeEyeVisible}
                    maxLength={20}
                  ></TextInput>
                </View>
              </View>

              {/* 提示信息 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 11,
                  color: buttonGray150Color,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                *First time rentals can be rented using a rental
              </Text>
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 11,
                  color: buttonGray150Color,
                  textAlign: "center",
                }}
              >
                code, gas costs are covered by the platform.
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
                  onPress={onCancelRentVapeEvent}
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
                  onPress={onRentVapeEvent}
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
                  {renting && (
                    <ActivityIndicator
                      style={{ marginRight: 10 }}
                      color={"white"}
                    ></ActivityIndicator>
                  )}
                  <Text
                    style={{
                      fontSize: 13,
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

      {/* 租Vape失败 【区分首次租赁】 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={rentFailedVisible}
        onRequestClose={() => {
          setRentFailedVisible(!rentFailedVisible);
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
          <View style={{ width: 300, height: 270 / (427.0 / 470) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <Pressable
                onPress={onHideRentFailedEvent}
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
                Unavailable for lease
              </Text>

              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 12,
                  color: "white",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                You're already bound to another vape and can't
              </Text>
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 12,
                  color: "white",
                  textAlign: "center",
                  marginTop: 2,
                }}
              >
                rent it
              </Text>
              {/* 提示信息 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 12,
                  color: buttonGray150Color,
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                *First rental without gas fee
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
                  onPress={onHideRentFailedEvent}
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
                  onPress={onHideRentFailedEvent}
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
                  {renting && (
                    <ActivityIndicator
                      style={{ marginRight: 10 }}
                      color={"white"}
                    ></ActivityIndicator>
                  )}
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
            Current Progress
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
            You're not an vape owner.
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
              Rent a vape
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
            Current Progress
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
            Renting
          </Text>
        </View>
      </View>
    </View>
  );
};

type PairedViewProp = ViewProps & {
  smokeInfo: LocalSmokeInfo; // 抽烟信息
  currentCapacityRatio: number | null; // capacity转换关系比例
  callback: () => void;
  puffStateCallback: () => void;
};

// 已经配对视图
const PairedView = ({
  smokeInfo,
  currentCapacityRatio,
  callback,
  puffStateCallback,
}: PairedViewProp) => {
  let puffDesc = `${smokeInfo.state}`;

  const rightText =
    smokeInfo.state === "Compliance" || smokeInfo.state === "OverPuffed"
      ? OneDayMaxPuff
      : OneDayMinPuff;

  let percentValue = 0;
  if (smokeInfo.current) {
    percentValue = (smokeInfo.current / rightText) * 100;
  }

  let circleBGColor = "rgb(39,39,39)";
  let activeStrokeColor: string | null = buttonBgColor;
  let activeStrokeSecondaryColor: string | null = null;
  let inActiveStrokeColor: string | null = buttonGray30Color;

  switch (smokeInfo.state) {
    case "Inactive":
      inActiveStrokeColor = buttonGray50Color;
      break;
    case "NoneCompliance":
      break;
    case "Compliance":
      activeStrokeSecondaryColor = buttonGray30Color;
      break;
    case "OverPuffed":
      circleBGColor = "rgb(105,105,105)";
      activeStrokeColor = buttonGray150Color;
      inActiveStrokeColor = buttonGray150Color;
      activeStrokeColor = buttonGray150Color;
      break;
  }

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
          Current Progess
        </Text>
        <Pressable
          onPress={() => {
            router.push("/trend/vape_index");
          }}
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
          {/* <Image
            style={{ width: 13, height: 13, marginRight: 3 }}
            source={require("@/assets/images/nft/nft_unbind.png")}
            contentFit="contain"
          ></Image> */}

          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: buttonGray150Color,
              fontSize: 10,
              // marginHorizontal: 15,
            }}
          >
            History
          </Text>
        </Pressable>
      </View>

      {/* Puff状态 */}
      <PuffDescView
        smokeInfo={smokeInfo}
        currentCapacityRatio={currentCapacityRatio}
        callback={() => {}}
        puffStateCallback={puffStateCallback}
      ></PuffDescView>

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
        <View style={{ flex: 5 }}>
          {/* Smoking State */}
          <View style={styles.vapeItemContainer}>
            <Text style={[styles.vapeItemLeftText]}>Smoking State</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {smokeInfo.state !== "Inactive" && (
                <Pressable
                  style={[styles.vapeRightImageContainer, { marginRight: 5 }]}
                  // onPress={onShowLeaseEvent}
                >
                  <AnimatedCircularProgress
                    size={25}
                    width={3}
                    fill={percentValue}
                    tintTransparency={true}
                    rotation={270}
                    arcSweepAngle={180}
                    tintColor={activeStrokeColor}
                    backgroundColor={inActiveStrokeColor}
                    // // dashedTint={{ width: 10, gap: 2 }}
                    lineCap="round"
                  >
                    {(fill) => (
                      <Image
                        style={{
                          width: 10,
                          height: 10,
                          transform: [{ rotate: `-${100 - percentValue}deg` }],
                        }}
                        source={require("@/assets/images/nft/nft_indicator.png")}
                        contentFit="contain"
                      ></Image>
                    )}
                  </AnimatedCircularProgress>
                </Pressable>
              )}
              <Text
                style={[styles.vapeItemRightText, { flex: 1 }]}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {puffDesc}
              </Text>
            </View>
          </View>

          {/* Remaining time */}
          <View style={styles.vapeItemContainer}>
            <Text style={[styles.vapeItemLeftText]}>Remaining time</Text>
            {/* <Text
              style={[styles.vapeItemRightText, { flex: 1 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {smokeInfo.remainingTime ?? "--"}
              {remainingTimes}
            </Text> */}
            <CountDownView
              remainingTimes={smokeInfo.remainingTime}
              callback={() => {}}
            ></CountDownView>
          </View>

          {/* Current capacity */}
          <View style={styles.vapeItemContainer}>
            <Text style={styles.vapeItemLeftText}>Current capacity</Text>

            <Text
              style={[styles.vapeItemRightText, { flex: 1 }]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {`${smokeInfo.currentCapacity ?? "0"} ≈ ${
                (smokeInfo.currentCapacity ?? 0) * (currentCapacityRatio ?? 0)
              } pffs`}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 4,
            flexDirection: "row",
            justifyContent: "flex-end",
            // alignItems: "center",
          }}
        >
          <View
            style={{
              // borderRadius: 10,
              // borderColor: "rgb(203,155,99)",
              // borderWidth: 2,
              width: 80,
              height: 80,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress
              value={percentValue}
              rotation={0}
              radius={60}
              duration={500}
              activeStrokeWidth={15}
              inActiveStrokeWidth={15}
              strokeLinecap={"butt"}
              allowFontScaling={true}
              progressValueColor={"white"}
              progressValueFontSize={23}
              progressValueStyle={{
                fontFamily: Squealt3Regular,
                fontWeight: "bold",
              }}
              circleBackgroundColor={"black"}
              activeStrokeColor={activeStrokeColor}
              activeStrokeSecondaryColor={activeStrokeSecondaryColor}
              inActiveStrokeColor={inActiveStrokeColor}
              progressFormatter={(value: number) => {
                "worklet";
                // return value.toFixed(2);

                return `${smokeInfo.current ?? 0}/${rightText}`; // 2 decimal places
              }}
            />
            {/* <AnimatedCircularProgress
              size={80}
              width={10}
              fill={50}
              tintTransparency={true}
              rotation={0}
              tintColor={buttonBgColor}
              backgroundColor={circleBGColor}
              lineCap="round"
            > */}
            {/* {(fill) => (
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontWeight: "bold",
                    fontFamily: Squealt3Regular,
                  }}
                >{`120/100`}</Text>
              )} */}
            {/* </AnimatedCircularProgress> */}

            {/* <Image
              source={require("@/assets/images/nft/nft_bear.png")}
              style={{ width: "100%", height: "100%" }}
              contentFit="contain"
            /> */}
          </View>
        </View>
      </View>
    </View>
  );
};

// puff 状态描述
const PuffDescView = ({
  smokeInfo,
  callback,
  puffStateCallback,
}: PairedViewProp) => {
  let textColor = buttonGray200Color;
  let lineCoror = [buttonGray50Color, "black"];
  let longDesc = "";

  switch (smokeInfo.state) {
    case "Inactive":
      longDesc = "Waiting for the lase data to be onchain";
      break;
    case "NoneCompliance":
      longDesc = `${
        OneDayMinPuff - (smokeInfo.current ?? 0)
      } more puffs and you're done :)`;
      textColor = buttonBgColor;
      lineCoror = [Colors.dark.leftLinear, Colors.dark.rightLinear];
      // puffDesc = "";
      break;
    case "Compliance":
      if (smokeInfo.current) {
        longDesc = `${
          OneDayMaxPuff - (smokeInfo.current ?? 0)
        } more puffs and you're over the limit :|`;
      }

      textColor = buttonBgColor;
      lineCoror = [Colors.dark.leftLinear, Colors.dark.rightLinear];
      // puffDesc = "";
      break;
    case "OverPuffed":
      longDesc = "You $PUFFed too much's suitable :(";
      // puffDesc = "";
      break;
  }

  return (
    <HorizonBackgroundView
      linearColors={lineCoror}
      style={{
        backgroundColor: buttonGray50Color,
        borderRadius: 8,
        marginTop: 10,
        // borderWidth: 1,
        // borderColor: buttonGray50Color,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingLeft: 10,
      }}
    >
      {/* <Image
          style={{ width: 13, height: 13, marginRight: 3 }}
          source={require("@/assets/images/nft/nft_unbind.png")}
          contentFit="contain"
        ></Image> */}
      <Pressable onPress={puffStateCallback} style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: Squealt3Regular,
            color: textColor,
            fontSize: 11,
            // marginHorizontal: 15,
            marginVertical: 7,
            textAlign: "left",
            flex: 1,
          }}
        >
          {longDesc}
        </Text>
      </Pressable>
    </HorizonBackgroundView>
  );
};

type CountDownViewProp = ViewProps & {
  remainingTimes: number | null | undefined; // 倒计时
  callback: () => void;
};

// puff 倒计时
const CountDownView = ({ remainingTimes }: CountDownViewProp) => {
  // 剩余时间
  const [currentRemainingTimes, setCurrentRemainingTimes] = useState(0);

  useEffect(() => {
    // CLOG.info(`countDown1 ${currentRemainingTimes}`);

    const _clearInterval = setInterval(() => {
      if (currentRemainingTimes && currentRemainingTimes > 0) {
        const c = currentRemainingTimes - 1;

        if (c < 0) {
          clearInterval(_clearInterval);
          return;
        }

        setCurrentRemainingTimes(c);
        // CLOG.info(`countDown2 ${currentRemainingTimes}`);
      } else {
        // CLOG.info(`countDown3 ${currentRemainingTimes}`);
      }
    }, 1000);
    return () => clearInterval(_clearInterval);
  });

  useEffect(() => {
    if (remainingTimes) setCurrentRemainingTimes(remainingTimes);
  }, [remainingTimes]);

  return (
    <Text
      style={[styles.vapeItemRightText, { flex: 1 }]}
      ellipsizeMode="tail"
      numberOfLines={1}
    >
      {formatCountDownTime(currentRemainingTimes ?? 0)}
      {/* 19:23:11 */}
    </Text>
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
    // flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 13,
  },
  vapeItemLeftText: {
    fontFamily: Squealt3Regular,
    fontSize: 14,
    color: buttonGray150Color,
    textAlign: "left",
  },
  vapeItemRightText: {
    fontFamily: Squealt3Regular,
    fontSize: 14,
    color: "white",
    textAlign: "left",
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
    // marginLeft: 5,
  },
  vapeRightImage: { width: 25, height: 25 },
  nodeItemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
});
