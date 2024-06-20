import {
  getUserEmbeddedWallet,
  isConnected,
  isConnecting,
  useEmbeddedWallet,
  usePrivy,
} from "@privy-io/expo";
import web3 from "web3";
import { useEffect, useState } from "react";

//合约地址
const PuffAddress = "0x6e9AD82bC226eF8D0672944cddccaDDb69536b1e";
const MallAddress = "0x6a3cB80b5158A7e418FA9688a872781B7d095bb8";
//指定合约内容
const PuffAbi = [
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const MallAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "orderSn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "pay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// 区块链函数调用
export default function usePayHooks() {
  const { user, isReady } = usePrivy();
  const wallet = useEmbeddedWallet();
  const account = getUserEmbeddedWallet(user);

  // web3对象注册
  const [web3Object, setWeb3Object] = useState<web3 | null>(null);
  useEffect(() => {
    if (!account) {
      setWeb3Object(null);
      return console.log("没有钱包账号");
    }
    if (isConnected(wallet)) {
      console.log("更新web3对象", account.address);
      setWeb3Object(new web3(wallet.provider));
    } else {
      if (isConnecting(wallet)) {
        console.log("钱包连接中");
      } else {
        console.log("钱包未连接");
      }
      setWeb3Object(null);
    }
  }, [wallet]);

  /**
   * 字符串签名
   * @param str 待签名字符串
   * @returns
   */
  const signMessage = async function (str?: string) {
    if (!str) {
      return console.log("没有可签名信息");
    }
    if (!isReady) {
      return console.log("请等待钱包加载完成");
    }
    if (!account) {
      return console.log("没有钱包");
    }
    if (!web3Object) {
      return console.log("web3对象未初始化");
    }
    console.log("签名前：", str);
    //查询当前链id
    const chainId = await web3Object.eth.getChainId();
    console.log("chainId", chainId);
    //签名
    const signMessage = await web3Object.eth.sign(
      web3.utils.toHex(str),
      account.address
    );
    console.log("签名后：", signMessage);
    // return data;
  };

  /**
   * 发起购买
   * @param orderSn 订单号
   * @param value 购买数量
   */
  const pay = async function (orderSn: number, value: number) {
    if (!isReady) {
      return console.log("请等待钱包加载完成");
    }
    if (!account) {
      return console.log("没有钱包");
    }
    if (!web3Object) {
      return console.log("web3对象未初始化");
    }
    console.log("发起购买", "订单号：", orderSn, "  数量：", value);
    //构造合约对象
    const ContractPuff = new web3Object.eth.Contract(PuffAbi, PuffAddress);
    const ContractMall = new web3Object.eth.Contract(MallAbi, MallAddress);
    //签名
    const types = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };
    const contractName = await ContractPuff.methods.name().call();
    console.log("ContractPuff-name：", contractName);
    const domain = {
      name: contractName as unknown as string,
      version: "1",
      chainId: 80002,
      verifyingContract: PuffAddress,
    };
    console.log("domain", domain);
    const lastBlock = await web3Object.eth.getBlock();
    console.log("lastBlock：", lastBlock);
    const deadline = Number(lastBlock.timestamp) + 300;
    console.log("deadline", deadline);
    const nonces = await ContractPuff.methods.nonces(account.address).call();
    console.log("nonces：", nonces);
    const txData = {
      owner: account.address,
      spender: MallAddress,
      value: web3Object.utils.toWei(value, "ether"),
      nonce: Number(nonces),
      deadline: deadline,
    };
    console.log("txData", txData);
    const sign = await web3Object.eth.signTypedData(
      account.address,
      {
        types: types,
        primaryType: "Permit",
        domain: domain,
        message: txData,
      },
      false
    );
    console.log("sign", sign);
    const r = sign.substring(0, 66);
    const s = "0x" + sign.substring(66, 130);
    const v = Number("0x" + sign.substring(130, 132));
    console.log("rsv", r, s, v);
    //执行合约函数
    console.log(orderSn, txData.value, deadline, v, r, s);
    await ContractMall.methods
      .pay(orderSn, txData.value, deadline, v, r, s)
      .send({
        from: account.address,
      })
      .on("transactionHash", function (hash: string) {
        console.log("交易hash：", hash);
      })
      .on("receipt", function (receipt: unknown) {
        console.log(receipt);
      })
      .on("error", function (error) {
        console.error(error);
      });
  };

  return { signMessage, pay };
}
