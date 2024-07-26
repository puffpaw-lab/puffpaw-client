import axios from "axios";
import { useRef } from "react";
import { ethers } from "ethers";
import { CLOG } from "./LogUtils";
import { graphUrl, NftABI, RPC } from "./BlockChainUtil";

/**
 * nft信息
 * @param id nft列表唯一标识
 * @param contractAddress nft的合约地址
 * @param tokenId nft的tokenid，展示在图片左上角
 * @param value 用户持有的当前nft的数量 ERC721合约默认为1
 * @param imageUrl 图片访问地址
 */
export type Nft = {
  /**nft列表唯一标识 */
  id: string;
  /**nft的合约地址 */
  contractAddress: string;
  /**合约类型 */
  contractType: "ERC721" | "ERC1155";
  /**nft的tokenid，展示在图片左上角 */
  tokenId: string;
  /**用户持有的当前nft的数量 ERC721合约默认为1 */
  value: number;
  /**图片访问地址 */
  imageUrl: string;
};
/**查询出来的subgraph样式结构 */
type SubgraphResult = {
  data: {
    holder: {
      nfts: {
        value: string;
        nft: {
          contractAddress: string;
          contractType: "ERC721" | "ERC1155";
          tokenId: string;
        };
      }[];
    };
  };
};

// 获取nft列表
export function useNFTList() {
  const provider = useRef(new ethers.JsonRpcProvider(RPC));

  async function getNFTImage(item: Nft): Promise<Nft> {
    CLOG.info("查询图片", item);
    const contract = new ethers.Contract(
      item.contractAddress,
      NftABI,
      provider.current
    );
    let uri = "";
    if (item.contractType === "ERC721") {
      uri = await contract.tokenURI(item.tokenId);
    } else if (item.contractType === "ERC1155") {
      uri = await contract.uri(item.tokenId);
    }
    const response = await axios(uri);
    if (response?.data?.image) {
      item.imageUrl = response.data.image;
    }
    return item;
  }

  /**
   * 查询nft 列表
   * @param address 钱包地址
   * @param pageIndex 页码 默认1
   * @param PageSize 分页大小 默认10
   * @returns nft列表
   */
  async function getNFTList(
    address: string,
    pageIndex: number = 1,
    PageSize: number = 10
  ): Promise<Nft[]> {
    CLOG.info("查询nft");
    //查询subgraph
    const result = await axios.post(graphUrl, {
      extensions: { headers: null },
      operationName: "MyQuery",
      query: `query MyQuery {
  holder(id: "${address.toLocaleLowerCase()}") {
    nfts(first: ${PageSize}, skip: ${(pageIndex - 1) * PageSize}) {
      value
      nft {
        contractAddress
        contractType
        tokenId
      }
    }
  }
}`,
      variables: null,
    });
    if (result.status !== 200) {
      CLOG.info(result);
      return [];
    }
    const data: Nft[] = (result.data as SubgraphResult).data.holder.nfts.map(
      (item) => {
        return {
          id: item.nft.contractAddress + "-" + item.nft.tokenId,
          contractAddress: item.nft.contractAddress,
          contractType: item.nft.contractType,
          tokenId: item.nft.tokenId,
          value: +item.value,
          imageUrl: "",
        };
      }
    );

    //通过subgraph结果查询获取图片地址
    const list = await Promise.all(
      data.map(async (item) => {
        return await getNFTImage(item).catch((error) => {
          CLOG.info(error);
          return item;
        });
      })
    );
    CLOG.info("list", JSON.stringify(list));

    return list;
  }

  return { getNFTList };
}
