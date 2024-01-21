import {
  Algodv2,
  makePaymentTxnWithSuggestedParamsFromObject,
  Transaction,
  decodeAddress,
} from "algosdk";
import cid from "cids";
import multihash from "multihashes";
import axios from "axios";
import { ALGONODE_MAINNET_NODE, IPFS_PREFIX } from "./constants";

export const shortenWallet = (wallet: string) => {
  return wallet.substring(0, 5) + "..." + wallet.substring(wallet.length - 5);
};

export async function verifyTxCreate(
  wallet: string,
  token: string
): Promise<Transaction> {
  const algodClient = new Algodv2("", ALGONODE_MAINNET_NODE, "");
  const params = await algodClient.getTransactionParams().do();
  const enc = new TextEncoder();
  const tx = makePaymentTxnWithSuggestedParamsFromObject({
    from: wallet,
    to: wallet,
    amount: 0,
    suggestedParams: params,
    note: enc.encode(token),
  });
  return tx;
}

export async function verfiyWithUuidTxCreate(
  wallet: string
): Promise<Transaction> {
  const algodClient = new Algodv2("", ALGONODE_MAINNET_NODE, "");
  const params = await algodClient.getTransactionParams().do();
  const tx = makePaymentTxnWithSuggestedParamsFromObject({
    from: wallet,
    to: wallet,
    amount: 0,
    suggestedParams: params,
  });
  return tx;
}

export const ipfsToUrl = async (
  asset_url: string,
  asset_reserve: string
): Promise<string> => {
  if (!asset_url) return "";
  if (asset_url.startsWith("template")) {
    const codec = asset_url.split(":")[3];
    const url = await getMetadataFromReserveAddress(asset_reserve, codec);
    if (url.startsWith("ipfs://")) return `${IPFS_PREFIX}/${url.slice(7)}`;
    if (url !== "") return url;
    return "./images/loading.gif";
  }
  if (asset_url.endsWith("#arc3")) {
    const url = asset_url.slice(0, -5);
    if (url.startsWith("ipfs://")) {
      const response = await axios.get(`${IPFS_PREFIX}/${url.slice(7)}`);
      if (response.data.image.startsWith("ipfs://"))
        return `${IPFS_PREFIX}/${response.data.image.slice(7)}`;
      return response.data.image;
    } else {
      const response = await axios.get(url);
      if (response.data.image.startsWith("ipfs://"))
        return `${IPFS_PREFIX}/${response.data.image.slice(7)}`;
      return response.data.image;
    }
  }
  if (asset_url.startsWith("https://gateway.pinata.cloud/ipfs/")) {
    return `${IPFS_PREFIX}/${asset_url.slice(33)}`;
  }
  if (asset_url.startsWith("ipfs://"))
    return `${IPFS_PREFIX}/${asset_url.slice(7)}`;
  return asset_url;
};

const getMetadataFromReserveAddress = async (
  reserveAddress: string,
  codec: string
): Promise<string> => {
  const decodedAddress = decodeAddress(reserveAddress);
  const ipfsCID = new cid(
    1,
    codec,
    multihash.encode(decodedAddress.publicKey, "sha2-256")
  ).toString();
  try {
    const response = await axios.get(`${IPFS_PREFIX}/${ipfsCID}`);
    if (response.data.image) return response.data.image;
    return `${IPFS_PREFIX}/${ipfsCID}`;
  } catch (error) {
    return "";
  }
};

export async function getNfdDomain(wallet: string): Promise<string> {
  try {
    const nfdDomain = await axios.get(
      `https://api.nf.domains/nfd/lookup?address=${wallet}&view=tiny`
    );
    if (nfdDomain.status === 200) {
      const data = nfdDomain.data;
      return data[wallet].name;
    } else {
      return shortenWallet(wallet);
    }
  } catch (error) {
    return shortenWallet(wallet);
  }
}

export async function isValidAsset(assetId: number): Promise<boolean> {
  try {
    const url = ALGONODE_MAINNET_NODE + "/v2/assets/" + assetId;
    const response = await axios.get(url);
    return response.status === 200;
  } catch (error) {
    console.log("Error: ", error);
    return false;
  }
}
