# PredictChain - Decentralized Prediction Marketplace

A fully functional decentralized prediction marketplace built with Next.js, Web3, and smart contracts. Users can create prediction markets, place bets on outcomes, and claim rewards—all powered by blockchain technology.

## 🚀 Features

- **🔮 Create Prediction Markets**: Anyone can create markets for future events
- **💰 Place Predictions**: Bet on YES or NO outcomes with cryptocurrency
- **📊 Real-time Odds**: Dynamic odds based on total stakes
- **🏆 Claim Rewards**: Winners can claim their rewards after market resolution
- **🎨 Modern UI**: Beautiful, responsive design with glassmorphism and animations
- **🔐 Web3 Integration**: Full wallet connection support (MetaMask, WalletConnect, etc.)
- **⛓️ Smart Contracts**: Decentralized, trustless architecture on Ethereum

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS, Custom CSS with glassmorphism
- **Web3**: Wagmi, Viem, Ethers.js
- **Smart Contracts**: Solidity
- **State Management**: React Query

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd test_project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Edit `.env.local` and add:

   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: Your deployed contract address
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID

## 🔧 Smart Contract Deployment

### Using Hardhat (Local Development)

1. **Install Hardhat**

   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

2. **Initialize Hardhat**

   ```bash
   npx hardhat init
   ```

3. **Copy the smart contract**
   Copy `contracts/PredictionMarket.sol` to your Hardhat `contracts/` directory

4. **Deploy locally**

   ```bash
   npx hardhat node
   ```

   In another terminal:

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. **Update the contract address**
   Copy the deployed contract address to `.env.local`

### Using Remix (Quick Testing)

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `PredictionMarket.sol`
3. Copy the contract code from `contracts/PredictionMarket.sol`
4. Compile with Solidity 0.8.20
5. Deploy to your preferred network (Sepolia, Mumbai, etc.)
6. Copy the contract address to `.env.local`

## 🚀 Running the Application

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Connect your wallet**
   Click "Connect Wallet" and select your preferred wallet

4. **Start using the app!**
   - Create prediction markets
   - Place predictions on existing markets
   - Resolve markets (if you're the creator)
   - Claim rewards

## 📱 Pages

- **Home (`/`)**: Browse all prediction markets with filters
- **Create Market (`/create`)**: Create a new prediction market
- **Market Detail (`/market/[id]`)**: View market details and place predictions
- **My Predictions (`/my-predictions`)**: Track your predictions and claim rewards

## 🎨 Design Features

- **Glassmorphism**: Modern glass-like UI elements
- **Gradient Backgrounds**: Vibrant color schemes
- **Smooth Animations**: Fade-in, slide-in, and hover effects
- **Responsive Design**: Works on all device sizes
- **Dark Theme**: Eye-friendly dark mode by default
- **Custom Scrollbar**: Styled scrollbars matching the theme

## 🔐 Smart Contract Functions

### For Users

- `createMarket()`: Create a new prediction market
- `placePrediction()`: Place a bet on a market
- `claimReward()`: Claim winnings after market resolution

### For Market Creators

- `resolveMarket()`: Resolve a market with the final outcome

### View Functions

- `getMarket()`: Get market details
- `getMarketOdds()`: Get current odds
- `getUserPrediction()`: Get user's prediction for a market
- `marketCount`: Total number of markets

## 🔒 Security Features

- **Platform Fee**: 2% fee on losing stakes
- **Minimum Stake**: 0.001 ETH minimum bet
- **Time-locked Resolution**: Markets can only be resolved after end time
- **Claim Protection**: Users can only claim if they predicted correctly
- **Creator Authorization**: Only creators can resolve their markets

## 🌐 Supported Networks

- Ethereum Mainnet
- Sepolia Testnet
- Polygon
- Arbitrum
- Local Hardhat Network

## 📝 Environment Variables

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Your deployed contract address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=... # WalletConnect project ID
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Wagmi for Web3 React hooks
- Tailwind CSS for styling utilities
- The Ethereum community

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and Web3**
