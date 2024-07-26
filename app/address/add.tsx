import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  ViewProps,
  Text,
  Modal,
} from "react-native";

import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMMKVBoolean } from "react-native-mmkv";
import { ConstantStorage } from "@/constants/LocalStorage";

import { BackgroundView } from "@/components/Custom/BackgroundView";
import {
  HeaderLeftBackView,
  RightLogoView,
} from "@/components/Custom/RightLogoView";
import { Squealt3Regular } from "@/constants/FontUtils";
import { buttonBgColor, buttonGray50Color } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  encodeToBase64,
  parseAddress,
  percent10WinHeight,
  percent40WinHeight,
  percent5WinHeight,
  percent60WinHeight,
} from "@/constants/CommonUtils";
import {
  CustomDialog,
  DialogUtils,
  toastConfig,
} from "@/constants/DialogUtils";
import {
  addressListInterface,
  addAddressInterface,
  updateAddressInterface,
  addressDetailInterface,
} from "@/constants/HttpUtils";
import { AddressDetailType, LoginFunction } from "@/constants/ViewProps";
import {
  CityModel,
  CountryModel,
  parseCountryData,
  PhoneCountryModel,
} from "@/constants/CountryProps";
import { ImageBackground } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { CLOG } from "@/constants/LogUtils";
import Toast from "react-native-toast-message";

export default function settingScreen() {
  const { addressId, addressType, extra, other } = useLocalSearchParams<{
    addressId: string;
    addressType: string;
    extra?: string;
    other?: string;
  }>();

  // 国家数据
  const [defaultCountryDatas, setDefaultCountryDatas] = useState<
    CountryModel[] | null | undefined
  >(null);
  const [countryDatas, setCountryDatas] = useState<
    CountryModel[] | null | undefined
  >(null);
  const [selectedCountry, setSelectedCountry] = useState<
    CountryModel | null | undefined
  >(null);
  const [countryVisible, setCountryVisible] = useState(false);

  const [filterCountryText, setFilterCountryText] = useState("");
  const [countryClearVisible, setCountryClearVisible] = useState(false); // 搜索国家的清除按钮

  // 城市
  const [cityDatas, setCityDatas] = useState<CityModel[] | null | undefined>(
    null
  );
  const [selectedCity, setSelectedCity] = useState<
    CityModel | null | undefined
  >(null);
  const [cityVisible, setCityVisible] = useState(false);

  // 读取城市数据
  const loadRegionData = async () => {
    try {
      CLOG.info(`loadRegionData`);
      const datas = require("@/assets/datas/data_region.json");

      // CLOG.info(datas);
      if (datas !== null && datas !== undefined) {
        const parsedData = parseCountryData(datas);
        setCountryDatas(parsedData);
        setDefaultCountryDatas(parsedData);
      }
    } catch (e) {
      CLOG.info(`localUri: ${e}`);
    }
  };

  const isAdd = addressId === undefined || addressId === null;
  const addressPrevfix = `${isAdd ? "Add" : "Edit"}`;
  const addressTitle = `${addressType === "0" ? "Shipping" : "Billing"}`;

  // 用户shippingAddress地址信息
  const [addressInfo, setAddressInfo] = useState<AddressDetailType | null>(
    null
  );

  // 备份
  const [base64AddressInfo, setBase64AddressInfo] = useState<string | null>(
    null
  );

  // 解析并且设置数据
  const parseAddresInfo = (sAddress: AddressDetailType) => {
    const {
      firstName,
      lastName,
      phone,
      phoneCallCode,
      country,
      city,
      postCode,
      address,
      stateOrProvince,
    } = sAddress;
    if (firstName !== null && firstName !== undefined) setFirstName(firstName);
    if (lastName !== null && lastName !== undefined) setLastName(lastName);
    if (phone !== null && phone !== undefined) setPhone(phone);
    if (country !== null && country !== undefined) setCountry(country);
    if (city !== null && city !== undefined) setCity(city);
    if (postCode !== null && postCode !== undefined) setPostCode(postCode);
    if (address !== null && address !== undefined) setAddress(address);
    if (stateOrProvince !== null && stateOrProvince !== undefined)
      setStateOrProvince(stateOrProvince);
    if (phoneCallCode !== null && phoneCallCode !== undefined) {
      setLocalPhoneCallCode(phoneCallCode);
    }
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
      // CLOG.info(JSON.stringify(list));

      const { shippingAddress } = userAddress;

      // 解析数据
      if (addressType === "0") {
        if (
          shippingAddress === null ||
          shippingAddress === undefined ||
          shippingAddress === ""
        ) {
        } else {
          const sAddress = parseAddress(shippingAddress);
          if (sAddress) {
            parseAddresInfo(sAddress);
            setAddressInfo(sAddress);
            setBase64AddressInfo(`${shippingAddress}`);
          }
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
      phone: `${phone}`,
      phoneCallCode: `${localPhoneCallCode}`,
      country: country,
      address: address,
      city: city,
      stateOrProvince: stateOrProvince,
      postCode: postCode,
    };
    try {
      const shippingJsonString = JSON.stringify(shippingItem);
      var shipEncodedString: string | null = encodeToBase64(shippingJsonString);

      // const billingJsonString = JSON.stringify(shippingItem);
      // var billingEncodedString: string | null = btoa(billingJsonString);

      // if (addressType === "0") {
      //   billingEncodedString = null;
      // } else {
      //   shipEncodedString = null;
      // }

      const response = await addAddressInterface(
        shipEncodedString,
        null
        // billingEncodedString
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
      // CLOG.info(JSON.stringify(list));
    } catch (e) {
    } finally {
    }
  };

  // 更新地址信息
  const updateAddressInfo = async () => {
    const shippingItem: AddressDetailType = {
      firstName: firstName,
      lastName: lastName,
      phone: `${phone}`,
      phoneCallCode: `${localPhoneCallCode}`,
      country: country,
      address: address,
      city: city,
      stateOrProvince: stateOrProvince,
      postCode: postCode,
    };

    try {
      const shippingJsonString = JSON.stringify(shippingItem);
      var shipEncodedString: string | null = encodeToBase64(shippingJsonString);

      const billingJsonString = JSON.stringify(shippingItem);
      var billingEncodedString: string | null =
        encodeToBase64(billingJsonString);

      if (addressType === "0") {
        billingEncodedString = null;
      } else {
        shipEncodedString = null;
      }

      // 判断是否有修改
      if (
        base64AddressInfo !== null &&
        base64AddressInfo !== "" &&
        base64AddressInfo === shipEncodedString
      ) {
        DialogUtils.showInfo("Save success");
        setTimeout(() => {
          if (router.canGoBack()) router.back();
        }, 500);
        return;
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
      // CLOG.info(JSON.stringify(list));
    } catch (e) {
      CLOG.info(e);
    } finally {
    }
  };

  // 保存地址信息
  const saveEvent = () => {
    if (firstName === "" || lastName === "" || phone === "" || country === "") {
      DialogUtils.showError("Please input address info");
      return;
    }

    if (isAdd) {
      addAddressInfo();
    } else {
      updateAddressInfo();
    }
  };

  // 默认输入
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [localPhoneCallCode, setLocalPhoneCallCode] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateOrProvince, setStateOrProvince] = useState("");
  const [postCode, setPostCode] = useState("");

  // 手机号选择国家数据
  const [defaultPhoneCountryDatas, setDefaultPhoneCountryDatas] = useState<
    PhoneCountryModel[] | null | undefined
  >(null);
  const [phoneCountryDatas, setPhoneCountryDatas] = useState<
    PhoneCountryModel[] | null | undefined
  >(null);
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState<
    PhoneCountryModel | null | undefined
  >({
    english_name: "United States",
    chinese_name: "美国",
    country_code: "US",
    phone_code: "1",
  });
  const [phoneCountryVisible, setPhoneCountryVisible] = useState(false);
  const [phoneFilterCountryText, setPhoneFilterCountryText] = useState("");
  const [phoneCountryClearVisible, setPhoneCountryClearVisible] =
    useState(false); // 搜索国家的清除按钮

  // 保存完整手机号
  useEffect(() => {
    setLocalPhoneCallCode(`${selectedPhoneCountry?.phone_code}`);
  }, [selectedPhoneCountry]);

  // 国家手机区号搜索
  useEffect(() => {
    CLOG.info(phoneFilterCountryText);
    if (!defaultPhoneCountryDatas) {
      return;
    }

    setPhoneCountryClearVisible(phoneFilterCountryText !== "");

    if (phoneFilterCountryText === "") {
      loadPhoneRegionData();
      return;
    }

    const filterCountryDatas = defaultPhoneCountryDatas.filter((e) => {
      const exist =
        e.english_name
          ?.toLowerCase()
          .includes(phoneFilterCountryText.toLowerCase()) ||
        e.chinese_name
          ?.toLowerCase()
          .includes(phoneFilterCountryText.toLowerCase()) ||
        e.phone_code
          ?.toLowerCase()
          .includes(phoneFilterCountryText.toLowerCase()) ||
        e.country_code
          ?.toLowerCase()
          .includes(phoneFilterCountryText.toLowerCase());

      if (exist) {
        return e;
      }
      return null;
    });

    setPhoneCountryDatas(filterCountryDatas);
  }, [phoneFilterCountryText]);

  // 读取手机号城市数据
  const loadPhoneRegionData = async () => {
    try {
      CLOG.info(`loadPhoneData`);
      const datas = require("@/assets/datas/country_phone_codes.json");

      // CLOG.info(datas);
      if (datas !== null && datas !== undefined) {
        // const parsedData = parseCountryData(datas);
        setPhoneCountryDatas(datas);
        setDefaultPhoneCountryDatas(datas);
      }
    } catch (e) {
      CLOG.info(`localUri: ${e}`);
    }
  };

  // 设置默认的手机号国家
  useEffect(() => {
    if (localPhoneCallCode === undefined || localPhoneCallCode === null) {
      return;
    }

    if (!defaultPhoneCountryDatas) {
      return;
    }

    const filterCountryDatas = defaultPhoneCountryDatas.filter((e) => {
      const exist =
        e.phone_code?.toLowerCase() === localPhoneCallCode.toLowerCase();

      if (exist) {
        return e;
      }
    });

    if (filterCountryDatas.length > 0) {
      CLOG.info("设置默认手机号和国家");
      CLOG.info(JSON.stringify(filterCountryDatas));

      if (filterCountryDatas.length > 1) {
        setSelectedPhoneCountry(filterCountryDatas[1]);
      } else {
        setSelectedPhoneCountry(filterCountryDatas[0]);
      }
    }
  }, [localPhoneCallCode, defaultPhoneCountryDatas]);

  // 选择了国家
  useEffect(() => {
    if (countryDatas !== undefined && countryDatas !== null) {
      setCityDatas(selectedCountry?.children);
    }
  }, [selectedCountry]);

  // 国家搜索
  useEffect(() => {
    CLOG.info(filterCountryText);
    if (!defaultCountryDatas) {
      return;
    }

    setCountryClearVisible(filterCountryText !== "");

    if (filterCountryText === "") {
      loadRegionData();
      return;
    }

    const filterCountryDatas = defaultCountryDatas.filter((e) => {
      const exist =
        e.label_en?.toLowerCase().includes(filterCountryText.toLowerCase()) ||
        e.value?.toLowerCase().includes(filterCountryText.toLowerCase());

      if (exist) {
        return e;
      }
      return null;
    });

    setCountryDatas(filterCountryDatas);
  }, [filterCountryText]);

  // 设置默认国家
  useEffect(() => {
    if (addressInfo === undefined || addressInfo === null) {
      return;
    }

    if (countryDatas === null || countryDatas === undefined) {
      return;
    }

    const { country, stateOrProvince } = addressInfo;
    if (country !== null && country !== undefined) {
      // country
      const tempDatas = countryDatas.filter((e) => {
        if (e.label_en === country) {
          return e;
        }
      });
      const tempCountry =
        tempDatas !== undefined && tempDatas !== null ? tempDatas[0] : null;

      CLOG.info("设置默认的国家");
      CLOG.info(tempDatas);

      setSelectedCountry(tempCountry);
    }
  }, [countryDatas, addressInfo]);

  useEffect(() => {
    loadRegionData();
    loadPhoneRegionData();
    getAddressDetailInfo();
  }, []);

  return (
    <BackgroundView x={"0%"} y={"100%"} rx={"50%"} ry={"50%"}>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: `${addressPrevfix} ${addressTitle} Address`,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: "black" },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: Squealt3Regular,
            },
            headerTitleAlign: "center",
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
        <ScrollView style={{ width: "100%", height: "100%", flex: 1 }}>
          {/* <AccountDetail title={"Account Details"}></AccountDetail> */}

          <View style={{ height: percent5WinHeight }}></View>
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
              marginHorizontal: 20,
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
            <View
              style={{
                ...styles.leftContainer,
                paddingTop: 2,
                paddingBottom: 5,
              }}
            >
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  // height: 30,
                  color: "rgb(174,174,174)",
                  fontSize: 10,
                }}
              >
                First Name
              </Text>
              <TextInput
                style={{
                  fontFamily: Squealt3Regular,
                  // height: 35,
                  width: "80%",
                  color: "white",
                  fontSize: 16,
                }}
                maxLength={20}
                onChangeText={(text) => {
                  setFirstName(text);
                }}
                value={firstName}
              />
            </View>
          </View>

          {/* <CardItemView
            title="Last Name"
            addressInfo={addressInfo}
            type="lastName"
            defaultText={lastName}
          ></CardItemView> */}

          <View
            style={{
              marginHorizontal: 20,
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
            <View
              style={{
                ...styles.leftContainer,
                paddingTop: 2,
                paddingBottom: 5,
              }}
            >
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  // height: 30,
                  color: "rgb(174,174,174)",
                  marginTop: 5,
                  fontSize: 10,
                }}
              >
                Last Name
              </Text>
              <TextInput
                style={{
                  fontFamily: Squealt3Regular,
                  // height: 35,
                  width: "80%",
                  color: "white",
                  fontSize: 16,
                }}
                maxLength={20}
                onChangeText={(text) => {
                  setLastName(text);
                }}
                value={lastName}
              />
            </View>
          </View>

          {/* <CardItemView
            title="Phone number"
            addressInfo={addressInfo}
            type="phone"
            defaultText={phone}
          ></CardItemView> */}
          <View
            style={{
              marginHorizontal: 20,

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
            <View
              style={{
                ...styles.leftContainer,
                paddingTop: 2,
                paddingBottom: 5,
              }}
            >
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  color: "rgb(174,174,174)",
                  marginTop: 5,
                  fontSize: 10,
                }}
              >
                Phone number
              </Text>

              <Pressable
                onPress={() => {
                  setPhoneFilterCountryText("");
                  setPhoneCountryVisible(true);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selectedPhoneCountry && (
                  <Text
                    style={{
                      // height: 20,
                      color: "white",
                      fontSize: 12,
                      marginLeft: 5,
                    }}
                  >
                    {selectedPhoneCountry?.country_code}
                  </Text>
                )}

                {selectedPhoneCountry && (
                  <Text
                    style={{
                      // height: 20,
                      color: "white",
                      fontSize: 12,
                      marginHorizontal: 5,
                    }}
                  >
                    +{selectedPhoneCountry?.phone_code}
                  </Text>
                )}
                {selectedPhoneCountry && (
                  <Image
                    style={{ width: 9, height: 9, marginHorizontal: 3 }}
                    source={require("@/assets/images/login/login_down_arrow.png")}
                    contentFit="contain"
                  ></Image>
                )}
                {!selectedPhoneCountry && (
                  <Text
                    style={{
                      // height: 20,
                      color: "white",
                      fontSize: 12,
                      marginRight: 5,
                    }}
                  >
                    Select Country
                  </Text>
                )}

                <TextInput
                  style={{
                    fontFamily: Squealt3Regular,
                    // height: 35,
                    // width: "80%",
                    flex: 1,
                    color: "white",
                    fontSize: 16,
                  }}
                  keyboardType="phone-pad"
                  maxLength={20}
                  onChangeText={(text) => {
                    setPhone(text);
                  }}
                  value={phone}
                />
              </Pressable>
            </View>
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
              marginHorizontal: 20,

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
            <Pressable
              onPress={() => {
                setFilterCountryText("");
                setCountryVisible(true);
              }}
              style={{
                ...styles.leftContainer,
                paddingTop: 2,
                paddingBottom: 5,
              }}
            >
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  color: "rgb(174,174,174)",
                  marginTop: 5,
                  fontSize: 10,
                }}
              >
                Country
              </Text>
              <TextInput
                style={{
                  fontFamily: Squealt3Regular,
                  // height: 35,
                  width: "80%",
                  color: "white",
                  fontSize: 16,
                }}
                editable={false}
                maxLength={30}
                onChangeText={(text) => {
                  setCountry(text);
                }}
                value={country}
              />

              <View
                style={{
                  position: "absolute",
                  justifyContent: "flex-end",
                  alignContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  // marginVertical: 5,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: 40,
                }}
              >
                <Image
                  source={require("@/assets/images/mine/address_down_arrow.png")}
                  style={{ width: 12, height: 12, marginRight: 10 }}
                />
              </View>
            </Pressable>
          </View>

          {/* <CardItemView
            title="Address"
            addressInfo={addressInfo}
            type="address"
            defaultText={address}
          ></CardItemView> */}

          <View
            style={{
              marginHorizontal: 20,

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
            <View
              style={{
                ...styles.leftContainer,
                paddingTop: 2,
                paddingBottom: 5,
              }}
            >
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  color: "rgb(174,174,174)",
                  marginTop: 5,
                  fontSize: 10,
                }}
              >
                Address
              </Text>
              <TextInput
                style={{
                  fontFamily: Squealt3Regular,
                  // height: 35,
                  width: "100%",
                  color: "white",
                  fontSize: 16,
                }}
                maxLength={100}
                onChangeText={(text) => {
                  setAddress(text);
                }}
                value={address}
              />
            </View>
          </View>

          {/* <CardItemView
            title="City"
            addressInfo={addressInfo}
            type="city"
            defaultText={city}
          ></CardItemView> */}

          <View
            style={{
              marginHorizontal: 20,

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
            <View
              style={{
                ...styles.leftContainer,
                paddingTop: 2,
                paddingBottom: 5,
              }}
            >
              <Text
                style={{
                  backgroundColor: "rgb(20,20,20)",
                  color: "rgb(174,174,174)",
                  marginTop: 5,
                  fontSize: 10,
                }}
              >
                city
              </Text>
              <TextInput
                style={{
                  fontFamily: Squealt3Regular,
                  // height: 35,
                  width: "100%",
                  color: "white",
                  fontSize: 16,
                }}
                maxLength={100}
                onChangeText={(text) => {
                  setCity(text);
                }}
                value={city}
              />
            </View>
          </View>

          {/* <CardItemView
            title="State/Province"
            addressInfo={addressInfo}
            type="stateOrProvince"
            defaultText={stateOrProvince}
          ></CardItemView> */}

          {/* 邮编 */}
          <View
            style={{
              justifyContent: "flex-start",
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginTop: 5,

              paddingHorizontal: 20,
              // marginVertical: 5,
            }}
          >
            <View
              style={{
                // marginLeft: 10,
                marginRight: 5,
                paddingLeft: 10,
                backgroundColor: "rgb(20,20,20)",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
                flexDirection: "row",
                borderRadius: 8,
                flex: 1,
                borderColor: "rgb(50,50,50)",
                borderWidth: 1,
                height: 50,
                // padding: 10,
              }}
            >
              <Pressable
                onPress={() => {
                  if (!selectedCountry) {
                    DialogUtils.showInfo("Please select country");
                    return;
                  }

                  setCityVisible(true);
                }}
                style={{
                  flex: 1,
                  paddingTop: 2,
                  paddingBottom: 5,
                }}
              >
                <Text
                  style={{
                    backgroundColor: "rgb(20,20,20)",
                    color: "rgb(174,174,174)",
                    marginTop: 5,
                    fontSize: 10,
                  }}
                >
                  State/province
                </Text>
                <TextInput
                  style={{
                    fontFamily: Squealt3Regular,
                    // height: 35,
                    width: "100%",
                    color: "white",
                    fontSize: 16,
                  }}
                  maxLength={30}
                  onChangeText={(text) => {
                    setStateOrProvince(text);
                  }}
                  value={stateOrProvince}
                />

                <View
                  style={{
                    position: "absolute",
                    justifyContent: "flex-end",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    // marginVertical: 5,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 40,
                  }}
                >
                  <Image
                    source={require("@/assets/images/mine/address_down_arrow.png")}
                    style={{ width: 12, height: 12, marginRight: 15 }}
                  />
                </View>
              </Pressable>
            </View>

            <View
              style={{
                marginLeft: 5,
                paddingLeft: 10,
                // marginRight: 10,
                backgroundColor: "rgb(20,20,20)",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
                flexDirection: "row",
                borderRadius: 8,
                flex: 1,
                borderColor: "rgb(50,50,50)",
                borderWidth: 1,
                height: 50,
                // padding: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  paddingTop: 2,
                  paddingBottom: 5,
                }}
              >
                <Text
                  style={{
                    backgroundColor: "rgb(20,20,20)",
                    color: "rgb(174,174,174)",
                    marginTop: 5,
                    fontSize: 10,
                  }}
                >
                  ZIP/postal/postCode
                </Text>
                <TextInput
                  style={{
                    fontFamily: Squealt3Regular,
                    // height: 35,
                    width: "80%",
                    color: "white",
                    fontSize: 16,
                  }}
                  keyboardType="number-pad"
                  maxLength={20}
                  onChangeText={(text) => {
                    setPostCode(text);
                  }}
                  value={postCode}
                />
              </View>
            </View>
          </View>

          <Pressable onPress={saveEvent}>
            <View
              style={{
                height: 50,
                backgroundColor: buttonBgColor,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 20,
                flexDirection: "row",
                marginTop: 25,
                marginBottom: 40,
                borderRadius: 25,
              }}
            >
              <View
                style={{
                  // backgroundColor: "yellow",
                  // width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
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

          {/* <CardItemView
            title="Phone"
            addressInfo={addressInfo}
            type="phone"
          ></CardItemView> */}
        </ScrollView>

        {/* <BottomButtonView></BottomButtonView> */}
      </SafeAreaView>

      {/* 国家选择页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={countryVisible}
        onRequestClose={() => {
          setCountryVisible(!countryVisible);
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
          <View
            style={{
              marginTop: percent40WinHeight,
              width: "100%",
              height: percent60WinHeight,
            }}
          >
            {/* <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/long_bg.png")}
              // style={styles.centeredView1}
            > */}
            <Pressable
              onPress={() => setCountryVisible(false)}
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                marginVertical: 10,
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

            {/* 文本内容 */}
            <View
              style={{
                // flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 15,
                paddingHorizontal: 0,
                // backgroundColor: "red",
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  // flex: 1,
                  borderRadius: 25,
                  height: 40,
                  width: "100%",
                  backgroundColor: "rgb(20,20,20)",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  borderColor: buttonGray50Color,
                  borderWidth: 1,
                }}
              >
                <Image
                  source={require("@/assets/images/mine/search.png")}
                  style={{ width: 18, height: 18 }}
                />
                <TextInput
                  placeholder="Search..."
                  placeholderTextColor={"gray"}
                  value={filterCountryText}
                  style={{
                    color: "white",
                    fontSize: 14,
                    flex: 1,
                    marginLeft: 10,
                  }}
                  onChangeText={setFilterCountryText}
                  maxLength={20}
                ></TextInput>
                {countryClearVisible && (
                  <Pressable
                    onPress={() => {
                      setFilterCountryText("");
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 40,
                      // backgroundColor: "red",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <Image
                        source={require("@/assets/images/login/clear.png")}
                        style={{ width: 18, height: 18 }}
                      />
                    </View>
                  </Pressable>
                )}
              </View>
            </View>

            {/* 输入框 */}
            <View
              style={{
                paddingHorizontal: 15,
                flexDirection: "row",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <FlashList
                  // numColumns={2}
                  data={countryDatas}
                  renderItem={({ item, index }) => {
                    return (
                      <Pressable
                        style={{
                          // marginHorizontal: 20,
                          backgroundColor: "rgb(17,17,17)",
                          height: 50,
                          width: "100%",
                          marginBottom: 5,
                          borderRadius: 8,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center",
                          paddingHorizontal: 10,
                        }}
                        onPress={() => {
                          setCountry(item.label_en ?? "");
                          setSelectedCountry(item);
                          setCountryVisible(false);

                          setStateOrProvince("");
                          // router.push({
                          //   pathname: "/goods/[goods_id]",
                          //   params: { goods_id: item.title },
                          // });
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Squealt3Regular,
                            fontSize: 16,
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          {item.label_en}
                        </Text>
                        <View style={{ flex: 1 }}></View>
                        <Text
                          style={{
                            fontFamily: Squealt3Regular,
                            fontSize: 16,
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          {}
                        </Text>
                      </Pressable>
                    );
                  }}
                  estimatedItemSize={50}
                />
              </View>
            </View>
            {/* </ImageBackground> */}
          </View>
        </View>
        <CustomDialog />
      </Modal>

      {/* 城市选择页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cityVisible}
        onRequestClose={() => {
          setCityVisible(!cityVisible);
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
          <View
            style={{
              marginTop: percent40WinHeight,
              width: "100%",
              height: percent60WinHeight,
            }}
          >
            {/* <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/long_bg.png")}
              // style={styles.centeredView1}
            > */}
            <Pressable
              onPress={() => setCityVisible(false)}
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                marginVertical: 10,
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

            {/* 文本内容 */}
            {/* <Text
                style={{
                  fontFamily: Squealt3Regular,
                  fontSize: 16,
                  color: "white",
                  textAlign: "center",
                  marginTop: 5,
                }}
              >
                please select State/Province
              </Text> */}

            {/* 输入框 */}
            <View
              style={{
                paddingHorizontal: 25,
                flexDirection: "row",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <FlashList
                  // numColumns={2}
                  data={cityDatas}
                  renderItem={({ item, index }) => {
                    return (
                      <Pressable
                        style={{
                          // marginHorizontal: 20,
                          backgroundColor: "rgb(17,17,17)",
                          height: 50,
                          width: "100%",
                          marginBottom: 5,
                          borderRadius: 8,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center",
                          paddingHorizontal: 10,
                        }}
                        onPress={() => {
                          setStateOrProvince(item.label_en ?? "");
                          setSelectedCity(item);
                          setCityVisible(false);
                          // router.push({
                          //   pathname: "/goods/[goods_id]",
                          //   params: { goods_id: item.title },
                          // });
                        }}
                      >
                        {/* 提示信息 */}
                        <Text
                          style={{
                            fontFamily: Squealt3Regular,
                            fontSize: 16,
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          {item.label_en}
                        </Text>
                        <View style={{ flex: 1 }}></View>
                        <Text
                          style={{
                            fontFamily: Squealt3Regular,
                            fontSize: 16,
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          {}
                        </Text>
                      </Pressable>
                    );
                  }}
                  estimatedItemSize={50}
                />
              </View>
            </View>
            {/* </ImageBackground> */}
          </View>
        </View>
        <CustomDialog />
      </Modal>

      {/* 手机号国家选择页面 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={phoneCountryVisible}
        onRequestClose={() => {
          setPhoneCountryVisible(!phoneCountryVisible);
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
          <View
            style={{
              marginTop: percent40WinHeight,
              width: "100%",
              height: percent60WinHeight,
            }}
          >
            {/* <ImageBackground
              style={{ width: "100%", height: "100%" }}
              contentFit="fill"
              source={require("@/assets/images/nft/dialog/long_bg.png")}
              // style={styles.centeredView1}
            > */}
            <Pressable
              onPress={() => setPhoneCountryVisible(false)}
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: 10,
                flexDirection: "row",
              }}
            >
              <Image
                style={{ width: 20, height: 20, marginRight: 25 }}
                contentFit="contain"
                source={require("@/assets/images/nft/dialog/close.png")}
                // style={styles.centeredView1}
              ></Image>
            </Pressable>

            <View
              style={{
                // flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 15,
                paddingHorizontal: 0,
                // backgroundColor: "red",
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  // flex: 1,
                  borderRadius: 25,
                  height: 40,
                  width: "100%",
                  backgroundColor: "rgb(20,20,20)",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  borderColor: buttonGray50Color,
                  borderWidth: 1,
                }}
              >
                <Image
                  source={require("@/assets/images/mine/search.png")}
                  style={{ width: 18, height: 18 }}
                />
                <TextInput
                  placeholder="Search..."
                  placeholderTextColor={"gray"}
                  value={phoneFilterCountryText}
                  style={{
                    color: "white",
                    fontSize: 14,
                    flex: 1,
                    marginLeft: 10,
                  }}
                  onChangeText={setPhoneFilterCountryText}
                  maxLength={20}
                ></TextInput>
                {phoneCountryClearVisible && (
                  <Pressable
                    onPress={() => {
                      setPhoneFilterCountryText("");
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 40,
                      // backgroundColor: "red",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <Image
                        source={require("@/assets/images/login/clear.png")}
                        style={{ width: 18, height: 18 }}
                      />
                    </View>
                  </Pressable>
                )}
              </View>
            </View>

            {/* 输入框 */}
            <View
              style={{
                paddingHorizontal: 20,
                flexDirection: "row",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <FlashList
                  // numColumns={2}
                  // ListHeaderComponent={
                  //   <View
                  //     style={{
                  //       // flexDirection: "row",
                  //       justifyContent: "center",
                  //       alignItems: "center",
                  //       paddingTop: 10,
                  //       paddingBottom: 5,
                  //       paddingHorizontal: 0,
                  //       // backgroundColor: "red",
                  //     }}
                  //   >
                  //     <View
                  //       style={{
                  //         flex: 1,
                  //         borderRadius: 25,
                  //         height: 40,
                  //         width: "100%",
                  //         backgroundColor: "rgb(20,20,20)",
                  //         flexDirection: "row",
                  //         justifyContent: "space-between",
                  //         alignItems: "center",
                  //         paddingHorizontal: 15,
                  //         borderColor: buttonGray50Color,
                  //         borderWidth: 1,
                  //       }}
                  //     >
                  //       <Image
                  //         source={require("@/assets/images/mine/search.png")}
                  //         style={{ width: 18, height: 18 }}
                  //       />
                  //       <TextInput
                  //         placeholder="Search..."
                  //         placeholderTextColor={"gray"}
                  //         value={filterCountryText}
                  //         style={{
                  //           color: "white",
                  //           fontSize: 14,
                  //           flex: 1,
                  //           marginLeft: 10,
                  //         }}
                  //         onChangeText={setFilterCountryText}
                  //         maxLength={20}
                  //       ></TextInput>
                  //     </View>
                  //   </View>
                  // }
                  data={phoneCountryDatas}
                  renderItem={({ item, index }) => {
                    return (
                      <Pressable
                        style={{
                          // marginHorizontal: 20,
                          backgroundColor: "rgb(17,17,17)",
                          height: 50,
                          width: "100%",
                          marginBottom: 5,
                          borderRadius: 10,
                          borderColor: "rgb(40,40,40)",
                          borderWidth: 0.5,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center",
                          paddingHorizontal: 10,
                        }}
                        onPress={() => {
                          // setCountry(item.label_en ?? "");
                          setSelectedPhoneCountry(item);
                          setPhoneCountryVisible(false);
                        }}
                      >
                        {/* <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            alignContent: "center",
                          }}
                        > */}
                        {/* 提示信息 */}
                        <Text
                          style={{
                            fontFamily: Squealt3Regular,
                            fontSize: 16,
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          {item.english_name}
                        </Text>
                        <View style={{ flex: 1 }}></View>
                        <Text
                          style={{
                            fontFamily: Squealt3Regular,
                            fontSize: 16,
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          +{item.phone_code}
                        </Text>
                        {/* </View> */}
                      </Pressable>
                    );
                  }}
                  estimatedItemSize={50}
                />
              </View>
            </View>
            {/* </ImageBackground> */}
          </View>
        </View>
        <CustomDialog />
      </Modal>
    </BackgroundView>
  );
}

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
          marginLeft: 30,
        },
      ]}
    >
      <Text
        style={{
          color: buttonBgColor,
          fontSize: 14,
        }}
      >
        {title}
      </Text>
    </View>
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
