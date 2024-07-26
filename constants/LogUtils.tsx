import {
  logger,
  consoleTransport,
  fileAsyncTransport,
  sentryTransport,
} from "react-native-logs";
import * as FileSystem from "expo-file-system";

let today = new Date();
let date = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

const config = {
  transport: [consoleTransport, fileAsyncTransport],
  severity: __DEV__ ? "debug" : "error",
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
    FS: FileSystem,
    fileName: `app_logs_{date-today}.log`, // logs_{date-today} Create a new file every day
    filePath: FileSystem.documentDirectory,
  },
};

var CLOG = logger.createLogger(config);

export { CLOG };
