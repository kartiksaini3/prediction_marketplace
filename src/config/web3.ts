import { http, createConfig } from "wagmi";
import {
  mainnet,
  sepolia,
  holesky,
  hardhat,
  polygon,
  arbitrum,
} from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id";

export const config = createConfig({
  chains: [mainnet, sepolia, holesky, polygon, arbitrum, hardhat],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [holesky.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});

export const CONTRACT_ADDRESSES: Record<number, string> = {
  [hardhat.id]:
    process.env.NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS ||
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [sepolia.id]:
    process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS ||
    "0x0000000000000000000000000000000000000000", // Replace with actual deployed address
  [holesky.id]:
    process.env.NEXT_PUBLIC_HOLESKY_CONTRACT_ADDRESS ||
    "0x0000000000000000000000000000000000000000",
  [mainnet.id]:
    process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ADDRESS ||
    "0x0000000000000000000000000000000000000000",
};

export const DEFAULT_CONTRACT_ADDRESS = CONTRACT_ADDRESSES[hardhat.id];

export const getContractAddress = (chainId: number | undefined) => {
  if (!chainId) return DEFAULT_CONTRACT_ADDRESS;
  return CONTRACT_ADDRESSES[chainId] || DEFAULT_CONTRACT_ADDRESS;
};
