import { usePrivy } from "@privy-io/expo";
import { router } from "expo-router";
import { useMMKVObject } from "react-native-mmkv";
import { DialogUtils } from "./DialogUtils";
import { ImageServerUrl, updateUserHeader, userLogout } from "./HttpUtils";
import { LocalUserInfo, ConstantStorage } from "./LocalStorage";
import { AddressDetailType } from "./ViewProps";
import { Dimensions } from "react-native";
import { CLOG } from "./LogUtils";
import * as Crypto from "expo-crypto";
import * as Network from "expo-network";

// 格式化
export const formatAccount = (address?: string): string => {
  if (address && address?.length > 15) {
    const len = address.length;
    return `${address.substring(0, 7)}****${address.substring(len - 7, len)}`;
  }

  return "";
};

// 格式化图片
export const formatImageUrl = (url: string | null | undefined) => {
  if (url === undefined || url === null || url === "") {
    return null;
  }

  const targetUrl = `${ImageServerUrl}${url}`;
  // CLOG.info(targetUrl);
  return targetUrl;
};

// 解析地址信息
export const parseAddress = (
  address: string | null | undefined
): AddressDetailType | null => {
  if (address === null || address === undefined) {
    return null;
  }

  try {
    var decodedStringAtoB = decodeBase64(address);
    if (decodedStringAtoB !== null && decodedStringAtoB !== "") {
      const obj = JSON.parse(decodedStringAtoB);
      CLOG.info(`解析地址成功: ${decodedStringAtoB}`);
      return obj;
    }
  } catch (error) {
    console.warn(`解析地址出错: ${address}, ${error}`);
  }

  return null;
};

// 格式化base64信息
export const formatBase64 = (
  content: string | null | undefined
): string | null => {
  if (content === null || content === undefined || content === "") {
    return null;
  }

  try {
    // encoded = strings.ReplaceAll(encoded, "/", "_")
    // encoded = strings.ReplaceAll(encoded, "+", "-")
    // let value = content.replaceAll("_", "/");
    // value = content.replaceAll("-", "+");

    CLOG.info(`formatBase64 开始: ${content}`);
    const decodedStringAtoB = atob(
      content.replace(/-/g, "+").replace(/_/g, "/")
    );
    // var decodedStringAtoB = data.toString(); // atob(content);
    CLOG.info(`formatBase64成功: ${decodedStringAtoB}`);

    return decodeURIComponent(escape(decodedStringAtoB));

    // return decodedStringAtoB;
  } catch (error) {
    console.warn(`formatBase64出错: ${content}, ${error}`);
  }

  return content;
};

// 解析base64信息
export const decodeBase64 = (
  content: string | null | undefined
): string | null => {
  if (content === null || content === undefined || content === "") {
    return null;
  }

  try {
    CLOG.info(`decodeBase64 开始: ${content}`);
    const decodedStringAtoB = atob(
      content.replace(/-/g, "+").replace(/_/g, "/")
    );
    // var decodedStringAtoB = data.toString(); // atob(content);
    CLOG.info(`decodeBase64 成功: ${decodedStringAtoB}`);

    return decodeURIComponent(escape(decodedStringAtoB));

    // return decodedStringAtoB;
  } catch (error) {
    console.warn(`decodeBase64 出错: ${content}, ${error}`);
  }

  return content;
};

// 转化成base64信息
export const encodeToBase64 = (
  content: string | null | undefined
): string | null => {
  if (content === null || content === undefined || content === "") {
    return null;
  }

  //   所以需要修改为
  // rawdata = decodeURIComponent(escape(window.atob(str)))

  //   反之亦然
  //   data = window.btoa(unescape(encodeURIComponent(str)))

  try {
    CLOG.info(`encodeToBase64 开始: ${content}`);

    const decodedStringAtoB = btoa(unescape(encodeURIComponent(content)));
    CLOG.info(`encodeToBase64 成功: ${decodedStringAtoB}`);

    return decodedStringAtoB;
  } catch (error) {
    console.warn(`encodeToBase64出错: ${content}, ${error}`);
  }

  return content;
};

// 格式化金额信息
export const formatMoney = (money: string | null | undefined): string => {
  if (money == null || money == undefined) {
    return "";
  }

  return money.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 状态               文案
// 0                 订单已创建
// 1                 订单已支付、等待确认
// 2                 支付已确定
// 3                 订单已发货
// 4                 订单已完成
// 5                 订单已取消
// 6                 订单已超时
// 7       支付异常
// 格式化订单状态信息
export const formatOrderStatus = (
  status: number | null | undefined
): string => {
  // CLOG.info("order status = " + status + typeof status);
  if (status === null || status === undefined) {
    return "";
  }

  let desc = "状态未定义";
  if (status === 0) {
    desc = "订单已创建";
  } else if (status === 1) {
    desc = "订单已支付、等待确认";
  } else if (status === 2) {
    desc = "支付已确定";
  } else if (status === 3) {
    desc = "订单已发货";
  } else if (status === 4) {
    desc = "订单已完成";
  } else if (status === 5) {
    desc = "订单已取消";
  } else if (status === 6) {
    desc = "订单已超时";
  } else if (status === 7) {
    desc = "支付异常";
  }

  return desc;
};

// 格式化时间
export const formatLocalTime = (nS: number | null | undefined) => {
  if (nS === undefined || nS === null) {
    return "--";
  }

  if (nS <= 0) {
    return "--";
  }

  return new Date(nS * 1000).toLocaleString().replace(/:\d{1,2}$/, " ");
};

// 网络是否可用
export const isNetworkEnable = async (): Promise<Boolean> => {
  const result = await Network.getNetworkStateAsync();
  if (result) {
    return (
      result.isInternetReachable !== undefined && result.isInternetReachable
    );
  }
  return true;
};

// 格式化倒计时
export const formatCountDownTime = (s: number | null) => {
  if (!s) {
    return "--";
  }

  var t = "";
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    if (hour < 10) {
      t = "0" + hour + ":";
    } else {
      t = hour + ":";
    }
    if (min < 10) {
      t += "0";
    }
    t += min + ":";
    if (sec < 10) {
      t += "0";
    }
    t += sec.toFixed(0);
  }
  return t;
};

// 屏幕尺寸
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

export const halfWinWidth = windowWidth / 2;
export const halfWinHeight = windowHeight / 2;

export const percent5WinHeight = windowHeight * 0.05;
export const percent10WinHeight = windowHeight * 0.1;
export const percent15WinHeight = windowHeight * 0.15;
export const percent20WinHeight = windowHeight * 0.2;
export const percent25WinHeight = windowHeight * 0.25;
export const percent30WinHeight = windowHeight * 0.3;
export const percent35WinHeight = windowHeight * 0.35;
export const percent40WinHeight = windowHeight * 0.4;
export const percent45WinHeight = windowHeight * 0.45;
export const percent60WinHeight = windowHeight * 0.6;

// 一天最大口数
export const OneDayMaxPuff = 100;
// 一天最小口数
export const OneDayMinPuff = 50;
// puff转换
export const OneDayCapacityPuff = 500;
