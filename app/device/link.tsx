import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import { Image, ImageBackground } from "expo-image";
import React, { useEffect, useState } from "react";
import { Redirect, router, Stack, useNavigation } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { Button } from "@rneui/base";
import {
  buttonBgColor,
  buttonGray30Color,
  buttonGrayBgColor,
} from "@/constants/Colors";
import { Squealt3Regular } from "@/constants/FontUtils";
import { buttonGray25Color } from "../../constants/Colors";
import { percent10WinHeight } from "@/constants/CommonUtils";

export default function nftScreen() {
  // const navigation = useNavigation();

  // useEffect(() => {
  //   navigation.setOptions({
  //     tabBarStyle: { display: "flex" },
  //   });
  // }, [navigation]);

  const [vapeCodeVisible, setVapeCodeVisible] = useState(false);

  return (
    // <BottomSheetModalProvider>
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            // fontWeight: "bold",
          },
          headerBackTitleVisible: false,
          headerRight: (props) => (
            <RightLogoView marginRight={-5}></RightLogoView>
          ),
          headerLeft: (props) => (
            <HeaderLeftBackView
              callback={() => {
                if (router.canGoBack()) router.back();
              }}
            ></HeaderLeftBackView>
          ),
        }}
      />

      <BackgroundView
        style={styles.container}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <ScrollView
          style={{ width: "100%", height: "100%", paddingHorizontal: 20 }}
        >
          <TopView></TopView>
          {/* <CenterView></CenterView> */}

          {/* 设备大图 */}
          <View
            style={{
              borderRadius: 20,
              padding: 10,
              paddingBottom: 20,
              // backgroundColor: buttonGrayBgColor,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                alignContent: "center",
              }}
            >
              <Image
                style={{ width: 150, height: 150 * (327 / 210.0) }}
                source={require("@/assets/images/nft/nft_device_02.png")}
              ></Image>
            </View>
            <View
              style={{
                marginTop: 50,
                //   width: 180,
              }}
            >
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 13,
                  color: "gray",
                }}
              >
                Remaining: 10 pffs
              </Text>

              <View style={{ margin: 0, marginTop: 5 }}>
                <Image
                  style={{
                    height: 8,
                    width: "100%",
                    borderRadius: 5,
                    // flex: 1,
                  }}
                  source={require("@/assets/images/nft/nft_progress.png")}
                ></Image>
              </View>
            </View>
            <Pressable
              onPress={() => setVapeCodeVisible(true)}
              style={{
                // width: 30,
                // height: 30,
                right: 30,
                bottom: 70,
                // backgroundColor: "red",
                position: "absolute",
              }}
            >
              <Image
                style={{ width: 25, height: 20 }}
                source={require("@/assets/images/nft/scan.png")}
              ></Image>
            </Pressable>
          </View>

          <LinkedView></LinkedView>
          {/* <UnLinkedView></UnLinkedView> */}
          <View style={{ height: 30 }}></View>
        </ScrollView>
      </BackgroundView>

      {/* 输入Vape code 页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={vapeCodeVisible}
        onRequestClose={() => {
          setVapeCodeVisible(!vapeCodeVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // marginTop: 22,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View style={{ width: 300, height: 130 / (427.0 / 470) }}>
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/short_bg.png")}
              // style={styles.centeredView1}
            >
              <Pressable
                onPress={() => setVapeCodeVisible(false)}
                style={{
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <Image
                  style={{ width: 20, height: 20, marginRight: 20 }}
                  contentFit="contain"
                  source={require("@/assets/images/nft/dialog/close.png")}
                  // style={styles.centeredView1}
                ></Image>
              </Pressable>

              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 18,
                  color: "rgb(193,193,193)",
                  textAlign: "center",
                  marginTop: 5,
                }}
              >
                Lease code:
              </Text>

              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 18,
                  color: "rgb(193,193,193)",
                  textAlign: "center",
                  marginTop: 30,
                }}
              >
                2546851
              </Text>
            </ImageBackground>
          </View>
        </View>
      </Modal>
    </View>
    // </BottomSheetModalProvider>
  );
}

const TopView = () => {
  return (
    <View
      style={{
        borderRadius: 20,
        padding: 10,
        paddingBottom: 20,
        // backgroundColor: "green",
      }}
    >
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
            color: buttonBgColor,
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
            backgroundColor: buttonGrayBgColor,
            borderRadius: 8,
            marginLeft: 10,
            borderWidth: 1,
            borderColor: buttonBgColor,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: buttonBgColor,
              fontSize: 10,
              marginHorizontal: 15,
            }}
          >
            Unpaired
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontFamily: Squealt3Regular,

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
          fontFamily: Squealt3Regular,
          fontSize: 13,
          fontWeight: "bold",
          color: "white",
          marginTop: 5,
        }}
      >
        Computing power : 1.2
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          // alignContent: "flex-start",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 13,
            color: "white",
          }}
        >
          Current Pod : A
        </Text>
        <Image
          style={{ width: 6, height: 10, marginLeft: 8 }}
          source={require("@/assets/images/nft/arrow_up.png")}
          contentFit="contain"
        ></Image>

        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 9,
            // fontWeight: "bold",
            color: buttonBgColor,
            marginLeft: 2,
            textAlign: "center",
            height: 10,
          }}
        >
          XXXXXXXX
        </Text>
      </View>
    </View>
  );
};

const CenterView = () => {
  return (
    <View
      style={{
        borderRadius: 20,
        padding: 10,
        paddingBottom: 20,
        // backgroundColor: buttonGrayBgColor,
        marginVertical: 10,
      }}
    >
      <View
        style={{
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <Image
          style={{ width: 150, height: 150 * (327 / 210.0) }}
          source={require("@/assets/images/nft/nft_device_02.png")}
        ></Image>
      </View>
      <View
        style={{
          marginTop: 50,
          //   width: 180,
        }}
      >
        <Text
          style={{ fontFamily: Squealt3Regular, fontSize: 13, color: "gray" }}
        >
          Remaining: 10 pffs
        </Text>

        <View style={{ margin: 0, marginTop: 5 }}>
          <Image
            style={{
              height: 8,
              width: "100%",
              borderRadius: 5,
              // flex: 1,
            }}
            source={require("@/assets/images/nft/nft_progress.png")}
          ></Image>
        </View>
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
          bottom: 70,
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
  );
};
const LinkedView = () => {
  return (
    <View
      style={{
        borderRadius: 20,
        padding: 20,
        paddingBottom: 25,
        backgroundColor: buttonGrayBgColor,
        borderColor: buttonGray30Color,
        borderWidth: 1,
        // backgroundColor: "rgb(30,30,30)",
        // backgroundColor: "yellow",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: Squealt3Regular,
            fontSize: 18,
            color: buttonBgColor,
          }}
        >
          Current Node
        </Text>
        <View
          style={{
            // width: 50,
            // padding: 10,
            height: 16,
            backgroundColor: buttonGrayBgColor,
            borderRadius: 8,
            marginLeft: 10,
            borderWidth: 0.5,
            borderColor: buttonBgColor,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: Squealt3Regular,
              color: buttonBgColor,
              fontSize: 10,
              marginHorizontal: 15,
            }}
          >
            Unpaired
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
            borderColor: "rgb(203,155,99)",
            borderWidth: 2,
            marginLeft: 22,
            marginTop: 7,
          }}
        >
          <Image
            source={require("@/assets/images/nft/nft_bear.png")}
            style={{ width: 100, height: 100 }}
          />
        </View>
        <View style={{ marginLeft: 35 }}>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 13,
              color: "white",
              marginTop: 5,
            }}
          >
            0719
          </Text>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 13,
              color: "white",
              marginTop: 20,
            }}
          >
            Tier 12
          </Text>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 13,
              color: "white",
              marginTop: 12,
            }}
          >
            Paired Pods :
          </Text>
          <Text
            style={{
              fontFamily: Squealt3Regular,
              fontSize: 13,
              color: "white",
              marginTop: 5,
            }}
          >
            A / B / C
          </Text>
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
    // flex: 1,
    // height: 300,
    // backgroundColor: "gray",
    // margin: 10,
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
    // backgroundColor: "green",
  },
});
