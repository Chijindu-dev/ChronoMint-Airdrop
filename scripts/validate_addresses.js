import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ethers } = require('ethers');

const ADDRESSES = {
  CHRONO_TOKEN: '0x23A36bFDb3b11220B69e61FEd63D24876a6459af',
  PRESALE: '0x327a94ffd8E2018e1E9B89EABCf05C9A6bdF11F5',
  AIRDROP: '0x5f2AA04dc836EC75bBB5c7926b23fBDa69816271'
};

console.log("Validating addresses...");
for (const [key, addr] of Object.entries(ADDRESSES)) {
    const isValid = ethers.isAddress(addr);
    console.log(`${key}: ${addr} -> Valid? ${isValid}`);
    if (!isValid) {
        console.error(`ERROR: ${key} is invalid! Length: ${addr.length}`);
    }
}
