"use client";

import { useState } from "react";
import { useCreateMarket } from "@/hooks/useContract";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export default function CreateMarketPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { createMarket, isPending, isConfirming, isSuccess, error } =
    useCreateMarket();

  const [formData, setFormData] = useState({
    question: "",
    description: "",
    duration: "7",
    category: "Other",
  });

  const categories = [
    "Sports",
    "Politics",
    "Crypto",
    "Entertainment",
    "Technology",
    "Other",
  ];
  const durations = [
    { label: "1 Day", value: 86400 },
    { label: "3 Days", value: 259200 },
    { label: "7 Days", value: 604800 },
    { label: "14 Days", value: 1209600 },
    { label: "30 Days", value: 2592000 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const durationInSeconds = parseInt(formData.duration) * 86400;
    createMarket(
      formData.question,
      formData.description,
      durationInSeconds,
      formData.category
    );
  };

  if (isSuccess) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

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
              Please connect your wallet to create a prediction market
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Create <span className="gradient-text">Prediction Market</span>
          </h1>
          <p className="text-xl text-text-secondary">
            Create a new prediction market and let others bet on the outcome
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card animate-fade-in">
          {/* Question */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-text-secondary">
              Market Question *
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              placeholder="Will Bitcoin reach $100,000 by end of 2024?"
              className="w-full px-4 py-3 bg-bg-tertiary border border-border-color rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              required
            />
            <p className="text-xs text-text-muted mt-2">
              Ask a clear yes/no question about a future event
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-text-secondary">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide context and resolution criteria for this market..."
              rows={4}
              className="w-full px-4 py-3 bg-bg-tertiary border border-border-color rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
              required
            />
            <p className="text-xs text-text-muted mt-2">
              Explain how the market will be resolved and any important details
            </p>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-text-secondary">
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`p-3 rounded-xl font-semibold transition-all ${
                    formData.category === cat
                      ? "bg-gradient-to-br from-primary to-secondary text-white shadow-lg"
                      : "glass hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3 text-text-secondary">
              Market Duration *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {durations.map((dur) => (
                <button
                  key={dur.value}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      duration: (dur.value / 86400).toString(),
                    })
                  }
                  className={`p-3 rounded-xl font-semibold transition-all ${
                    formData.duration === (dur.value / 86400).toString()
                      ? "bg-white bg-opacity-10 text-white border-2 border-primary"
                      : "glass hover:bg-white hover:bg-opacity-5"
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-2">
              How long should this market remain open for predictions?
            </p>
          </div>

          {/* Preview */}
          <div className="glass-strong p-6 rounded-xl mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-text-secondary">Question:</span>
                <p className="text-white font-semibold">
                  {formData.question || "Your question will appear here"}
                </p>
              </div>
              <div>
                <span className="text-xs text-text-secondary">
                  Description:
                </span>
                <p className="text-text-secondary text-sm">
                  {formData.description || "Your description will appear here"}
                </p>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-xs text-text-secondary">Category:</span>
                  <p className="text-white font-semibold">
                    {formData.category}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-text-secondary">Duration:</span>
                  <p className="text-white font-semibold">
                    {formData.duration} days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isPending ||
              isConfirming ||
              !formData.question ||
              !formData.description
            }
            className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || isConfirming ? (
              <div className="flex items-center gap-2">
                <div className="spinner w-5 h-5 border-2" />
                {isPending ? "Creating Market..." : "Confirming..."}
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
                Market Created Successfully!
              </div>
            ) : (
              "Create Market"
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-xl">
              <p className="text-sm text-red-400">{error.message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
