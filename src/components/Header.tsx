"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletConnect from "./WalletConnect";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Markets", path: "/" },
    { name: "Create", path: "/create" },
    { name: "My Predictions", path: "/my-predictions" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border-color">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">
              PredictChain
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  pathname === item.path
                    ? "bg-white bg-opacity-10 text-white"
                    : "text-text-secondary hover:text-white hover:bg-white hover:bg-opacity-5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Wallet Connect */}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
