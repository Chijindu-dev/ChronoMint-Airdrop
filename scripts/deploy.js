const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy ChronoToken
  const Token = await hre.ethers.getContractFactory("ChronoToken");
  const initialSupply = 1000000; // 1 million
  const token = await Token.deploy(initialSupply);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("ChronoToken deployed to:", tokenAddress);

  // 2. Deploy ChronoPresale
  const Presale = await hre.ethers.getContractFactory("ChronoPresale");
  const presale = await Presale.deploy(tokenAddress);
  await presale.waitForDeployment();
  const presaleAddress = await presale.getAddress();
  console.log("ChronoPresale deployed to:", presaleAddress);

  // 3. Deploy ChronoAirdrop
  const Airdrop = await hre.ethers.getContractFactory("ChronoAirdrop");
  const airdrop = await Airdrop.deploy(tokenAddress);
  await airdrop.waitForDeployment();
  const airdropAddress = await airdrop.getAddress();
  console.log("ChronoAirdrop deployed to:", airdropAddress);

  // 4. Initial Setup
  // Transfer tokens to contracts for functionality
  const decimals = 18;
  const presaleAmount = hre.ethers.parseUnits("500000", decimals);
  const airdropAmount = hre.ethers.parseUnits("200000", decimals);

  console.log("Transferring tokens to Presale...");
  await token.transfer(presaleAddress, presaleAmount);
  
  console.log("Transferring tokens to Airdrop...");
  await token.transfer(airdropAddress, airdropAmount);

  console.log("Setup complete!");
  
  console.log("\nSummary of Addresses:");
  console.log("--------------------");
  console.log("Token:   ", tokenAddress);
  console.log("Presale: ", presaleAddress);
  console.log("Airdrop: ", airdropAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
