import { BlacklistedAsset, CreatorWallet, Project, ProjectAssets } from "@prisma/client";

export type ProjectWithAssets = Project & {
  projectAssets: ProjectAssets[];
};

export type FullProject = Project & {
  blacklistedAssets: BlacklistedAsset[];
  projectAssets: ProjectAssets[];
  creatorWallets: CreatorWallet[];
};

export type IndexerResponse = {
  account: Account;
  "current-round": number;
};

export type Account = {
  address: string;
  amount: number;
  "amount-without-pending-rewards": number;
  "apps-total-extra-pages": number;
  "apps-total-schema": AppsTotalSchema;
  assets: Asset[];
  "auth-addr": string;
  "created-at-round": number;
  deleted: boolean;
  "pending-rewards": number;
  "reward-base": number;
  rewards: number;
  round: number;
  "sig-type": string;
  status: string;
  "total-apps-opted-in": number;
  "total-assets-opted-in": number;
  "total-box-bytes": number;
  "total-boxes": number;
  "total-created-apps": number;
  "total-created-assets": number;
};

type AppsTotalSchema = {
  "num-byte-slice": number;
  "num-uint": number;
};

export type Asset = {
  amount: number;
  "asset-id": bigint;
  deleted: boolean;
  "is-frozen": boolean;
  "opted-in-at-round": number;
  "opted-out-at-round"?: number;
};

export type AlgonodeResponse = {
  assets: {
    "asset-id": bigint;
    amount: number;
  }[];
  "created-assets": { index: bigint }[];
};

export interface AssetParamsType {
  creator: string;
  decimals: number;
  manager: string;
  name: string;
  reserve: string;
  total: number;
  "unit-name": string;
  url: string;
}
