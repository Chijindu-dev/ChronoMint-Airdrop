import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

// User Address
const USER_ADDRESS = "0x07D0AC0BA7EAba71d2Ed89c46b6958b833Af26CB";
const RPC_URL = "https://rpc.testnet.tempo.xyz";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    name: "tempo",
    chainId: 42429,
    ensAddress: null
  });

  console.log("Checking Nonce for:", USER_ADDRESS);
  const nonce = await provider.getTransactionCount(USER_ADDRESS);
  console.log("Current On-Chain Nonce:", nonce);
}

main();
