import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

// User Provided Key
const PRIVATE_KEY = "0xaa0613a34d04f2ec93ed28997e3dc6d8ef88bc84c4d3a9e3e2e8beee3fd7f790";
const RPC_URL = "https://rpc.testnet.tempo.xyz";
const PRESALE_ADDR = '0x327a94ffd8E2018e1E9B89EABCf05C9A6bdF11F5';

async function main() {
  // Manual Network Construction
  const network = new ethers.Network("tempo", 42429);
  network.ensAddress = null;

  const provider = new ethers.JsonRpcProvider(RPC_URL, network, { staticNetwork: true });
  provider.resolveName = async (name) => name; // Monkey patch to force disable ENS
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Testing Raw Transaction...");

  // construct data for buyTokens() signature '0xd96a094a'
  const data = "0xd96a094a"; 

  const tx = {
    to: PRESALE_ADDR,
    value: ethers.parseEther("0.001"),
    data: data,
    gasLimit: 500000
  };

  try {
    const response = await wallet.sendTransaction(tx);
    console.log("Tx Hash:", response.hash);
    await response.wait();
    console.log("Success!");
  } catch (e) {
    console.error("Raw Tx Failed:", e);
  }
}

main();
