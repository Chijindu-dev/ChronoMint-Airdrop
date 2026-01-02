import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

// User Provided Key
const PRIVATE_KEY = "0xaa0613a34d04f2ec93ed28997e3dc6d8ef88bc84c4d3a9e3e2e8beee3fd7f790";
const RPC_URL = "https://rpc.testnet.tempo.xyz";
const PRESALE_ADDR = '0x327a94ffd8E2018e1E9B89EABCf05C9A6bdF11F5';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    chainId: 42429, name: 'tempo', ensAddress: null
  });
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Define minimal ABI
  const abi = [
    "function buyTokens() payable",
    "error InsufficientTokensInContract()", // Guessing common errors
    "error HardCapReached()",
    "error InvalidAmount()"
  ];
  
  const presale = new ethers.Contract(PRESALE_ADDR, abi, wallet);

  console.log("Simulating purchase of 0.001 TEMPO...");

  try {
    // We use .callStatic or provider.call to simulate
    // But Ethers v6 uses .staticCall
    await presale.buyTokens.staticCall({ value: ethers.parseEther("0.001") });
    console.log("Simulation SUCCESS! Transaction should work.");
  } catch (error) {
    console.log("Simulation REVERTED!");
    if (error.data) {
        console.log("Revert Data:", error.data);
        // Try to decode common strings
        try {
            const reason = ethers.toUtf8String('0x' + error.data.substring(138)); 
            console.log("Revert Reason (String):", reason);
        } catch {
             console.log("Could not decode string reason.");
        }
    } else {
        console.log("Error Message:", error.message);
    }
  }
}

main();
