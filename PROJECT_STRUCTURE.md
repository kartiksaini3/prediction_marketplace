# Project Structure

```
test_project/
├── contracts/                      # Smart Contracts
│   └── PredictionMarket.sol       # Main prediction market contract
│
├── scripts/                        # Deployment Scripts
│   └── deploy.js                  # Hardhat deployment script
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API Routes
│   │   │   └── market/[id]/
│   │   │       └── route.ts       # Market data API endpoint
│   │   │
│   │   ├── create/                # Create Market Page
│   │   │   └── page.tsx
│   │   │
│   │   ├── market/[id]/           # Market Detail Page
│   │   │   └── page.tsx
│   │   │
│   │   ├── my-predictions/        # User Predictions Page
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css            # Global styles with design system
│   │   ├── layout.tsx             # Root layout with providers
│   │   ├── page.tsx               # Home page (markets list)
│   │   └── providers.tsx          # Web3 providers wrapper
│   │
│   ├── components/                # React Components
│   │   ├── Header.tsx             # Navigation header
│   │   ├── MarketCard.tsx         # Market card component
│   │   ├── PredictionForm.tsx     # Prediction placement form
│   │   └── WalletConnect.tsx      # Wallet connection button
│   │
│   ├── config/                    # Configuration
│   │   ├── abi.ts                 # Smart contract ABI
│   │   └── web3.ts                # Web3 configuration (Wagmi)
│   │
│   ├── hooks/                     # Custom React Hooks
│   │   └── useContract.ts         # Contract interaction hooks
│   │
│   └── types/                     # TypeScript Types
│       └── index.ts               # Type definitions
│
├── public/                        # Static Assets
│   └── *.svg                      # SVG icons
│
├── .gitignore                     # Git ignore rules
├── env.example                    # Environment variables template
├── eslint.config.mjs              # ESLint configuration
├── hardhat.config.js              # Hardhat configuration
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies
├── postcss.config.mjs             # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
├── README.md                      # Main documentation
└── QUICKSTART.md                  # Quick start guide
```

## Key Files Explained

### Smart Contract

- **`contracts/PredictionMarket.sol`**: Solidity smart contract implementing the prediction market logic

### Frontend Pages

- **`src/app/page.tsx`**: Home page showing all markets with filters
- **`src/app/create/page.tsx`**: Form to create new prediction markets
- **`src/app/market/[id]/page.tsx`**: Detailed view of a single market
- **`src/app/my-predictions/page.tsx`**: User's prediction history

### Components

- **`Header.tsx`**: Navigation bar with wallet connection
- **`MarketCard.tsx`**: Reusable market display card
- **`PredictionForm.tsx`**: Form for placing predictions
- **`WalletConnect.tsx`**: Wallet connection UI

### Configuration

- **`config/web3.ts`**: Wagmi configuration for Web3 connections
- **`config/abi.ts`**: Contract ABI for frontend interaction
- **`hooks/useContract.ts`**: Custom hooks for contract functions

### Styling

- **`globals.css`**: Complete design system with:
  - CSS custom properties
  - Glassmorphism effects
  - Gradient utilities
  - Animation keyframes
  - Responsive utilities

## Design System

### Colors

- Primary: Indigo (#6366f1)
- Secondary: Pink (#ec4899)
- Accent: Teal (#14b8a6)
- Background: Dark theme (#0a0a0f)

### Components

- Glass cards with backdrop blur
- Gradient buttons and text
- Smooth animations and transitions
- Responsive grid layouts

### Typography

- Font: Inter (Google Fonts)
- Weights: 300-900
- Optimized for readability

## Technology Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **State**: React Query

### Web3

- **Library**: Wagmi + Viem
- **Wallets**: MetaMask, WalletConnect
- **Networks**: Ethereum, Polygon, Arbitrum, Sepolia

### Smart Contracts

- **Language**: Solidity 0.8.20
- **Framework**: Hardhat
- **Testing**: Hardhat Toolbox

## Features Implemented

✅ Create prediction markets
✅ Place predictions (YES/NO)
✅ Real-time odds calculation
✅ Market resolution
✅ Reward claiming
✅ User prediction tracking
✅ Wallet connection
✅ Responsive design
✅ Modern UI with animations
✅ Category filtering
✅ Time-based market expiration
✅ Platform fee system (2%)
✅ Minimum stake enforcement

## API Routes

- `GET /api/market/[id]`: Fetch market data from blockchain

## Environment Variables

Required:

- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Deployed contract address
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID

## Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Smart Contract Functions

### Write Functions

- `createMarket(question, description, duration, category)`
- `placePrediction(marketId, prediction, amount)`
- `resolveMarket(marketId, outcome)`
- `claimReward(marketId)`

### Read Functions

- `getMarket(marketId)`
- `getMarketOdds(marketId)`
- `getUserPrediction(user, marketId)`
- `marketCount()`
