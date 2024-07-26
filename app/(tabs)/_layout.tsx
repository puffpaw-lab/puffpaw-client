import { Redirect, Tabs } from "expo-router";
import React, { ReactNode, useEffect } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  View,
  ImageSourcePropType,
  StatusBar,
  BackHandler,
} from "react-native";
import { Image } from "expo-image";
import { ConstantStorage, LocalUserInfo } from "@/constants/LocalStorage";
import { useMMKVObject } from "react-native-mmkv";
import { usePrivy } from "@privy-io/expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIconParams = ImageSourcePropType | undefined;

const mainUnSelctedIcon = require("@/assets/images/tab/main_unselected.png");
const mainSelectedIcon = require("@/assets/images/tab/main_selected.png");

const ntfUnSelctedIcon = require("@/assets/images/tab/ntf_unselected.png");
const ntfSelectedIcon = require("@/assets/images/tab/ntf_selected.png");

const centerUnSelctedIcon = require("@/assets/images/tab/center_unselected.png");
const centerSelectedIcon = require("@/assets/images/tab/center_selected.png");

const shoppingUnSelctedIcon = require("@/assets/images/tab/shopping_unselected.png");
const shoppingSelectedIcon = require("@/assets/images/tab/shopping_selected.png");

const mineUnSelctedIcon = require("@/assets/images/tab/mine_unselected.png");
const mineSelectedIcon = require("@/assets/images/tab/mine_selected.png");

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // const [localUser, setLocalUser] = useMMKVObject<LocalUserInfo>(
  //   ConstantStorage.localUser
  // );

  // if (!localUser) {
  //   return <Redirect href="/login" />;
  // }
  const insets = useSafeAreaInsets();

  // useEffect(() => {
  //   // 使用BackHandler监听 Android 设备上的物理返回按钮（即硬件返回按钮）的按下事件。
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     () => {
  //       CLOG.info(`点击返回按钮`);

  //       // 在此处添加你的逻辑来阻止安卓上的返回事件
  //       return true; // 返回 true 表示已经处理了返回事件，不会继续传递
  //     }
  //   );

  //   return () => backHandler.remove();
  // }, []);

  return (
    // <PaperProvider theme={theme}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarShowLabel: false,
        // tabBarActiveBackgroundColor: "green",
        headerStyle: {
          borderBottomWidth: 0,
          elevation: 0,
          // shadowColor: "red",
          shadowOpacity: 0,
          borderBottomColor: "rgb(255,0,0)",
          borderColor: "black",
        },
        tabBarStyle: {
          backgroundColor: "black",
          shadowColor: "red",
          shadowOpacity: 0,
          elevation: 0,
          borderTopWidth: 0,
          borderTopColor: "rgb(255,0,0)",
          height: insets.bottom + 60,
        },
      }}
      initialRouteName="nft"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ height: 27, width: 27 }}
              source={focused ? mainSelectedIcon : mainUnSelctedIcon}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="nft"
        options={{
          title: "NTF",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ height: 27, width: 27, marginRight: 15 }}
              source={focused ? ntfSelectedIcon : ntfUnSelctedIcon}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="center"
        options={{
          title: "Center",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                height: 100,
                width: 80,
                // backgroundColor: "red",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{ height: 70, width: 70 }}
                source={focused ? centerSelectedIcon : centerUnSelctedIcon}
                contentFit="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ height: 27, width: 27, marginLeft: 15 }}
              source={focused ? shoppingSelectedIcon : shoppingUnSelctedIcon}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: "Mine",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ height: 27, width: 27 }}
              source={focused ? mineSelectedIcon : mineUnSelctedIcon}
              contentFit="contain"
            />
          ),
        }}
      />
    </Tabs>
    // </PaperProvider>
  );
}
