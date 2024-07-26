import { PropsWithChildren } from "react";
import { ViewProps } from "react-native";

export type LoginFunction = () => void;
export type FunctionWithNumber = (index: number) => void;

export type PrivyLoginProps = ViewProps &
  PropsWithChildren<{
    callbackEvent?: LoginFunction;
    closeEvent?: LoginFunction;
  }>;

export type LoginItemType = "none" | "email" | "sms" | "social" | "other";

// 比例选择
export type RatioPickerViewProps = ViewProps & {
  ratioText: string | null;
  callback: (text: string) => void;
};

// 商品信息
export type GoodsItemType = {
  id: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  name: string | null;
  goodsCateId: number | null;
  price: string | null;
  pic: string | null;
  feature: string | null;
  brief: string | null;
  status: number | null;
  content: string | null;
  payNumber: number | null;
};

// 商品照片信息
export type GoodsItemPicType = {
  id: string | null;

  goodsId: string | null;
  type: string | null;
  name: string | null;
  url: string | null;
  content: string | null;
};

// 地址信息
export type AddressItemType = {
  id: string | null;
  address: string | null;
  createdAt: string | null;
  md5Address: string | null;
  userId: string | null;
  billingAddress: string | null;
  shippingAddress: string | null;
  md5BillingAddress: string | null;
  md5ShippingAddress: string | null;
};

// 地址详细信息
export type AddressDetailType = {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  phone: string | null | undefined;
  phoneCallCode: string | null | undefined;
  country: string | null | undefined;
  address: string | null | undefined;
  city: string | null | undefined;
  stateOrProvince: string | null | undefined;
  postCode: string | null | undefined;
};

// 创建订单信息
export type CreateOrderItemType = {
  goodsId: number;
  payNumber: number;
};

// 订单信息
export type OrderItemType = {
  id: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  orderNum: string | null;
  userId: number | null;
  userAddressId: number | null;
  payMoney: string | null;
  status: number | null;
  hash: string | null;
  from: string | null;
  to: string | null;
  deliveryNo: string | null;
  deliveryCompany: string | null;
  remark: string | null;
  payTime: number | null;
  finishTime: number | null;
  billingAddress: string | null;
  shippingAddress: string | null;
  orderMoney: string | null;
  createTime: number | null;
  goods: GoodsItemType[] | undefined | null;
};

// 订单详情信息
export type OrderDetailItemType = {
  orderId: number | null;
  userId: number | null;
  goodsId: number | null;
  goodsSpecId: number | null;
  price: string | null;
  payNumber: number | null;
  payMoney: string | null;
  status: number | null;
  payTime: number | null;
  finishTime: number | null;
  billingAddress: number | null;
  shippingAddress: number | null;
};

// 订单追踪详情信息
export type OrderTrackingItemType = {
  createdAt: string | null;
  status: number | null;
  orderId: string | null;
  detail: string | null;
  createTime: number | null;
};
