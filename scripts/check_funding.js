import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

const CONTRACTS = {
  CHRONO: '0x23A36bFDb3b11220B69e61FEd63D24876a6459af',
  PRESALE: '0x327a94ffd8E2018e1E9B89EABCf05C9A6bdF11F5'
};

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const RPC_URL = "https://rpc.testnet.tempo.xyz";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
     chainId: 42429, name: 'tempo', ensAddress: null
  });
  
  const tokenContract = new ethers.Contract(CONTRACTS.CHRONO, ERC20_ABI, provider);

  console.log("Checking Presale Funding...");
  console.log("Token:", CONTRACTS.CHRONO);
  console.log("Presale:", CONTRACTS.PRESALE);
  
  try {
      const balance = await tokenContract.balanceOf(CONTRACTS.PRESALE);
      console.log("Balance:", ethers.formatEther(balance));
      
      if (balance == 0n) {
          console.error("CRITICAL: Presale contract has 0 CHRONO!");
      } else {
          console.log("Presale is funded.");
      }
  } catch (e) {
      console.error("Check failed:", e);
  }
}

main();
