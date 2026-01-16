"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { useState } from "react";
import {
  mainnet,
  sepolia,
  holesky,
  hardhat,
  polygon,
  arbitrum,
} from "wagmi/chains";

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const supportedChains = [
    mainnet,
    sepolia,
    holesky,
    polygon,
    arbitrum,
    hardhat,
  ];

  const handleFaucet = async () => {
    if (!address) return;
    setIsFunding(true);
    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Funds sent! Wait a moment for balance update.");
      } else {
        alert("Faucet failed: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Faucet error");
    } finally {
      setIsFunding(false);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        {/* Faucet Button (Localhost Only) */}
        {chainId === hardhat.id && (
          <button
            onClick={handleFaucet}
            disabled={isFunding}
            className="btn btn-primary px-3 py-2 text-sm flex items-center gap-2"
          >
            {isFunding ? (
              <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            ) : (
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            Get Test ETH
          </button>
        )}

        {/* Network Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
            className="glass px-3 py-2 rounded-xl text-sm font-medium hover:bg-opacity-20 transition-all flex items-center gap-2"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                chain?.testnet ? "bg-yellow-400" : "bg-green-400"
              }`}
            ></div>
            {chain?.name || "Unknown Network"}
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showNetworkDropdown && (
            <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl overflow-hidden z-50 animate-fade-in shadow-xl">
              <div className="p-2">
                <div className="text-xs text-text-secondary px-2 py-1 uppercase font-semibold">
                  Switch Network
                </div>
                {supportedChains.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      switchChain({ chainId: c.id });
                      setShowNetworkDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left rounded-lg transition-colors text-sm flex items-center justify-between ${
                      chainId === c.id
                        ? "bg-primary bg-opacity-20 text-primary"
                        : "hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    {c.name}
                    {chainId === c.id && (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wallet Connection */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="glass-strong px-4 py-2 rounded-xl font-semibold text-sm hover:bg-opacity-20 transition-all flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            {formatAddress(address)}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl overflow-hidden z-50 animate-fade-in shadow-xl">
              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-white hover:bg-opacity-10 transition-colors text-sm font-medium text-red-400 hover:text-red-300"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="btn btn-primary"
      >
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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        Connect Wallet
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 glass-strong rounded-xl overflow-hidden z-50 animate-fade-in shadow-xl">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => {
                connect({ connector });
                setShowDropdown(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-white hover:bg-opacity-10 transition-colors flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm">{connector.name}</div>
                <div className="text-xs text-text-secondary">
                  Connect with {connector.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
