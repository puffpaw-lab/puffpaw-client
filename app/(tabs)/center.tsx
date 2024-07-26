import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  useWindowDimensions,
  Modal,
  Alert,
  Pressable,
  ViewProps,
  ActivityIndicator,
} from "react-native";

import React, { useCallback, useState } from "react";
import { Redirect, router, Stack, useFocusEffect } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import {
  ConstantStorage,
  LocalNFTInfo,
  LocalRecastInfo,
} from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";

import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import { Squealt3Regular } from "@/constants/FontUtils";
import {
  buttonBgColor,
  buttonGray150Color,
  buttonGray25Color,
  buttonGray30Color,
  buttonGray50Color,
  buttonGrayBgColor,
  grayBGgColorList,
} from "@/constants/Colors";
import { Image, ImageBackground } from "expo-image";
import {
  formatMoney,
  percent10WinHeight,
  percent20WinHeight,
  percent5WinHeight,
  windowWidth,
} from "@/constants/CommonUtils";
import { CustomTextView } from "@/components/Custom/CustomText";
import {
  CustomDialog,
  DialogUtils,
  toastConfig,
} from "@/constants/DialogUtils";
import Toast from "react-native-toast-message";

export default function castScreen() {
  // const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);

  // if (!isLogin) {
  //   return <Redirect href="/login" />;
  // }

  // 是否第一次重铸
  const [isFirstRecast, setIsFirstRecast] = useState(true);

  const [firstRecastVisible, setFirstRecastVisible] = useState(false);
  const [recastSuccessVisible, setRecastSuccessVisible] = useState(false);
  // 重铸中
  const [isRecasting, setIsRecasting] = useState(false);

  // nft是否绑定了
  const [nftEnable, setNFTEnable] = useState(false);
  const [localNFTInfo, setLocalNFTInfo] = useState<LocalNFTInfo | null>(null); // 总收入

  const [localRecastInfo, setLocalRecastInfo] =
    useState<LocalRecastInfo | null>(null); // NFT 重铸数据

  // 绑定NFT成功事件
  const onBindNFTSuccessEvent = () => {
    setNFTEnable(true);
    setLocalNFTInfo({
      id: "5481",
      computingPower: "1.2",
      currentCartridge: "A",
      tier: "8",
    });
  };

  // 总收入
  const [totalReturn, setTotalReturn] = useState<string | null>(null);

  // 下注中
  const [stakingEnable, setStakingEnable] = useState(false);

  // TODO:【NFT页面】点击Stake事件
  const onStakingEvent = () => {
    setStakingEnable(!stakingEnable);
  };

  // TODO:【NFT页面】点击UnStake事件
  const onUnstakingEvent = () => {
    setStakingEnable(!stakingEnable);
  };

  // 点击重铸按钮事件
  const onRecastEvent = () => {
    if (!stakingEnable) {
      return;
    }

    if (isRecasting) {
      DialogUtils.showInfo("Recasting, Please waiting...");
    }

    if (isFirstRecast) {
      setFirstRecastVisible(true);
    } else {
      onNoneFirstRecastEvent();
    }
  };

  // 关闭第一次重铸提示框
  const onCloseFirstRecastEvent = () => {
    setFirstRecastVisible(false);

    // TODO : 关闭页面之后要重新请求isFirstRecast状态
    // setIsFirstRecast(false)
  };

  // TODO:【NFT页面】第一次重铸事件 ,【走服务端接口】
  const onFirstRecastEvent = () => {
    setFirstRecastVisible(false);
    setIsRecasting(true);

    setTimeout(() => {
      setLocalRecastInfo({
        newTier: "8",
        price: "12500000",
        rareRate: "14",
        rareRatePff: "10-30 pffs", // TODO 从后端获取稀有度对应的pff数据
        hashPower: "20",
        plusModel: "B",
        congratulations: "!",
        icon: require("@/assets/images/nft/nft_bear.png"),
      });

      setIsFirstRecast(false);
      setRecastSuccessVisible(true);

      DialogUtils.showSuccess("First time recast success");
    }, 1000);
  };

  // TODO:【NFT页面】非第一次重铸事件
  const onNoneFirstRecastEvent = () => {
    setIsRecasting(true);

    setTimeout(() => {
      setLocalRecastInfo({
        newTier: "12",
        price: "500000",
        rareRate: "11",
        rareRatePff: "50-100 pffs",
        hashPower: "30",
        plusModel: "A",
        congratulations: "!",
        icon: require("@/assets/images/nft/nft_bear_2.png"),
      });

      setRecastSuccessVisible(true);
      setIsRecasting(false);

      DialogUtils.showSuccess("No first time recast success");
    }, 1000);
  };

  // TODO:【NFT页面】 重铸成功 点击 Accept 按钮
  const onRecastSuccessEvent = () => {
    setRecastSuccessVisible(false);
    setIsFirstRecast(false);
    setIsRecasting(false);
  };

  // TODO:【NFT页面】重铸之后点击 Decline and Recast 事件
  const onDeclineAndRecastEvent = () => {
    setIsRecasting(false);
    setRecastSuccessVisible(false);
    setIsRecasting(false);
  };

  // 关闭重铸成功页面事件
  const onCloseRecastSuccessEvent = () => {
    setIsRecasting(false);
    setRecastSuccessVisible(false);
    setIsRecasting(false);
  };

  // TODO:【NFT页面】获取NFT Bind 状态
  const getNFTBindStatusInfo = () => {
    setTimeout(() => {
      setNFTEnable(true);

      setLocalNFTInfo({
        id: "5481",
        computingPower: "1.2",
        currentCartridge: "A",
        tier: "8",
        // totalReturn: "125000",
      });
    }, 1000);
  };

  // TODO:【NFT页面】获取NFT Stake 状态
  const getNFTStakeStatusInfo = () => {
    setTimeout(() => {
      setStakingEnable(true);
    }, 2000);
  };

  // TODO:【NFT页面】获取NFT Fist Recast 状态，是否第一次重铸
  const getNFTRecastStatusInfo = () => {
    setTimeout(() => {
      setIsFirstRecast(true);
    }, 2000);
  };

  // TODO:【NFT页面】获取NFT Total Return
  const getNFTTotalReturnInfo = () => {
    setTimeout(() => {
      setTotalReturn("12300943");
    }, 3000);
  };

  // 页面可见时
  useFocusEffect(
    useCallback(() => {
      getNFTBindStatusInfo();
      getNFTStakeStatusInfo();
      getNFTRecastStatusInfo();
      getNFTTotalReturnInfo();
    }, [])
  );

  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"}></StatusBar>

      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: Squealt3Regular,
          },
          headerRight: (props) => <RightLogoView></RightLogoView>,
        }}
      />

      <BackgroundView
        style={styles.container}
        x={"50%"}
        y={"100%"}
        rx={"50%"}
        ry={"15%"}
      >
        <ScrollView
          style={{ width: "100%", height: "100%", paddingHorizontal: 30 }}
        >
          {/* <CastHeader></CastHeader> */}

          {/* 熊区域 */}
          {nftEnable ? (
            <BindNFTView
              localNFTInfo={localNFTInfo}
              bindSuccessCallbak={function (): void {
                throw new Error("Function not implemented.");
              }}
            ></BindNFTView>
          ) : (
            <UnbindNFTView
              bindSuccessCallbak={onBindNFTSuccessEvent}
            ></UnbindNFTView>
          )}

          {/* 总收入 */}
          <TotalReturnView totalReturn={totalReturn}></TotalReturnView>

          {/* 操作按钮区域 */}
          <StakingButtonView
            stakingEnable={stakingEnable}
            isRecasting={isRecasting}
            stakingCallbak={onStakingEvent}
            unStakingCallbak={onUnstakingEvent}
            recastCallbak={onRecastEvent}
          ></StakingButtonView>

          <View style={{ height: percent10WinHeight }}></View>
        </ScrollView>
      </BackgroundView>

      {/* 第一次重铸页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={firstRecastVisible}
        onRequestClose={() => {
          setFirstRecastVisible(!firstRecastVisible);
        }}
      >
        <View style={styles.centeredView1}>
          <View style={styles.modalView}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <Pressable
                onPress={onCloseFirstRecastEvent}
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
                  marginTop: 20,
                }}
              >
                <Image
                  style={{ width: 35 * 1.2, height: 27 * 1.2 }}
                  contentFit="contain"
                  source={require("@/assets/images/common/dialog_logo.png")}
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
                  fontSize: 14,
                  color: "white",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Recasting
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
                  onPress={onFirstRecastEvent}
                  style={{
                    flex: 1,
                    backgroundColor: buttonBgColor,
                    borderRadius: 15,
                    height: 30,
                    width: "80%",
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
                      fontSize: 12,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Start recasting
                  </Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </View>
        <CustomDialog />
      </Modal>

      {/* 重铸成功页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={recastSuccessVisible}
        onRequestClose={() => {
          setRecastSuccessVisible(!recastSuccessVisible);
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
          <View
            style={{
              width: windowWidth - 60,
              height: (windowWidth - 50) * (490 / 314.0),
            }}
          >
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/long_bg.png")}
              // style={styles.centeredView1}
            >
              <Pressable
                onPress={onCloseRecastSuccessEvent}
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
                  fontSize: 25,
                  color: "white",
                  textAlign: "center",
                  marginTop: 5,
                }}
              >
                Congratulations{`${localRecastInfo?.congratulations}`}
              </Text>
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 16,
                  color: "rgb(255,67,53)",
                  textAlign: "center",
                }}
              >
                New Tier: {localRecastInfo?.newTier ?? "--"}
              </Text>

              {/* 熊标签 */}
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View
                  style={{
                    backgroundColor: "black",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: buttonGray50Color,
                    // margin: 20,
                    marginTop: 20,
                    borderWidth: 1,
                    borderRadius: 15,

                    //该属性只支持>=android 5.0
                    elevation: 5,
                    shadowColor: "rgba(0,0,0,0.4)",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 1,
                    shadowRadius: 5,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "black",
                      borderRadius: 15,
                      margin: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: buttonGray50Color,
                      borderWidth: 1,
                    }}
                  >
                    <Image
                      style={{
                        width: windowWidth / 2,
                        height: windowWidth / 2,
                      }}
                      source={localRecastInfo?.icon}
                      placeholder={require("@/assets/images/nft/dialog/bear.png")}
                      contentFit="contain"
                    ></Image>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      // alignContent:'center'
                      marginVertical: 5,
                      marginLeft: 15,
                      // backgroundColor: "green",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 20,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {`$ ${formatMoney(localRecastInfo?.price)} Pff`}
                    </Text>
                    <View style={{ flex: 1 }}></View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      // alignContent:'center'
                      marginTop: 3,
                      marginHorizontal: 15,
                      // backgroundColor: "green",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 12,
                        color: buttonGray150Color,
                      }}
                    >
                      Rare Rate
                    </Text>
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 12,
                        color: "white",
                        flex: 1,
                        textAlign: "right",
                      }}
                    >
                      {`${localRecastInfo?.rareRate} (${localRecastInfo?.rareRatePff} pffs)`}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      // alignContent:'center'
                      marginTop: 3,
                      marginHorizontal: 15,
                      // backgroundColor: "green",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 12,
                        color: buttonGray150Color,
                      }}
                    >
                      Hash Power
                    </Text>
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 12,
                        color: "white",
                        flex: 1,
                        textAlign: "right",
                      }}
                    >
                      {`${localRecastInfo?.hashPower}`}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 3,
                      marginHorizontal: 15,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 12,
                        color: buttonGray150Color,
                      }}
                    >
                      Plus Model
                    </Text>
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 12,
                        color: "white",
                        flex: 1,
                        textAlign: "right",
                      }}
                    >
                      {`${localRecastInfo?.plusModel}`}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 操作按钮 */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20,
                  marginBottom: 20,
                  paddingHorizontal: 10,
                  // backgroundColor: "green",
                }}
              >
                <Pressable
                  onPress={onDeclineAndRecastEvent}
                  style={{
                    flex: 1,
                    backgroundColor: buttonBgColor,
                    borderRadius: 20,
                    height: 40,
                    width: "35%",
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
                      fontSize: 12,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Decline and Recast
                  </Text>
                </Pressable>
                <View style={{ width: 15 }}></View>
                <Pressable
                  onPress={onRecastSuccessEvent}
                  style={{
                    flex: 1,
                    backgroundColor: "black",
                    borderRadius: 20,
                    height: 40,
                    width: "35%",
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
                      fontSize: 12,
                      color: buttonBgColor,
                      textAlign: "center",
                    }}
                  >
                    Accept
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
}

// 下注页面
type StakingButtonViewProp = ViewProps & {
  stakingEnable: boolean;
  isRecasting: boolean; // 是否重铸中
  stakingCallbak: () => void;
  unStakingCallbak: () => void;
  recastCallbak: () => void;
};

// 下注按钮页面
const StakingButtonView = ({
  stakingEnable,
  isRecasting,
  stakingCallbak,
  unStakingCallbak,
  recastCallbak,
}: StakingButtonViewProp) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 25,
        marginBottom: 40,
        // paddingHorizontal: 20,
      }}
    >
      {stakingEnable ? (
        <Pressable
          onPress={stakingCallbak}
          style={{
            flex: 1,
            backgroundColor: "black",
            borderRadius: 20,
            height: 40,
            // marginLeft: 0,
            // marginRight: 3,
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            borderColor: buttonGray50Color,
            borderWidth: 0.5,
            padding: 2,
          }}
        >
          <View
            style={{
              flex: 1,
              // marginRight: 3,
              backgroundColor: "black",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: buttonGray50Color,
                textAlign: "center",
              }}
            >
              Unstake
            </Text>
          </View>
          <Image
            style={{ width: 36, height: 36 }}
            contentFit="fill"
            source={require("@/assets/images/center/unstaking_icon.png")}
          ></Image>
        </Pressable>
      ) : (
        <Pressable
          onPress={unStakingCallbak}
          style={{
            flex: 1,
            backgroundColor: "black",
            borderRadius: 20,
            height: 40,
            // marginLeft: 0,
            // marginRight: 3,
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            borderColor: buttonGray25Color,
            borderWidth: 1,
            padding: 2,
          }}
        >
          <Image
            style={{ width: 36, height: 36 }}
            contentFit="fill"
            source={require("@/assets/images/center/staking_icon.png")}
          ></Image>
          <View
            style={{
              flex: 1,
              // marginRight: 3,
              backgroundColor: "black",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: buttonBgColor,
                textAlign: "center",
              }}
            >
              Staking
            </Text>
          </View>
        </Pressable>
      )}

      <View style={{ width: 20 }}></View>
      <Pressable
        onPress={recastCallbak}
        style={{
          flex: 1,
          backgroundColor: "black",
          borderRadius: 20,
          height: 40,
          // marginRight: 0,
          // marginLeft: 3,
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          borderColor: buttonGray50Color,
          borderWidth: 0.5,
        }}
      >
        {isRecasting && (
          <ActivityIndicator
            style={{ marginRight: 10 }}
            color={"white"}
          ></ActivityIndicator>
        )}
        <Text
          style={{
            fontSize: 14,
            color: stakingEnable ? buttonBgColor : buttonGray50Color,
            textAlign: "center",
          }}
        >
          Recast
        </Text>
      </Pressable>
    </View>
  );
};

// 页面数据
type BindNFTViewProp = ViewProps & {
  localNFTInfo: LocalNFTInfo | null;
  bindSuccessCallbak: () => void;
};

// 已经绑定nft页面
const BindNFTView = ({ localNFTInfo }: BindNFTViewProp) => {
  const layout = useWindowDimensions();

  return (
    <View
      style={{
        // backgroundColor: "green",
        justifyContent: "center",
        alignItems: "center",
        borderColor: buttonGray50Color,
        // margin: 20,
        marginTop: percent5WinHeight,
        borderWidth: 1,
        borderRadius: 15,
      }}
    >
      <View
        style={{
          backgroundColor: "black",
          borderRadius: 15,
          margin: 15,
          justifyContent: "center",
          alignItems: "center",
          borderColor: buttonGray50Color,
          borderWidth: 1,
        }}
      >
        <Image
          style={{ width: layout.width - 80, height: layout.width - 80 }}
          source={require("@/assets/images/center/center_bear.png")}
          contentFit="contain"
        ></Image>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          // alignContent:'center'
          marginTop: 10,
          marginLeft: 15,
          // backgroundColor: "green",
        }}
      >
        <Text
          style={{ fontFamily: Squealt3Regular, fontSize: 25, color: "white" }}
        >
          {localNFTInfo?.id ?? "--"}
        </Text>
        <View style={{ flex: 1 }}></View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          // alignContent:'center'
          marginTop: 10,
          marginLeft: 15,
          // backgroundColor: "green",
        }}
      >
        <Text
          style={{ fontFamily: Squealt3Regular, fontSize: 13, color: "white" }}
        >
          Tier {localNFTInfo?.tier ?? " --"}
        </Text>
        <View style={{ flex: 1 }}></View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 3,
          marginLeft: 15,

          alignContent: "center",
          justifyContent: "flex-start",
        }}
      >
        <View style={{}}>
          <Text
            style={{
              fontSize: 13,
              color: "white",
              fontFamily: Squealt3Regular,
              // marginTop: 30,
            }}
          >
            Computing power : {localNFTInfo?.computingPower ?? "--"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              // alignContent: "flex-start",
              alignItems: "center",
              marginTop: 3,
              marginBottom: 20,
              // backgroundColor: "green",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: Squealt3Regular,
                color: "white",
              }}
            >
              Current Catridge : {localNFTInfo?.currentCartridge ?? "--"}
            </Text>
            <View
              style={{
                // width: 80,
                // height: 10,
                // borderRadius: 5,
                // backgroundColor: "red",
                // marginHorizontal: 10,
                marginLeft: 7,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "flex-end",
                // marginTop: 2,

                // alignItems: "center",
                borderRadius: 7,
                // height: 14,
              }}
            >
              <Image
                style={{
                  width: 121 * 0.5,
                  height: 31 * 0.5,
                  // marginLeft: 4,
                  // backgroundColor: "white",
                }}
                source={require("@/assets/images/center/center_boosted.png")}
              ></Image>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </View>
  );
};

// 页面数据
type TotalReturnViewProp = ViewProps & {
  totalReturn: string | null;
};

// Total return页面
const TotalReturnView = ({ totalReturn }: TotalReturnViewProp) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginTop: 30,
      }}
    >
      <Text
        style={{
          fontFamily: Squealt3Regular,
          fontSize: 18,
          color: "rgb(206,206,206)",
        }}
      >
        Total return
      </Text>
      <View
        style={{
          flexDirection: "row",
          // justifyContent: "center",
          alignItems: "center",
          // alignContent:'center'
          marginTop: 10,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            // backgroundColor: "red",
            marginHorizontal: 5,
            borderRadius: 15,
          }}
        >
          <Image
            source={require("@/assets/images/index/bear_icon.png")}
            style={{ width: 20, height: 20 }}
          />
        </View>
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 26,
            color: "rgb(206,206,206)",
          }}
        >
          {formatMoney(`${totalReturn ?? "--"}`)}
        </Text>
      </View>
    </View>
  );
};

// 下注页面
type UnbindNFTViewProp = ViewProps & {
  bindSuccessCallbak: () => void;
};

// 未绑定nft页面
const UnbindNFTView = ({ bindSuccessCallbak }: UnbindNFTViewProp) => {
  return (
    <View
      style={{
        // backgroundColor: "green",
        justifyContent: "center",
        alignItems: "center",
        borderColor: buttonGray50Color,
        // margin: 20,
        marginTop: percent5WinHeight,
        borderWidth: 1,
        borderRadius: 15,
      }}
    >
      <View
        style={{
          backgroundColor: "black",
          borderRadius: 15,
          margin: 15,
          justifyContent: "center",
          alignItems: "center",
          borderColor: buttonGray50Color,
          borderWidth: 1,
        }}
      >
        <Image
          style={{ width: windowWidth - 80, height: windowWidth - 80 }}
          source={require("@/assets/images/center/unbind_bear.png")}
          contentFit="contain"
        ></Image>
      </View>

      <Pressable
        onPress={bindSuccessCallbak}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          // alignContent:'center'
          marginTop: 10,
          marginLeft: 15,
          // backgroundColor: "green",
        }}
      >
        <Text
          style={{ fontFamily: Squealt3Regular, fontSize: 25, color: "white" }}
        >
          --
        </Text>
        <View style={{ flex: 1 }}></View>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 3,
          marginLeft: 15,

          alignContent: "center",
          justifyContent: "flex-start",
        }}
      >
        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              // alignContent: "flex-start",
              alignItems: "center",
              marginTop: 3,
              marginBottom: 20,
              // backgroundColor: "green",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: Squealt3Regular,
                color: "white",
              }}
            >
              You don't have a node yet.
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: Squealt3Regular,
                color: buttonBgColor,
                marginLeft: 3,
              }}
            >
              Get a Node
            </Text>
            <View
              style={{
                // marginLeft: 7,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Image
                style={{
                  width: 12,
                  height: 12,
                }}
                source={require("@/assets/images/center/center_external.png")}
              ></Image>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "flex-start",
    // backgroundColor: "black",
  },
  topContainer: {
    height: 400,
    // backgroundColor: "gray",
    margin: 40,
    borderRadius: 20,

    // width: 300,
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "red",
  },
  centeredView1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    // margin: 20,
    // marginHorizontal: 30,
    width: 290,
    height: 300 * (290.0 / 427),
    // backgroundColor: "white",
    // borderRadius: 20,
    // padding: 35,
    // alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  vapeItemContainer: {
    // flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 13,
  },
  vapeItemLeftText: {
    fontFamily: Squealt3Regular,
    fontSize: 12,
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
});
