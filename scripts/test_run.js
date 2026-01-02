console.log("Hardhat is working!");
const hre = require("hardhat");
console.log("HRE loaded.");
async function main() {
  console.log("Inside main, network:", hre.network.name);
}
main();
