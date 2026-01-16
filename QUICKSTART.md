# Quick Start Guide - PredictChain

## Prerequisites

- Node.js >= 20.9.0
- npm or yarn
- MetaMask or another Web3 wallet

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. Deploy Smart Contract (Local Development)

#### Option A: Using Hardhat (Recommended)

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Start local blockchain
npx hardhat node

# In another terminal, deploy the contract
npx hardhat run scripts/deploy.js --network localhost

# Copy the contract address from the output to .env.local
```

#### Option B: Using Remix IDE

1. Go to https://remix.ethereum.org/
2. Create new file `PredictionMarket.sol`
3. Copy contents from `contracts/PredictionMarket.sol`
4. Compile with Solidity 0.8.20
5. Deploy to Sepolia testnet or local network
6. Copy contract address to `.env.local`

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Connect Your Wallet

1. Click "Connect Wallet" in the top right
2. Select your wallet provider (MetaMask, WalletConnect, etc.)
3. Approve the connection

### 6. Start Using the App!

- **Browse Markets**: View all available prediction markets on the home page
- **Create Market**: Click "Create Market" to create a new prediction market
- **Place Predictions**: Click on any market to view details and place your prediction
- **Track Predictions**: Go to "My Predictions" to see your active bets
- **Claim Rewards**: After a market resolves, claim your winnings if you predicted correctly

## Testing with Sample Data

The deployment script automatically creates 3 sample markets:

1. Bitcoin price prediction
2. Ethereum upgrade prediction
3. AI coding performance prediction

You can place test predictions on these markets to try out the functionality.

## Troubleshooting

### Wallet Connection Issues

- Make sure MetaMask is installed and unlocked
- Check that you're on the correct network (localhost:8545 for local development)
- Try refreshing the page

### Contract Not Found

- Verify the contract address in `.env.local` is correct
- Make sure the local blockchain is running (if using Hardhat)
- Check that you're connected to the right network

### Transaction Failures

- Ensure you have enough ETH in your wallet for gas fees
- Check that the market hasn't ended or been resolved
- Verify you're meeting the minimum stake requirement (0.001 ETH)

## Network Configuration

### Local Development (Hardhat)

- Network: Hardhat
- Chain ID: 31337
- RPC URL: http://127.0.0.1:8545

### Sepolia Testnet

- Network: Sepolia
- Chain ID: 11155111
- Get test ETH: https://sepoliafaucet.com/

## Next Steps

1. **Customize Markets**: Create your own prediction markets
2. **Invite Friends**: Share market links with others
3. **Resolve Markets**: If you created a market, resolve it after the end time
4. **Claim Rewards**: Collect your winnings from successful predictions

## Support

For issues or questions:

- Check the main README.md
- Review the smart contract code in `contracts/PredictionMarket.sol`
- Inspect the browser console for error messages

Happy predicting! 🔮
