"use client";

import { useState } from "react";
import { usePlacePrediction } from "@/hooks/useContract";
import { useAccount } from "wagmi";

interface PredictionFormProps {
  marketId: number;
  onSuccess?: () => void;
}

export default function PredictionForm({
  marketId,
  onSuccess,
}: PredictionFormProps) {
  const { address, isConnected } = useAccount();
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [amount, setAmount] = useState("");
  const { placePrediction, isPending, isConfirming, isSuccess, error } =
    usePlacePrediction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prediction === null || !amount) return;

    placePrediction(marketId, prediction, amount);
  };

  if (isSuccess) {
    setTimeout(() => {
      onSuccess?.();
    }, 2000);
  }

  if (!isConnected) {
    return (
      <div className="card text-center py-8">
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
        <p className="text-text-secondary">
          Please connect your wallet to place predictions
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-2xl font-bold mb-6 gradient-text">
        Place Your Prediction
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prediction Selection */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-text-secondary">
            Your Prediction
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPrediction(true)}
              className={`p-4 rounded-xl font-bold text-lg transition-all ${
                prediction === true
                  ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg scale-105"
                  : "glass hover:bg-white hover:bg-opacity-10 text-text-secondary"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-6 h-6"
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
                YES
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPrediction(false)}
              className={`p-4 rounded-xl font-bold text-lg transition-all ${
                prediction === false
                  ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg scale-105"
                  : "glass hover:bg-white hover:bg-opacity-10 text-text-secondary"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-6 h-6"
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
                NO
              </div>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-text-secondary">
            Stake Amount (ETH)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              className="w-full px-4 py-3 bg-bg-tertiary border border-border-color rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary font-semibold">
              ETH
            </span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Minimum stake: 0.001 ETH
          </p>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex gap-2">
          {["0.01", "0.05", "0.1", "0.5"].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val)}
              className="flex-1 px-3 py-2 glass rounded-lg text-sm font-semibold hover:bg-white hover:bg-opacity-10 transition-all"
            >
              {val} ETH
            </button>
          ))}
        </div>

        {/* Potential Return */}
        {prediction !== null && amount && (
          <div className="glass-strong p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">
                Potential Return
              </span>
              <span className="text-lg font-bold text-white">
                ~{(parseFloat(amount) * 1.8).toFixed(4)} ETH
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                Platform Fee (2%)
              </span>
              <span className="text-sm text-text-muted">
                {(parseFloat(amount) * 0.02).toFixed(4)} ETH
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={prediction === null || !amount || isPending || isConfirming}
          className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? (
            <div className="flex items-center gap-2">
              <div className="spinner w-5 h-5 border-2" />
              {isPending ? "Confirming..." : "Processing..."}
            </div>
          ) : isSuccess ? (
            <div className="flex items-center gap-2">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Prediction Placed!
            </div>
          ) : (
            "Place Prediction"
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-xl">
            <p className="text-sm text-red-400">{error.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
