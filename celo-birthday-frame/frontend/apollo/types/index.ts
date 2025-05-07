export interface MainCategoriesQuery {
  mainCategories: {
    title: string;
    banner: string;
    slug: string;
    description: string;
    categories: {
      name: string;
      value: string;
      isActive: boolean;
      canUseOnFrontend: boolean;
    }[];
  }[];
}

export type ProjectByIdQuery = {
  projectById: {
    id: number;
    title: string;
    image: string;
    description: string;
    addresses: Array<{
      address: string;
      memo: string;
      isRecipient: boolean;
      networkId: number;
      chainType: string;
    }>;
    socialMedia: Array<{
      type: string;
      link: string;
    }>;
    impactLocation: string;
    categories: Array<{
      name: string;
      value: string;
    }>;
    adminUser: {
      walletAddress: string;
    };
    status: {
      name: string;
    };
    slug: string;
    anchorContracts: Array<{
      address: string;
      isActive: boolean;
      networkId: number;
    }>;
  };
};

export type FetchAllProjectsVariables = {
  limit?: number;
  skip?: number;
  sortingBy?: string;
  filters?: Array<string>;
  searchTerm?: string;
  category?: string;
  mainCategory?: string;
  campaignSlug?: string;
  connectedWalletUserId?: number;
  qfRoundSlug?: string;
};

export type FetchAllProjectsResponse = {
  allProjects: {
    projects: Array<Project>;
    totalCount: number;
  };
};

export type Project = {
  id: string;
  title: string;
  image: string;
  slug: string;
  verified: boolean;
  isGivbackEligible: boolean;
  totalDonations: number;
  descriptionSummary: string;
  updatedAt: string;
  latestUpdateCreationDate: string;
  sumDonationValueUsdForActiveQfRound: number;
  countUniqueDonorsForActiveQfRound: number;
  countUniqueDonors: number;
  adminUser: {
    name: string;
    walletAddress: string;
    avatar: string;
  };
  organization: {
    label: string;
  };
  projectPower: {
    powerRank: number;
    totalPower: number;
    round: string;
  };
  estimatedMatching: {
    projectDonationsSqrtRootSum: number;
    allProjectsSum: number;
    matchingPool: number;
  };
  qfRounds: Array<{
    id: string;
    name: string;
    isActive: boolean;
    beginDate: string;
    endDate: string;
    maximumReward: number;
    allocatedTokenSymbol: string;
    allocatedFundUSDPreferred: number;
    allocatedFundUSD: number;
  }>;
  anchorContracts: Array<{
    address: string;
    isActive: boolean;
    networkId: number;
  }>;
};
