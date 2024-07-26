import { buttonGray30Color } from "@/constants/Colors";
import { CLOG } from "@/constants/LogUtils";
import { RatioPickerViewProps } from "@/constants/ViewProps";
import React from "react";
import { ViewProps } from "react-native";
import { Picker } from "react-native-wheel-pick";

// 比例选择
export const RatioPickerView = ({
  ratioText,
  callback,
}: RatioPickerViewProps) => {
  return (
    <Picker
      style={{
        backgroundColor: buttonGray30Color,
        // width: 300,
        // height: 215,
        flex: 1,
        // width: "100%",
        // color: "white",
        borderRadius: 15,
      }}
      selectedValue={ratioText}
      textColor="white"
      // textSize="16"

      pickerData={[
        { value: "0", label: "0%" },
        { value: "10", label: "10%" },
        { value: "20", label: "20%" },
        { value: "30", label: "30%" },
        { value: "40", label: "40%" },
        { value: "50", label: "50%" },
        { value: "60", label: "60%" },
        { value: "70", label: "70%" },
        { value: "80", label: "80%" },
      ]}
      onValueChange={(value: string) => {
        CLOG.info(value);
        callback(value);
      }} // '5765387680'
      // android only
      // textSize={16}
      // selectTextColor="white"
      // isShowSelectBackground={false} // Default is true
      // selectBackgroundColor="#8080801A" // support HEXA color Style (#rrggbbaa)
      // (Please always set 'aa' value for transparent)

      // selectLineColor="black"
      // selectLineSize={30} // Default is 4
    />
  );
};
