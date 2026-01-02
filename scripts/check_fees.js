import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

const RPC_URL = "https://rpc.testnet.tempo.xyz";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    name: "tempo",
    chainId: 42429,
    ensAddress: null
  });

  console.log("Fetching Fee Data...");
  const feeData = await provider.getFeeData();
  
  console.log("Gas Price:", feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") + " gwei" : "null");
  console.log("Max Fee Per Gas:", feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, "gwei") + " gwei" : "null");
  console.log("Max Priority Fee:", feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei") + " gwei" : "null");
}

main();
