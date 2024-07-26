import { PropsWithChildren, useState } from "react";
import { Platform, Pressable, View, ViewProps } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { CLOG } from "@/constants/LogUtils";
import Share from "react-native-share";
import * as FileSystem from "expo-file-system";

type RightViewProps = ViewProps &
  PropsWithChildren<{
    marginLeft?: number | null;
    marginRight?: number | null;
    callback?: () => void;
  }>;

export const RightLogoView = ({
  style,
  children,
  marginRight,
}: RightViewProps) => {
  const [result, setResult] = useState<string>("");

  /**
   * This function shares PDF and PNG files to
   * the Files app that you send as the urls param
   */
  const shareToFiles = async () => {
    let today = new Date();
    let date = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    const fileName = `${FileSystem.documentDirectory}app_logs_${date}-${month}-${year}.log`;
    // const fileName = `${FileSystem.documentDirectory}log.txt`;
    CLOG.info(`log file path: ${fileName}`);

    // const logFileContent = await FileSystem.readAsStringAsync(fileName);
    // CLOG.info(`log file content: ${logFileContent}`);

    const shareOptions = {
      title: "Share logs",
      failOnCancel: false,
      // saveToFiles: true,
      urls: [
        Platform.OS === "ios" ? fileName.replace("file://", "") : fileName,
      ], // base64 with mimeType or path to local file
    };

    // If you want, you can use a try catch, to parse
    // the share response. If the user cancels, etc.
    try {
      const ShareResponse = await Share.open(shareOptions);
      CLOG.log("Result =>", ShareResponse);
      setResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      CLOG.log("Error =>", error);
      setResult("error: ".concat(getErrorString(error)));
    }
  };

  const getErrorString = (error: any) => {
    let e = "Something went wrong. Please try again";
    if (typeof error === "string") {
      e = error;
    } else if (error && error.message) {
      e = error.message;
    } else if (error && error.props) {
      e = error.props;
    }
    return e;
  };

  return (
    <Pressable
      style={{ marginRight: marginRight ? marginRight : 10 }}
      onLongPress={shareToFiles}
    >
      <Image
        source={require("@/assets/images/common/logo_white.png")}
        style={{
          width: 23 * 1.2,
          height: 18 * 1.2,
          // marginRight: marginRight ? marginRight : 5,
          // backgroundColor: "red",
        }}
        contentFit="contain"
      />
    </Pressable>
  );
};

// 返回按钮
export const HeaderLeftBackView = ({
  style,
  children,
  marginLeft,
  callback,
}: RightViewProps) => {
  return (
    <Pressable
      onPress={callback}
      style={{
        width: 60,
        height: 30,
        justifyContent: "center",
      }}
    >
      <Image
        source={require("@/assets/images/common/back.png")}
        style={{
          width: 10,
          height: 19,
          marginLeft: marginLeft ? marginLeft : 10,
        }}
        contentFit="contain"
      />
    </Pressable>
  );
};
