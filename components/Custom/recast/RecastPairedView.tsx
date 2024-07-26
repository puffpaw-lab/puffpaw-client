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
} from "react-native";

import React, { useState } from "react";
import { Redirect, router, Stack } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";

import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import { Squealt3Regular } from "@/constants/FontUtils";
import {
  buttonBgColor,
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
import { CustomDialog, toastConfig } from "@/constants/DialogUtils";
import Toast from "react-native-toast-message";

export default function castScreen() {
  // const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);

  // if (!isLogin) {
  //   return <Redirect href="/login" />;
  // }

  const [modalVisible, setModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  // 下注中
  const [stakingEnable, setStakingEnable] = useState(false);

  // 绑定事件
  const onStakingEvent = () => {
    setStakingEnable(!stakingEnable);
  };

  // 取消绑定
  const onUnstakingEvent = () => {
    setStakingEnable(!stakingEnable);
  };

  // 重铸事件
  const onRecastEvent = () => {
    if (!stakingEnable) {
      return;
    }

    setModalVisible(true);
  };

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
          <TrendHeader></TrendHeader>

          {/* 熊区域 */}
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
                {formatMoney("1250000")}
              </Text>
            </View>
          </View>

          {/* 操作按钮区域 */}
          <StakingButtonView
            stakingEnable={stakingEnable}
            stakingCallbak={onStakingEvent}
            unStakingCallbak={onUnstakingEvent}
            recastCallbak={onRecastEvent}
          ></StakingButtonView>

          <View style={{ height: percent10WinHeight }}></View>
        </ScrollView>
      </BackgroundView>

      {/* 重铸页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
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
                  marginTop: 30,
                }}
              >
                Recasting requires 14,000 PFF.
              </Text>
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 14,
                  color: "white",
                  textAlign: "center",
                }}
              >
                Confirm to recast?
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
                  onPress={() => setModalVisible(false)}
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
                    Yes
                  </Text>
                </Pressable>
                <View style={{ width: 15 }}></View>
                <Pressable
                  onPress={() => setModalVisible(false)}
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
        <CustomDialog />
      </Modal>

      {/* 重铸成功页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={successVisible}
        onRequestClose={() => {
          setSuccessVisible(!successVisible);
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
              width: windowWidth - 40,
              height: (windowWidth - 40) * (490 / 314.0),
            }}
          >
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/long_bg.png")}
              // style={styles.centeredView1}
            >
              <Pressable
                onPress={() => setSuccessVisible(false)}
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
                  fontSize: 20,
                  color: "white",
                  textAlign: "center",
                  marginTop: 15,
                }}
              >
                Congratulations!
              </Text>
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 16,
                  color: "rgb(255,67,53)",
                  textAlign: "center",
                }}
              >
                New Tier: 12
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
                    marginTop: 30,
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
                      source={require("@/assets/images/nft/dialog/bear.png")}
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
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 14,
                        color: "white",
                      }}
                    >
                      Tier 12 (pffs 50-100)
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
                      marginBottom: 25,
                      // backgroundColor: "green",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        fontSize: 14,
                        color: "white",
                      }}
                    >
                      Matched Pods: A/B/C
                    </Text>
                    <View style={{ flex: 1 }}></View>
                  </View>
                </View>
              </View>

              {/* 操作按钮 */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 40,
                  marginBottom: 20,
                  paddingHorizontal: 10,
                  // backgroundColor: "green",
                }}
              >
                <Pressable
                  onPress={() => setSuccessVisible(false)}
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
                    Decline and recast
                  </Text>
                </Pressable>
                <View style={{ width: 15 }}></View>
                <Pressable
                  onPress={() => setSuccessVisible(false)}
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

type StakingButtonViewProp = ViewProps & {
  stakingEnable: boolean;

  stakingCallbak: () => void;
  unStakingCallbak: () => void;
  recastCallbak: () => void;
};

// 下注按钮页面
const StakingButtonView = ({
  stakingEnable,
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

// 表头
const TrendHeader = () => {
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
          5481
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
          style={{ fontFamily: Squealt3Regular, fontSize: 15, color: "white" }}
        >
          Tier 8
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
              fontSize: 15,
              color: "white",
              fontFamily: Squealt3Regular,
              // marginTop: 30,
            }}
          >
            Computing power : 1.2
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
              Current Catridge : A
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
                marginTop: 2,

                // alignItems: "center",
                borderRadius: 7,
                // height: 14,
              }}
            >
              <Image
                style={{
                  width: 80,
                  height: 17,
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

// 重铸弹窗页面
const RecastModalApp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView1}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
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
    height: 290 * (290.0 / 427),
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
});
