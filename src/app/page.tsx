"use client";

import { useState, useEffect } from "react";
import MarketCard from "@/components/MarketCard";
import { useMarketCount } from "@/hooks/useContract";
import { Market } from "@/types";
import { useChainId } from "wagmi";

export default function Home() {
  const { data: marketCount } = useMarketCount();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const chainId = useChainId();

  const categories = [
    "all",
    "Sports",
    "Politics",
    "Crypto",
    "Entertainment",
    "Technology",
    "Other",
  ];

  // Fetch all markets
  useEffect(() => {
    if (!marketCount) return;

    const fetchMarkets = async () => {
      const count = Number(marketCount);
      const marketPromises = [];

      // Only fetch up to 20 for now to avoid extensive loading
      // In production, we would use pagination
      for (let i = 1; i <= Math.min(count, 50); i++) {
        marketPromises.push(
          fetch(`/api/market/${i}?chainId=${chainId}`)
            .then((res) => {
              if (res.ok) return res.json();
              return null;
            })
            .catch(() => null)
        );
      }

      const results = await Promise.all(marketPromises);
      const validMarkets = results.filter((m) => m !== null);
      setMarkets(validMarkets);
    };

    fetchMarkets();
  }, [marketCount, chainId]);

  const filteredMarkets = markets.filter((market) => {
    const now = Date.now();
    const endTime = Number(market.endTime) * 1000;
    const isActive = endTime > now && !market.resolved;

    if (filter === "active" && !isActive) return false;
    if (filter === "resolved" && !market.resolved) return false;
    if (categoryFilter !== "all" && market.category !== categoryFilter)
      return false;

    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding border-b border-border-color">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Decentralized
              <span className="gradient-text"> Prediction Markets</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Bet on future events using blockchain technology. Transparent,
              trustless, and powered by smart contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/create" className="btn btn-primary text-lg px-8 py-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Market
              </a>
              <a
                href="#markets"
                className="btn btn-secondary text-lg px-8 py-4"
              >
                Explore Markets
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {marketCount ? Number(marketCount) : 0}
              </div>
              <div className="text-text-secondary">Total Markets</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {
                  markets.filter(
                    (m) => !m.resolved && Number(m.endTime) * 1000 > Date.now()
                  ).length
                }
              </div>
              <div className="text-text-secondary">Active Markets</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {(
                  markets.reduce(
                    (sum, m) => sum + Number(m.totalYesStake + m.totalNoStake),
                    0
                  ) / 1e18
                ).toFixed(4)}
              </div>
              <div className="text-text-secondary">Total Volume (ETH)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section id="markets" className="section-padding">
        <div className="container-custom">
          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
              <h2 className="text-3xl font-bold">Markets</h2>

              {/* Status Filter */}
              <div className="flex gap-2">
                {(["all", "active", "resolved"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                      filter === f
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "glass hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-all ${
                    categoryFilter === cat
                      ? "bg-white bg-opacity-10 text-white"
                      : "glass hover:bg-white hover:bg-opacity-5 text-text-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Markets Grid */}
          {filteredMarkets.length === 0 ? (
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-xl font-bold mb-2">No Markets Found</h3>
              <p className="text-text-secondary mb-6">
                Be the first to create a prediction market!
              </p>
              <a href="/create" className="btn btn-primary inline-flex">
                Create Market
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <MarketCard key={Number(market.id)} market={market} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
