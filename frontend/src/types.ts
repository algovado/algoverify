type Project = {
  name: string;
  blacklist: number[];
  creatorName: string;
  creatorWallets: string[];
  guildId: string;
  holderRoleId: string;
  verifyChannel: string;
  featuredAsset: number;
  inviteLink: string;
  specialAmount: number | undefined;
  specialRoleId: string | undefined;
};

type ProjectAssets = {
  assetId: string;
  roleId: string;
};

export type ProjectWithAssets = Project & {
  projectAssets: ProjectAssets[];
};

export type ProjectsResponse = {
  id: number;
  name: string;
  blacklist: number[];
  creatorName: string;
  guildId: string;
  creatorWallets: {
    wallet: string;
  }[];
  holderRoleId: string;
  verifyChannel: string;
  featuredAsset: number;
  inviteLink: string;
  specialAmount: number | null;
  specialRoleId: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
};

export type LeaderboardResponse = {
  count: number;
  user: {
    userWallets: {
      wallet: string;
    }[];
  };
}[];

export type SingleProjectResponse = {
  project: ProjectsResponse;
  leaderboard: LeaderboardResponse;
  uniqueHolders: number;
};

export type SpecialAssetInputType = {
  id: number;
  assetId: number | null;
  roleId: string | null;
}