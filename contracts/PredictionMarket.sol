// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PredictionMarket {
    struct Market {
        uint256 id;
        string question;
        string description;
        uint256 endTime;
        uint256 totalYesStake;
        uint256 totalNoStake;
        bool resolved;
        bool outcome;
        address creator;
        uint256 createdAt;
        string category;
    }

    struct Prediction {
        uint256 marketId;
        address predictor;
        bool prediction;
        uint256 amount;
        bool claimed;
    }

    mapping(uint256 => Market) public markets;
    mapping(uint256 => Prediction[]) public marketPredictions;
    mapping(address => uint256[]) public userMarkets;
    mapping(address => mapping(uint256 => Prediction)) public userPredictions;
    
    uint256 public marketCount;
    uint256 public constant MIN_STAKE = 0.001 ether;
    uint256 public constant PLATFORM_FEE = 2; // 2%
    
    address public owner;
    uint256 public platformBalance;

    event MarketCreated(
        uint256 indexed marketId,
        string question,
        address indexed creator,
        uint256 endTime
    );
    
    event PredictionPlaced(
        uint256 indexed marketId,
        address indexed predictor,
        bool prediction,
        uint256 amount
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome
    );
    
    event RewardClaimed(
        uint256 indexed marketId,
        address indexed predictor,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMarket(
        string memory _question,
        string memory _description,
        uint256 _duration,
        string memory _category
    ) external returns (uint256) {
        require(_duration > 0, "Duration must be positive");
        require(bytes(_question).length > 0, "Question cannot be empty");
        
        marketCount++;
        uint256 endTime = block.timestamp + _duration;
        
        markets[marketCount] = Market({
            id: marketCount,
            question: _question,
            description: _description,
            endTime: endTime,
            totalYesStake: 0,
            totalNoStake: 0,
            resolved: false,
            outcome: false,
            creator: msg.sender,
            createdAt: block.timestamp,
            category: _category
        });
        
        emit MarketCreated(marketCount, _question, msg.sender, endTime);
        return marketCount;
    }

    function placePrediction(uint256 _marketId, bool _prediction) external payable {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market ID");
        require(msg.value >= MIN_STAKE, "Stake too low");
        
        Market storage market = markets[_marketId];
        require(block.timestamp < market.endTime, "Market has ended");
        require(!market.resolved, "Market already resolved");
        
        // Update or create prediction
        Prediction storage userPred = userPredictions[msg.sender][_marketId];
        
        if (userPred.amount == 0) {
            // New prediction
            userPred.marketId = _marketId;
            userPred.predictor = msg.sender;
            userPred.prediction = _prediction;
            userPred.amount = msg.value;
            userPred.claimed = false;
            
            marketPredictions[_marketId].push(userPred);
            userMarkets[msg.sender].push(_marketId);
        } else {
            // Update existing prediction
            if (userPred.prediction == _prediction) {
                userPred.amount += msg.value;
            } else {
                // Switch prediction
                if (userPred.prediction) {
                    market.totalYesStake -= userPred.amount;
                } else {
                    market.totalNoStake -= userPred.amount;
                }
                userPred.prediction = _prediction;
                userPred.amount = msg.value;
            }
        }
        
        // Update market totals
        if (_prediction) {
            market.totalYesStake += msg.value;
        } else {
            market.totalNoStake += msg.value;
        }
        
        emit PredictionPlaced(_marketId, msg.sender, _prediction, msg.value);
    }

    function resolveMarket(uint256 _marketId, bool _outcome) external {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market ID");
        
        Market storage market = markets[_marketId];
        require(msg.sender == market.creator || msg.sender == owner, "Not authorized");
        require(block.timestamp >= market.endTime, "Market not ended yet");
        require(!market.resolved, "Already resolved");
        
        market.resolved = true;
        market.outcome = _outcome;
        
        emit MarketResolved(_marketId, _outcome);
    }

    function claimReward(uint256 _marketId) external {
        require(_marketId > 0 && _marketId <= marketCount, "Invalid market ID");
        
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved");
        
        Prediction storage userPred = userPredictions[msg.sender][_marketId];
        require(userPred.amount > 0, "No prediction found");
        require(!userPred.claimed, "Already claimed");
        require(userPred.prediction == market.outcome, "Prediction was wrong");
        
        uint256 totalWinningStake = market.outcome ? market.totalYesStake : market.totalNoStake;
        uint256 totalLosingStake = market.outcome ? market.totalNoStake : market.totalYesStake;
        
        // Calculate reward
        uint256 totalPool = totalWinningStake + totalLosingStake;
        uint256 platformFeeAmount = (totalLosingStake * PLATFORM_FEE) / 100;
        uint256 distributionPool = totalLosingStake - platformFeeAmount;
        
        uint256 userShare = (userPred.amount * distributionPool) / totalWinningStake;
        uint256 totalReward = userPred.amount + userShare;
        
        userPred.claimed = true;
        platformBalance += platformFeeAmount;
        
        (bool success, ) = payable(msg.sender).call{value: totalReward}("");
        require(success, "Transfer failed");
        
        emit RewardClaimed(_marketId, msg.sender, totalReward);
    }

    function getMarket(uint256 _marketId) external view returns (Market memory) {
        return markets[_marketId];
    }

    function getUserPrediction(address _user, uint256 _marketId) 
        external 
        view 
        returns (Prediction memory) 
    {
        return userPredictions[_user][_marketId];
    }

    function getUserMarkets(address _user) external view returns (uint256[] memory) {
        return userMarkets[_user];
    }

    function getMarketPredictions(uint256 _marketId) 
        external 
        view 
        returns (Prediction[] memory) 
    {
        return marketPredictions[_marketId];
    }

    function withdrawPlatformFees() external onlyOwner {
        uint256 amount = platformBalance;
        platformBalance = 0;
        
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function getMarketOdds(uint256 _marketId) 
        external 
        view 
        returns (uint256 yesOdds, uint256 noOdds) 
    {
        Market storage market = markets[_marketId];
        uint256 total = market.totalYesStake + market.totalNoStake;
        
        if (total == 0) {
            return (50, 50);
        }
        
        yesOdds = (market.totalYesStake * 100) / total;
        noOdds = (market.totalNoStake * 100) / total;
        
        return (yesOdds, noOdds);
    }
}
