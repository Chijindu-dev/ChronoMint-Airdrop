import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const artifactsDir = path.join(projectRoot, 'artifacts_manual');

// User Provided Key
const PRIVATE_KEY = "0xaa0613a34d04f2ec93ed28997e3dc6d8ef88bc84c4d3a9e3e2e8beee3fd7f790";
const RPC_URL = "https://rpc.testnet.tempo.xyz";

async function main() {
  console.log("Connecting to Tempo Testnet...");
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    name: "tempo",
    chainId: 42429,
    ensAddress: null
  });
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("Deployer:", wallet.address);

  // Helper to load artifact
  const loadArtifact = (name) => {
    return JSON.parse(fs.readFileSync(path.join(artifactsDir, `${name}.json`), 'utf8'));
  };

  try {
    // 1. Deploy ChronoToken
    console.log("\n1. Deploying ChronoToken...");
    const TokenArtifact = loadArtifact("ChronoToken");
    const TokenFactory = new ethers.ContractFactory(TokenArtifact.abi, TokenArtifact.evm.bytecode, wallet);
    const token = await TokenFactory.deploy(1000000); // 1 million initial supply
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("   ✅ ChronoToken:", tokenAddress);

    // 2. Deploy MockUSDC
    console.log("\n2. Deploying MockUSDC...");
    const USDCArtifact = loadArtifact("MockUSDC");
    const USDCFactory = new ethers.ContractFactory(USDCArtifact.abi, USDCArtifact.evm.bytecode, wallet);
    const usdc = await USDCFactory.deploy();
    await usdc.waitForDeployment();
    const usdcAddress = await usdc.getAddress();
    console.log("   ✅ MockUSDC:", usdcAddress);

    // 3. Deploy ChronoPresale (with both token addresses)
    console.log("\n3. Deploying ChronoPresale...");
    const PresaleArtifact = loadArtifact("ChronoPresale");
    const PresaleFactory = new ethers.ContractFactory(PresaleArtifact.abi, PresaleArtifact.evm.bytecode, wallet);
    const presale = await PresaleFactory.deploy(tokenAddress, usdcAddress);
    await presale.waitForDeployment();
    const presaleAddress = await presale.getAddress();
    console.log("   ✅ ChronoPresale:", presaleAddress);

    // 4. Deploy ChronoAirdrop
    console.log("\n4. Deploying ChronoAirdrop...");
    const AirdropArtifact = loadArtifact("ChronoAirdrop");
    const AirdropFactory = new ethers.ContractFactory(AirdropArtifact.abi, AirdropArtifact.evm.bytecode, wallet);
    const airdrop = await AirdropFactory.deploy(tokenAddress);
    await airdrop.waitForDeployment();
    const airdropAddress = await airdrop.getAddress();
    console.log("   ✅ ChronoAirdrop:", airdropAddress);

    // 5. Transfer CHRONO to contracts
    console.log("\n5. Transferring tokens...");
    const decimals = 18n;
    const presaleAmount = 500000n * 10n**decimals;
    const airdropAmount = 200000n * 10n**decimals;

    console.log("   Transferring 500,000 CHRONO to Presale...");
    const tx1 = await token.transfer(presaleAddress, presaleAmount);
    await tx1.wait();

    console.log("   Transferring 200,000 CHRONO to Airdrop...");
    const tx2 = await token.transfer(airdropAddress, airdropAmount);
    await tx2.wait();

    // 6. Mint test USDC to deployer (for testing purchases)
    console.log("\n6. Minting test USDC to deployer...");
    const testUSDCAmount = 10000n * 10n**6n; // 10,000 USDC (6 decimals)
    const tx3 = await usdc.mint(wallet.address, testUSDCAmount);
    await tx3.wait();
    console.log("   ✅ Minted 10,000 USDC to:", wallet.address);

    console.log("\n✅ DEPLOYMENT COMPLETE!");
    console.log("========================");
    console.log("CHRONO_TOKEN:", tokenAddress);
    console.log("PAYMENT_TOKEN:", usdcAddress);
    console.log("PRESALE:", presaleAddress);
    console.log("AIRDROP:", airdropAddress);

    // Save addresses
    fs.writeFileSync(path.join(projectRoot, 'deployed_addresses.json'), JSON.stringify({
      CHRONO_TOKEN: tokenAddress,
      PAYMENT_TOKEN: usdcAddress,
      PRESALE: presaleAddress,
      AIRDROP: airdropAddress
    }, null, 2));

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main();
