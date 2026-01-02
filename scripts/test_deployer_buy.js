import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

// DEPLOYER's key (the account that deployed the contract)
const DEPLOYER_KEY = "0xaa0613a34d04f2ec93ed28997e3dc6d8ef88bc84c4d3a9e3e2e8beee3fd7f790";
const RPC_URL = "https://rpc.testnet.tempo.xyz";
const PRESALE_ADDR = '0x327a94ffd8E2018e1E9B89EABCf05C9A6bdF11F5';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    name: "tempo",
    chainId: 42429,
    ensAddress: null
  });
  
  const deployer = new ethers.Wallet(DEPLOYER_KEY, provider);
  console.log("Deployer Address:", deployer.address);
  
  const abi = ["function buyTokens() payable"];
  const presale = new ethers.Contract(PRESALE_ADDR, abi, deployer);
  
  console.log("\nAttempting buyTokens from DEPLOYER account...");
  console.log("Amount: 0.001 TEMPO");
  
  try {
    const tx = await presale.buyTokens({
      value: ethers.parseEther("0.001"),
      gasLimit: 500000
    });
    
    console.log("✅ TX SENT:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ CONFIRMED in block:", receipt.blockNumber);
    
  } catch (err) {
    console.error("❌ FAILED:", err.code || err.message);
    console.error("Full error:", err);
  }
}

main();
