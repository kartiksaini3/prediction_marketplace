"use client";

import { useAccount, useLazyMint, usePublicClient, useChainId } from "wagmi";
import { useState, useEffect } from "react";
import { useUserMarkets, useContractAddress } from "@/hooks/useContract";
import { PREDICTION_MARKET_ABI } from "@/config/abi";
import { Market, Prediction } from "@/types";
import { formatEther } from "viem";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function MyPredictionsPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const chainId = useChainId();
  const contractAddress = useContractAddress();
  const publicClient = usePublicClient();

  const { data: userMarketIds, isLoading: isIdsLoading } =
    useUserMarkets(address);

  const [userPredictions, setUserPredictions] = useState<
    Array<{ market: Market; prediction: Prediction }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "active" | "claimable" | "claimed"
  >("all");

  useEffect(() => {
    if (!userMarketIds || !address || !publicClient || !contractAddress) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const ids = userMarketIds as bigint[];
        if (ids.length === 0) {
          setUserPredictions([]);
          setIsLoading(false);
          return;
        }

        const promises = ids.map(async (id) => {
          // Fetch Market Data
          const marketData = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: PREDICTION_MARKET_ABI,
            functionName: "getMarket",
            args: [id],
          });

          // Fetch Prediction Data
          const predictionData = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: PREDICTION_MARKET_ABI,
            functionName: "getUserPrediction",
            args: [address, id],
          });

          return {
            market: marketData as Market,
            prediction: predictionData as Prediction,
          };
        });

        const results = await Promise.all(promises);
        // Filter out any zero-amount predictions if any (contract logic already handles this mostly)
        const validResults = results.filter(
          (r) => Number(r.prediction.amount) > 0
        );

        // Sort by most recent (market ID descending)
        validResults.sort((a, b) => Number(b.market.id) - Number(a.market.id));

        setUserPredictions(validResults);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [userMarketIds, address, publicClient, contractAddress]);

  const filteredPredictions = userPredictions.filter(
    ({ market, prediction }) => {
      if (filter === "active") {
        return !market.resolved && Number(market.endTime) * 1000 > Date.now();
      }
      if (filter === "claimable") {
        return (
          market.resolved &&
          !prediction.claimed &&
          prediction.prediction === market.outcome
        );
      }
      if (filter === "claimed") {
        return prediction.claimed;
      }
      return true;
    }
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen section-padding">
        <div className="container-custom max-w-2xl">
          <div className="card text-center py-16">
            <svg
              className="w-20 h-20 mx-auto mb-6 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-text-secondary text-lg">
              Please connect your wallet to view your predictions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Predictions</span>
          </h1>
          <p className="text-xl text-text-secondary">
            Track your predictions and claim your rewards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {userPredictions.length}
            </div>
            <div className="text-text-secondary text-sm">Total Predictions</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {
                userPredictions.filter(
                  ({ market }) =>
                    !market.resolved &&
                    Number(market.endTime) * 1000 > Date.now()
                ).length
              }
            </div>
            <div className="text-text-secondary text-sm">Active</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {
                userPredictions.filter(
                  ({ market, prediction }) =>
                    market.resolved &&
                    !prediction.claimed &&
                    prediction.prediction === market.outcome
                ).length
              }
            </div>
            <div className="text-text-secondary text-sm">Claimable</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {
                userPredictions.filter(({ prediction }) => prediction.claimed)
                  .length
              }
            </div>
            <div className="text-text-secondary text-sm">Claimed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(["all", "active", "claimable", "claimed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-primary to-secondary text-white"
                  : "glass hover:bg-white hover:bg-opacity-10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {(isLoading || isIdsLoading) && (
          <div className="flex justify-center py-12">
            <Loader size="lg" text="Loading predictions..." />
          </div>
        )}

        {/* Predictions List */}
        {!isLoading && !isIdsLoading && filteredPredictions.length === 0 ? (
          <div className="card text-center py-16">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">No Predictions Found</h3>
            <p className="text-text-secondary mb-6">
              Start making predictions on active markets!
            </p>
            <a href="/" className="btn btn-primary inline-flex">
              Explore Markets
            </a>
          </div>
        ) : (
          !isLoading &&
          !isIdsLoading && (
            <div className="space-y-4">
              {filteredPredictions.map(({ market, prediction }) => {
                const isWinner =
                  market.resolved && prediction.prediction === market.outcome;
                const isActive =
                  !market.resolved &&
                  Number(market.endTime) * 1000 > Date.now();

                return (
                  <div
                    key={Number(market.id)}
                    onClick={() => router.push(`/market/${market.id}`)}
                    className="card hover-lift cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Market Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {market.category}
                          </span>
                          {isActive && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30">
                              Active
                            </span>
                          )}
                          {market.resolved && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                isWinner
                                  ? "bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30"
                                  : "bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30"
                              }`}
                            >
                              {isWinner
                                ? prediction.claimed
                                  ? "Claimed"
                                  : "Winner!"
                                : "Lost"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold mb-1">
                          {market.question}
                        </h3>
                        <p className="text-sm text-text-secondary line-clamp-1">
                          {market.description}
                        </p>
                      </div>

                      {/* Prediction Info */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-text-secondary mb-1">
                            Your Prediction
                          </div>
                          <div
                            className={`text-xl font-bold ${
                              prediction.prediction
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {prediction.prediction ? "YES" : "NO"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-text-secondary mb-1">
                            Stake
                          </div>
                          <div className="text-xl font-bold text-white">
                            {parseFloat(formatEther(prediction.amount)).toFixed(
                              4
                            )}{" "}
                            ETH
                          </div>
                        </div>
                        <svg
                          className="w-6 h-6 text-text-secondary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
