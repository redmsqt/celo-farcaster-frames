import { gql } from "@apollo/client";

export const PROJECT_CORE_FIELDS = gql`
  fragment ProjectCoreFields on Project {
    __typename
    id
    title
    image
    slug
    verified
    isGivbackEligible
    totalDonations
    qfRounds {
      id
      name
      isActive
      beginDate
      endDate
      maximumReward
      allocatedTokenSymbol
      allocatedFundUSDPreferred
      allocatedFundUSD
    }
  }
`;

export const PROJECT_CARD_FIELDS = gql`
  ${PROJECT_CORE_FIELDS}
  fragment ProjectCardFields on Project {
    ...ProjectCoreFields
    descriptionSummary
    adminUser {
      name
      walletAddress
      avatar
    }
    updatedAt
    latestUpdateCreationDate
    organization {
      label
    }
    projectPower {
      powerRank
      totalPower
      round
    }
    sumDonationValueUsdForActiveQfRound
    countUniqueDonorsForActiveQfRound
    countUniqueDonors
    estimatedMatching {
      projectDonationsSqrtRootSum
      allProjectsSum
      matchingPool
    }
    anchorContracts {
      address
      isActive
      networkId
    }
  }
`;

export const FETCH_ALL_PROJECTS = gql`
  ${PROJECT_CARD_FIELDS}
  query FetchAllProjects(
    $limit: Int
    $skip: Int
    $sortingBy: SortingField
    $filters: [FilterField!]
    $searchTerm: String
    $category: String
    $mainCategory: String
    $campaignSlug: String
    $connectedWalletUserId: Int
    $qfRoundSlug: String
  ) {
    allProjects(
      limit: $limit
      skip: $skip
      sortingBy: $sortingBy
      filters: $filters
      searchTerm: $searchTerm
      category: $category
      mainCategory: $mainCategory
      campaignSlug: $campaignSlug
      connectedWalletUserId: $connectedWalletUserId
      qfRoundSlug: $qfRoundSlug
    ) {
      projects {
        ...ProjectCardFields
      }
      totalCount
    }
  }
`;

export const FETCH_PROJECT_BY_ID = gql`
  query ProjectById($id: Float!) {
    projectById(id: $id) {
      id
      title
      image
      description
      addresses {
        address
        memo
        isRecipient
        networkId
        chainType
      }
      socialMedia {
        type
        link
      }
      impactLocation
      categories {
        name
        value
      }
      adminUser {
        walletAddress
      }
      status {
        name
      }
      slug
      anchorContracts {
        address
        isActive
        networkId
      }
    }
  }
`;

export const MAIN_CATEGORIES_QUERY = `
  mainCategories {
    title
    banner
    slug
    description
    categories {
      name
      value
      isActive
      canUseOnFrontend
    }
  }
`;

export const FETCH_MAIN_CATEGORIES = gql`
	query {
		${MAIN_CATEGORIES_QUERY}
	}
`;
