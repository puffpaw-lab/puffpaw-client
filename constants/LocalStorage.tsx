import { MMKV } from "react-native-mmkv";

// 本地用户信息
export type LocalUserInfo = {
  createdAt?: string | null;
  email?: string | null;
  farcaster: string | null;
  google: string | null;
  telegram: string | null;
  headPic: string | null;
  id: number | null;
  lastIp: string | null;
  lastLoginPlatForm: string | null;
  lastLoginTime: number | null;
  name: string | null;
  phone: string | null;
  privId: string | null;
  sms: string | null;
  status: number | null;
  token: string | null;
  twitter: string | null;
  updatedAt: string | null;
};

// 购物车信息
export type LocalCartInfo = {
  goodsId: number;
  goodsNumber: number;
};

// export const storage = new MMKV();

// 抽烟状态
export type VapeSmokingState =
  | "Inactive" // 未初始化
  | "NoneCompliance" // 不够数
  | "Compliance" // 正合适
  | "OverPuffed"; // 超过了

// 抽烟信息
export type LocalSmokeInfo = {
  state: VapeSmokingState;
  remainingTime?: number | null;
  currentCapacity?: number | null;
  // total?: number | null;
  current?: number | null;
};

// 连接视图状态
export type ConnectVapeViewState = "idle" | "pairing" | "paired";

// 连接视图状态
export type ConnectViewState = "idle" | "pairing" | "paired";

// 本地NFT数据
export type LocalNFTInfo = {
  id: string | null;
  tier: string | null;
  // totalReturn: string | null;
  computingPower: string | null;
  currentCartridge: string | null;
};

// 本地NFT 重铸数据
export type LocalRecastInfo = {
  newTier: string | null;
  price: string | null;
  rareRate: string | null; // 稀有度
  rareRatePff: string | null; // 稀有度对应的pff
  hashPower: string | null;
  plusModel: string | null;
  icon: any | null; // 图标
  congratulations: string | null; // 恭喜
};

// 本地 My Vape 数据
export type LocalMyVapeInfo = {
  vapeId: string | null;
  leastCode: string | null;
  sharingRate: string | null; //
  lesseeStatus: boolean; // 出租状态,是否已经出租
  lessee: string | null; // 出租人
};

// 本地 My Vape Current Node 数据
export type LocalMyVapeNodeInfo = {
  tokenId: string | null;
  rareRate: string | null;
  rareRatePff: string | null; //
  pairedPods: string | null;
  plusModel: string | null;
  icon: any | null; // 图标

  ownedBy?: string | null; // 拥有者
  stakingStatus?: boolean | null; // 质押状态
};

// 本地配对蓝牙设备信息
export type LocalBLEPairedDeviceInfo = {
  deviceId: string | null; // 设备名称
  deviceType: string | null; // 设备类型
  latestConnectTime: string | null; // 最后更新时间
  bindWalletAddress: string | null; // 绑定的钱包地址
  hashPower: string | null; // 当前算力
  currendPod: string | null; // 当前烟弹
  // currendPodStatus: string | null; // 烟弹加成
  leaseCode: string | null; // 出租码
};

export class ConstantStorage {
  static isLogin = "isLogin"; // 是否登录
  static localUser = "userInfo"; // 用户信息
  static cartInfo = "cartInfo02"; // 购物车信息

  static tempLogin = "tempLogin"; // 临时登录信息
  static tempVape = "tempVape"; // 临时登录信息
  static localBLEPairedDeviceInfo = "pairedVapeInfo"; //本地已经蓝牙配对vape设备信息
}
