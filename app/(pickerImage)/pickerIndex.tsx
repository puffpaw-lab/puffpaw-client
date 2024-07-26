import { useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import React from "react";
import { CLOG } from "@/constants/LogUtils";

export default function ImagePickerExample() {
  const [image, setImage] = useState("null");

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    CLOG.info(result);

    if (!result.canceled) {
      const { assets } = result;
      if (assets.length > 0) {
        setImage(assets[0].uri);
      }
      //   setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "自定义页面",
          headerStyle: { backgroundColor: "#f4111e" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            // fontWeight: "bold",
          },

          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
