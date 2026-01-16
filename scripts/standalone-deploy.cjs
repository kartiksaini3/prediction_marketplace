const fs = require("fs");
const path = require("path");
const solc = require("solc");
const {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
} = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { hardhat } = require("viem/chains");

async function main() {
  console.log("Compiling contract...");
  const contractPath = path.resolve(
    __dirname,
    "../contracts/PredictionMarket.sol"
  );
  const source = fs.readFileSync(contractPath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "PredictionMarket.sol": {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const hasError = output.errors.some((e) => e.severity === "error");
    if (hasError) {
      console.error("Compilation errors:", output.errors);
      return;
    } else {
      console.log(
        "Compilation warnings:",
        output.errors.map((e) => e.message)
      );
    }
  }

  if (!output.contracts || !output.contracts["PredictionMarket.sol"]) {
    console.error(
      "No contracts found in output. Full output keys:",
      Object.keys(output)
    );
    return;
  }

  const contractFile =
    output.contracts["PredictionMarket.sol"]["PredictionMarket"];

  const bytecode = contractFile.evm.bytecode.object;
  const abi = contractFile.abi;

  console.log("Contract compiled successfully.");

  // Ganache default private key (Account 0)
  const PRIVATE_KEY =
    "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d";
  const account = privateKeyToAccount(PRIVATE_KEY);

  const client = createWalletClient({
    account,
    chain: hardhat, // Ganache is compatible with hardhat chain def (chainId 31337)
    transport: http("http://127.0.0.1:8545"),
  });

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  });

  console.log("Deploying contract...");
  const hash = await client.deployContract({
    abi,
    bytecode: `0x${bytecode}`,
  });

  console.log("Transaction hash:", hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (!receipt.contractAddress) {
    console.error("Deployment failed.");
    return;
  }

  const address = receipt.contractAddress;
  console.log("Contract deployed to:", address);

  // Initialize sample markets
  console.log("Creating sample markets...");

  const markets = [
    {
      question: "Will Bitcoin reach $100,000 by end of 2024?",
      description:
        "Market resolves to YES if BTC price exceeds $100k on CoinGecko.",
      duration: 30 * 24 * 60 * 60, // 30 days
      category: "Crypto",
    },
    {
      question: "Will Ethereum upgrades reduce gas fees below 10 gwei?",
      description: "Resolves if average gas fee is < 10 gwei for 1 week.",
      duration: 14 * 24 * 60 * 60, // 14 days
      category: "Technology",
    },
    {
      question: "Who will win the 2024 US Presidential Election?",
      description: "Prediction market for the upcoming election.",
      duration: 60 * 24 * 60 * 60, // 60 days
      category: "Politics",
    },
  ];

  for (const m of markets) {
    const hash = await client.writeContract({
      address,
      abi,
      functionName: "createMarket",
      args: [m.question, m.description, BigInt(m.duration), m.category],
    });
    console.log(`Created market: "${m.question}" (tx: ${hash})`);
  }

  console.log("\nDeployment Complete!");
  console.log("----------------------------------------------------");
  console.log(`NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS=${address}`);
  console.log("----------------------------------------------------");

  // Try to update .env.local automatically
  const envPath = path.resolve(__dirname, "../.env.local");
  let envContent = "";
  try {
    envContent = fs.readFileSync(envPath, "utf8");
  } catch (e) {
    // file mostly likely doesn't exist or we can't read it
  }

  // Replace or append
  const key = "NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS=";
  const newLine = `${key}${address}`;

  if (envContent.includes(key)) {
    const regex = new RegExp(`${key}.*`, "g");
    envContent = envContent.replace(regex, newLine);
  } else {
    envContent += `\n${newLine}`;
  }

  // Also update global default if missing
  if (!envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
    envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}`;
  } else {
    // Optional: update default too if you want
    // envContent = envContent.replace(/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/g, `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  }

  // Write back
  fs.writeFileSync(envPath, envContent);
  console.log("Updated .env.local with new address.");
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
