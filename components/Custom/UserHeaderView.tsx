import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View, Pressable, StyleSheet, Text, Modal } from "react-native";
import { Image, ImageBackground } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { uploadUserIcon } from "@/constants/HttpUtils";
import { AxiosResponse } from "axios";
import {
  CustomDialog,
  DialogUtils,
  toastConfig,
} from "@/constants/DialogUtils";
import { formatImageUrl } from "@/constants/CommonUtils";
import { LocalUserInfo, ConstantStorage } from "@/constants/LocalStorage";
import { useMMKVObject } from "react-native-mmkv";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import {
  buttonGray25Color,
  buttonGray30Color,
  buttonGray50Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";
import * as Linking from "expo-linking";
import { CLOG } from "@/constants/LogUtils";
import Toast from "react-native-toast-message";
import { Divider } from "@rneui/base";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type UserHeaderIconType = "none" | "x" | "telegram" | "farcaster" | "google";

export const UserHeaderView = () => {
  // const [googleVisible, setGoogleVisible] = useState(false);
  // const [twitterVisible, setTwitterVisible] = useState(false);
  // const [farcasterVisible, setFarcasterVisible] = useState(false);
  // const [telegramVisible, setTelegramVisible] = useState(false);

  // 已经绑定的手机号
  const [linkedPhone, setLinkedPhone] = useState<string | null>(null);

  // 已经绑定的google
  const [linkedGoogle, setLinkedGoogle] = useState<string | null>(null);

  // 已经绑定的twitter
  const [linkedTwitter, setLinkedTwitter] = useState<string | null>(null);

  const [vapeCodeVisible, setVapeCodeVisible] = useState(false);
  const [iconType, setIconType] = useState<UserHeaderIconType>("none");
  const [editViewText, setEditViewText] = useState("");

  const [localUser, setLocalUser] = useMMKVObject<LocalUserInfo | null>(
    ConstantStorage.localUser
  );

  // useEffect(() => {

  // }, [localUser]);

  useEffect(() => {
    let defaultText: string | null | undefined = null;
    switch (iconType) {
      case "none":
        return;
      case "google":
        defaultText = localUser?.google;
        break;
      case "x":
        defaultText = localUser?.twitter;
        break;
      case "farcaster":
        defaultText = localUser?.farcaster;
        break;
      case "telegram":
        defaultText = localUser?.telegram;
        break;
    }

    CLOG.info(editViewText);
    if (defaultText !== null && defaultText !== undefined) {
      setEditViewText(defaultText);
    } else {
      setEditViewText("");
    }
  }, [iconType]);

  return (
    <View style={styles.headerContainer}>
      <HeaderIconView></HeaderIconView>
      <Text
        style={{
          fontFamily: Squealt3Regular,
          fontSize: 25,
          color: "white",
          margin: 8,
        }}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {`${localUser?.name ?? "Not Setup"}`}
      </Text>
      <View style={styles.headerIconContainer}>
        {localUser?.twitter && (
          <Pressable
            style={{ marginRight: 3 }}
            onPress={() => {
              setIconType("x");
              setVapeCodeVisible(true);
            }}
          >
            <Image
              source={require("@/assets/images/login/login_x.png")}
              style={styles.headerSubIcon}
            />
          </Pressable>
        )}
        {localUser?.telegram && (
          <Pressable
            style={{ marginRight: 3 }}
            onPress={() => {
              setIconType("telegram");
              setVapeCodeVisible(true);
            }}
          >
            <Image
              source={require("@/assets/images/login/login_telegram.png")}
              style={styles.headerSubIcon}
            />
          </Pressable>
        )}
        {localUser?.farcaster && (
          <Pressable
            style={{ marginRight: 3 }}
            onPress={() => {
              setIconType("farcaster");
              setVapeCodeVisible(true);
            }}
          >
            <Image
              source={require("@/assets/images/login/login_farcaster.png")}
              style={styles.headerSubIcon}
            />
          </Pressable>
        )}
        {localUser?.google && (
          <Pressable
            onPress={() => {
              setIconType("google");
              setVapeCodeVisible(true);
            }}
          >
            <Image
              source={require("@/assets/images/login/login_google.png")}
              style={styles.headerSubIcon}
            />
          </Pressable>
        )}
      </View>

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
          <View style={{ width: 300, height: 145 / (427.0 / 470) }}>
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
                  fontSize: 20,
                  color: "rgb(193,193,193)",
                  textAlign: "center",
                  marginTop: 5,
                }}
              >
                {iconType} account:
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
                {editViewText}
              </Text>
            </ImageBackground>
          </View>
        </View>
        <CustomDialog />
      </Modal>
    </View>
  );
};

export const HeaderIconView = () => {
  const [localUser, setLocalUser] = useMMKVObject<LocalUserInfo | null>(
    ConstantStorage.localUser
  );
  // const [image, setImage] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState<string | undefined | null>(
    localUser?.headPic
  );

  const [selectIconVisible, setSelectIconVisible] = useState(false);
  const { bottom } = useSafeAreaInsets();

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const onPickImageEvent = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    CLOG.info(`上传头像: ${result}`);
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      // 压缩图片
      const manipResult = await manipulateAsync(
        uri,
        [
          // { rotate: 90 },
          { resize: { width: 300, height: 300 } },
          // { flip: FlipType.Vertical },
        ],
        { compress: 0.5, format: SaveFormat.PNG }
      );
      const targetUri = manipResult.uri;
      // setImage(targetUri);
      const response = await uploadUserIcon(targetUri);
      uploadSuccess(response);
    }
  };

  // 加载相机
  const onLaunchCamera = async () => {
    if (!status) {
      await requestPermission();
      return;
    }

    if (!status.granted) {
      DialogUtils.showError("Please grant the camera limit");
      return;
    }

    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      CLOG.info(`上传头像: ${result}`);
      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        // 压缩图片
        const manipResult = await manipulateAsync(
          uri,
          [
            // { rotate: 90 },
            { resize: { width: 300, height: 300 } },
            // { flip: FlipType.Vertical },
          ],
          { compress: 0.5, format: SaveFormat.PNG }
        );
        const targetUri = manipResult.uri;
        // setImage(targetUri);
        const response = await uploadUserIcon(targetUri);
        uploadSuccess(response);
      }
    } catch (e) {
      DialogUtils.showError(`${e}`);
    }
  };

  // 上传成功
  const uploadSuccess = (response: AxiosResponse<any, any> | null) => {
    const topData = response?.data;
    if (topData == null) {
      return;
    }

    const { code, msg, data } = topData;
    if (code != 0) {
      DialogUtils.showError(`${msg}`);
      return;
    }

    const { filepath } = data;
    if (filepath == null) {
      DialogUtils.showError(`${msg}`);
      return;
    }

    DialogUtils.showSuccess(`Upload Success ${filepath}`);
    setLocalImage(filepath);
    CLOG.info(`localUser ${JSON.stringify(localUser)}`);

    if (localUser) {
      const item = { ...localUser };
      item.headPic = filepath;
      setLocalUser(item);
    }

    CLOG.info(`user header image upload ${formatImageUrl(filepath)}`);
  };

  // 拍照或者选择相册
  const onTakePhotoEvent = () => {
    setSelectIconVisible(false);

    setTimeout(() => {
      // 加载相机
      onLaunchCamera();
    }, 200);
  };

  // 从列表选择
  const onChooseFromLibraryEvent = () => {
    setSelectIconVisible(false);

    onPickImageEvent();

    // router.push("/setting/set_as_avatar");
  };

  // 页面可见时
  useFocusEffect(
    useCallback(() => {
      setLocalImage(localUser?.headPic);

      CLOG.info(`user header image ${formatImageUrl(localImage)}`);
    }, [localUser])
  );

  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => setSelectIconVisible(true)}>
        <Image
          source={formatImageUrl(localImage)}
          placeholder={require("@/assets/images/mine/default_icon.png")}
          style={styles.defaultIcon}
          contentFit="contain"
          placeholderContentFit="contain"
        />

        <View
          style={{
            width: 25,
            height: 25,
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
        >
          <Pressable onPress={onPickImageEvent}>
            <Image
              source={require("@/assets/images/mine/edit.png")}
              style={styles.headerSubIcon}
            />
          </Pressable>
        </View>
      </Pressable>

      {/* 切换钱包页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectIconVisible}
        onRequestClose={() => {
          setSelectIconVisible(!selectIconVisible);
        }}
      >
        <Pressable
          onPress={() => setSelectIconVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",

            // marginTop: 22,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          {/* 修改头像选项选择 */}
          <Pressable
            style={{ width: "100%", height: "75%" }}
            onPress={() => {
              setSelectIconVisible(false);
              // setConfirmRationVisible(true);
            }}
          >
            <View style={{ width: "100%", height: "100%" }}></View>
          </Pressable>

          <ImageBackground
            // style={{
            //   width: "100%",
            //   height: "110%",
            //   paddingTop: 15,
            //   paddingHorizontal: 15,
            // }}
            style={{
              paddingTop: 25,
              paddingHorizontal: 20,
              width: "100%",
              height: "25%",
              marginBottom: bottom + 20,
              borderRadius: 15,
            }}
            contentFit="fill"
            source={require("@/assets/images/nft/dialog/short_bg.png")}
            // style={styles.centeredView1}
          >
            <View
              style={{
                backgroundColor: buttonGrayBgColor,
                borderRadius: 12,
                width: "100%",
                // height: 40,
                // marginTop: 80,
                paddingHorizontal: 10,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* 拍照 */}
              <Pressable
                onPress={onTakePhotoEvent}
                style={{
                  justifyContent: "flex-start",
                  // alignContent: "flex-start",
                  alignItems: "center",
                  // flexDirection: "row",
                  height: 50,
                  width: "100%",
                  // backgroundColor: "red",
                  paddingHorizontal: 5,
                }}
                // onPress={() => onMockLoginEvent(index)}
              >
                <View>
                  <View
                    style={{
                      justifyContent: "flex-start",
                      // alignContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      height: 50,
                      width: "100%",
                      // backgroundColor: "red",
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,
                        color: "white",
                        fontSize: 14,
                        marginLeft: 5,
                        flex: 1,
                        fontWeight: "200",
                        textAlign: "center",
                      }}
                    >
                      Take Photo
                    </Text>
                  </View>
                </View>
              </Pressable>
              <Divider
                style={{ flex: 1, height: 1, width: "100%" }}
                color={buttonGray50Color}
              ></Divider>

              {/* 从相册选择 */}
              {/* <Pressable
                onPress={onChooseFromAlbumEvent}
                style={{
                  justifyContent: "flex-start",
                  // alignContent: "flex-start",
                  alignItems: "center",
                  // flexDirection: "row",
                  height: 50,
                  width: "100%",
                  // backgroundColor: "red",
                  paddingHorizontal: 5,
                }}
                // onPress={() => onMockLoginEvent(index)}
              >
                <View>
                  <View
                    style={{
                      justifyContent: "flex-start",
                      // alignContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      height: 50,
                      width: "100%",
                      // backgroundColor: "red",
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,

                        color: "white",
                        fontSize: 14,
                        marginLeft: 5,
                        flex: 1,
                        textAlign: "center",
                      }}
                    >
                      Choose from album
                    </Text>
                  </View>
                </View>
              </Pressable> */}

              {/* 从nft选择 */}
              <Pressable
                onPress={onChooseFromLibraryEvent}
                style={{
                  justifyContent: "flex-start",
                  // alignContent: "flex-start",
                  alignItems: "center",
                  // flexDirection: "row",
                  height: 50,
                  width: "100%",
                  // backgroundColor: "red",
                  paddingHorizontal: 5,
                }}
                // onPress={() => onMockLoginEvent(index)}
              >
                <View>
                  <View
                    style={{
                      justifyContent: "flex-start",
                      // alignContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      height: 50,
                      width: "100%",
                      // backgroundColor: "red",
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Squealt3Regular,

                        color: "white",
                        fontSize: 14,
                        marginLeft: 5,
                        flex: 1,
                        textAlign: "center",
                      }}
                    >
                      Choose from library
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
            {/* 导入钱包 */}
            <View
              style={{
                backgroundColor: buttonGrayBgColor,
                borderRadius: 12,
                width: "100%",
                // height: 40,
                // marginTop: 80,
                // paddingHorizontal: 10,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                marginTop: 15,
              }}
            >
              <Pressable
                onPress={() => setSelectIconVisible(false)}
                style={{
                  justifyContent: "flex-start",
                  // alignContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  height: 50,
                  width: "100%",
                  // backgroundColor: "red",
                  paddingHorizontal: 5,
                }}
                // onPress={() => onMockLoginEvent(index)}
              >
                <Text
                  style={{
                    fontFamily: Squealt3Regular,
                    color: "white",
                    fontSize: 14,
                    marginLeft: 5,
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
            </View>
          </ImageBackground>
          {/* </View> */}
        </Pressable>
        <CustomDialog />
      </Modal>
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
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "black",
    // height: 130,
    // marginBottom: 10,
  },
  defaultIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: buttonGray30Color,
    borderWidth: 1,
  },
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headerSubIcon: {
    width: 25,
    height: 25,
    // borderRadius: 5,
    // borderWidth: 1,
    // borderColor: buttonGray50Color,
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
