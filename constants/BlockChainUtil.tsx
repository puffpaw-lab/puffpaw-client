import {
  getUserEmbeddedWallet,
  isConnected,
  useEmbeddedWallet,
  usePrivy,
} from "@privy-io/expo";
import { Contract, ethers, parseUnits } from "ethers";
import {
  DeviceAbi,
  DeviceAddress,
  MallAbi,
  MallAddress,
  PuffAbi,
  PuffAddress,
  TreasuryAbi,
  TreasuryAddress,
} from "./BlockChainUtilConfig";
import { CLOG } from "./LogUtils";

/**
 * 合约对应封装函数
 * subgraph对应封装函数
 */
function useCommonUtils() {
  const { user, isReady } = usePrivy();
  const wallet = useEmbeddedWallet();
  const account = getUserEmbeddedWallet(user);

  /**获取合约操作对象 */
  const getContractInfo = async function () {
    if (!isReady) {
      return Promise.reject("privy loading");
    }
    if (!account) {
      return Promise.reject("no wallet address");
    }
    if (!isConnected(wallet)) {
      return Promise.reject("Wallet not connected");
    }
    if (
      (global as any).ContractObejct &&
      (global as any).ContractObejct.account === account.address
    ) {
      return (global as any).ContractObejct as {
        account: string;
        ethersProvider: ethers.BrowserProvider;
        ethersSigner: ethers.JsonRpcSigner;
        ContractMall: Contract;
        ContractPuff: Contract;
        ContractDevice: Contract;
        ContractTreasury: Contract;
      };
    }
    const ethersProvider = new ethers.BrowserProvider(wallet.provider);
    const ethersSigner = await ethersProvider.getSigner();
    const ContractMall = new Contract(MallAddress, MallAbi, ethersSigner);
    const ContractPuff = new Contract(PuffAddress, PuffAbi, ethersSigner);
    const ContractDevice = new Contract(DeviceAddress, DeviceAbi, ethersSigner);
    const ContractTreasury = new Contract(
      TreasuryAddress,
      TreasuryAbi,
      ethersSigner
    );
    const contractObejct = {
      account: account.address,
      ethersProvider,
      ethersSigner,
      ContractMall,
      ContractPuff,
      ContractDevice,
      ContractTreasury,
    };
    (global as any).ContractObejct = contractObejct;
    return contractObejct;
  };

  return { getContractInfo };
}

/**购买商品 */
export function usePayHooks() {
  const { getContractInfo } = useCommonUtils();

  /**验证账户是否有足够的puff币
   * 验证通过返回 true
   * 验证不通过抛出 Promimse.reject
   */
  const checkPuffEnough = async function (value: number): Promise<boolean> {
    if (!value) {
      return Promise.reject("Missing orderSn or value");
    }
    const { ethersProvider, ContractPuff, account } = await getContractInfo();

    const balance = await ethersProvider.getBalance(account);
    const amount = await ContractPuff.balanceOf(account);
    CLOG.info("母币:", balance.toString());
    CLOG.info("代币:", String(amount));
    if (!Number(balance) || !Number(amount)) {
      return Promise.reject("No gas or puffpaw");
    }
    if (Number(amount) < Number(parseUnits(value.toString(), "ether"))) {
      return Promise.reject("Insufficient puffpaw balance");
    }
    return true;
  };

  /**
   * 发起购买
   * @param orderSn 订单号
   * @param value 需要支付的puffpaw币数量
   * @returns hash 交易hash 可以在区块浏览器上查询
   */
  const pay = async function (orderSn: string, value: number): Promise<string> {
    if (!orderSn || !value) {
      return Promise.reject("Missing orderSn or value");
    }
    const {
      ethersProvider,
      ethersSigner,
      ContractMall,
      ContractPuff,
      account,
    } = await getContractInfo();
    CLOG.info("钱包地址", account);
    CLOG.info("发起购买", "订单号：", orderSn, "  puffpaw价格：", value);
    //查询订单号是否已被使用
    const orderSnExist = await ContractMall.orderSns(orderSn);
    CLOG.info("订单号：", orderSn, orderSnExist ? "已使用" : "未使用");
    if (orderSnExist) {
      return Promise.reject("The current order has been paid");
    }
    //查询我的余额
    const balance = await ethersProvider.getBalance(account);
    const amount = await ContractPuff.balanceOf(account);
    CLOG.info("母币:", balance.toString());
    CLOG.info("代币:", String(amount));
    if (!Number(balance) || !Number(amount)) {
      return Promise.reject("No gas or puffpaw");
    }
    //签名
    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };
    const contractName = await ContractPuff.name();
    CLOG.info("ContractPuff-name：", contractName);
    //查询当前链id
    const chainId = (await ethersProvider.getNetwork()).chainId;
    CLOG.info("chainId", chainId);
    const domain = {
      name: contractName as unknown as string,
      version: "1",
      chainId: chainId,
      verifyingContract: PuffAddress,
    };
    CLOG.info("domain", domain);
    const deadline = await ethersProvider
      .getBlock("latest")
      .then((latestblock) => {
        if (latestblock) {
          return latestblock.timestamp + 300;
        }
        CLOG.info("查询最后一个区块失败");
        return 0;
      });
    CLOG.info("deadline", deadline);
    const nonces = await ContractPuff.nonces(account);
    CLOG.info("nonces：", String(nonces));
    const txData = {
      owner: account,
      spender: MallAddress,
      value: parseUnits(value.toString(), "ether"),
      nonce: Number(await ContractPuff.nonces(account)),
      deadline: deadline,
    };
    CLOG.info("txData", txData);
    const sign = await ethersSigner.signTypedData(domain, types, txData);
    CLOG.info("sign", sign);
    const r = sign.substring(0, 66);
    const s = "0x" + sign.substring(66, 130);
    const v = Number("0x" + sign.substring(130, 132));
    CLOG.info("rsv", r, s, v);
    CLOG.info("确认交易参数", orderSn, txData.value, deadline, v, r, s);
    //预估gaslimit 链上预估gas*1.125，尽量避免交易失败
    const gas = await ContractMall.pay.estimateGas(
      orderSn,
      txData.value,
      deadline,
      v,
      r,
      s
    );
    const moreGas = gas + (gas >> 2n);
    CLOG.info("gas", gas, moreGas);
    CLOG.info("需要支付的gas:", moreGas.toString());
    //判断余额
    if (balance < moreGas) {
      return Promise.reject("Insufficient gas fee");
    }
    if (Number(amount) < Number(txData.value)) {
      return Promise.reject("Insufficient puffpaw balance");
    }
    //执行合约函数
    const result = await ContractMall.pay(
      orderSn,
      txData.value,
      deadline,
      v,
      r,
      s,
      {
        gasLimit: moreGas,
      }
    );
    //等待交易完成
    await result.wait();
    return result.hash;
  };

  return { checkPuffEnough, pay };
}

/**重铸 */
export function useStakeHooks() {
  const { getContractInfo } = useCommonUtils();

  /**读取当前用户持有的nft信息
   * @returns NftInfo 包含以下属性
   *   - nftID nftID
   *   - tier 稀有度
   *   - model 加成烟弹 1=A 2=B ... 6=F
   *   - vertion 版本 代数: 第一代NFT,第二代NFT
   */
  const getNFTInfo = async function (): Promise<{
    nftID: number;
    tier: number;
    model: number;
    vertion: number;
  }> {
    const { ContractPuff, account } = await getContractInfo();
    const nftID = await ContractPuff.ownerToTokenID(account);
    const nftInfo = await ContractPuff.infos(nftID);
    return {
      nftID: nftID,
      tier: nftInfo.tier,
      model: nftInfo.model,
      vertion: nftInfo.vertion,
    };
  };
  /**查询NFT质押状态
   * @param tokenId nftID
   * @return isStake true-质押 false-赎回
   */
  const getIsStake = async function (nftID: number): Promise<Boolean> {
    const { ContractPuff } = await getContractInfo();
    const isStake = await ContractPuff.staking(nftID);
    return isStake;
  };
  /**质押与取消质押
   * @param nftID nftID
   * @param status true-质押 false-赎回
   */
  const stake = async function (nftID: number, status: boolean): Promise<void> {
    const { ContractPuff } = await getContractInfo();
    const result = await ContractPuff.stake(nftID, status);
    await result.wait();
  };
  /**获取当前是否是第一次重铸
   * @param nftID nftID
   * @returns true-是第一次 false-不是第一次
   */
  const isFirstRecast = async function (nftID: number): Promise<Boolean> {
    const { ContractPuff } = await getContractInfo();
    const recasts = await ContractPuff.recasts(nftID);
    return !Number(recasts.tier);
  };
  /**重铸nft
   * @param nftID nftID
   * @returns result
   */
  const recast = async function (nftID: number) {
    const { ContractPuff } = await getContractInfo();
    const result = await ContractPuff.recasting(nftID);
  };
  /**同意重铸 */
  const acceptRecast = async function () {
    const {} = await getContractInfo();
  };

  return { getNFTInfo, getIsStake, stake, isFirstRecast, recast, acceptRecast };
}

/**领取收益 */
export function useEarnHooks() {
  const { getContractInfo } = useCommonUtils();
  /**已领取收益 */
  const getTotalEarned = async function () {
    const {} = await getContractInfo();
  };
  /**未领取收益 */
  const getTotalUnclaimed = async function () {
    const {} = await getContractInfo();
  };
  /**领取收益 */
  const earn = async function () {
    const {} = await getContractInfo();
  };
  return { getTotalEarned, getTotalUnclaimed, earn };
}
