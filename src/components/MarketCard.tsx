"use client";

import { Market } from "@/types";
import { formatEther } from "viem";
import { useMarketOdds } from "@/hooks/useContract";
import { useRouter } from "next/navigation";

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  const router = useRouter();
  const { data: odds } = useMarketOdds(Number(market.id));

  const totalStake = market.totalYesStake + market.totalNoStake;
  const yesPercentage = odds ? Number(odds[0]) : 50;
  const noPercentage = odds ? Number(odds[1]) : 50;

  const timeRemaining = Number(market.endTime) * 1000 - Date.now();
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  const isActive = timeRemaining > 0 && !market.resolved;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Sports: "from-orange-500 to-red-500",
      Politics: "from-blue-500 to-purple-500",
      Crypto: "from-yellow-500 to-orange-500",
      Entertainment: "from-pink-500 to-purple-500",
      Technology: "from-cyan-500 to-blue-500",
      Other: "from-gray-500 to-gray-600",
    };
    return colors[category] || colors["Other"];
  };

  return (
    <div
      onClick={() => router.push(`/market/${market.id}`)}
      className="card hover-lift cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(
                market.category
              )} text-white`}
            >
              {market.category}
            </span>
            {isActive ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30">
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
          <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors line-clamp-2">
            {market.question}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
        {market.description}
      </p>

      {/* Odds Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">
            Market Odds
          </span>
          <span className="text-sm font-bold text-white">
            {yesPercentage}% / {noPercentage}%
          </span>
        </div>
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${yesPercentage}%` }}
          />
          <div
            className="bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
            style={{ width: `${noPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-green-400 font-medium">YES</span>
          <span className="text-xs text-red-400 font-medium">NO</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass p-3 rounded-lg">
          <div className="text-xs text-text-secondary mb-1">Total Pool</div>
          <div className="text-lg font-bold text-white">
            {parseFloat(formatEther(totalStake)).toFixed(4)} ETH
          </div>
        </div>
        <div className="glass p-3 rounded-lg">
          <div className="text-xs text-text-secondary mb-1">
            {isActive ? "Time Left" : "Status"}
          </div>
          <div className="text-lg font-bold text-white">
            {isActive
              ? `${daysRemaining}d ${hoursRemaining}h`
              : market.resolved
              ? market.outcome
                ? "YES Won"
                : "NO Won"
              : "Ended"}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border-color">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary" />
          <span className="text-xs text-text-secondary">
            {market.creator.slice(0, 6)}...{market.creator.slice(-4)}
          </span>
        </div>
        <button className="text-sm font-semibold text-primary group-hover:text-primary-light transition-colors flex items-center gap-1">
          View Details
          <svg
            className="w-4 h-4"
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
        </button>
      </div>
    </div>
  );
}
