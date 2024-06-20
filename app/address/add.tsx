import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  ViewProps,
  Text,
} from "react-native";

import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";
import { RightLogoView } from "@/components/Custom/RightLogoView";
import { Squealt3Regular } from "@/constants/FontUtils";
import { buttonBgColor } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { parseAddress } from "@/constants/CommonUtils";
import { DialogUtils } from "@/constants/DialogUtils";
import {
  addressListInterface,
  addAddressInterface,
  updateAddressInterface,
  addressDetailInterface,
} from "@/constants/HttpUtils";
import { AddressDetailType, LoginFunction } from "@/constants/ViewProps";

export default function settingScreen() {
  const rightIcon = require("@/assets/images/mine/right_arrow.png");
  let width = 7,
    height = 12;

  // const [isLogin, setIsLogin] = useMMKVBoolean(ConstantStorage.isLogin);
  const [text, onChangeText] = React.useState("Useless Text");
  const [number, onChangeNumber] = React.useState("");

  // 用户shippingAddress地址信息
  const [addressInfo, setAddressInfo] = useState<AddressDetailType | null>(
    null
  );

  const { addressId, addressType, extra, other } = useLocalSearchParams<{
    addressId: string;
    addressType: string;
    extra?: string;
    other?: string;
  }>();

  const addressTitle = `${addressType === "0" ? "Shipping" : "Billing"}`;

  // 解析并且设置数据
  const parseAddresInfo = (sAddress: AddressDetailType) => {
    const { firstName, lastName, phone, country, city, postCode, address } =
      sAddress;
    if (firstName !== null && firstName !== undefined) setFirstName(firstName);
    if (lastName !== null && lastName !== undefined) setLastName(lastName);
    if (phone !== null && phone !== undefined) setPhone(phone);
    if (country !== null && country !== undefined) setCountry(country);
    if (city !== null && city !== undefined) setCity(city);
    if (postCode !== null && postCode !== undefined) setPostCode(postCode);
    if (address !== null && address !== undefined) setAddress(address);
  };

  // 获取地址详细信息
  const getAddressDetailInfo = async () => {
    if (addressId == null) {
      return;
    }

    try {
      const response = await addressDetailInterface(addressId);
      const topData = response?.data;
      if (topData == null) {
        return;
      }

      const { code, msg, data } = topData;
      if (code != 0) {
        DialogUtils.showError(`${msg}`);
        return;
      }

      const { userAddress } = data;
      if (userAddress == null) {
        DialogUtils.showSuccess(`No address info`);
        return;
      }

      // 地址接口成功
      // console.log(JSON.stringify(list));

      const { billingAddress, shippingAddress } = userAddress;

      // 解析数据
      if (addressType === "0") {
        const sAddress = parseAddress(shippingAddress);
        if (sAddress) {
          setAddressInfo(sAddress);
          parseAddresInfo(sAddress);
        }
      } else {
        const bAddress = parseAddress(billingAddress);
        if (bAddress) {
          setAddressInfo(bAddress);
          parseAddresInfo(bAddress);
        }
      }
    } catch (e) {
    } finally {
    }
  };

  // 添加地址信息
  const addAddressInfo = async () => {
    const shippingItem: AddressDetailType = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      country: country,
      address: address,
      city: city,
      stateOrProvince: stateOrProvince,
      postCode: postCode,
    };
    try {
      const shippingJsonString = JSON.stringify(shippingItem);
      var shipEncodedString: string | null = btoa(shippingJsonString);

      const billingJsonString = JSON.stringify(shippingItem);
      var billingEncodedString: string | null = btoa(billingJsonString);

      if (addressType === "0") {
        billingEncodedString = null;
      } else {
        shipEncodedString = null;
      }

      const response = await addAddressInterface(
        shipEncodedString,
        billingEncodedString
      );
      const topData = response?.data;

      if (topData == null) {
        return;
      }

      const { code, msg, data } = topData;
      if (code != 0) {
        DialogUtils.showError(`${msg}`);
        return;
      }

      const { address } = data;
      if (address == null) {
        DialogUtils.showSuccess(`add address error`);
        return;
      }

      DialogUtils.showSuccess(`add address success`);

      setTimeout(() => {
        router.back();
      }, 1000);

      // 商品接口成功
      // console.log(JSON.stringify(list));
    } catch (e) {
    } finally {
    }
  };

  // 更新地址信息
  const updateAddressInfo = async () => {
    const shippingItem: AddressDetailType = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      country: country,
      address: address,
      city: city,
      stateOrProvince: stateOrProvince,
      postCode: postCode,
    };

    try {
      const shippingJsonString = JSON.stringify(shippingItem);
      var shipEncodedString: string | null = btoa(shippingJsonString);

      const billingJsonString = JSON.stringify(shippingItem);
      var billingEncodedString: string | null = btoa(billingJsonString);

      if (addressType === "0") {
        billingEncodedString = null;
      } else {
        shipEncodedString = null;
      }

      const response = await updateAddressInterface(
        parseInt(addressId ?? ""),
        shipEncodedString,
        billingEncodedString
      );
      const topData = response?.data;
      if (topData == null) {
        return;
      }

      const { code, msg, data } = topData;
      if (code != 0) {
        DialogUtils.showError(`${msg}`);
        return;
      }

      const { isupdate } = data;
      if (isupdate == null) {
        DialogUtils.showError(`Update address error`);
        return;
      }

      DialogUtils.showSuccess(`Update address success`);

      setTimeout(() => {
        router.back();
      }, 1000);

      // 更新地址接口成功
      // console.log(JSON.stringify(list));
    } catch (e) {
    } finally {
    }
  };

  // 保存地址信息
  const saveEvent = () => {
    if (addressId === null || addressId === undefined) {
      addAddressInfo();
    } else {
      updateAddressInfo();
    }
  };

  // 默认输入
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateOrProvince, setStateOrProvince] = useState("");
  const [postCode, setPostCode] = useState("");

  const getDefaultText = (type: AddressInputType) => {
    let text: string | null | undefined = "";

    switch (type) {
      case "none":
        break;
      case "firstName":
        text = addressInfo?.firstName;
        break;
      case "lastName":
        text = addressInfo?.lastName;
        break;
      case "phone":
        text = addressInfo?.phone;
        break;
      case "country":
        text = addressInfo?.country;
        break;
      case "address":
        text = addressInfo?.address;
        break;
      case "city":
        text = addressInfo?.city;
        break;
      case "stateOrProvince":
        text = addressInfo?.stateOrProvince;
        break;
      case "postCode":
        text = addressInfo?.postCode;
        break;
    }
    console.log(text);

    return text;
  };

  useEffect(() => {
    getAddressDetailInfo();
  }, []);

  return (
    <BackgroundView x={"0%"} y={"100%"} rx={"50%"} ry={"50%"}>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: `${addressTitle} Address - ${addressId}`,
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
        <ScrollView style={{}}>
          {/* <AccountDetail title={"Account Details"}></AccountDetail> */}

          <CardSectionView
            title={"Account Details"}
            addressInfo={addressInfo}
            type="none"
          ></CardSectionView>

          {/* <CardItemView
            title="First Name"
            addressInfo={addressInfo}
            type="firstName"
            defaultText={firstName}
          ></CardItemView> */}
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 5,
              backgroundColor: "rgb(20,20,20)",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "row",
              borderRadius: 8,
              // flex: 1,
              borderColor: "rgb(50,50,50)",
              borderWidth: 1,
              height: 50,
              padding: 10,
            }}
          >
            <View style={{ ...styles.leftContainer, paddingTop: 5 }}>
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  // height: 30,
                  color: "white",
                  marginTop: 5,
                  fontSize: 14,
                }}
              >
                First Name
              </Text>
              <TextInput
                style={{
                  height: 35,
                  width: 200,
                  color: "white",
                  fontSize: 14,
                }}
                onChangeText={(text) => {
                  setFirstName(text);
                }}
                value={firstName}
              />
            </View>

            <View style={{ flex: 1 }}></View>
            <Text
              style={{
                backgroundColor: "rgb(20,20,20)",
                color: "gray",
                fontSize: 14,
                marginRight: 10,
              }}
            >
              {""}
            </Text>
            {
              <Image
                source={rightIcon}
                style={{
                  width: width,
                  height: height,
                }}
              ></Image>
            }
          </View>

          {/* <CardItemView
            title="Last Name"
            addressInfo={addressInfo}
            type="lastName"
            defaultText={lastName}
          ></CardItemView> */}

          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 5,
              backgroundColor: "rgb(20,20,20)",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "row",
              borderRadius: 8,
              // flex: 1,
              borderColor: "rgb(50,50,50)",
              borderWidth: 1,
              height: 50,
              padding: 10,
            }}
          >
            <View style={{ ...styles.leftContainer, paddingTop: 5 }}>
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  // height: 30,
                  color: "white",
                  marginTop: 5,
                  fontSize: 14,
                }}
              >
                Last Name
              </Text>
              <TextInput
                style={{
                  height: 35,
                  width: 200,
                  color: "white",
                  fontSize: 14,
                }}
                onChangeText={(text) => {
                  setLastName(text);
                }}
                value={lastName}
              />
            </View>

            <View style={{ flex: 1 }}></View>
            <Text
              style={{
                backgroundColor: "rgb(20,20,20)",
                color: "gray",
                fontSize: 14,
                marginRight: 10,
              }}
            >
              {""}
            </Text>
            {
              <Image
                source={rightIcon}
                style={{
                  width: width,
                  height: height,
                }}
              ></Image>
            }
          </View>

          {/* <CardItemView
            title="Phone number"
            addressInfo={addressInfo}
            type="phone"
            defaultText={phone}
          ></CardItemView> */}
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 5,
              backgroundColor: "rgb(20,20,20)",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "row",
              borderRadius: 8,
              // flex: 1,
              borderColor: "rgb(50,50,50)",
              borderWidth: 1,
              height: 50,
              padding: 10,
            }}
          >
            <View style={{ ...styles.leftContainer, paddingTop: 5 }}>
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  color: "white",
                  marginTop: 5,
                  fontSize: 14,
                }}
              >
                Phone number
              </Text>
              <TextInput
                style={{
                  height: 35,
                  width: 200,
                  color: "white",
                  fontSize: 14,
                }}
                onChangeText={(text) => {
                  setPhone(text);
                }}
                value={phone}
              />
            </View>

            <View style={{ flex: 1 }}></View>
            <Text
              style={{
                backgroundColor: "rgb(20,20,20)",
                color: "gray",
                fontSize: 14,
                marginRight: 10,
              }}
            >
              {""}
            </Text>
            {
              <Image
                source={rightIcon}
                style={{
                  width: width,
                  height: height,
                }}
              ></Image>
            }
          </View>

          <CardSectionView
            title={`${addressTitle} Address`}
            addressInfo={addressInfo}
            type="none"
          ></CardSectionView>

          {/* <CardItemView
            title="Country"
            showRightIcon={true}
            addressInfo={addressInfo}
            type="country"
            defaultText={country}
          ></CardItemView> */}
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 5,
              backgroundColor: "rgb(20,20,20)",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "row",
              borderRadius: 8,
              // flex: 1,
              borderColor: "rgb(50,50,50)",
              borderWidth: 1,
              height: 50,
              padding: 10,
            }}
          >
            <View style={{ ...styles.leftContainer, paddingTop: 5 }}>
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  color: "white",
                  marginTop: 5,
                  fontSize: 14,
                }}
              >
                Country
              </Text>
              <TextInput
                style={{
                  height: 35,
                  width: 200,
                  color: "white",
                  fontSize: 14,
                }}
                onChangeText={(text) => {
                  setCountry(text);
                }}
                value={country}
              />
            </View>

            <View style={{ flex: 1 }}></View>
            <Text
              style={{
                backgroundColor: "rgb(20,20,20)",
                color: "gray",
                fontSize: 14,
                marginRight: 10,
              }}
            >
              {""}
            </Text>
            {
              <Image
                source={rightIcon}
                style={{
                  width: width,
                  height: height,
                }}
              ></Image>
            }
          </View>

          {/* <CardItemView
            title="Address"
            addressInfo={addressInfo}
            type="address"
            defaultText={address}
          ></CardItemView> */}

          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 5,
              backgroundColor: "rgb(20,20,20)",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "row",
              borderRadius: 8,
              // flex: 1,
              borderColor: "rgb(50,50,50)",
              borderWidth: 1,
              height: 50,
              padding: 10,
            }}
          >
            <View style={{ ...styles.leftContainer, paddingTop: 5 }}>
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  color: "white",
                  marginTop: 5,
                  fontSize: 14,
                }}
              >
                Address
              </Text>
              <TextInput
                style={{
                  height: 35,
                  width: 200,
                  color: "white",
                  fontSize: 14,
                }}
                onChangeText={(text) => {
                  setAddress(text);
                }}
                value={address}
              />
            </View>

            <View style={{ flex: 1 }}></View>
            <Text
              style={{
                backgroundColor: "rgb(20,20,20)",
                color: "gray",
                fontSize: 14,
                marginRight: 10,
              }}
            >
              {""}
            </Text>
            {
              <Image
                source={rightIcon}
                style={{
                  width: width,
                  height: height,
                }}
              ></Image>
            }
          </View>

          {/* <CardItemView
            title="City"
            addressInfo={addressInfo}
            type="city"
            defaultText={city}
          ></CardItemView> */}

          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 5,
              backgroundColor: "rgb(20,20,20)",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "row",
              borderRadius: 8,
              // flex: 1,
              borderColor: "rgb(50,50,50)",
              borderWidth: 1,
              height: 50,
              padding: 10,
            }}
          >
            <View style={{ ...styles.leftContainer, paddingTop: 5 }}>
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  color: "white",
                  marginTop: 5,
                  fontSize: 14,
                }}
              >
                city
              </Text>
              <TextInput
                style={{
                  height: 35,
                  width: 200,
                  color: "white",
                  fontSize: 14,
                }}
                onChangeText={(text) => {
                  setCity(text);
                }}
                value={city}
              />
            </View>

            <View style={{ flex: 1 }}></View>
            <Text
              style={{
                backgroundColor: "rgb(20,20,20)",
                color: "gray",
                fontSize: 14,
                marginRight: 10,
              }}
            >
              {""}
            </Text>
            {
              <Image
                source={rightIcon}
                style={{
                  width: width,
                  height: height,
                }}
              ></Image>
            }
          </View>

          {/* <CardItemView
            title="State/Province"
            addressInfo={addressInfo}
            type="stateOrProvince"
            defaultText={stateOrProvince}
          ></CardItemView> */}

          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 5,
              backgroundColor: "rgb(20,20,20)",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "row",
              borderRadius: 8,
              // flex: 1,
              borderColor: "rgb(50,50,50)",
              borderWidth: 1,
              height: 50,
              padding: 10,
            }}
          >
            <View style={{ ...styles.leftContainer, paddingTop: 5 }}>
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  color: "white",
                  marginTop: 5,
                  fontSize: 14,
                }}
              >
                stateOrProvince
              </Text>
              <TextInput
                style={{
                  height: 35,
                  width: 200,
                  color: "white",
                  fontSize: 14,
                }}
                onChangeText={(text) => {
                  setStateOrProvince(text);
                }}
                value={stateOrProvince}
              />
            </View>

            <View style={{ flex: 1 }}></View>
            <Text
              style={{
                backgroundColor: "rgb(20,20,20)",
                color: "gray",
                fontSize: 14,
                marginRight: 10,
              }}
            >
              {""}
            </Text>
            {
              <Image
                source={rightIcon}
                style={{
                  width: width,
                  height: height,
                }}
              ></Image>
            }
          </View>

          {/* <CardItemView
            title="Postcode"
            addressInfo={addressInfo}
            type="postCode"
            defaultText={postCode}
          ></CardItemView> */}

          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginTop: 5,
              backgroundColor: "rgb(20,20,20)",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "row",
              borderRadius: 8,
              // flex: 1,
              borderColor: "rgb(50,50,50)",
              borderWidth: 1,
              height: 50,
              padding: 10,
            }}
          >
            <View style={{ ...styles.leftContainer, paddingTop: 5 }}>
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  color: "white",
                  marginTop: 5,
                  fontSize: 14,
                }}
              >
                postCode
              </Text>
              <TextInput
                style={{
                  height: 35,
                  width: 200,
                  color: "white",
                  fontSize: 14,
                }}
                onChangeText={(text) => {
                  setPostCode(text);
                }}
                value={postCode}
              />
            </View>

            <View style={{ flex: 1 }}></View>
            <Text
              style={{
                backgroundColor: "rgb(20,20,20)",
                color: "gray",
                fontSize: width,
                marginRight: height,
              }}
            >
              {""}
            </Text>
            {
              <Image
                source={rightIcon}
                style={{
                  width: width,
                  height: height,
                }}
              ></Image>
            }
          </View>

          {/* <CardItemView
            title="Phone"
            addressInfo={addressInfo}
            type="phone"
          ></CardItemView> */}
        </ScrollView>
        <Pressable onPress={saveEvent}>
          <View
            style={{
              height: 50,
              backgroundColor: buttonBgColor,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 20,
              borderRadius: 25,
            }}
          >
            <View
              style={{
                // backgroundColor: "yellow",
                // width: "90%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: Squealt3Regular,
                  color: "white",
                  fontSize: 18,
                }}
              >
                Save
              </Text>
            </View>
          </View>
        </Pressable>
        {/* <BottomButtonView></BottomButtonView> */}
      </SafeAreaView>
    </BackgroundView>
  );
}

// const AccountDetail = ({ title }: BillingProps) => {
//   return (
//     <>
//       <CardSectionView title={"Account Details"}></CardSectionView>

//       <CardItemView title="First Name"></CardItemView>
//       <CardItemView title="Last Name"></CardItemView>
//       <CardItemView title="Phone number"></CardItemView>
//     </>
//   );
// };

// const BillingAddressDetail = ({ title }: BillingProps) => {
//   return (
//     <>
//       <CardSectionView title={"Billing Address"}></CardSectionView>

//       <CardItemView title="Country" showRightIcon={true}></CardItemView>
//       <CardItemView title="Address"></CardItemView>
//       <CardItemView title="City"></CardItemView>
//       <CardItemView title="State/Province"></CardItemView>
//       <CardItemView title="Postcode"></CardItemView>
//       <CardItemView title="Phone"></CardItemView>
//     </>
//   );
// };

// 输入类型
type AddressInputType =
  | "none"
  | "firstName"
  | "lastName"
  | "phone"
  | "country"
  | "address"
  | "city"
  | "stateOrProvince"
  | "postCode";

// 账单信息
type AddressFunction = (text: string) => void;

type BillingProps = ViewProps & {
  title: string;
  defaultText?: string | null;
  rightText?: string;
  showRightIcon?: boolean;
  addressInfo: AddressDetailType | null;
  type: AddressInputType;
  callbackEvent?: AddressFunction;
};

const CardSectionView = ({ title }: BillingProps) => {
  return (
    <View
      style={[
        styles.sectionContainer,
        {
          // height: 20,
          marginTop: 20,
          marginLeft: 20,
        },
      ]}
    >
      <Text
        style={{
          color: "red",
          fontSize: 14,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const BottomButtonView = () => {
  return (
    <View
      style={{
        // marginHorizontal: 30,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
      }}
    >
      <View
        style={{
          marginHorizontal: 20,
          backgroundColor: "red",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          height: 45,
          width: "90%",
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "black", fontSize: 16 }}>Save</Text>
      </View>
    </View>
  );
};

const CardItemView = ({
  title,
  rightText,
  showRightIcon,
  addressInfo,
  type,
  defaultText,
  callbackEvent,
}: BillingProps) => {
  const rightIcon = require("@/assets/images/mine/right_arrow.png");
  let width = 7,
    height = 12;

  const ddd = defaultText == undefined ? "" : defaultText;
  // 默认输入
  const [inputText, setInputText] = useState(ddd);

  console.log("defaultText " + defaultText + " inputText " + inputText);

  const getDefaultText = () => {
    let text: string | null | undefined = "";

    switch (type) {
      case "none":
        break;
      case "firstName":
        text = addressInfo?.firstName;
        break;
      case "lastName":
        text = addressInfo?.lastName;
        break;
      case "phone":
        text = addressInfo?.phone;
        break;
      case "country":
        text = addressInfo?.country;
        break;
      case "address":
        text = addressInfo?.address;
        break;
      case "city":
        text = addressInfo?.city;
        break;
      case "stateOrProvince":
        text = addressInfo?.stateOrProvince;
        break;
      case "postCode":
        text = addressInfo?.postCode;
        break;
    }
    console.log(text);

    return text;
  };

  // 修改输入
  const onChangeText = (e: any) => {
    console.log("输入" + e);
    if (callbackEvent) {
      callbackEvent(e);
    }
  };

  useEffect(() => {
    // const text = getDefaultText();
    // console.log(text);
    // if (text === null) {
    // } else {
    //   setDefaultText(text);
    // }
  }, []);

  return (
    <Pressable
      onPress={() => {
        if (callbackEvent) callbackEvent("1");
      }}
    >
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
          backgroundColor: "rgb(20,20,20)",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "row",
          borderRadius: 8,
          // flex: 1,
          borderColor: "rgb(50,50,50)",
          borderWidth: 1,
          height: 50,
          padding: 10,
        }}
      >
        <View style={{ ...styles.leftContainer, paddingTop: 5 }}>
          <Text
            style={{
              backgroundColor: "rgb(20,20,20)",
              // height: 30,
              color: "white",
              marginTop: 5,
              fontSize: 14,
            }}
          >
            {title}
          </Text>
          <TextInput
            style={{
              height: 35,
              width: 200,
              color: "white",
              fontSize: 14,
              // margin: 12,
              // borderWidth: 1,
              // padding: 10,
              // marginLeft: 15,
              // backgroundColor: "red",
            }}
            // onChangeText={onChangeText}
            value={ddd}
          />
        </View>

        <View style={{ flex: 1 }}></View>
        <Text
          style={{
            backgroundColor: "rgb(20,20,20)",
            color: "gray",
            fontSize: 14,
            marginRight: 10,
          }}
        >
          {rightText}
        </Text>
        {showRightIcon && (
          <Image
            source={rightIcon}
            style={{
              width: width,
              height: height,
            }}
          ></Image>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "black",
  },
  scrollView: { flex: 1 },
  logo: {
    width: 60,
    height: 30,
    position: "absolute",
    marginTop: 30,
    right: 20,
  },
  card: {
    // width: "100%",
    height: 50,
    // marginLeft: 10,
    // marginRight: 10,
    margin: 5,
    backgroundColor: "rgb(20,20,20)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 8,
    flex: 1,
    borderColor: "rgb(50,50,50)",
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sectionContainer: {
    // position: "absolute",
    left: 0,
    alignContent: "center",
    alignItems: "flex-start",
    // backgroundColor: "rgb(20,20,20)",
    height: 25,
    color: "white",
    marginTop: 20,
  },
  sectionTitle: {
    // position: "absolute",
    left: 20,
    alignContent: "center",
    alignItems: "flex-start",
    marginTop: 5,
    // backgroundColor: "rgb(20,20,20)",
    height: 30,
    color: "white",
    fontSize: 14,
  },
  leftContainer: {
    // position: "absolute",
    alignContent: "center",
    alignItems: "flex-start",
    // backgroundColor: "green",
    flex: 8,
    // height: 50,
  },
  leftTitle: {
    top: 0,
    left: 15,
    backgroundColor: "rgb(20,20,20)",
    // height: 30,
    color: "white",
    fontSize: 14,
  },
  input: {
    height: 25,
    width: 200,
    // margin: 12,
    borderWidth: 0,
    borderColor: "gray",
    // padding: 10,
    marginLeft: 15,
    // backgroundColor: "red",
  },
  rightContainer: {
    width: 30,
    height: 50,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
  goodsItemArrow: {
    // flex: 1,
    top: 17,
    objectFit: "contain",
    width: 15,
    height: 15,
    resizeMode: "contain",
    right: 0,
  },
  headerContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "black",
    height: 120,
  },
  saveButton: {
    position: "absolute",
    width: "90%",
    height: 45,
    bottom: 0,
    left: "5%",
  },
});
