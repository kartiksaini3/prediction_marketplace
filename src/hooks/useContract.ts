import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { PREDICTION_MARKET_ABI } from "@/config/abi";
import { getContractAddress } from "@/config/web3";
import { parseEther } from "viem";

export function useContractAddress() {
  const chainId = useChainId();
  return getContractAddress(chainId);
}

export function useMarketCount() {
  const address = useContractAddress();
  return useReadContract({
    address: address as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: "marketCount",
  });
}

export function useMarket(marketId: number) {
  const address = useContractAddress();
  return useReadContract({
    address: address as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getMarket",
    args: [BigInt(marketId)],
  });
}

export function useMarketOdds(marketId: number) {
  const address = useContractAddress();
  return useReadContract({
    address: address as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getMarketOdds",
    args: [BigInt(marketId)],
  });
}

export function useUserPrediction(
  userAddress: string | undefined,
  marketId: number
) {
  const address = useContractAddress();
  return useReadContract({
    address: address as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getUserPrediction",
    args: userAddress
      ? [userAddress as `0x${string}`, BigInt(marketId)]
      : undefined,
  });
}

export function useUserMarkets(userAddress: string | undefined) {
  const address = useContractAddress();
  return useReadContract({
    address: address as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getUserMarkets",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
  });
}

export function useCreateMarket() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const address = useContractAddress();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createMarket = (
    question: string,
    description: string,
    duration: number,
    category: string
  ) => {
    writeContract({
      address: address as `0x${string}`,
      abi: PREDICTION_MARKET_ABI,
      functionName: "createMarket",
      args: [question, description, BigInt(duration), category],
    });
  };

  return {
    createMarket,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function usePlacePrediction() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const address = useContractAddress();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const placePrediction = (
    marketId: number,
    prediction: boolean,
    amount: string
  ) => {
    writeContract({
      address: address as `0x${string}`,
      abi: PREDICTION_MARKET_ABI,
      functionName: "placePrediction",
      args: [BigInt(marketId), prediction],
      value: parseEther(amount),
    });
  };

  return {
    placePrediction,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useResolveMarket() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const address = useContractAddress();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const resolveMarket = (marketId: number, outcome: boolean) => {
    writeContract({
      address: address as `0x${string}`,
      abi: PREDICTION_MARKET_ABI,
      functionName: "resolveMarket",
      args: [BigInt(marketId), outcome],
    });
  };

  return {
    resolveMarket,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useClaimReward() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const address = useContractAddress();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claimReward = (marketId: number) => {
    writeContract({
      address: address as `0x${string}`,
      abi: PREDICTION_MARKET_ABI,
      functionName: "claimReward",
      args: [BigInt(marketId)],
    });
  };

  return {
    claimReward,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
