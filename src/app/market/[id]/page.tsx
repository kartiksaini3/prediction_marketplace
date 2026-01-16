"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useMarket,
  useMarketOdds,
  useUserPrediction,
  useResolveMarket,
  useClaimReward,
} from "@/hooks/useContract";
import { Market } from "@/types";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import PredictionForm from "@/components/PredictionForm";

export default function MarketDetailPage() {
  const params = useParams();
  const marketId = parseInt(params.id as string);
  const { address, isConnected } = useAccount();

  const { data: marketData, refetch: refetchMarket } = useMarket(marketId);
  const { data: odds, refetch: refetchOdds } = useMarketOdds(marketId);
  const { data: userPrediction, refetch: refetchUserPrediction } =
    useUserPrediction(address, marketId);

  const {
    resolveMarket,
    isPending: isResolving,
    isSuccess: isResolved,
  } = useResolveMarket();
  const {
    claimReward,
    isPending: isClaiming,
    isSuccess: isClaimed,
  } = useClaimReward();

  const [showResolveModal, setShowResolveModal] = useState(false);

  const market = marketData as Market | undefined;
  const yesPercentage = odds ? Number(odds[0]) : 50;
  const noPercentage = odds ? Number(odds[1]) : 50;

  const timeRemaining = market ? Number(market.endTime) * 1000 - Date.now() : 0;
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
  );

  const isActive = timeRemaining > 0 && market && !market.resolved;
  const canResolve =
    market &&
    timeRemaining <= 0 &&
    !market.resolved &&
    address === market.creator;
  const canClaim =
    market &&
    market.resolved &&
    userPrediction &&
    Number(userPrediction.amount) > 0 &&
    !userPrediction.claimed &&
    userPrediction.prediction === market.outcome;

  const handleResolve = (outcome: boolean) => {
    resolveMarket(marketId, outcome);
    setShowResolveModal(false);
  };

  const handleClaim = () => {
    claimReward(marketId);
  };

  useEffect(() => {
    if (isResolved || isClaimed) {
      refetchMarket();
      refetchOdds();
      refetchUserPrediction();
    }
  }, [isResolved, isClaimed]);

  if (!market) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <div className="card animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {market.category}
                    </span>
                    {isActive ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Active
                      </span>
                    ) : market.resolved ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500 bg-opacity-20 text-gray-400 border border-gray-500 border-opacity-30">
                        Resolved
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-30">
                        Ended
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {market.question}
                  </h1>
                  <p className="text-text-secondary text-lg">
                    {market.description}
                  </p>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-border-color">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                <div>
                  <div className="text-xs text-text-secondary">Created by</div>
                  <div className="font-semibold">
                    {market.creator.slice(0, 10)}...{market.creator.slice(-8)}
                  </div>
                </div>
              </div>
            </div>

            {/* Odds Visualization */}
            <div className="card animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Current Odds</h2>

              <div className="space-y-6">
                {/* YES */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-xl font-bold">YES</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {yesPercentage}%
                      </div>
                      <div className="text-sm text-text-secondary">
                        {parseFloat(formatEther(market.totalYesStake)).toFixed(
                          4
                        )}{" "}
                        ETH
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${yesPercentage}%` }}
                    />
                  </div>
                </div>

                {/* NO */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <span className="text-xl font-bold">NO</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-400">
                        {noPercentage}%
                      </div>
                      <div className="text-sm text-text-secondary">
                        {parseFloat(formatEther(market.totalNoStake)).toFixed(
                          4
                        )}{" "}
                        ETH
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${noPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Total Pool */}
              <div className="glass-strong p-4 rounded-xl mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Total Pool</span>
                  <span className="text-2xl font-bold gradient-text">
                    {parseFloat(
                      formatEther(market.totalYesStake + market.totalNoStake)
                    ).toFixed(4)}{" "}
                    ETH
                  </span>
                </div>
              </div>
            </div>

            {/* Resolution Result */}
            {market.resolved && (
              <div className="card animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Resolution</h2>
                <div
                  className={`p-6 rounded-xl ${
                    market.outcome
                      ? "bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30"
                      : "bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full ${
                        market.outcome ? "bg-green-500" : "bg-red-500"
                      } flex items-center justify-center`}
                    >
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {market.outcome ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        )}
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary">
                        Market resolved as
                      </div>
                      <div
                        className={`text-3xl font-bold ${
                          market.outcome ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {market.outcome ? "YES" : "NO"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Time Remaining */}
            <div className="card animate-fade-in">
              <h3 className="text-lg font-bold mb-4">
                {isActive
                  ? "Time Remaining"
                  : market.resolved
                  ? "Market Closed"
                  : "Market Ended"}
              </h3>
              {isActive ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center glass p-3 rounded-lg">
                    <div className="text-2xl font-bold gradient-text">
                      {daysRemaining}
                    </div>
                    <div className="text-xs text-text-secondary">Days</div>
                  </div>
                  <div className="text-center glass p-3 rounded-lg">
                    <div className="text-2xl font-bold gradient-text">
                      {hoursRemaining}
                    </div>
                    <div className="text-xs text-text-secondary">Hours</div>
                  </div>
                  <div className="text-center glass p-3 rounded-lg">
                    <div className="text-2xl font-bold gradient-text">
                      {minutesRemaining}
                    </div>
                    <div className="text-xs text-text-secondary">Mins</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-text-secondary">
                    {market.resolved ? "✓ Resolved" : "⏱ Ended"}
                  </div>
                </div>
              )}
            </div>

            {/* User's Prediction */}
            {userPrediction && Number(userPrediction.amount) > 0 && (
              <div className="card animate-fade-in">
                <h3 className="text-lg font-bold mb-4">Your Prediction</h3>
                <div
                  className={`p-4 rounded-xl ${
                    userPrediction.prediction
                      ? "bg-green-500 bg-opacity-10"
                      : "bg-red-500 bg-opacity-10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary">Prediction</span>
                    <span
                      className={`font-bold text-lg ${
                        userPrediction.prediction
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {userPrediction.prediction ? "YES" : "NO"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Stake</span>
                    <span className="font-bold">
                      {parseFloat(formatEther(userPrediction.amount)).toFixed(
                        4
                      )}{" "}
                      ETH
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Claim Reward */}
            {canClaim && (
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="btn btn-primary w-full py-4 animate-glow"
              >
                {isClaiming ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner w-5 h-5 border-2" />
                    Claiming...
                  </div>
                ) : isClaimed ? (
                  "✓ Claimed!"
                ) : (
                  "🎉 Claim Reward"
                )}
              </button>
            )}

            {/* Resolve Market */}
            {canResolve && (
              <button
                onClick={() => setShowResolveModal(true)}
                className="btn btn-secondary w-full py-4"
              >
                Resolve Market
              </button>
            )}

            {/* Place Prediction */}
            {isActive && (
              <PredictionForm
                marketId={marketId}
                onSuccess={() => {
                  refetchMarket();
                  refetchOdds();
                  refetchUserPrediction();
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">Resolve Market</h3>
            <p className="text-text-secondary mb-6">
              Select the outcome for this market:
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleResolve(true)}
                disabled={isResolving}
                className="btn bg-gradient-to-br from-green-500 to-emerald-500 text-white py-4"
              >
                YES
              </button>
              <button
                onClick={() => handleResolve(false)}
                disabled={isResolving}
                className="btn bg-gradient-to-br from-red-500 to-pink-500 text-white py-4"
              >
                NO
              </button>
            </div>

            <button
              onClick={() => setShowResolveModal(false)}
              className="btn btn-secondary w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
