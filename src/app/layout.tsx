import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "PredictChain - Decentralized Prediction Markets",
  description:
    "Bet on future events using blockchain technology. Transparent, trustless, and powered by smart contracts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
