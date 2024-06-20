import { Image, ScrollView, StyleSheet, View, Text } from "react-native";

import React from "react";
import { Redirect, Stack } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";

export default function nftScreen() {
  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Link To Device",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackTitleVisible: false,
          headerRight: (props) => <RightLogoView></RightLogoView>,
        }}
      />

      <BackgroundView
        style={styles.container}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <ScrollView style={{ flex: 1 }}>
          <TopView></TopView>
          <CenterView></CenterView>
          <LinkedView></LinkedView>
          <UnLinkedView></UnLinkedView>
        </ScrollView>
      </BackgroundView>
    </View>
    // </BottomSheetModalProvider>
  );
}

const TopView = () => {
  return (
    <View style={{ ...styles.topContainer }}>
      <View style={{ borderRadius: 20, padding: 10, paddingBottom: 20 }}>
        <View
          style={{
            flex: 1,
            //   height: 100,
            backgroundColor: "gray",
            borderRadius: 15,
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "red",
              // marginTop: 30,
              fontWeight: "500",
            }}
          >
            Current Vape
          </Text>
          <View
            style={{
              // width: 50,
              // padding: 10,
              height: 16,
              // backgroundColor: "red",
              borderRadius: 8,
              marginLeft: 10,
              borderWidth: 0.5,
              borderColor: "red",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "red", fontSize: 10, marginHorizontal: 15 }}>
              Unbind
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "bold",
            color: "white",
            marginTop: 8,
          }}
        >
          BSAGSDSADA
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "bold",
            color: "white",
            marginTop: 8,
          }}
        >
          Computing power: 12
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            // alignContent: "flex-start",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "bold", color: "white" }}>
            Current Catridge: A
          </Text>
          <View
            style={{
              // width: 10,
              // height: 10,
              // borderRadius: 5,
              // backgroundColor: "red",
              marginLeft: 10,
            }}
          >
            <Image
              style={{ width: 8, height: 12 }}
              source={require("@/assets/images/nft/arrow_up.png")}
            ></Image>
          </View>

          <Text
            style={{
              fontSize: 13,
              // fontWeight: "bold",
              color: "red",
              marginLeft: 5,
            }}
          >
            Overweight
          </Text>
        </View>
      </View>
    </View>
  );
};

const CenterView = () => {
  return (
    <View style={{ ...styles.topContainer }}>
      <View style={{ borderRadius: 20, padding: 10, paddingBottom: 20 }}>
        <View
          style={{
            flex: 1,
            //   backgroundColor: "gray",
            borderRadius: 15,
            //   height: 200,
            //   width: 100,
            alignSelf: "center",
          }}
        >
          <Image
            style={{ width: 200, height: 200 * (652 / 467.0) }}
            source={require("@/assets/images/nft/nft_device.png")}
          ></Image>
        </View>
        <View
          style={{
            marginTop: 30,
            //   width: 180,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "bold", color: "gray" }}>
            Remaining: 10 puffs
          </Text>
          {/* <ProgressBar
            progress={0.4}
            color={MD3Colors.error50}
            fillStyle={{ backgroundColor: "red" }}
            style={{
              marginTop: 10,
              backgroundColor: "rgb(50,50,50)",

              height: 10,
              borderRadius: 5,
            }}
          /> */}
        </View>
        <View
          style={{
            // width: 30,
            // height: 30,
            right: 30,
            bottom: 90,
            // backgroundColor: "red",
            position: "absolute",
          }}
        >
          <Image
            style={{ width: 25, height: 20 }}
            source={require("@/assets/images/nft/scan.png")}
          ></Image>
        </View>
      </View>
    </View>
  );
};
const LinkedView = () => {
  return (
    <View style={{ ...styles.topContainer }}>
      <View
        style={{
          borderRadius: 20,
          padding: 20,
          paddingBottom: 20,
          backgroundColor: "rgb(30,30,30)",
        }}
      >
        <View
          style={{
            flex: 1,
            //   height: 100,
            // backgroundColor: "gray",
            borderRadius: 15,
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "red",
              // marginTop: 30,
              fontWeight: "500",
            }}
          >
            Current NFT
          </Text>
          <View
            style={{
              // width: 50,
              // padding: 10,
              height: 16,
              // backgroundColor: "red",
              borderRadius: 8,
              marginLeft: 10,
              borderWidth: 0.5,
              borderColor: "red",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "red", fontSize: 10, marginHorizontal: 15 }}>
              Unbind
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            // alignContent: "flex-start",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <View
            style={{
              borderRadius: 8,
              // width: 100,
              // height: 100,
              // backgroundColor: "red",
              borderColor: "gold",
              borderWidth: 1,
              marginLeft: 25,
              marginTop: 10,
            }}
          >
            <Image
              source={require("@/assets/images/mine/default_ntf_01.png")}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <View style={{ marginLeft: 35 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: "white",
                // marginTop: 8,
              }}
            >
              0719
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: "white",
                marginTop: 15,
              }}
            >
              Rarity12 (puffs: 20)
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: "white",
                marginTop: 12,
              }}
            >
              Paired Pods:
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: "white",
                marginTop: 5,
              }}
            >
              A / B / C
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const UnLinkedView = () => {
  return (
    <View style={{ ...styles.topContainer }}>
      <View
        style={{
          borderRadius: 20,
          padding: 20,
          paddingBottom: 20,
          backgroundColor: "rgb(30,30,30)",
        }}
      >
        <View
          style={{
            flex: 1,
            //   height: 100,
            // backgroundColor: "gray",
            borderRadius: 15,
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "red",
              // marginTop: 30,
              fontWeight: "500",
            }}
          >
            Current NFT
          </Text>
        </View>

        <View
          style={{
            // flexDirection: "row",
            justifyContent: "flex-start",
            // alignContent: "flex-start",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "white",
              marginTop: 40,
              fontWeight: "500",
            }}
          >
            You donot bind any NFT yet.
          </Text>
          <View
            style={{
              height: 40,
              width: 170,
              backgroundColor: "red",
              borderRadius: 20,
              justifyContent: "center",
              // alignContent: "flex-start",
              alignItems: "center",
              marginVertical: 40,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "black",
                // marginTop: 30,
                fontWeight: "500",
              }}
            >
              Bind NFT
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const BottomButton = () => {
  return (
    <Button
      // mode="contained"
      // buttonColor="red"
      style={{ marginHorizontal: 20, marginTop: 50 }}
    >
      Link To Device
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "flex-start",
    backgroundColor: "black",
  },
  topContainer: {
    flex: 1,
    // height: 300,
    // backgroundColor: "gray",
    margin: 10,
    // marginLeft: 30,
  },
  chartContainer: { height: 300, backgroundColor: "gray", margin: 10 },
  image: {
    width: 200,
    height: 200,
  },
  logo: {
    width: 60,
    height: 30,
    position: "absolute",
    marginTop: 30,
    right: 20,
  },
  pagerView: {
    flex: 1,
    width: 300,
    height: 300,
    backgroundColor: "gray",
  },
  contentContainer: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "green",
  },
});
