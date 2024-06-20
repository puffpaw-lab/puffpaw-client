// import "fast-text-encoding";
// import "react-native-get-random-values";
// import "@ethersproject/shims";

import {
  DarkTheme,
  DefaultTheme,
  // ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
// import { PrivyProvider } from "@privy-io/expo";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { createTheme, makeStyles, ThemeProvider } from "@rneui/themed";
import { PrivyProviderView } from "@/components/Custom/PrivyProvider";
import * as Linking from "expo-linking";
import { usePrivy } from "@privy-io/expo";
import { RootSiblingParent } from "react-native-root-siblings";

// App.jsx
import Toast, {
  BaseToast,
  BaseToastProps,
  ErrorToast,
} from "react-native-toast-message";

/*
  1. Create the config
*/
const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green", borderLeftWidth: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: "400",
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", borderLeftWidth: 10 }}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};

import { decode } from "base-64";
import { fontMaps } from "@/constants/FontUtils";
import { ConstantStorage, LocalUserInfo } from "@/constants/LocalStorage";
import {
  useMMKVBoolean,
  useMMKVListener,
  useMMKVObject,
} from "react-native-mmkv";
global.atob = decode;

// export const unstable_settings = {
//   // Ensure any route can link back to `/`
//   initialRouteName: "mine",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const theme = createTheme({
  lightColors: {
    primary: "white",
    secondary: "rgb(30,30,30)",
  },
  darkColors: {
    primary: "black",
    secondary: "rgb(30,30,30)",
  },
  mode: "dark",
});

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
}));

export default function RootLayout() {
  const url = Linking.useURL();

  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`
    );
  }

  const colorScheme = useColorScheme();
  const [loaded] = useFonts(fontMaps);
  const [localUser, setLocalUser] = useMMKVObject<LocalUserInfo | null>(
    ConstantStorage.localUser
  );
  // const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);

  // 每次进入时重置登录状态
  useEffect(() => {
    // setIsLogin(false);
    setLocalUser(null);
  }, []);

  const jumpToHome = () => {
    // console.log("跳转到首页");

    if (router.canGoBack()) {
      router.dismissAll();
    }
    router.replace("(tabs)");
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // 监听状态变化,跳转到不同的页面
  useMMKVListener((key) => {
    if (key === ConstantStorage.localUser) {
      // console.log(`Value for "${key}" changed! ${localUser}`);

      jumpToHome();
    } else if (key == ConstantStorage.isLogin) {
      // console.log(`Value for "${key}" changed!`);
      // jumpToLogin();
    }
  });
  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <PrivyProvider appId={"clwc9533u0fuzg2kuk39195bi"}> */}
        <RootSiblingParent>
          <PrivyProviderView>
            <ActionSheetProvider>
              <ThemeProvider
                theme={theme}
                // value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <StatusBar barStyle={"light-content"}></StatusBar>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="modal"
                    options={{
                      // Set the presentation mode to modal for our modal route.
                      presentation: "modal",
                    }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <Toast config={toastConfig} />
              </ThemeProvider>
            </ActionSheetProvider>
          </PrivyProviderView>
        </RootSiblingParent>
        {/* </PrivyProvider> */}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
