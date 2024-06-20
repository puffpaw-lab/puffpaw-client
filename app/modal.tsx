import { View } from "react-native";
import { Link, router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { PrivyLoginView } from "@/components/Custom/PrivyLoginView";
import Toast from "react-native-toast-message";
export default function Modal() {
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "green",
      }}
    >
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}

      {!isPresented && <Link href="../">Dismiss</Link>}

      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}

      <StatusBar style="light" />
      <Stack.Screen
        options={{
          title: "Login With Privy",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <PrivyLoginView></PrivyLoginView>
      <Toast />
    </View>
  );
}
