import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BleErrorCode,
  Device,
  State,
  Subscription,
} from "react-native-ble-plx";
import BleModule from "./BleModule";
import Characteristic from "./components/Characteristic";
import Header from "./components/BLEHeaderView";
import { alert } from "./utils";
import { BleManagerUtils } from "./BleUtils";
import {
  RightLogoView,
  HeaderLeftBackView,
} from "@/components/Custom/RightLogoView";
import { Squealt3Regular } from "@/constants/FontUtils";
import { Stack, router } from "expo-router";
import { BackgroundView } from "@/components/Custom/BackgroundView";
import { DialogUtils } from "@/constants/DialogUtils";

// 注意: 需要确保全局只有一个BleManager实例，因为BleModule类保存着蓝牙的连接信息
const bleModule = BleManagerUtils.bleModule; // new BleModule();

export default function deviceScreen() {
  // 蓝牙是否连接
  const [isConnected, setIsConnected] = useState(false);
  // 正在扫描中
  const [scaning, setScaning] = useState(false);
  // 蓝牙是否正在监听
  const [isMonitoring, setIsMonitoring] = useState(false);
  // 当前正在连接的蓝牙id
  const [connectingId, setConnectingId] = useState("");
  // 写数据
  const [writeData, setWriteData] = useState("");
  // 接收到的数据
  const [receiveData, setReceiveData] = useState("");
  // 读取的数据
  const [readData, setReadData] = useState("");
  // 输入的内容
  const [inputText, setInputText] = useState("");
  // 扫描的蓝牙列表
  const [data, setData] = useState<Device[]>([]);

  /** 蓝牙接收的数据缓存 */
  const bleReceiveData = useRef<any[]>([]);
  /** 使用Map类型保存搜索到的蓝牙设备，确保列表不显示重复的设备 */
  const deviceMap = useRef(new Map<string, Device>());

  const scanTimer = useRef<NodeJS.Timeout>();
  const disconnectListener = useRef<Subscription>();
  const monitorListener = useRef<Subscription>();

  useEffect(() => {
    // 监听蓝牙开关
    const stateChangeListener = bleModule.manager.onStateChange((state) => {
      console.log("onStateChange: ", state);
      if (state == State.PoweredOn) {
        scan();
      }
    });

    return () => {
      stateChangeListener?.remove();
      disconnectListener.current?.remove();
      monitorListener.current?.remove();
    };
  }, []);

  // 请求android权限
  const requestAndroidLimit = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permission Localisation Bluetooth",
          message: "Requirement for Bluetooth",
          buttonNeutral: "Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
    }
  };

  // 扫描设备
  const scan = () => {
    setScaning(true);
    deviceMap.current.clear();
    bleModule.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("startDeviceScan error:", error);
        DialogUtils.showError(error.message);
        if (error.errorCode === BleErrorCode.BluetoothPoweredOff) {
          enableBluetooth();
        } else if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
          // 请求权限
          requestAndroidLimit();
        }

        setScaning(false);
      } else if (device) {
        // console.log(device);
        // console.log(device.id, device.name);
        deviceMap.current.set(device.id, device);
        setData([...deviceMap.current.values()]);
      }
    });

    scanTimer.current && clearTimeout(scanTimer.current);
    scanTimer.current = setTimeout(() => {
      bleModule.stopScan();
      setScaning(false);
    }, 5000); // 3秒后停止搜索
  };

  function enableBluetooth() {
    if (Platform.OS === "ios") {
      alert("Please enable bluetooth");
    } else {
      Alert.alert("Alert", "Please enable bluetooth", [
        {
          text: "Cancel",
          onPress: () => {},
        },
        {
          text: "Open",
          onPress: () => {
            bleModule.manager.enable();
          },
        },
      ]);
    }
  }

  function connect(item: Device) {
    // 连接的时候正在扫描，先停止扫描
    if (scaning) {
      bleModule.stopScan();
      setScaning(false);
    }
    // 正在连接中
    setConnectingId(item.id);
    bleModule
      .connect(item.id)
      .then(() => {
        // 连接成功后，列表只显示已连接的设备
        setData([item]);
        setIsConnected(true);
        onDisconnect();
      })
      .catch((err) => {
        alert("Connect error " + err);
      })
      .finally(() => {
        setConnectingId("");
      });
  }

  function read(index: number) {
    bleModule
      .read(index)
      .then((value: any) => {
        setReadData(value);
      })
      .catch((err) => {});
  }

  function write(writeType: "write" | "writeWithoutResponse") {
    return (index: number) => {
      if (inputText.length === 0) {
        alert("请输入消息内容");
        return;
      }

      bleModule[writeType](inputText, index)
        .then(() => {
          bleReceiveData.current = [];
          setWriteData(inputText);
          setInputText("");
        })
        .catch((err) => {
          alert("发送失败");
        });
    };
  }

  /** 监听蓝牙数据 */
  function monitor(index: number) {
    monitorListener.current = bleModule.manager.monitorCharacteristicForDevice(
      bleModule.peripheralId,
      bleModule.nofityServiceUUID[index],
      bleModule.nofityCharacteristicUUID[index],
      (error, characteristic) => {
        if (error) {
          setIsMonitoring(false);
          console.log("monitor fail:", error);
          alert("monitor fail: " + error.reason);
        } else {
          setIsMonitoring(false);
          bleReceiveData.current.push(characteristic!.value); //数据量多的话会分多次接收
          setReceiveData(bleReceiveData.current.join(""));
          console.log("monitor success", characteristic!.value);
        }
      }
    );
  }

  /** 监听蓝牙断开 */
  function onDisconnect() {
    disconnectListener.current = bleModule.manager.onDeviceDisconnected(
      bleModule.peripheralId,
      (error, device) => {
        if (error) {
          // 蓝牙遇到错误自动断开
          console.log("device disconnect", error);
          initData();
        } else {
          disconnectListener.current?.remove();
          console.log("device disconnect", device!.id, device!.name);
        }
      }
    );
  }

  /** 断开蓝牙连接 */
  function disconnect() {
    bleModule.disconnect();
    initData();
  }

  function initData() {
    // 断开连接后清空UUID
    bleModule.initUUID();
    // 断开后显示上次的扫描结果
    setData([...deviceMap.current.values()]);
    setIsConnected(false);
    setWriteData("");
    setReadData("");
    setReceiveData("");
    setInputText("");
  }

  function renderItem(item: ListRenderItemInfo<Device>) {
    const data = item.item;
    const disabled = !!connectingId && connectingId !== data.id;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled || isConnected}
        onPress={() => {
          connect(data);
        }}
        style={[
          styles.item,
          {
            opacity: disabled ? 0.5 : 1,
            backgroundColor: "rgb(230,230,230)",
            marginHorizontal: 10,
            marginVertical: 5,
            borderRadius: 5,
          },
        ]}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 14, color: "red" }}>
            {data.localName ? data.localName : data.name ? data.name : ""}
          </Text>

          <Text style={{ marginLeft: 50, color: "red" }}>
            {connectingId === data.id ? "连接中..." : ""}
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: "black" }}>{data.id}</Text>
        <Text style={{ color: data.isConnectable ? "black" : "red" }}>
          {`${data.isConnectable ? "可连接" : "不可连接"} `}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderFooter() {
    if (!isConnected) {
      return;
    }
    return (
      <ScrollView
        style={{
          marginTop: 10,
          borderColor: "#eee",
          borderStyle: "solid",
          borderTopWidth: StyleSheet.hairlineWidth * 2,
        }}
      >
        <Characteristic
          label="写数据（write）："
          action="发送"
          content={writeData}
          characteristics={bleModule.writeWithResponseCharacteristicUUID}
          onPress={write("write")}
          input={{ inputText, setInputText }}
        />

        <Characteristic
          label="写数据（writeWithoutResponse）："
          action="发送"
          content={writeData}
          characteristics={bleModule.writeWithoutResponseCharacteristicUUID}
          onPress={write("writeWithoutResponse")}
          input={{ inputText, setInputText }}
        />

        <Characteristic
          label="读取的数据："
          action="读取"
          content={readData}
          characteristics={bleModule.readCharacteristicUUID}
          onPress={read}
        />

        <Characteristic
          label={`通知监听接收的数据（${
            isMonitoring ? "监听已开启" : "监听未开启"
          }）：`}
          action="开启监听"
          content={receiveData}
          characteristics={bleModule.nofityCharacteristicUUID}
          onPress={monitor}
        />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "BLE Connect",
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
      <BackgroundView
        style={styles.container}
        x={"0%"}
        y={"100%"}
        rx={"50%"}
        ry={"50%"}
      >
        <Header
          isConnected={isConnected}
          scaning={scaning}
          disabled={scaning || !!connectingId}
          onPress={isConnected ? disconnect : scan}
        />
        <FlatList
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          data={data}
          extraData={connectingId}
        />
        {renderFooter()}
      </BackgroundView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: "column",
    borderColor: "rgb(235,235,235)",
    borderStyle: "solid",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 10,
    paddingVertical: 8,
  },
});
