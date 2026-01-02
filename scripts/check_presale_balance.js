import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

// Addresses from your deployment
const CONTRACTS = {
  CHRONO: '0xa12ecC1228739e9DbAEf01257968eac0BCbde5DB',
  PRESALE: '0xfDefaF0f9985F092899Fe5278c8b32010b8F3BbC'
};

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const RPC_URL = "https://rpc.testnet.tempo.xyz";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const tokenContract = new ethers.Contract(CONTRACTS.CHRONO, ERC20_ABI, provider);

  console.log("Checking Presale Contract Balance...");
  const balance = await tokenContract.balanceOf(CONTRACTS.PRESALE);
  console.log("Presale Contract Balance:", ethers.formatEther(balance), "CHRONO");
}

main();
