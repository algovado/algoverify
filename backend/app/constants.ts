import dotenv from "dotenv";

dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";

export const PORT = process.env.PORT || 3001;
export const BASE_URL = process.env.BASE_URL || "";

export const APPLY_FEE = parseFloat(process.env.APPLY_FEE || "1");
export const APPLY_WALLET = process.env.APPLY_WALLET || "VERFYVVV6UY6BSURMMQ23MOAOF7GD6DJ676EQZYOKJTJLLLFPJ4Q5VF3VU";
export const ALGONODE_MAINNET_NODE_URL = process.env.MAINNET_NODE || "https://mainnet-api.4160.nodely.dev";
export const ALGONODE_IDX_NODE_URL = process.env.MAINNET_INDEXER || "https://mainnet-idx.4160.nodely.dev";
