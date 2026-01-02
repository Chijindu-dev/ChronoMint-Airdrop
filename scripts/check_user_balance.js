import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

// User's private key (from chat history) to derive address
const PRIVATE_KEY = "0xaa0613a34d04f2ec93ed28997e3dc6d8ef88bc84c4d3a9e3e2e8beee3fd7f790";
const RPC_URL = "https://rpc.testnet.tempo.xyz";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Checking User Wallet Balance...");
  console.log("Address:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("Native Balance:", ethers.formatEther(balance), "TEMPO");
}

main();
