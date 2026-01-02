import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

const PRIVATE_KEY = "0xaa0613a34d04f2ec93ed28997e3dc6d8ef88bc84c4d3a9e3e2e8beee3fd7f790";
const RPC_URL = "https://rpc.testnet.tempo.xyz";
const AIRDROP_ADDR = '0x947f6b21F7C35BF7493273e5C104792664D428D9';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    name: "tempo",
    chainId: 42429,
    ensAddress: null
  });
  
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("Using wallet:", wallet.address);

  const airdropAbi = [
    "function setEligibility(address[] memory accounts, bool status) external",
    "function isEligible(address) view returns (bool)"
  ];

  const airdrop = new ethers.Contract(AIRDROP_ADDR, airdropAbi, wallet);

  console.log("Setting eligibility for:", wallet.address);
  
  const tx = await airdrop.setEligibility([wallet.address], true, { gasLimit: 200000 });
  console.log("Transaction sent:", tx.hash);
  await tx.wait();
  
  const isEligible = await airdrop.isEligible(wallet.address);
  console.log("Is Eligible now?", isEligible);
}

main().catch(console.error);
