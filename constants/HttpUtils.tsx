import axios from "axios";
import { Platform } from "react-native";
import FormData from "form-data";
import { CreateOrderItemType } from "./ViewProps";

const PageSize = 4;
const ApiUrl = "http://api.puffpaw.xyz";
const ImageServerUrl = "http://image.puffpaw.xyz";

// 状态异常
const AuthFailedStatus = 10024; // token失效

// 用户登录
const LoginUrl = "/api/v1/depinUsers/LoginByDevPriv"; // 登录
const LogoutUrl = "/api/v1/depinUsers/LogoutDepinUser"; // 退出
const UserIconUrl = "/api/v1/depinUsers/UpdateUserHeadPic"; // 用户头像

// 商品信息
const GoodsListUrl = "/api/v1/depinGoods/GetDepinGoodsList"; // 商品列表
const GoodsInfoUrl = "/api/v1/depinGoods/GetDepinGoodsInfo"; // 商品详情

// 地址信息
const AddressListUrl = "/api/v1/userAddress/GetUserAddressList"; // 地址信息
const AddressDetailUrl = "/api/v1/userAddress/GetUserAddressInfo"; // 地址详细信息
const AddAddressUrl = "/api/v1/userAddress/AddUserAddress"; // 添加地址
const UpdateAddressUrl = "/api/v1/userAddress/UpdateUserAddressInfo"; // 更新地址

// 订单信息
const OrderListUrl = "/api/v1/depinOrders/GetDepinOrderList"; // 订单列表
const CreateOrderUrl = "/api/v1/depinOrders/CreateDepinOrder"; // 创建订单
const OrderDetailUrl = "/api/v1/depinOrders/GetDepinOrderInfo"; // 订单详情

const InterfaceAppId = "x7rod3yx96iki0o5";
const InterfaceAppKey = "5cf4fde32a81c5bdb9f35f27c1894394"; //"wdvjjun4ircc9irl";

// 登录参数
export type LoginMethod = "sms" | "twitter" | "google" | "farcaster";

export type LoginParams = {
  privId: string;
  address: string;
  otherAddress?: string[];
  // sms?: string;
  phone?: string;
  twitter?: string | null;
  google?: string;
  farcaster?: string;
};

const requestInstance = axios.create({
  baseURL: ApiUrl,
  timeout: 50000,
  headers: {
    "content-type": "application/json",
    appId: InterfaceAppId,
    "app-sign": "app-sign",
    "app-id": InterfaceAppId,
  },
  responseType: "json",
  responseEncoding: "utf8",
});

// Add a request interceptor
requestInstance.interceptors.request.use(
  function (config) {
    console.log(`\n`);
    console.log(`---------------开始请求---------------`);
    console.log(`请求地址: ${config.method} ${config.baseURL}${config.url}`);
    console.log(`请求参数: ${JSON.stringify(config.headers)}`);
    console.log(`请求data: ${JSON.stringify(config.data)}`);

    // Do something before request is sent
    return config;
  },
  function (error) {
    console.error(`error: ${error}`);

    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
requestInstance.interceptors.response.use(
  function (response) {
    console.log(`响应数据: ${JSON.stringify(response.data)}`);

    const { code, message } = response.data;
    if (code == AuthFailedStatus) {
      console.error(`token无效: code=${code} message=${message}`);
      updateUserHeader(null);
    }

    console.log(`---------------结束请求---------------`);

    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    console.error(`接口错误:${error}`);
    console.log(`---------------结束请求---------------`);

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

// 手机号登录
const loginWithSms = async ({ privId, address, phone }: LoginParams) => {
  try {
    updateHeaderType("json");

    const params = {
      privId: privId,
      platForm: Platform.OS,
      address: address,
      phone: phone,
    };

    const response = await requestInstance.post(LoginUrl, params);
    // console.log(response);
    return response;
  } catch (error) {
    // console.error(error);
  }
  return null;
};

// google登录
const loginWithGoogle = async ({ privId, address, google }: LoginParams) => {
  updateHeaderType("json");

  const params = {
    privId: privId,
    platForm: Platform.OS,
    address: address,
    google: google,
  };

  try {
    const response = await requestInstance.post(LoginUrl, params);
    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};

// 推特登录
const loginWithTwitter = async ({ privId, address, twitter }: LoginParams) => {
  updateHeaderType("json");

  const params = {
    privId: privId,
    platForm: Platform.OS,
    address: address,
    twitter: twitter,
  };

  try {
    const response = await requestInstance.post(LoginUrl, params);
    return response;
  } catch (error) {
    // console.error(error);
  }
  return null;
};

// 退出登录
const userLogout = async () => {
  updateHeaderType("json");

  try {
    const response = await requestInstance.post(LogoutUrl);

    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};

// 头像上传
const uploadUserIcon = async (uri: any) => {
  updateHeaderType("form-data");

  const formData = new FormData();
  const cleanURL = uri.replace("file://", "");

  formData.append("file", {
    uri: Platform.OS == "ios" ? cleanURL : uri,
    name: `photo.png`,
    type: `image/png`,
  });

  console.log(formData);
  try {
    const response = await requestInstance.postForm(UserIconUrl, formData);
    return response;
  } catch (error) {
    // console.error(error);
  }
  return null;
};

// -------商品信息------
// 商品列表
const goodsListInterface = async (pageIndex: number, pageSize: number) => {
  updateHeaderType("json");

  const params = {
    page: pageIndex,
    platForm: Platform.OS,
    pageSize: pageSize,
  };

  try {
    const response = await requestInstance.post(GoodsListUrl, params);
    return response;
  } catch (error) {
    // console.error(error);
  }
  return null;
};

// 商品列表
const goodsInfoInterface = async (goodsId: number) => {
  updateHeaderType("json");

  const params = {
    id: goodsId,
    platForm: Platform.OS,
  };

  // console.log(params);
  try {
    const response = await requestInstance.get(GoodsInfoUrl, {
      params: params,
    });

    return response;
  } catch (error) {
    // console.error(error);
  }
  return null;
};

// 购物车列表
const cardGoodsListInterface = async (goodsIds: number[] | null) => {
  updateHeaderType("json");

  const params = {
    goodsIds: goodsIds,
    platForm: Platform.OS,
  };

  // console.log(params);
  try {
    const response = await requestInstance.post(GoodsListUrl, params);

    return response;
  } catch (error) {
    // console.error(error);
  }
  return null;
};

// 地址信息
const addressListInterface = async () => {
  updateHeaderType("json");

  const params = {
    platForm: Platform.OS,
  };

  // console.log(params);
  try {
    const response = await requestInstance.get(AddressListUrl, {
      params: params,
    });

    return response;
  } catch (error) {
    // console.error(error);
  }
  return null;
};

// 地址信息详情
const addressDetailInterface = async (id: string | null) => {
  updateHeaderType("json");

  const params = {
    platForm: Platform.OS,
    id: id,
  };

  try {
    const response = await requestInstance.get(AddressDetailUrl, {
      params: params,
    });

    return response;
  } catch (error) {}
  return null;
};

// 添加地址
const addAddressInterface = async (
  billingAddress: string | null,
  shippingAddress: string | null
) => {
  updateHeaderType("json");

  let params = {};
  if (billingAddress !== null) {
    params = {
      billingAddress: billingAddress,
      platForm: Platform.OS,
    };
  } else if (shippingAddress !== null) {
    params = {
      shippingAddress: shippingAddress,
      platForm: Platform.OS,
    };
  }

  // console.log(params);
  try {
    const response = await requestInstance.post(AddAddressUrl, params);

    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};

// 更新地址
const updateAddressInterface = async (
  id: number,
  shippingAddress: string | null,
  billingAddress: string | null
) => {
  updateHeaderType("json");

  let params = {};
  if (billingAddress !== null) {
    params = {
      id: id,
      billingAddress: billingAddress,
      platForm: Platform.OS,
    };
  } else if (shippingAddress !== null) {
    params = {
      id: id,
      shippingAddress: shippingAddress,
      platForm: Platform.OS,
    };
  }

  // console.log(params);
  try {
    const response = await requestInstance.post(UpdateAddressUrl, params);
    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};

// 订单列表
const orderListInterface = async (
  pageIndex: number,
  pageSize: number,
  status?: number | null | undefined
) => {
  updateHeaderType("json");

  let params = {};
  if (status) {
    params = {
      page: pageIndex,
      platForm: Platform.OS,
      pageSize: pageSize,
      status: status,
    };
  } else {
    params = {
      page: pageIndex,
      platForm: Platform.OS,
      pageSize: pageSize,
    };
  }
  try {
    const response = await requestInstance.get(OrderListUrl, {
      params: params,
    });

    // console.log("response " + JSON.stringify(response));
    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};

// 创建订单
const createOrderInterface = async (
  userAddressId: number,
  data: CreateOrderItemType[]
) => {
  updateHeaderType("json");

  const params = {
    userAddressId: userAddressId,
    data: data,
    platForm: Platform.OS,
  };

  // console.log(params);
  try {
    const response = await requestInstance.post(CreateOrderUrl, params);

    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};

// 订单详情
const orderDetailInterface = async (id: number) => {
  updateHeaderType("json");

  const params = {
    id: id,
    platForm: Platform.OS,
  };

  // console.log(params);
  try {
    const response = await requestInstance.get(OrderDetailUrl, { params });

    return response;
  } catch (error) {
    console.error(error);
  }
  return null;
};

// 更新接口header
const updateUserHeader = (token: string | null | undefined) => {
  // 修改header
  // console.log("token " + token);
  requestInstance.defaults.headers["app-token"] = token ?? "";
};

// 更新接口header content
const updateHeaderType = (type: "json" | "form-data") => {
  // 修改header
  requestInstance.defaults.headers["content-type"] =
    type == "json" ? "application/json" : "multipart/form-data";
  requestInstance.defaults.headers.common["content-type"] =
    type == "json" ? "application/json" : "multipart/form-data";
};

export {
  updateUserHeader,
  updateHeaderType,

  // 登录信息
  loginWithSms,
  loginWithGoogle,
  loginWithTwitter,
  userLogout,
  uploadUserIcon,

  // 商品信息
  goodsListInterface,
  goodsInfoInterface,
  cardGoodsListInterface,

  // 地址信息
  addAddressInterface,
  addressDetailInterface,
  updateAddressInterface,
  addressListInterface,

  // 订单信息
  orderListInterface,
  createOrderInterface,
  orderDetailInterface,

  // 其他
  requestInstance,
  ImageServerUrl,
  PageSize,
};
