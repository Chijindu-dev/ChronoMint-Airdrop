import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

const PRIVATE_KEY = "0xaa0613a34d04f2ec93ed28997e3dc6d8ef88bc84c4d3a9e3e2e8beee3fd7f790";
const RPC_URL = "https://rpc.testnet.tempo.xyz";

const USDC_ADDR = '0x4099D7Ef2DfCBe08bdcc5Da2030012179FCe443e';
const PRESALE_ADDR = '0x4C5C3480819F28fF498D3172DeEe5304504e8B74';
const CHRONO_ADDR = '0x9f0f49a9BFa2bc0419b5A60a1ABBbFe0833B7f39';

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    name: "tempo",
    chainId: 42429,
    ensAddress: null
  });
  
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("Testing with wallet:", wallet.address);

  // ABIs
  const usdcAbi = ["function balanceOf(address) view returns (uint256)", "function approve(address,uint256) returns (bool)", "function allowance(address,address) view returns (uint256)"];
  const presaleAbi = ["function buyTokens(uint256)"];
  const chronoAbi = ["function balanceOf(address) view returns (uint256)"];

  const usdc = new ethers.Contract(USDC_ADDR, usdcAbi, wallet);
  const presale = new ethers.Contract(PRESALE_ADDR, presaleAbi, wallet);
  const chrono = new ethers.Contract(CHRONO_ADDR, chronoAbi, provider);

  // Step 1: Check USDC balance
  console.log("\n1. Checking USDC balance...");
  const usdcBalance = await usdc.balanceOf(wallet.address);
  console.log("   USDC Balance:", ethers.formatUnits(usdcBalance, 6), "USDC");

  if (usdcBalance === 0n) {
    console.error("   ❌ No USDC! Need to mint some first.");
    return;
  }

  // Step 2: Check allowance
  console.log("\n2. Checking current allowance...");
  const currentAllowance = await usdc.allowance(wallet.address, PRESALE_ADDR);
  console.log("   Current Allowance:", ethers.formatUnits(currentAllowance, 6), "USDC");

  // Step 3: Approve 1 USDC
  const amount = ethers.parseUnits("1", 6); // 1 USDC
  console.log("\n3. Approving 1 USDC...");
  const approveTx = await usdc.approve(PRESALE_ADDR, amount, { gasLimit: 100000 });
  console.log("   Approval TX:", approveTx.hash);
  await approveTx.wait();
  console.log("   ✅ Approved!");

  // Step 4: Check CHRONO balance before
  const chronoBefore = await chrono.balanceOf(wallet.address);
  console.log("\n4. CHRONO balance before:", ethers.formatEther(chronoBefore));

  // Step 5: Buy tokens
  console.log("\n5. Buying CHRONO with 1 USDC...");
  const buyTx = await presale.buyTokens(amount, { gasLimit: 300000 });
  console.log("   Purchase TX:", buyTx.hash);
  await buyTx.wait();
  console.log("   ✅ Purchase complete!");

  // Step 6: Check CHRONO balance after
  const chronoAfter = await chrono.balanceOf(wallet.address);
  console.log("\n6. CHRONO balance after:", ethers.formatEther(chronoAfter));
  console.log("   Received:", ethers.formatEther(chronoAfter - chronoBefore), "CHRONO");

  console.log("\n✅ FULL FLOW SUCCESSFUL!");
}

main().catch(console.error);
