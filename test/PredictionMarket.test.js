const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket", function () {
  let PredictionMarket;
  let predictionMarket;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    predictionMarket = await PredictionMarket.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await predictionMarket.owner()).to.equal(owner.address);
    });

    it("Should start with 0 markets", async function () {
      expect(await predictionMarket.marketCount()).to.equal(0);
    });
  });

  describe("Market Creation", function () {
    it("Should create a new market", async function () {
      await predictionMarket.createMarket(
        "Will ETH hit 10k?",
        "Price prediction",
        86400, // 1 day
        "Crypto"
      );

      const market = await predictionMarket.markets(1);
      expect(market.question).to.equal("Will ETH hit 10k?");
      expect(market.id).to.equal(1);
      expect(market.category).to.equal("Crypto");
    });
  });

  describe("Prediction", function () {
    beforeEach(async function () {
      await predictionMarket.createMarket(
        "Will ETH hit 10k?",
        "Price prediction",
        86400,
        "Crypto"
      );
    });

    it("Should accept predictions", async function () {
      await predictionMarket
        .connect(addr1)
        .placePrediction(1, true, { value: ethers.parseEther("1.0") });
      const market = await predictionMarket.markets(1);
      expect(market.totalYesStake).to.equal(ethers.parseEther("1.0"));
    });

    it("Should fail if stake is too low", async function () {
      await expect(
        predictionMarket.connect(addr1).placePrediction(1, true, { value: 100 })
      ).to.be.revertedWith("Stake too low");
    });
  });
});
