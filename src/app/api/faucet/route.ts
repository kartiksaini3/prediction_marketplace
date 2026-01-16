import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Hardhat Account #0 Private Key
    const account = privateKeyToAccount(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );

    const client = createWalletClient({
      account,
      chain: hardhat,
      transport: http("http://127.0.0.1:8545"),
    });

    const hash = await client.sendTransaction({
      to: address,
      value: parseEther("10"), // Send 10 ETH
    });

    return NextResponse.json({ success: true, hash });
  } catch (error: any) {
    console.error("Faucet error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send funds" },
      { status: 500 }
    );
  }
}
