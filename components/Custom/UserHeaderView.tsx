import { router } from "expo-router";
import React, { useState } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { uploadUserIcon } from "@/constants/HttpUtils";
import { AxiosResponse } from "axios";
import { DialogUtils } from "@/constants/DialogUtils";
import { formatImageUrl } from "@/constants/CommonUtils";
import { LocalUserInfo, ConstantStorage } from "@/constants/LocalStorage";
import { useMMKVObject } from "react-native-mmkv";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";

export const UserHeaderView = () => {
  return (
    <View style={styles.headerContainer}>
      <HeaderIconView></HeaderIconView>
      <Text
        style={{
          color: "white",
          // marginLeft: 20,
          margin: 5,
          fontWeight: "bold",
          // marginTop: 5,
        }}
      >
        BeatingSoul
      </Text>
      <View style={styles.headerIconContainer}>
        <Pressable onPress={() => {}}>
          <Image
            source={require("@/assets/images/mine/tuite.png")}
            style={styles.headerSubIcon}
          />
        </Pressable>
        <View style={{ width: 20 }}></View>
        <Pressable onPress={() => {}}>
          <Image
            source={require("@/assets/images/mine/telegram.png")}
            style={styles.headerSubIcon}
          />
        </Pressable>
      </View>
    </View>
  );
};

export const HeaderIconView = () => {
  const [localUser, setLocalUser] = useMMKVObject<LocalUserInfo | null>(
    ConstantStorage.localUser
  );
  const [image, setImage] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState<string | undefined | null>(
    localUser?.headPic
  );
  console.log(`user header image ${formatImageUrl(localImage)}`);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(`上传头像: ${result}`);

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
      setImage(targetUri);

      const response = await uploadUserIcon(targetUri);
      uploadSuccess(response);
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

    console.log(`user header image upload ${formatImageUrl(filepath)}`);
  };
  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={pickImage}>
        <Image
          source={formatImageUrl(localImage)}
          placeholder={require("@/assets/images/mine/default_icon.png")}
          style={styles.defaultIcon}
          contentFit="contain"
          placeholderContentFit="contain"
        />

        <View
          style={{
            width: 20,
            height: 20,
            position: "absolute",
            top: 30,
            right: 30,
          }}
        >
          <Pressable onPress={pickImage}>
            <Image
              source={require("@/assets/images/mine/edit.png")}
              style={styles.headerSubIcon}
            />
          </Pressable>
        </View>
      </Pressable>
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
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "black",
    // height: 130,
    // marginBottom: 10,
  },
  defaultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headerSubIcon: {
    width: 20,
    height: 20,
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
