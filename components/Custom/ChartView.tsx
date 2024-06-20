import { buttonBgColor } from "@/constants/Colors";
import { CustomChartProps } from "@/constants/ViewProps";
import React, { PropsWithChildren, useRef, useState } from "react";
import {
  ViewProps,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { LineChart, yAxisSides } from "react-native-gifted-charts";

import { Image } from "expo-image";

export const HomeChartView = ({ style, children }: CustomChartProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const ref = useRef<ScrollView>(null);

  const lineData = [
    { value: 45, label: "1 Jan" },
    { value: 14, label: "10 Jan" },
    { value: 98, label: "20 Jan" },
    { value: 38, label: "30 Jan" },
    { value: 236, label: "1 Feb" },
    { value: 218, label: "10 Feb" },
    { value: 14, label: "20 Feb" },
    { value: 28, label: "28 Feb" },
    { value: 4, label: "1 Mar" },
    { value: 14, label: "10 Mar" },
    { value: 8, label: "20 Mar" },
    { value: 14, label: "30 Mar" },
    { value: 8, label: "1 Apr" },
    { value: 38, label: "10 Apr" },
    { value: 164, label: "20 Apr" },
    { value: 28, label: "30 Apr" },
    { value: 4, label: "1 May" },
    { value: 150, label: "10 May" },
    { value: 8, label: "20 May" },
    { value: 14, label: "30 May" },
    { value: 8, label: "1 Jun" },
    { value: 338, label: "10 Jun" },
    { value: 14, label: "20 Jun" },
    { value: 218, label: "30 Jun" },
    { value: 4, label: "1 Jul" },
    { value: 128, label: "10 Jul" },
    { value: 4, label: "20 Jul" },
    { value: 74, label: "30 Jul" },
  ];

  const months = ["LIVE", "1D", "1W", "1M", "3M", "1Y", "5Y", "ALL"];

  const showOrHidePointer = (ind: any) => {
    ref.current?.scrollTo({
      x: ind * 200 - 25,
    }); // adjust as per your UI

    setSelectedIndex(ind);
  };
  const layout = useWindowDimensions();

  return (
    <View>
      <LineChart
        // areaChart
        scrollRef={ref}
        data={lineData}
        height={250}
        xAxisLabelsHeight={0}
        yAxisThickness={0}
        xAxisThickness={0}
        // curved
        initialSpacing={0}
        // stepHeight={20}
        spacing={30}
        thickness={2}
        // rotateLabel
        showVerticalLines
        noOfSections={5}
        // noOfVerticalLines={2}
        horizontalRulesStyle={{}}
        // verticalLinesColor={"black"}
        // showTextOnFocus
        // hideAxesAndRules
        // hideRules
        // xAxisThickness={1}
        verticalLinesSpacing={70}
        verticalLinesThickness={0.5}
        verticalLinesColor={"rgb(20,20,20)"}
        color="white"
        yAxisColor={"white"}
        color1="white"
        yAxisTextStyle={{ color: "gray" }}
        textColor1="white"
        xAxisColor="white"
        xAxisIndicesColor="white"
        xAxisLabelTextStyle={{ color: "white" }}
        yAxisIndicesColor="white"
        yAxisLabelContainerStyle="white"
        dataPointsColor="red"
        // showDataPointOnFocus
        yAxisSide={yAxisSides.RIGHT}
        width={layout.width - 60}
        rulesType="solid"
        rulesColor={"rgb(20,20,20)"}
        rulesThickness={1}
        // showXAxisIndices
        // yAxisSide={yAxisSides.RIGHT}
        // hideDataPoints
        // rulesType={""}
        // hideRules
        // rulesColor={"rgb(80,80,80)"}
        // dataPointsColor1="blue"
        // startFillColor1="rgb(80,30,30)"
        // endFillColor1="rgb(30,30,30)"
        // highlightedRange={{
        //   from: 5,
        //   to: 12,
        //   color: "green",
        // }}
        showStripOnFocus
        onPress={(item: any, index: any) => console.log("item", item)}
      />
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          // marginLeft: 8,
          margin: 10,
          paddingHorizontal: 5,
        }}
      >
        {months.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{ flex: 1, paddingHorizontal: 5 }}
              // style={
              //   selectedIndex == index
              //     ? styles.containerSelected
              //     : styles.container
              // }
              onPress={() => showOrHidePointer(index)}
            >
              <View
                style={
                  selectedIndex == index
                    ? styles.containerSelected
                    : styles.container
                }
              >
                {index == 0 && (
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      backgroundColor: "rgb(80,30,25)",
                      marginRight: 5,
                      marginLeft: 2,
                      borderRadius: 2,
                    }}
                  ></View>
                )}
                {index < months.length - 1 && (
                  <Text
                    style={
                      selectedIndex == index ? styles.textSelected : styles.text
                    }
                  >
                    {months[index]}
                  </Text>
                )}
                {index == months.length - 1 && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("@/assets/images/index/chart_trend.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 3,
    // paddingHorizontal: 2,
    // margin: 5,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "space-between",
    flexDirection: "row",
    // backgroundColor: "green",
  },
  containerSelected: {
    // paddingVertical: 5,
    // paddingHorizontal: 2,
    // margin: 4,
    backgroundColor: buttonBgColor,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "space-between",
    flexDirection: "row",
  },
  text: {
    color: buttonBgColor,
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  textSelected: {
    color: "black",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});
