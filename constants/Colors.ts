/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

// 大的上下背景渐变
const topLinearLight = "rgb(0,0,0)";
const topLinearDark = "rgb(0,0,0)";
const bottomLinearLight = "rgb(40,15,15)";
const bottomLinearDark = "rgb(40,15,15)";

// 小的左右背景渐变
const leftLinearLight = "rgb(120,30,30)";
const leftLinearDark = "rgb(120,30,30)";
const rightLinearLight = "rgb(35,20,20)";
const rightLinearDark = "rgb(35,20,20)";

// 小的左右背景渐变
const leftLightLinearLight = "rgb(30,20,20)";
const leftLightLinearDark = "rgb(30,20,20)";
const rightLightLinearLight = "rgb(20,20,20)";
const rightLightLinearDark = "rgb(20,20,20)";

export const bgColorList = [
  { offset: "0%", color: "rgb(120,32,25)", opacity: "1" },
  // { offset: "29%", color: "#44107A", opacity: "1" },
  // { offset: "50%", color: "rgb(130,30,30)", opacity: "1" },
  { offset: "100%", color: "rgb(10,5,5)", opacity: "1" },
];

export const grayBGgColorList = [
  { offset: "0%", color: "rgb(170,170,170)", opacity: "1" },
  // { offset: "29%", color: "#44107A", opacity: "1" },
  // { offset: "50%", color: "rgb(130,30,30)", opacity: "1" },
  { offset: "100%", color: "rgb(10,5,5)", opacity: "1" },
];

export const buttonBgColor = "rgb(255,67,53)";
export const buttonGrayBgColor = "rgb(17,17,17)";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    linearBGTop: topLinearLight,
    linearBGBottom: bottomLinearLight,
    leftLinear: leftLinearLight,
    rightLinear: rightLinearLight,
    leftLightLinear: leftLightLinearLight,
    righLighttLinear: rightLightLinearLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    linearBGTop: topLinearDark,
    linearBGBottom: bottomLinearDark,
    leftLinear: leftLinearDark,
    rightLinear: rightLinearDark,
    leftLightLinear: leftLightLinearDark,
    righLightLinear: rightLightLinearDark,
  },
};
