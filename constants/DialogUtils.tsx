import Toast from "react-native-toast-message";

export class DialogUtils {
  static showSuccess(text1: string, text2?: string) {
    Toast.show({
      type: "success",
      text1: text1,
      text2: text2,
    });
  }
  static showError(text1: string, text2?: string) {
    Toast.show({
      type: "error",
      text1: text1,
      text2: text2,
    });
  }
  static showInfo(text1: string, text2?: string) {
    Toast.show({
      type: "info",
      text1: text1,
      text2: text2,
    });
  }
}
