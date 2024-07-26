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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
import {
  CustomDialog,
  DialogUtils,
  toastConfig,
} from "@/constants/DialogUtils";
import Toast from "react-native-toast-message";
import { CLOG } from "@/constants/LogUtils";
import { RatioPickerView } from "./picker/RatioPickerView";
import { LocalMyVapeInfo, LocalMyVapeNodeInfo } from "@/constants/LocalStorage";

type VapeBindViewProps = ViewProps & {
  myVapeInfo?: LocalMyVapeInfo | null;
  myVapeNodeInfo?: LocalMyVapeNodeInfo | null;
  detachVapeCallback: () => void; // 取消vape绑定事件
  myVapeInfoChanged?: () => void; // myvape info改变
};

// 绑定的 Vape View
export const VapeBindView = ({
  myVapeInfo,
  myVapeNodeInfo,
  detachVapeCallback,
  myVapeInfoChanged,
}: VapeBindViewProps) => {
  const [isCopying, setIsCopying] = useState(false); // 拷贝lease code 中

  const [detachVisible, setDetachVisible] = useState(false); // 取消绑定设备
  const [detachBinding, setDetachBinding] = useState(false); // 取消绑定中

  // 出租合约地址
  const [leaseVisible, setLeaseVisible] = useState(false); // 出租
  const [leaseHolderAddress, setLeaseHolderAddress] = useState(""); // 出租合约的地址
  const [leaseBinding, setLeaseBinding] = useState(false); // 正在绑定中

  // 移除lease
  const [removeLeaseVisible, setRemoveLeaseVisible] = useState(false); // 取消绑定设备
  const [removeLeasing, setRemoveLeasing] = useState(false); // 取消绑定中

  // 设置租赁比例
  const [rentRatioVisible, setRentRatioVisible] = useState(false); // 设置租赁比例
  const [rentRatioing, setRentRatioing] = useState(false); // 设置租赁中
  const [ratioText, setRatioText] = useState<string | null>("0"); // 设置租赁中
  const [tempRatioText, setTempRatioText] = useState<string | null>("0"); // 临时的设置租赁中

  // 确认设置租赁比例
  const [confirmRatioVisible, setConfirmRationVisible] = useState(false); // 确认设置租赁比例
  const [confirmRatioing, setConfirmRatioing] = useState(false); // 确认设置租赁比例绑定中

  const { bottom } = useSafeAreaInsets();

  // 展示出租页面
  const onShowUnLeaseEvent = () => {
    setLeaseHolderAddress("");
    setLeaseVisible(true);
  };

  // TODO: 【MyVape页面】出租给别人事件
  const onAddLeaseEvent = () => {
    if (leaseHolderAddress.length < 1) {
      return;
    }

    DialogUtils.showInfo(`Lease to ${leaseHolderAddress}`);

    setLeaseBinding(true);
    setTimeout(() => {
      setLeaseBinding(false);
      setLeaseVisible(false);

      // 通知页面重新请求数据
      if (myVapeInfoChanged) {
        myVapeInfoChanged();
      }
    }, 2000);
  };

  // 取消出租事件
  const onCancelLeaseEvent = () => {
    setLeaseVisible(false);
  };

  // TODO: 【MyVape页面】取消Vape bind 事件
  const onConfirmDetachEvent = () => {
    setDetachBinding(true);
    setTimeout(() => {
      setDetachBinding(false);
      setDetachVisible(false);

      if (detachVapeCallback) {
        detachVapeCallback();
      }
    }, 2000);
  };

  // 取消绑定事件
  const onCancelDetachEvent = () => {
    setDetachVisible(false);
  };

  // TODO: 【MyVape页面】确认移除lease事件
  const onConfirmRemoveLeaseEvent = () => {
    setRemoveLeasing(true);
    setTimeout(() => {
      setRemoveLeasing(false);
      setRemoveLeaseVisible(false);
    }, 2000);
  };

  // 取消移除lease事件
  const onCancelRemoveLeaseEvent = () => {
    setRemoveLeaseVisible(false);
  };

  // 取消绑定事件
  const onDetachVapeEvent = () => {
    setDetachVisible(true);
  };

  // TODO: 【MyVape页面】确认设置比例事件
  const onConfirmRatioEvent = () => {
    setRatioText(tempRatioText);
    setConfirmRationVisible(false);
  };

  // 取消设置比例事件
  const onCancelConfirmRatioEvent = () => {
    setConfirmRationVisible(false);
  };

  // 拷贝lease code 事件
  const onCopyLeaseCodeEvent = () => {
    setIsCopying(true);

    // 2s之后恢复
    setTimeout(() => {
      setIsCopying(false);
    }, 2000);
  };

  // 分享事件
  const onSharingRateEvent = () => {
    setTempRatioText(ratioText);
    setRentRatioVisible(true);
  };

  // leassee事件
  const onLeaseCodeEvent = () => {
    // setAddVapeVisible(false);
    setRemoveLeaseVisible(true);
  };

  useEffect(() => {}, [isCopying]);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        paddingHorizontal: 20,
      }}
    >
      {/* Vape ID */}
      <View style={styles.vapeItemContainer}>
        <Text style={[styles.vapeItemLeftText, { flex: 1 }]}>Vape ID</Text>
        <Text style={[styles.vapeItemRightText, { flex: 1 }]}>
          {myVapeInfo?.vapeId ?? "--"}
        </Text>
        <Pressable
          style={styles.vapeRightImageContainer}
          onPress={onDetachVapeEvent}
        >
          <Image
            style={styles.vapeRightImage}
            source={require("@/assets/images/nft/nft_unbind.png")}
            contentFit="contain"
          ></Image>
        </Pressable>
      </View>

      {/* Lease Code */}
      <View style={styles.vapeItemContainer}>
        <Text style={[styles.vapeItemLeftText, { flex: 1 }]}>Lease Code</Text>
        <Text style={[styles.vapeItemRightText, { flex: 1 }]}>
          {myVapeInfo?.leastCode ?? "--"}
        </Text>

        {isCopying ? (
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 14,
              color: buttonGray150Color,
              marginLeft: 5,
            }}
          >
            copied!
          </Text>
        ) : (
          <Pressable
            style={styles.vapeRightImageContainer}
            onPress={onCopyLeaseCodeEvent}
          >
            <Image
              style={styles.vapeRightImage}
              source={require("@/assets/images/nft/nft_copy.png")}
              contentFit="contain"
            ></Image>
          </Pressable>
        )}
      </View>

      {/* Sharing Rate */}
      <View style={styles.vapeItemContainer}>
        <Text style={styles.vapeItemLeftText}>Sharing Rate</Text>
        <View style={styles.vapeLeftImageContainer}>
          <Image
            style={styles.vapeLeftImage}
            source={require("@/assets/images/nft/nft_alert.png")}
            contentFit="contain"
          ></Image>
        </View>
        <Text style={[styles.vapeItemRightText, { flex: 1 }]}>
          {ratioText}%
        </Text>
        <Pressable
          style={styles.vapeRightImageContainer}
          onPress={onSharingRateEvent}
        >
          <Image
            style={styles.vapeRightImage}
            source={require("@/assets/images/nft/nft_expand.png")}
            contentFit="contain"
          ></Image>
        </Pressable>
      </View>

      <View></View>

      {/* Lessee */}
      {myVapeInfo?.lesseeStatus && (
        <View style={styles.vapeItemContainer}>
          <Text style={[styles.vapeItemLeftText, { flex: 1 }]}>Lessee</Text>

          <Pressable
          // onPress={onLeaseCodeEvent}
          >
            <Text style={[styles.vapeItemRightText, { flex: 1 }]}>
              {`${formatAccount(myVapeInfo?.lessee ?? "--")}`}
            </Text>
          </Pressable>
          <Pressable
            style={styles.vapeRightImageContainer}
            onPress={onLeaseCodeEvent}
          >
            <Image
              style={styles.vapeRightImage}
              source={require("@/assets/images/nft/nft_no_leasse.png")}
              contentFit="contain"
            ></Image>
          </Pressable>
        </View>
      )}

      {/* UnLessee */}
      {!myVapeInfo?.lesseeStatus && (
        <View style={styles.vapeItemContainer}>
          <Text style={[styles.vapeItemLeftText, { flex: 1 }]}>Lessee</Text>

          <Pressable
          // onPress={onLeaseCodeEvent}
          >
            <Text
              style={[
                styles.vapeItemRightText,
                { flex: 1, color: buttonGray150Color },
              ]}
            >
              Unleased
            </Text>
          </Pressable>
          <Pressable
            style={styles.vapeRightImageContainer}
            onPress={onShowUnLeaseEvent}
          >
            <Image
              style={styles.vapeRightImage}
              source={require("@/assets/images/nft/unleased.png")}
              contentFit="contain"
            ></Image>
          </Pressable>
        </View>
      )}

      {/* 连接上设备 */}
      <LinkedView
        myVapeNodeInfo={myVapeNodeInfo}
        detachVapeCallback={() => {}}
      ></LinkedView>

      {/* 添加Lease Code页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={leaseVisible}
        onRequestClose={() => {
          setLeaseVisible(!leaseVisible);
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
                onPress={() => setLeaseVisible(false)}
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
                Leaseing vape to someone
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
                    placeholder="Enter Leaseholder's wallet address"
                    placeholderTextColor={"rgb(59,59,59)"}
                    value={leaseHolderAddress}
                    onChangeText={setLeaseHolderAddress}
                    maxLength={40}
                  ></TextInput>
                </View>
              </View>

              {/* 提示信息 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 12,
                  color: buttonGray200Color,
                  textAlign: "center",
                  marginTop: 12,
                }}
              >
                *Please confirm the address of the
              </Text>
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 12,
                  color: buttonGray200Color,
                  textAlign: "center",
                }}
              >
                leaseholder's wallet
              </Text>

              {/* 操作按钮 */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 20,
                  // marginBottom: 30,
                  paddingHorizontal: 20,
                  // backgroundColor: "green",
                }}
              >
                <Pressable
                  onPress={onCancelLeaseEvent}
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
                  onPress={onAddLeaseEvent}
                  style={{
                    flex: 1,
                    backgroundColor:
                      leaseHolderAddress.length > 0 ? buttonBgColor : "gray",
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
                  {leaseBinding && (
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
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </View>
        <CustomDialog />
      </Modal>

      {/* 添加Lease Code页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detachVisible}
        onRequestClose={() => {
          setDetachVisible(!detachVisible);
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
                onPress={() => setDetachVisible(false)}
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
                Sure to detach this vape?
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
                  onPress={onCancelDetachEvent}
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
                  onPress={onConfirmDetachEvent}
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
                  {detachBinding && (
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

      {/* 移除Lease页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={removeLeaseVisible}
        onRequestClose={() => {
          setRemoveLeaseVisible(!removeLeaseVisible);
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
                onPress={() => setRemoveLeaseVisible(false)}
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
                Sure to remove this lease?
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
                  onPress={onCancelRemoveLeaseEvent}
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
                  onPress={onConfirmRemoveLeaseEvent}
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

      {/* 分配租赁比例页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={rentRatioVisible}
        onRequestClose={() => {
          setRentRatioVisible(!rentRatioVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // marginTop: 22,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Pressable
            style={{ width: "100%", height: "70%" }}
            onPress={() => {
              setRentRatioVisible(false);
              setConfirmRationVisible(true);
            }}
          >
            <View style={{ width: "100%", height: "100%" }}></View>
          </Pressable>
          <View
            style={{
              width: "90%",
              height: "30%",
              marginBottom: bottom + 20,
              borderRadius: 15,
            }}
          >
            <RatioPickerView
              ratioText={ratioText}
              callback={(text: string) => {
                setTempRatioText(text);
              }}
            ></RatioPickerView>
            {/* <Picker
              style={{
                backgroundColor: buttonGray30Color,
                // width: 300,
                // height: 215,
                flex: 1,
                // width: "100%",
                // color: "white",
                borderRadius: 15,
              }}
              selectedValue={ratioText}
              textColor="white"
              // textSize="16"

              pickerData={[
                { value: "0", label: "0%" },
                { value: "10", label: "10%" },
                { value: "20", label: "20%" },
                { value: "30", label: "30%" },
                { value: "40", label: "40%" },
                { value: "50", label: "50%" },
                { value: "60", label: "60%" },
                { value: "70", label: "70%" },
                { value: "80", label: "80%" },
              ]}
              onValueChange={(value: string) => {
                CLOG.info(value);
                setTempRatioText(value);
              }} // '5765387680'
              // android only
              // textSize={16}
              // selectTextColor="white"
              // isShowSelectBackground={false} // Default is true
              // selectBackgroundColor="#8080801A" // support HEXA color Style (#rrggbbaa)
              // (Please always set 'aa' value for transparent)

              // selectLineColor="black"
              // selectLineSize={30} // Default is 4
            /> */}
          </View>
        </View>
        <CustomDialog />
      </Modal>

      {/* 确认分配比例页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmRatioVisible}
        onRequestClose={() => {
          setConfirmRationVisible(!confirmRatioVisible);
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
          <View style={{ width: 300, height: 240 / (427.0 / 470) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <Pressable
                onPress={() => setConfirmRationVisible(false)}
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

              {/* <View
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
              </View> */}

              {/* 比例 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 40,
                  fontWeight: "bold",
                  color: buttonBgColor,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                {tempRatioText}%
              </Text>

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
                Revision of the Sharing Rate
              </Text>

              {/* 文本内容 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 12,
                  color: "gray",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                The sharing rate is about to be changed to
              </Text>

              {/* 文本内容 */}
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 12,
                  color: "gray",
                  textAlign: "center",
                  // marginTop: 10,
                }}
              >
                {tempRatioText}%, please confirm this change
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
                  onPress={onCancelConfirmRatioEvent}
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
                    Decline
                  </Text>
                </Pressable>
                <View style={{ width: 15 }}></View>
                <Pressable
                  onPress={onConfirmRatioEvent}
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
                  {/* { (
                    <ActivityIndicator
                      style={{ marginRight: 10 }}
                      color={"white"}
                    ></ActivityIndicator>
                  )} */}
                  <Text
                    style={{
                      fontSize: 10,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    I Agree
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

// 连接上设备
const LinkedView = ({ myVapeNodeInfo }: VapeBindViewProps) => {
  return (
    <View
      style={{
        marginTop: 30,
        borderRadius: 20,
        padding: 20,
        // paddingBottom: 25,
        marginBottom: 20,
        backgroundColor: buttonGrayBgColor,
        borderColor: buttonGray30Color,
        borderWidth: 1,
        width: "100%",
        // backgroundColor: "rgb(30,30,30)",
        // backgroundColor: "yellow",
      }}
    >
      <Text
        style={{
          fontFamily: Squealt3Regular,
          fontSize: 16,
          color: "white",
        }}
      >
        Current Node
      </Text>

      <View
        style={{
          // flexDirection: "row",
          // justifyContent: "flex-start",
          // alignContent: "flex-start",
          alignItems: "center",
          marginVertical: 10,
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
            // width: 200,
            // height: 200,
            height: 300,
            width: 300,
          }}
        >
          <Image
            source={myVapeNodeInfo?.icon}
            placeholder={require("@/assets/images/nft/nft_bear.png")}
            contentFit="contain"
            placeholderContentFit="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      </View>

      {/* Token ID */}
      <View style={styles.nodeItemContainer}>
        <Text style={[styles.vapeItemLeftText, { flex: 1 }]}>Token ID</Text>
        <Text style={[styles.vapeItemRightText, { flex: 1 }]}>
          #{myVapeNodeInfo?.tokenId ?? "--"}
        </Text>
      </View>

      {/* Rare Rate */}
      <View style={styles.nodeItemContainer}>
        <Text style={[styles.vapeItemLeftText, { flex: 1 }]}>Rare Rate</Text>
        <Text style={[styles.vapeItemRightText, { flex: 1 }]}>
          {`${myVapeNodeInfo?.rareRate ?? ""}(${
            myVapeNodeInfo?.rareRatePff ?? ""
          } pffs)`}
        </Text>
      </View>

      {/* Paired Pods */}
      <View style={styles.nodeItemContainer}>
        <Text style={[styles.vapeItemLeftText, { flex: 1 }]}>Paired Pods</Text>
        <Text style={[styles.vapeItemRightText, { flex: 1 }]}>
          {myVapeNodeInfo?.pairedPods ?? "--"}
        </Text>
      </View>

      {/* Plus Model */}
      <View style={styles.nodeItemContainer}>
        <Text style={[styles.vapeItemLeftText, { flex: 1 }]}>Plus Model</Text>
        <Text style={[styles.vapeItemRightText, { flex: 1 }]}>
          {myVapeNodeInfo?.plusModel ?? "--"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
  },
  vapeItemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
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
    textAlign: "right",
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
  vapeRightImage: { width: 20, height: 20 },
  nodeItemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
});
