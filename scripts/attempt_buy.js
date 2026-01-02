import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

// User Provided Key
const PRIVATE_KEY = "0xaa0613a34d04f2ec93ed28997e3dc6d8ef88bc84c4d3a9e3e2e8beee3fd7f790";
const RPC_URL = "https://rpc.testnet.tempo.xyz";

const CONTRACTS = {
  PRESALE: '0x327a94ffd8E2018e1E9B89EABCf05C9A6bdF11F5'
};

const PRESALE_ABI = [
  "function buyTokens() payable"
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    name: "tempo",
    chainId: 42429,
    ensAddress: null
  });
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("Using Wallet:", wallet.address);

  const presaleContract = new ethers.Contract(CONTRACTS.PRESALE, PRESALE_ABI, wallet);

  console.log("Attempting to buy 0.001 TEMPO worth of tokens...");
  
  try {
    const tx = await presaleContract.buyTokens({ 
      value: ethers.parseEther("0.001"),
      gasLimit: 500000 
    });
    console.log("Transaction Sent:", tx.hash);
    console.log("Waiting for confirmation...");
    await tx.wait();
    console.log("SUCCESS! Purchase confirmed.");
  } catch (error) {
    console.error("PURCHASE FAILED!");
    console.error(error);
  }
}

main();
