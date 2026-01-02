const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChronoMint Ecosystem", function () {
  let Token, Presale, Airdrop;
  let token, presale, airdrop;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy Token
    Token = await ethers.getContractFactory("ChronoToken");
    token = await Token.deploy(1000000); // 1M Supply
    await token.waitForDeployment();

    // Deploy Presale
    Presale = await ethers.getContractFactory("ChronoPresale");
    presale = await Presale.deploy(await token.getAddress());
    await presale.waitForDeployment();

    // Deploy Airdrop
    Airdrop = await ethers.getContractFactory("ChronoAirdrop");
    airdrop = await Airdrop.deploy(await token.getAddress());
    await airdrop.waitForDeployment();

    // Transfer tokens to Presale and Airdrop contracts
    await token.transfer(await presale.getAddress(), ethers.parseEther("500000"));
    await token.transfer(await airdrop.getAddress(), ethers.parseEther("100000"));
  });

  describe("ChronoToken", function () {
    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("ChronoMint");
      expect(await token.symbol()).to.equal("CHRONO");
    });

    it("Should assign initial supply to owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      // Owner balance should be 1M - (500k + 100k) transferred to other contracts
      expect(ownerBalance).to.equal(ethers.parseEther("400000"));
    });
  });

  describe("ChronoPresale", function () {
    it("Should allow buying tokens", async function () {
      const buyAmount = ethers.parseEther("1"); // 1 TEMPO
      await presale.connect(addr1).buyTokens({ value: buyAmount });

      expect(await presale.totalRaised()).to.equal(buyAmount);
      // Rate is 100
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));
    });

    it("Should fail if hardcap reached", async function () {
      // Set rate to a small value or hardcap to a small value for testing
      // For now, try to buy more than hardcap estimate
      const hugeAmount = ethers.parseEther("10001");
      await expect(presale.connect(addr1).buyTokens({ value: hugeAmount })).to.be.revertedWith("Hardcap reached");
    });
  });

  describe("ChronoAirdrop", function () {
    it("Should allow eligible users to claim", async function () {
      await airdrop.setEligibility([addr1.address], true);
      
      await airdrop.connect(addr1).claim();
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("1250"));
      expect(await airdrop.hasClaimed(addr1.address)).to.be.true;
    });

    it("Should fail if user not eligible", async function () {
      await expect(airdrop.connect(addr2).claim()).to.be.revertedWith("Not eligible for airdrop");
    });

    it("Should prevent double claim", async function () {
      await airdrop.setEligibility([addr1.address], true);
      await airdrop.connect(addr1).claim();
      await expect(airdrop.connect(addr1).claim()).to.be.revertedWith("Airdrop already claimed");
    });
  });
});
