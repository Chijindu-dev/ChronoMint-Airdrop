import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

const CONTRACTS = {
  PRESALE: '0xfDefaF0f9985F092899Fe5278c8b32010b8F3BbC'
};

const PRESALE_ABI = [
  "function buyTokens() payable",
  "function totalRaised() view returns (uint256)",
  "function hardCap() view returns (uint256)"
];

const RPC_URL = "https://rpc.testnet.tempo.xyz";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const presaleContract = new ethers.Contract(CONTRACTS.PRESALE, PRESALE_ABI, provider);

  console.log("1. Checking connection & state...");
  try {
    const hardCap = await presaleContract.hardCap();
    console.log("Hard Cap:", ethers.formatEther(hardCap));
  } catch (e) {
    console.error("Failed to read state:", e.message);
    return;
  }

  console.log("2. Simulating Buy 1.0 TEMPO...");
  // We simulate a call. Since buyTokens has no return value, success = empty hex '0x'. 
  // Failure = Revert data.
  
  const amount = ethers.parseEther("1.0");
  
  // Create a minimal transaction object for eth_call
  const tx = {
    to: CONTRACTS.PRESALE,
    from: "0xA5BD203029D8469C227760773A6560376840733E", // Using a likely valid address or random
    value: amount,
    data: presaleContract.interface.encodeFunctionData("buyTokens", [])
  };

  try {
    const result = await provider.call(tx);
    console.log("Simulation Result (Hex):", result);
    if (result === '0x') {
      console.log("SUCCESS: Transaction would succeed.");
    } else {
      console.log("Result is not 0x (likely success with no return, or weird data).");
    }
  } catch (e) {
    console.error("SIMULATION REVERTED!");
    if (e.data) {
        console.error("Revert Data:", e.data);
        try {
            const decoded = presaleContract.interface.parseError(e.data);
            console.error("Decoded Error:", decoded);
        } catch (decodeErr) {
            // Try distinct revert string decoding
            try {
                const reason = ethers.toUtf8String('0x' + e.data.substring(138));
                console.error("Revert Reason String (Guess):", reason);
            } catch (err2) {
                 console.error("Could not decode data.");
            }
        }
    } else {
        console.error("Error Message:", e.message);
    }
  }
}

main();
