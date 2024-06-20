import {
  useLoginWithEmail,
  hasError,
  useLoginWithSMS,
  usePrivy,
  getUserEmbeddedWallet,
  PrivyEmbeddedWalletProvider,
} from "@privy-io/expo";
import { Button } from "@rneui/base";
import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";

import { useEmbeddedWallet, isNotCreated } from "@privy-io/expo";
import { PrivyLoginProps } from "@/constants/ViewProps";
import { router } from "expo-router";
import { DialogUtils } from "@/constants/DialogUtils";

import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

export function EmailLoginView({ callbackEvent }: PrivyLoginProps) {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("xp010054@qq.com");

  const { state, sendCode, loginWithCode } = useLoginWithEmail({
    onSendCodeSuccess(args) {
      console.log("onSendCodeSuccess" + args.email);
      DialogUtils.showSuccess("Send code success " + args.email);
    },
    onLoginSuccess(user, isNewUser) {
      // show a toast, send analytics event, etc...
      console.log("onLoginSuccess " + JSON.stringify(user));
      console.log("onLoginSuccess2 " + isNewUser);
      DialogUtils.showSuccess("Login success");

      setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
        }
      }, 2000);
    },
    onError(error) {
      console.log("onError" + error.message);
      DialogUtils.showError("Login Failed " + error.message);
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "red",
          }}
        >
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Please input email"
            keyboardType="email-address"
            maxLength={40}
            style={{
              backgroundColor: "gray",
              height: 33,
              marginVertical: 5,
              borderRadius: 5,
              paddingHorizontal: 10,
              fontSize: 16,
              flex: 1,
              marginRight: 10,
            }}
          />
          <Button
            // Keeps button disabled while code is being sent
            disabled={state.status === "sending-code"}
            onPress={() => {
              if (email.length > 0) sendCode({ email });
            }}
          >
            {state.status === "sending-code" && (
              // Shows only while the login is being attempted
              <ActivityIndicator
                style={{ marginHorizontal: 10 }}
                color={"white"}
              ></ActivityIndicator>
            )}
            <Text>Send Code</Text>
          </Button>
        </View>
        {/* {state.status === "sending-code" && (
          //  Shows only while the code is sending
          <Text>Sending Code...</Text>
        )} */}
      </View>

      <View style={{ marginHorizontal: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "red",
          }}
        >
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Please input code"
            keyboardType="phone-pad"
            maxLength={8}
            style={{
              backgroundColor: "gray",
              height: 33,
              marginVertical: 5,
              borderRadius: 5,
              paddingHorizontal: 10,
              fontSize: 16,
              flex: 1,
              marginRight: 10,
            }}
          />
          <Button
            // Keeps button disabled until the code has been sent
            disabled={state.status !== "awaiting-code-input"}
            onPress={() => {
              if (code.length >= 6) {
                loginWithCode({ code });
              }
            }}
          >
            {state.status === "submitting-code" && (
              // Shows only while the login is being attempted
              <ActivityIndicator
                style={{ marginHorizontal: 20 }}
                color={"white"}
              ></ActivityIndicator>
            )}
            <Text>Login Email</Text>
          </Button>
        </View>
        {/* {state.status === "submitting-code" && (
          // Shows only while the login is being attempted
          <Text style={{ color: "white" }}>Logging in...</Text>
        )} */}
        {/* other ui... */}

        {/* {state.status === "error" && (
          <View>
            <Text style={{ color: "red" }}>There was an error</Text>
            <Text style={{ color: "red" }}>{state.error?.message}</Text>
          </View>
        )} */}
      </View>
    </View>
  );
}

export function SmsLoginView({ callbackEvent }: PrivyLoginProps) {
  const [code, setCode] = useState("745257");
  const [phone, setPhone] = useState("5555556125");
  const [callingCode, setCallingCode] = useState("+1");
  const [countryCode, setCountryCode] = useState<CountryCode>("US");

  const { state, sendCode, loginWithCode } = useLoginWithSMS({
    onSendCodeSuccess(args) {
      console.log("onSendCodeSuccess " + args.phone);
      DialogUtils.showSuccess("Send code success " + args.phone);
    },
    onLoginSuccess(user, isNewUser) {
      // show a toast, send analytics event, etc...
      console.log("onLoginSuccess " + JSON.stringify(user));
      console.log("onLoginSuccess2 " + isNewUser);
      DialogUtils.showSuccess("Login success " + user.id);

      setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
        }
      }, 1000);
    },

    onError(error) {
      console.log("onError " + error);
      DialogUtils.showError("Login Failed " + error.message);
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "red",
          }}
        >
          <CountryPicker
            countryCode={countryCode}
            withCallingCode={true}
            withFilter={true}
            withCallingCodeButton={true}
            // theme={}
            containerButtonStyle={{
              // backgroundColor: "red",
              height: 33,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "rgb(130,130,130)",
              paddingHorizontal: 5,
            }}
            onSelect={(country: Country) => {
              setCountryCode(country.cca2);
              // setPhone(callingCode);

              if (country.callingCode.length > 0) {
                setCallingCode(country.callingCode[0]);
              }
            }}
            theme={{
              // primaryColor: "red",
              // primaryColorVariant: "green",
              backgroundColor: "black",
              onBackgroundTextColor: "white",
              fontSize: 16,
              filterPlaceholderTextColor: "#aaa",
              activeOpacity: 0.7,
              // itemHeight: 30,
            }}
          />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Please input phone"
            keyboardType="phone-pad"
            maxLength={30}
            style={{
              backgroundColor: "gray",
              height: 33,
              marginVertical: 5,
              borderRadius: 5,
              paddingHorizontal: 10,
              fontSize: 16,
              flex: 1,
              marginHorizontal: 10,
            }}
          />
          <Button
            // Keeps button disabled while code is being sent
            disabled={state.status === "sending-code"}
            onPress={() => {
              if (phone == "") {
                return;
              }

              const phoneNumber = `${callingCode}${phone}`;
              console.log(phoneNumber);
              sendCode({ phone: phoneNumber });
            }}
          >
            {state.status === "sending-code" && (
              // Shows only while the login is being attempted
              <ActivityIndicator
                style={{ marginHorizontal: 10 }}
                color={"white"}
              ></ActivityIndicator>
            )}
            <Text>Send Code</Text>
          </Button>
        </View>
        {/* {state.status === "sending-code" && (
          //  Shows only while the code is sending
          <Text>Sending Code...</Text>
        )} */}
      </View>

      <View style={{ marginHorizontal: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "red",
          }}
        >
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Please input code"
            keyboardType="phone-pad"
            maxLength={8}
            style={{
              backgroundColor: "gray",
              height: 33,
              marginVertical: 5,
              borderRadius: 5,
              paddingHorizontal: 10,
              fontSize: 16,
              flex: 1,
              marginRight: 10,
            }}
          />
          <Button
            // Keeps button disabled until the code has been sent
            disabled={state.status !== "awaiting-code-input"}
            onPress={() => loginWithCode({ code })}
          >
            {state.status === "submitting-code" && (
              // Shows only while the login is being attempted
              <ActivityIndicator
                style={{ marginHorizontal: 10 }}
                color={"white"}
              ></ActivityIndicator>
            )}
            <Text>Login SMS</Text>
          </Button>
        </View>
      </View>

      {/* {state.status === "submitting-code" && (
        // Shows only while the login is being attempted
        <Text>Logging in...</Text>
      )}
      {/* other ui... */}

      {/* {state.status === "error" && (
        <>
          <Text style={{ color: "red" }}>There was an error</Text>
          <Text style={{ color: "red" }}>{state.error?.message}</Text>
        </>
      )} */}
    </View>
  );
}
