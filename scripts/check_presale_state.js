import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

const CONTRACTS = {
  CHRONO: '0xa12ecC1228739e9DbAEf01257968eac0BCbde5DB',
  PRESALE: '0xfDefaF0f9985F092899Fe5278c8b32010b8F3BbC'
};

const PRESALE_ABI = [
  "function token() view returns (address)",
  "function rate() view returns (uint256)",
  "function hardCap() view returns (uint256)",
  "function totalRaised() view returns (uint256)"
];

const RPC_URL = "https://rpc.testnet.tempo.xyz";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const presaleContract = new ethers.Contract(CONTRACTS.PRESALE, PRESALE_ABI, provider);

  console.log("Checking Presale Contract State...");
  const tokenAddress = await presaleContract.token();
  const rate = await presaleContract.rate();
  const hardCap = await presaleContract.hardCap();
  const totalRaised = await presaleContract.totalRaised();

  console.log("Stored Token Address:", tokenAddress);
  console.log("Expected Token Address:", CONTRACTS.CHRONO);
  console.log("Match:", tokenAddress.toLowerCase() === CONTRACTS.CHRONO.toLowerCase());
  console.log("Rate:", rate.toString());
  console.log("Hard Cap:", ethers.formatEther(hardCap));
  console.log("Total Raised:", ethers.formatEther(totalRaised));
}

main();
