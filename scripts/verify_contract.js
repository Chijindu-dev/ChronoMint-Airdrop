import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

const PRESALE_ADDR = '0x327a94ffd8E2018e1E9B89EABCf05C9A6bdF11F5';
const RPC_URL = "https://rpc.testnet.tempo.xyz";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    name: "tempo",
    chainId: 42429,
    ensAddress: null
  });

  console.log("Checking Presale Contract:", PRESALE_ADDR);
  
  // 1. Check if it's a contract (has code)
  const code = await provider.getCode(PRESALE_ADDR);
  console.log("Has contract code?", code !== "0x");
  console.log("Code length:", code.length);
  
  if (code === "0x") {
    console.error("❌ NO CONTRACT AT THIS ADDRESS!");
    return;
  }
  
  // 2. Try to call view functions
  const abi = [
    "function rate() view returns (uint256)",
    "function hardCap() view returns (uint256)",
    "function totalRaised() view returns (uint256)",
    "function token() view returns (address)"
  ];
  
  const presale = new ethers.Contract(PRESALE_ADDR, abi, provider);
  
  try {
    const rate = await presale.rate();
    const hardCap = await presale.hardCap();
    const totalRaised = await presale.totalRaised();
    const tokenAddr = await presale.token();
    
    console.log("\n✅ Contract State:");
    console.log("Rate:", rate.toString());
    console.log("Hard Cap:", ethers.formatEther(hardCap), "TEMPO");
    console.log("Total Raised:", ethers.formatEther(totalRaised), "TEMPO");
    console.log("Token Address:", tokenAddr);
  } catch (err) {
    console.error("❌ Failed to read contract:", err.message);
  }
}

main();
