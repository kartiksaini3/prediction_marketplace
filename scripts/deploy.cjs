const hre = require("hardhat");

async function main() {
  console.log("Deploying PredictionMarket contract...");

  const PredictionMarket = await hre.ethers.getContractFactory(
    "PredictionMarket"
  );
  const predictionMarket = await PredictionMarket.deploy();

  await predictionMarket.waitForDeployment();

  const address = await predictionMarket.getAddress();

  console.log("PredictionMarket deployed to:", address);
  console.log("\nAdd this to your .env.local file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);

  // Create some sample markets for testing
  console.log("\nCreating sample markets...");

  const sampleMarkets = [
    {
      question: "Will Bitcoin reach $100,000 by end of 2024?",
      description:
        "This market will resolve to YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange by December 31, 2024, 23:59:59 UTC.",
      duration: 7 * 24 * 60 * 60, // 7 days
      category: "Crypto",
    },
    {
      question: "Will Ethereum upgrade to Proof of Stake 2.0 in 2024?",
      description:
        "This market resolves to YES if Ethereum successfully completes its transition to Proof of Stake 2.0 by December 31, 2024.",
      duration: 14 * 24 * 60 * 60, // 14 days
      category: "Crypto",
    },
    {
      question: "Will AI surpass human performance in coding by 2025?",
      description:
        "This market will resolve to YES if any AI system can demonstrably outperform the average human programmer in standardized coding tests by January 1, 2025.",
      duration: 30 * 24 * 60 * 60, // 30 days
      category: "Technology",
    },
  ];

  for (const market of sampleMarkets) {
    const tx = await predictionMarket.createMarket(
      market.question,
      market.description,
      market.duration,
      market.category
    );
    await tx.wait();
    console.log(`✓ Created market: ${market.question.substring(0, 50)}...`);
  }

  console.log("\n✅ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
