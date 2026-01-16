import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import {
  hardhat,
  sepolia,
  holesky,
  mainnet,
  polygon,
  arbitrum,
} from "viem/chains";
import { PREDICTION_MARKET_ABI } from "@/config/abi";
import { getContractAddress } from "@/config/web3";

const clients: Record<number, any> = {
  [hardhat.id]: createPublicClient({
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  }),
  [sepolia.id]: createPublicClient({
    chain: sepolia,
    transport: http(),
  }),
  [holesky.id]: createPublicClient({
    chain: holesky,
    transport: http(),
  }),
  [mainnet.id]: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  [polygon.id]: createPublicClient({
    chain: polygon,
    transport: http(),
  }),
  [arbitrum.id]: createPublicClient({
    chain: arbitrum,
    transport: http(),
  }),
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const marketId = parseInt(params.id);
    const searchParams = request.nextUrl.searchParams;
    const chainIdParam = searchParams.get("chainId");
    const chainId = chainIdParam ? parseInt(chainIdParam) : hardhat.id;

    const client = clients[chainId] || clients[hardhat.id];
    const address = getContractAddress(chainId);

    const market = await client.readContract({
      address: address as `0x${string}`,
      abi: PREDICTION_MARKET_ABI,
      functionName: "getMarket",
      args: [BigInt(marketId)],
    });

    // Fix serialization for BigInt
    const serializeBigInt = (key: string, value: any) =>
      typeof value === "bigint" ? value.toString() : value;

    const jsonString = JSON.stringify(market, serializeBigInt);
    const marketData = JSON.parse(jsonString);

    return NextResponse.json(marketData);
  } catch (error) {
    console.error("Error fetching market:", error);
    return NextResponse.json({ error: "Market not found" }, { status: 404 });
  }
}
