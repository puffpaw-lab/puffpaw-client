import { MMKV } from "react-native-mmkv";

// 本地用户信息
export type LocalUserInfo = {
  createdAt?: string | null;
  email?: string | null;
  farcaster: string | null;
  google: string | null;
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

export class ConstantStorage {
  static isLogin = "isLogin"; // 是否登录
  static localUser = "userInfo"; // 用户信息
  static cartInfo = "cartInfo02"; // 购物车信息
}
