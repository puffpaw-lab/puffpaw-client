import BleModule from "./BleModule";

export class BleManagerUtils {
  // 注意: 需要确保全局只有一个BleManager实例，因为BleModule类保存着蓝牙的连接信息
  static bleModule = new BleModule();
}
