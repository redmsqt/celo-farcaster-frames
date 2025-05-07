export const ContractAddress = "0x503028d1F0c7a55D49C872745bB99dAc084f959C";

export const ContractAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_identityVerificationHub",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_scope",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_attestationId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_olderThanEnabled",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_olderThan",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_forbiddenCountriesEnabled",
        type: "bool",
      },
      {
        internalType: "uint256[4]",
        name: "_forbiddenCountriesListPacked",
        type: "uint256[4]",
      },
      {
        internalType: "bool[3]",
        name: "_ofacEnabled",
        type: "bool[3]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "INSUFFICIENT_CHARCODE_LEN",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAttestationId",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDateLength",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDayRange",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFieldElement",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMonthRange",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidScope",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidYearRange",
    type: "error",
  },
  {
    inputs: [],
    name: "MissingRequiredField",
    type: "error",
  },
  {
    inputs: [],
    name: "NotWithinBirthdayWindow",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyMoneyRoute",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "RecordAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "RegisteredCelebrant",
    type: "error",
  },
  {
    inputs: [],
    name: "RegisteredNullifier",
    type: "error",
  },
  {
    inputs: [],
    name: "UnRegisteredCelerbrant",
    type: "error",
  },
  {
    inputs: [],
    name: "UnRegisteredNullifier",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "celebrant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "creation_date",
        type: "uint256",
      },
    ],
    name: "NewBirthdayRecord",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "celebrant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "creation_date",
        type: "uint256",
      },
    ],
    name: "NewCelebrant",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "NewGiftReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "birthdayRecords",
    outputs: [
      {
        internalType: "address",
        name: "celebrant",
        type: "address",
      },
      {
        internalType: "enum CeloBirthdayFrame.BirthdayRoute",
        name: "route",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "string",
        name: "category",
        type: "string",
      },
      {
        internalType: "string",
        name: "donationProjectUrl",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "donationProjectId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "creationDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "moneyGiftsReceived",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "celebrant",
        type: "address",
      },
      {
        internalType: "enum CeloBirthdayFrame.BirthdayRoute",
        name: "route",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "string",
        name: "category",
        type: "string",
      },
      {
        internalType: "string",
        name: "donationProjectUrl",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "donationProjectId",
        type: "uint256",
      },
    ],
    name: "createBirthdayRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "celebrant",
        type: "address",
      },
    ],
    name: "getBirthdayRecord",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "celebrant",
            type: "address",
          },
          {
            internalType: "enum CeloBirthdayFrame.BirthdayRoute",
            name: "route",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "string",
            name: "donationProjectUrl",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "donationProjectId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "creationDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "moneyGiftsReceived",
            type: "uint256",
          },
        ],
        internalType: "struct CeloBirthdayFrame.BirthdayRecord",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "celebrant",
        type: "address",
      },
    ],
    name: "getCelebrantName",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "celebrant",
        type: "address",
      },
    ],
    name: "isCelebrantRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "celebrant",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "sendBirthdayGift",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256[2]",
            name: "a",
            type: "uint256[2]",
          },
          {
            internalType: "uint256[2][2]",
            name: "b",
            type: "uint256[2][2]",
          },
          {
            internalType: "uint256[2]",
            name: "c",
            type: "uint256[2]",
          },
          {
            internalType: "uint256[21]",
            name: "pubSignals",
            type: "uint256[21]",
          },
        ],
        internalType: "struct IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof",
        name: "proof",
        type: "tuple",
      },
    ],
    name: "verifySelfProof",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const IERC20Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
  {
    inputs: [],
    name: "totalSupply",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
