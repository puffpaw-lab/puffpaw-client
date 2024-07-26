import { useState } from "react";
import { Image, View, StyleSheet, ScrollView, Text } from "react-native";
import {
  Stack,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import { Squealt3Regular } from "@/constants/FontUtils";

export default function goodsItemScreen() {
  const { goods_id, extra, other } = useLocalSearchParams<{
    goods_id: string;
    extra?: string;
    other?: string;
  }>();

  const pathname = usePathname();

  const router = useRouter();
  const [count, setCount] = useState(0);

  const onAddToBasket = () => {};

  return (
    <SafeAreaView style={styles.safeContainer} edges={["bottom"]}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: `Edit Billing Address`,
            headerShadowVisible: true,
            headerStyle: { backgroundColor: "black" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: Squealt3Regular,
            },
            headerBackTitleVisible: false,
            headerRight: (props) => <RightLogoView></RightLogoView>,
            headerLeft: (props) => (
              <HeaderLeftBackView
                callback={() => {
                  if (router.canGoBack()) router.back();
                }}
              ></HeaderLeftBackView>
            ),
          }}
        />
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            {/* <Text>Count: {count}</Text>

            <Text style={{ color: "white" }}>
              goods_id: {goods_id}, extra={extra} params={other} pathname=
              {pathname}
            </Text> */}

            <View style={styles.topItem}>
              <Image
                source={require("@/assets/images/shop/goods_icon.png")}
                style={styles.cardIconImage}
              />
              <View style={styles.topAbsItem}>
                <Text
                  style={{
                    color: "white",
                    marginLeft: 20,
                    marginTop: 5,
                    height: 30,
                  }}
                >
                  1.8% NICO{" "}
                </Text>
                <Text style={{ color: "white", marginLeft: 20 }}>30 PFF</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Text
                style={{
                  color: "white",
                  marginLeft: 20,
                  marginTop: 15,
                  fontWeight: "bold",
                }}
              >
                Detail
              </Text>
              <Text style={{ color: "gray", marginLeft: 20 }}>Detail Info</Text>
              <Text
                style={{
                  color: "white",
                  marginLeft: 20,
                  marginTop: 5,
                  fontWeight: "bold",
                }}
              >
                Features
              </Text>
              <Text style={{ color: "gray", marginLeft: 20 }}>
                Just to add clarity for others, I'm using a bottom tab navigator
                (from react-navigation-material-bottom-tabs) and two of my tabs
                have their own stack navigators. Setting the headerStyle didn't
                remove the shadow for me, but setting cardStyle did. Here's the
                source of the whole file just so it's totally clear. The only
                lines added were the two styles in cardStyle in the stack
                function.
              </Text>
            </View>
          </ScrollView>
          <Button
            // icon="camera"
            // mode="contained"
            // buttonColor="red"
            onPress={() => {
              router.push({
                pathname: "/goods/[goods_id]",
                params: { goods_id: goods_id },
              });
            }}
            style={styles.addToBasketButton}
          >
            Save
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "black",
  },
  cardIconImage: {
    width: 220,
    height: 220,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 50,
  },
  addToBasketButton: {
    position: "absolute",
    width: "95%",
    height: 45,
    bottom: 0,
  },
  topItem: { height: 300, width: "100%", backgroundColor: "rgb(23,23,23)" },
  topAbsItem: {
    bottom: 20,
    height: 60,
    width: "100%",
    // backgroundColor: "gray",
    position: "absolute",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  detailItem: {
    height: 500,
    width: "100%",
    backgroundColor: "black",
    marginBottom: 60,
  },
  itemTitleText: { fontSize: 20, fontWeight: "bold", color: "white" },
  itemDetailText: { fontSize: 20, fontWeight: "bold", color: "gray" },
});
