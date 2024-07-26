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
  buttonGray50Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import { percent10WinHeight, windowWidth } from "@/constants/CommonUtils";
import { FunctionWithNumber } from "@/constants/ViewProps";
import {
  CustomDialog,
  DialogUtils,
  toastConfig,
} from "@/constants/DialogUtils";
import Toast from "react-native-toast-message";

type VapeNoneViewProp = ViewProps & { callback: () => void };

// 空 Vape View
export const VapeNoneView = ({ callback }: VapeNoneViewProp) => {
  // 创建和恢复钱包
  const [addVapeVisible, setAddVapeVisible] = useState(false);

  // 创建和恢复钱包输入
  const [deviceIDText, setDeviceIDText] = useState(""); // 设备ID
  const [vapeBinding, setVapeBinding] = useState(false); // 正在绑定中

  // 展示添加设备事件
  const onShowAddVapeEvent = () => {
    // DialogUtils.showSuccess(
    //   "展示添加设备事件 sdfsdf",
    //   "testjhd sdfhdssadmsd,fmsdfksdlfksdkfksdfmdfsf  f"
    // );
    // return;

    setDeviceIDText("");
    setAddVapeVisible(true);
  };

  // 添加设备事件
  const onAddVapeEvent = () => {
    setAddVapeVisible(false);

    callback();
  };
  // 取消添加事件
  const onCancelAddVapeEvent = () => {
    setAddVapeVisible(false);
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        marginTop: -percent10WinHeight,
      }}
    >
      <Image
        style={{ width: 90, height: 90 }}
        source={require("@/assets/images/nft/none_vape_tied.png")}
        contentFit="contain"
      ></Image>
      <Text
        style={{
          fontFamily: Squealt3Regular,
          fontSize: 14,
          color: buttonGray200Color,
          textAlign: "center",
          marginTop: 10, // windowHeight * 0.2,
        }}
      >
        You are not tied to any vapes {`:(`}
      </Text>
      <Pressable onPress={onShowAddVapeEvent}>
        <View
          style={{
            marginTop: 30, //windowHeight * 0.2,
            backgroundColor: buttonBgColor,
            height: 40,
            width: 140,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: Squealt3Regular,
              fontSize: 15,
              // height: 30,
              // width: 130,
              textAlign: "center",
            }}
          >
            Add a vape
          </Text>
        </View>
      </Pressable>

      {/* 添加一个Vape页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addVapeVisible}
        onRequestClose={() => {
          setAddVapeVisible(!addVapeVisible);
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
          <View style={{ width: 300, height: 250 / (427.0 / 470) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <Pressable
                onPress={() => setAddVapeVisible(false)}
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
                  fontSize: 14,
                  color: "white",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Please enter the device ID
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
                    placeholder="Device ID"
                    placeholderTextColor={"rgb(59,59,59)"}
                    value={deviceIDText}
                    onChangeText={setDeviceIDText}
                    maxLength={40}
                  ></TextInput>
                </View>
              </View>

              {/* 操作按钮 */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 35,
                  // marginBottom: 30,
                  paddingHorizontal: 20,
                  // backgroundColor: "green",
                }}
              >
                <Pressable
                  onPress={onCancelAddVapeEvent}
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
                  onPress={onAddVapeEvent}
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
                  {vapeBinding && (
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
                    Bind
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
