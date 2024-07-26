import * as BackgroundFetch from "expo-background-fetch";
import { DialogUtils } from "./DialogUtils";

import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { CLOG } from "./LogUtils";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Device from "expo-device";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK"; // 通知事件
export const BACKGROUND_FETCH_TASK = "background-fetch"; // 后台任务

// 注册后台事件
export const registBackgroundFetchAsync = async () => {
  const status = await BackgroundFetch.getStatusAsync();
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_FETCH_TASK
  );

  CLOG.info(`Background Fetch enable=${status}, isRegistered=${isRegistered}`);

  // 注册后台事件
  if (status) {
    if (!isRegistered) {
      await registerBackgroundFetchAsync();
    } else {
      DialogUtils.showSuccess("Background fetch has registed");
    }
  } else {
    DialogUtils.showError("Background fetch not enable");
  }

  if (status && !isRegistered) {
    await registerBackgroundFetchAsync();
  }
};

// 注册所有的后台任务
export const registAllBackgroundTask = () => {
  // 注册通知事件
  TaskManager.defineTask(
    BACKGROUND_NOTIFICATION_TASK,
    ({ data, error, executionInfo }) => {
      CLOG.info("Received a notification in the background!");
      // Do something with the notification data
    }
  );

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

  // 注册后台定时任务

  // 1. Define the task by providing a name and the function that should be executed
  // Note: This needs to be called in the global scope (e.g outside of your React components)
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();

    CLOG.info(
      `Got background fetch call at date: ${new Date(now).toISOString()}`
    );

    // 发送一条本地通知
    await sendLocalNotification(`new Notification ${now}`, "test", {
      url: "test/notification",
    });

    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
  });
};

// 通知事件
export const useNotificationObserver = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      CLOG.info(
        `Receive notification  ${JSON.stringify(notification.request.content)}`
      );

      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    // 请求通知权限
    registerForPushNotificationsAsync()
      .then((token) => {
        CLOG.info(`registerForPushNotificationsAsync ${token}`);
      })
      .catch((error: any) => CLOG.info(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);

        redirect(response.notification);
      });

    return () => {
      isMounted = false;
      // subscription.remove();

      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
};

// 发送本地通知
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  CLOG.info(
    `send local notification ${title}, ${body}, ${JSON.stringify(data)}`
  );
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: data,
    },
    trigger: null,
  });
};

function handleRegistrationError(errorMessage: string) {
  DialogUtils.showError(`Notification error  ${errorMessage}`);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
const registerBackgroundFetchAsync = async () => {
  DialogUtils.showInfo("Register Background Fetch");
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 1, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
};

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
const unregisterBackgroundFetchAsync = async () => {
  DialogUtils.showInfo("UnRegister Background Fetch");

  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
};
