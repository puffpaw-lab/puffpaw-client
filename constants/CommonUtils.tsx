import { usePrivy } from "@privy-io/expo";
import { router } from "expo-router";
import { useMMKVObject } from "react-native-mmkv";
import { DialogUtils } from "./DialogUtils";
import { ImageServerUrl, updateUserHeader, userLogout } from "./HttpUtils";
import { LocalUserInfo, ConstantStorage } from "./LocalStorage";
import { AddressDetailType } from "./ViewProps";

// 格式化
const formatAccount = (address?: string): string => {
  if (address && address?.length > 15) {
    const len = address.length;
    return `${address.substring(0, 7)}****${address.substring(
      len - 7,
      len - 1
    )}`;
  }

  return "";
};

// 格式化图片
const formatImageUrl = (url: string | null | undefined) => {
  const targetUrl = `${ImageServerUrl}${url}`;
  // console.log(targetUrl);
  return targetUrl;
};

// 解析地址信息
const parseAddress = (
  address: string | null | undefined
): AddressDetailType | null => {
  if (address == null || address == undefined) {
    return null;
  }

  try {
    var decodedStringAtoB = atob(address);
    const obj = JSON.parse(decodedStringAtoB);
    console.log(`解析地址成功: ${decodedStringAtoB}`);
    return obj;
  } catch (error) {
    console.error(`解析地址出错: ${address}, ${error}`);
  }

  return null;
};

export { formatAccount, formatImageUrl, parseAddress };
