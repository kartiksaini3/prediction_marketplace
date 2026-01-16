export const PREDICTION_MARKET_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "question",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "MarketCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "outcome",
        type: "bool",
      },
    ],
    name: "MarketResolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "predictor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "prediction",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PredictionPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "predictor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardClaimed",
    type: "event",
  },
  {
    inputs: [],
    name: "MIN_STAKE",
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
    name: "PLATFORM_FEE",
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
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
    ],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_question",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_category",
        type: "string",
      },
    ],
    name: "createMarket",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
    ],
    name: "getMarket",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "question",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalYesStake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalNoStake",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "resolved",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "outcome",
            type: "bool",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
        ],
        internalType: "struct PredictionMarket.Market",
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
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
    ],
    name: "getMarketOdds",
    outputs: [
      {
        internalType: "uint256",
        name: "yesOdds",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "noOdds",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
    ],
    name: "getMarketPredictions",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "marketId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "predictor",
            type: "address",
          },
          {
            internalType: "bool",
            name: "prediction",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
        ],
        internalType: "struct PredictionMarket.Prediction[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserMarkets",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
    ],
    name: "getUserPrediction",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "marketId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "predictor",
            type: "address",
          },
          {
            internalType: "bool",
            name: "prediction",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
        ],
        internalType: "struct PredictionMarket.Prediction",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketCount",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "marketPredictions",
    outputs: [
      {
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "predictor",
        type: "address",
      },
      {
        internalType: "bool",
        name: "prediction",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "claimed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "markets",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "question",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalYesStake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalNoStake",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "resolved",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "outcome",
        type: "bool",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "category",
        type: "string",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_prediction",
        type: "bool",
      },
    ],
    name: "placePrediction",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "platformBalance",
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
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_outcome",
        type: "bool",
      },
    ],
    name: "resolveMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userMarkets",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userPredictions",
    outputs: [
      {
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "predictor",
        type: "address",
      },
      {
        internalType: "bool",
        name: "prediction",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "claimed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawPlatformFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
