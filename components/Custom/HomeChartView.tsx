import { buttonBgColor } from "@/constants/Colors";
import React, { PropsWithChildren } from "react";
import { ViewProps, View, StyleSheet } from "react-native";
import { BarChart, ruleTypes, yAxisSides } from "react-native-gifted-charts";

import { Squealt3Regular } from "@/constants/FontUtils";
import { percent30WinHeight, windowWidth } from "@/constants/CommonUtils";

// 首页列表数据信息
export type HomeChartViewProps = ViewProps & {
  chartDatas: HomeChartInfo[] | undefined;
};

export const HomeChartView = ({ chartDatas }: HomeChartViewProps) => {
  return (
    <View style={{ paddingLeft: 20 }}>
      <BarChart
        data={chartDatas}
        barWidth={14}
        initialSpacing={10}
        spacing={20}
        // barBorderRadius={4}
        barBorderTopLeftRadius={4}
        barBorderTopRightRadius={4}
        // showGradient
        yAxisThickness={0}
        xAxisType={ruleTypes.SOLID}
        xAxisThickness={0}
        // xAxisColor={"white"}
        rulesLength={0}
        yAxisTextStyle={{
          fontSize: 10,
          fontFamily: Squealt3Regular,
          color: "rgb(100,100,100)",
          textAlign: "center",
        }}
        // yAxisLabelWidth={50}
        stepValue={50}
        maxValue={250}
        // yAxisTextNumberOfLines={20}
        // hideYAxisText
        // showFractionalValues
        // showXAxisIndices
        // hideAxesAndRules
        // noOfSections={6}
        // yAxisLabelTexts={["0", "1k", "2k", "3k", "4k", "5k", "6k"]}
        yAxisSide={yAxisSides.RIGHT}
        // labelWidth={30}
        yAxisColor={"white"}
        // hideRules
        width={windowWidth - 80}
        height={percent30WinHeight}
        xAxisLabelTextStyle={{
          fontSize: 12,
          fontFamily: Squealt3Regular,
          color: "rgb(100,100,100)",
          textAlign: "center",
          // backgroundColor: "red",
        }}
        // showLine
        lineConfig={{
          color: "white",
          thickness: 13,
          curved: true,
          hideDataPoints: false,
          shiftY: 20,
          initialSpacing: -30,
        }}
        focusBarOnPress
        focusedBarConfig={{
          color: "rgb(242,201,165)",
          // color: chartIndex % 2 === 0 ? "rgb(236,90,65)" : "rgb(210,216,200)",
        }}
        onPress={(item: any, index: number) => {
          // CLOG.info(index);
          // setChartIndex(index);
        }}
      ></BarChart>
    </View>
  );
};

// 列表数据类型
export type HomeChartInfo = {
  value: number;
  frontColor: string;
  gradientColor: string;
  label: string;
};

export const mockChartData: HomeChartInfo[] = [
  {
    value: 120,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 12,
    label: "7/1",
  },
  {
    value: 30,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 12,
    label: "7/2",
  },

  {
    value: 20,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 12,
    label: "7/3",
  },

  {
    value: 45,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 2,
    label: "7/4",
  },
  {
    value: 80,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 12,
    label: "7/5",
  },

  {
    value: 240,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 2,
    label: "7/6",
  },
  {
    value: 110,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 12,
    label: "7/7",
  },

  {
    value: 150,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 2,
    label: "7/8",
  },
  {
    value: 55,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 12,
    label: "7/9",
  },

  {
    value: 110,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 2,
    label: "7/10",
  },
  {
    value: 10,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 12,
    label: "7/11",
  },

  {
    value: 90,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 2,
    label: "7/12",
  },
  {
    value: 70,
    frontColor: "rgb(109,38,32)",
    gradientColor: buttonBgColor,
    // spacing: 12,
    label: "7/13",
  },
];

const styles = StyleSheet.create({
  container: {
    // borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    // backgroundColor: "green",
    // width: 30,
    // height: 20,
  },
  containerSelected: {
    // paddingVertical: 5,
    // paddingHorizontal: 2,
    // margin: 4,
    backgroundColor: buttonBgColor,
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // alignContent: "space-between",
    flexDirection: "row",
    // width: 30,
    // height: 20,
  },
  text: {
    color: buttonBgColor,
    fontSize: 12,
    textAlign: "center",
    // fontWeight: "bold",
    // flex: 1,
    // height: 30,
  },
  textSelected: {
    fontFamily: Squealt3Regular,
    color: "black",
    fontSize: 12,
    textAlign: "center",
    // fontWeight: "bold",
    // flex: 1,
    // height: 30,
  },

  yContainer: {
    fontFamily: Squealt3Regular,

    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    // backgroundColor: "green",
    // width: 30,
    // height: 20,
  },
  yContainerSelected: {
    // paddingVertical: 5,
    // paddingHorizontal: 2,
    // margin: 4,
    backgroundColor: buttonBgColor,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // alignContent: "space-between",
    flexDirection: "row",
    // width: 30,
    // height: 20,
  },
  yText: {
    color: "rgb(77,77,77)",
    fontSize: 10,
    textAlign: "center",
    // fontWeight: "bold",
    flex: 1,
    // height: 30,
  },
  yTextSelected: {
    color: "black",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
    flex: 1,
    // height: 30,
  },
});
