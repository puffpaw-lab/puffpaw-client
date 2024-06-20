import { router } from "expo-router";
import React, { PropsWithChildren, useState } from "react";
import { View, Pressable, StyleSheet, Text, ViewProps } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { uploadUserIcon } from "@/constants/HttpUtils";
import { AxiosResponse } from "axios";
import { DialogUtils } from "@/constants/DialogUtils";
import { buttonBgColor } from "@/constants/Colors";
import { LoginFunction } from "@/constants/ViewProps";
import { useMMKVObject } from "react-native-mmkv";
import { ConstantStorage, LocalCartInfo } from "@/constants/LocalStorage";

export type FloatCartProps = ViewProps &
  PropsWithChildren<{
    right: number;
    bottom: number;
    callbackEvent?: LoginFunction;
  }>;

export const FloatCartView = ({
  right,
  bottom,
  callbackEvent,
}: FloatCartProps) => {
  // 购物车信息
  const [localCartList, setLocalCartList] = useMMKVObject<
    LocalCartInfo[] | null
  >(ConstantStorage.cartInfo);

  // 获取单条数量
  const getItemNumber = (): number => {
    let itemNumber = 0;
    if (localCartList) {
      localCartList.map((e) => {
        if (e) {
          itemNumber += e.goodsNumber;
        }
      });
    }

    return itemNumber;
  };

  // 购物车
  const cartEvent = () => {
    router.push({
      pathname: "/goods/cart",
    });
  };

  return (
    <Pressable onPress={cartEvent}>
      <View
        style={{
          width: 50,
          height: 50,
          right: right,
          bottom: bottom,
          backgroundColor: buttonBgColor,
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
        }}
      >
        <Image
          source={require("@/assets/images/common/cart.png")}
          style={{ width: 30, height: 30, marginRight: 3 }}
        />
        {localCartList && localCartList.length > 0 && (
          <Text
            style={{
              width: 20,
              height: 20,
              fontSize: 20,
              // borderRadius: 10,
              // backgroundColor: "green",
              color: "white",
              position: "absolute",
              textAlign: "center",
              top: -5,
              right: 0,
            }}
          >
            {getItemNumber()}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  defaultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
